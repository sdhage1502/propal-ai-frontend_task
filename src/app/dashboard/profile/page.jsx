"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "@/components/Sidebar";
import { validateProfileUpdate } from "@/utils/validation";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ email: "", oldPassword: "", newPassword: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") {
      console.log("Profile: No valid user in localStorage, redirecting to login");
      toast.error("Please log in to access your profile", { duration: 5000 });
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser || !parsedUser.username || !parsedUser.email) {
        console.error("Profile: Invalid user data in localStorage", parsedUser);
        toast.error("Invalid user data. Please log in again.", { duration: 5000 });
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }
      console.log("Profile: Loaded user from localStorage", parsedUser);
      setUser(parsedUser);
      setFormData({ email: parsedUser.email, oldPassword: "", newPassword: "" });
    } catch (error) {
      console.error("Profile: Failed to parse user data", error);
      toast.error("Error loading user data. Please log in again.", { duration: 5000 });
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user) {
      console.error("Profile: No user data available");
      toast.error("No user data. Please log in.", { duration: 5000 });
      setIsLoading(false);
      router.push("/login");
      return;
    }

    const validationErrors = validateProfileUpdate(formData);
    if (validationErrors) {
      console.log("Profile: Validation errors", validationErrors);
      setErrors(validationErrors);
      toast.error("Please fix form errors", { duration: 5000 });
      setIsLoading(false);
      return;
    }

    if (formData.oldPassword && formData.oldPassword !== user.password) {
      console.log("Profile: Incorrect old password");
      setErrors((prev) => ({ ...prev, oldPassword: "Incorrect old password" }));
      toast.error("Incorrect old password", { duration: 5000 });
      setIsLoading(false);
      return;
    }

    const updatedUser = {
      email: formData.email,
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      phone: user.phone || "",
    };

    try {
      console.log("Profile: Sending PUT request", updatedUser);
      const res = await fetch(`/api/users/${user.username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      const data = await res.json();
      console.log("Profile: PUT response", data);

      if (res.ok) {
        const { user: updatedUserResponse } = data;
        localStorage.setItem("user", JSON.stringify(updatedUserResponse));
        setUser(updatedUserResponse);
        setFormData({ email: updatedUserResponse.email, oldPassword: "", newPassword: "" });
        toast.success("Profile updated successfully!", { duration: 5000 });
      } else {
        const errorMsg = typeof data.error === "object" ? Object.values(data.error).join(", ") : data.error;
        console.error("Profile: PUT error", data.error);
        toast.error(errorMsg || "Failed to update profile", { duration: 5000 });
      }
    } catch (error) {
      console.error("Profile: Request error", error);
      toast.error("Something went wrong", { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Profile</h1>
          <p className="mt-2 text-gray-300 text-sm sm:text-base">Update your profile information.</p>
        </div>
        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
          <div className="lg:w-64">
            <Sidebar />
          </div>
          <div className="flex-1">
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">User Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Username</label>
                  <p className="mt-1 text-gray-300 text-sm sm:text-base">{user.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Phone Number</label>
                  <p className="mt-1 text-gray-300 text-sm sm:text-base">{user.phone || "Not provided"}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5CE5BC] ${
                        errors.email ? "border-red-500" : "border-gray-600"
                      }`}
                      required
                      disabled={isLoading}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Old Password</label>
                    <input
                      type="password"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5CE5BC] ${
                        errors.oldPassword ? "border-red-500" : "border-gray-600"
                      }`}
                      disabled={isLoading}
                    />
                    {errors.oldPassword && <p className="mt-1 text-sm text-red-400">{errors.oldPassword}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5CE5BC] ${
                        errors.newPassword ? "border-red-500" : "border-gray-600"
                      }`}
                      disabled={isLoading}
                    />
                    {errors.newPassword && <p className="mt-1 text-sm text-red-400">{errors.newPassword}</p>}
                  </div>
                  <button
                    type="submit"
                    className="w-full p-3 bg-[#5CE5BC] text-white rounded-lg hover:bg-[#92b9ae] disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Profile"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
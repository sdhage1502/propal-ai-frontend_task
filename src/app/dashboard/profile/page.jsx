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
      toast.error("Please log in to access your profile", { duration: 5000 });
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser || !parsedUser.username || !parsedUser.email) {
        toast.error("Invalid user data. Please log in again.", { duration: 5000 });
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }
      setUser(parsedUser);
      setFormData({ email: parsedUser.email, oldPassword: "", newPassword: "" });
    } catch {
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
      toast.error("No user data. Please log in.", { duration: 5000 });
      setIsLoading(false);
      router.push("/login");
      return;
    }

    const validationErrors = validateProfileUpdate(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      toast.error("Please fix form errors", { duration: 5000 });
      setIsLoading(false);
      return;
    }

    if (formData.oldPassword && formData.oldPassword !== user.password) {
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
      const res = await fetch(`/api/users/${user.username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        toast.error("Invalid server response", { duration: 5000 });
        setIsLoading(false);
        return;
      }

      if (res.ok) {
        const { user: updatedUserResponse } = data;
        localStorage.setItem("user", JSON.stringify(updatedUserResponse));
        setUser(updatedUserResponse);
        setFormData({ email: updatedUserResponse.email, oldPassword: "", newPassword: "" });
        toast.success("Profile updated successfully!", { duration: 5000 });
      } else {
        const errorMsg = typeof data.error === "object" ? Object.values(data.error).join(", ") : data.error;
        toast.error(errorMsg || "Failed to update profile", { duration: 5000 });
      }
    } catch {
      toast.error("Something went wrong", { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Profile
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Update your profile information.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
          <div className="lg:w-64">
            <Sidebar />
          </div>
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md transition-colors duration-200">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                User Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username
                  </label>
                  <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    {user.username}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>
                  <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    {user.phone || "Not provided"}
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                      required
                      disabled={isLoading}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Old Password
                    </label>
                    <input
                      type="password"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.oldPassword ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                      disabled={isLoading}
                    />
                    {errors.oldPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.oldPassword}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.newPassword ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                      disabled={isLoading}
                    />
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full p-3 bg-[#5CE5BC] text-white rounded-lg hover:bg-[#92b9ae]  disabled:opacity-50 transition-colors duration-200"
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

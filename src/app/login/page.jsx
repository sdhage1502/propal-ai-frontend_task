"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { validateLogin } from "@/utils/validation";

// Animation variants
const formVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const buttonVariants = { hover: { scale: 1.05 }, tap: { scale: 0.95 } };

export default function Login() {
  const [formData, setFormData] = useState({ loginId: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const validationErrors = validateLogin(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      toast.error("Please fix form errors", { duration: 5000 });
      setIsLoading(false);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch("/api/users", {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to fetch users");
      }
      const users = await res.json();

      const { loginId, password } = formData;
      const isEmail = loginId.includes("@");
      const user = users.find((u) =>
        isEmail ? u.email === loginId && u.password === password : u.username === loginId && u.password === password
      );

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Login successful! Redirecting...", { duration: 5000 });
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        toast.error("Invalid credentials", { duration: 5000 });
      }
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error(`Error: ${error.message}`, { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 pt-20">
      <Toaster position="top-center" />
      <motion.div
        className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="loginId"
              placeholder="Email or Username"
              value={formData.loginId}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5CE5BC] ${
                errors.loginId ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.loginId && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.loginId}</p>}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5CE5BC] ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.password && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.password}</p>}
          </div>
          <motion.button
            type="submit"
            className="w-full p-3 bg-[#5CE5BC] text-white rounded-lg hover:bg-[#92b9ae] disabled:opacity-50"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300 text-sm">
          Don’t have an account? <Link href="/signup" className="text-[#5CE5BC] hover:underline">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
}
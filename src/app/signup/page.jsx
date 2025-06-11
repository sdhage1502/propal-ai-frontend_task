"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { validateSignup } from "@/utils/validation";

// Animation variants
const formVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const buttonVariants = { hover: { scale: 1.05 }, tap: { scale: 1 } };

export default function Signup() {
  const [formData, setFormData] = useState({ username: "", email: "", phone: "", password: "" });
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
    const validationErrors = validateSignup(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      toast.error("Please fix form errors", { duration: 5000 });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending signup request:", formData);
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await res.json();
      } catch (error) {
        console.error("Failed to parse response:", error);
        throw new Error("Invalid server response");
      }

      console.log("POST /api/users: Response", data);

      if (res.ok) {
        toast.success("Signup successful! Redirecting to login...", { duration: 5000 });
        setTimeout(() => router.push("/login"), 500);
      } else {
        const errorMsg = typeof data.error === "object" ? Object.values(data.error).join(", ") : data.error;
        toast.error(errorMsg || "Signup failed", { duration: 5000 });
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error.name === "AbortError") {
        toast.error("Request timed out. Please try again.", { duration: 5000 });
      } else {
        toast.error(`Error: ${error.message}`, { duration: 5000 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-20">
      <Toaster position="top-center" />
      <motion.div
        className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["username", "email", "phone", "password"].map((field) => (
            <div key={field}>
              <input
                type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1) + (field === "phone" ? " (optional)" : "")}
                value={formData[field]}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5CE5BC] ${
                  errors[field] ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
                required={field !== "phone"}
                disabled={isLoading}
              />
              {errors[field] && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[field]}</p>}
            </div>
          ))}
          <motion.button
            type="submit"
            className={`w-full p-3 bg-[#${isLoading ? "gray-600" : "5CE5BC"}] text-white rounded-md hover:bg-[#92b9AE] transition-colors ${
              isLoading ? "cursor-not-allowed" : ""
            }`}
            variants={buttonVariants}
            whileHover={isLoading ? {} : "hover"}
            whileTap={isLoading ? {} : "tap"}
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </motion.button>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          Already have an account? <Link href="/login" className="text-[#5CE5BC] hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
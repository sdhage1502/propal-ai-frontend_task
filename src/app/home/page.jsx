// src/app/home/page.jsx
"use client";
import { motion } from "framer-motion";
import { buttonVariants } from "@/utils/animations";
import Link from "next/link";

export default function HomePage() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
        Welcome to proPAL AI
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        Indigenous Voice AI for Indian Businesses
      </p>
      <Link href="/signup">
        <motion.button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Sign Up
        </motion.button>
      </Link>
    </motion.div>
  );
}

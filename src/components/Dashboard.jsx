"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Animation variants for the dashboard content
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <motion.div
      className=" bg-gray-100 dark:bg-gray-900 ml-64 p-6 flex-1 min-h-screen"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        Dashboard
      </h1>
      {user ? (
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Welcome back, {user.username}! This is your dashboard.
        </p>
      ) : (
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Loading user data...
        </p>
      )}
    </motion.div>
  );
}
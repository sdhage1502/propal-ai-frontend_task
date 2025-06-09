"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from '@/utils/ThemeToggle';

// Animation variants for the navbar
const navbarVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Animation variants for the theme toggle button
const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

export default function Navbar() {
  return (
    <motion.nav
      className="bg-white dark:bg-gray-800 shadow-md"
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between h-16 items-center">
          {/* Left side: Brand and Navigation Links */}
          <div className="flex items-center">
            <Link href="/home" className="text-xl font-bold text-gray-800 dark:text-white">
              proPAL AI
            </Link>
            <div className="ml-10 flex space-x-4">
              <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
             
            </div>
          </div>

          {/* Right side: Theme Toggle */}
          <div className="flex items-center">
            <motion.div
              className="ml-4"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

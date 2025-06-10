"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import ThemeToggle from "../utils/ThemeToggle";
import { Menu } from "lucide-react";

// Animation variants for the navbar
const navbarVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Animation variants for mobile menu
const menuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50"
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side: Brand and Links */}
          <div className="flex items-center">
            <Link
              href="/home"
              className="text-xl font-bold text-gray-800 dark:text-white"
            >
              proPAL AI
            </Link>
            <div className="hidden md:flex md:ml-10 md:space-x-4">
              <Link
                href="/home"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/signup"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Right side: Theme Toggle and Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="md:hidden"
          variants={menuVariants}
          initial="hidden"
          animate={isMenuOpen ? "visible" : "hidden"}
        >
          <div className="flex flex-col space-y-2 pb-4">
            <Link
              href="/home"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link
              href="/signup"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
              onClick={toggleMenu}
            >
              Sign Up
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
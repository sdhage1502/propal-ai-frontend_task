"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const isActive = (path) => pathname === path;

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Desktop Sidebar */}
      <div className="hidden md:block p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Navigation
        </h2>
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/dashboard")
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/profile"
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/dashboard/profile")
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/agent"
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/dashboard/agent")
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Agent
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <div className="p-4">
          <button
            onClick={toggleMenu}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <motion.div
          variants={mobileMenuVariants}
          initial="hidden"
          animate={isMenuOpen ? "visible" : "hidden"}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Navigation
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/dashboard")
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/profile"
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/dashboard/profile")
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/agent"
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/dashboard/agent")
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                  onClick={toggleMenu}
                >
                  Agent
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
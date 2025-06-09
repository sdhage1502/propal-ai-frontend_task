"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Animation variants for the sidebar
const sidebarVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
};

// Animation variants for links
const linkVariants = {
  hover: { x: 10, transition: { duration: 0.2 } },
};

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <motion.div
      className="w-64 h-screen bg-gray-50 dark:bg-gray-800 p-5 shadow-lg fixed top-0 left-0"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col h-full pt-4 ">
        {/* Sidebar Header */}
        

        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <motion.div variants={linkVariants} whileHover="hover">
               
              </motion.div>
            </li>
            <li>
              <motion.div variants={linkVariants} whileHover="hover">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                >
                  Profile
                </Link>
              </motion.div>
            </li>
            <li>
              <motion.div variants={linkVariants} whileHover="hover">
                <Link
                  href="/agent"
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                >
                  Agent
                </Link>
              </motion.div>
            </li>
            <li>
              <motion.div variants={linkVariants} whileHover="hover">
                <Link
                  href="/summary"
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                >
                  Summary Card
                </Link>
              </motion.div>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto">
          <motion.button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
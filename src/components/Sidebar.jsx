"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes"; 
import toast from "react-hot-toast";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();


  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

const handleLogout = () => {
  toast(
    (t) => (
      <div className="flex flex-col items-center space-y-3">
        <span className="text-gray-800 dark:text-gray-200 text-sm">
          Are you sure you want to log out?
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              localStorage.removeItem("user");
              router.push("/login");
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 bg-[#5CE5BC] text-white rounded-md text-xs hover:bg-[#9df4da]"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-xs hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: "top-center",
      style: {
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#ffffff" : "#1f2937",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
      className: "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200",
    }
  );
};



  const isActive = (path) => pathname === path;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Mobile and Tablet Sidebar */}
      <div className="lg:hidden p-2">
        <div className="flex justify-between gap-2">
          <Link
            href="/dashboard"
            className={`flex-1 text-center px-2 py-1 rounded-md text-xs font-medium ${
              isActive("/dashboard")
                ? "bg-[#5CE5BC] text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#5CE5BC]"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/profile"
            className={`flex-1 text-center px-2 py-1 rounded-md text-xs font-medium ${
              isActive("/dashboard/profile")
                ? "bg-[#5CE5BC] text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#5CE5BC]"
            }`}
          >
            Profile
          </Link>
          <Link
            href="/dashboard/agent"
            className={`flex-1 text-center px-2 py-1 rounded-md text-xs font-medium ${
              isActive("/dashboard/agent")
                ? "bg-[#5CE5BC] text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#5CE5BC]"
            }`}
          >
            Agent
          </Link>
          <button
            onClick={handleLogout}
            className="flex-1 text-center px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 rounded-md text-xs font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Desktop Sidebar*/}
      <div className="hidden lg:block p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Navigation</h2>
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/dashboard")
                  ? "bg-[#5CE5BC] text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#5CE5BC]"
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
                  ? "bg-[#5CE5BC] text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#5CE5BC]"
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
                  ? "bg-[#5CE5BC] text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#5CE5BC]"
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
    </div>
  );
}
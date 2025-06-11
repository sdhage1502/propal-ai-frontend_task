import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  // 🔒 Cleanup toast when navigating
  useEffect(() => {
    toast.dismiss();
  }, [pathname]);

  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    toast.custom((t) => (
      <div className="p-4 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 w-[280px]">
        <p className="mb-3 text-center">Are you sure you want to log out?</p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={() => {
              localStorage.removeItem("user");
              router.push("/login");
              toast.dismiss(t.id);
            }}
            className="px-4 py-1 bg-[#5CE5BC] text-white text-xs rounded hover:bg-[#92b9ae]"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs rounded hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Mobile Sidebar */}
      <div className="lg:hidden p-2">
        <div className="flex justify-between gap-2">
          {[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/dashboard/profile", label: "Profile" },
            { href: "/dashboard/agent", label: "Agent" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex-1 text-center px-2 py-1 rounded-md text-xs font-medium ${isActive(href)
                  ? "bg-[#5CE5BC] text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#5CE5BC]"
                }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex-1 text-center px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 rounded-md text-xs font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Navigation</h2>
        <ul className="space-y-2">
          {[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/dashboard/profile", label: "Profile" },
            { href: "/dashboard/agent", label: "Agent" },
          ].map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive(href)
                    ? "bg-[#5CE5BC] text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#5CE5BC]"
                  }`}
              >
                {label}
              </Link>
            </li>
          ))}
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

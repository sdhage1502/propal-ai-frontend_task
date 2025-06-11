"use client";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "../utils/ThemeToggle";
import { Menu } from "lucide-react";
import Image from "next/image";
import logo from "../../public/logo.webp";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/signup", label: "Sign Up" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo + Desktop Nav */}
          <div className="flex items-center">
            <Image
              src={logo}
              alt="Logo"
              width={132}
              height={132}
              priority
              style={{ objectFit: "contain" }}
            />
            <div className="hidden md:flex md:ml-10 md:space-x-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-gray-600 dark:text-gray-300 hover:text-[#5CE5BC] dark:hover:text-[#9df4da] px-3 py-2 rounded-md text-sm font-medium"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-600 dark:text-gray-300 hover:text-[#5CE5BC] dark:hover:text-[#9df4da] focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col space-y-2 pb-4 px-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-gray-600 dark:text-gray-300 hover:text-[#5CE5BC] dark:hover:text-[#9df4da] px-3 py-2 rounded-md text-sm font-medium"
                onClick={toggleMenu}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

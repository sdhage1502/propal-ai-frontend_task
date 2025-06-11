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

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* logo */}
          <div className="flex items-center">
            <Image
              src={logo}
              alt="Logo"
              width={132}
              height={132}
              priority
              style={{ objectFit: "contain" }}
              className=""
            />

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:ml-10 md:space-x-4">
              <Link
                href="/home"
                className="text-gray-600 dark:text-gray-300 hover:text-[#5CE5BC] dark:hover:text-[#9df4da] px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:text-[#5CE5BC] dark:hover:text-[#9df4da] px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/signup"
                className="text-gray-600 dark:text-gray-300 hover:text-[#5CE5BC] dark:hover:text-[#9df4da] px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Theme Toggle and hamburger Menu Button */}
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

        {/* Mobile Menu */}
        <div className="md:hidden">
          {isMenuOpen && (
            <div className="flex flex-col space-y-2 pb-4 px-3">
              <Link
                href="/home"
                className="text-gray-600 dark:text-gray-300 hover:text-[#5CE5BC] dark:hover:text-[#9df4da] px-3 py-2 rounded-md text-sm font-medium"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:text-[#5CE5BC] dark:hover:text-[#9df4da] px-3 py-2 rounded-md text-sm font-medium"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
              <Link
                href="/signup"
                className="text-gray-600 dark:text-gray-300 hover:text-[#5CE5BC] dark:hover:text-[#9df4da] px-3 py-2 rounded-md text-sm font-medium"
                onClick={toggleMenu}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
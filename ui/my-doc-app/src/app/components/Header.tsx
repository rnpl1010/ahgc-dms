"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useLogout from "@/components/Logout";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const logout = useLogout();

  // Close when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Hide Header on login page
  if (pathname === "/login" || pathname === "/not-found") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-black shadow-md">
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 gap-4 sm:gap-0">
        {/* Left: Logo */}
        <Link href="/home" className="flex items-center gap-2">
          <Image
            className="cursor-pointer dark:invert"
            src="/images/AHGC-LOGO.png"
            alt="Al Hamad Group of Companies Logo"
            width={200}
            height={60}
            priority
          />
        </Link>

        {/* Right: Nav + User */}
        <div className="flex items-center gap-6 relative">
          <nav className="relative flex flex-wrap justify-center sm:justify-end items-center gap-4 sm:gap-6 text-gray-800 dark:text-gray-200 font-medium text-sm sm:text-base">
            {/* Manage Documents Dropdown */}
            <div className="relative group">
              <button className="hover:text-red-600 transition-colors">
                Manage Documents
              </button>

              {/* Dropdown Menu */}
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  href="/view-document"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 rounded-b-lg"
                >
                  View Documents
                </Link>
                <Link
                  href="/download-document"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 rounded-t-lg"
                >
                  Download Documents
                </Link>
                <Link
                  href="/upload-document"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 rounded-b-lg"
                >
                  Upload Documents
                </Link>
              </div>
            </div>

            {/* Other Links */}
            <span className="hidden sm:inline text-gray-400 select-none">
              |
            </span>
            <Link href="#" className="text-gray-400 cursor-not-allowed">
              To be Developed
            </Link>
            <span className="hidden sm:inline text-gray-400 select-none">
              |
            </span>
            <Link href="#" className="text-gray-400 cursor-not-allowed">
              To be Developed
            </Link>
          </nav>

          {/* User Icon + Dropdown */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setIsMenuOpen((s) => !s)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="User Menu"
            >
              <Image
                className="dark:invert"
                src="/images/user-icon.png"
                alt="User Icon"
                width={30}
                height={30}
                priority
              />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout(); // call the logout function from the hook
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

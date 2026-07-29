"use client";

import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import Header from "./components/Header";
import SessionTimeOut from "./components/SessionTimeOut"; // ✅ added import
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Only show header on known pages
  const knownPaths = [
    "/",
    "/login",
    "/home",
    "/upload-document",
    "/view-document",
    "/download-document",
    "/test-connection",
  ];
  const hideHeader = !knownPaths.includes(pathname);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen w-full bg-zinc-50 font-sans dark:bg-black flex flex-col`}
      >
        {/* ✅ Run session timeout globally except on the login page */}
        {pathname !== "/login" && pathname !== "/create-account" && (
          <SessionTimeOut timeoutMinutes={15} />
        )}

        {!hideHeader && <Header />}
        <main className="flex-1 flex items-center justify-center bg-white dark:bg-black">
          {children}
        </main>
      </body>
    </html>
  );
}

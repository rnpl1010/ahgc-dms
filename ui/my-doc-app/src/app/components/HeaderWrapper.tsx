"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderWrapper() {
  const pathname = usePathname();
  const hideHeader = pathname === "/login" || pathname === "/404";

  return !hideHeader ? <Header /> : null;
}

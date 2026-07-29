"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // check auth
    if (!token) {
      router.push("/login");
    }
  }, []);

  return null;
}


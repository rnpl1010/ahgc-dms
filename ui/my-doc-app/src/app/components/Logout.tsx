"use client";

import { useRouter } from "next/navigation";

export default function useLogout() {
  const router = useRouter();

  const logout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      await fetch("http://localhost:8083/doc-api/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      router.push("/login");
    }
  };

  return logout;
}

"use client";

import { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import useLogout from "./Logout"; // adjust path if needed

interface SessionTimeOutProps {
  timeoutMinutes?: number; // 👈 optional prop with default value
}

export default function SessionTimeOut({ timeoutMinutes = 15 }: SessionTimeOutProps) {
  const router = useRouter();
  const logout = useLogout();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Convert minutes to milliseconds
  const TIMEOUT_DURATION = timeoutMinutes * 60 * 1000;

  useEffect(() => {
    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        await Swal.fire("Session Expired", "You were logged out due to inactivity.", "warning");
        await logout();
      }, TIMEOUT_DURATION);
    };

    const activityEvents = ["mousemove", "keydown", "scroll", "click"];
    activityEvents.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      activityEvents.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [TIMEOUT_DURATION, logout]);

  return null;
}

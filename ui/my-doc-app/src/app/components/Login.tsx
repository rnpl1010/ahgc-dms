"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault(); // prevent page reload on form submit

    if (!username || !password) {
      Swal.fire("Error", "Please enter both username and password.", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8083/doc-api/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, passwordHash: password }),
      });

      if (!res.ok) {
        if (res.status === 401)
          Swal.fire("Error", "Invalid credentials.", "error");
        else Swal.fire("Error", "Server error occurred.", "error");
        return;
      }

      const data = await res.json();

      if (data.status === "success" && data.token) {
        localStorage.setItem("authToken", data.token);

        Swal.fire("Success", "Login successful!", "success").then(() => {
          router.push("/home");
        });
      } else {
        Swal.fire("Error", "Invalid credentials.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to connect to backend.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 dark:from-black dark:via-gray-900 dark:to-black overflow-hidden">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-gray-800 dark:text-gray-100 text-center">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors text-lg shadow-md hover:shadow-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/create-account")}
            className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-xl transition-colors text-lg shadow-md hover:shadow-lg"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function CreateAccountPage() {
  const [employeeID, setEmployeeID] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const [employeeIDError, setEmployeeIDError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();

  // Live validation handlers
  const handleEmployeeIDChange = (value: string) => {
    setEmployeeID(value);
    setEmployeeIDError(value ? "" : "Employee ID is required");
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameError(value ? "" : "Username is required");
  };

  const isValidEmail = (email: string) => {
    const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/;
    if (!basicRegex.test(email)) return false;

    const parts = email.split("@");
    if (parts.length !== 2) return false;

    const domainParts = parts[1].split(".");
    if (domainParts.length > 3) return false; // max 2 dots in domain
    if (domainParts.some((p) => p.length < 2)) return false;

    return true;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (!value) setEmailError("Email is required");
    else if (!isValidEmail(value))
      setEmailError("Please enter a valid email address");
    else setEmailError("");
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(value ? "" : "Password is required");
  };

  const handleCreateAccount = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    // final validation before submit
    if (
      !employeeID ||
      !username ||
      !email ||
      !password ||
      employeeIDError ||
      usernameError ||
      emailError ||
      passwordError
    ) {
      Swal.fire("Error", "Please fix the errors before submitting", "error");
      return;
    }

    setCreating(true);

    try {
      const res = await fetch(
        "http://localhost:8083/doc-api/api/users/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeID,
            username,
            email,
            passwordHash: password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.status !== 400) {
        Swal.fire("Success", "Account created successfully!", "success").then(
          () => {
            router.push("/login");
          }
        );
      } else {
        Swal.fire(
          "Error",
          data.message || "Failed to create account.",
          "error"
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to connect to backend.", "error");
    } finally {
      setCreating(false);
    }
  };

  // Button disabled if any error or empty fields
  const isFormInvalid =
    !employeeID ||
    !username ||
    !email ||
    !password ||
    !!employeeIDError ||
    !!usernameError ||
    !!emailError ||
    !!passwordError;


  const inputClass = (error: string) =>
    `w-full border rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-colors ${
      error
        ? "border-red-500 focus:ring-red-500"
        : "border-blue-400 focus:ring-blue-500"
    }`;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 dark:from-black dark:via-gray-900 dark:to-black overflow-hidden">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-gray-800 dark:text-gray-100 text-center">
          Create Account
        </h1>

        <form onSubmit={handleCreateAccount} className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
              Employee ID
            </label>
            <input
              type="text"
              value={employeeID}
              onChange={(e) => handleEmployeeIDChange(e.target.value)}
              className={inputClass(employeeIDError)}
            />
            {employeeIDError && (
              <p className="text-red-500 text-sm mt-1">{employeeIDError}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className={inputClass(usernameError)}
            />
            {usernameError && (
              <p className="text-red-500 text-sm mt-1">{usernameError}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={inputClass(emailError)}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={inputClass(passwordError)}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={creating || isFormInvalid}
            className={`w-full ${
              creating || isFormInvalid
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            } text-white font-semibold py-3 rounded-xl transition-colors text-lg shadow-md hover:shadow-lg`}
          >
            {creating ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

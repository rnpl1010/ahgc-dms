"use client";

import AuthGuard from "../components/AuthGuard";

export default function HomePage() {
  return (
    <AuthGuard>
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">
          Welcome to Al Hamad Group of Companies!
        </h1>
        <p className="text-gray-600">
          This is the Document Management Portal developed for AHGC.
        </p>
      </div>
    </AuthGuard>
  );
}

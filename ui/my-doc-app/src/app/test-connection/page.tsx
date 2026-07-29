"use client";

import { useEffect, useState } from "react";

interface VersionInfo {
  version: string;
  dateUpdated: string;
}

export default function TestConnectionPage() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8083/doc-api/api/version")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch version");
        return res.json();
      })
      .then((data: VersionInfo) => setVersionInfo(data))
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to fetch version info from backend");
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Backend Version Info</h1>

      {error && <p className="text-red-600">{error}</p>}

      {versionInfo ? (
        <div className="border p-4 rounded space-y-2 bg-gray-50 dark:bg-gray-800">
          <p>
            <strong>Version:</strong> {versionInfo.version}
          </p>
          <p>
            <strong>Last Updated:</strong> {versionInfo.dateUpdated}
          </p>
        </div>
      ) : (
        !error && <p>Loading version info...</p>
      )}
    </div>
  );
}

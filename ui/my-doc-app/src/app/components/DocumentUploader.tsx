"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface CompanyModel {
  shortName: string;
  longName: string;
}

interface DocumentModel {
  documentPath: string;
  documentName: string;
  fileType: string;
  fileSize: string;
  lastModified: string;
  status: number;
  message: string;
  company: string;
}

const UploadDocuments = () => {
  const [companies, setCompanies] = useState<CompanyModel[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadResponse, setUploadResponse] = useState<DocumentModel | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch companies
  useEffect(() => {
    fetch("http://localhost:8083/doc-api/api/companies")
      .then((res) => res.json())
      .then((data: CompanyModel[]) => setCompanies(data))
      .catch((err) => {
        console.error("Error fetching companies:", err);
        Swal.fire("Error", "Failed to load company list.", "error");
      });
  }, []);

  // Handle file select + preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Upload handler
  const handleUpload = async () => {
    if (!selectedCompany || !selectedFile) {
      Swal.fire("Missing Information", "Please select a company and file first!", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("company", selectedCompany);

    setUploading(true);
    try {
      const res = await fetch("http://localhost:8083/doc-api/api/files/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setUploadResponse(data);

      if (data.status === 200) {
        Swal.fire({
          title: "Upload Successful 🎉",
          text: `${data.documentName} uploaded successfully.`,
          icon: "success",
          confirmButtonColor: "#d33",
        });
      } else {
        Swal.fire("Upload Failed", data.message || "Something went wrong.", "error");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      Swal.fire("Error", "Upload failed. Check the console for details.", "error");
    } finally {
      setUploading(false);
    }
  };

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-black px-6 sm:px-12 py-8">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-8">
        Document Uploader
      </h1>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md w-full p-6 flex flex-col sm:flex-row gap-6">
        {/* Left Column */}
        <div className="flex flex-col w-full sm:w-1/3 gap-4">
          {/* Company Dropdown */}
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Choose a Subsidiary Company
            </label>
            <select
              id="company"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="">-- Select a Company --</option>
              {companies.map((c) => (
                <option key={c.shortName} value={c.shortName}>
                  {c.longName}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Select a File
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="w-full text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`w-full ${
              uploading ? "bg-gray-400" : "bg-gray-600 hover:bg-red-700"
            } text-white font-medium py-2 rounded-lg transition-colors mt-2`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* Right Column: Live Preview */}
        {(previewUrl || uploadResponse) && (
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col h-[80vh]">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              Preview: {selectedFile?.name || uploadResponse?.documentName}
            </h3>
            <div className="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              {previewUrl ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-full"
                  title="File Preview"
                />
              ) : uploadResponse?.fileType === "application/pdf" ? (
                <iframe
                  src={uploadResponse.documentPath}
                  className="w-full h-full"
                  title={uploadResponse.documentName}
                />
              ) : (
                <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                  Preview not available for this file type.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadDocuments;

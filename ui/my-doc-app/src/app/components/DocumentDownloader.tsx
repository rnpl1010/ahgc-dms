"use client";

import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";

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

const DocumentDownloader = () => {
  const [documents, setDocuments] = useState<DocumentModel[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDocument, setSelectedDocument] = useState("");
  const [downloading, setDownloading] = useState(false);

  // Fetch documents from backend
  useEffect(() => {
    fetch("http://localhost:8083/doc-api/api/files/document-list")
      .then((res) => res.json())
      .then((data: DocumentModel[]) => {
        setDocuments(data);
        const uniqueCompanies = Array.from(new Set(data.map((d) => d.company)));
        setCompanies(uniqueCompanies);
      })
      .catch((err) => {
        console.error("Error fetching documents:", err);
        Swal.fire("Error", "Failed to fetch document list.", "error");
      });
  }, []);

  const filteredDocs = useMemo(() => {
    if (!selectedCompany) return [];
    return documents.filter((d) => d.company === selectedCompany);
  }, [selectedCompany, documents]);

  const buildPreviewUrl = (filename: string) =>
    `http://localhost:8083/doc-api/api/files/preview/${encodeURIComponent(filename)}`;

  const buildDownloadUrl = (filename: string) =>
    `http://localhost:8083/doc-api/api/files/download/${encodeURIComponent(filename)}`;

  const handleDownload = async () => {
    if (!selectedCompany || !selectedDocument) {
      Swal.fire("Missing Information", "Please select a company and a document!", "warning");
      return;
    }

    try {
      setDownloading(true);

      const response = await fetch(buildDownloadUrl(selectedDocument));
      if (!response.ok) {
        Swal.fire("Error", `Failed to download ${selectedDocument}.`, "error");
        return;
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = selectedDocument;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      Swal.fire({
        title: "Download Successful 🎉",
        text: `${selectedDocument} has been downloaded successfully.`,
        icon: "success",
        confirmButtonColor: "#d33",
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      Swal.fire("Error", "Something went wrong during download.", "error");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-black px-6 sm:px-12 py-8 flex flex-col">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-8">
        Document Downloader
      </h1>

      <div className="flex flex-col sm:flex-row gap-6 flex-1">
        {/* Left Column */}
        <div className="flex flex-col w-full sm:w-1/3 gap-4">
          {/* Company Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Choose a Subsidiary Company
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setSelectedDocument("");
              }}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="">-- Select a Company --</option>
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Document Dropdown */}
          {selectedCompany && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select a Document
              </label>
              <select
                value={selectedDocument}
                onChange={(e) => setSelectedDocument(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="">-- Select a Document --</option>
                {filteredDocs.map((doc) => (
                  <option key={doc.documentName} value={doc.documentName}>
                    {doc.documentName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`w-full ${
              downloading ? "bg-gray-400" : "bg-gray-600 hover:bg-red-700"
            } text-white font-medium py-2 rounded-lg transition-colors mt-2`}
          >
            {downloading ? "Downloading..." : "Download"}
          </button>
        </div>

        {/* Right Column: Preview */}
        {selectedDocument && (
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              Preview: {selectedDocument}
            </h3>
            <div className="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              {(() => {
                const doc = filteredDocs.find(
                  (d) => d.documentName === selectedDocument
                );
                if (!doc)
                  return (
                    <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                      Document not found.
                    </div>
                  );

                if (doc.fileType === "application/pdf") {
                  return (
                    <iframe
                      src={buildPreviewUrl(doc.documentName)}
                      className="w-full h-full"
                      title={doc.documentName}
                    />
                  );
                } else {
                  return (
                    <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                      Preview not available for this file type.
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentDownloader;

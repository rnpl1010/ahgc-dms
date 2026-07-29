"use client";

import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { Trash2, X, Search, Pencil } from "lucide-react";

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

const ViewDocuments = () => {
  const [documents, setDocuments] = useState<DocumentModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<DocumentModel | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const buildPreviewUrl = (filename: string) =>
    `http://localhost:8083/doc-api/api/files/preview/${encodeURIComponent(
      filename
    )}`;

  useEffect(() => {
    fetch("http://localhost:8083/doc-api/api/files/document-list")
      .then((res) => res.json())
      .then((data: DocumentModel[]) => setDocuments(data))
      .catch((err) => {
        console.error("Error fetching documents:", err);
        Swal.fire("Error", "Failed to fetch document list.", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredDocuments = useMemo(() => {
    if (!searchTerm) return documents;
    const term = searchTerm.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.documentName.toLowerCase().includes(term) ||
        doc.company.toLowerCase().includes(term) ||
        doc.fileType.toLowerCase().includes(term)
    );
  }, [documents, searchTerm]);

  const fileTypeMap: Record<string, string> = {
    "application/pdf": "PDF",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  };

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-black px-6 sm:px-12 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100">
          View All Documents
        </h1>

        {/* Search Icon & Input */}
        <div className="relative">
          <button
            onClick={() => setSearchOpen((prev) => !prev)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Search size={20} />
          </button>

          {searchOpen && (
            <input
              type="text"
              autoFocus
              placeholder="Search document name, company, file type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="absolute right-0 top-0 w-64 sm:w-95 border border-gray-300 dark:border-gray-700 rounded-lg p-2 pl-8 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
            />
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md w-full p-6 overflow-x-auto">
        {loading ? (
          <div className="text-center text-gray-600 dark:text-gray-300 py-10">
            Loading documents...
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-300 py-10">
            No documents found.
          </div>
        ) : (
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-left">
                <th className="px-4 py-3 rounded-tl-lg">No.</th>
                <th className="px-4 py-3">Document Name</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">File Type</th>
                <th className="px-4 py-3">Last Modified</th>
                <th className="px-4 py-3 rounded-tr-lg text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {doc.documentName}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-300">
                    {doc.company}
                  </td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-300">
                    {fileTypeMap[doc.fileType] ?? doc.fileType}
                  </td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-300">
                    {new Date(doc.lastModified).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-center gap-3">
                      {/* ✏️ Edit / Rename Button */}
                      <div className="relative group">
                        <button
                          onClick={() => {
                            Swal.fire(
                              "Edit Clicked",
                              `Editing "${doc.documentName}" feature coming soon.`,
                              "info"
                            );
                          }}
                          className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full p-2"
                        >
                          <Pencil size={18} />
                        </button>
                        {/* Tooltip */}
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs text-white bg-gray-800 dark:bg-gray-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Rename
                        </span>
                      </div>

                      {/* 🗑️ Delete Button */}
                      <div className="relative group">
                        <button
                          onClick={async () => {
                            if (!doc) return;
                            const result = await Swal.fire({
                              title: "Are you sure?",
                              text: `Do you want to delete "${doc.documentName}"?`,
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Yes, delete it!",
                              cancelButtonText: "Cancel",
                              reverseButtons: true,
                            });

                            if (result.isConfirmed) {
                              try {
                                const encodedName = encodeURIComponent(
                                  doc.documentName
                                );
                                const res = await fetch(
                                  `http://localhost:8083/doc-api/api/files/delete/${encodedName}`,
                                  { method: "GET" }
                                );

                                if (res.ok) {
                                  setDocuments((prev) =>
                                    prev.filter(
                                      (d) => d.documentName !== doc.documentName
                                    )
                                  );
                                  Swal.fire(
                                    "Deleted!",
                                    "The document has been deleted.",
                                    "success"
                                  );
                                } else {
                                  Swal.fire(
                                    "Error",
                                    "Failed to delete document.",
                                    "error"
                                  );
                                }
                              } catch (err) {
                                console.error(err);
                                Swal.fire(
                                  "Error",
                                  "Failed to delete document.",
                                  "error"
                                );
                              }
                            }
                          }}
                          className="text-red-600 hover:text-red-800 dark:hover:text-red-400 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                        {/* Tooltip */}
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs text-white bg-gray-800 dark:bg-gray-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Delete
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Preview */}
      {selectedDoc && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col relative border border-gray-300 dark:border-gray-700">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-t-2xl">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                {selectedDoc.documentName}
              </h2>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-950 rounded-b-2xl">
              {selectedDoc.fileType === "application/pdf" ? (
                <iframe
                  src={buildPreviewUrl(selectedDoc.documentName)}
                  className="w-full h-full rounded-b-2xl"
                  title={selectedDoc.documentName}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-600 dark:text-gray-300">
                  Preview not available for this file type.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDocuments;

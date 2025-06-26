import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Button } from "primereact/button";

const DocumentList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const params = new URLSearchParams(location.search);
  const category = params.get("category") || "Documents";

  // State for documents and loading
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set the page title dynamically
  useEffect(() => {
    if (outletContext && outletContext.setPageTitle) {
      outletContext.setPageTitle(`${category} Documents`);
    }
  }, [outletContext, category]);

  // Fetch documents from backend
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/crew/documents?category=${encodeURIComponent(category)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDocuments(data.documents || []);
        } else {
          setError("Failed to fetch documents");
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError("Error fetching documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [category]);

  // State for modals/dialogs
  const [viewDoc, setViewDoc] = useState(null); // document object or null
  const [deleteDoc, setDeleteDoc] = useState(null); // document object or null

  // Handle document deletion
  const handleDeleteDocument = async (documentId) => {
    try {
      const response = await fetch(`/api/crew/documents/${documentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        // Remove the document from the list
        setDocuments(documents.filter((doc) => doc._id !== documentId));
        setDeleteDoc(null);
      } else {
        alert("Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Error deleting document");
    }
  };

  if (loading) {
    return (
      <div className="p-6 w-full max-w-5xl mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 w-full max-w-5xl mx-auto">
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <Button
            label="Retry"
            className="mt-4"
            onClick={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-5xl mx-auto">
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No documents found
            </h3>
            <p className="text-gray-500 mb-4">
              No documents have been uploaded for the "{category}" category yet.
            </p>
            <Button
              label="Go Back"
              icon="pi pi-arrow-left"
              onClick={() => navigate("/crew/document-management")}
            />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th
                  className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  colSpan={3}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc._id} className="hover:bg-blue-50 transition">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {doc.originalName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                  </td>
                  <td className="px-2 py-3 text-center">
                    <Button
                      icon="pi pi-eye"
                      className="p-button-text"
                      onClick={() => setViewDoc(doc)}
                      tooltip="View"
                    />
                  </td>
                  <td className="px-2 py-3 text-center">
                    <Button
                      icon="pi pi-trash"
                      className="p-button-text p-button-danger"
                      onClick={() => setDeleteDoc(doc)}
                      tooltip="Delete"
                    />
                  </td>
                  <td className="px-2 py-3 text-center">
                    <Button
                      icon="pi pi-download"
                      className="p-button-text"
                      onClick={() => window.open(doc.fileUrl, "_blank")}
                      tooltip="Download"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Document Modal */}
      {viewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setViewDoc(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">{viewDoc.originalName}</h2>
            <div className="mb-2 text-gray-600 text-sm">
              <span className="mr-4">
                Uploaded: {new Date(viewDoc.uploadedAt).toLocaleDateString()}
              </span>
              <span>
                Size: {(viewDoc.fileSize / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <div className="mb-4">
              {viewDoc.mimeType && viewDoc.mimeType.startsWith("image/") ? (
                <img
                  src={viewDoc.fileUrl}
                  alt={viewDoc.originalName}
                  className="max-w-full max-h-80 rounded border"
                />
              ) : viewDoc.mimeType === "application/pdf" ? (
                <iframe
                  src={viewDoc.fileUrl}
                  title={viewDoc.originalName}
                  className="w-full h-80 border rounded"
                />
              ) : (
                <div className="p-4 bg-gray-100 rounded text-gray-700">
                  <span>No preview available for this file type.</span>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Button
                label="Download"
                icon="pi pi-download"
                onClick={() => window.open(viewDoc.fileUrl, "_blank")}
              />
              <Button
                label="Delete"
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => {
                  setDeleteDoc(viewDoc);
                  setViewDoc(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
            <h2 className="text-lg font-bold mb-4">Delete Document</h2>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteDoc.originalName}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <Button
                label="Cancel"
                className="p-button-text"
                onClick={() => setDeleteDoc(null)}
              />
              <Button
                label="Delete"
                className="p-button-danger"
                onClick={() => handleDeleteDocument(deleteDoc._id)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;

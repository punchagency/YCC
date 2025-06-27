import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

// Dummy data for demonstration
const dummyDocuments = [
  {
    id: 1,
    name: "ENG1 Medical Certificate.pdf",
    uploaded: "2024-06-01",
    size: "1.2 MB",
    url: "#",
    type: "pdf",
  },
  {
    id: 2,
    name: "Vaccination Card.jpg",
    uploaded: "2024-05-15",
    size: "350 KB",
    url: "#",
    type: "image",
  },
  {
    id: 3,
    name: "Medical Report.docx",
    uploaded: "2024-04-20",
    size: "800 KB",
    url: "#",
    type: "docx",
  },
];

const DocumentView = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  // In a real app, fetch the document by ID
  const doc = dummyDocuments.find((d) => String(d.id) === String(documentId));

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold mb-4">Document Not Found</h2>
        <Button
          label="Back"
          icon="pi pi-arrow-left"
          onClick={() => navigate(-1)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <Button
        label="Back"
        icon="pi pi-arrow-left"
        className="mb-6"
        onClick={() => navigate(-1)}
      />
      <h2 className="text-2xl font-bold mb-2">{doc.name}</h2>
      <div className="mb-4 text-gray-600 text-sm">
        <span className="mr-4">Uploaded: {doc.uploaded}</span>
        <span>Size: {doc.size}</span>
      </div>
      <div className="mb-6">
        {doc.type === "image" ? (
          <img
            src={doc.url}
            alt={doc.name}
            className="max-w-full max-h-96 rounded border"
          />
        ) : doc.type === "pdf" ? (
          <iframe
            src={doc.url}
            title={doc.name}
            className="w-full h-96 border rounded"
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
          onClick={() => window.open(doc.url, "_blank")}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={() => alert("Delete document")}
        />
      </div>
    </div>
  );
};

export default DocumentView;

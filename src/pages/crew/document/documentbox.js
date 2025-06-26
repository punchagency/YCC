import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import card from "../../../assets/images/crew/card.png";

const documentTypeList = [
  "Identification",
  "Certificates & Licenses",
  "Medical",
  "Employment",
  "Yacht ",
  "Insurance",
];

const DocumentBox = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [pendingCategory, setPendingCategory] = useState(null);
  const [counts, setCounts] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  // Fetch real document counts on mount
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch("/api/crew/documents/counts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCounts(data);
        }
      } catch (error) {
        // Optionally handle error
      }
    };
    fetchCounts();
  }, []);

  // Handler for file upload (multi-file, single request)
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !pendingCategory) return;
    setUploading(true);
    setShowPopup(false);
    const formData = new FormData();
    formData.append("category", pendingCategory);
    for (const file of files) {
      formData.append("document", file);
    }
    let result = null;
    try {
      const response = await fetch("/api/crew/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      result = await response.json();
      setUploadResult(result);
      setShowPopup(true);
      // Refresh document counts after upload
      if (response.ok) {
        const countRes = await fetch("/api/crew/documents/counts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (countRes.ok) {
          const data = await countRes.json();
          setCounts(data);
        }
      }
    } catch (error) {
      setUploadResult({
        status: false,
        message: "Upload failed. Please try again.",
      });
      setShowPopup(true);
    }
    setUploading(false);
    setPendingCategory(null);
  };

  // Open file picker for a given category
  const openFilePicker = (category) => {
    setPendingCategory(category);
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Reset file input
      fileInputRef.current.click();
    }
  };

  // Document types with real counts
  const documentTypes = documentTypeList.map((title) => ({
    icon: card,
    title,
    description:
      title === "Identification"
        ? "Passport, Visas, seafarer IDs"
        : title === "Certificates & Licenses"
        ? "STCW, COC, training certificates"
        : title === "Medical"
        ? "ENG1, vaccinations, medical certs"
        : title === "Employment"
        ? "Contracts, references, CV"
        : title === "Yacht "
        ? "Ship registry, safety certificates"
        : title === "Insurance"
        ? "Health, travel, personal insurance"
        : "",
    count: counts[title] || 0,
  }));

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .document-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
            padding: 10px !important;
          }
        }
        .document-card {
          transition: box-shadow 0.2s, transform 0.2s;
          cursor: pointer;
        }
        .document-card:hover {
          box-shadow: 0 8px 24px rgba(4,135,217,0.12), 0 1.5px 6px rgba(0,0,0,0.08);
          transform: translateY(-4px) scale(1.03);
        }
        .upload-popup {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .upload-popup-content {
          background: #fff;
          border-radius: 10px;
          padding: 32px 24px;
          min-width: 320px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          text-align: center;
        }
        .upload-popup-content.success h3 { color: #188A42; }
        .upload-popup-content.fail h3 { color: #EF4444; }
      `}</style>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        multiple
        onChange={handleFileChange}
      />
      <div
        className="document-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          padding: "20px",
        }}
      >
        {documentTypes.map((docType, index) => (
          <div
            key={index}
            className="bg-white document-card"
            style={{
              height: "300px",
              borderRadius: "10px",
              padding: "20px 20px 0px 20px",
            }}
            tabIndex={0}
            role="button"
            aria-label={`Open ${docType.title} documents`}
            onClick={() =>
              navigate(
                `/crew/document-management/list?category=${encodeURIComponent(
                  docType.title
                )}`
              )
            }
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(
                  `/crew/document-management/list?category=${encodeURIComponent(
                    docType.title
                  )}`
                );
              }
            }}
          >
            <div>
              <img src={docType.icon} alt="document icon" />
            </div>
            <div className="mb-5">
              <h2>{docType.title}</h2>
              <p style={{ color: "#21212199" }}>{docType.description}</p>
            </div>
            <div className="flex align-items-center justify-content-between">
              <h2>{docType.count}</h2>
              <p
                style={{
                  textDecoration: "underline",
                  color: "#0387D9",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    `/crew/document-management/list?category=${encodeURIComponent(
                      docType.title
                    )}`
                  );
                }}
              >
                View All
              </p>
            </div>
            <div
              className="flex align-items-center justify-content-flex-end"
              style={{ width: "100%", marginTop: "16px" }}
            >
              <button
                className="bg-primary text-white "
                style={{
                  borderRadius: "10px",
                  padding: "10px 20px",
                  border: "none",
                  cursor: "pointer",
                }}
                disabled={uploading}
                onClick={(e) => {
                  e.stopPropagation();
                  openFilePicker(docType.title);
                }}
              >
                {uploading && pendingCategory === docType.title
                  ? "Uploading..."
                  : "Add document"}
              </button>
            </div>
          </div>
        ))}
      </div>
      {showPopup && uploadResult && (
        <div className="upload-popup">
          <div
            className={`upload-popup-content ${
              uploadResult.status ? "success" : "fail"
            }`}
          >
            <h3>
              {uploadResult.status ? "Upload Successful!" : "Upload Failed"}
            </h3>
            <p>{uploadResult.message}</p>
            <button
              className="p-button p-button-primary mt-4"
              onClick={() => setShowPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentBox;

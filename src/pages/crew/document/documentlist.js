import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Button } from "primereact/button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MuiButton from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import Box from "@mui/material/Box";
import { FiEye, FiDownload, FiTrash2 } from "react-icons/fi";

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
          `${
            process.env.REACT_APP_API_URL
          }/crew/documents?category=${encodeURIComponent(category)}`,
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
  const [downloading, setDownloading] = useState(false);

  // Add a ref for the download anchor
  const downloadAnchorRef = useRef(null);

  const handleModalDownload = async (doc) => {
    setDownloading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/crew/documents/${doc._id}/download-url`
      );
      const data = await res.json();
      if (data.url) {
        const anchor = document.createElement("a");
        anchor.href = data.url;
        anchor.setAttribute("download", doc.originalName || "document");
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      }
    } catch (err) {
      alert("Failed to download file.");
    }
    setDownloading(false);
  };

  // Handle document deletion
  const handleDeleteDocument = async (documentId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/crew/documents/${documentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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
      <style>{`
      .p-6 { padding: 1rem !important;
        padding-top: 2rem !important; }
        @media (max-width: 600px) {
          .p-6 { padding: 0 !important; padding-top: 0 !important; }
          .doc-table-container { display: none; }
          .doc-card-list { display: block; }
          .doc-card {
            transition: box-shadow 0.18s, transform 0.18s, background 0.18s;
          }
          .doc-card:hover, .doc-card:active, .doc-card:focus {
            box-shadow: 0 8px 24px rgba(4,135,217,0.14), 0 1.5px 6px rgba(0,0,0,0.10);
            transform: scale(1.06);
            background: #f0f8ff;
            outline: none;
          }
        }
        @media (min-width: 601px) {
          .doc-table-container { display: block; }
          .doc-card-list { display: none; }
        }
        .doc-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          margin-bottom: 16px;
          padding: 18px 16px 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: box-shadow 0.18s, transform 0.18s, background 0.18s;
        }
        .doc-card-title {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 4px;
          color: #222;
          word-break: break-all;
        }
        .doc-card-meta {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
        }
        .doc-card-actions {
          display: flex;
          gap: 10px;
          margin-top: 6px;
        }
      `}</style>
      {documents.length === 0 ? (
        <div className="empty-docs-message text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No documents found
          </h3>
          <p className="text-gray-500 mb-4">
            No documents have been uploaded for the "{category}" category yet.
          </p>
        </div>
      ) : (
        <>
          <div className="doc-table-container">
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 2,
                boxShadow: 1,
                fontFamily: "Inter, sans-serif",
              }}
            >
              <Table sx={{ fontFamily: "Inter, sans-serif" }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        fontSize: 12,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        fontSize: 12,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Uploaded
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        fontSize: 12,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Size
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        fontSize: 12,
                        fontFamily: "Inter, sans-serif",
                        width: 160,
                        pl: 2,
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow
                      key={doc._id}
                      hover
                      sx={{ height: 56, fontFamily: "Inter, sans-serif" }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {doc.originalName}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "Inter, sans-serif" }}>
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "Inter, sans-serif" }}>
                        {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                      </TableCell>
                      <TableCell
                        sx={{ fontFamily: "Inter, sans-serif", pl: 2 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "flex-start",
                          }}
                        >
                          <MuiButton
                            variant="outlined"
                            size="small"
                            style={{
                              border: "1px solid #D0D5DD",
                              color: "#344054",
                              backgroundColor: "white",
                              borderRadius: 8,
                              minWidth: 36,
                              padding: 6,
                              fontFamily: "Inter, sans-serif",
                              transition:
                                "background 0.2s, color 0.2s, box-shadow 0.18s, transform 0.18s",
                            }}
                            onClick={() => setViewDoc(doc)}
                            title="View"
                            sx={{
                              "&:hover": {
                                background: "#f0f4ff",
                                color: "#1976d2",
                                boxShadow: "0 4px 16px 0 rgba(3,135,217,0.10)",
                                transform: "scale(1.13)",
                              },
                            }}
                          >
                            <FiEye size={18} />
                          </MuiButton>
                          <MuiButton
                            variant="outlined"
                            size="small"
                            style={{
                              border: "1px solid #D0D5DD",
                              color: "#344054",
                              backgroundColor: "white",
                              borderRadius: 8,
                              minWidth: 36,
                              padding: 6,
                              fontFamily: "Inter, sans-serif",
                              transition:
                                "background 0.2s, color 0.2s, box-shadow 0.18s, transform 0.18s",
                            }}
                            onClick={() => handleModalDownload(doc)}
                            title="Download"
                            sx={{
                              "&:hover": {
                                background: "#f0f4ff",
                                color: "#1976d2",
                                boxShadow: "0 4px 16px 0 rgba(3,135,217,0.10)",
                                transform: "scale(1.13)",
                              },
                            }}
                          >
                            <FiDownload size={18} />
                          </MuiButton>
                          <MuiButton
                            variant="outlined"
                            size="small"
                            style={{
                              border: "1px solid #D0D5DD",
                              color: "#B42318",
                              backgroundColor: "white",
                              borderRadius: 8,
                              minWidth: 36,
                              padding: 6,
                              fontFamily: "Inter, sans-serif",
                              transition:
                                "background 0.2s, color 0.2s, box-shadow 0.18s, transform 0.18s",
                            }}
                            onClick={() => setDeleteDoc(doc)}
                            title="Delete"
                            sx={{
                              "&:hover": {
                                background: "#fbe9e9",
                                color: "#B42318",
                                boxShadow: "0 4px 16px 0 rgba(180,35,24,0.10)",
                                transform: "scale(1.13)",
                              },
                            }}
                          >
                            <FiTrash2 size={18} />
                          </MuiButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="doc-card-list">
            {documents.map((doc) => (
              <div className="doc-card" key={doc._id}>
                <div className="doc-card-title">{doc.originalName}</div>
                <div className="doc-card-meta">
                  Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                  <br />
                  Size: {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                </div>
                <div className="doc-card-actions">
                  <MuiButton
                    variant="outlined"
                    size="small"
                    style={{
                      border: "1px solid #D0D5DD",
                      color: "#344054",
                      backgroundColor: "white",
                      borderRadius: 8,
                      minWidth: 36,
                      padding: 6,
                      fontFamily: "Inter, sans-serif",
                      transition:
                        "background 0.2s, color 0.2s, box-shadow 0.18s, transform 0.18s",
                    }}
                    onClick={() => setViewDoc(doc)}
                    title="View"
                    sx={{
                      "&:hover": {
                        background: "#f0f4ff",
                        color: "#1976d2",
                        boxShadow: "0 4px 16px 0 rgba(3,135,217,0.10)",
                        transform: "scale(1.13)",
                      },
                    }}
                  >
                    <FiEye size={18} />
                  </MuiButton>
                  <MuiButton
                    variant="outlined"
                    size="small"
                    style={{
                      border: "1px solid #D0D5DD",
                      color: "#344054",
                      backgroundColor: "white",
                      borderRadius: 8,
                      minWidth: 36,
                      padding: 6,
                      fontFamily: "Inter, sans-serif",
                      transition:
                        "background 0.2s, color 0.2s, box-shadow 0.18s, transform 0.18s",
                    }}
                    onClick={() => handleModalDownload(doc)}
                    title="Download"
                    sx={{
                      "&:hover": {
                        background: "#f0f4ff",
                        color: "#1976d2",
                        boxShadow: "0 4px 16px 0 rgba(3,135,217,0.10)",
                        transform: "scale(1.13)",
                      },
                    }}
                  >
                    <FiDownload size={18} />
                  </MuiButton>
                  <MuiButton
                    variant="outlined"
                    size="small"
                    style={{
                      border: "1px solid #D0D5DD",
                      color: "#B42318",
                      backgroundColor: "white",
                      borderRadius: 8,
                      minWidth: 36,
                      padding: 6,
                      fontFamily: "Inter, sans-serif",
                      transition:
                        "background 0.2s, color 0.2s, box-shadow 0.18s, transform 0.18s",
                    }}
                    onClick={() => setDeleteDoc(doc)}
                    title="Delete"
                    sx={{
                      "&:hover": {
                        background: "#fbe9e9",
                        color: "#B42318",
                        boxShadow: "0 4px 16px 0 rgba(180,35,24,0.10)",
                        transform: "scale(1.13)",
                      },
                    }}
                  >
                    <FiTrash2 size={18} />
                  </MuiButton>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* View Document Modal using Material UI Dialog */}
      <Dialog
        open={!!viewDoc}
        onClose={() => setViewDoc(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: { borderRadius: 16, padding: 0 },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              maxWidth: "80%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontWeight: 600,
            }}
          >
            {viewDoc?.originalName}
          </span>
          <IconButton
            aria-label="close"
            onClick={() => setViewDoc(null)}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "40vh",
            maxHeight: "60vh",
          }}
        >
          {viewDoc?.mimeType && viewDoc.mimeType.startsWith("image/") ? (
            <img
              src={viewDoc.fileUrl}
              alt={viewDoc.originalName}
              style={{
                maxWidth: "100%",
                maxHeight: "45vh",
                borderRadius: 8,
                border: "1px solid #eee",
                display: "block",
              }}
            />
          ) : viewDoc?.mimeType === "application/pdf" ? (
            <iframe
              src={viewDoc.fileUrl}
              title={viewDoc.originalName}
              style={{
                width: "100%",
                height: "45vh",
                borderRadius: 8,
                border: "1px solid #eee",
                background: "#f9f9f9",
              }}
            />
          ) : (
            <div
              style={{
                padding: 16,
                background: "#f3f4f6",
                borderRadius: 8,
                color: "#374151",
                textAlign: "center",
                width: "100%",
              }}
            >
              <span>No preview available for this file type.</span>
            </div>
          )}
          <div
            style={{
              fontSize: 12,
              color: "#6b7280",
              marginTop: 16,
              textAlign: "center",
              width: "100%",
            }}
          >
            <span style={{ marginRight: 8 }}>
              Uploaded:{" "}
              {viewDoc && new Date(viewDoc.uploadedAt).toLocaleDateString()}
            </span>
            <span>
              Size: {viewDoc && (viewDoc.fileSize / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <MuiButton
            variant="outlined"
            size="small"
            startIcon={
              downloading ? (
                <CircularProgress size={16} />
              ) : (
                <i className="pi pi-download" />
              )
            }
            onClick={() => handleModalDownload(viewDoc)}
            disabled={downloading}
          >
            Download
          </MuiButton>
          <MuiButton
            variant="contained"
            color="error"
            size="small"
            startIcon={<i className="pi pi-trash" />}
            onClick={() => {
              setDeleteDoc(viewDoc);
              setViewDoc(null);
            }}
          >
            Delete
          </MuiButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteDoc}
        onClose={() => setDeleteDoc(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ style: { borderRadius: 16, padding: 0 } }}
      >
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <p>
            Are you sure you want to delete{" "}
            <span style={{ fontWeight: 600 }}>{deleteDoc?.originalName}</span>?
          </p>
        </DialogContent>
        <DialogActions
          sx={{ gap: 2, justifyContent: "flex-end", px: 3, pb: 2 }}
        >
          <MuiButton
            onClick={() => setDeleteDoc(null)}
            variant="contained"
            style={{
              background: "#e5e7eb",
              color: "#222",
              fontWeight: 500,
              borderRadius: 8,
              minWidth: 90,
              height: 40,
              padding: "6px 16px",
              fontSize: 16,
              boxShadow: "none",
              border: "1px solid #e0e0e0",
              cursor: "pointer",
              textTransform: "none",
              transition: "all 0.2s cubic-bezier(.4,2,.6,1)",
            }}
            sx={{
              "&:hover": {
                background: "#cbd5e1",
                boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
                transform: "scale(1.05)",
                fontWeight: 600,
              },
            }}
          >
            Cancel
          </MuiButton>
          <MuiButton
            onClick={() => handleDeleteDocument(deleteDoc._id)}
            color="error"
            variant="contained"
            style={{
              borderRadius: 8,
              minWidth: 90,
              height: 40,
              padding: "6px 16px",
              fontWeight: 500,
              fontSize: 16,
              boxShadow: "none",
              textTransform: "none",
              transition: "all 0.2s cubic-bezier(.4,2,.6,1)",
            }}
            sx={{
              "&:hover": {
                background: "#b91c1c",
                boxShadow: "0 4px 16px 0 rgba(185,28,28,0.15)",
                transform: "scale(1.05)",
                fontWeight: 600,
              },
            }}
          >
            Delete
          </MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DocumentList;

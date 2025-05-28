import React, { useState, useEffect } from "react";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { FiEye, FiEdit, FiCreditCard, FiChevronLeft, FiChevronRight, FiChevronDown, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// Dummy data for fallback (commented out but kept for reference)
/*
const dummyQuotes = [
  {
    _id: "QTE-2024-001",
    quoteId: "QTE-2024-001",
    service: { name: "Maintenance" },
    vendor: { businessName: "Marine Services Inc." },
    requestDetails: { location: "Port A, Dock 3" },
    createdAt: "2025-02-15T10:00:00",
    status: "pending",
  },
  // ... other dummy data
];
*/

const QuotesTable = () => {
  const [quotes, setQuotes] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredAction, setHoveredAction] = useState({});
  const pageSize = 10;
  const navigate = useNavigate();

  // Fetch quotes from API
  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/quotes/customer?page=${currentPage}&limit=${pageSize}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      const data = await response.json();

      // Handle error responses
      if (!response.ok) {
        // If the response has a specific error message, use it
        if (data.message) {
          throw new Error(data.message);
        }
        throw new Error('Failed to fetch quotes');
      }

      // Handle successful response with no data
      if (!data.status) {
        setQuotes([]);
        setTotalPages(1);
        setTotalItems(0);
        return;
      }

      // Handle successful response with data
      const paginatedData = data.data;
      if (!paginatedData || !paginatedData.result) {
        setQuotes([]);
        setTotalPages(1);
        setTotalItems(0);
        return;
      }

      setQuotes(paginatedData.result);
      setTotalPages(paginatedData.totalPages || 1);
      setTotalItems(paginatedData.totalData || 0);
    } catch (err) {
      console.error('Error fetching quotes:', err);
      setError(err.message || 'Failed to fetch quotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === "asc" ? (
        <FaSortAmountUp style={{ marginLeft: 4 }} />
      ) : (
        <FaSortAmountDown style={{ marginLeft: 4 }} />
      );
    }
    return <FaSortAmountUp style={{ marginLeft: 4, opacity: 0.3 }} />;
  };

  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { background: "#fff8e6", color: "#b98900" };
      case "quoted":
        return { background: "#e6f7ee", color: "#1d9d74" };
      case "accepted":
        return { background: "#e6f0ff", color: "#3366ff" };
      case "declined":
        return { background: "#ffebeb", color: "#ff4d4f" };
      case "deposit_paid":
        return { background: "#e6f7ee", color: "#1d9d74" };
      case "final_payment_due":
        return { background: "#fff8e6", color: "#b98900" };
      case "completed":
        return { background: "#e6f7ee", color: "#1d9d74" };
      case "cancelled":
        return { background: "#ffebeb", color: "#ff4d4f" };
      default:
        return { background: "#f3f4f6", color: "#64748b" };
    }
  };

  // Sort quotes
  const sortedQuotes = [...quotes].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = sortField.includes('.') 
      ? sortField.split('.').reduce((obj, key) => obj?.[key], a)
      : a[sortField];
    const bValue = sortField.includes('.')
      ? sortField.split('.').reduce((obj, key) => obj?.[key], b)
      : b[sortField];
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleActionHover = (rowIdx, action, isHover) => {
    setHoveredAction((prev) => ({
      ...prev,
      [rowIdx]: {
        ...prev[rowIdx],
        [action]: isHover,
      },
    }));
  };

  // Loading UI
  if (loading) {
    return (
      <div style={{ 
        minHeight: 420, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        width: "100%",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            margin: "0 auto 12px", 
            border: "4px solid #e5e7eb", 
            borderTop: "4px solid #0387d9", 
            borderRadius: "50%", 
            width: 40, 
            height: 40, 
            animation: "spin 1s linear infinite" 
          }} />
          <div style={{ color: "#64748b", fontSize: 16 }}>Loading quotes...</div>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div style={{ 
        minHeight: 420, 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center", 
        width: "100%",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        padding: 24
      }}>
        <div style={{ 
          color: "#ff4d4f", 
          fontSize: 16, 
          background: "#fff0f0", 
          padding: 24, 
          borderRadius: 8, 
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          marginBottom: 16
        }}>
          {error}
        </div>
        <button
          onClick={fetchQuotes}
          style={{
            background: "#0387d9",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: 6,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14
          }}
        >
          <FiRefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  // No data UI
  if (!sortedQuotes.length) {
    return (
      <div style={{ 
        minHeight: 420, 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center", 
        width: "100%",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        padding: 24
      }}>
        <div style={{ 
          color: "#64748b", 
          fontSize: 16, 
          background: "#f8fafc", 
          padding: 24, 
          borderRadius: 8,
          marginBottom: 16,
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>No Quotes Found</h3>
          <p style={{ margin: 0, color: "#64748b" }}>
            You haven't made any quote requests yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: 0, margin: 0, width: "100%", minWidth: 900, maxWidth: "100%", minHeight: 420, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
      <div style={{ padding: 24, background: "#fff", borderRadius: 12, marginTop: 0, width: "100%", flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <div style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse", flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ width: "12%", textAlign: "left", padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={() => handleSort("_id")}>Quote ID {getSortIcon("_id")}</th>
                <th style={{ width: "15%", textAlign: "left", padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={() => handleSort("service.name")}>Service Type {getSortIcon("service.name")}</th>
                <th style={{ width: "20%", textAlign: "left", padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={() => handleSort("vendor.businessName")}>Service Provider {getSortIcon("vendor.businessName")}</th>
                <th style={{ width: "15%", textAlign: "left", padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={() => handleSort("requestDetails")}>Location {getSortIcon("requestDetails")}</th>
                <th style={{ width: "15%", textAlign: "left", padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={() => handleSort("createdAt")}>Date & Time {getSortIcon("createdAt")}</th>
                <th style={{ width: "10%", textAlign: "left", padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={() => handleSort("status")}>Status {getSortIcon("status")}</th>
                <th style={{ width: "13%", textAlign: "right", padding: "10px", borderBottom: "1px solid #eee" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>Actions</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedQuotes.map((quote, idx) => (
                <tr key={quote._id} style={{ borderBottom: "1px solid #eee", background: idx % 2 === 1 ? "#fafbfc" : "#fff" }}>
                  <td style={{ padding: "10px", color: "#1e293b" }}>{quote._id}</td>
                  <td style={{ padding: "10px", color: "#1e293b" }}>{quote.service?.name || "-"}</td>
                  <td style={{ padding: "10px", color: "#1e293b" }}>{quote.vendor?.businessName || "-"}</td>
                  <td style={{ padding: "10px", color: "#1e293b" }}>{quote.requestDetails || "-"}</td>
                  <td style={{ padding: "10px", color: "#1e293b" }}>{new Date(quote.createdAt).toLocaleString()}</td>
                  <td style={{ padding: "10px" }}>
                    <span style={{ ...getStatusBadgeStyle(quote.status), padding: "4px 12px", borderRadius: 20, fontWeight: 500, fontSize: 12 }}>
                      {quote.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px" }}>
                    <div style={{ display: "flex", gap: "3px", justifyContent: "flex-end" }}>
                      {/* View Button */}
                      <div
                        style={{
                          border: "1px solid lightgrey",
                          padding: 5,
                          cursor: "pointer",
                          borderRadius: 6,
                          transition: "background 0.15s, border 0.15s",
                          display: "flex",
                          alignItems: "center",
                        }}
                        title="View Details"
                        onMouseEnter={() => handleActionHover(idx, "view", true)}
                        onMouseLeave={() => handleActionHover(idx, "view", false)}
                        onClick={() => navigate(`/crew/quotes/${quote._id}`)}
                      >
                        <FiEye size={18} color={hoveredAction[idx]?.view ? "#0387d9" : undefined} />
                      </div>
                      {/* Edit Button */}
                      <div
                        style={{
                          border: "1px solid lightgrey",
                          padding: 5,
                          borderRadius: 6,
                          transition: "background 0.15s, border 0.15s",
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        title="Edit"
                        onMouseEnter={() => handleActionHover(idx, "edit", true)}
                        onMouseLeave={() => handleActionHover(idx, "edit", false)}
                      >
                        <FiEdit size={18} color={hoveredAction[idx]?.edit ? "#0387d9" : undefined} />
                      </div>
                      {/* Payment Button - Show only for accepted quotes */}
                      {quote.status === 'accepted' && (
                        <div
                          style={{
                            border: "1px solid lightgrey",
                            padding: 5,
                            cursor: "pointer",
                            borderRadius: 6,
                            transition: "background 0.15s, border 0.15s",
                            display: "flex",
                            alignItems: "center",
                          }}
                          title="Make Payment"
                          onMouseEnter={() => handleActionHover(idx, "payment", true)}
                          onMouseLeave={() => handleActionHover(idx, "payment", false)}
                          onClick={() => navigate(`/crew/quotes/${quote._id}/payment`)}
                        >
                          <FiCreditCard size={18} color={hoveredAction[idx]?.payment ? "#0387d9" : undefined} />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", background: "#fff", padding: "8px 16px", marginTop: 8, height: 50 }}>
          {/* Left: Items per page and count */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#6b7280", fontSize: 13, padding: 6 }}>{pageSize}</span>
            <FiChevronDown style={{ fontSize: 13, color: "#6b7280" }} />
            <span style={{ color: "#6b7280", fontSize: 13 }}>Items Per Page</span>
            <span style={{ color: "#6b7280", fontSize: 13 }}>{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalItems)} Of {totalItems} Items</span>
          </div>
          {/* Right: Page navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 13 }}>{currentPage}</span>
              <FiChevronDown style={{ fontSize: 13, color: "#6b7280" }} />
            </div>
            <span style={{ color: "#6b7280", fontSize: 13 }}>Of {totalPages} Pages</span>
            <button
              style={{ color: currentPage === 1 ? "#cbd5e1" : "#64748b", background: "none", border: "none", cursor: currentPage === 1 ? "not-allowed" : "pointer", fontSize: 16, padding: 4 }}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
            </button>
            <button
              style={{ color: currentPage === totalPages ? "#cbd5e1" : "#64748b", background: "none", border: "none", cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontSize: 16, padding: 4 }}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotesTable; 
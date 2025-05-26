import React, { useState } from "react";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { FiEye, FiEdit, FiDownload, FiChevronLeft, FiChevronRight, FiChevronDown } from "react-icons/fi";

const QuotesTable = () => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredAction, setHoveredAction] = useState({}); // { rowIdx: { view: bool, edit: bool, download: bool } }
  const pageSize = 10;

  // Dummy quote data
  const quoteItems = [
    {
      quoteId: "QTE-2024-001",
      serviceType: "Maintenance",
      vendorName: "Marine Services Inc.",
      location: "Port A, Dock 3",
      dateTime: "02/15/2025 10:00 AM",
      status: "Pending",
    },
    {
      quoteId: "QTE-2024-002",
      serviceType: "Cleaning",
      vendorName: "CleanSeas Co.",
      location: "Port B, Dock 7",
      dateTime: "02/17/2025 2:30 PM",
      status: "Confirmed",
    },
    {
      quoteId: "QTE-2024-003",
      serviceType: "Repair",
      vendorName: "FixIt Marine",
      location: "Port A, Dock 5",
      dateTime: "02/18/2025 9:15 AM",
      status: "Declined",
    },
    {
      quoteId: "QTE-2024-004",
      serviceType: "Inspection",
      vendorName: "SafeSeas Inspectors",
      location: "Port C, Dock 2",
      dateTime: "02/20/2025 11:45 AM",
      status: "Accepted",
    },
    {
      quoteId: "QTE-2024-005",
      serviceType: "Refueling",
      vendorName: "Marine Fuels Ltd.",
      location: "Port B, Dock 1",
      dateTime: "02/21/2025 8:00 AM",
      status: "Pending",
    },
    {
      quoteId: "QTE-2024-006",
      serviceType: "Maintenance",
      vendorName: "Marine Services Inc.",
      location: "Port A, Dock 3",
      dateTime: "02/22/2025 10:00 AM",
      status: "Pending",
    },
    {
      quoteId: "QTE-2024-007",
      serviceType: "Cleaning",
      vendorName: "CleanSeas Co.",
      location: "Port B, Dock 7",
      dateTime: "02/23/2025 2:30 PM",
      status: "Confirmed",
    },
    {
      quoteId: "QTE-2024-008",
      serviceType: "Repair",
      vendorName: "FixIt Marine",
      location: "Port A, Dock 5",
      dateTime: "02/24/2025 9:15 AM",
      status: "Declined",
    },
    {
      quoteId: "QTE-2024-009",
      serviceType: "Inspection",
      vendorName: "SafeSeas Inspectors",
      location: "Port C, Dock 2",
      dateTime: "02/25/2025 11:45 AM",
      status: "Accepted",
    },
    {
      quoteId: "QTE-2024-010",
      serviceType: "Refueling",
      vendorName: "Marine Fuels Ltd.",
      location: "Port B, Dock 1",
      dateTime: "02/26/2025 8:00 AM",
      status: "Pending",
    },
    {
      quoteId: "QTE-2024-011",
      serviceType: "Maintenance",
      vendorName: "Marine Services Inc.",
      location: "Port A, Dock 3",
      dateTime: "02/27/2025 10:00 AM",
      status: "Pending",
    },
    {
      quoteId: "QTE-2024-012",
      serviceType: "Cleaning",
      vendorName: "CleanSeas Co.",
      location: "Port B, Dock 7",
      dateTime: "02/28/2025 2:30 PM",
      status: "Confirmed",
    },
    {
      quoteId: "QTE-2024-013",
      serviceType: "Repair",
      vendorName: "FixIt Marine",
      location: "Port A, Dock 5",
      dateTime: "03/01/2025 9:15 AM",
      status: "Declined",
    },
    {
      quoteId: "QTE-2024-014",
      serviceType: "Inspection",
      vendorName: "SafeSeas Inspectors",
      location: "Port C, Dock 2",
      dateTime: "03/02/2025 11:45 AM",
      status: "Accepted",
    },
    {
      quoteId: "QTE-2024-015",
      serviceType: "Refueling",
      vendorName: "Marine Fuels Ltd.",
      location: "Port B, Dock 1",
      dateTime: "03/03/2025 8:00 AM",
      status: "Pending",
    },
  ];

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
    switch (status) {
      case "Pending":
        return { background: "#fff8e6", color: "#b98900" };
      case "Confirmed":
        return { background: "#e6f7ee", color: "#1d9d74" };
      case "Accepted":
        return { background: "#e6f0ff", color: "#3366ff" };
      case "Declined":
        return { background: "#ffebeb", color: "#ff4d4f" };
      default:
        return { background: "#f3f4f6", color: "#64748b" };
    }
  };

  // Optionally sort the data
  const sortedQuotes = [...quoteItems].sort((a, b) => {
    if (!sortField) return 0;
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedQuotes.length / pageSize);
  const paginatedQuotes = sortedQuotes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Helper for action button hover
  const handleActionHover = (rowIdx, action, isHover) => {
    setHoveredAction((prev) => ({
      ...prev,
      [rowIdx]: {
        ...prev[rowIdx],
        [action]: isHover,
      },
    }));
  };

  return (
    <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: 0, margin: 0, width: "100%", minWidth: 900, maxWidth: "100%", minHeight: 420, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
      <div style={{ padding: 24, background: "#fff", borderRadius: 12, marginTop: 0, width: "100%", flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <div style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse", flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ width: "12%", textAlign: "left", padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={() => handleSort("quoteId")}>Quote ID {getSortIcon("quoteId")}</th>
                <th style={{ width: "15%", textAlign: "left", padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={() => handleSort("serviceType")}>Service Type {getSortIcon("serviceType")}</th>
                <th style={{ width: "20%", textAlign: "left", padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={() => handleSort("vendorName")}>Vendor Name {getSortIcon("vendorName")}</th>
                <th style={{ width: "15%", textAlign: "left", padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={() => handleSort("location")}>Location {getSortIcon("location")}</th>
                <th style={{ width: "15%", textAlign: "left", padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={() => handleSort("dateTime")}>Date & Time {getSortIcon("dateTime")}</th>
                <th style={{ width: "10%", textAlign: "left", padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={() => handleSort("status")}>Status {getSortIcon("status")}</th>
                <th style={{ width: "13%", textAlign: "right", padding: "10px", borderBottom: "1px solid #eee" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>Actions</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedQuotes.map((quote, idx) => (
                <tr key={quote.quoteId} style={{ borderBottom: "1px solid #eee", background: idx % 2 === 1 ? "#fafbfc" : "#fff" }}>
                  <td style={{ padding: "10px", color: "#1e293b" }}>{quote.quoteId}</td>
                  <td style={{ padding: "10px", color: "#1e293b" }}>{quote.serviceType}</td>
                  <td style={{ padding: "10px", color: "#1e293b" }}>{quote.vendorName}</td>
                  <td style={{ padding: "10px", color: "#1e293b" }}>{quote.location}</td>
                  <td style={{ padding: "10px", color: "#1e293b" }}>{quote.dateTime}</td>
                  <td style={{ padding: "10px" }}>
                    <span style={{ ...getStatusBadgeStyle(quote.status), padding: "4px 12px", borderRadius: 20, fontWeight: 500, fontSize: 12 }}>
                      {quote.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
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
                      {/* Download Button */}
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
                        title="Download"
                        onMouseEnter={() => handleActionHover(idx, "download", true)}
                        onMouseLeave={() => handleActionHover(idx, "download", false)}
                      >
                        <FiDownload size={18} color={hoveredAction[idx]?.download ? "#0387d9" : undefined} />
                      </div>
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
            <span style={{ color: "#6b7280", fontSize: 13, padding: 6 }}>10</span>
            <FiChevronDown style={{ fontSize: 13, color: "#6b7280" }} />
            <span style={{ color: "#6b7280", fontSize: 13 }}>Items Per Page</span>
            <span style={{ color: "#6b7280", fontSize: 13 }}>{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sortedQuotes.length)} Of {sortedQuotes.length} Items</span>
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
import React, { useState, useCallback } from "react";
import { useTheme } from "../../../context/theme/themeContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Skeleton, Box, Card, CardContent, Grid, Divider } from "@mui/material";
import BookingTable from "./table";
import QuotesTable from "../../quote-related-pages/customers/QuotesTable";

const CrewBookingsAndQuotes = ({ bookings, loading, error, fetchBookings, page, setPage, limit, setLimit, totalPages, totalItems }) => {
  const [view, setView] = useState("bookings");
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isLargeDesktop = useMediaQuery("(min-width: 1400px)");

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-blue-100 text-blue-800";
      case "Confirmed":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        // background: theme === "light" ? "#F3F4F6" : "#181A20",
        ...(isMobile
          ? {
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden", // Prevent body/html scroll on mobile
          }
          : {}),
      }}
    >
      {/* Fixed filter buttons on mobile */}
      <div
        style={{
          position: isMobile ? "sticky" : "static",
          top: isMobile ? 0 : undefined,
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          minHeight: isMobile ? 60 : undefined,
        }}
      >

        {/* Filter buttons container */}
        <div style={{ display: "flex", gap: 16 }}>
          <button
            style={{
              padding: "14px 36px",
              borderRadius: 18,
              border:
                view === "bookings"
                  ? `2.5px solid ${theme === "light" ? "#0387d9" : "#90caf9"}`
                  : "1.5px solid #e5e7eb",
              background:
                view === "bookings"
                  ? theme === "light"
                    ? "#0387d9"
                    : "#23262F"
                  : "#fff",
              color:
                view === "bookings"
                  ? "#fff"
                  : theme === "light"
                    ? "#0387d9"
                    : "#90caf9",
              fontWeight: 700,
              fontSize: 18,
              cursor: view === "bookings" ? "default" : "pointer",
              boxShadow:
                view === "bookings" ? "0 2px 8px rgba(3,135,217,0.10)" : "none",
              transition:
                "background 0.18s, color 0.18s, border 0.18s, box-shadow 0.18s, transform 0.18s",
              outline: "none",
            }}
            onMouseOver={(e) => {
              if (view !== "bookings") {
                e.currentTarget.style.background = "#e6f3fb";
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(3,135,217,0.12)";
              }
            }}
            onMouseOut={(e) => {
              if (view !== "bookings") {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = `2px solid ${theme === "light" ? "#0387d9" : "#90caf9"
                }`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
            onClick={() => setView("bookings")}
            disabled={view === "bookings"}
          >
            Bookings
          </button>
          <button
            style={{
              padding: "14px 36px",
              borderRadius: 18,
              border:
                view === "quotes"
                  ? `2.5px solid ${theme === "light" ? "#0387d9" : "#90caf9"}`
                  : "1.5px solid #e5e7eb",
              background:
                view === "quotes"
                  ? theme === "light"
                    ? "#0387d9"
                    : "#23262F"
                  : "#fff",
              color:
                view === "quotes"
                  ? "#fff"
                  : theme === "light"
                    ? "#0387d9"
                    : "#90caf9",
              fontWeight: 700,
              fontSize: 18,
              cursor: view === "quotes" ? "default" : "pointer",
              boxShadow:
                view === "quotes" ? "0 2px 8px rgba(3,135,217,0.10)" : "none",
              transition:
                "background 0.18s, color 0.18s, border 0.18s, box-shadow 0.18s, transform 0.18s",
              outline: "none",
            }}
            onMouseOver={(e) => {
              if (view !== "quotes") {
                e.currentTarget.style.background = "#e6f3fb";
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(3,135,217,0.12)";
              }
            }}
            onMouseOut={(e) => {
              if (view !== "quotes") {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = `2px solid ${theme === "light" ? "#0387d9" : "#90caf9"
                }`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
            onClick={() => setView("quotes")}
            disabled={view === "quotes"}
          >
            Quotes
          </button>
        </div>
      </div>

      {/* Bookings/Quotes content */}
      <div
        style={{
          width: isLargeDesktop ? "100%" : "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          boxSizing: "border-box",
          padding: isMobile ? "0 8px" : isLargeDesktop ? "0" : "0 10px",
        }}
      >
        {view === "bookings" ? (
          <div style={{ width: "100%", overflowX: "auto" }}>
            <BookingTable
              bookings={bookings}
              loading={loading}
              error={error}
              fetchBookings={fetchBookings}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              totalPages={totalPages}
              totalItems={totalItems}
            />
          </div>
        ) : (
          <div style={{ width: "100%", overflowX: "auto" }}>
            <QuotesTable />
          </div>
        )}
      </div>
    </div>
  );
};

export default CrewBookingsAndQuotes;

import React, { useState } from "react";
import BookingTable from "./table";
import QuotesTable from "../../quote-related-pages/customers/QuotesTable";

const CrewBookingsAndQuotes = () => {
  const [view, setView] = useState("bookings");
  // Sidebar hover blue
  const platformBlue = "#0387d9";

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f3f4f6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", boxSizing: "border-box", padding: 0, margin: 0 }}>
      {/* Toggle Buttons */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, margin: "23px 0 19px 0" }}>
        <button
          style={{
            padding: "6px 18px",
            borderRadius: 6,
            border: view === "bookings" ? `2px solid ${platformBlue}` : "1px solid #e5e7eb",
            background: view === "bookings" ? platformBlue : "#fff",
            color: view === "bookings" ? "#fff" : platformBlue,
            fontWeight: 500,
            fontSize: 14,
            cursor: view === "bookings" ? "default" : "pointer",
            boxShadow: view === "bookings" ? "0 1px 4px rgba(3,135,217,0.08)" : "none",
            transition: "background 0.2s, color 0.2s, border 0.2s",
            outline: "none",
            minWidth: 90,
            letterSpacing: 0.2,
          }}
          onClick={() => setView("bookings")}
          disabled={view === "bookings"}
        >
          Bookings
        </button>
        <button
          style={{
            padding: "6px 18px",
            borderRadius: 6,
            border: view === "quotes" ? `2px solid ${platformBlue}` : "1px solid #e5e7eb",
            background: view === "quotes" ? platformBlue : "#fff",
            color: view === "quotes" ? "#fff" : platformBlue,
            fontWeight: 500,
            fontSize: 14,
            cursor: view === "quotes" ? "default" : "pointer",
            boxShadow: view === "quotes" ? "0 1px 4px rgba(3,135,217,0.08)" : "none",
            transition: "background 0.2s, color 0.2s, border 0.2s",
            outline: "none",
            minWidth: 90,
            letterSpacing: 0.2,
          }}
          onClick={() => setView("quotes")}
          disabled={view === "quotes"}
        >
          Quotes
        </button>
      </div>
      {/* Table Content */}
      <div style={{ width: "100%", maxWidth: "100%", margin: 0, flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", boxSizing: "border-box", padding: "0 10px" }}>
        {view === "bookings" ? <BookingTable /> : <QuotesTable />}
      </div>
    </div>
  );
};

export default CrewBookingsAndQuotes; 
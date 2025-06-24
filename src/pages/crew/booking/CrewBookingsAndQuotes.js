import React, { useState } from "react";
import BookingTable from "./table";
import QuotesTable from "../../quote-related-pages/customers/QuotesTable";

const CrewBookingsAndQuotes = () => {
  const [view, setView] = useState("bookings");
  // Sidebar hover blue
  const platformBlue = "#0387d9";

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        boxSizing: "border-box",
        padding: 0,
        margin: 0,
      }}
    >
      {/* Toggle Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          margin: "32px 0 28px 0",
        }}
      >
        <button
          style={{
            padding: "14px 36px",
            borderRadius: 18,
            border:
              view === "bookings"
                ? `2.5px solid ${platformBlue}`
                : "1.5px solid #e5e7eb",
            background: view === "bookings" ? platformBlue : "#fff",
            color: view === "bookings" ? "#fff" : platformBlue,
            fontWeight: 700,
            fontSize: 18,
            cursor: view === "bookings" ? "default" : "pointer",
            boxShadow:
              view === "bookings" ? "0 2px 8px rgba(3,135,217,0.10)" : "none",
            transition: "background 0.18s, color 0.18s, border 0.18s, box-shadow 0.18s, transform 0.18s",
            outline: "none",
          }}
          onMouseOver={e => {
            if (view !== "bookings") {
              e.currentTarget.style.background = "#e6f3fb";
              e.currentTarget.style.transform = "scale(1.04)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(3,135,217,0.12)";
            }
          }}
          onMouseOut={e => {
            if (view !== "bookings") {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
          onFocus={e => {
            e.currentTarget.style.outline = `2px solid ${platformBlue}`;
          }}
          onBlur={e => {
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
                ? `2.5px solid ${platformBlue}`
                : "1.5px solid #e5e7eb",
            background: view === "quotes" ? platformBlue : "#fff",
            color: view === "quotes" ? "#fff" : platformBlue,
            fontWeight: 700,
            fontSize: 18,
            cursor: view === "quotes" ? "default" : "pointer",
            boxShadow:
              view === "quotes" ? "0 2px 8px rgba(3,135,217,0.10)" : "none",
            transition: "background 0.18s, color 0.18s, border 0.18s, box-shadow 0.18s, transform 0.18s",
            outline: "none",
          }}
          onMouseOver={e => {
            if (view !== "quotes") {
              e.currentTarget.style.background = "#e6f3fb";
              e.currentTarget.style.transform = "scale(1.04)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(3,135,217,0.12)";
            }
          }}
          onMouseOut={e => {
            if (view !== "quotes") {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
          onFocus={e => {
            e.currentTarget.style.outline = `2px solid ${platformBlue}`;
          }}
          onBlur={e => {
            e.currentTarget.style.outline = "none";
          }}
          onClick={() => setView("quotes")}
          disabled={view === "quotes"}
        >
          Quotes
        </button>
      </div>
      {/* Table Content */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          boxSizing: "border-box",
          padding: "0 10px",
        }}
      >
        {view === "bookings" ? <BookingTable /> : <QuotesTable />}
      </div>
    </div>
  );
};

export default CrewBookingsAndQuotes;

import React from "react";
import { FiCreditCard, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const QuotePaymentPage = () => {
  const navigate = useNavigate();
  // Placeholder data
  const status = "Pending";
  const amountDue = 170.0;

  return (
    <div style={{ minHeight: "90vh", background: "#f3f4f6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 8 }}>
      {/* Back Button above card */}
      <div style={{ width: "100%", maxWidth: 650, display: "flex", justifyContent: "flex-start", marginBottom: 18 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#f3f4f6",
            border: "none",
            borderRadius: 7,
            padding: "7px 13px 7px 9px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#222",
            fontWeight: 500,
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseOver={e => { e.currentTarget.style.background = '#e5e7eb'; }}
          onMouseOut={e => { e.currentTarget.style.background = '#f3f4f6'; }}
        >
          <FiArrowLeft size={18} /> Back
        </button>
      </div>
      {/* Card Container */}
      <div style={{ width: "100%", maxWidth: 650, display: "flex", flexWrap: "wrap", gap: 20, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: 16, justifyContent: "center" }}>
        {/* Payment & Invoice */}
        <div style={{ flex: 1, minWidth: 220, maxWidth: 320, background: "#fff", borderRadius: 9, boxShadow: "0 2px 6px rgba(0,0,0,0.03)", padding: 20, display: "flex", flexDirection: "column", gap: 12, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 19, color: "#222" }}>Payment & Invoice</span>
            <span style={{ background: "#fdf3e6", color: "#b98900", fontWeight: 500, fontSize: 13, borderRadius: 7, padding: "3px 13px" }}>{status}</span>
          </div>
          <div style={{ color: "#6b7280", fontWeight: 500, fontSize: 14, marginBottom: 1 }}>Amount Due</div>
          <div style={{ fontWeight: 600, fontSize: 21, color: "#222", marginBottom: 10 }}>${amountDue.toFixed(2)}</div>
          <button
            style={{
              width: "100%",
              background: "#d1fae5",
              color: "#047857",
              border: "none",
              borderRadius: 9,
              padding: "13px 0",
              fontWeight: 600,
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              cursor: "pointer",
              marginTop: 7,
              transition: "background 0.18s, color 0.18s",
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#bbf7d0'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#d1fae5'; }}
          >
            <FiCreditCard size={20} /> Pay Now
          </button>
        </div>
        {/* Invoice / Receipt */}
        <div style={{ flex: 1, minWidth: 220, maxWidth: 320, background: "#fff", borderRadius: 9, boxShadow: "0 2px 6px rgba(0,0,0,0.03)", padding: 20, display: "flex", flexDirection: "column", gap: 12, marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 19, color: "#222", marginBottom: 10 }}>Invoice / Receipt</span>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={{ display: "flex", alignItems: "center", gap: 7, background: "#f3f4f6", border: "none", borderRadius: 7, padding: "9px 15px", fontWeight: 500, fontSize: 13, color: "#222", cursor: "pointer" }}>
              <svg width="18" height="18" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h6M9 17h6"/></svg>
              Download PDF
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 7, background: "#eff6ff", border: "none", borderRadius: 7, padding: "9px 15px", fontWeight: 500, fontSize: 13, color: "#2563eb", cursor: "pointer" }}>
              <svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePaymentPage; 
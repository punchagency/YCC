import React from "react";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuoteDetails = () => {
  // Placeholder data
  const details = {
    vendor: "Cleaning Co",
    date: "2025-02-10",
    time: "10:00",
    location: "123 Main Street",
  };
  const breakdown = [
    { label: "Labor", value: 120 },
    { label: "Materials", value: 35 },
    { label: "Travel", value: 15 },
  ];
  const total = breakdown.reduce((sum, item) => sum + item.value, 0);
  const terms = "Payment due within 7 days. Includes standard cleaning supplies.";

  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  return (
    <div style={{
      width: "100%",
      background: "#f3f4f6",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "32px 0 0 0",
      boxSizing: "border-box"
    }}>
      {/* Back Button */}
      <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto 16px auto" }}>
        <button
          onClick={handleBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#6b7280",
            background: "none",
            border: "none",
            fontWeight: 500,
            fontSize: 15,
            cursor: "pointer",
            padding: "8px 16px",
            borderRadius: 10,
            transition: "color 0.2s"
          }}
          onMouseOver={e => e.currentTarget.style.color = "#111827"}
          onMouseOut={e => e.currentTarget.style.color = "#6b7280"}
        >
          <ArrowLeft style={{ height: 18, width: 18 }} />
          <span>Back to Quotes</span>
        </button>
      </div>
      <div style={{
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 8px"
      }}>
        <div style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 16px 0 rgba(0,0,0,0.08)",
          padding: 28,
          width: "100%",
          maxWidth: 950,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}>
          <div style={{
            display: "flex",
            flexDirection: "row",
            gap: 20,
            flexWrap: "wrap",
            width: "100%"
          }}>
            {/* Quote Details Card */}
            <div style={{
              flex: 1,
              minWidth: 220,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 1px 6px 0 rgba(0,0,0,0.04)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: "#111827" }}>Quote Details</h2>
              <div style={{ marginBottom: 10 }}>
                <div style={{ color: "#9ca3af", fontWeight: 500, fontSize: 14 }}>Service/Vendor</div>
                <div style={{ fontWeight: 600, color: "#111827", fontSize: 16 }}>{details.vendor}</div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ color: "#9ca3af", fontWeight: 500, fontSize: 14 }}>Date & Time</div>
                <div style={{ fontWeight: 600, color: "#111827", fontSize: 16 }}>{details.date} <span style={{ marginLeft: 6 }}>{details.time}</span></div>
              </div>
              <div>
                <div style={{ color: "#9ca3af", fontWeight: 500, fontSize: 14 }}>Location</div>
                <div style={{ fontWeight: 600, color: "#111827", fontSize: 16 }}>{details.location}</div>
              </div>
            </div>

            {/* Quote Breakdown Card */}
            <div style={{
              flex: 1,
              minWidth: 220,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 1px 6px 0 rgba(0,0,0,0.04)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: "#111827" }}>Quote Breakdown</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {breakdown.map((item, idx) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
                    <span style={{ color: "#374151" }}>{item.label}:</span>
                    <span style={{ color: "#111827", fontWeight: 500 }}>${item.value}</span>
                  </div>
                ))}
                <hr style={{ margin: "12px 0", border: 0, borderTop: "1px solid #e5e7eb" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 600 }}>
                  <span>Total:</span>
                  <span>${total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Actions Card */}
          <div style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 1px 6px 0 rgba(0,0,0,0.04)",
            padding: 20,
            maxWidth: 500,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#111827" }}>Terms</h3>
            <p style={{ color: "#374151", marginBottom: 16, fontSize: 15 }}>{terms}</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#22c55e",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 15,
                  padding: "0.5rem 1.5rem",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  gap: 6,
                  transition: "background 0.2s"
                }}
                onMouseOver={e => e.currentTarget.style.background = "#16a34a"}
                onMouseOut={e => e.currentTarget.style.background = "#22c55e"}
              >
                <CheckCircle style={{ height: 18, width: 18 }} /> Accept
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#ef4444",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 15,
                  padding: "0.5rem 1.5rem",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  gap: 6,
                  transition: "background 0.2s"
                }}
                onMouseOver={e => e.currentTarget.style.background = "#dc2626"}
                onMouseOut={e => e.currentTarget.style.background = "#ef4444"}
              >
                <XCircle style={{ height: 18, width: 18 }} />
                <span style={{ color: "#fff" }}>Decline</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetails; 

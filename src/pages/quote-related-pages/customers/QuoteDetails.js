import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const QuoteDetails = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responding, setResponding] = useState(false);
  const navigate = useNavigate();
  const { quoteId } = useParams();
  console.log("id is:", quoteId);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/quotes/${quoteId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          // Handle different error cases
          if (response.status === 404) {
            throw new Error("This quote doesn't exist or has been removed.");
          } else if (response.status === 403) {
            throw new Error("You don't have permission to view this quote.");
          } else if (response.status === 400) {
            throw new Error("Invalid quote ID format.");
          } else {
            throw new Error(data.message || "Failed to fetch quote details");
          }
        }

        if (data.status) {
          setQuote(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch quote details");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [quoteId]);

  const handleBack = () => navigate(-1);

  const handleQuoteResponse = async (responseType) => {
    try {
      setResponding(true);
      setError(null);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/quotes/${quoteId}/respond`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ response: responseType })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to respond to quote");
      }

      if (data.status) {
        if (responseType === 'accept') {
          // Navigate to payment page
          navigate(`/crew/quotes/${quoteId}/payment`);
        } else {
          // Navigate back to quotes list
          navigate('/crew/quotes');
        }
      } else {
        throw new Error(data.message || "Failed to respond to quote");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setResponding(false);
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div style={{
        width: "100%",
        background: "#f3f4f6",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 0 0 0",
        boxSizing: "border-box"
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
          <div style={{ color: "#64748b", fontSize: 16 }}>Loading quote details...</div>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div style={{
        width: "100%",
        background: "#f3f4f6",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 0 0 0",
        boxSizing: "border-box"
      }}>
        <div style={{ 
          maxWidth: 500,
          width: "100%",
          padding: "0 16px"
        }}>
          <div style={{ 
            color: "#991b1b", 
            fontSize: 16, 
            background: "#fee2e2", 
            padding: 24, 
            borderRadius: 12, 
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            marginBottom: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            textAlign: "center"
          }}>
            <AlertCircle size={32} color="#dc2626" />
            <div style={{ fontWeight: 500 }}>{error}</div>
            <div style={{ 
              color: "#6b7280", 
              fontSize: 14,
              marginTop: 8 
            }}>
              The quote you're looking for might have been removed or you don't have permission to view it.
            </div>
          </div>
          <button
            onClick={handleBack}
            style={{
              background: "#0387d9",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 500,
              margin: "0 auto",
              transition: "background 0.2s"
            }}
            onMouseOver={e => e.currentTarget.style.background = "#0284c7"}
            onMouseOut={e => e.currentTarget.style.background = "#0387d9"}
          >
            <ArrowLeft size={18} />
            Back to Quotes
          </button>
        </div>
      </div>
    );
  }

  if (!quote) {
    return null;
  }

  const breakdown = [
    { label: "Total Amount", value: quote.amount },
    { label: "Deposit Amount", value: quote.depositAmount },
    { label: "Balance Amount", value: quote.balanceAmount }
  ];

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
                <div style={{ fontWeight: 600, color: "#111827", fontSize: 16 }}>{quote.vendor.businessName}</div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ color: "#9ca3af", fontWeight: 500, fontSize: 14 }}>Service Type</div>
                <div style={{ fontWeight: 600, color: "#111827", fontSize: 16 }}>{quote.service.name}</div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ color: "#9ca3af", fontWeight: 500, fontSize: 14 }}>Request Details</div>
                <div style={{ fontWeight: 600, color: "#111827", fontSize: 16 }}>{quote.requestDetails}</div>
              </div>
              <div>
                <div style={{ color: "#9ca3af", fontWeight: 500, fontSize: 14 }}>Date & Time</div>
                <div style={{ fontWeight: 600, color: "#111827", fontSize: 16 }}>{new Date(quote.createdAt).toLocaleString()}</div>
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
                {breakdown.map((item) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
                    <span style={{ color: "#374151" }}>{item.label}:</span>
                    <span style={{ color: "#111827", fontWeight: 500 }}>${item.value}</span>
                  </div>
                ))}
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
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#111827" }}>Provider Notes</h3>
            <p style={{ color: "#374151", marginBottom: 16, fontSize: 15 }}>{quote.providerNotes || "No additional notes provided."}</p>
            {quote.status === 'quoted' && (
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
                    cursor: responding ? "not-allowed" : "pointer",
                    gap: 6,
                    transition: "background 0.2s",
                    opacity: responding ? 0.7 : 1
                  }}
                  onMouseOver={e => !responding && (e.currentTarget.style.background = "#16a34a")}
                  onMouseOut={e => !responding && (e.currentTarget.style.background = "#22c55e")}
                  onClick={() => !responding && handleQuoteResponse('accept')}
                  disabled={responding}
                >
                  <CheckCircle style={{ height: 18, width: 18 }} /> Accept & Pay
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
                    cursor: responding ? "not-allowed" : "pointer",
                    gap: 6,
                    transition: "background 0.2s",
                    opacity: responding ? 0.7 : 1
                  }}
                  onMouseOver={e => !responding && (e.currentTarget.style.background = "#dc2626")}
                  onMouseOut={e => !responding && (e.currentTarget.style.background = "#ef4444")}
                  onClick={() => !responding && handleQuoteResponse('decline')}
                  disabled={responding}
                >
                  <XCircle style={{ height: 18, width: 18 }} />
                  <span style={{ color: "#fff" }}>Decline</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetails; 

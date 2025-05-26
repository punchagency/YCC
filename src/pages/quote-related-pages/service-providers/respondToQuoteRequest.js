import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { X, Send } from "lucide-react"

const RespondToQuote = () => {
  const { quoteId } = useParams()
  const navigate = useNavigate()
  const [pricing, setPricing] = useState("")
  const [breakdown, setBreakdown] = useState("")
  const [terms, setTerms] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("pricing", pricing)
      formData.append("breakdown", breakdown)
      formData.append("terms", terms)

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/quotes/respond/${quoteId}`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to submit quote response")
      navigate("/service/quotes")
    } catch (err) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    navigate("/service/quotes")
  }

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f3f4f6",
      paddingTop: "1rem",
      paddingBottom: "1rem"
    }}>
      <div style={{
        position: "relative",
        backgroundColor: "white",
        borderRadius: "24px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        width: "100%",
        maxWidth: "42rem",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column"
      }}>
        <button
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            backgroundColor: "transparent",
            border: "none",
            color: "#9ca3af",
            fontSize: "28px",
            cursor: "pointer",
            transition: "color 0.2s"
          }}
          onClick={handleClose}
          aria-label="Close"
          onMouseOver={(e) => e.currentTarget.style.color = "#374151"}
          onMouseOut={(e) => e.currentTarget.style.color = "#9ca3af"}
        >
          <X size={28} />
        </button>
        <h2 style={{
          fontSize: "28px",
          fontWeight: "600",
          marginBottom: "1.5rem",
          color: "#111827",
          textAlign: "left"
        }}>Respond To Quote</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{
              display: "block",
              fontSize: "1rem",
              fontWeight: "500",
              marginBottom: "0.75rem",
              color: "#374151"
            }}>Pricing</label>
            <input
              type="number"
              style={{
                width: "100%",
                border: "1px solid #d1d5db",
                borderRadius: "1rem",
                padding: "1rem",
                fontSize: "1rem",
                color: "#111827",
                outline: "none",
                boxSizing: "border-box"
              }}
              placeholder="Total Price"
              value={pricing}
              onChange={(e) => setPricing(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{
              display: "block",
              fontSize: "1rem",
              fontWeight: "500",
              marginBottom: "0.75rem",
              color: "#374151"
            }}>Breakdown</label>
            <textarea
              style={{
                width: "100%",
                border: "1px solid #d1d5db",
                borderRadius: "1rem",
                padding: "1rem",
                fontSize: "1rem",
                color: "#111827",
                outline: "none",
                boxSizing: "border-box",
                resize: "none",
                minHeight: "96px"
              }}
              placeholder="Describe price breakdown"
              value={breakdown}
              onChange={(e) => setBreakdown(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{
              display: "block",
              fontSize: "1rem",
              fontWeight: "500",
              marginBottom: "0.75rem",
              color: "#374151"
            }}>Terms</label>
            <textarea
              style={{
                width: "100%",
                border: "1px solid #d1d5db",
                borderRadius: "1rem",
                padding: "1rem",
                fontSize: "1rem",
                color: "#111827",
                outline: "none",
                boxSizing: "border-box",
                resize: "none",
                minHeight: "96px"
              }}
              placeholder="Enter terms"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              required
            />
          </div>
          {error && (
            <div style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fee2e2",
              borderRadius: "0.75rem",
              padding: "1rem",
              color: "#dc2626",
              fontSize: "0.875rem",
              marginTop: "0.5rem",
              marginBottom: "0"
            }}>
              <p>{error}</p>
            </div>
          )}
          <div style={{
            display: "flex",
            gap: "1rem",
            marginTop: "1rem",
            paddingTop: "0.5rem"
          }}>
            <button
              type="button"
              style={{
                flex: 1,
                backgroundColor: "#ef4444",
                color: "white",
                fontWeight: "500",
                padding: "1rem 0",
                borderRadius: "1rem",
                border: "none",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(239,68,68,0.10)",
                transition: "background-color 0.2s"
              }}
              onClick={handleClose}
              disabled={loading}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}
            >
              <X size={20} /> Decline
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: "#3b82f6",
                color: "white",
                fontWeight: "500",
                padding: "1rem 0",
                borderRadius: "1rem",
                border: "none",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(59,130,246,0.10)",
                transition: "background-color 0.2s",
                opacity: loading ? 0.7 : 1
              }}
              disabled={loading}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
            >
              {loading ? (
                <>
                  <div style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid white",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }} />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={20} /> Submit Quote
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RespondToQuote

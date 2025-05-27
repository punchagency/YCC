import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Send } from "lucide-react"

const RespondToQuote = () => {
  const { quoteId } = useParams()
  const navigate = useNavigate()
  const [amount, setAmount] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const [providerNotes, setProviderNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Client-side validation
    if (!amount || !depositAmount || !providerNotes) {
      setError("Please fill in all fields before submitting.")
      return
    }
    if (Number(depositAmount) > Number(amount)) {
      setError("Deposit amount cannot be greater than total amount.")
      return
    }
    setLoading(true)

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/quotes/${quoteId}/provide`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          depositAmount: Number(depositAmount),
          providerNotes,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit quote response")
      setSuccess(true)
    } catch (err) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
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
        flexDirection: "column",
        alignItems: "center"
      }}>
        <h2 style={{
          fontSize: "28px",
          fontWeight: "600",
          marginBottom: "1.5rem",
          color: "#111827",
          textAlign: "left",
          width: "100%"
        }}>Respond To Quote</h2>
        {success ? (
          <div style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "1rem",
            padding: "2rem 1.5rem",
            color: "#047857",
            fontSize: "1.15rem",
            fontWeight: 500,
            textAlign: "center",
            margin: "1.5rem 0 0 0",
            width: "100%"
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
            Your response was sent successfully to the customer.<br />You may now leave this page.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{
                display: "block",
                fontSize: "1rem",
                fontWeight: "500",
                marginBottom: "0.75rem",
                color: "#374151"
              }}>Total Amount</label>
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
                placeholder="Total Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min={0}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{
                display: "block",
                fontSize: "1rem",
                fontWeight: "500",
                marginBottom: "0.75rem",
                color: "#374151"
              }}>Deposit Amount</label>
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
                placeholder="Deposit Amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                required
                min={0}
                max={amount || undefined}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{
                display: "block",
                fontSize: "1rem",
                fontWeight: "500",
                marginBottom: "0.75rem",
                color: "#374151"
              }}>Provider Notes</label>
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
                placeholder="Add any notes for the customer"
                value={providerNotes}
                onChange={(e) => setProviderNotes(e.target.value)}
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
                fontSize: "0.95rem",
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
                type="submit"
                style={{
                  flex: 2,
                  backgroundColor: loading ? "#a5b4fc" : "#6366f1",
                  color: "white",
                  fontWeight: "600",
                  padding: "1rem 0",
                  border: "none",
                  borderRadius: "1rem",
                  fontSize: "1rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}
                disabled={loading}
              >
                {loading ? "Submitting..." : <><Send size={18} /> Submit Quote</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default RespondToQuote

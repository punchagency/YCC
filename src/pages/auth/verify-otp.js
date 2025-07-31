import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { buildApiUrl } from "../../utils/apiUtils";

// Get API URL from environment
const API_URL =
  process.env.REACT_APP_API_URL || "https://ycc-backend.onrender.com";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const email = query.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      // Use the proper API URL instead of relative URL
      const verifyUrl = buildApiUrl("auth/verify-otp");

      const response = await fetch(verifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (response.ok && data.message === "Otp verified!") {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 1000);
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f9fa",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          background: "white",
          borderRadius: 2,
          boxShadow: 2,
          p: 4,
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={2} textAlign="center">
          Verify OTP
        </Typography>
        <Typography variant="body2" mb={3} textAlign="center">
          Enter the OTP sent to your email address.
          <br />
          <b>{email}</b>
        </Typography>
        <form onSubmit={handleVerify}>
          <TextField
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            required
            inputProps={{
              maxLength: 6,
              style: { letterSpacing: 6, textAlign: "center" },
            }}
            sx={{ mb: 2 }}
          />
          {error && (
            <Typography color="error" mb={2} textAlign="center">
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" mb={2} textAlign="center">
              OTP verified! Redirecting...
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : "Verify OTP"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default VerifyOtp;

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Fade,
} from "@mui/material";
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  CheckCircleOutline,
} from "@mui/icons-material";
import yatchLogo from "../../assets/images/yatchLogo.png";
import { buildApiUrl } from "../../utils/apiUtils";

// Get API URL from environment
const API_URL =
  process.env.REACT_APP_API_URL || "https://ycc-backend.onrender.com";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const token = query.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Use the proper API URL instead of relative URL
      const resetUrl = buildApiUrl(`auth/reset-password?token=${token}`);

      const response = await fetch(resetUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(
          "Password has been reset successfully! Redirecting to login..."
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password.");
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
        background: "linear-gradient(135deg, #87CEEB 0%, #1e3a8a 100%)",
        backgroundSize: "200% 200%",
        backgroundPosition: "0% 50%",
        animation: "gradientFlow 18s ease-in-out infinite alternate",
        p: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Fade in timeout={800}>
        <Paper
          elevation={24}
          sx={{
            width: "100%",
            maxWidth: 480,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(15px)",
            borderRadius: 4,
            p: 5,
            position: "relative",
            zIndex: 1,
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #0387d9 0%, #255BD4 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 32px rgba(3, 135, 217, 0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  animation: "logoBreathing 3s ease-in-out infinite",
                  "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: "0 12px 40px rgba(3, 135, 217, 0.4)",
                    animation: "none",
                  },
                  "&:active": {
                    transform: "scale(0.95)",
                  },
                }}
              >
                <img
                  src={yatchLogo}
                  alt="Yacht Crew Center Logo"
                  style={{
                    width: 50,
                    height: 50,
                    filter: "brightness(0) invert(1)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </Box>
            </Box>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                background: "linear-gradient(135deg, #0387d9 0%, #255BD4 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Reset Your Password
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 300, mx: "auto" }}
            >
              Create a strong, secure password for your account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              type={showPassword ? "text" : "password"}
              label="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#0387d9",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0387d9",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "#0387d9" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#0387d9",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0387d9",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "#0387d9" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password requirements */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Password requirements:
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      password.length >= 8 ? "success.main" : "text.secondary",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <CheckCircleOutline sx={{ fontSize: 16 }} />
                  At least 8 characters long
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      password === confirmPassword && password
                        ? "success.main"
                        : "text.secondary",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <CheckCircleOutline sx={{ fontSize: 16 }} />
                  Passwords match
                </Typography>
              </Box>
            </Box>

            {/* Error/Success messages */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                {success}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.8,
                borderRadius: 2,
                background: "linear-gradient(135deg, #0387d9 0%, #255BD4 100%)",
                boxShadow: "0 8px 32px rgba(3, 135, 217, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0277c8 0%, #1e4bc3 100%)",
                  boxShadow: "0 12px 40px rgba(3, 135, 217, 0.4)",
                },
                "&:disabled": {
                  background:
                    "linear-gradient(135deg, #0387d9 0%, #255BD4 100%)",
                  opacity: 0.6,
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Reset Password"
              )}
            </Button>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: "pointer", "&:hover": { color: "#0387d9" } }}
                onClick={() => navigate("/login")}
              >
                Back to Login
              </Typography>
            </Box>
          </form>
        </Paper>
      </Fade>

      <style>
        {`
          @keyframes gradientFlow {
            0% {
              background-position: 0% 50%;
            }
            25% {
              background-position: 50% 60%;
            }
            50% {
              background-position: 100% 50%;
            }
            75% {
              background-position: 50% 40%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          @keyframes logoBreathing {
            0%, 100% { 
              transform: scale(1);
              box-shadow: 0 8px 32px rgba(3, 135, 217, 0.3);
            }
            50% { 
              transform: scale(1.05);
              boxShadow: 0 10px 36px rgba(3, 135, 217, 0.35);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default ResetPassword;

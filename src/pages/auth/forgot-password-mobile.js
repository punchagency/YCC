"use client";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo-login.png";
import ForgotPasswordForm from "../../components/ForgotPasswordForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LandingPageChatbot from "../../components/chatbot/landing-page-chatbot";

const ForgotPasswordMobile = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-column h-screen login-mobile"
      style={{
        position: "fixed",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        padding: 0,
        background: "#f8f9fa",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Fixed Header with Back Button */}
      {window.history.length > 1 && (
        <div
          className="mobile-header"
          style={{
            display: "flex",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2000,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            padding: "12px 16px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            minHeight: "60px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#034D92",
              fontSize: 24,
              padding: "8px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Back"
          >
            <ArrowBackIcon />
          </button>
        </div>
      )}

      {/* Fixed Logo Section */}
      <div
        className="logo-section"
        style={{
          width: "100%",
          padding: "24px 16px 16px 16px",
          textAlign: "center",
          background: "white",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          position: "fixed",
          top: window.history.length > 1 ? "60px" : "0",
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <div
          className="logo-container"
          style={{
            maxWidth: 280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px 0",
          }}
        >
          <img
            src={logo || "/placeholder.svg"}
            alt="Company logo"
            className="logo-image"
            style={{
              maxHeight: 100,
              width: "auto",
              objectFit: "contain",
            }}
          />
        </div>
      </div>

      {/* Main Form Container */}
      <div
        className="form-container"
        style={{
          position: "fixed",
          top: window.history.length > 1 ? "180px" : "140px",
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "24px 16px",
          overflow: "hidden",
        }}
      >
        <div
          className="form-card"
          style={{
            width: "100%",
            maxWidth: 380,
            background: "white",
            borderRadius: 16,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            padding: "32px 24px",
            margin: "0 auto",
          }}
        >
          {/* Header Section */}
          <div
            className="form-header"
            style={{
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            <h2
              className="form-title"
              style={{
                fontSize: "28px",
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: "12px",
                fontFamily: "Inter, sans-serif",
                lineHeight: 1.2,
              }}
            >
              Forgot Password
            </h2>
            <p
              className="form-subtitle"
              style={{
                fontSize: "16px",
                color: "#666",
                lineHeight: 1.5,
                fontFamily: "Inter, sans-serif",
                margin: 0,
              }}
            >
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {/* Form Section */}
          <div
            className="form-wrapper"
            style={{
              marginBottom: 24,
            }}
          >
            <ForgotPasswordForm />
          </div>

          {/* Footer Link */}
          <div
            className="form-footer"
            style={{
              textAlign: "center",
              paddingTop: 16,
              borderTop: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <p
              style={{
                fontSize: "15px",
                color: "#666",
                fontFamily: "Inter, sans-serif",
                margin: 0,
              }}
            >
              Remember your password?{" "}
              <Link
                to="/login"
                style={{
                  color: "#034D92",
                  fontFamily: "Inter, sans-serif",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Chatbot - Fixed Position */}
      <div
        className="chatbot-container"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <LandingPageChatbot />
      </div>
    </div>
  );
};

export default ForgotPasswordMobile;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SignupForm from "../../components/signup";
import logo from "../../assets/images/logo-login.png";

function isMobile() {
  return typeof window !== "undefined" && window.innerWidth < 600;
}

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: isMobile() ? "0" : undefined,
      }}
    >
      {/* Back Button for mobile (fixed at top) */}
      {window.history.length > 1 && isMobile() && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 2000,
            background: "transparent",
            width: "100vw",
            padding: "16px 0 0 16px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#000",
              fontSize: 28,
            }}
            aria-label="Back"
          >
            <ArrowBackIcon />
          </button>
        </div>
      )}
      {/* Back Button for desktop (absolute in container) */}
      {window.history.length > 1 && !isMobile() && (
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#034D92",
            margin: "16px 0 0 16px",
            position: "absolute",
            zIndex: 10,
          }}
          aria-label="Back"
        >
          <ArrowBackIcon />
        </button>
      )}
      <div
        className="signup-right-component"
        style={
          isMobile()
            ? {
                maxWidth: 340,
                width: "100%",
                margin: "0 auto",
                padding: "8px 4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                borderRadius: 12,
                background: "white",
              }
            : {}
        }
      >
        {/* Hide logo on mobile */}
        {!isMobile() && (
          <div className="logo-wraper">
            <div className="logo">
              <img src={logo} alt="Company logo" className="image-full" />
            </div>
          </div>
        )}
        <div
          className="signup-heading"
          style={
            isMobile()
              ? { marginBottom: 12, marginTop: 4, textAlign: "center" }
              : {}
          }
        >
          <h2 className="font-medium mb-1">Sign up</h2>
          <p>
            Already have an account? <Link to="/login">Sign in!</Link>
          </p>
        </div>
        <div className="signup-form" style={isMobile() ? { marginTop: 4 } : {}}>
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;

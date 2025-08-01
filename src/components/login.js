import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Message } from "primereact/message";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../services/authService";
import { useUser } from "../context/userContext"; // Import UserContext
import LandingPageChatbot from "./chatbot/landing-page-chatbot";
import CustomButton from "./Button";
import { isMobile } from "./ResponsiveDevice";

const LoginForm = ({ onClose }) => {
  // Define the options for the user roles
  const navigate = useNavigate(); // Add useNavigate hook
  const location = useLocation(); // Add useLocation hook

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      rememberMe: e.checked,
    });
  };

  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { loginUser, refreshUser } = useUser(); // Get loginUser and refreshUser functions from context

  // Add this useState hook for loading state
  const [loading, setLoading] = useState(false);

  // Check for session expiration message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
      // Clear the message from state to prevent showing it again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = (email) => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    if (!formData.email || !formData.password) {
      setError("All fields are required.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Role before submission:", formData.role);
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await login(formData);
      console.log("Login response:", response);

      if (response.status === "success") {
        // Store the token from the nested data object
        if (response.data && response.data.token) {
          console.log("Saving token to localStorage:", response.data.token);
          localStorage.setItem("token", response.data.token);
        }

        // Store initial user data
        loginUser(response.data.user);

        // Get role name from object or string
        let userRole = response.data.user.role;
        if (typeof userRole === "object" && userRole.name) {
          userRole = userRole.name;
        }

        // Wait for complete user data to be fetched
        try {
          await refreshUser();
        } catch (error) {
          console.error("Error refreshing user data:", error);
          // Continue with navigation even if refresh fails
        }

        // Navigate based on role
        if (userRole === "crew_member") {
          navigate("/crew/dashboard");
        } else if (userRole === "admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "supplier") {
          navigate("/supplier/dashboard");
        } else if (userRole === "service_provider") {
          navigate("/vendor/onboarding");
        }
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.log("Error during login:", error);
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Remember Me and Forgot Password Row Component
  const RememberForgotRow = ({ rememberMe, onCheckboxChange }) => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 989;
    return (
      <div
        className="p-field-checkbox p-d-flex p-ai-center"
        style={
          isDesktop
            ? {
                justifyContent: "space-between",
                display: "flex",
                alignItems: "center",
                gap: 16,
                width: "100%",
              }
            : {
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 4,
                width: "100%",
              }
        }
      >
        <div
          className="p-d-flex p-ai-center"
          style={{ display: "flex", alignItems: "center", gap: 6, height: 32 }}
        >
          <Checkbox
            inputId="rememberMe"
            checked={rememberMe}
            onChange={onCheckboxChange}
            style={{
              width: 22,
              height: 22,
              minWidth: 22,
              minHeight: 22,
              borderColor: rememberMe ? "#034D92" : undefined,
              background: rememberMe ? "#034D92" : undefined,
              color: rememberMe ? "#fff" : undefined,
              display: "inline-block",
              verticalAlign: "middle",
              marginRight: 4,
            }}
          />
          <label
            htmlFor="rememberMe"
            className="p-ml-2"
            style={{
              color: rememberMe ? "#034D92" : undefined,
              fontWeight: 500,
              cursor: "pointer",
              transition: "color 0.2s",
              fontSize: 16,
              lineHeight: "22px",
              display: "inline-block",
              verticalAlign: "middle",
              margin: 0,
              fontFamily: "Inter, sans-serif",
              minWidth: 110,
              textAlign: "left",
            }}
          >
            Remember Me
          </label>
        </div>
        <Link
          to="/forgot-password"
          style={{
            color: "#034D92",
            fontFamily: "Inter, sans-serif",
            fontSize: 16,
            lineHeight: "22px",
            minWidth: 110,
            textAlign: isDesktop ? "right" : "left",
            display: "inline-block",
            alignSelf: isDesktop ? "center" : "flex-start",
            marginLeft: isDesktop ? "auto" : 0,
            marginTop: isDesktop ? 0 : 8,
          }}
        >
          Forgot Your Password?
        </Link>
      </div>
    );
  };

  return (
    <div
      className="p-d-flex p-jc-center p-ai-center"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <form
        onSubmit={handleSubmit}
        style={isMobile() ? { margin: 0, padding: 0 } : {}}
      >
        {error && <Message severity="error" text={error} className="p-mb-3 " />}
        <div
          className="flex flex-column p-field"
          style={isMobile() ? { marginBottom: 8 } : {}}
        >
          <label htmlFor="username" style={{ fontFamily: "Inter, sans-serif" }}>
            Email Address
          </label>
          <InputText
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            className="p-d-block"
            required
          />
          {emailError && <small className="p-error">{emailError}</small>}
        </div>
        <div
          className="flex flex-column p-field"
          style={isMobile() ? { marginBottom: 8 } : {}}
        >
          <label htmlFor="password" style={{ fontFamily: "Inter, sans-serif" }}>
            Password
          </label>
          <Password
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            feedback={false}
            toggleMask
            placeholder="Password"
            required
            className="w-full"
          />
          {passwordError && <small className="p-error">{passwordError}</small>}
        </div>
        <RememberForgotRow
          rememberMe={formData.rememberMe}
          onCheckboxChange={handleCheckboxChange}
        />
        <CustomButton
          type="submit"
          disabled={loading}
          style={isMobile() ? { marginTop: 8, marginBottom: 0 } : {}}
        >
          {loading ? "Logging in..." : "Sign In"}
        </CustomButton>
      </form>
      <LandingPageChatbot />
    </div>
  );
};

export default LoginForm;

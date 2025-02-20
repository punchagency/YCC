import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ForgotPassword } from "../services/authService";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [showMessage, setShowMessage] = useState(false); // Controls message visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    validateEmail(value);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setShowMessage(false);

    // Validate if email is provided and valid
    if (!email) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      setShowMessage(true);
      return;
    }

    if (emailError) {
      setMessage("Please correct the errors before submitting.");
      setMessageType("error");
      setShowMessage(true);
      return;
    }

    setLoading(true);

    // Call forgot password API
    const response = await ForgotPassword(email);
    if (response.status === "success") {
      setMessage("An OTP has been sent to your email.");
      setMessageType("success");
      setShowMessage(true);

      // Auto-hide message after 7 seconds
      setTimeout(() => {
        setShowMessage(false);
        navigate(`/verify-otp?email=${email}`);
      }, 7000);
    } else {
      setMessage(response.message);
      setMessageType("error");
      setShowMessage(true);

      // Auto-hide message after 7 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 7000);
    }

    setLoading(false);
  };

  return (
    <div className="p-d-flex p-jc-center p-ai-center flex-column">
      {showMessage && (
        <div
          style={{
            padding: "10px",
            borderRadius: "5px",
            textAlign: "center",
            marginBottom: "10px",
            fontWeight: "bold",
            color: messageType === "success" ? "#155724" : "#721c24",
            backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
            border: `1px solid ${
              messageType === "success" ? "#c3e6cb" : "#f5c6cb"
            }`,
            animation:
              "fadeIn 0.8s ease-in forwards, fadeOut 1s ease-out 6s forwards",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-shadow-2 p-p-4">
        <div className="flex flex-column p-field p-mb-3">
          <label htmlFor="email">Email Address</label>
          <InputText
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email address"
            className="p-d-block"
          />
          {emailError && <small className="p-error">{emailError}</small>}
        </div>

        <Button
          type="submit"
          label={loading ? "Sending..." : "Send Reset Link"}
          className="p-mt-2 p-button-primary w-full"
          disabled={loading}
        />
      </form>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  );
};

export default ForgotPasswordForm;

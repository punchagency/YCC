import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { ForgotPassword } from "../services/authService";
import { useNavigate } from "react-router-dom";
import CustomButton from "./Button";
import { Message } from "primereact/message";
import { isMobile } from "./ResponsiveDevice";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [showMessage, setShowMessage] = useState(false);
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

    try {
      const response = await ForgotPassword(email);
      if (response.status === "success") {
        setMessage("An OTP has been sent to your email.");
        setMessageType("success");
        setShowMessage(true);

        setTimeout(() => {
          setShowMessage(false);
          navigate(`/verify-otp?email=${email}`);
        }, 7000);
      } else {
        setMessage(response.message);
        setMessageType("error");
        setShowMessage(true);

        setTimeout(() => {
          setShowMessage(false);
        }, 7000);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
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
        {showMessage && (
          <Message
            severity={messageType}
            text={message}
            className="p-mb-3"
            style={{
              width: "100%",
              marginBottom: "1rem",
            }}
          />
        )}

        <div
          className="flex flex-column p-field"
          style={isMobile() ? { marginBottom: 8 } : {}}
        >
          <label htmlFor="email" style={{ fontFamily: "Inter, sans-serif" }}>
            Email Address
          </label>
          <InputText
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email address"
            className="p-d-block"
            required
          />
          {emailError && <small className="p-error">{emailError}</small>}
        </div>

        <CustomButton
          type="submit"
          disabled={loading}
          style={isMobile() ? { marginTop: 8, marginBottom: 0 } : {}}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </CustomButton>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;

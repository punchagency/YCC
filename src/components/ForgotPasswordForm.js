import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { ForgotPassword } from "../services/authService";
import CustomButton from "./Button";
import { Message } from "primereact/message";
import { isMobile } from "./ResponsiveDevice";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await ForgotPassword(email);
      if (response.status === "success") {
        setMessage(
          "If an account with this email exists, a reset link has been sent."
        );
        setMessageType("success");
      } else {
        setMessage(response.message || "Failed to send reset link.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
      setShowMessage(true);
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
            style={{ width: "100%", marginBottom: "1rem" }}
          />
        )}

        <div
          className="flex flex-column p-field"
          style={{ marginBottom: "1rem" }}
        >
          <label htmlFor="email">Email Address</label>
          <InputText
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <CustomButton type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </CustomButton>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;

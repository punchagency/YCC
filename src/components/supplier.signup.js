import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import inputLogo from "../assets/images/nameinput.png";
import emailLogo from "../assets/images/emailinput.png";
import location from "../assets/images/location.png";

const SupplierSignUpForm = ({
  setStep,
  currentStep,
  formData,
  setFormData,
}) => {
  const [error, setError] = useState(null);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Business Name */}
      <div className="form-group1">
        <div className="input-field">
          <div>
            <label htmlFor="businessName">Business Name</label>
          </div>
          <div className="inputBorder">
            <img src={inputLogo} style={{ width: "12px", height: "12px" }} />
            <input
              type="text"
              id="businessName"
              placeholder="Enter Business Name"
              value={formData.businessName || ""}
              onChange={(e) =>
                handleInputChange("businessName", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Business Address */}

      {/* Phone Number and Email Row */}
      <div
        className="form-row"
        style={{
          display: "flex",
          gap: "16px",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: "10px",
        }}
      >
        {/* Phone Number */}

        {/* Email */}
        <div
          className="form-group5"
          style={{ flex: "1", marginBottom: "27px" }}
        >
          <div className="input-field">
            <div>
              <label htmlFor="email">Business Email</label>
            </div>
            <div
              className="inputBorder"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 12px",
                backgroundColor: "#f5f5f5",
                borderRadius: "5px",
                width: "100%",
                height: "40px",
              }}
            >
              <img
                src={emailLogo}
                style={{ width: "16px", height: "16px", marginRight: "8px" }}
              />
              <input
                type="email"
                id="email"
                placeholder="Enter Business Email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  border: "none",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <div>
          <label>Phone Number</label>
          <input type="text" placeholder="(+1) 1122-334-567" />
        </div>
        <div>
          <label>Address</label>
          <input type="text" placeholder="1234Elm Street, Suite 567" />
        </div>
      </div>

      {/* Next Button */}
      <div className="button-group">
        <button
          className="next-button"
          onClick={() => setStep(2)}
          style={{
            width: "100%",
            background: "linear-gradient(to right, #034d92, #0487d9)",
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="form-container">
      <AnimatePresence mode="wait" initial={false}>
        {currentStep === 1 && renderStep1()}
        {/* Add more steps here as needed */}
      </AnimatePresence>
      <AnimatePresence>
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              background: "#ffdddd",
              padding: "10px 20px",
              borderRadius: "5px",
              color: "red",
            }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupplierSignUpForm;

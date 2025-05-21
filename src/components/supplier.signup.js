import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import inputLogo from "../assets/images/nameinput.png";
import emailLogo from "../assets/images/emailinput.png";
import location from "../assets/images/location.png";
import phone from "../assets/images/phone.png";
import Select from "react-select";
import departmentLogo from "../assets/images/departmentLogo.png";
import serviceLogo from "../assets/images/serviceLogo.png";
import websiteLogo from "../assets/images/websiteLogo.png";
import uploadfileLogo from "../assets/images/uploadfileLogo.png";
import { signup } from "../services/authService";
import roleLogo from "../assets/images/roleLogo.png";
import thumbsLogo from "../assets/images/thumbsLogo.png";

// Replace the static supplierTypeOptions with a mapping of departments to their options
const departmentSupplierTypes = {
  captain: [
    { value: "Nautical Charts", label: "Nautical Charts" },
    {
      value: "Logbooks & Bridge Stationery",
      label: "Logbooks & Bridge Stationery",
    },
    { value: "Navigation Tools", label: "Navigation Tools" },
    { value: "Safety Signs & Notices", label: "Safety Signs & Notices" },
    { value: "Admin Supplies", label: "Admin Supplies" },
    { value: "Bridge Electronics", label: "Bridge Electronics" },
    {
      value: "Medical Kits & First Aid Supplies",
      label: "Medical Kits & First Aid Supplies",
    },
  ],
  exterior: [
    { value: "Cleaning Products", label: "Cleaning Products" },
    { value: "Wax & Polishes", label: "Wax & Polishes" },
    {
      value: "Buckets, Brushes, Mops & Handles",
      label: "Buckets, Brushes, Mops & Handles",
    },
    { value: "Chamois & Microfibers", label: "Chamois & Microfibers" },
    { value: "Ropes & Lines", label: "Ropes & Lines" },
    { value: "Fenders & Covers", label: "Fenders & Covers" },
    { value: "Watersports Accessories", label: "Watersports Accessories" },
    { value: "Safety Gear", label: "Safety Gear" },
  ],
  engineering: [
    { value: "Engine Oils & Lubricants", label: "Engine Oils & Lubricants" },
    { value: "Filters", label: "Filters" },
    {
      value: "Belts, Gaskets & Engine Spares",
      label: "Belts, Gaskets & Engine Spares",
    },
    { value: "Tools", label: "Tools" },
    {
      value: "Electrical Fuses, Wiring & Connectors",
      label: "Electrical Fuses, Wiring & Connectors",
    },
    { value: "Batteries", label: "Batteries" },
    { value: "HVAC Components", label: "HVAC Components" },
    {
      value: "Watermaker Filters & Parts",
      label: "Watermaker Filters & Parts",
    },
  ],
  interior: [
    {
      value: "Interior-Safe Cleaning Products",
      label: "Interior-Safe Cleaning Products",
    },
    { value: "Glass & Mirror Cleaners", label: "Glass & Mirror Cleaners" },
    {
      value: "Fabric Sprays & Deodorizers",
      label: "Fabric Sprays & Deodorizers",
    },
    { value: "Microfibers & Cloths", label: "Microfibers & Cloths" },
    { value: "Vacuum Bags & Attachments", label: "Vacuum Bags & Attachments" },
    { value: "Linens", label: "Linens" },
    { value: "Guest Toiletries", label: "Guest Toiletries" },
    { value: "Decorative Items", label: "Decorative Items" },
  ],
  galley: [
    { value: "Dry Goods", label: "Dry Goods" },
    { value: "Fresh Produce", label: "Fresh Produce" },
    { value: "Dairy & Meats", label: "Dairy & Meats" },
    { value: "Beverages", label: "Beverages" },
    { value: "Specialty Diet Items", label: "Specialty Diet Items" },
    { value: "Chef Tools", label: "Chef Tools" },
    { value: "Kitchen Equipment", label: "Kitchen Equipment" },
    {
      value: "Storage Containers & Wraps",
      label: "Storage Containers & Wraps",
    },
    {
      value: "Cleaning & Sanitizing Supplies",
      label: "Cleaning & Sanitizing Supplies",
    },
  ],
  default: [
    { value: "Food Provisions", label: "Food Provisionssss" },
    { value: "Marine Equipment", label: "Marine Equipment" },
    { value: "Cleaning Supplies", label: "Cleaning Supplies" },
    { value: "Fuel", label: "Fuel" },
  ],
};

const departmentOptions = [
  { value: "captain", label: "Captain" },
  { value: "exterior", label: "Exterior" },
  { value: "engineering", label: "Engineering" },
  { value: "interior", label: "Interior" },
  { value: "galley", label: "Galley / Chef" },
];

const deliveryOptions = [
  { value: "Same-day Delivery", label: "Same-day Delivery" },
  { value: "Scheduled Delivery", label: "Scheduled Delivery" },
  { value: "Express Delivery", label: "Express Delivery" },
];

const serviceAreaOptions = [
  { value: "United States", label: "United States" },
  { value: "Mediterranean", label: "Mediterranean" },
  { value: "Both", label: "Both" },
];

const SupplierSignUpForm = ({
  setStep,
  currentStep,
  formData,
  setFormData,
}) => {
  const [error, setError] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [taxIdFile, setTaxIdFile] = useState(null);
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [setFileErrors] = useState({
    supplierVatTaxId: "",
    supplierLiabilityInsurance: "",
    licenseSupplierFile: "",
    spreadsheetFile: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [setSuccess] = useState(false);

  // Add state to store current supplier type options
  const [supplierTypeOptions, setSupplierTypeOptions] = useState(
    departmentSupplierTypes.default
  );

  // Add effect to update supplier type options when department changes
  useEffect(() => {
    if (formData.department && formData.department.value) {
      const departmentValue = formData.department.value;
      if (departmentSupplierTypes[departmentValue]) {
        setSupplierTypeOptions(departmentSupplierTypes[departmentValue]);

        // Reset the selected supplier type if it's not in the new options list
        if (formData.supplierType) {
          const typeExists = departmentSupplierTypes[departmentValue].some(
            (option) => option.value === formData.supplierType.value
          );

          if (!typeExists) {
            handleInputChange("supplierType", null);
          }
        }
      } else {
        setSupplierTypeOptions(departmentSupplierTypes.default);
      }
    } else {
      setSupplierTypeOptions(departmentSupplierTypes.default);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.department]); // We're disabling the lint rule to prevent excessive rerenders

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    setFileErrors((prev) => ({ ...prev, [type]: "" }));

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size should not exceed 10MB");
      return;
    }

    // Validate file type based on upload type
    const validTypes =
      type === "spreadsheet"
        ? [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
          ]
        : ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

    if (!validTypes.includes(file.type)) {
      setError(
        type === "spreadsheet"
          ? "Please upload an Excel or CSV file"
          : "Please upload a PDF, JPG, or PNG file"
      );
      return;
    }

    setError("");

    try {
      switch (type) {
        case "spreadsheet":
          handleInputChange("spreadsheetFile", file);
          break;
        case "license":
          setLicenseFile(file);
          handleInputChange("licenseSupplierFile", file);
          break;
        case "taxId":
          setTaxIdFile(file);
          handleInputChange("supplierVatTaxId", file);
          break;
        case "insurance":
          setInsuranceFile(file);
          handleInputChange("supplierLiabilityInsurance", file);
          break;
        default:
          setError("Invalid file type");
          return;
      }
    } catch (error) {
      setError("File upload failed. Please try again.");
    }
  };

  const handleSignup = async () => {
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      setError("Please accept both Terms and Conditions and Privacy Policy to continue.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formDataObj = new FormData();

      // Add basic fields
      formDataObj.append("email", formData.email);
      formDataObj.append("role", "supplier");

      // Add supplier details
      const supplierDetails = {
        businessName: formData.businessName || "",
        departments: formData.departments?.map(dept => dept.value) || [],
        phone: formData.phone || "",
        address: formData.address || "",
        website: formData.website || "",
        serviceArea: formData.serviceArea ? formData.serviceArea.value : "",
        contactPerson: {
          fullName: formData.contactPerson?.fullName || "",
          role: formData.contactPerson?.role || "",
        },
      };

      formDataObj.append("supplierDetails", JSON.stringify(supplierDetails));

      const response = await signup(formDataObj);
      if (response.status) {
        setStep(5); // Go to success page
      } else {
        setError(response.message || "An error occurred during signup");
      }
    } catch (err) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      {/* Business Name */}
      <div className="form-group1">
        <div className="input-field">
          <div>
            <label htmlFor="businessName">Business Name</label>
          </div>
          <div className="inputBorder">
            <img
              src={inputLogo}
              style={{ width: "12px", height: "12px" }}
              alt="name"
            />
            <input
              type="text"
              id="businessName"
              value={formData.businessName || ""}
              onChange={(e) => handleInputChange("businessName", e.target.value)}
              placeholder="Enter your business name"
            />
          </div>
        </div>
      </div>

        {/* Email */}
      <div className="form-group1">
          <div className="input-field">
            <div>
            <label htmlFor="email">Contact Email</label>
            </div>
          <div className="inputBorder">
              <img
                src={emailLogo}
              style={{ width: "12px", height: "12px" }}
              alt="email"
              />
              <input
                type="email"
                id="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email"
            />
          </div>
        </div>
      </div>

      {/* Departments */}
      <div className="form-group1">
        <div className="input-field">
          <label htmlFor="departments">Departments Served</label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f8f8f8", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "10px 14px", marginBottom: "8px" }}>
            <img
              src={departmentLogo}
              style={{ width: "18px", height: "18px", flexShrink: 0, marginRight: "6px" }}
              alt="department"
            />
            <div style={{ flex: 1 }}>
              <Select
                isMulti
                name="departments"
                options={departmentOptions}
                value={formData.departments}
                onChange={(selected) => handleInputChange("departments", selected)}
                classNamePrefix="select"
                placeholder="Select departments"
                styles={{
                  control: (base) => ({ ...base, border: "none", boxShadow: "none", background: "transparent" }),
                  valueContainer: (base) => ({ ...base, padding: 0 }),
                  input: (base) => ({ ...base, margin: 0 }),
                  indicatorsContainer: (base) => ({ ...base, height: "32px" }),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
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

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      {/* Phone */}
      <div className="form-group1">
        <div className="input-field">
          <div>
            <label htmlFor="phone">Phone Number</label>
          </div>
          <div className="inputBorder">
            <img
              src={phone}
              style={{ width: "12px", height: "12px" }}
              alt="phone"
            />
            <input
              type="tel"
              id="phone"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="form-group1">
        <div className="input-field">
          <div>
            <label htmlFor="address">Business Address</label>
          </div>
          <div className="inputBorder">
            <img
              src={location}
              style={{ width: "12px", height: "12px" }}
              alt="location"
            />
            <input
              type="text"
              id="address"
              value={formData.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter your business address"
            />
          </div>
        </div>
      </div>

      {/* Website */}
      <div className="form-group1">
        <div className="input-field">
          <div>
            <label htmlFor="website">Website</label>
          </div>
          <div className="inputBorder">
            <img
              src={websiteLogo}
              style={{ width: "12px", height: "12px" }}
              alt="website"
            />
            <input
              type="url"
              id="website"
              value={formData.website || ""}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="Enter your website URL"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="button-group">
        <button
          className="prev-button"
          onClick={() => setStep(1)}
          style={{ width: "48%", background: "#f0f0f0" }}
        >
          Previous
        </button>
        <button
          className="next-button"
          onClick={() => setStep(3)}
          style={{
            width: "48%",
            background: "linear-gradient(to right, #034d92, #0487d9)",
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      {/* Contact Person Name */}
      <div className="form-group1">
        <div className="input-field">
          <div>
            <label htmlFor="contactPersonName">Contact Person Name</label>
          </div>
          <div className="inputBorder">
            <img
              src={inputLogo}
              style={{ width: "12px", height: "12px" }}
              alt="name"
            />
            <input
              type="text"
              id="contactPersonName"
              value={formData.contactPerson?.fullName || ""}
              onChange={(e) =>
                handleInputChange("contactPerson", {
                  ...formData.contactPerson,
                  fullName: e.target.value,
                })
              }
              placeholder="Enter contact person name"
            />
          </div>
        </div>
      </div>

      {/* Contact Person Role */}
      <div className="form-group1">
        <div className="input-field">
          <div>
            <label htmlFor="contactPersonRole">Contact Person Role</label>
          </div>
          <div className="inputBorder">
            <img
              src={roleLogo}
              style={{ width: "12px", height: "12px" }}
              alt="role"
            />
            <input
              type="text"
              id="contactPersonRole"
              value={formData.contactPerson?.role || ""}
              onChange={(e) =>
                handleInputChange("contactPerson", {
                  ...formData.contactPerson,
                  role: e.target.value,
                })
              }
              placeholder="Enter contact person role"
            />
          </div>
        </div>
      </div>

      {/* Service Area */}
      <div className="form-group1">
        <div className="input-field">
          <label htmlFor="serviceArea">Service Area</label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f8f8f8", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "10px 14px", marginBottom: "8px" }}>
            <img
              src={location}
              style={{ width: "18px", height: "18px", flexShrink: 0, marginRight: "6px" }}
              alt="location"
            />
            <div style={{ flex: 1 }}>
              <Select
                name="serviceArea"
                options={serviceAreaOptions}
                value={formData.serviceArea}
                onChange={(selected) => handleInputChange("serviceArea", selected)}
                classNamePrefix="select"
                placeholder="Select service area"
                styles={{
                  control: (base) => ({ ...base, border: "none", boxShadow: "none", background: "transparent" }),
                  valueContainer: (base) => ({ ...base, padding: 0 }),
                  input: (base) => ({ ...base, margin: 0 }),
                  indicatorsContainer: (base) => ({ ...base, height: "32px" }),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="form-group1">
        <div className="input-field">
          <div
            className="checkbox-field" 
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 0"
            }}
          >
            <input
              type="checkbox"
              id="terms"
              checked={formData.acceptTerms}
              onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                margin: "0",
                cursor: "pointer"
              }}
            />
            <label 
              htmlFor="terms" 
              style={{
                cursor: "pointer",
                fontSize: "14px",
                color: "#333",
                margin: "0",
                lineHeight: "1.4"
              }}
            >
              I agree to the Terms and Conditions
            </label>
      </div>
        </div>
        </div>

      {/* Privacy Policy */}
      <div className="form-group1">
        <div className="input-field">
        <div
            className="checkbox-field" 
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
              padding: "10px 0"
          }}
        >
          <input
            type="checkbox"
              id="privacy"
              checked={formData.acceptPrivacy}
              onChange={(e) => handleInputChange("acceptPrivacy", e.target.checked)}
            style={{
                width: "18px",
                height: "18px",
                margin: "0",
                cursor: "pointer"
            }}
          />
          <label
              htmlFor="privacy" 
            style={{
              cursor: "pointer",
              fontSize: "14px",
                color: "#333",
                margin: "0",
                lineHeight: "1.4"
            }}
          >
              I agree to the Privacy Policy
          </label>
          </div>
        </div>
        </div>

      {/* Navigation Buttons */}
        <div className="button-group">
          <button
            className="prev-button"
          onClick={() => setStep(2)}
            style={{ width: "48%", background: "#f0f0f0" }}
          >
            Previous
          </button>
          <button
            className="next-button"
            onClick={handleSignup}
          disabled={isSubmitting}
            style={{
              width: "48%",
            background: !isSubmitting
                  ? "linear-gradient(to right, #034d92, #0487d9)"
                  : "#ccc",
            cursor: !isSubmitting ? "pointer" : "not-allowed",
            opacity: !isSubmitting ? 1 : 0.7,
              transition: "all 0.3s ease",
            }}
          >
          {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      key="step4"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="success-container"
    >
      <div
        style={{
          backgroundColor: "#0487D9",
          padding: "30px 0px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "20px",
          borderRadius: "10px",
          color: "white",
        }}
      >
        <img src={thumbsLogo} alt="Success" />
        <h2 style={{ fontSize: "18px", color: "white" }}>
          Thank You For Applying! We are reviewing your application.
        </h2>
      </div>
    </motion.div>
  );

  return (
    <div className="form-container">
      <AnimatePresence mode="wait" initial={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
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

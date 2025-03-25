import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput from "react-phone-input-2";
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

const supplierTypeOptions = [
  { value: "Food Provisions", label: "Food Provisions" },
  { value: "Marine Equipment", label: "Marine Equipment" },
  { value: "Cleaning Supplies", label: "Cleaning Supplies" },
  { value: "Fuel", label: "Fuel" },
];

const departmentOptions = [
  { value: "deck", label: "Deck" },
  { value: "engine", label: "Engine" },
  { value: "interior", label: "Interior" },
  { value: "galley", label: "Galley" },
  { value: "safety", label: "Safety" },
];

const deliveryOptions = [
  { value: "Same-day Delivery", label: "Same-day Delivery" },
  { value: "Scheduled Delivery", label: "Scheduled Delivery" },
  { value: "Express Delivery", label: "Express Delivery" },
];

const serviceAreaOptions = [
  { value: "Caribbean", label: "Caribbean" },
  { value: "Mediterranean", label: "Mediterranean" },
  { value: "USA", label: "USA" },
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
  const [fileErrors, setFileErrors] = useState({
    supplierVatTaxId: "",
    supplierLiabilityInsurance: "",
    licenseSupplierFile: "",
    spreadsheetFile: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
    if (!formData.acceptFees) {
      setError("Please accept the platform fees to continue.");
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
        businessType: formData.supplierType?.value || "",
        phone: formData.phone || "",
        address: formData.address || "",
        website: formData.website || "",
        inventorySource: formData.apiEndpoint
          ? "API"
          : formData.spreadsheetFile
          ? "Spreadsheet"
          : "Manual",
        deliveryOptions: formData.deliveryPreference
          ? [formData.deliveryPreference.value]
          : [],
        serviceAreas: formData.serviceArea ? [formData.serviceArea.value] : [],
        licenseSupplierFile: formData.licenseSupplierFile
          ? formData.licenseSupplierFile.name
          : "",
        supplierVatTaxId: formData.supplierVatTaxId
          ? formData.supplierVatTaxId.name
          : "",
        supplierLiabilityInsurance: formData.supplierLiabilityInsurance
          ? formData.supplierLiabilityInsurance.name
          : "",
        spreadsheetFile: formData.spreadsheetFile
          ? formData.spreadsheetFile.name
          : "",
        contactPerson: {
          fullName: formData.contactPerson?.fullName || "",
          role: formData.contactPerson?.role || "",
        },
      };

      // Add files if they exist
      if (formData.licenseSupplierFile instanceof File) {
        formDataObj.append("licenseSupplierFile", formData.licenseSupplierFile);
        console.log("Added license file:", formData.licenseSupplierFile.name);
      }

      if (formData.supplierVatTaxId instanceof File) {
        formDataObj.append("supplierVatTaxId", formData.supplierVatTaxId);
        console.log("Added tax ID file:", formData.supplierVatTaxId.name);
      }

      if (formData.supplierLiabilityInsurance instanceof File) {
        formDataObj.append(
          "supplierLiabilityInsurance",
          formData.supplierLiabilityInsurance
        );
        console.log(
          "Added insurance file:",
          formData.supplierLiabilityInsurance.name
        );
      }

      if (formData.spreadsheetFile instanceof File) {
        formDataObj.append("spreadsheetFile", formData.spreadsheetFile);
        console.log("Added spreadsheet file:", formData.spreadsheetFile.name);
      }

      formDataObj.append("supplierDetails", JSON.stringify(supplierDetails));

      for (let pair of formDataObj.entries()) {
        console.log(
          pair[0],
          ":",
          pair[1] instanceof File ? pair[1].name : pair[1]
        );
      }

      const response = await signup(formDataObj);
      console.log("Signup response:", response);

      if (response.status === "success") {
        setSuccess(true);
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
        }
        setTimeout(() => {
          setStep(6);
        }, 2000);
      } else {
        throw new Error(response.message || "Failed to sign up");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message || "Failed to sign up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="inputBorder" style={{ border: "1px solid #DEDCDC" }}>
            <img
              src={inputLogo}
              style={{
                width: "18px",
                height: "18px",
                objectFit: "contain",
                border: "1px solid #DEDCDC",
              }}
            />
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
                backgroundColor: "#F8F8F8",
                borderRadius: "5px",
                width: "100%",
                height: "40px",
                border: "1px solid #DEDCDC",
              }}
            >
              <img
                src={emailLogo}
                style={{
                  width: "18px",
                  height: "18px",
                  marginRight: "8px",
                  objectFit: "contain",
                }}
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
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="form-group" style={{ paddingLeft: "9px" }}>
        <div className="input-row">
          {/* Type of Supplier */}
          <div className="input-field">
            <label>Type of Supplier</label>
            <div
              className="inputBorder"
              style={{
                height: "40px",
                backgroundColor: "#F8F8F8",
                border: "1px solid #DEDCDC",
              }}
            >
              <Select
                options={supplierTypeOptions}
                value={formData.supplierType}
                onChange={(selectedOption) =>
                  handleInputChange("supplierType", selectedOption)
                }
                placeholder={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={serviceLogo}
                      alt="Service Icon"
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "8px",
                        objectFit: "contain",
                      }}
                    />
                    <span style={{ fontSize: "13.5px" }}>
                      Select Supplier Type
                    </span>
                  </div>
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    minHeight: "35px",
                  }),
                  container: (provided) => ({
                    ...provided,
                    width: "100%",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    width: "100%",
                  }),
                  option: (base) => ({
                    ...base,
                    padding: "8px 12px",
                  }),
                }}
              />
            </div>
          </div>

          {/* Department */}
          <div className="input-field">
            <label>Department</label>
            <div
              className="inputBorder"
              style={{
                height: "40px",
                backgroundColor: "#F8F8F8",
                border: "1px solid #DEDCDC",
              }}
            >
              <Select
                options={departmentOptions}
                value={formData.department}
                onChange={(selectedOption) =>
                  handleInputChange("department", selectedOption)
                }
                placeholder={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={departmentLogo}
                      alt="Department Icon"
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "8px",
                        objectFit: "contain",
                      }}
                    />
                    <span style={{ fontSize: "13.5px" }}>
                      Select Department
                    </span>
                  </div>
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    minHeight: "35px",
                  }),
                  container: (provided) => ({
                    ...provided,
                    width: "100%",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    width: "100%",
                  }),
                  option: (base) => ({
                    ...base,
                    padding: "8px 12px",
                  }),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Phone and Address */}
      <div className="form-group" style={{ paddingLeft: "9px" }}>
        <div className="input-row">
          <div className="input-field">
            <label>Phone Number</label>
            <div
              className="inputBorder"
              style={{
                height: "40px",
                backgroundColor: "#F8F8F8",
                border: "1px solid #DEDCDC",
              }}
            >
              <img
                src={phone}
                alt="phone icon"
                style={{
                  width: "18px",
                  height: "18px",
                  objectFit: "contain",
                  flexShrink: 0,
                }}
              />
              <input
                type="text"
                placeholder="(+1) 1122-334-567"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  padding: "8px 12px",
                }}
                specialLabel=""
                enableAreaCodes={true}
                onlyCountries={["us", "ca"]}
                masks={{ us: "... ... ....", ca: "... ... ...." }}
              />
            </div>
          </div>

          <div className="input-field">
            <label>Address</label>
            <div
              className="inputBorder"
              style={{
                height: "40px",
                backgroundColor: "#F8F8F8",
                border: "1px solid #DEDCDC",
              }}
            >
              <img
                src={location}
                alt="location icon"
                style={{
                  width: "16px",
                  height: "16px",
                  flexShrink: 0,
                }}
              />
              <input
                type="text"
                placeholder="1234 Elm Street, Suite 567"
                value={formData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  padding: "8px 12px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Website Input */}
      <div className="form-group" style={{ paddingLeft: "9px" }}>
        <div className="input-field">
          <label>Business Website</label>
          <div
            className="inputBorder"
            style={{
              height: "40px",
              backgroundColor: "#F8F8F8",
              border: "1px solid #DEDCDC",
              paddingLeft: "10px",
            }}
          >
            <img
              src={websiteLogo}
              alt="website icon"
              style={{
                width: "18px",
                height: "18px",
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
            <input
              type="url"
              placeholder="www.example.com"
              value={formData.website || ""}
              onChange={(e) => handleInputChange("website", e.target.value)}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                padding: "8px 12px",
              }}
            />
          </div>
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

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* License Upload */}
      <div className="upload-group">
        <div className="input-field">
          <label>Business License</label>
          <div
            className="upload-input"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              backgroundColor: "#F8F8F8",
              borderRadius: "5px",
              border: "1px solid #DEDCDC",
              height: "40px",
            }}
          >
            <input
              type="text"
              placeholder="Upload Business License"
              value={licenseFile ? licenseFile.name : ""}
              readOnly
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                outline: "none",
              }}
            />
            <img
              src={uploadfileLogo}
              alt="Upload"
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
                objectFit: "contain",
              }}
              onClick={() => document.getElementById("licenseInput").click()}
            />
            <input
              type="file"
              id="licenseInput"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e.target.files[0], "license")}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </div>

      {/* Tax ID Upload */}
      <div className="upload-group">
        <div className="input-field">
          <label>Tax ID Document</label>
          <div
            className="upload-input"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              backgroundColor: "#F8F8F8",
              borderRadius: "5px",
              border: "1px solid #DEDCDC",
              height: "40px",
            }}
          >
            <input
              type="text"
              placeholder="Upload Tax ID Document"
              value={taxIdFile ? taxIdFile.name : ""}
              readOnly
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                outline: "none",
              }}
            />
            <img
              src={uploadfileLogo}
              alt="Upload"
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
                objectFit: "contain",
              }}
              onClick={() => document.getElementById("taxIdInput").click()}
            />
            <input
              type="file"
              id="taxIdInput"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e.target.files[0], "taxId")}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </div>

      {/* Liability Insurance Upload */}
      <div className="upload-group">
        <div className="input-field">
          <label>Liability Insurance</label>
          <div
            className="upload-input"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              backgroundColor: "#F8F8F8",
              borderRadius: "5px",
              border: "1px solid #DEDCDC",
              height: "40px",
            }}
          >
            <input
              type="text"
              placeholder="Upload Liability Insurance"
              value={insuranceFile ? insuranceFile.name : ""}
              readOnly
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                outline: "none",
              }}
            />
            <img
              src={uploadfileLogo}
              alt="Upload"
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
                objectFit: "contain",
              }}
              onClick={() => document.getElementById("insuranceInput").click()}
            />
            <input
              type="file"
              id="insuranceInput"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e.target.files[0], "insurance")}
              style={{ display: "none" }}
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
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* API Connection */}
      <div className="form-group5" style={{ marginBottom: "20px" }}>
        <div className="input-field">
          <div>
            <label>API Connection</label>
          </div>
          <div
            className="inputBorder"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              backgroundColor: "#F8F8F8",
              borderRadius: "5px",
              width: "100%",
              height: "40px",
              border: "1px solid #DEDCDC",
            }}
          >
            <img
              src={emailLogo}
              style={{
                width: "18px",
                height: "18px",
                marginRight: "8px",
                objectFit: "contain",
              }}
            />
            <input
              type="text"
              placeholder="Enter API Endpoint"
              value={formData.apiEndpoint || ""}
              onChange={(e) => handleInputChange("apiEndpoint", e.target.value)}
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Spreadsheet Upload */}
      <div className="upload-group">
        <div className="input-field">
          <label>Upload Product Spreadsheet</label>
          <div
            className="upload-input"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              backgroundColor: "#F8F8F8",
              borderRadius: "5px",
              border: "1px solid #DEDCDC",
              height: "40px",
            }}
          >
            <input
              type="text"
              placeholder="Upload Product Spreadsheet"
              value={
                formData.spreadsheetFile ? formData.spreadsheetFile.name : ""
              }
              readOnly
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                outline: "none",
              }}
            />
            <img
              src={uploadfileLogo}
              alt="Upload"
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
                objectFit: "contain",
              }}
              onClick={() =>
                document.getElementById("spreadsheetInput").click()
              }
            />
            <input
              type="file"
              id="spreadsheetInput"
              accept=".xlsx,.xls,.csv"
              onChange={(e) =>
                handleFileUpload(e.target.files[0], "spreadsheet")
              }
              style={{ display: "none" }}
            />
          </div>
        </div>
      </div>

      {/* Manual Entry */}
      <div className="form-group5" style={{ marginBottom: "20px" }}>
        <div className="input-field">
          <div>
            <label>Manual Entry</label>
          </div>
          <div
            className="inputBorder"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              backgroundColor: "#F8F8F8",
              borderRadius: "5px",
              width: "100%",
              height: "40px",
              border: "1px solid #DEDCDC",
            }}
          >
            <img
              src={inputLogo}
              style={{
                width: "18px",
                height: "18px",
                marginRight: "8px",
                objectFit: "contain",
              }}
            />
            <input
              type="text"
              placeholder="Enter Product Details"
              value={formData.manualEntry || ""}
              onChange={(e) => handleInputChange("manualEntry", e.target.value)}
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Shipping & Delivery Preference */}
      <div className="form-group5" style={{ marginBottom: "20px" }}>
        <div className="input-field">
          <label>Shipping & Delivery Preference</label>
          <div
            className="inputBorder"
            style={{
              height: "40px",
              backgroundColor: "#F8F8F8",
              border: "1px solid #DEDCDC",
            }}
          >
            <Select
              options={deliveryOptions}
              value={formData.deliveryPreference}
              onChange={(selectedOption) =>
                handleInputChange("deliveryPreference", selectedOption)
              }
              placeholder={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={serviceLogo}
                    alt="Delivery Icon"
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "8px",
                      objectFit: "contain",
                    }}
                  />
                  <span style={{ fontSize: "13.5px" }}>
                    Select Delivery Preference
                  </span>
                </div>
              }
              styles={{
                control: (provided) => ({
                  ...provided,
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  minHeight: "35px",
                }),
                container: (provided) => ({
                  ...provided,
                  width: "100%",
                }),
                menu: (provided) => ({
                  ...provided,
                  width: "100%",
                }),
                option: (base) => ({
                  ...base,
                  padding: "8px 12px",
                }),
              }}
            />
          </div>
        </div>
      </div>

      {/* Service Area */}
      <div className="form-group5" style={{ marginBottom: "20px" }}>
        <div className="input-field">
          <label>Service Area</label>
          <div
            className="inputBorder"
            style={{
              height: "40px",
              backgroundColor: "#F8F8F8",
              border: "1px solid #DEDCDC",
            }}
          >
            <Select
              options={serviceAreaOptions}
              value={formData.serviceArea}
              onChange={(selectedOption) =>
                handleInputChange("serviceArea", selectedOption)
              }
              placeholder={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={location}
                    alt="Location Icon"
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "8px",
                      objectFit: "contain",
                    }}
                  />
                  <span style={{ fontSize: "13.5px" }}>
                    Select Service Area
                  </span>
                </div>
              }
              styles={{
                control: (provided) => ({
                  ...provided,
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  minHeight: "35px",
                }),
                container: (provided) => ({
                  ...provided,
                  width: "100%",
                }),
                menu: (provided) => ({
                  ...provided,
                  width: "100%",
                }),
                option: (base) => ({
                  ...base,
                  padding: "8px 12px",
                }),
              }}
            />
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
          onClick={() => setStep(4)}
          style={{
            width: "48%",
            background: "linear-gradient(to right, #034d92, #0487d9)",
          }}
        >
          Next
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="error-message"
          style={{ color: "red", marginTop: "10px" }}
        >
          {error}
        </div>
      )}
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      key="step4"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Full Name Input */}
      <div className="form-group5" style={{ marginBottom: "20px" }}>
        <div className="input-field">
          <div>
            <label>Full Name</label>
          </div>
          <div
            className="inputBorder"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              backgroundColor: "#F8F8F8",
              borderRadius: "5px",
              width: "100%",
              height: "40px",
              border: "1px solid #DEDCDC",
            }}
          >
            <img
              src={inputLogo}
              style={{
                width: "18px",
                height: "18px",
                marginRight: "8px",
                objectFit: "contain",
              }}
            />
            <input
              type="text"
              placeholder="Enter Full Name"
              value={formData.contactPerson?.fullName || ""}
              onChange={(e) =>
                handleInputChange("contactPerson", {
                  ...formData.contactPerson,
                  fullName: e.target.value,
                })
              }
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Role Input */}
      <div className="form-group5" style={{ marginBottom: "20px" }}>
        <div className="input-field">
          <div>
            <label>Role/Position</label>
          </div>
          <div
            className="inputBorder"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              backgroundColor: "#F8F8F8",
              borderRadius: "5px",
              width: "100%",
              height: "40px",
              border: "1px solid #DEDCDC",
            }}
          >
            <img
              src={roleLogo}
              style={{
                width: "18px",
                height: "18px",
                marginRight: "8px",
                objectFit: "contain",
              }}
            />
            <input
              type="text"
              placeholder="Enter Role/Position"
              value={formData.contactPerson?.role || ""}
              onChange={(e) =>
                handleInputChange("contactPerson", {
                  ...formData.contactPerson,
                  role: e.target.value,
                })
              }
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="button-group">
        <button
          className="prev-button"
          onClick={() => setStep(3)}
          style={{ width: "48%", background: "#f0f0f0" }}
        >
          Previous
        </button>
        <button
          className="next-button"
          onClick={() => setStep(5)}
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

  const renderStep5 = () => (
    <motion.div
      key="step5"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="platform-fee-container"
    >
      <div>
        <div>
          <h3>Platform Fees</h3>
        </div>

        <div className="fees">
          <ul>
            <li>Suppliers do not any platform fees.</li>
            <li>Consumers are charged a 2% transaction fee per order.</li>
            <li>
              Orders placed through the chatbot will automatically sync with
              your inventory.
            </li>
            <li>
              Your inventory & logistics details will be verified by our team
              before approval.
            </li>
          </ul>
        </div>

        {/* Added Checkbox */}
        <div
          className="terms-checkbox"
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <input
            type="checkbox"
            id="acceptFees"
            checked={formData.acceptFees}
            onChange={(e) => handleInputChange("acceptFees", e.target.checked)}
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
            }}
          />
          <label
            htmlFor="acceptFees"
            style={{
              cursor: "pointer",
              fontSize: "14px",
              color: "#666",
            }}
          >
            I understand and accept the platform fees structure
          </label>
        </div>

        <div className="button-group">
          <button
            className="prev-button"
            onClick={() => setStep(4)}
            style={{ width: "48%", background: "#f0f0f0" }}
          >
            Previous
          </button>
          <button
            className="next-button"
            onClick={handleSignup}
            disabled={!formData.acceptFees || isSubmitting}
            style={{
              width: "48%",
              background:
                formData.acceptFees && !isSubmitting
                  ? "linear-gradient(to right, #034d92, #0487d9)"
                  : "#ccc",
              cursor:
                formData.acceptFees && !isSubmitting
                  ? "pointer"
                  : "not-allowed",
              opacity: formData.acceptFees && !isSubmitting ? 1 : 0.7,
              transition: "all 0.3s ease",
            }}
          >
            {isSubmitting ? "Submitting..." : "Accept & Continue"}
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderStep6 = () => (
    <motion.div
      key="step6"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
        {currentStep === 5 && renderStep5()}
        {currentStep === 6 && renderStep6()}
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

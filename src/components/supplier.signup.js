import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import inputLogo from "../assets/images/nameinput.png";
import emailLogo from "../assets/images/emailinput.png";
import location from "../assets/images/location.png";
import Select from "react-select";
import departmentLogo from "../assets/images/departmentLogo.png";
import websiteLogo from "../assets/images/websiteLogo.png";
import { signup } from "../services/authService";
import roleLogo from "../assets/images/roleLogo.png";
import thumbsLogo from "../assets/images/thumbsLogo.png";
import TermsModal from "./TermsModal";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { normalizeWebsiteUrl } from "../utils/urlUtils";

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
  { value: "crew", label: "Crew" },
  { value: "exterior", label: "Exterior" },
  { value: "engineering", label: "Engineering" },
  { value: "interior", label: "Interior" },
  { value: "galley", label: "Galley" },
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
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsConditionsModalOpen, setIsTermsConditionsModalOpen] = useState(false);

  // Ensure formData includes departments as an array
  const [localFormData, setLocalFormData] = useState({
    ...formData,
    departments: formData.departments || [],
  });

  // Add effect to update supplier type options when department changes
  useEffect(() => {
    if (formData.department && formData.department.value) {
      const departmentValue = formData.department.value;
      if (departmentSupplierTypes[departmentValue]) {
        // Reset the selected supplier type if it's not in the new options list
        if (formData.supplierType) {
          const typeExists = departmentSupplierTypes[departmentValue].some(
            (option) => option.value === formData.supplierType.value
          );

          if (!typeExists) {
            handleInputChange("supplierType", null);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.department]); // We're disabling the lint rule to prevent excessive rerenders

  // Update handleInputChange to use localFormData and propagate to parent
  const handleInputChange = (name, value) => {
    const updated = {
      ...localFormData,
      [name]: value,
    };
    setLocalFormData(updated);
    setFormData(updated);
  };

  const handleSignup = async () => {
    if (!formData.acceptTerms) {
      setError("Please accept the Supplier Agreement to continue.");
      return;
    }

    if (!formData.acceptPrivacyTerms) {
      setError("Please accept the Privacy Policy and Terms & Conditions to continue.");
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
      const getServiceAreaArray = () => {
        if (!formData.serviceArea) return [];
        if (formData.serviceArea.value === "Both") {
          return ["United States", "Mediterranean"];
        }
        return [formData.serviceArea.value];
      };
      const supplierDetails = {
        businessName: formData.businessName || "",
        departments: formData.departments?.map(dept => dept.value) || [],
        phone: formData.phone || "",
        address: formData.address || "",
        website: normalizeWebsiteUrl(formData.website || ""),
        serviceArea: getServiceAreaArray(),
        contactPerson: {
          fullName: formData.contactPerson?.fullName || "",
          role: formData.contactPerson?.role || "",
        },
      };

      formDataObj.append("supplierDetails", JSON.stringify(supplierDetails));

      const response = await signup(formDataObj);
      if (response.status) {
        setStep(4); // Go to success page
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
      {/* Back Navigation Button - Only on Step 1 */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            color: "#034D92",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            padding: "8px 0",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "#0487d9";
            e.target.style.transform = "translateX(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#034D92";
            e.target.style.transform = "translateX(0)";
          }}
        >
          <ArrowBackIcon style={{ fontSize: "18px" }} />
          Back
        </button>
      </div>

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
                value={localFormData.departments}
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
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "linear-gradient(to right, #023a7a, #0366b3)";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(3, 77, 146, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "linear-gradient(to right, #034d92, #0487d9)";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
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
            <PhoneInput
              country={"us"}
              value={formData.phone || ""}
              onChange={(value) => handleInputChange("phone", value)}
              inputStyle={{
                width: "100%",
                height: "100%",
                background: "transparent",
                border: "none",
                fontSize: "16px",
              }}
              containerStyle={{ width: "100%" }}
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
              placeholder="E.g. https://www.yourbusiness.com"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="button-group">
        <button
          className="prev-button"
          onClick={() => setStep(1)}
          style={{ 
            width: "48%", 
            background: "#f0f0f0",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#e0e0e0";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#f0f0f0";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          Previous
        </button>
        <button
          className="next-button"
          onClick={() => setStep(3)}
          style={{
            width: "48%",
            background: "linear-gradient(to right, #034d92, #0487d9)",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "linear-gradient(to right, #023a7a, #0366b3)";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(3, 77, 146, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "linear-gradient(to right, #034d92, #0487d9)";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
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
              placeholder="E.g. Owner, Manager, etc."
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

      {/* Supplier Agreement */}
      <div className="form-group1">
        <div className="input-field">
          <div
            className="checkbox-field" 
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "5px 0 2px 0"
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
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
              <label 
                htmlFor="terms" 
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#333",
                  margin: "0",
                  lineHeight: "1.4",
                  flex: 1
                }}
              >
                I agree to the{" "}
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    setIsTermsModalOpen(true);
                  }}
                  style={{
                    color: "#034D92",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#0487d9";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#034D92";
                  }}
                >
                  Supplier Agreement
                </span>
              </label>
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
                title="View Supplier Agreement"
              >
                <VisibilityIcon style={{ fontSize: "18px", color: "#034D92" }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Policy and Terms & Conditions */}
      <div className="form-group1">
        <div className="input-field">
          <div
            className="checkbox-field" 
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "5px 0 2px 0"
            }}
          >
            <input
              type="checkbox"
              id="privacyTerms"
              checked={formData.acceptPrivacyTerms}
              onChange={(e) => handleInputChange("acceptPrivacyTerms", e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                margin: "0",
                cursor: "pointer"
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
              <label 
                htmlFor="privacyTerms" 
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#333",
                  margin: "0",
                  lineHeight: "1.4",
                  flex: 1
                }}
              >
                I agree to the{" "}
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    setIsPrivacyModalOpen(true);
                  }}
                  style={{
                    color: "#034D92",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#0487d9";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#034D92";
                  }}
                >
                  Privacy Policy
                </span>
                {" "}and{" "}
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    setIsTermsConditionsModalOpen(true);
                  }}
                  style={{
                    color: "#034D92",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#0487d9";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#034D92";
                  }}
                >
                  Terms & Conditions
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
        <div className="button-group">
          <button
            className="prev-button"
          onClick={() => setStep(2)}
            style={{ 
              width: "48%", 
              background: "#f0f0f0",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#e0e0e0";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#f0f0f0";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
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
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.background = "linear-gradient(to right, #023a7a, #0366b3)";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 12px rgba(3, 77, 146, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.target.style.background = "linear-gradient(to right, #034d92, #0487d9)";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
          {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
      </div>

      {/* Terms Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        pdfUrl="/YCC Vendor Agreement.pdf"
        title="YCC Supplier Agreement"
        fileName="YCC-Supplier-Agreement.pdf"
      />

      {/* Privacy Policy Modal */}
      <TermsModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        pdfUrl="/Privacy-Policy.pdf"
        title="Yacht Crew Center Privacy Policy"
        fileName="YCC-Privacy-Policy.pdf"
      />

      {/* Terms and Conditions Modal */}
      <TermsModal
        isOpen={isTermsConditionsModalOpen}
        onClose={() => setIsTermsConditionsModalOpen(false)}
        pdfUrl="/Terms-and-Conditions.pdf"
        title="Yacht Crew Center Terms and Conditions"
        fileName="YCC-Terms-and-Conditions.pdf"
      />
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

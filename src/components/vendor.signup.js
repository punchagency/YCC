import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import inputLogo from "../assets/images/nameinput.png";
import emailLogo from "../assets/images/emailinput.png";
import location from "../assets/images/location.png";
import departmentLogo from "../assets/images/departmentLogo.png";
import websiteLogo from "../assets/images/websiteLogo.png";
import areaLogo from "../assets/images/areaLogo.png";
import roleLogo from "../assets/images/roleLogo.png";
import serviceLogo from "../assets/images/serviceLogo.png";
import { signup } from "../services/authService";
import thumbsLogo from "../assets/images/thumbsLogo.png";
import TermsModal from "./TermsModal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { normalizeWebsiteUrl } from "../utils/urlUtils";
import countryList from "react-select-country-list";

// Custom scrollbar styles for supplier and service provider forms
if (
  typeof window !== "undefined" &&
  !document.getElementById("custom-scrollbar-style-vendor")
) {
  const style = document.createElement("style");
  style.id = "custom-scrollbar-style-vendor";
  style.innerHTML = `
    .login-form.vendor-login-form::-webkit-scrollbar {
      width: 7px;
      background: transparent;
    }
    .login-form.vendor-login-form::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 8px;
    }
    .login-form.vendor-login-form::-webkit-scrollbar-thumb:hover {
      background: #b0b8c1;
    }
    .login-form.vendor-login-form {
      scrollbar-width: thin;
      scrollbar-color: #d1d5db transparent;
    }
  `;
  document.head.appendChild(style);
}

const VendorSignUpForm = ({ setStep, currentStep, formData, setFormData }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsConditionsModalOpen, setIsTermsConditionsModalOpen] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get country options with European countries prioritized
  const getCountryOptions = () => {
    const countries = countryList().getData();
    
    // Priority European countries to show first
    const priorityCountries = [
      'US', // United States
      'IT', // Italy
      'FR', // France
      'ES', // Spain
      'DE', // Germany
      'GB', // United Kingdom
      'NL', // Netherlands
      'CH', // Switzerland
      'AT', // Austria
      'BE', // Belgium
      'PT', // Portugal
      'GR', // Greece
      'SE', // Sweden
      'NO', // Norway
      'DK', // Denmark
      'FI', // Finland
      'IE', // Ireland
    ];
    
    // Create priority and regular country lists
    const priorityList = priorityCountries
      .map(code => countries.find(c => c.value === code))
      .filter(Boolean);
    
    const regularList = countries.filter(c => !priorityCountries.includes(c.value));
    
    // Return combined list with priority countries first
    return [...priorityList, ...regularList];
  };

  // Ensure email is always initialized in formData
  useEffect(() => {
    if (formData.email === undefined) {
      setFormData({ ...formData, email: "" });
    }
    // eslint-disable-next-line
  }, []);

  const handleSignup = async () => {
    // Password validation
    if (!formData.password || !formData.confirmPassword) {
      setError("Please enter and confirm your password.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!formData.acceptTerms) {
      setError("Please accept the Service Provider Agreement to continue.");
      return;
    }

    if (!formData.acceptPrivacyTerms) {
      setError(
        "Please accept the Privacy Policy and Terms & Conditions to continue."
      );
      return;
    }

    if (!formData.email || formData.email.trim() === "") {
      setError("Please enter a valid business contact email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid business contact email address.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formDataObj = new FormData();
      formDataObj.append("email", formData.email);
      formDataObj.append("role", "service_provider");
      formDataObj.append("password", formData.password);
      formDataObj.append("confirmPassword", formData.confirmPassword);
      formDataObj.append("businessName", formData.businessName);
      formDataObj.append("address", JSON.stringify(formData.address));
      formDataObj.append("phone", formData.phone);

      // Append files if they exist
      if (formData.licenseFile) {
        formDataObj.append("licenseFile", formData.licenseFile);
      }
      if (formData.taxId) {
        formDataObj.append("taxId", formData.taxId);
      }
      if (formData.liabilityInsurance) {
        formDataObj.append("liabilityInsurance", formData.liabilityInsurance);
      }

      const vendorDetails = {
        businessName: formData.businessName,
        address: formData.address,
        phone: formData.phone,
        businessWebsite: normalizeWebsiteUrl(formData.businessWebsite),
        departments: formData.departments?.map((dept) => dept.value) || [],
        services: formData.services?.map((service) => service.value),
        availability:
          formData.customAvailability ||
          (formData.availabilityDays?.label && formData.availabilityHours?.label
            ? `${formData.availabilityDays.label}, ${formData.availabilityHours.label}`
            : formData.availability),
        bookingMethod: formData.bookingMethod?.value,
        serviceArea:
          formData.serviceArea?.value === "both"
            ? ["United States", "Mediterranean"]
            : formData.serviceArea?.value
            ? [
                formData.serviceArea.value === "usa"
                  ? "United States"
                  : "Mediterranean",
              ]
            : [],
        contactPerson: {
          fullName: formData.contactPerson?.fullName,
          role: formData.contactPerson?.role,
        },
      };

      formDataObj.append("vendorDetails", JSON.stringify(vendorDetails));
      console.log("Email is being sent", formDataObj.email);

      console.log("Submitting vendor application with data:", {
        email: formDataObj.email,
        role: "service_provider",
        vendorDetails,
      });

      for (let pair of formDataObj.entries()) {
        console.log("Form Data:", pair[0], pair[1]);
      }

      const response = await signup(formDataObj);

      if (response.status === "success") {
        setIsSubmitting(false);
        // Move to step 6 after successful signup
        setStep(6);
      } else {
        setError("Failed to sign up. Please try again.");
      }
    } catch (error) {
      setError(error.message || "Failed to sign up. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const bookingMethodOptions = [
    { value: "instant booking", label: "Instant Booking" },
    { value: "request to book", label: "Request to Book" },
    { value: "quote request", label: "Quote Request" },
  ];

  const serviceAreaOptions = [
    { value: "usa", label: "United States" },
    { value: "mediterranean", label: "Mediterranean" },
    { value: "both", label: "Both" },
  ];

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const handleContactPersonChange = (field, value) => {
  //   setFormData({
  //     ...formData,
  //     contactPerson: {
  //       ...formData.contactPerson,
  //       [field]: value,
  //     },
  //   });
  // };

  const [licenseFile, setLicenseFile] = useState(null);
  const [taxIdFile, setTaxIdFile] = useState(null);
  const [insuranceFile, setInsuranceFile] = useState(null);

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    // Validate file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size should not exceed 10MB");
      return;
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF, JPG, or PNG file");
      return;
    }

    setError("");

    setIsSubmitting(true);
    try {
      // Simulate upload delay (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      switch (type) {
        case "license":
          setLicenseFile(file);
          handleInputChange("licenseFile", file);
          break;
        case "taxId":
          setTaxIdFile(file);
          handleInputChange("taxId", file);
          break;
        case "insurance":
          setInsuranceFile(file);
          handleInputChange("liabilityInsurance", file);
          break;
        default:
          setError("Invalid file type. Please try again.");
          return;
      }
    } catch (error) {
      setError("File upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define department-specific service options
  const departmentServiceOptions = {
    captain: [
      {
        value: "Vessel Management & Administration",
        label: "Vessel Management & Administration",
      },
      {
        value: "Maritime Legal & Compliance Assistance",
        label: "Maritime Legal & Compliance Assistance",
      },
      {
        value: "Crew Recruitment & Placement Services",
        label: "Crew Recruitment & Placement Services",
      },
      {
        value: "Customs & Immigration Assistance",
        label: "Customs & Immigration Assistance",
      },
      {
        value: "Insurance & Risk Management",
        label: "Insurance & Risk Management",
      },
      {
        value: "Security & Anti-Piracy Training",
        label: "Security & Anti-Piracy Training",
      },
      {
        value: "Safety Equipment Inspections & Compliance",
        label: "Safety Equipment Inspections & Compliance",
      },
      {
        value: "IT & Cybersecurity Services for Yachts",
        label: "IT & Cybersecurity Services for Yachts",
      },
      {
        value: "Charter & Itinerary Planning Assistance",
        label: "Charter & Itinerary Planning Assistance",
      },
      {
        value: "Satellite & Internet Connectivity Solutions",
        label: "Satellite & Internet Connectivity Solutions",
      },
    ],
    galley: [
      {
        value: "Fresh Produce & Gourmet Food Provisioning",
        label: "Fresh Produce & Gourmet Food Provisioning",
      },
      {
        value: "Butcher & Seafood Supply Services",
        label: "Butcher & Seafood Supply Services",
      },
      {
        value: "Specialty Ingredient Sourcing",
        label: "Specialty Ingredient Sourcing",
      },
      {
        value: "Custom Catering & Onboard Chef Services",
        label: "Custom Catering & Onboard Chef Services",
      },
      {
        value: "Galley Equipment Maintenance & Repair",
        label: "Galley Equipment Maintenance & Repair",
      },
      {
        value: "Wine, Spirits & Specialty Beverages Supply",
        label: "Wine, Spirits & Specialty Beverages Supply",
      },
      {
        value: "Specialty Coffee & Tea Provisioning",
        label: "Specialty Coffee & Tea Provisioning",
      },
      {
        value: "Dry & Frozen Goods Supply",
        label: "Dry & Frozen Goods Supply",
      },
      {
        value: "Galley Deep Cleaning & Sanitation Services",
        label: "Galley Deep Cleaning & Sanitation Services",
      },
      {
        value: "Kitchenware & Culinary Equipment Supply",
        label: "Kitchenware & Culinary Equipment Supply",
      },
    ],
    engineering: [
      {
        value: "Marine Engine Servicing & Repairs",
        label: "Marine Engine Servicing & Repairs",
      },
      {
        value: "Generator Installation & Maintenance",
        label: "Generator Installation & Maintenance",
      },
      {
        value: "HVAC & Refrigeration Services",
        label: "HVAC & Refrigeration Services",
      },
      {
        value: "Watermaker Installation & Repairs",
        label: "Watermaker Installation & Repairs",
      },
      {
        value: "Fuel System Cleaning & Maintenance",
        label: "Fuel System Cleaning & Maintenance",
      },
      {
        value: "Electrical System Troubleshooting",
        label: "Electrical System Troubleshooting",
      },
      {
        value: "Navigation & Communication System Setup",
        label: "Navigation & Communication System Setup",
      },
      {
        value: "Hydraulic System Servicing",
        label: "Hydraulic System Servicing",
      },
      {
        value: "Welding & Metal Fabrication Services",
        label: "Welding & Metal Fabrication Services",
      },
      {
        value: "Spare Parts Sourcing & Logistics",
        label: "Spare Parts Sourcing & Logistics",
      },
    ],
    interior: [
      {
        value: "Yacht Interior Cleaning & Housekeeping",
        label: "Yacht Interior Cleaning & Housekeeping",
      },
      {
        value: "Laundry & Dry Cleaning Services",
        label: "Laundry & Dry Cleaning Services",
      },
      {
        value: "Custom Interior Design & Refurbishment",
        label: "Custom Interior Design & Refurbishment",
      },
      {
        value: "Florist & Fresh Flower Arrangements",
        label: "Florist & Fresh Flower Arrangements",
      },
      {
        value: "Carpet & Upholstery Cleaning",
        label: "Carpet & Upholstery Cleaning",
      },
      {
        value: "Event & Party Planning Services",
        label: "Event & Party Planning Services",
      },
      {
        value: "Provisioning for Guest Supplies",
        label: "Provisioning for Guest Supplies",
      },
      {
        value: "Bar & Beverage Supply Services",
        label: "Bar & Beverage Supply Services",
      },
      {
        value: "AV & Entertainment System Installation",
        label: "AV & Entertainment System Installation",
      },
      {
        value: "Crew Uniform Tailoring & Embroidery",
        label: "Crew Uniform Tailoring & Embroidery",
      },
    ],
    exterior: [
      {
        value: "Yacht Detailing & Washdowns",
        label: "Yacht Detailing & Washdowns",
      },
      {
        value: "Teak Deck Sanding & Restoration",
        label: "Teak Deck Sanding & Restoration",
      },
      {
        value: "Varnishing & Paintwork Services",
        label: "Varnishing & Paintwork Services",
      },
      {
        value: "Fiberglass & Gelcoat Repairs",
        label: "Fiberglass & Gelcoat Repairs",
      },
      {
        value: "Docking & Line Handling Assistance",
        label: "Docking & Line Handling Assistance",
      },
      {
        value: "Diving & Underwater Hull Cleaning",
        label: "Diving & Underwater Hull Cleaning",
      },
      {
        value: "Fender & Rope Supply & Maintenance",
        label: "Fender & Rope Supply & Maintenance",
      },
      {
        value: "Tender & Jet Ski Servicing",
        label: "Tender & Jet Ski Servicing",
      },
      {
        value: "Watersports Equipment Rental & Repairs",
        label: "Watersports Equipment Rental & Repairs",
      },
      {
        value: "Exterior Upholstery & Canvas Work",
        label: "Exterior Upholstery & Canvas Work",
      },
    ],
    // Add options for other departments as needed
    default: [
      { value: "Mental Health Support", label: "Mental Health Support" },
      { value: "Confidential Therapy", label: "Confidential Therapy" },
      { value: "Career Guidance", label: "Career Guidance" },
      { value: "Legal Consultation", label: "Legal Consultation" },
      { value: "Financial Advisory", label: "Financial Advisory" },
    ],
  };

  // State to hold current service options
  const [serviceOptions, setServiceOptions] = useState(
    departmentServiceOptions.default
  );

  // Update service options when department changes
  useEffect(() => {
    if (formData.departments && formData.departments.length > 0) {
      // Combine service options from all selected departments
      let combinedOptions = [];
      const selectedDepartmentValues = formData.departments.map(
        (dept) => dept.value
      );

      selectedDepartmentValues.forEach((deptValue) => {
        if (departmentServiceOptions[deptValue]) {
          // Add services from this department if they're not already in the combined list
          departmentServiceOptions[deptValue].forEach((service) => {
            if (
              !combinedOptions.some((option) => option.value === service.value)
            ) {
              combinedOptions.push(service);
            }
          });
        }
      });

      if (combinedOptions.length > 0) {
        setServiceOptions(combinedOptions);
      } else {
        setServiceOptions(departmentServiceOptions.default);
      }

      // Reset the selected service if it's not in the new options list
      if (formData.services) {
        const serviceExists = combinedOptions.some(
          (option) => option.value === formData.services.value
        );

        if (!serviceExists) {
          handleInputChange("services", null);
        }
      }
    } else {
      setServiceOptions(departmentServiceOptions.default);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.departments]); // We're disabling the lint rule for clarity

  // Add a function to handle service selection with validation
  const handleServiceChange = (selectedOptions) => {
    setFormData({
      ...formData,
      services: selectedOptions,
    });
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
              alt="business name"
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
      <div className="form-group2">
        <div className="input-field">
          <div>
            <label>Business Address</label>
          </div>
          
          {/* Street Address */}
          <div className="inputBorder" style={{ marginBottom: "8px" }}>
            <img
              src={location}
              style={{ width: "12px", height: "12px" }}
              alt="street address"
            />
            <input
              type="text"
              placeholder="Street Address"
              value={formData.address?.street || ""}
              onChange={(e) =>
                handleInputChange("address", {
                  ...formData.address,
                  street: e.target.value
                })
              }
            />
          </div>
          
          {/* Street Address 2 */}
          <div className="inputBorder" style={{ marginBottom: "8px" }}>
            <img
              src={location}
              style={{ width: "12px", height: "12px" }}
              alt="street address 2"
            />
            <input
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
              value={formData.address?.street2 || ""}
              onChange={(e) =>
                handleInputChange("address", {
                  ...formData.address,
                  street2: e.target.value
                })
              }
            />
          </div>
          
          {/* City, State, ZIP */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <div className="inputBorder" style={{ flex: 2 }}>
              <input
                type="text"
                placeholder="City"
                value={formData.address?.city || ""}
                onChange={(e) =>
                  handleInputChange("address", {
                    ...formData.address,
                    city: e.target.value
                  })
                }
              />
            </div>
            <div className="inputBorder" style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="State"
                value={formData.address?.state || ""}
                onChange={(e) =>
                  handleInputChange("address", {
                    ...formData.address,
                    state: e.target.value
                  })
                }
              />
            </div>
            <div className="inputBorder" style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="ZIP Code"
                value={formData.address?.zip || ""}
                onChange={(e) =>
                  handleInputChange("address", {
                    ...formData.address,
                    zip: e.target.value
                  })
                }
              />
            </div>
          </div>
          
          {/* Country Select */}
          <div className="inputBorder">
            <Select
              options={getCountryOptions()}
              value={getCountryOptions().find(c => c.value === formData.address?.country)}
              onChange={(option) =>
                handleInputChange("address", {
                  ...formData.address,
                  country: option?.value || ""
                })
              }
              placeholder="Select Country"
              formatOptionLabel={(option) => (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px" }}>
                    {String.fromCodePoint(
                      ...option.value
                        .toUpperCase()
                        .split("")
                        .map(char => 127397 + char.charCodeAt())
                    )}
                  </span>
                  <span>{option.label}</span>
                </div>
              )}
              classNamePrefix="select"
              styles={{
                control: (provided) => ({
                  ...provided,
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
                menuList: (provided) => ({
                  ...provided,
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  display: "flex",
                  alignItems: "center",
                }),
                option: (provided) => ({
                  ...provided,
                  display: "flex",
                  alignItems: "center",
                }),
              }}
            />
          </div>
        </div>
      </div>

      {/* Department */}
      <div className="form-group-department">
        <div className="input-field">
          <div>
            <label>Department served</label>
          </div>
          <div className="inputBorder">
            <Select
              options={[
                { label: "Captain", value: "captain" },
                { label: "Crew", value: "crew" },
                { label: "Exterior", value: "exterior" },
                { label: "Interior", value: "interior" },
                { label: "Engineering", value: "engineering" },
                { label: "Galley", value: "galley" },
              ]}
              value={formData.departments}
              onChange={(options) => handleInputChange("departments", options)}
              placeholder={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={departmentLogo}
                    alt=""
                    style={{
                      width: "12px",
                      height: "12px",
                      marginRight: "8px",
                    }}
                  />
                  <span>Select Departments</span>
                </div>
              }
              isMulti={true}
              classNamePrefix="select"
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
                menuList: (provided) => ({
                  ...provided,
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  display: "flex",
                  alignItems: "center",
                }),
                option: (provided) => ({
                  ...provided,
                  display: "flex",
                  alignItems: "center",
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  width: "100%",
                }),
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: "#f0f7ff",
                  borderRadius: "4px",
                }),
                multiValueLabel: (provided) => ({
                  ...provided,
                  color: "#0387d9",
                  fontSize: "12px",
                }),
                multiValueRemove: (provided) => ({
                  ...provided,
                  color: "#0387d9",
                  ":hover": {
                    backgroundColor: "#d8e6f7",
                    color: "#0387d9",
                  },
                }),
              }}
            />
          </div>
        </div>
      </div>

      {/* Phone Number & Contact Email - Centralized and Balanced */}
      <div
        className="form-row centralized-contact-row"
        style={{
          display: "flex",
          gap: "24px",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto 8px auto",
          maxWidth: "600px",
        }}
      >
        {/* Phone Number */}
        <div className="form-group4" style={{ flex: 1, minWidth: 0 }}>
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
                value={formData.phone}
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

        {/* Contact Email */}
        <div className="form-group5" style={{ flex: 1, minWidth: 0 }}>
          <div className="input-field">
            <div>
              <label htmlFor="email">Contact Email</label>
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
                alt="email"
                style={{ width: "16px", height: "16px", marginRight: "8px" }}
              />
              <input
                type="email"
                id="email"
                required
                placeholder="Business Contact Email"
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

      {/* Website */}
      {/* <div className="form-group6">
        <div className="input-field">
          <div>
            <label htmlFor="website">Website</label>
          </div>
          <div className="inputBorder">
            <img src={websiteLogo} style={{ width: "12px", height: "12px" }} />
            <input
              type="url"
              id="website"
              placeholder="Enter Business Website"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
            />
          </div>
        </div>
      </div> */}

      {/* Website */}
      {/* Business Website */}
      <div className="website-group">
        <div className="input-field">
          <div>
            <label htmlFor="businessWebsite">Business Website</label>
          </div>
          <div className="website-input">
            <img
              src={websiteLogo}
              style={{ width: "12px", height: "12px" }}
              alt="business website"
            />
            <input
              type="url"
              id="businessWebsite"
              placeholder="E.g. https://www.yourbusiness.com"
              value={formData.businessWebsite}
              onChange={(e) =>
                handleInputChange("businessWebsite", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Update Next Button to go to Step 3 */}
      <div className="button-group">
        <button
          className="next-button"
          onClick={() => setStep(3)}
          style={{
            width: "100%",
            background: "linear-gradient(to right, #034d92, #0487d9)",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.background =
              "linear-gradient(to right, #023a7a, #0366b3)";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(3, 77, 146, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background =
              "linear-gradient(to right, #034d92, #0487d9)";
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
      {/* <div className="login-heading" style={{ marginTop: "0px" }}>
        <h2 className="font-medium mb-10">Service Details</h2>
        <p className="text-sm text-gray-600">
          Tell us about your services and pricing
        </p>
      </div> */}

      {/* Services Offered */}
      <div className="form-group-department">
        <div className="input-field">
          <div>
            <label>Services Offered</label>
          </div>
          <div className="inputBorder">
            <Select
              options={serviceOptions}
              value={formData.services}
              onChange={handleServiceChange}
              placeholder={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={serviceLogo}
                    alt="Service Icon"
                    style={{
                      width: "12px",
                      height: "12px",
                      marginRight: "8px",
                    }}
                  />
                  <span>Select Services</span>
                </div>
              }
              isMulti={true}
              classNamePrefix="select"
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
                menuList: (provided) => ({
                  ...provided,
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  display: "flex",
                  alignItems: "center",
                }),
                option: (provided) => ({
                  ...provided,
                  display: "flex",
                  alignItems: "center",
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  width: "100%",
                }),
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: "#f0f7ff",
                  borderRadius: "4px",
                }),
                multiValueLabel: (provided) => ({
                  ...provided,
                  color: "#0387d9",
                  fontSize: "12px",
                }),
                multiValueRemove: (provided) => ({
                  ...provided,
                  color: "#0387d9",
                  ":hover": {
                    backgroundColor: "#d8e6f7",
                    color: "#0387d9",
                  },
                }),
              }}
            />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="form-group1">
        <div className="input-field">
          <div>
            <label htmlFor="availability">Availability</label>
          </div>
          <div
            className="inputBorder"
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 0,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <Select
                options={[
                  { value: "mon-fri", label: "Monday - Friday" },
                  { value: "mon-sat", label: "Monday - Saturday" },
                  { value: "mon-sun", label: "Monday - Sunday" },
                  { value: "tue-sat", label: "Tuesday - Saturday" },
                  { value: "wed-sun", label: "Wednesday - Sunday" },
                  { value: "thu-mon", label: "Thursday - Monday" },
                  { value: "fri-tue", label: "Friday - Tuesday" },
                  { value: "sat-wed", label: "Saturday - Wednesday" },
                  { value: "sun-thu", label: "Sunday - Thursday" },
                  { value: "custom", label: "Custom Schedule" },
                ]}
                value={formData.availabilityDays}
                onChange={(option) =>
                  handleInputChange("availabilityDays", option)
                }
                placeholder="Select days"
                classNamePrefix="select"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                  }),
                  container: (provided) => ({
                    ...provided,
                    width: "100%",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    width: "100%",
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    display: "flex",
                    alignItems: "center",
                  }),
                  option: (provided) => ({
                    ...provided,
                    display: "flex",
                    alignItems: "center",
                  }),
                  valueContainer: (provided) => ({
                    ...provided,
                    width: "100%",
                  }),
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Select
                options={[
                  { value: "9am-5pm", label: "9:00 AM - 5:00 PM" },
                  { value: "8am-6pm", label: "8:00 AM - 6:00 PM" },
                  { value: "7am-7pm", label: "7:00 AM - 7:00 PM" },
                  { value: "10am-4pm", label: "10:00 AM - 4:00 PM" },
                  { value: "24/7", label: "24/7 Available" },
                  { value: "custom", label: "Custom Hours" },
                ]}
                value={formData.availabilityHours}
                onChange={(option) =>
                  handleInputChange("availabilityHours", option)
                }
                placeholder="Select hours"
                classNamePrefix="select"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                  }),
                  container: (provided) => ({
                    ...provided,
                    width: "100%",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    width: "100%",
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    display: "flex",
                    alignItems: "center",
                  }),
                  option: (provided) => ({
                    ...provided,
                    display: "flex",
                    alignItems: "center",
                  }),
                  valueContainer: (provided) => ({
                    ...provided,
                    width: "100%",
                  }),
                }}
              />
            </div>
          </div>
          {/* Custom availability input for when users select custom */}
          {(formData.availabilityDays?.value === "custom" ||
            formData.availabilityHours?.value === "custom") && (
            <div style={{ marginTop: "12px" }}>
              <input
                type="text"
                placeholder="Enter custom availability (e.g., Mon-Fri 9AM-5PM, Sat 10AM-2PM)"
                value={formData.customAvailability || ""}
                onChange={(e) =>
                  handleInputChange("customAvailability", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
            </div>
          )}
        </div>
      </div>
      {/* Booking Method */}
      {/* Booking Method */}
      <div className="form-group-department">
        <div className="input-field">
          <div>
            <label>Booking Method</label>
          </div>
          <div className="inputBorder">
            <Select
              options={bookingMethodOptions}
              value={formData.bookingMethod}
              onChange={(option) => handleInputChange("bookingMethod", option)}
              placeholder={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={departmentLogo}
                    alt=""
                    style={{
                      width: "12px",
                      height: "12px",
                      marginRight: "8px",
                    }}
                  />
                  <span>Select Booking Method</span>
                </div>
              }
              classNamePrefix="select"
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
                menuList: (provided) => ({
                  ...provided,
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  display: "flex",
                  alignItems: "center",
                }),
                option: (provided) => ({
                  ...provided,
                  display: "flex",
                  alignItems: "center",
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  width: "100%",
                }),
              }}
            />
          </div>
        </div>
      </div>

      {/* Service Area */}
      <div className="form-group-department">
        <div className="input-field">
          <div>
            <label>Service Area</label>
          </div>
          <div className="inputBorder">
            <Select
              options={serviceAreaOptions}
              value={formData.serviceArea}
              onChange={(option) => handleInputChange("serviceArea", option)}
              placeholder={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={areaLogo}
                    alt=""
                    style={{
                      width: "12px",
                      height: "12px",
                      marginRight: "8px",
                    }}
                  />
                  <span>Select Service Area</span>
                </div>
              }
              classNamePrefix="select"
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
                  position: "relative",
                  zIndex: 2,
                }),
                menu: (provided) => ({
                  ...provided,
                  width: "100%",
                  zIndex: 9999,
                  backgroundColor: "white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  position: "absolute",
                }),
                menuList: (provided) => ({
                  ...provided,
                  maxHeight: "200px",
                  padding: "8px 0",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                    display: "block",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#555",
                  },
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? "#f0f7ff" : "white",
                  color: state.isSelected ? "#0387d9" : "#333",
                  padding: "10px 12px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f0f7ff",
                    color: "#0387d9",
                  },
                }),
                singleValue: (provided) => ({
                  ...provided,
                  display: "flex",
                  alignItems: "center",
                  color: "#333",
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  width: "100%",
                  padding: "0 8px",
                }),
              }}
            />
          </div>
        </div>
      </div>

      {/* Update Navigation Buttons */}
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
          onClick={() => setStep(4)}
          style={{
            width: "48%",
            background: "linear-gradient(to right, #034d92, #0487d9)",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.background =
              "linear-gradient(to right, #023a7a, #0366b3)";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(3, 77, 146, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background =
              "linear-gradient(to right, #034d92, #0487d9)";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          Next
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
      {/* Password */}
      <div className="form-group1">
        <div className="input-field">
          <div>
            <label htmlFor="password">Password</label>
          </div>
          <div className="inputBorder" style={{ position: "relative" }}>
            <img
              src={inputLogo}
              style={{ width: "12px", height: "12px" }}
              alt="password"
            />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password || ""}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Enter password"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
              }}
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                outline: "none",
                display: "flex",
                alignItems: "center",
              }}
              tabIndex={-1}
            >
              {showPassword ? (
                <VisibilityOffIcon style={{ fontSize: 18, color: "#034D92" }} />
              ) : (
                <VisibilityIcon style={{ fontSize: 18, color: "#034D92" }} />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Confirm Password */}
      <div className="form-group1">
        <div className="input-field">
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>
          <div className="inputBorder" style={{ position: "relative" }}>
            <img
              src={inputLogo}
              style={{ width: "12px", height: "12px" }}
              alt="confirm password"
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={formData.confirmPassword || ""}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              placeholder="Confirm password"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
              }}
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                outline: "none",
                display: "flex",
                alignItems: "center",
              }}
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <VisibilityOffIcon style={{ fontSize: 18, color: "#034D92" }} />
              ) : (
                <VisibilityIcon style={{ fontSize: 18, color: "#034D92" }} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Platform Fees Information */}
      {/* // Platform fees note and related UI removed as per client request */}

      {/* Service Provider Agreement checkbox */}
      <div className="form-group1">
        <div className="input-field">
          <div
            className="checkbox-field"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "5px 0",
            }}
          >
            <input
              type="checkbox"
              id="terms"
              checked={formData.acceptTerms}
              onChange={(e) =>
                handleInputChange("acceptTerms", e.target.checked)
              }
              style={{
                width: "18px",
                height: "18px",
                margin: "0",
                cursor: "pointer",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: 1,
              }}
            >
              <label
                htmlFor="terms"
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#333",
                  margin: "0",
                  lineHeight: "1.4",
                  flex: 1,
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
                  Service Provider Agreement
                </span>
              </label>
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
              padding: "5px 0",
            }}
          >
            <input
              type="checkbox"
              id="privacyTerms"
              checked={formData.acceptPrivacyTerms}
              onChange={(e) =>
                handleInputChange("acceptPrivacyTerms", e.target.checked)
              }
              style={{
                width: "18px",
                height: "18px",
                margin: "0",
                cursor: "pointer",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: 1,
              }}
            >
              <label
                htmlFor="privacyTerms"
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#333",
                  margin: "0",
                  lineHeight: "1.4",
                  flex: 1,
                }}
              >
                I agree to the{" "}
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/privacy-policy");
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
                </span>{" "}
                and{" "}
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/terms-and-conditions");
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
          onClick={() => setStep(3)}
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
            background: isSubmitting
              ? "#ccc"
              : "linear-gradient(to right, #034d92, #0487d9)",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.7 : 1,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.target.style.background =
                "linear-gradient(to right, #023a7a, #0366b3)";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 12px rgba(3, 77, 146, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.target.style.background =
                "linear-gradient(to right, #034d92, #0487d9)";
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
        pdfUrl="/YCC Service Provider Agreement.pdf"
        title="YCC Service Provider Agreement"
        fileName="YCC-Service-Provider-Agreement.pdf"
      />

      {/* Privacy Policy Modal */}
      <TermsModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        pdfUrl="/privacy-policy"
        title="Yacht Crew Center Privacy Policy"
        fileName="YCC-Privacy-Policy.pdf"
      />

      {/* Terms and Conditions Modal */}
      <TermsModal
        isOpen={isTermsConditionsModalOpen}
        onClose={() => setIsTermsConditionsModalOpen(false)}
        pdfUrl="/terms-and-conditions"
        title="Yacht Crew Center Terms and Conditions"
        fileName="YCC-Terms-and-Conditions.pdf"
      />
    </motion.div>
  );

  // Add renderStep6 for success message
  const renderStep6 = () => (
    <motion.div
      key="step7"
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
        <img src={thumbsLogo} alt="thumbsLogo" />
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
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
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

export default VendorSignUpForm;

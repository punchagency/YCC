import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import inputLogo from "../assets/images/nameinput.png";
import emailLogo from "../assets/images/emailinput.png";
import location from "../assets/images/location.png";
import departmentLogo from "../assets/images/departmentLogo.png";
import websiteLogo from "../assets/images/websiteLogo.png";
import availabilityLogo from "../assets/images/availablityLogo.png";
import areaLogo from "../assets/images/areaLogo.png";
import roleLogo from "../assets/images/roleLogo.png";
import uploadfileLogo from "../assets/images/uploadfileLogo.png";
import serviceLogo from "../assets/images/serviceLogo.png";
import { signup } from "../services/authService";
import thumbsLogo from "../assets/images/thumbsLogo.png";

const VendorSignUpForm = ({ setStep, currentStep, formData, setFormData }) => {
  // const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [setSuccess] = useState(false);

  // Add stepData object
  const stepData = {
    1: {
      step: "Step 1",
      info: "Business Information",
    },
    2: {
      step: "Step 2",
      info: "Service & Pricing Information",
    },
    3: {
      step: "Step 3",
      info: "Company Representative Information & Terms",
    },
    4: {
      step: "Step 4",
      info: "Submit Application",
    },
    6: {
      step: "Success",
      info: "Application Submitted",
    },
  };

  const handleSignup = async () => {
    if (!formData.acceptTerms) {
      setError("Please accept the Terms and Conditions to continue.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formDataObj = new FormData();
      formDataObj.append("email", formData.email);
      formDataObj.append("role", "service_provider");
      formDataObj.append("businessName", formData.businessName);
      formDataObj.append("businessAddress", formData.businessAddress);
      formDataObj.append("department", formData.department);
      formDataObj.append("phone", formData.phone);

      const tempPassword = Math.random().toString(36).slice(-8);
      formDataObj.append("password", tempPassword);
      formDataObj.append("confirmPassword", tempPassword);

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
      if (formData.pricingStructure) {
        formDataObj.append("pricingStructure", formData.pricingStructure);
      }

      const vendorDetails = {
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
        phone: formData.phone,
        businessWebsite: formData.businessWebsite,
        department: formData.department?.value,
        services: formData.services?.map(service => service.value),
        availability: formData.availability,
        bookingMethod: formData.bookingMethod?.value,
        serviceArea: formData.serviceArea?.value,
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
        setSuccess(true);
        setIsSubmitting(false);
        // Move to step 6 after successful signup
        setTimeout(() => {
          setStep(6);
        }, 2000);
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
    { value: "both", label: "Both Areas" },
  ];

  const departmentOptions = [
    { value: "captain", label: "Captain" },
    { value: "crew", label: "Crew" },
    { value: "exterior", label: "Exterior" },
    { value: "engineering", label: "Engineering" },
    { value: "interior", label: "Interior" },
    { value: "galley", label: "Galley" },
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
  const [setIsUploading] = useState(null);
  const [pricingFile, setPricingFile] = useState(null);
  const [setFileUploading] = useState({
    licenseFile: false,
    taxIdFile: false,
    insuranceFile: false,
    pricingFile: false,
  });

  const [setFileErrors] = useState({
    licenseFile: "",
    taxIdFile: "",
    insuranceFile: "",
    pricingFile: "",
  });

  // File upload handlers
  const handleFileUpload = async (file, type) => {
    if (!file) return;

    setFileErrors((prev) => ({ ...prev, [type]: "" }));

    // Validate file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size should not exceed 10MB");
      return;
    }

    // Validate file type
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF, JPG, or PNG file");
      return;
    }

    setError("");

    // Start loading for this file type
    setFileUploading((prev) => ({ ...prev, [type]: true }));

    setIsUploading(true);
    try {
      // Simulate upload delay (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      switch (type) {
        case "pricing":
          setPricingFile(file);
          handleInputChange("pricingStructure", file);
          break;
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
      setIsUploading(false);
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
            <label htmlFor="businessAddress">Business Address</label>
          </div>
          <div className="inputBorder">
            <img
              src={location}
              style={{ width: "12px", height: "12px" }}
              alt="business address"
            />
            <input
              type="text"
              id="businessAddress"
              placeholder="Enter Business Address"
              value={formData.businessAddress}
              onChange={(e) =>
                handleInputChange("businessAddress", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Department */}
      <div className="form-group-department">
        <div className="input-field">
          <div>
            <label>Department</label>
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

      {/* Phone Number */}
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
        <div className="form-group4" style={{ flex: "1" }}>
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
                  fontSize: "16px", // Same size for consistency
                }}
                containerStyle={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div
          className="form-group5"
          style={{ flex: "1", marginBottom: "27px" }}
        >
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
                placeholder="Enter Business Email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  border: "none",
                  fontSize: "16px", // Same as phone input
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
              placeholder="Enter Business Website"
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
      {/* <div className="login-heading" style={{ marginTop: "0px" }}>
        <h2 className="font-medium mb-10">Document Upload</h2>
        <p className="text-sm text-gray-600">
          Please upload the required documents below
        </p>
      </div> */}

      {/* License Upload */}
      <div className="upload-group">
        <div className="input-field">
          <label>Business License</label>
          <div className="upload-input">
            <input
              type="text"
              placeholder="Upload Business License"
              value={licenseFile ? licenseFile.name : ""}
              readOnly
            />
            <img
              src={uploadfileLogo}
              alt="Upload"
              className="upload-icon"
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
          <div className="upload-input">
            <input
              type="text"
              placeholder="Upload Tax ID Document"
              value={taxIdFile ? taxIdFile.name : ""}
              readOnly
            />
            <img
              src={uploadfileLogo}
              alt="Upload"
              className="upload-icon"
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
          <div className="upload-input">
            <input
              type="text"
              placeholder="Upload Liability Insurance"
              value={insuranceFile ? insuranceFile.name : ""}
              readOnly
            />
            <img
              src={uploadfileLogo}
              alt="Upload"
              className="upload-icon"
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

  // Step 3: Services and Pricing
  const renderStep3 = () => (
    <motion.div
      key="step3"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
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

      {/* Pricing Structure */}
      {/* Pricing Structure */}
      <div className="upload-group">
        <div className="input-field">
          <label>Pricing Structure</label>
          <div className="upload-input">
            <input
              type="text"
              placeholder="Upload Pricing Structure"
              value={pricingFile ? pricingFile.name : ""}
              readOnly
            />
            <img
              src={uploadfileLogo}
              alt="Upload"
              className="upload-icon"
              onClick={() => document.getElementById("pricingInput").click()}
            />
            <input
              type="file"
              id="pricingInput"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e.target.files[0], "pricing")}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </div>
      {/* Availability */}
      {/* Availability */}
      <div className="form-group1">
        <div className="input-field">
          <div>
            <label htmlFor="availability">Availability</label>
          </div>
          <div className="inputBorder">
            <img
              src={availabilityLogo}
              style={{ width: "12px", height: "12px" }}
              alt="availability"
            />
            <input
              type="text"
              id="availability"
              placeholder="e.g., Mon-Fri 9AM-5PM"
              value={formData.availability}
              onChange={(e) =>
                handleInputChange("availability", e.target.value)
              }
            />
          </div>
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

      {/* Update Navigation Buttons */}
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
          onClick={() => setStep(4)}
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
  const renderStep4 = () => (
    <motion.div
      key="step4"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="form-group">
        <div>
          <label htmlFor="contactPersonName">Contact Person Name</label>
        </div>
        <div className="input-container">
          <img src={inputLogo} alt="Name Icon" className="input-icon" />
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

      <div className="form-group">
        <div>
          <label htmlFor="contactPersonRole">Contact Person Role</label>
        </div>
        <div className="input-container">
          <img src={roleLogo} alt="Role Icon" className="input-icon" />
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

      {/* Add Terms and Conditions checkbox */}
      <div className="form-group">
        <div className="checkbox-field" style={{ marginTop: "20px" }}>
          <input
            type="checkbox"
            id="terms"
            checked={formData.acceptTerms}
            onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
            style={{ marginRight: "10px" }}
          />
          <label htmlFor="terms">I agree to the Terms and Conditions</label>
        </div>
      </div>

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
          onClick={handleSignup}
          style={{
            width: "48%",
            background: "linear-gradient(to right, #034d92, #0487d9)",
          }}
        >
          Submit Application
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
            <li>
              Vendors may be charged either a 2% transaction fee per invoice or
              5% per invoice fee for premium visibility.
            </li>
            <li>Your fee structure will be finalized during onborading.</li>
            <li>
              Bookings and your order are processed through our AI-powered
              system.
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

        {/* Error Message */}
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
    </motion.div>
  );

  // Add renderStep6 for success message
  const renderStep6 = () => (
    <motion.div
      key="step7"
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

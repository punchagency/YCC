import React, { useState, useRef, useEffect, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { createBooking } from "../../../services/crew/crewBookingService";
import { getAllServices } from "../../../services/service/serviceService";
import { useToast } from "../../../components/Toast";

const CreateBooking = () => {
  const { showSuccess, showError } = useToast();
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    deliveryAddress: "",
    phoneNumber: "",
    deliveryDate: null,
  });

  // Fetch vendors when modal opens
  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllServices();
      if (response.status) {
        // Extract unique vendors from services
        const uniqueVendors = response.data.reduce((acc, service) => {
          const vendor = service.vendor;
          if (vendor && !acc.find((v) => v._id === vendor._id)) {
            acc.push({
              _id: vendor._id,
              businessName: vendor.businessName,
              businessAddress: vendor.serviceAreas || "Not specified",
              email: vendor.email,
              phoneNumber: vendor.phoneNumber,
              businessType: vendor.businessType,
              services: [service],
              user: vendor.user,
            });
          } else if (vendor) {
            const existingVendor = acc.find((v) => v._id === vendor._id);
            if (existingVendor) {
              existingVendor.services.push(service);
            }
          }
          return acc;
        }, []);
        setVendors(uniqueVendors);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      showError("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Handle vendor selection
  const handleVendorSelect = useCallback((vendor) => {
    setSelectedVendor(vendor);
    setShowVendorModal(false);
    setShowServicesModal(true);
  }, []);

  // Handle service booking
  const handleServiceBook = useCallback((service) => {
    setSelectedService(service);
    setShowServicesModal(false);
    setShowBookingDetailsModal(true);
  }, []);

  // Handle booking details change
  const handleBookingDetailsChange = useCallback((field, value) => {
    setBookingDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Handle closing services modal
  const handleCloseServicesModal = useCallback(() => {
    setShowServicesModal(false);
    setShowVendorModal(true);
  }, []);

  // Handle create booking
  const handleCreateBooking = useCallback(async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (
        !selectedService ||
        !bookingDetails.deliveryAddress ||
        !bookingDetails.phoneNumber ||
        !bookingDetails.deliveryDate
      ) {
        showError("Please fill in all required fields");
        return;
      }

      // Create booking data object
      const bookingData = {
        services: [
          {
            service: selectedService._id,
            notes: "No additional notes",
          },
        ],
        vendorAssigned: selectedVendor._id,
        vendorName: selectedVendor.businessName,
        vendorLocation: Array.isArray(selectedVendor.businessAddress)
          ? selectedVendor.businessAddress.join(", ")
          : selectedVendor.businessAddress || "Not specified",
        dateTime: bookingDetails.deliveryDate,
        serviceLocation: bookingDetails.deliveryAddress,
        contactPhone: bookingDetails.phoneNumber,
        bookingStatus: "pending",
      };

      console.log("Creating booking with data:", bookingData);

      const response = await createBooking(bookingData);

      if (response.status) {
        showSuccess("Booking created successfully");
        setShowBookingDetailsModal(false);
        setSelectedService(null);
        setSelectedVendor(null);
        setBookingDetails({
          deliveryAddress: "",
          phoneNumber: "",
          deliveryDate: null,
        });
      } else {
        showError(response.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      showError("An error occurred while creating the booking");
    } finally {
      setLoading(false);
    }
  }, [selectedService, selectedVendor, bookingDetails, showSuccess, showError]);

  // Fetch vendors when vendor modal opens
  useEffect(() => {
    if (showVendorModal) {
      fetchVendors();
    }
  }, [showVendorModal, fetchVendors]);

  return (
    <>
      <div style={{ width: "100%", backgroundColor: "white" }}>
        <div
          className="flex justify-content-between align-items-center"
          style={{ padding: "15px 30px" }}
        >
          <h2>Booking</h2>
          <button
            style={{
              backgroundColor: "#0387D9",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              border: "1px solid #0387D9",
            }}
            onClick={() => setShowVendorModal(true)}
          >
            Create Booking
          </button>
        </div>
      </div>

      {/* Vendor Selection Modal */}
      <Dialog
        visible={showVendorModal}
        onHide={() => setShowVendorModal(false)}
        style={{ width: "80vw", maxWidth: "800px" }}
        header="Select Vendor"
        className="vendor-dialog"
      >
        <div className="p-fluid grid">
          {loading ? (
            <div className="col-12 text-center">Loading vendors...</div>
          ) : vendors.length === 0 ? (
            <div className="col-12 text-center">No vendors available</div>
          ) : (
            vendors.map((vendor) => (
              <div key={vendor._id} className="col-12 md:col-6 lg:col-4">
                <div
                  className="vendor-card"
                  style={{
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    backgroundColor: "white",
                  }}
                >
                  <h3 style={{ marginBottom: "10px" }}>
                    {vendor.businessName}
                  </h3>
                  <p style={{ marginBottom: "5px", color: "#666" }}>
                    <strong>Type:</strong> {vendor.businessType}
                  </p>
                  <p style={{ marginBottom: "5px", color: "#666" }}>
                    <strong>Location:</strong> {vendor.businessAddress}
                  </p>
                  <p style={{ marginBottom: "5px", color: "#666" }}>
                    <strong>Contact:</strong> {vendor.email}
                  </p>
                  <p style={{ marginBottom: "15px", color: "#666" }}>
                    <strong>Phone:</strong> {vendor.phoneNumber}
                  </p>
                  <Button
                    label="See Services"
                    onClick={() => handleVendorSelect(vendor)}
                    className="p-button-primary"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </Dialog>

      {/* Services Modal */}
      <Dialog
        visible={showServicesModal}
        onHide={handleCloseServicesModal}
        style={{ width: "80vw", maxWidth: "800px" }}
        header={`${selectedVendor?.businessName}'s Services`}
        className="services-dialog"
      >
        <div className="p-fluid grid">
          {selectedVendor?.services?.map((service) => (
            <div key={service._id} className="col-12 md:col-6 lg:col-4">
              <div
                className="service-card"
                style={{
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  backgroundColor: "white",
                }}
              >
                <h3 style={{ marginBottom: "10px" }}>{service.name}</h3>
                <p style={{ marginBottom: "15px", color: "#666" }}>
                  {service.description || "No description available"}
                </p>
                <Button
                  label="Book Now"
                  onClick={() => handleServiceBook(service)}
                  className="p-button-primary"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </Dialog>

      {/* Booking Details Modal */}
      <Dialog
        visible={showBookingDetailsModal}
        onHide={() => setShowBookingDetailsModal(false)}
        style={{ width: "80vw", maxWidth: "800px" }}
        header="Booking Details"
        className="booking-details-dialog"
      >
        <div className="p-fluid grid formgrid">
          <div className="col-12 field">
            <label htmlFor="serviceName">Service</label>
            <InputText
              id="serviceName"
              value={selectedService?.name || ""}
              disabled
            />
          </div>

          <div className="col-12 field">
            <label htmlFor="vendorName">Vendor</label>
            <InputText
              id="vendorName"
              value={selectedVendor?.businessName || ""}
              disabled
            />
          </div>

          <div className="col-12 field">
            <label htmlFor="deliveryAddress">Delivery Address*</label>
            <InputText
              id="deliveryAddress"
              value={bookingDetails.deliveryAddress}
              onChange={(e) =>
                handleBookingDetailsChange("deliveryAddress", e.target.value)
              }
              placeholder="Enter delivery address"
            />
          </div>

          <div className="col-12 field">
            <label htmlFor="phoneNumber">Phone Number*</label>
            <InputText
              id="phoneNumber"
              value={bookingDetails.phoneNumber}
              onChange={(e) =>
                handleBookingDetailsChange("phoneNumber", e.target.value)
              }
              placeholder="Enter phone number"
            />
          </div>

          <div className="col-12 field">
            <label htmlFor="deliveryDate">Delivery Date*</label>
            <Calendar
              id="deliveryDate"
              value={bookingDetails.deliveryDate}
              onChange={(e) =>
                handleBookingDetailsChange("deliveryDate", e.value)
              }
              showTime
              placeholder="Select delivery date and time"
            />
          </div>
        </div>

        <div
          className="dialog-footer"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          <Button
            label="Cancel"
            icon="pi pi-times"
            onClick={() => setShowBookingDetailsModal(false)}
            className="p-button-danger"
            style={{ backgroundColor: "#EF4444", border: "none" }}
          />
          <Button
            label="Create Booking"
            icon="pi pi-check"
            onClick={handleCreateBooking}
            loading={loading}
            style={{ backgroundColor: "#0387D9", border: "none" }}
          />
        </div>
      </Dialog>
    </>
  );
};

export default CreateBooking;

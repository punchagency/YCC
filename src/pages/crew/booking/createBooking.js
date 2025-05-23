import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { createBooking } from "../../../services/crew/crewBookingService";
import { getServices } from "../../../services/crew/crewServiceService";

const CreateBooking = () => {
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [fetchingServices, setFetchingServices] = useState(false);
  const toast = useRef(null);

  // State for new booking form
  const [newBooking, setNewBooking] = useState({
    serviceType: "",
    vendorAssigned: "",
    vesselLocation: "",
    dateTime: null,
    bookingStatus: "pending",
    internalNotes: "",
  });

  // Fetch services when modal opens
  const fetchServices = async () => {
    try {
      setFetchingServices(true);
      console.log("Fetching services...");

      const response = await getServices();
      console.log("Services response:", response);

      if (response.status) {
        const allServices = [];

        const vendors = response.data.data;
        console.log("Vendors array:", vendors);

        if (Array.isArray(vendors)) {
          vendors.forEach((vendor) => {
            if (vendor.services && vendor.services.length > 0) {
              console.log(
                `Vendor "${vendor.businessName}" has ${vendor.services.length} services`
              );
              vendor.services.forEach((service) => {
                allServices.push({
                  ...service,
                  vendorName: vendor.businessName,
                  vendorId: vendor._id,
                });
              });
            } else {
              console.log(`Vendor "${vendor.businessName}" has no services`);
            }
          });

          console.log("Processed services:", allServices);
          setServices(allServices);
        } else {
          console.error("Vendors is not an array:", vendors);
          showError("Failed to load services: Invalid data format");
        }
      } else {
        showError("Failed to load services");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      showError("An error occurred while loading services");
    } finally {
      setFetchingServices(false);
    }
  };

  // Format services for dropdown
  // Format services for dropdown
  const getFormattedServices = () => {
    console.log("Formatting services for dropdown:", services);
    return services.map((service) => ({
      label: service.name || "Unknown Service",
      value: service._id,
      vendorName: service.vendorName || "Unknown Vendor",
      vendorId: service.vendorId,
      price: service.price || 0,
    }));
  };

  // Handle input changes for new booking form
  const handleNewBookingChange = (field, value) => {
    setNewBooking((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Show success toast
  const showSuccess = (message) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };

  // Show error toast
  const showError = (message) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 3000,
    });
  };

  // Handle create booking
  const handleCreateBooking = async () => {
    try {
      // Validate form
      if (!newBooking.serviceType) {
        showError("Please select a service");
        return;
      }

      if (!newBooking.vesselLocation) {
        showError("Please enter vessel location");
        return;
      }

      if (!newBooking.dateTime) {
        showError("Please select a date and time");
        return;
      }

      setLoading(true);

      // Get selected service details
      const selectedService = getFormattedServices().find(
        (s) => s.value === newBooking.serviceType
      );

      console.log("Selected service for booking:", selectedService);

      // Prepare booking data in the format that matches Postman
      const bookingData = {
        services: [
          {
            service: newBooking.serviceType, // This is the service ID
            notes: newBooking.internalNotes || "No notes provided",
          },
        ],
        vendorAssigned: selectedService?.vendorId,
        vendorName: selectedService?.vendorName || "Unknown Vendor",
        vendorLocation: "Vendor's Business Address", // Change this from empty string to a valid value
        dateTime: newBooking.dateTime.toISOString(),
        internalNotes: newBooking.internalNotes || "",
        serviceLocation: newBooking.vesselLocation, // This is what your API expects
        contactPhone: "+1234567890", // Add a default phone or make this a form field
        bookingStatus: newBooking.bookingStatus || "pending",
      };

      console.log(
        "Creating booking with data:",
        JSON.stringify(bookingData, null, 2)
      );

      const response = await createBooking(bookingData);
      console.log("Create booking response:", response);

      if (response.status) {
        showSuccess("Booking created successfully");
        console.log("Booking created successfully:", response.data);

        // Close modal and reset form
        setShowAddBookingModal(false);
        setNewBooking({
          serviceType: "",
          vendorAssigned: "",
          vesselLocation: "",
          dateTime: null,
          bookingStatus: "pending",
          internalNotes: "",
        });
      } else {
        console.error("Failed to create booking:", response.error);
        showError(response.error || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error in handleCreateBooking:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
      showError(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  // Open modal and fetch services
  const openBookingModal = () => {
    setShowAddBookingModal(true);
    fetchServices();
  };

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
            onClick={openBookingModal}
          >
            Create Booking
          </button>
        </div>
      </div>

      {/* Add Booking Modal */}
      <Dialog
        visible={showAddBookingModal}
        onHide={() => setShowAddBookingModal(false)}
        style={{ width: "80vw", maxWidth: "800px" }}
        header="Add New Booking"
        className="booking-dialog"
      >
        <div className="p-fluid grid formgrid">
          <div className="col-12 md:col-6 field">
            <label htmlFor="serviceType">Service Type</label>
            <Dropdown
              id="serviceType"
              value={newBooking.serviceType}
              options={getFormattedServices()}
              onChange={(e) => {
                console.log("Selected Service:", e.value);
                const selectedService = getFormattedServices().find(
                  (s) => s.value === e.value
                );
                console.log("Service Details:", selectedService);

                handleNewBookingChange("serviceType", e.value);

                // Only auto-populate vendor, not location
                if (selectedService) {
                  handleNewBookingChange(
                    "vendorAssigned",
                    selectedService.vendorName
                  );
                }
              }}
              placeholder="Select a service"
              optionLabel="label"
              disabled={fetchingServices}
              filter
              filterBy="label"
              emptyFilterMessage="No services found"
            />
            {fetchingServices && (
              <small className="text-blue-500">Loading services...</small>
            )}
            {!fetchingServices && services.length === 0 && (
              <small className="text-red-500">No services available</small>
            )}
          </div>

          <div className="col-12 md:col-6 field">
            <label htmlFor="vendorAssigned">Vendor Assigned</label>
            <InputText
              id="vendorAssigned"
              value={newBooking.vendorAssigned}
              disabled
              placeholder="Vendor will be auto-assigned"
            />
          </div>

          <div className="col-12 md:col-6 field">
            <label htmlFor="vesselLocation">Vessel Location</label>
            <InputText
              id="vesselLocation"
              value={newBooking.vesselLocation}
              onChange={(e) =>
                handleNewBookingChange("vesselLocation", e.target.value)
              }
              placeholder="Enter vessel location"
            />
          </div>

          <div className="col-12 md:col-6 field">
            <label htmlFor="dateTime">Date & Time</label>
            <Calendar
              id="dateTime"
              value={newBooking.dateTime}
              onChange={(e) => handleNewBookingChange("dateTime", e.value)}
              showTime
              showIcon
              placeholder="March-15-2025 - 10:30 Pm"
            />
          </div>

          <div className="col-12 md:col-6 field">
            <label htmlFor="bookingStatus">Booking Status</label>
            <Dropdown
              id="bookingStatus"
              value={newBooking.bookingStatus}
              options={["cancel", "pending", "confirmed", "completed"]}
              onChange={(e) => handleNewBookingChange("bookingStatus", e.value)}
              placeholder="Select Status"
            />
          </div>

          <div className="col-12 md:col-6 field">
            <label htmlFor="internalNotes">
              Internal Notes & Comments Section
            </label>
            <InputText
              id="internalNotes"
              value={newBooking.internalNotes}
              onChange={(e) =>
                handleNewBookingChange("internalNotes", e.target.value)
              }
              placeholder="Leave a note here..."
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
            onClick={() => setShowAddBookingModal(false)}
            className="p-button-danger"
            style={{ backgroundColor: "#EF4444", border: "none" }}
          />
          <Button
            label="Save"
            icon="pi pi-check"
            onClick={handleCreateBooking}
            loading={loading}
            style={{ backgroundColor: "#0387D9", border: "none" }}
          />
        </div>
      </Dialog>

      <Toast ref={toast} position="bottom-right" />
    </>
  );
};

export default CreateBooking;

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
// import { useNavigate } from "react-router-dom";
// import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
// import lone from "../../assets/images/crew/lone.png";
// import upcomingLogo from "../../assets/images/crew/upcomingorderLogo.png";
// import iconexpire from "../../assets/images/crew/iconexpire.png";
// import iconcareer from "../../assets/images/crew/iconcareer.png";
// import { Chart as ChartJS } from "chart.js/auto";
// import { Bar, Doughnut, Line } from "react-chartjs-2";
// import sourceData from "../../data/sourceData.json";
// import analyticsData from "../../data/analyticsData.json";
// import sort from "../../assets/images/crew/sort.png";
import editLogo from "../../assets/images/crew/editLogo.png";
// import deleteLogo from "../../assets/images/crew/deleteLogo.png";
import plus from "../../assets/images/crew/plus.png";
// import eyesIn from "../../assets/images/crew/eyes-in.png";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
// import { InputTextarea } from "primereact/inputtextarea";
import uploadBooking from "../../assets/images/crew/uploadBooking.png";
// import downloadIcon from "../../assets/images/crew/downloadIcon.png";
// import times from "../../assets/images/crew/times.png";
import check from "../../assets/images/crew/check.png";
import eyeblock from "../../assets/images/crew/eyeblock.png";
import sortIcon from "../../assets/images/crew/sort.png";
import deleteIcon from "../../assets/images/crew/delete.png";
// import axios from "axios";
import "./bookings.css";
import {
  getAllBookingService,
  createBookingService,
  deleteBookingService,
  bulkDeleteBookings,
  updateBookingStatusService,
} from "../../services/bookings/bookingService";
import { getAllServices } from "../../services/service/serviceService";

// Context
import { useBooking } from "../../context/booking/bookingContext";
import { useService } from "../../context/service/serviceContext";
import { useTheme } from "../../context/theme/themeContext";
import { useToast } from "../../components/Toast";
import { Pagination } from "../../components/pagination";
import { useOutletContext } from "react-router-dom";
// import { formGroupClasses } from "@mui/material";

const Bookings = () => {
  // const navigate = useNavigate();

  // Context
  const {
    bookings,
    // deleteBooking,
    fetchBookings,
    updateBooking,
    // updateBookingStatus,
  } = useBooking();
  const { services, fetchServices } = useService();
  const { theme } = useTheme();
  const { showSuccess, showError } = useToast();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview] = useState("");
  const statusMenuRef = useRef(null);
  const [selectedBookingForStatus, setSelectedBookingForStatus] =
    useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedBookingForUpload, setSelectedBookingForUpload] =
    useState(null);
  // fetching of services
  // const [getServices, setGetServices] = useState([]);
  const [bookingData, setBookingData] = useState([]);

  const [uploadForm, setUploadForm] = useState({
    invoiceNumber: "",
    date: null,
    amount: "",
    file: null,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth > 768 && window.innerWidth <= 1024
  );
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    serviceType: "",
    vendorAssigned: "",
    vesselLocation: "",
    dateTime: null,
    bookingStatus: "pending",
    internalNotes: "",
  });

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectAll, setSelectAll] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const runCount = useRef(0);

  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [vendors, setVendors] = useState([]);

  const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    deliveryAddress: "",
    phoneNumber: "",
    deliveryDate: null,
  });

  const { setPageTitle } = useOutletContext() || {};
  React.useEffect(() => {
    if (setPageTitle) setPageTitle("Bookings");
  }, [setPageTitle]);

  // Add this useEffect to handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
    };

    // Add reference counting to prevent multiple fetches
    if (runCount.current < 1) {
      runCount.current += 1;
      fetchBookings();
      fetchServices();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array to run only once

  // const handleViewReview = (review) => {
  //   setSelectedReview(review);
  //   setShowReviewModal(true);
  // };

  // Update the handleStatusChange function to ensure real-time updates
  const handleStatusChange = async (booking, newStatus) => {
    try {
      setLoading(true);

      // Convert status to lowercase to match backend expectations
      const lowercaseStatus = newStatus.toLowerCase();

      console.log(
        `Updating booking ${booking._id} status to ${lowercaseStatus}`
      );

      // Call the API directly to ensure immediate update
      const result = await updateBookingStatusService(
        booking._id,
        lowercaseStatus
      );

      if (result.status) {
        // Update the local state immediately for real-time feedback
        const updatedBookings = bookingData.map((item) => {
          if (item._id === booking._id) {
            return { ...item, bookingStatus: lowercaseStatus };
          }
          return item;
        });

        setBookingData(updatedBookings);
        showSuccess(`Booking status updated to ${newStatus}`);

        // Also refresh from server to ensure data consistency
        fetchBookings();
      } else {
        showError(result.message || "Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      showError("An error occurred while updating the booking status");
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = (booking) => {
    setViewBooking(booking);
    setShowViewModal(true);
  };

  const handleEditBooking = (booking) => {
    setEditingBooking({ ...booking });
    setShowEditForm(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setEditingBooking({
      ...editingBooking,
      [name]: value,
    });
  };

  const handleEditServiceChange = (e) => {
    const { value } = e.target;
    const service = services.find((service) => service._id === value);
    setEditingBooking({
      ...editingBooking,
      services: [{ service: service }],
    });
  };

  const handleEditDateChange = (e) => {
    setEditingBooking({
      ...editingBooking,
      bookingDate: e.value,
    });
  };

  // const handleEditStatusChange = (e) => {
  //   setEditingBooking({
  //     ...editingBooking,
  //     status: e.value,
  //   });
  // };

  const handleSaveBooking = () => {
    try {
      console.log("Starting to save booking with data:", editingBooking);

      // Create a properly formatted booking object for the API
      const bookingData = {
        services:
          editingBooking.services?.map((service) => ({
            service: service.service?._id,
            quantity: service.quantity || 1,
          })) || [],
        vendorAssigned:
          typeof editingBooking.vendorAssigned === "object"
            ? editingBooking.vendorAssigned._id
            : editingBooking.vendorAssigned,
        vendorLocation: editingBooking.vesselLocation, // Map vesselLocation to vendorLocation for the API
        dateTime: editingBooking.bookingDate,
        bookingStatus: editingBooking.bookingStatus,
        internalNotes: editingBooking.reviews,
      };

      console.log("Formatted booking data for API:", bookingData);

      // Call the updateBooking function with the formatted data
      updateBooking(editingBooking._id, bookingData)
        .then((success) => {
          console.log("Update booking response:", success);
          if (success) {
            showSuccess("Booking updated successfully");
            setShowEditForm(false);
            fetchBookingsData(); // Refresh the bookings list
          } else {
            showError("Failed to update booking");
          }
        })
        .catch((error) => {
          console.error("Error in updateBooking:", error);
          showError("An error occurred while updating the booking");
        });
    } catch (error) {
      console.error("Error in handleSaveBooking:", error);
      showError("An error occurred while preparing the booking update");
    }
  };

  const handleUploadBooking = (booking) => {
    setSelectedBookingForUpload(booking);
    setUploadForm({
      invoiceNumber: "",
      date: null,
      amount: "",
      file: null,
    });
    setShowUploadModal(true);
  };

  const handleUploadFormChange = (e) => {
    const { name, value } = e.target;
    setUploadForm({
      ...uploadForm,
      [name]: value,
    });
  };

  const handleUploadDateChange = (e) => {
    setUploadForm({
      ...uploadForm,
      date: e.value,
    });
  };

  // Add this function to handle form changes
  const handleNewBookingChange = (field, value) => {
    setNewBooking((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add this function to fetch vendors
  const fetchVendors = async () => {
    try {
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
              services: [service], // Add the current service
              user: vendor.user, // Include user details
            });
          } else if (vendor) {
            // If vendor exists, add the service to their services array
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
    }
  };

  // Add this function to handle vendor selection
  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor);
    setShowVendorModal(false);
    setShowServicesModal(true);
  };

  // Add this function to handle service booking
  const handleServiceBook = (service) => {
    setSelectedService(service);
    setShowServicesModal(false);
    setShowBookingDetailsModal(true);
  };

  // Add this function to handle booking details change
  const handleBookingDetailsChange = (field, value) => {
    setBookingDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add this function to handle closing the services modal
  const handleCloseServicesModal = () => {
    setShowServicesModal(false);
    setShowVendorModal(true); // Show the vendor modal again
  };

  // Update handleCreateBooking function
  const handleCreateBooking = async () => {
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
        serviceId: selectedService._id,
        deliveryAddress: bookingDetails.deliveryAddress,
        phoneNumber: bookingDetails.phoneNumber,
        deliveryDate: bookingDetails.deliveryDate,
      };

      // Call the create booking service
      const response = await createBookingService(bookingData);

      if (response.status) {
        showSuccess("Booking created successfully");
        setShowBookingDetailsModal(false);
        setSelectedService(null);
        setBookingDetails({
          deliveryAddress: "",
          phoneNumber: "",
          deliveryDate: null,
        });
        // Refresh the bookings list
        fetchBookingsData();
      } else {
        showError(response.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      showError("An error occurred while creating the booking");
    } finally {
      setLoading(false);
    }
  };

  // Modify the useEffect to fetch vendors when the vendor modal opens
  useEffect(() => {
    if (showVendorModal) {
      fetchVendors();
    }
  }, [showVendorModal]);

  // Use useCallback to define the function
  const fetchBookingsData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllBookingService(currentPage, pageSize);
      console.log("Fetched bookings response:", response);

      if (response.status) {
        const formattedBookings = response.data.map((booking) => ({
          ...booking,
          // Standardize all field names
          status: booking.bookingStatus || booking.status || "pending",
          dateTime: booking.deliveryDate || booking.dateTime,
          location:
            booking.vesselLocation ||
            booking.deliveryAddress ||
            "Not Available",
          serviceName:
            booking.services?.[0]?.service?.name ||
            booking.service?.name ||
            "N/A",
          vendorName:
            booking.vendorAssigned?.businessName ||
            booking.vendor?.businessName ||
            "Not Assigned",
          totalAmount: booking.totalAmount || 0,
        }));

        setBookingData(formattedBookings);
        setTotalRecords(response.pagination?.total || formattedBookings.length);
      } else {
        console.error("Error fetching bookings data:", response.message);
        showError(response.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings data:", error);
      showError("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, showError]);

  // Now use the function in useEffect
  useEffect(() => {
    fetchBookingsData();
  }, [fetchBookingsData]); // Now it's safe to include in dependencies

  // Update the getFormattedServices function
  const getFormattedServices = () => {
    if (!services || !Array.isArray(services)) return [];

    return services.flatMap((vendor) => {
      if (!vendor.services || !Array.isArray(vendor.services)) return [];

      return vendor.services.map((service) => ({
        label: `${vendor.businessName} - ${service.name}`,
        value: service._id,
        vendorId: vendor._id,
        vendorName: vendor.businessName,
        // Remove businessAddress if it's being included here
      }));
    });
  };

  // Update the renderResponsiveBookingRow function
  const renderResponsiveBookingRow = (booking) => {
    const status = booking.status || "pending";

    return (
      <div className="mobile-booking-card">
        <div className="mobile-booking-header">
          <span className="booking-id">{booking.bookingId || "N/A"}</span>
          <span className={`booking-status status-${status.toLowerCase()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        <div className="mobile-booking-details">
          <div className="detail-row">
            <span className="detail-label">Service:</span>
            <span className="detail-value">{booking.serviceName}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Vendor:</span>
            <span className="detail-value">{booking.vendorName}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{booking.location}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Date:</span>
            <span className="detail-value">
              {booking.dateTime
                ? new Date(booking.dateTime).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Amount:</span>
            <span className="detail-value">
              ${booking.totalAmount?.toFixed(2) || "0.00"}
            </span>
          </div>

          {booking.internalNotes && (
            <div className="detail-row notes">
              <span className="detail-label">Notes:</span>
              <span className="detail-value">{booking.internalNotes}</span>
            </div>
          )}
        </div>

        <div className="mobile-booking-actions">
          <Button
            icon="pi pi-eye"
            className="p-button-rounded p-button-text"
            onClick={() => handleViewBooking(booking)}
            tooltip="View"
            tooltipOptions={{ position: "top" }}
          />
        </div>
      </div>
    );
  };

  // Add this skeleton loader component
  const renderSkeletonLoader = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <tr key={index}>
          <td>
            <div
              className="skeleton-loader"
              style={{ width: "20px", height: "20px" }}
            ></div>
          </td>
          <td>
            <div
              className="skeleton-loader"
              style={{ width: "100px", height: "20px" }}
            ></div>
          </td>
          <td>
            <div
              className="skeleton-loader"
              style={{ width: "150px", height: "20px" }}
            ></div>
          </td>
          <td>
            <div
              className="skeleton-loader"
              style={{ width: "150px", height: "20px" }}
            ></div>
          </td>
          <td>
            <div
              className="skeleton-loader"
              style={{ width: "120px", height: "20px" }}
            ></div>
          </td>
          <td>
            <div
              className="skeleton-loader"
              style={{ width: "100px", height: "20px" }}
            ></div>
          </td>
          <td>
            <div
              className="skeleton-loader"
              style={{ width: "150px", height: "20px" }}
            ></div>
          </td>
          <td>
            <div
              className="skeleton-loader"
              style={{ width: "100px", height: "20px" }}
            ></div>
          </td>
          <td>
            <div
              className="skeleton-loader"
              style={{ width: "120px", height: "20px" }}
            ></div>
          </td>
        </tr>
      ));
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    if (checked) {
      // Select all bookings
      const allBookingIds = bookingData.map((booking) => booking._id);
      setSelectedBookings(allBookingIds);
      console.log("Selected all bookings:", allBookingIds);
    } else {
      // Deselect all
      setSelectedBookings([]);
      console.log("Deselected all bookings");
    }
  };

  const handleSelectBooking = (e, bookingId) => {
    const checked = e.target.checked;
    console.log(`${checked ? "Selecting" : "Deselecting"} booking:`, bookingId);

    if (checked) {
      setSelectedBookings((prev) => [...prev, bookingId]);
    } else {
      setSelectedBookings((prev) => prev.filter((id) => id !== bookingId));

      // If we're unchecking an item, also uncheck the "select all" checkbox
      if (selectAll) {
        setSelectAll(false);
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedBookings.length === 0) {
      showError("No bookings selected");
      return;
    }

    console.log("Initiating bulk delete for bookings:", selectedBookings);

    setBookingToDelete({
      multiple: true,
      ids: selectedBookings,
    });

    setShowDeleteConfirmation(true);
  };

  const handleDeleteClick = (booking) => {
    setBookingToDelete({
      _id: booking._id,
      multiple: false,
    });
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      console.log("Confirming deletion for:", bookingToDelete);

      if (bookingToDelete?.multiple) {
        console.log("Performing bulk deletion for IDs:", bookingToDelete.ids);

        const response = await bulkDeleteBookings(bookingToDelete.ids);
        console.log("Bulk delete response:", response);

        if (response.success) {
          // Remove the deleted bookings from the state
          setBookingData((prevBookings) =>
            prevBookings.filter(
              (booking) => !bookingToDelete.ids.includes(booking._id)
            )
          );

          // Clear selection
          setSelectedBookings([]);
          setSelectAll(false);

          showSuccess(
            `Successfully deleted ${bookingToDelete.ids.length} bookings`
          );
        } else {
          showError(response.error || "Failed to delete bookings");
        }
      } else {
        // Single booking deletion
        console.log("Deleting single booking:", bookingToDelete);

        const response = await deleteBookingService(bookingToDelete._id);
        console.log("Single delete response:", response);

        if (response.success) {
          setBookingData((prevBookings) =>
            prevBookings.filter(
              (booking) => booking._id !== bookingToDelete._id
            )
          );

          showSuccess("Booking deleted successfully");
        } else {
          showError(response.error || "Failed to delete booking");
        }
      }
    } catch (error) {
      console.error("Error in confirmDelete:", error);
      showError("An error occurred while deleting");
    } finally {
      setLoading(false);
      setShowDeleteConfirmation(false);
    }
  };

  return (
    <div
      className="bookings-management"
      style={{ width: "100%", padding: 0, margin: 0 }}
    >
      <div
        className="bookings-wrapper"
        style={{
          height: "100vh",
          width: "100%",
          maxWidth: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F8FBFF",
          overflowX: "hidden",
        }}
      >
        <div className="inventory-container">
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={showEditForm ? "edit-form" : "bookings-table"}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              {showEditForm ? (
                <div
                  className="booking-edit-container"
                  style={{
                    padding: "20px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    margin: "20px 0",
                    width: "95%",
                    minHeight: "400px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignContent: "center",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>Manage Booking</h3>
                    <Button
                      icon="pi pi-times"
                      className="p-button-rounded p-button-text"
                      onClick={() => setShowEditForm(false)}
                      aria-label="Close"
                    />
                  </div>

                  <div className="p-fluid grid formgrid">
                    <div className="col-12 md:col-6 field">
                      <label htmlFor="serviceType">Service Type</label>
                      <Dropdown
                        id="serviceType"
                        name="serviceType"
                        style={{ height: "45px" }}
                        value={
                          editingBooking?.services
                            ?.map((service) => service?.service?._id)
                            .filter(Boolean)
                            .join(", ") || ""
                        }
                        options={getFormattedServices()}
                        onChange={(e) => {
                          console.log("Selected Service:", e.value);
                          const selectedService = getFormattedServices().find(
                            (s) => s.value === e.value
                          );
                          console.log("Service Details:", selectedService);

                          // First update the service selection
                          handleEditServiceChange(e);

                          // Only update the vendor, not the location
                          if (selectedService) {
                            setEditingBooking((prev) => ({
                              ...prev,
                              vendorAssigned: selectedService.vendorName,
                              // Completely removed vesselLocation auto-population
                            }));
                          }
                        }}
                        placeholder="Select a service"
                        optionLabel="label"
                      />
                    </div>

                    <div className="col-12 md:col-6 field">
                      <label htmlFor="vendorAssigned">Vendor Assigned</label>
                      <InputText
                        id="vendorAssigned"
                        name="vendorAssigned"
                        value={
                          typeof editingBooking?.vendorAssigned === "string"
                            ? editingBooking.vendorAssigned
                            : ""
                        }
                        disabled
                        placeholder="Vendor will be auto-assigned"
                      />
                    </div>

                    <div className="col-12 md:col-6 field">
                      <label htmlFor="vesselLocation">Vessel Location</label>
                      <InputText
                        id="vesselLocation"
                        name="vesselLocation"
                        value={editingBooking?.vesselLocation || ""}
                        onChange={handleEditInputChange}
                        placeholder="Enter vessel location"
                      />
                    </div>

                    <div className="col-12 md:col-6 field">
                      <label htmlFor="bookingDate">Date & Time</label>
                      <Calendar
                        id="bookingDate"
                        name="bookingDate"
                        value={
                          editingBooking?.bookingDate
                            ? new Date(editingBooking.bookingDate)
                            : null
                        }
                        onChange={handleEditDateChange}
                        showTime
                        placeholder="March-15-2025 - 10:30 Pm"
                      />
                    </div>

                    <div className="col-12 md:col-6 field">
                      <label htmlFor="reviews">
                        Internal Notes & Comments Section
                      </label>
                      <InputText
                        id="reviews"
                        name="reviews"
                        value={editingBooking?.reviews || ""}
                        onChange={handleEditInputChange}
                        placeholder="Leave a note here..."
                      />
                    </div>
                  </div>

                  {/* Submit and Cancel Buttons */}
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
                      onClick={() => setShowEditForm(false)}
                      className="p-button-danger"
                      style={{ backgroundColor: "#EF4444", border: "none" }}
                    />
                    <Button
                      label="Save Changes"
                      icon="pi pi-check"
                      onClick={handleSaveBooking}
                      style={{ backgroundColor: "#0387D9", border: "none" }}
                    />
                  </div>
                </div>
              ) : (
                <div className="bookings-container">
                  {/* Desktop view */}
                  <div className="desktop-view">
                    <div
                      className="bookings-table-container"
                      style={{
                        backgroundColor:
                          theme === "light" ? "#FFFFFF" : "#03141F",
                      }}
                    >
                      <div
                        className="table-container"
                        style={{
                          backgroundColor:
                            theme === "light" ? "#FFFFFF" : "#03141F",
                          overflowX: "auto",
                          width: "100%",
                          maxWidth: "100%",
                        }}
                      >
                        <table
                          className="bookings-table"
                          style={{
                            backgroundColor:
                              theme === "light" ? "#FFFFFF" : "#03141F",
                            color: theme === "light" ? "#103B57" : "#FFFFFF",
                            width: "100%",
                            fontSize: isMobile
                              ? "12px"
                              : isTablet
                              ? "13px"
                              : "14px",
                            tableLayout: "fixed",
                          }}
                        >
                          <colgroup>
                            <col
                              style={{ width: isMobile ? "40px" : "20px" }}
                            />
                            <col
                              style={{ width: isMobile ? "100px" : "40px" }}
                            />
                            <col
                              style={{ width: isMobile ? "100px" : "40px" }}
                            />
                            <col
                              style={{ width: isMobile ? "120px" : "40px" }}
                            />
                            <col
                              style={{ width: isMobile ? "120px" : "40px" }}
                            />
                            <col
                              style={{ width: isMobile ? "120px" : "40px" }}
                            />
                            <col
                              style={{ width: isMobile ? "100px" : "40px" }}
                            />
                            <col
                              style={{ width: isMobile ? "120px" : "40px" }}
                            />
                          </colgroup>
                          <thead
                            style={{
                              backgroundColor:
                                theme === "light" ? "#FFFFFF" : "#03141F",
                            }}
                          >
                            <tr
                              style={{
                                backgroundColor:
                                  theme === "light" ? "#FFFFFF" : "#03141F",
                              }}
                            >
                              <th
                                style={{
                                  fontSize: isMobile ? "12px" : "11px",
                                  fontWeight: "500",
                                  padding: "10px 5px",
                                  textAlign: "center",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  className="header-checkbox"
                                  checked={selectAll}
                                  onChange={handleSelectAll}
                                />
                                {selectedBookings.length > 0 && (
                                  <i
                                    className="pi pi-trash"
                                    style={{
                                      cursor: "pointer",
                                      color: "#ff4d4f",
                                      marginLeft: "8px",
                                    }}
                                    onClick={handleBulkDelete}
                                  />
                                )}
                              </th>
                              <th
                                style={{
                                  fontSize: isMobile ? "10px" : "11px",
                                  padding: "10px 5px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                Booking ID
                                <img
                                  src={sortIcon}
                                  alt="sort"
                                  style={{
                                    marginBottom: "-3px",
                                    marginLeft: "5px",
                                  }}
                                />
                              </th>
                              <th
                                style={{
                                  fontSize: isMobile ? "12px" : "11px",
                                  padding: "10px 5px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                Service
                                <img
                                  src={sortIcon}
                                  alt="sort"
                                  style={{
                                    marginBottom: "-3px",
                                    marginLeft: "3px",
                                  }}
                                />
                              </th>
                              <th
                                style={{
                                  fontSize: isMobile ? "12px" : "11px",
                                  padding: "10px 5px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                Vendor
                                <img
                                  src={sortIcon}
                                  alt="sort"
                                  style={{
                                    marginBottom: "-3px",
                                    marginLeft: "5px",
                                  }}
                                />
                              </th>
                              <th
                                style={{
                                  fontSize: isMobile ? "12px" : "11px",
                                  padding: "10px 5px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                Status
                                <img
                                  src={sortIcon}
                                  alt="sort"
                                  style={{
                                    marginBottom: "-3px",
                                    marginLeft: "5px",
                                  }}
                                />
                              </th>
                              <th
                                style={{
                                  fontSize: isMobile ? "12px" : "11px",
                                  padding: "10px 5px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                Total Amount
                                <img
                                  src={sortIcon}
                                  alt="sort"
                                  style={{
                                    marginBottom: "-3px",
                                    marginLeft: "5px",
                                  }}
                                />
                              </th>
                              <th
                                style={{
                                  fontSize: isMobile ? "12px" : "11px",
                                  padding: "10px 5px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                Delivery Date
                                <img
                                  src={sortIcon}
                                  alt="sort"
                                  style={{
                                    marginBottom: "-3px",
                                    marginLeft: "5px",
                                  }}
                                />
                              </th>
                              <th
                                style={{
                                  fontSize: isMobile ? "12px" : "11px",
                                  padding: "10px 5px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                Delivery Address
                                <img
                                  src={sortIcon}
                                  alt="sort"
                                  style={{
                                    marginBottom: "-3px",
                                    marginLeft: "5px",
                                  }}
                                />
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            style={{
                              backgroundColor:
                                theme === "light" ? "#FFFFFF" : "#03141F",
                            }}
                          >
                            {loading
                              ? renderSkeletonLoader()
                              : bookingData.map((booking, index) => (
                                  <tr
                                    key={index}
                                    style={{
                                      borderBottom: "1px solid #eee",
                                      color:
                                        theme === "light"
                                          ? "#103B57"
                                          : "#FFFFFF",
                                    }}
                                  >
                                    <td>
                                      <input
                                        type="checkbox"
                                        checked={selectedBookings.includes(
                                          booking._id
                                        )}
                                        onChange={(e) =>
                                          handleSelectBooking(e, booking._id)
                                        }
                                      />
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        fontSize: isMobile ? "11px" : "10px",
                                      }}
                                    >
                                      {booking.bookingId}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        fontSize: isMobile ? "11px" : "10px",
                                      }}
                                    >
                                      {booking.serviceName}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        fontSize: isMobile ? "11px" : "10px",
                                      }}
                                    >
                                      {booking.vendorName}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        fontSize: isMobile ? "11px" : "10px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          backgroundColor:
                                            booking.status === "confirmed"
                                              ? "#e6f7ee"
                                              : booking.status === "pending"
                                              ? "#fff8e6"
                                              : booking.status === "completed"
                                              ? "#e6f0ff"
                                              : booking.status === "declined"
                                              ? "#ffebeb"
                                              : "#ffebeb",
                                          color:
                                            booking.status === "confirmed"
                                              ? "#1d9d74"
                                              : booking.status === "pending"
                                              ? "#ff9800"
                                              : booking.status === "completed"
                                              ? "#3366ff"
                                              : "#ff4d4f",
                                          padding: "2px 6px",
                                          borderRadius: "4px",
                                          fontSize: "10px",
                                        }}
                                      >
                                        {booking.status
                                          .charAt(0)
                                          .toUpperCase() +
                                          booking.status.slice(1)}
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        fontSize: isMobile ? "11px" : "10px",
                                      }}
                                    >
                                      $
                                      {booking.totalAmount?.toFixed(2) ||
                                        "0.00"}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        fontSize: isMobile ? "11px" : "10px",
                                      }}
                                    >
                                      {new Date(
                                        booking.dateTime
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        fontSize: isMobile ? "11px" : "10px",
                                      }}
                                    >
                                      {booking.location}
                                    </td>
                                  </tr>
                                ))}
                          </tbody>
                        </table>
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          display: "flex",
                          justifyContent: "flex-end",
                          marginTop: "10px",
                          width: "100%",
                        }}
                      >
                        <button
                          className="p-button-text p-button-sm"
                          onClick={() => setShowVendorModal(true)}
                          style={{
                            backgroundColor: "#0387D9",
                            color: "white",
                            borderRadius: "5px",
                            padding: "5px 10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "5px",
                            border: "1px solid #0387D9",
                            cursor: "pointer",
                          }}
                        >
                          <img src={plus} alt="Add Booking" />
                          Add Booking
                        </button>
                      </div>
                      {/* Pagination component */}
                      <div
                        className="pagination-container"
                        style={{
                          padding: "1rem",
                          backgroundColor:
                            theme === "light" ? "#FFFFFF" : "#03141F",
                          borderTop: "1px solid #eee",
                          marginTop: "1rem",
                        }}
                      >
                        <div
                          className="flex align-items-center gap-2"
                          style={{ marginBottom: "1rem" }}
                        >
                          <span
                            style={{
                              color: theme === "light" ? "#103B57" : "#FFFFFF",
                            }}
                          >
                            Rows per page:
                          </span>
                          <Dropdown
                            value={pageSize}
                            options={[5, 10, 15, 20, 30, 50]}
                            onChange={(e) => {
                              setPageSize(e.value);
                              setCurrentPage(1);
                            }}
                            className="p-inputtext-sm"
                          />
                        </div>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={Math.ceil(totalRecords / pageSize)}
                          totalItems={totalRecords}
                          itemsPerPage={pageSize}
                          onPageChange={setCurrentPage}
                          isMobile={isMobile}
                          isTablet={isTablet}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile view */}
                  <div className="mobile-view">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "20px 0",
                        padding: "0 15px",
                      }}
                    >
                      <button
                        className="p-button-text p-button-sm"
                        onClick={() => setShowVendorModal(true)}
                        style={{
                          backgroundColor: "#0387D9",
                          color: "white",
                          borderRadius: "5px",
                          padding: "10px 15px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "5px",
                          border: "1px solid #0387D9",
                          cursor: "pointer",
                          width: "100%",
                          maxWidth: "250px",
                        }}
                      >
                        <img src={plus} alt="Add Booking" />
                        Add Booking
                      </button>
                    </div>
                    {loading ? (
                      <div className="mobile-skeleton-loader">
                        {Array(3)
                          .fill(0)
                          .map((_, index) => (
                            <div key={index} className="mobile-booking-card">
                              <div
                                className="skeleton-loader"
                                style={{ height: "100px" }}
                              ></div>
                            </div>
                          ))}
                      </div>
                    ) : bookingData && bookingData.length > 0 ? (
                      bookingData.map((booking, index) => (
                        <div
                          key={booking._id || index}
                          className="mobile-booking-wrapper"
                        >
                          {renderResponsiveBookingRow(booking)}
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "20px",
                          color: "#6b7280",
                        }}
                      >
                        No bookings found
                      </div>
                    )}

                    {/* Mobile Pagination */}
                    {bookingData && bookingData.length > 0 && (
                      <div
                        className="mobile-pagination"
                        style={{
                          padding: "15px",
                          marginTop: "20px",
                          backgroundColor:
                            theme === "light" ? "#FFFFFF" : "#03141F",
                          borderRadius: "8px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "15px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "100%",
                              gap: "10px",
                            }}
                          >
                            <Button
                              icon="pi pi-angle-left"
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                              }
                              disabled={currentPage === 1}
                              className="p-button-rounded p-button-outlined"
                              style={{ minWidth: "40px" }}
                            />

                            <span
                              style={{
                                color:
                                  theme === "light" ? "#103B57" : "#FFFFFF",
                              }}
                            >
                              Page {currentPage} of{" "}
                              {Math.ceil(totalRecords / pageSize)}
                            </span>

                            <Button
                              icon="pi pi-angle-right"
                              onClick={() => setCurrentPage((prev) => prev + 1)}
                              disabled={
                                currentPage >=
                                Math.ceil(totalRecords / pageSize)
                              }
                              className="p-button-rounded p-button-outlined"
                              style={{ minWidth: "40px" }}
                            />
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <span
                              style={{
                                color:
                                  theme === "light" ? "#103B57" : "#FFFFFF",
                              }}
                            >
                              Rows per page:
                            </span>
                            <Dropdown
                              value={pageSize}
                              options={[5, 10, 15, 20, 30]}
                              onChange={(e) => {
                                setPageSize(e.value);
                                setCurrentPage(1);
                              }}
                              className="p-inputtext-sm"
                              style={{ width: "80px" }}
                            />
                          </div>

                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: theme === "light" ? "#103B57" : "#FFFFFF",
                            }}
                          >
                            Total Records: {totalRecords}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CSSTransition>
          </SwitchTransition>
        </div>
      </div>

      {/* Review Modal */}
      <Dialog
        visible={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        header="Participant Reviews"
        className="review-modal"
        modal
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        style={{ width: "30vw" }}
        maskStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div className="review-content" style={{ padding: "10px" }}>
          <p>{selectedReview}</p>
        </div>
      </Dialog>

      {/* Status Menu */}
      <Menu
        model={[
          {
            label: "Pending",
            command: () =>
              handleStatusChange(selectedBookingForStatus, "pending"),
          },
          {
            label: "Confirmed",
            command: () =>
              handleStatusChange(selectedBookingForStatus, "confirmed"),
          },
          {
            label: "Completed",
            command: () =>
              handleStatusChange(selectedBookingForStatus, "completed"),
          },
          {
            label: "Cancelled",
            command: () =>
              handleStatusChange(selectedBookingForStatus, "cancelled"),
          },
          {
            label: "Declined",
            command: () =>
              handleStatusChange(selectedBookingForStatus, "declined"),
          },
        ]}
        popup
        ref={statusMenuRef}
        id="status-menu"
        style={{ fontSize: "0.8rem" }}
      />

      {/* View Booking Modal */}
      <Dialog
        visible={showViewModal}
        onHide={() => setShowViewModal(false)}
        header="Booking Details"
        className="booking-details-modal"
        modal
        style={{ width: "500px" }}
        contentStyle={{ padding: "0" }}
        headerStyle={{
          borderBottom: "1px solid #e0e0e0",
          padding: "15px 20px",
        }}
        showHeader={true}
        closeIcon={<i className="pi pi-times" style={{ fontSize: "1rem" }} />}
      >
        {viewBooking && (
          <div style={{ padding: "10px", height: "500px" }}>
            <div
              style={{
                backgroundColor: "#f9f9f9",
                padding: "15px 20px",
                height: "400px",
                lineHeight: "43px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ fontWeight: "500", color: "#555" }}>ID</span>
                <span style={{ fontWeight: "400" }}>
                  {viewBooking.bookingId}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ fontWeight: "500", color: "#555" }}>
                  Service Type
                </span>
                <span style={{ fontWeight: "400" }}>
                  {viewBooking.serviceName}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ fontWeight: "500", color: "#555" }}>
                  Vendor Assigned
                </span>
                <span style={{ fontWeight: "400" }}>
                  {viewBooking.vendorName}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ fontWeight: "500", color: "#555" }}>
                  Vessel Location
                </span>
                <span style={{ fontWeight: "400" }}>
                  {viewBooking.location}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ fontWeight: "500", color: "#555" }}>
                  Date & Time
                </span>
                <span style={{ fontWeight: "400" }}>
                  {new Date(viewBooking.dateTime).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}{" "}
                  {new Date(viewBooking.dateTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ fontWeight: "500", color: "#555" }}>
                  Booking Status
                </span>
                <span
                  style={{
                    backgroundColor:
                      viewBooking.status === "confirmed"
                        ? "#fff8e6"
                        : viewBooking.status === "completed"
                        ? "#e6f0ff"
                        : viewBooking.status === "pending"
                        ? "#fff8e6"
                        : "#ffebeb",
                    color:
                      viewBooking.status === "confirmed"
                        ? "#ff9800"
                        : viewBooking.status === "completed"
                        ? "#3366ff"
                        : viewBooking.status === "pending"
                        ? "#ff9800"
                        : "#ff4d4f",
                    padding: "2px 10px",
                    borderRadius: "12px",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                  }}
                >
                  {viewBooking.status.charAt(0).toUpperCase() +
                    viewBooking.status.slice(1)}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0",
                }}
              >
                <span style={{ fontWeight: "500", color: "#555" }}>
                  Internal Notes & Comments Section
                </span>
              </div>
            </div>

            <div style={{ padding: "15px 20px" }}>
              <p style={{ margin: "0", color: "#666", fontSize: "0.9rem" }}>
                {viewBooking.internalNotes || "No notes available"}
              </p>
            </div>
          </div>
        )}
      </Dialog>

      {/* Upload Invoice Modal */}
      <Dialog
        visible={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        header="Upload Invoice"
        className="upload-invoice-modal"
        modal
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        style={{ width: "50vw" }}
        maskStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(4px)",
        }}
      >
        {selectedBookingForUpload && (
          <div
            className="upload-form"
            style={{
              border: "1px solid #E0E0E9",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <div className="form-row">
              <div
                className="form-group"
                style={{
                  marginBottom: "15px",
                  width: "100%",
                }}
              >
                <label
                  htmlFor="invoiceNumber"
                  style={{
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Invoice Number*
                </label>
                <InputText
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={uploadForm.invoiceNumber}
                  onChange={handleUploadFormChange}
                  placeholder="Enter invoice number"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div className="form-row">
              <div
                className="form-group"
                style={{
                  marginBottom: "15px",
                  width: "100%",
                }}
              >
                <label
                  htmlFor="date"
                  style={{
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Date*
                </label>
                <Calendar
                  id="date"
                  name="date"
                  value={uploadForm.date}
                  onChange={handleUploadDateChange}
                  showIcon
                  placeholder="Select date"
                  style={{ width: "100%" }}
                  className="p-calendar-inline-icon"
                />
              </div>
            </div>

            <div className="form-row">
              <div
                className="form-group"
                style={{
                  marginBottom: "15px",
                  width: "100%",
                }}
              >
                <label
                  htmlFor="amount"
                  style={{
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Amount*
                </label>
                <InputText
                  id="amount"
                  name="amount"
                  value={uploadForm.amount}
                  onChange={handleUploadFormChange}
                  placeholder="Enter amount"
                  keyfilter="money"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div className="form-row">
              <div
                className="form-group"
                style={{
                  marginBottom: "20px",
                  width: "100%",
                }}
              >
                <label
                  htmlFor="file"
                  style={{
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Upload File*
                </label>
                <div
                  style={{
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    padding: "10px 15px",
                    backgroundColor: "#f8f9fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <i
                      className="pi pi-file-pdf"
                      style={{
                        fontSize: "1.2rem",
                        color: "#6366F1",
                        marginRight: "10px",
                      }}
                    ></i>
                    <span
                      style={{ color: uploadForm.file ? "#333" : "#6c757d" }}
                    >
                      {uploadForm.file
                        ? uploadForm.file.name
                        : "No file selected"}
                    </span>
                  </div>
                  <Button
                    icon="pi pi-upload"
                    className="p-button-outlined p-button-rounded p-button-sm"
                    onClick={() => document.getElementById("file").click()}
                    style={{ minWidth: "2.5rem", height: "2.5rem" }}
                  />
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => {
                      setUploadForm({
                        ...uploadForm,
                        file: e.target.files[0],
                      });
                    }}
                    style={{ display: "none" }}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
                <small
                  className="text-muted"
                  style={{
                    display: "block",
                    marginTop: "5px",
                    fontSize: "0.8rem",
                    color: "#6c757d",
                  }}
                >
                  Supported formats: PDF, JPG, PNG (Max size: 10MB)
                </small>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "15px",
                marginTop: "20px",
              }}
            >
              {/* <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={() => setShowUploadModal(false)}
                style={{
                  backgroundColor: "#EF4444",
                  border: "none",
                  width: "120px",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              /> */}
              <Button
                label="Submit"
                onClick={() => setShowUploadModal(false)}
                style={{
                  backgroundColor: "#0387D9",
                  border: "none",
                  width: "100%",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              />
            </div>
          </div>
        )}
      </Dialog>

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
            />
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
            style={{ backgroundColor: "#0387D9", border: "none" }}
          />
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        visible={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        header="Confirm Deletion"
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Button
              label="No"
              icon="pi pi-times"
              onClick={() => setShowDeleteConfirmation(false)}
              className="p-button-text"
              style={{ width: "200px" }}
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              onClick={confirmDelete}
              loading={loading}
              className="p-button-danger"
              style={{ width: "200px" }}
            />
          </div>
        }
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle"
            style={{ fontSize: "2rem", color: "#ff9800", marginRight: "10px" }}
          />
          <span>
            {bookingToDelete?.multiple
              ? `Are you sure you want to delete ${bookingToDelete.ids.length} selected bookings? This action cannot be undone.`
              : "Are you sure you want to delete this booking?"}
          </span>
        </div>
      </Dialog>

      {/* Vendor Selection Modal */}
      <Dialog
        visible={showVendorModal}
        onHide={() => setShowVendorModal(false)}
        style={{ width: "80vw", maxWidth: "800px" }}
        header="Select Vendor"
        className="vendor-dialog"
      >
        <div className="p-fluid grid">
          {vendors.map((vendor) => (
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
                <h3 style={{ marginBottom: "10px" }}>{vendor.businessName}</h3>
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
          ))}
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
    </div>
  );
};

export default Bookings;

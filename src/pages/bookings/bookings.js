import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import lone from "../../assets/images/crew/lone.png";
import upcomingLogo from "../../assets/images/crew/upcomingorderLogo.png";
import iconexpire from "../../assets/images/crew/iconexpire.png";
import iconcareer from "../../assets/images/crew/iconcareer.png";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import sourceData from "../../data/sourceData.json";
import analyticsData from "../../data/analyticsData.json";
import sort from "../../assets/images/crew/sort.png";
import editLogo from "../../assets/images/crew/editLogo.png";
import deleteLogo from "../../assets/images/crew/deleteLogo.png";
import plus from "../../assets/images/crew/plus.png";
import eyesIn from "../../assets/images/crew/eyes-in.png";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import uploadBooking from "../../assets/images/crew/uploadBooking.png";
import downloadIcon from "../../assets/images/crew/downloadIcon.png";
import times from "../../assets/images/crew/times.png";
import check from "../../assets/images/crew/check.png";
import eyeblock from "../../assets/images/crew/eyeblock.png";
import sortIcon from "../../assets/images/crew/sort.png";
import deleteIcon from "../../assets/images/crew/delete.png";
import axios from "axios";
import "./bookings.css";
import {
  getAllBookingService,
  createBookingService,
  deleteBookingService,
  bulkDeleteBookings,
  updateBookingStatusService,
} from "../../services/bookings/bookingService";

// Context
import { useBooking } from "../../context/booking/bookingContext";
import { useService } from "../../context/service/serviceContext";
import { useTheme } from "../../context/theme/themeContext";
import { useToast } from "../../components/Toast";
import { formGroupClasses } from "@mui/material";

const Bookings = () => {
  const navigate = useNavigate();

  // Context
  const {
    bookings,
    deleteBooking,
    fetchBookings,
    updateBooking,
    updateBookingStatus,
  } = useBooking();
  const { services, fetchServices } = useService();
  const { theme } = useTheme();
  const { showSuccess, showError } = useToast();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState("");
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
  const [getServices, setGetServices] = useState([]);
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

  // Add this useEffect to handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
    };
    fetchBookings();
    fetchServices();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowReviewModal(true);
  };

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
    const { name, value } = e.target;
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

  const handleEditStatusChange = (e) => {
    setEditingBooking({
      ...editingBooking,
      status: e.value,
    });
  };

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

  // Update the handleCreateBooking function
  const handleCreateBooking = async () => {
    try {
      const selectedService = getFormattedServices().find(
        (s) => s.value === newBooking.serviceType
      );

      if (!selectedService) {
        showError("Please select a service");
        return;
      }

      const bookingData = {
        services: [
          {
            service: selectedService.value,
            quantity: 1,
          },
        ],
        vendorAssigned: selectedService.vendorId,
        vendorLocation: newBooking.vesselLocation,
        dateTime: newBooking.dateTime,
        bookingStatus: newBooking.bookingStatus || "pending",
        internalNotes: newBooking.internalNotes,
      };

      console.log("Creating booking with data:", bookingData);

      const response = await createBookingService(bookingData);
      console.log("Create Booking Response:", response);

      if (response.status) {
        showSuccess("Booking created successfully");

        // Format the new booking to match the existing structure using response.booking
        const newBookingEntry = {
          _id: response.booking._id,
          bookingId: response.booking.bookingId,
          services: [
            {
              service: {
                name: selectedService.label,
                _id: selectedService.value,
              },
              quantity: response.booking.services[0].quantity,
              _id: response.booking.services[0]._id,
            },
          ],
          vendorAssigned: {
            businessName: selectedService.vendorName,
            businessAddress: selectedService.businessAddress,
            _id: response.booking.vendorAssigned,
          },
          dateTime: response.booking.dateTime,
          bookingStatus: response.booking.bookingStatus,
          paymentStatus: response.booking.paymentStatus,
          vendorName: selectedService.vendorName,
          vesselLocation: newBooking.vesselLocation,
          internalNotes: response.booking.internalNotes,
          createdAt: response.booking.createdAt,
          updatedAt: response.booking.updatedAt,
        };

        console.log("New Booking Entry:", newBookingEntry);

        // Add the new booking to the start of the list
        setBookingData((prevBookings) => [newBookingEntry, ...prevBookings]);

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
        showError(response.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      showError(error.response?.data?.message || "Failed to create booking");
    }
  };

  useEffect(() => {
    fetchBookingsData();
  }, [currentPage, pageSize]);

  const fetchBookingsData = async () => {
    try {
      setLoading(true);
      const response = await getAllBookingService(currentPage, pageSize);
      console.log("Fetched bookings response:", response);

      if (response.status) {
        const formattedBookings = response.data.map((booking) => ({
          ...booking,
          vendorName: booking.vendorAssigned?.businessName || "Not Assigned",
          vesselLocation: booking.vendorLocation || "Not Available",
        }));

        setBookingData(formattedBookings);

        // Set total records from pagination info
        const total = response.pagination?.total || formattedBookings.length;
        console.log("Setting total records:", total);
        setTotalRecords(total);
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
  };

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

  // Update the renderResponsiveBookingRow function to match the backend data structure
  const renderResponsiveBookingRow = (booking) => {
    const status = booking.bookingStatus || "pending";

    return (
      <div className="mobile-booking-card">
        <div className="mobile-booking-header">
          <span className="booking-id">
            {booking._id ? booking._id.substring(0, 8) : "N/A"}
          </span>
          <span className={`booking-status status-${status.toLowerCase()}`}>
            {status}
          </span>
        </div>

        <div className="mobile-booking-details">
          <div className="detail-row">
            <span className="detail-label">Service:</span>
            <span className="detail-value">
              {(booking.services && booking.services[0]?.service?.name) ||
                "N/A"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Vendor:</span>
            <span className="detail-value">
              {booking.vendorAssigned?.businessName || "Not Assigned"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span className="detail-value">
              {booking.vesselLocation || "N/A"}
            </span>
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
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-text p-button-success"
            onClick={() => handleEditBooking(booking)}
            tooltip="Edit"
            tooltipOptions={{ position: "top" }}
          />
          <Button
            icon="pi pi-ellipsis-v"
            className="p-button-rounded p-button-text"
            onClick={(e) => {
              setSelectedBookingForStatus(booking);
              statusMenuRef.current.toggle(e);
            }}
            tooltip="Change Status"
            tooltipOptions={{ position: "top" }}
          />
          <Button
            className="p-button-rounded p-button-text"
            onClick={() => handleUploadBooking(booking)}
            tooltip="Upload Booking"
            tooltipOptions={{ position: "top" }}
          >
            <img
              src={uploadBooking}
              alt="Upload"
              style={{ width: "16px", height: "16px" }}
            />
          </Button>
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
    <>
      <div
        className="flex align-items-center justify-content-between sub-header-panel"
        style={{
          backgroundColor: theme === "light" ? "#FFFFFF" : "#03141F",
          color: theme === "light" ? "#103B57" : "#FFFFFF",
        }}
      >
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3
              style={{
                fontSize: isMobile ? "16px" : isTablet ? "18px" : "20px",
                margin: "0 0 10px 0",
              }}
            >
              Bookings
            </h3>
          </div>
        </div>
      </div>

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
                                Service Type
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
                                Vendor Assigned
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
                                Vessel Location
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
                                Date & Time
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
                                Booking Status
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
                                Actions
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
                                      {booking.services?.[0]?.service?.name ||
                                        "N/A"}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        fontSize: isMobile ? "11px" : "10px",
                                      }}
                                    >
                                      {booking.vendorAssigned?.businessName ||
                                        "Not Assigned"}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        fontSize: isMobile ? "11px" : "10px",
                                      }}
                                    >
                                      {booking.vesselLocation}
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
                                      <span
                                        style={{
                                          backgroundColor:
                                            booking.bookingStatus ===
                                            "confirmed"
                                              ? "#e6f7ee"
                                              : booking.bookingStatus ===
                                                "pending"
                                              ? "#fff8e6"
                                              : booking.bookingStatus ===
                                                "completed"
                                              ? "#e6f0ff"
                                              : booking.bookingStatus ===
                                                "declined"
                                              ? "#ffebeb"
                                              : "#ffebeb",
                                          color:
                                            booking.bookingStatus ===
                                            "confirmed"
                                              ? "#1d9d74"
                                              : booking.bookingStatus ===
                                                "pending"
                                              ? "#ff9800"
                                              : booking.bookingStatus ===
                                                "completed"
                                              ? "#3366ff"
                                              : "#ff4d4f",
                                          padding: "2px 6px",
                                          borderRadius: "4px",
                                          fontSize: "10px",
                                        }}
                                      >
                                        {/* Capitalize first letter for display */}
                                        {booking.bookingStatus
                                          .charAt(0)
                                          .toUpperCase() +
                                          booking.bookingStatus.slice(1)}
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        padding: "6px",
                                        borderBottom: "1px solid #eee",
                                      }}
                                    >
                                      <div
                                        style={{ display: "flex", gap: "3px" }}
                                      >
                                        {/* View button */}
                                        <Button
                                          className="p-button-text p-button-sm"
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                            padding: "1px",
                                          }}
                                          tooltip="View Details"
                                          tooltipOptions={{ position: "top" }}
                                          onClick={() =>
                                            handleViewBooking(booking)
                                          }
                                        >
                                          <div
                                            style={{ backgroundColor: "white" }}
                                          >
                                            <img
                                              src={eyeblock}
                                              alt="View"
                                              style={{
                                                width: isMobile
                                                  ? "24px"
                                                  : "20px",
                                                height: isMobile
                                                  ? "24px"
                                                  : "20px",
                                              }}
                                            />
                                          </div>
                                        </Button>

                                        {/* Edit button */}
                                        <Button
                                          className="p-button-text p-button-sm"
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                            padding: "1px",
                                          }}
                                          tooltip="Edit"
                                          tooltipOptions={{ position: "top" }}
                                          onClick={() =>
                                            handleEditBooking(booking)
                                          }
                                        >
                                          <img
                                            src={editLogo}
                                            alt="Edit"
                                            style={{
                                              width: isMobile ? "20px" : "20px",
                                              height: isMobile
                                                ? "20px"
                                                : "20px",
                                            }}
                                          />
                                        </Button>
                                        <Button
                                          className="p-button-text p-button-sm"
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                            padding: "1px",
                                          }}
                                          tooltip="Delete"
                                          tooltipOptions={{ position: "top" }}
                                          onClick={() =>
                                            handleDeleteClick(booking)
                                          }
                                        >
                                          <img
                                            src={deleteIcon}
                                            alt="times"
                                            style={{
                                              width: isMobile ? "20px" : "10px",
                                              height: isMobile
                                                ? "20px"
                                                : "10px",
                                            }}
                                          />
                                        </Button>

                                        {/* Status button */}
                                        <Button
                                          className="p-button-text p-button-sm"
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                            padding: "1px",
                                          }}
                                          tooltip="Change Status"
                                          tooltipOptions={{ position: "top" }}
                                          onClick={(e) => {
                                            setSelectedBookingForStatus(
                                              booking
                                            );
                                            statusMenuRef.current.toggle(e);
                                          }}
                                        >
                                          {/* <i
                                className="pi pi-check-circle"
                                style={{
                                  fontSize: "14px",
                                  color: "#4880FF",
                                  border: "1px solid #4880FF",
                                  borderRadius: "50%",
                                  padding: "1px",
                                }}
                              ></i> */}
                                          <img
                                            src={check}
                                            alt="Download"
                                            style={{
                                              width: isMobile ? "20px" : "20px",
                                              height: isMobile
                                                ? "20px"
                                                : "20px",
                                            }}
                                          />
                                        </Button>

                                        {/* Upload button */}
                                        <Button
                                          className="p-button-text p-button-sm"
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                            padding: "1px",
                                            border: "1px solid #ddd",
                                            borderRadius: "50%",
                                          }}
                                          tooltip="Upload Invoice"
                                          tooltipOptions={{ position: "top" }}
                                          onClick={() =>
                                            handleUploadBooking(booking)
                                          }
                                        >
                                          <img
                                            src={uploadBooking}
                                            alt="Upload"
                                            style={{
                                              width: isMobile ? "20px" : "20px",
                                              height: isMobile
                                                ? "20px"
                                                : "20px",
                                            }}
                                          />
                                        </Button>
                                      </div>
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
                          onClick={() => setShowAddBookingModal(true)}
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
                        <div className="flex justify-content-between align-items-center">
                          <div className="flex align-items-center gap-2">
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
                              options={[5, 10, 15, 20, 30, 50]}
                              onChange={(e) => {
                                setPageSize(e.value);
                                setCurrentPage(1);
                              }}
                              className="p-inputtext-sm"
                            />
                          </div>

                          <div className="flex align-items-center gap-3">
                            <Button
                              icon="pi pi-angle-left"
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                              }
                              disabled={currentPage === 1}
                              className="p-button-text"
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
                              className="p-button-text"
                            />
                            <span
                              className="text-sm"
                              style={{
                                color:
                                  theme === "light" ? "#103B57" : "#FFFFFF",
                              }}
                            >
                              Total Records: {totalRecords}
                            </span>
                          </div>
                        </div>
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
                        onClick={() => setShowAddBookingModal(true)}
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
                    {bookings && bookings.length > 0 ? (
                      bookings.map((booking, index) => (
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
                        {loading ? "Loading bookings..." : "No bookings found"}
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
                  {viewBooking.services[0]?.service?.name || "Yachting"}
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
                  {viewBooking.vendorAssigned?.businessName || "John Doe"}
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
                  {viewBooking.vesselLocation}
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
                      viewBooking.bookingStatus === "confirmed"
                        ? "#fff8e6"
                        : viewBooking.bookingStatus === "completed"
                        ? "#e6f0ff"
                        : viewBooking.bookingStatus === "pending"
                        ? "#fff8e6"
                        : "#ffebeb",
                    color:
                      viewBooking.bookingStatus === "confirmed"
                        ? "#ff9800"
                        : viewBooking.bookingStatus === "completed"
                        ? "#3366ff"
                        : viewBooking.bookingStatus === "pending"
                        ? "#ff9800"
                        : "#ff4d4f",
                    padding: "2px 10px",
                    borderRadius: "12px",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                  }}
                >
                  {viewBooking.bookingStatus.charAt(0).toUpperCase() +
                    viewBooking.bookingStatus.slice(1)}
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
    </>
  );
};

export default Bookings;

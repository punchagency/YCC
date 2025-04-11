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
import axios from "axios";
import "./bookings.css";
import { getAllBookingService } from "../../services/bookings/bookingService";

// Context
import { useBooking } from "../../context/booking/bookingContext";
import { useService } from "../../context/service/serviceContext";
import { useTheme } from "../../context/theme/themeContext";
import { createBookingService } from "../../services/bookings/bookingService";
import { useToast } from "../../components/Toast";

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
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    serviceType: "",
    vendorAssigned: "",
    vesselLocation: "",
    dateTime: null,
    bookingStatus: "Pending",
    internalNotes: "",
  });

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // Add this useEffect to handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
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

  // Add this function to handle status changes
  const handleStatusChange = (booking, newStatus) => {
    updateBookingStatus(booking._id, newStatus);
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
    updateBooking(editingBooking._id, editingBooking).then((success) => {
      if (success) {
        setShowEditForm(false);
      }
    });
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
        vendorLocation: selectedService.vendorId,
        dateTime: newBooking.dateTime,
        bookingStatus: newBooking.bookingStatus || "Pending",
        internalNotes: newBooking.internalNotes,
      };

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
          vesselLocation: selectedService.businessAddress,
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
          bookingStatus: "Pending",
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
          vesselLocation:
            booking.vendorAssigned?.businessAddress || "Not Available",
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
    // Flatten all services from all vendors
    const allServices = services.reduce((acc, vendor) => {
      const vendorServices = vendor.services.map((service) => ({
        label: service.name, // Service name for display
        value: service._id, // Service ID
        vendorName: vendor.businessName,
        businessAddress: vendor.businessAddress,
        vendorId: vendor._id,
        description: service.description,
      }));
      return [...acc, ...vendorServices];
    }, []);

    console.log("Formatted Services:", allServices);
    return allServices;
  };

  // Add this responsive table rendering function to your Bookings component
  const renderResponsiveBookingRow = (booking) => {
    return (
      <div className="mobile-booking-card">
        {/* <div className="mobile-booking-header">
          <span className="booking-id">{booking.id}</span>
          <span
            className={`booking-status status-${booking.status.toLowerCase()}`}
          >
            {booking.status}
          </span>
        </div>

        <div className="mobile-booking-details">
          <div className="detail-row">
            <span className="detail-label">Service:</span>
            <span className="detail-value">{booking.serviceType}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Vendor:</span>
            <span className="detail-value">{booking.vendorAssigned}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{booking.serviceArea}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Date:</span>
            <span className="detail-value">
              {new Date(booking.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {booking.notes && (
            <div className="detail-row notes">
              <span className="detail-label">Notes:</span>
              <span className="detail-value">{booking.notes}</span>
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
        </div> */}
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
            <h3>Bookings</h3>
          </div>
        </div>
      </div>

      <div
        className="bookings-wrapper"
        style={{
          height: "100%",
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme === "light" ? "#F8FBFF" : "#103B57",
          color: theme === "light" ? "#103B57" : "#FFFFFF",
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

                  <div className="p-fluid">
                    {/* Customer and Service Name */}
                    <div
                      className="p-grid p-formgrid"
                      style={{
                        display: "flex",
                        gap: "15px",
                        marginBottom: "20px",
                      }}
                    >
                      <div className="p-field" style={{ flex: 1 }}>
                        <label
                          htmlFor="email"
                          style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "500",
                            textAlign: "left",
                          }}
                        >
                          Customer Email*
                        </label>
                        <InputText
                          id="email"
                          name="email"
                          value={editingBooking?.email || ""}
                          onChange={handleEditInputChange}
                          placeholder="Enter customer email"
                          style={{ width: "100%" }}
                        />
                      </div>
                      <div className="p-field" style={{ flex: 1 }}>
                        <label
                          htmlFor="serviceName"
                          style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "500",
                            textAlign: "left",
                          }}
                        >
                          Service Name*
                        </label>
                        <Dropdown
                          id="serviceName"
                          name="serviceName"
                          value={
                            editingBooking?.services
                              .map((service) => service.service._id)
                              .join(", ") || ""
                          }
                          options={services.map((service) => ({
                            label: service.name,
                            value: service._id,
                          }))}
                          onChange={handleEditServiceChange}
                          placeholder="Select service name"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>

                    {/* Price and Date & Time */}
                    <div
                      className="p-grid p-formgrid"
                      style={{
                        display: "flex",
                        gap: "15px",
                        marginBottom: "20px",
                      }}
                    >
                      <div className="p-field" style={{ flex: 1 }}>
                        <label
                          htmlFor="totalPrice"
                          style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "500",
                            textAlign: "left",
                          }}
                        >
                          Price*
                        </label>
                        <InputText
                          id="totalPrice"
                          name="totalPrice"
                          value={editingBooking?.totalPrice || ""}
                          onChange={handleEditInputChange}
                          placeholder="Enter price"
                          style={{ width: "100%" }}
                        />
                      </div>
                      <div className="p-field" style={{ flex: 1 }}>
                        <label
                          htmlFor="bookingDate"
                          name="bookingDate"
                          style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "500",
                            textAlign: "left",
                          }}
                        >
                          Date & Time*
                        </label>
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
                          showIcon
                          placeholder="Select date and time"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>

                    {/* Booking Status and Internal Notes */}
                    <div
                      className="p-grid p-formgrid"
                      style={{
                        display: "flex",
                        gap: "15px",
                        marginBottom: "30px",
                      }}
                    >
                      <div className="p-field" style={{ flex: 1 }}>
                        <label
                          htmlFor="status"
                          style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "500",
                            textAlign: "left",
                          }}
                        >
                          Booking Status*
                        </label>
                        <Dropdown
                          id="status"
                          value={editingBooking?.status || ""}
                          options={[
                            { label: "completed", value: "completed" },
                            { label: "pending", value: "pending" },
                            { label: "cancelled", value: "cancelled" },
                            { label: "in progress", value: "in progress" },
                            { label: "flagged", value: "flagged" },
                            { label: "confirmed", value: "confirmed" },
                            { label: "rescheduled", value: "rescheduled" },
                          ]}
                          onChange={handleEditStatusChange}
                          placeholder="Select status"
                          style={{ width: "100%" }}
                          className="no-dropdown-scrollbar"
                        />
                      </div>
                      <div className="p-field" style={{ flex: 1 }}>
                        <label
                          htmlFor="reviews"
                          style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "500",
                            textAlign: "left",
                          }}
                        >
                          Internal Notes & Comments
                        </label>
                        <InputTextarea
                          id="reviews"
                          name="reviews"
                          value={editingBooking?.reviews || ""}
                          onChange={handleEditInputChange}
                          placeholder="Enter notes and comments"
                          style={{ width: "100%", minHeight: "80px" }}
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Submit and Cancel Buttons */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "15px",
                        marginTop: "20px",
                      }}
                    >
                      <Button
                        label="Cancel"
                        icon="pi pi-times"
                        onClick={() => setShowEditForm(false)}
                        style={{
                          backgroundColor: "#EF4444",
                          border: "none",
                          width: "150px",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      />
                      <Button
                        label="Save Changes"
                        icon="pi pi-check"
                        onClick={handleSaveBooking}
                        style={{
                          backgroundColor: "#0387D9",
                          border: "none",
                          width: "150px",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      />
                    </div>
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
                        }}
                      >
                        <table
                          className="bookings-table"
                          style={{
                            backgroundColor:
                              theme === "light" ? "#FFFFFF" : "#03141F",
                            color: theme === "light" ? "#103B57" : "#FFFFFF",
                          }}
                        >
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
                                  backgroundColor:
                                    theme === "light" ? "#FFFFFF" : "#03141F",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  className="header-checkbox"
                                />
                              </th>
                              <th style={{ fontSize: "12px" }}>
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
                              <th style={{ fontSize: "12px" }}>
                                Service Type
                                <img
                                  src={sortIcon}
                                  alt="sort"
                                  style={{
                                    marginBottom: "-3px",
                                    marginLeft: "5px",
                                  }}
                                />
                              </th>
                              <th style={{ fontSize: "12px" }}>
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
                              <th style={{ fontSize: "12px" }}>
                                Vesse Location
                                <img
                                  src={sortIcon}
                                  alt="sort"
                                  style={{
                                    marginBottom: "-3px",
                                    marginLeft: "5px",
                                  }}
                                />
                              </th>
                              <th style={{ fontSize: "12px" }}>
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
                              <th style={{ fontSize: "12px" }}>
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
                              <th style={{ fontSize: "12px" }}>
                                Internal Notes & Comments
                                <img
                                  src={sortIcon}
                                  alt="sort"
                                  style={{
                                    marginBottom: "-3px",
                                    marginLeft: "5px",
                                  }}
                                />
                              </th>
                              <th style={{ fontSize: "12px" }}>
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
                                      <input type="checkbox" />
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        fontSize: "11px",
                                      }}
                                    >
                                      {booking.bookingId}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        fontSize: "11px",
                                      }}
                                    >
                                      {booking.services?.[0]?.service?.name ||
                                        "N/A"}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        fontSize: "11px",
                                      }}
                                    >
                                      {booking.vendorAssigned?.businessName ||
                                        "Not Assigned"}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        fontSize: "11px",
                                      }}
                                    >
                                      {booking.vendorAssigned
                                        ?.businessAddress || "Not Available"}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        fontSize: "11px",
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
                                        fontSize: "11px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          backgroundColor:
                                            booking.bookingStatus ===
                                            "Confirmed"
                                              ? "#e6f7ee"
                                              : booking.bookingStatus ===
                                                "Pending"
                                              ? "#fff8e6"
                                              : booking.bookingStatus ===
                                                "Completed"
                                              ? "#e6f0ff"
                                              : "#ffebeb",
                                          color:
                                            booking.bookingStatus ===
                                            "Confirmed"
                                              ? "#1d9d74"
                                              : booking.bookingStatus ===
                                                "Pending"
                                              ? "#ff9800"
                                              : booking.bookingStatus ===
                                                "Completed"
                                              ? "#3366ff"
                                              : "#ff4d4f",
                                          padding: "2px 6px",
                                          borderRadius: "4px",
                                          fontSize: "10px",
                                        }}
                                      >
                                        {booking.bookingStatus}
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        fontSize: "11px",
                                      }}
                                    >
                                      {booking.internalNotes || "No notes"}
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
                                                width: "15px",
                                                height: "15px",
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
                                              width: "15px",
                                              height: "15px",
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
                                          tooltip="Edit"
                                          tooltipOptions={{ position: "top" }}
                                          // onClick={() => handleEditBooking(booking)}
                                        >
                                          <img
                                            src={times}
                                            alt="times"
                                            style={{
                                              width: "15px",
                                              height: "15px",
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
                                              width: "15px",
                                              height: "15px",
                                            }}
                                          />
                                        </Button>

                                        {/* Download button */}
                                        {/* <Button
                                        icon="pi pi-download"
                                        className="p-button-text p-button-sm"
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                          padding: "1px",
                                          border: "1px solid #ddd",
                                          borderRadius: "50%",
                                        }}
                                        tooltip="Download"
                                        tooltipOptions={{ position: "top" }}
                                      /> */}
                                        <img
                                          src={downloadIcon}
                                          alt="Download"
                                          style={{
                                            width: "15px",
                                            height: "15px",
                                          }}
                                        />

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
                                          tooltip="Upload Booking"
                                          tooltipOptions={{ position: "top" }}
                                          onClick={() =>
                                            handleUploadBooking(booking)
                                          }
                                        >
                                          <img
                                            src={uploadBooking}
                                            alt="Upload"
                                            style={{
                                              width: "15px",
                                              height: "15px",
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
                    {bookingData.map((booking, index) => (
                      <div key={index} className="mobile-booking-wrapper">
                        {renderResponsiveBookingRow(booking)}
                      </div>
                    ))}
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
            label: "confirmed",
            command: () =>
              handleStatusChange(selectedBookingForStatus, "confirmed"),
          },
          {
            label: "completed",
            command: () =>
              handleStatusChange(selectedBookingForStatus, "completed"),
          },
          {
            label: "pending",
            command: () =>
              handleStatusChange(selectedBookingForStatus, "pending"),
          },
          {
            label: "in progress",
            command: () =>
              handleStatusChange(selectedBookingForStatus, "in progress"),
          },
          {
            label: "flagged",
            command: () =>
              handleStatusChange(selectedBookingForStatus, "flagged"),
          },
        ]}
        popup
        ref={statusMenuRef}
        id="status-menu"
        style={{ fontSize: "0.8rem" }}
      />

      {/* View Booking Details Modal */}
      <Dialog
        visible={showViewModal}
        onHide={() => setShowViewModal(false)}
        header="Booking Details"
        className="view-booking-modal"
        modal
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        style={{ width: "30vw" }}
        maskStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(4px)",
        }}
      >
        {viewBooking && (
          <div
            className="view-form"
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <label
                  htmlFor="bookingId"
                  style={{ fontWeight: "600", fontSize: "0.9rem" }}
                >
                  Booking ID
                </label>
                <div className="view-field">{viewBooking.bookingId}</div>
              </div>
              <div
                className="form-group"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <label
                  htmlFor="email"
                  style={{ fontWeight: "600", fontSize: "0.9rem" }}
                >
                  Email
                </label>
                <div className="view-field">{viewBooking.email}</div>
              </div>
            </div>

            <div className="form-row">
              <div
                className="form-group"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <label
                  htmlFor="services"
                  style={{ fontWeight: "600", fontSize: "0.9rem" }}
                >
                  Service Name
                </label>
                <div className="view-field">
                  {viewBooking.services
                    .map((service) => service.service.name)
                    .join(", ")}
                </div>
              </div>
              <div
                className="form-group"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <label
                  htmlFor="totalPrice"
                  style={{ fontWeight: "600", fontSize: "0.9rem" }}
                >
                  Price
                </label>
                <div className="view-field">${viewBooking.totalPrice}</div>
              </div>
            </div>

            <div className="form-row">
              <div
                className="form-group"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <label
                  htmlFor="date"
                  style={{ fontWeight: "600", fontSize: "0.9rem" }}
                >
                  Date
                </label>
                <div className="view-field">
                  {new Date(viewBooking.dateTime).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div
                className="form-group"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <label
                  htmlFor="status"
                  style={{ fontWeight: "600", fontSize: "0.9rem" }}
                >
                  Status
                </label>
                <div className="view-field">
                  <span
                    style={{
                      backgroundColor:
                        viewBooking.bookingStatus === "confirmed"
                          ? "#e6f7ee"
                          : viewBooking.bookingStatus === "pending"
                          ? "#fff8e6"
                          : viewBooking.bookingStatus === "completed"
                          ? "#e6f0ff"
                          : viewBooking.bookingStatus === "in progress"
                          ? "#e6f7ff"
                          : viewBooking.bookingStatus === "flagged"
                          ? "#ffe6e6"
                          : "#ffebeb",
                      color:
                        viewBooking.bookingStatus === "confirmed"
                          ? "#1d9d74"
                          : viewBooking.bookingStatus === "pending"
                          ? "#ff9800"
                          : viewBooking.bookingStatus === "completed"
                          ? "#3366ff"
                          : viewBooking.bookingStatus === "in progress"
                          ? "#0099cc"
                          : viewBooking.bookingStatus === "flagged"
                          ? "#ff4d4f"
                          : "#ff4d4f",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {viewBooking.bookingStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div
                className="form-group"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "15px",
                  width: "100%",
                }}
              >
                <label
                  htmlFor="reviews"
                  style={{
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    marginBottom: "8px",
                  }}
                >
                  Participant Reviews
                </label>
                <div
                  className="view-field"
                  style={{
                    padding: "10px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "4px",
                    minHeight: "60px",
                    fontSize: "0.85rem",
                    lineHeight: "1.5",
                  }}
                >
                  {viewBooking.reviews
                    ?.map((review) => review.review)
                    .join(", ") || "No reviews"}
                </div>
              </div>
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
                // Auto-populate vendor and location
                if (selectedService) {
                  handleNewBookingChange(
                    "vendorAssigned",
                    selectedService.vendorName
                  );
                  handleNewBookingChange(
                    "vesselLocation",
                    selectedService.businessAddress
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
              disabled
              placeholder="Location will be auto-assigned"
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
              options={["Cancel", "Pending", "Confirmed", "Completed"]}
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
    </>
  );
};

export default Bookings;

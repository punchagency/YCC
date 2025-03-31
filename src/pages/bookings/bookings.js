import React, { useState, useRef } from "react";
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
import "./bookings.css";

const Bookings = () => {
  const navigate = useNavigate();
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
  const [uploadForm, setUploadForm] = useState({
    invoiceNumber: "",
    date: null,
    amount: "",
    file: null,
  });

  // Sample bookings data
  const [bookings, setBookings] = useState([
    {
      id: "BK-001",
      serviceType: "Maintenance",
      vendorAssigned: "Marine Services Inc.",
      serviceArea: "Engine Room",
      date: "2023-11-15",
      status: "Confirmed",
      reviews:
        "The service was excellent. The technician was very knowledgeable and fixed the issue quickly.",
    },
    {
      id: "BK-002",
      serviceType: "Cleaning",
      vendorAssigned: "Yacht Cleaners Pro",
      serviceArea: "Exterior",
      date: "2023-11-18",
      status: "Pending",
      reviews:
        "Scheduled for next week. Previous services from this vendor have been satisfactory.",
    },
    {
      id: "BK-003",
      serviceType: "Repair",
      vendorAssigned: "Tech Solutions",
      serviceArea: "Navigation",
      date: "2023-11-20",
      status: "Completed",
      reviews:
        "The navigation system is working perfectly now. Great job by the technician.",
    },
    {
      id: "BK-004",
      serviceType: "Inspection",
      vendorAssigned: "Safety First",
      serviceArea: "Safety Equipment",
      date: "2023-11-22",
      status: "Confirmed",
      reviews:
        "Looking forward to the annual inspection. Last year's inspection was thorough and helpful.",
    },
    {
      id: "BK-005",
      serviceType: "Provisioning",
      vendorAssigned: "Gourmet Supplies",
      serviceArea: "Galley",
      date: "2023-11-25",
      status: "Pending",
      reviews: "Need to confirm specific items before the delivery date.",
    },
    {
      id: "BK-006",
      serviceType: "Maintenance",
      vendorAssigned: "HVAC Specialists",
      serviceArea: "Air Conditioning",
      date: "2023-11-28",
      status: "Cancelled",
      reviews:
        "Cancelled due to scheduling conflict. Will reschedule for next month.",
    },
    {
      id: "BK-007",
      serviceType: "Repair",
      vendorAssigned: "Electrical Experts",
      serviceArea: "Electrical Systems",
      date: "2023-12-01",
      status: "Confirmed",
      reviews:
        "Recurring electrical issues need to be addressed. Previous attempts were not successful.",
    },
  ]);

  const goCrewDashboardPage = () => {
    navigate("/crew/dashboard");
  };

  const goInventorySummaryPage = () => {
    navigate("/crew/inventory/summary");
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowReviewModal(true);
  };

  // Add this function to handle status changes
  const handleStatusChange = (booking, newStatus) => {
    const updatedBookings = bookings.map((b) => {
      if (b.id === booking.id) {
        return { ...b, status: newStatus };
      }
      return b;
    });
    setBookings(updatedBookings);
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
    setEditingBooking({
      ...editingBooking,
      [name]: value,
    });
  };

  const handleEditDateChange = (e) => {
    setEditingBooking({
      ...editingBooking,
      date: e.value,
    });
  };

  const handleEditStatusChange = (e) => {
    setEditingBooking({
      ...editingBooking,
      status: e.value,
    });
  };

  const handleSaveBooking = () => {
    const updatedBookings = bookings.map((b) => {
      if (b.id === editingBooking.id) {
        return editingBooking;
      }
      return b;
    });

    setBookings(updatedBookings);
    setShowEditForm(false);
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

  // Add this responsive table rendering function to your Bookings component
  const renderResponsiveBookingRow = (booking) => {
    return (
      <div className="mobile-booking-card">
        <div className="mobile-booking-header">
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
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3>Bookings</h3>
          </div>
        </div>
      </div>

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
                  <h3 style={{ margin: 0 }}>Manage Settings</h3>
                  <Button
                    icon="pi pi-times"
                    className="p-button-rounded p-button-text"
                    onClick={() => setShowEditForm(false)}
                    aria-label="Close"
                  />
                </div>

                <div className="p-fluid">
                  {/* Service Type and Vendor Assigned */}
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
                        htmlFor="serviceType"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "500",
                          textAlign: "left",
                        }}
                      >
                        Service Type*
                      </label>
                      <InputText
                        id="serviceType"
                        name="serviceType"
                        value={editingBooking?.serviceType || ""}
                        onChange={handleEditInputChange}
                        placeholder="Enter service type"
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div className="p-field" style={{ flex: 1 }}>
                      <label
                        htmlFor="vendorAssigned"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "500",
                          textAlign: "left",
                        }}
                      >
                        Vendor Assigned*
                      </label>
                      <InputText
                        id="vendorAssigned"
                        name="vendorAssigned"
                        value={editingBooking?.vendorAssigned || ""}
                        onChange={handleEditInputChange}
                        placeholder="Enter vendor name"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  {/* Vessel Location and Date & Time */}
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
                        htmlFor="serviceArea"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "500",
                          textAlign: "left",
                        }}
                      >
                        Vessel Location*
                      </label>
                      <InputText
                        id="serviceArea"
                        name="serviceArea"
                        value={editingBooking?.serviceArea || ""}
                        onChange={handleEditInputChange}
                        placeholder="Enter vessel location"
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div className="p-field" style={{ flex: 1 }}>
                      <label
                        htmlFor="date"
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
                        id="date"
                        value={
                          editingBooking?.date
                            ? new Date(editingBooking.date)
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
                          { label: "Completed", value: "Completed" },
                          { label: "Pending", value: "Pending" },
                          { label: "Cancelled", value: "Cancelled" },
                          { label: "Rescheduled", value: "Rescheduled" },
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
                  <table
                    className="inventory-header-table"
                    style={{
                      width: "100%",
                      tableLayout: "fixed",
                      borderCollapse: "collapse",
                      marginBottom: "0",
                      fontSize: "0.8rem",
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            width: "10%",
                            textAlign: "left",
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={sort}
                              alt="sort"
                              style={{
                                width: "12px",
                                height: "12px",
                                marginRight: "5px",
                              }}
                            />
                            <p style={{ margin: 0, flex: 1, fontSize: "10px" }}>
                              Booking ID
                            </p>
                          </div>
                        </th>
                        <th
                          style={{
                            width: "12%",
                            textAlign: "left",
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={sort}
                              alt="sort"
                              style={{
                                width: "12px",
                                height: "12px",
                                marginRight: "5px",
                              }}
                            />
                            <p style={{ margin: 0, flex: 1, fontSize: "10px" }}>
                              Service Type
                            </p>
                          </div>
                        </th>
                        <th
                          style={{
                            width: "15%",
                            textAlign: "left",
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={sort}
                              alt="sort"
                              style={{
                                width: "12px",
                                height: "12px",
                                marginRight: "5px",
                              }}
                            />
                            <p style={{ margin: 0, flex: 1, fontSize: "10px" }}>
                              Vendor Assigned
                            </p>
                          </div>
                        </th>
                        <th
                          style={{
                            width: "12%",
                            textAlign: "left",
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={sort}
                              alt="sort"
                              style={{
                                width: "12px",
                                height: "12px",
                                marginRight: "5px",
                              }}
                            />
                            <p style={{ margin: 0, flex: 1, fontSize: "10px" }}>
                              Service Area
                            </p>
                          </div>
                        </th>
                        <th
                          style={{
                            width: "10%",
                            textAlign: "left",
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={sort}
                              alt="sort"
                              style={{
                                width: "12px",
                                height: "12px",
                                marginRight: "5px",
                              }}
                            />
                            <p style={{ margin: 0, flex: 1, fontSize: "10px" }}>
                              Date
                            </p>
                          </div>
                        </th>
                        <th
                          style={{
                            width: "12%",
                            textAlign: "left",
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={sort}
                              alt="sort"
                              style={{
                                width: "12px",
                                height: "12px",
                                marginRight: "5px",
                              }}
                            />
                            <p style={{ margin: 0, flex: 1, fontSize: "10px" }}>
                              Status
                            </p>
                          </div>
                        </th>
                        <th
                          style={{
                            width: "15%",
                            textAlign: "left",
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={sort}
                              alt="sort"
                              style={{
                                width: "12px",
                                height: "12px",
                                marginRight: "5px",
                              }}
                            />
                            <p style={{ margin: 0, flex: 1, fontSize: "10px" }}>
                              Notes & Comments
                            </p>
                          </div>
                        </th>
                        <th
                          style={{
                            width: "14%",
                            textAlign: "center",
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <p style={{ margin: 0, fontSize: "10px" }}>Actions</p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, index) => (
                        <tr
                          key={index}
                          style={{
                            borderBottom: "1px solid #eee",
                            backgroundColor:
                              index % 2 === 0 ? "#fff" : "#f9f9f9",
                          }}
                        >
                          <td style={{ padding: "8px", fontSize: "11px" }}>
                            {booking.id}
                          </td>
                          <td style={{ padding: "8px", fontSize: "11px" }}>
                            {booking.serviceType}
                          </td>
                          <td style={{ padding: "8px", fontSize: "11px" }}>
                            {booking.vendorAssigned}
                          </td>
                          <td style={{ padding: "8px", fontSize: "11px" }}>
                            {booking.serviceArea}
                          </td>
                          <td style={{ padding: "8px", fontSize: "11px" }}>
                            {new Date(booking.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td style={{ padding: "8px", fontSize: "11px" }}>
                            <span
                              style={{
                                backgroundColor:
                                  booking.status === "Confirmed"
                                    ? "#e6f7ee"
                                    : booking.status === "Pending"
                                    ? "#fff8e6"
                                    : booking.status === "Completed"
                                    ? "#e6f0ff"
                                    : booking.status === "In Progress"
                                    ? "#e6f7ff"
                                    : booking.status === "Flagged"
                                    ? "#ffe6e6"
                                    : "#ffebeb",
                                color:
                                  booking.status === "Confirmed"
                                    ? "#1d9d74"
                                    : booking.status === "Pending"
                                    ? "#ff9800"
                                    : booking.status === "Completed"
                                    ? "#3366ff"
                                    : booking.status === "In Progress"
                                    ? "#0099cc"
                                    : booking.status === "Flagged"
                                    ? "#ff4d4f"
                                    : "#ff4d4f",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "10px",
                              }}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td style={{ padding: "8px", fontSize: "11px" }}>
                            <Button
                              icon="pi pi-eye"
                              className="p-button-text p-button-sm"
                              style={{
                                padding: "2px",
                                fontSize: "10px",
                                color: "#0387D9",
                              }}
                              onClick={() => handleViewReview(booking.reviews)}
                              label="Participant Reviews..."
                            />
                          </td>
                          <td
                            style={{
                              padding: "6px",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            <div style={{ display: "flex", gap: "3px" }}>
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
                                onClick={() => handleViewBooking(booking)}
                              >
                                <div style={{ backgroundColor: "white" }}>
                                  <img
                                    src={eyeblock}
                                    alt="View"
                                    style={{ width: "15px", height: "15px" }}
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
                                onClick={() => handleEditBooking(booking)}
                              >
                                <img
                                  src={editLogo}
                                  alt="Edit"
                                  style={{ width: "15px", height: "15px" }}
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
                                onClick={() => handleEditBooking(booking)}
                              >
                                <img
                                  src={times}
                                  alt="times"
                                  style={{ width: "15px", height: "15px" }}
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
                                  setSelectedBookingForStatus(booking);
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
                                  style={{ width: "15px", height: "15px" }}
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
                                style={{ width: "15px", height: "15px" }}
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
                                onClick={() => handleUploadBooking(booking)}
                              >
                                <img
                                  src={uploadBooking}
                                  alt="Upload"
                                  style={{ width: "15px", height: "15px" }}
                                />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile view */}
                <div className="mobile-view">
                  {bookings.map((booking, index) => (
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
            label: "Confirmed",
            command: () =>
              handleStatusChange(selectedBookingForStatus, "Confirmed"),
          },
          {
            label: "Completed",
            command: () =>
              handleStatusChange(selectedBookingForStatus, "Completed"),
          },
          {
            label: "Pending",
            command: () =>
              handleStatusChange(selectedBookingForStatus, "Pending"),
          },
          {
            label: "In Progress",
            command: () =>
              handleStatusChange(selectedBookingForStatus, "In Progress"),
          },
          {
            label: "Flagged",
            command: () =>
              handleStatusChange(selectedBookingForStatus, "Flagged"),
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
                <div className="view-field">{viewBooking.id}</div>
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
                  htmlFor="serviceType"
                  style={{ fontWeight: "600", fontSize: "0.9rem" }}
                >
                  Service Type
                </label>
                <div className="view-field">{viewBooking.serviceType}</div>
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
                  htmlFor="vendorAssigned"
                  style={{ fontWeight: "600", fontSize: "0.9rem" }}
                >
                  Vendor Assigned
                </label>
                <div className="view-field">{viewBooking.vendorAssigned}</div>
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
                  htmlFor="serviceArea"
                  style={{ fontWeight: "600", fontSize: "0.9rem" }}
                >
                  Service Area
                </label>
                <div className="view-field">{viewBooking.serviceArea}</div>
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
                  {new Date(viewBooking.date).toLocaleDateString("en-US", {
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
                        viewBooking.status === "Confirmed"
                          ? "#e6f7ee"
                          : viewBooking.status === "Pending"
                          ? "#fff8e6"
                          : viewBooking.status === "Completed"
                          ? "#e6f0ff"
                          : viewBooking.status === "In Progress"
                          ? "#e6f7ff"
                          : viewBooking.status === "Flagged"
                          ? "#ffe6e6"
                          : "#ffebeb",
                      color:
                        viewBooking.status === "Confirmed"
                          ? "#1d9d74"
                          : viewBooking.status === "Pending"
                          ? "#ff9800"
                          : viewBooking.status === "Completed"
                          ? "#3366ff"
                          : viewBooking.status === "In Progress"
                          ? "#0099cc"
                          : viewBooking.status === "Flagged"
                          ? "#ff4d4f"
                          : "#ff4d4f",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {viewBooking.status}
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
                  {viewBooking.reviews}
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
    </>
  );
};

export default Bookings;

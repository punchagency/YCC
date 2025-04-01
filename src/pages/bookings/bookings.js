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
import "./bookings.css";

// Context
import { useBooking } from "../../context/booking/bookingContext";

const Bookings = () => {
  
  const navigate = useNavigate();


  // Context
  const { bookings, deleteBooking } = useBooking();










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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Add this useEffect to handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


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
    //setBookings(updatedBookings);
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

    //setBookings(updatedBookings);
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

  // Add this function to format dates consistently
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Add this function to get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed':
        return '#1d9d74';
      case 'Pending':
        return '#ff9800';
      case 'Completed':
        return '#3366ff';
      case 'Cancelled':
        return '#ff4d4f';
      default:
        return '#6c757d';
    }
  };

  // Add this function to get status background color
  const getStatusBgColor = (status) => {
    switch(status) {
      case 'Confirmed':
        return '#e6f7ee';
      case 'Pending':
        return '#fff8e6';
      case 'Completed':
        return '#e6f0ff';
      case 'Cancelled':
        return '#ffebeb';
      default:
        return '#f8f9fa';
    }
  };

  // Add this function to render mobile booking cards
  const renderMobileBookingCards = () => {
    return (
      <div style={{ padding: '0 10px' }}>
        {bookings.map((booking, index) => (
          <div 
            key={index} 
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '8px',
              alignItems: 'center'
            }}>
              <div>
                <p style={{ 
                  margin: '0 0 2px 0', 
                  fontSize: '15px', 
                  fontWeight: 'bold' 
                }}>
                  {booking.bookingId}
                </p>
                <p style={{ 
                  margin: '0', 
                  fontSize: '13px', 
                  color: '#666' 
                }}>
                  {booking.serviceType}
                </p>
              </div>
              
              <div>
                <span
                  style={{
                    backgroundColor: getStatusBgColor(booking.status),
                    color: getStatusColor(booking.status),
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {booking.status}
                </span>
              </div>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              fontSize: '12px',
              marginBottom: '8px'
            }}>
              <div>
                <span style={{ color: '#666', fontWeight: '500' }}>Vendor: </span>
                <span style={{ wordBreak: 'break-word' }}>{booking.vendorAssigned}</span>
              </div>
              <div>
                <span style={{ color: '#666', fontWeight: '500' }}>Area: </span>
                <span>{booking.serviceArea}</span>
              </div>
              <div>
                <span style={{ color: '#666', fontWeight: '500' }}>Date: </span>
                <span>{formatDate(booking.bookingDate)}</span>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #eee',
              paddingTop: '8px'
            }}>
              <a 
                href="#" 
                style={{ 
                  color: '#0387D9', 
                  textDecoration: 'none',
                  fontSize: '12px'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleViewReview(booking.reviews);
                }}
              >
                Participant Reviews...
              </a>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  icon="pi pi-eye"
                  className="p-button-rounded p-button-text p-button-sm"
                  onClick={() => handleViewBooking(booking)}
                  style={{ width: '30px', height: '30px' }}
                />
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-text p-button-sm"
                  onClick={() => handleEditBooking(booking)}
                  style={{ width: '30px', height: '30px' }}
                />
                <Button
                  icon="pi pi-upload"
                  className="p-button-rounded p-button-text p-button-sm"
                  onClick={() => handleUploadBooking(booking)}
                  style={{ width: '30px', height: '30px' }}
                />
              </div>
            </div>
          </div>
        ))}
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

      <div className="bookings-container">
        {isMobile ? (
          // Mobile view with cards
          renderMobileBookingCards()
        ) : (
          // Desktop view with table (keep existing code)
          <div className="bookings-table-container">
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
                    <div style={{ display: "flex", alignItems: "center" }}>
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
                    <div style={{ display: "flex", alignItems: "center" }}>
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
                        Customer
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
                    <div style={{ display: "flex", alignItems: "center" }}>
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
                      Service Name
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
                    <div style={{ display: "flex", alignItems: "center" }}>
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
                        Price
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
                    <div style={{ display: "flex", alignItems: "center" }}>
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
                    <div style={{ display: "flex", alignItems: "center" }}>
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
                    <div style={{ display: "flex", alignItems: "center" }}>
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
                      backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                    }}
                  >
                    <td style={{ padding: "8px", fontSize: "11px" }}>
                      {booking.bookingId}
                    </td>
                    <td style={{ padding: "8px", fontSize: "11px" }}>
                      {booking.email}
                    </td>
                    <td style={{ padding: "8px", fontSize: "11px" }}>
                    {booking.services.map((service) => service.service.name).join(', ')}
                    </td>
                    <td style={{ padding: "8px", fontSize: "11px" }}>
                    ${booking.totalPrice}
                    </td>
                    <td style={{ padding: "8px", fontSize: "11px" }}>
                      {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
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
        )}
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
                  Customer
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
                <div className="view-field">{viewBooking.services.map((service) => service.service.name).join(', ')}</div>
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
                  {new Date(viewBooking.bookingDate).toLocaleDateString("en-US", {
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
                  {viewBooking.reviews?.map((review) => review.review).join(', ') || 'No reviews'}
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

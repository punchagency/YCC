import { LineWeight } from "@mui/icons-material";
import React, { useState, useEffect, useCallback } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import vector from "../../../assets/images/crew/Vector 5.png";
import calendar from "../../../assets/images/crew/crewcalendar.png";
import location from "../../../assets/images/crew/location.png";
import dollar from "../../../assets/images/crew/dollar.png";
import cleaning from "../../../assets/images/crew/cleaning.png";
import message from "../../../assets/images/crew/message.png";
import call from "../../../assets/images/crew/call.png";
import editLogo from "../../../assets/images/crew/editLogo.png";
import { Dialog } from "primereact/dialog";
import { FiClock, FiCheck } from "react-icons/fi";
import { getBookingById } from "../../../services/crew/crewBookingService";
import { useToast } from "../../../components/Toast";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showError } = useToast();
  const outletContext = useOutletContext();

  // Get booking details from location state or initialize empty object
  const [bookingDetails, setBookingDetails] = useState(
    location.state?.bookingDetails || {}
  );
  const [loading, setLoading] = useState(!location.state?.bookingDetails);
  const [error, setError] = useState(null);
  const [showModificationHistory, setShowModificationHistory] = useState(false);

  // Responsive: detect mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to fetch booking by ID
  const fetchBookingById = useCallback(
    async (id) => {
      console.log("Fetching booking details for ID:", id);
      try {
        const response = await getBookingById(id);
        console.log("Fetched booking details:", response);

        if (response.status) {
          setBookingDetails(response.data);
        } else {
          setError(response.error || "Failed to fetch booking details");
          showError(response.error || "Failed to fetch booking details");
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError("An unexpected error occurred");
        showError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
    [showError]
  );

  // If no booking details in state, fetch them using the ID
  useEffect(() => {
    if (!location.state?.bookingDetails && bookingId) {
      fetchBookingById(bookingId);
    }
  }, [bookingId, location.state, fetchBookingById]);

  // Function to navigate to modify service page
  const handleNavigateToModifyService = useCallback(() => {
    navigate(`/crew/booking/modify/${bookingId}`, {
      state: { bookingDetails },
    });
  }, [bookingId, bookingDetails, navigate]);

  // Simple function to go back
  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Set the title bar and back button for this details/inner page
  useEffect(() => {
    if (outletContext && outletContext.setPageTitle) {
      outletContext.setPageTitle("Booking Details", { backArrow: true });
    }
  }, [outletContext]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  return (
    <div
      className="booking-details-main-container"
      style={{
        padding: isMobile ? "12px 0" : "24px 8px",
        maxWidth: isMobile ? "100%" : 1200,
        margin: "0 auto",
        width: "100%",
        minHeight: "100vh",
        background: isMobile ? "#F3F4F6" : undefined,
      }}
    >
      <div
        className="flex flex-wrap justify-content-around gap-4"
        style={{
          flexDirection: isMobile ? "column" : undefined,
          alignItems: isMobile ? "stretch" : undefined,
          gap: isMobile ? 12 : 16,
        }}
      >
        <div
          className="bg-white pt-4 pb-4 pl-5 pr-5 booking-details-card"
          style={{
            width: isMobile ? "100%" : "100%",
            maxWidth: isMobile ? "100%" : 600,
            borderRadius: isMobile ? "10px" : "18px",
            boxShadow: isMobile
              ? "0 1px 6px rgba(0,0,0,0.06)"
              : "0 4px 24px rgba(0,0,0,0.07)",
            marginBottom: isMobile ? 16 : 24,
            padding: isMobile ? "16px 10px" : undefined,
          }}
        >
          <div className="mb-5">
            <h2
              style={{
                fontSize: isMobile ? 20 : 28,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              Booking {bookingDetails.bookingId || bookingDetails._id || "N/A"}
            </h2>
            <p
              style={{
                fontSize: isMobile ? 14 : 16,
                color: "#666",
                marginBottom: 0,
              }}
            >
              Payment Status: {bookingDetails.paymentStatus || "N/A"}
            </p>
          </div>
          <div
            className="flex flex-wrap justify-content-between mb-5 gap-3"
            style={{ flexDirection: isMobile ? "column" : undefined }}
          >
            <div>
              <h3 style={{ fontSize: isMobile ? 16 : 20, fontWeight: 600 }}>
                Service Details
              </h3>
              <div className="flex align-items-center mb-3">
                <img
                  src={cleaning}
                  alt="cleaning"
                  width={isMobile ? "16" : "18"}
                  height={isMobile ? "16" : "18"}
                  className="mr-2"
                />
                <p style={{ fontSize: isMobile ? 14 : 16, margin: 0 }}>
                  {(bookingDetails.services &&
                    bookingDetails.services[0]?.service?.name) ||
                    "N/A"}
                </p>
              </div>
              <div className="flex align-items-center mb-3">
                <img
                  src={calendar}
                  alt="calendar"
                  width={isMobile ? "16" : "18"}
                  height={isMobile ? "16" : "18"}
                  className="mr-2"
                />
                <p style={{ fontSize: isMobile ? 14 : 16, margin: 0 }}>
                  {bookingDetails.dateTime
                    ? new Date(bookingDetails.dateTime).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div className="flex align-items-center mb-3">
                <img
                  src={location}
                  alt="location"
                  width={isMobile ? "13" : "15"}
                  height={isMobile ? "13" : "15"}
                  className="mr-2"
                />
                <p style={{ fontSize: isMobile ? 14 : 16 }}>
                  {bookingDetails.serviceLocation ||
                    bookingDetails.vendorLocation ||
                    "N/A"}
                </p>
              </div>
              <div className="flex align-items-center mb-3">
                <img
                  src={dollar}
                  alt="dollar"
                  width={isMobile ? "9" : "10"}
                  height={isMobile ? "13" : "15"}
                  className="mr-2"
                />
                <p style={{ fontSize: isMobile ? 14 : 16 }}>
                  $
                  {(bookingDetails.services &&
                    bookingDetails.services[0]?.service?.price) ||
                    "N/A"}
                </p>
              </div>
            </div>
            <div style={{ marginTop: isMobile ? 12 : 0 }}>
              <h3 style={{ fontSize: isMobile ? 16 : 20 }}>
                Vendor Information
              </h3>
              <p style={{ fontSize: isMobile ? 14 : 16 }}>
                {bookingDetails.vendorName || "N/A"}
              </p>
              <p style={{ fontSize: isMobile ? 13 : 15 }}>
                {bookingDetails.vendorDescription || "Service Provider"}
              </p>
              <div
                className="mt-4 flex justify-content-between"
                style={{ width: "400px" }}
              >
                <button
                  style={{
                    backgroundColor: " #1A9E6D",
                    color: "white",
                    width: "150px",
                    height: "35px",
                    border: "1px solid #1A9E6D",
                    borderRadius: "8px",
                    marginRight: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition:
                      "background 0.18s, transform 0.18s, box-shadow 0.18s",
                    boxShadow: "0 2px 8px rgba(26,158,109,0.10)",
                    cursor: "pointer",
                    outline: "none",
                  }}
                  onClick={() => alert("Message vendor")}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#23c686";
                    e.currentTarget.style.transform = "scale(1.04)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(26,158,109,0.18)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#1A9E6D";
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(26,158,109,0.10)";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "2px solid #026bb3";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "scale(0.98)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "scale(1.04)";
                  }}
                >
                  <img
                    src={message}
                    alt="message"
                    width="15px"
                    height="15px"
                    className="mr-2"
                  />
                  Message
                </button>
                <button
                  style={{
                    backgroundColor: "#0387D9",
                    color: "white",
                    width: "150px",
                    height: "35px",
                    border: "1px solid #0387D9",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition:
                      "background 0.18s, transform 0.18s, box-shadow 0.18s",
                    boxShadow: "0 2px 8px rgba(3,135,217,0.10)",
                    cursor: "pointer",
                    outline: "none",
                  }}
                  onClick={() => alert("Call vendor")}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#0baaff";
                    e.currentTarget.style.transform = "scale(1.04)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(3,135,217,0.18)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#0387D9";
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(3,135,217,0.10)";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "2px solid #026bb3";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "scale(0.98)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "scale(1.04)";
                  }}
                >
                  <img
                    src={call}
                    alt="call"
                    width="15px"
                    height="15px"
                    className="mr-2"
                  />
                  Call
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            {/* Removed Reschedule, Modify Service, and Cancel buttons as requested */}
          </div>
        </div>
        <div
          className="bg-white"
          style={{
            width: isMobile ? "100%" : "40%",
            padding: isMobile ? "14px 10px" : "20px",
            borderRadius: "10px",
            height: isMobile ? "auto" : "350px",
            marginBottom: isMobile ? 12 : 0,
            boxSizing: "border-box",
          }}
        >
          <div className="mb-5">
            <h2 style={{ fontSize: isMobile ? 18 : 22 }}>Booking History</h2>
          </div>
          <div
            className="flex justify-content-between align-items-center"
            style={{
              border: "1px solid #D5D5D54D",
              borderRadius: "10px",
              padding: isMobile ? "8px 10px" : "5px 15px",
              alignContent: "center",
              marginBottom: "20px",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              gap: isMobile ? 6 : 0,
            }}
          >
            <div style={{ lineHeight: "1.5", fontSize: isMobile ? 14 : 16 }}>
              <span className="font-bold mb-6">
                {bookingDetails.vendorName || "N/A"}
              </span>
              <br />
              <span>
                {bookingDetails.dateTime
                  ? new Date(bookingDetails.dateTime).toLocaleString()
                  : "N/A"}
              </span>
            </div>
            <div
              style={{
                backgroundColor: "#5570F11A",
                padding: isMobile ? "4px 10px" : "5px 10px",
                borderRadius: "5px",
                display: "inline-block",
                fontSize: isMobile ? 13 : 15,
                marginTop: isMobile ? 4 : 0,
                whiteSpace: "nowrap",
                minWidth: 60,
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0 }}>
                {bookingDetails.bookingStatus || "N/A"}
              </p>
            </div>
          </div>
        </div>
        <div
          className="bg-white"
          style={{
            width: isMobile ? "100%" : "55%",
            padding: isMobile ? "14px 10px" : "20px",
            borderRadius: "10px",
            marginLeft: isMobile ? 0 : "20px",
            marginTop: isMobile ? 0 : "20px",
            boxSizing: "border-box",
          }}
        >
          <h1 className="mb-5" style={{ fontSize: isMobile ? 18 : 22 }}>
            Report an Issue
          </h1>
          <form>
            <textarea
              type="text"
              placeholder="Issue Description"
              style={{
                width: "100%",
                height: isMobile ? "100px" : "150px",
                borderRadius: "10px",
                border: "1px solid lightgrey",
                padding: "10px",
                outline: "1px solid lightgrey",
                fontSize: isMobile ? 14 : 16,
              }}
            />
            <br />
            <button
              style={{
                backgroundColor: "#EF4444",
                color: "white",
                width: isMobile ? "100%" : "150px",
                height: "35px",
                borderRadius: "8px",
                border: "1px solid #EF4444",
                marginTop: "10px",
                fontSize: isMobile ? 15 : 16,
                transition:
                  "background 0.18s, transform 0.18s, box-shadow 0.18s",
                boxShadow: "0 2px 8px rgba(239,68,68,0.10)",
                cursor: "pointer",
                outline: "none",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#f87171";
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(239,68,68,0.18)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#EF4444";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(239,68,68,0.10)";
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = "2px solid #026bb3";
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = "none";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1.04)";
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      <Dialog
        visible={showModificationHistory}
        onHide={() => setShowModificationHistory(false)}
        header={null}
        style={{ width: "500px", borderRadius: "16px" }}
        contentStyle={{ padding: "24px" }}
        footer={null}
      >
        <div>
          <div className="flex justify-content-end">
            <button
              className="p-0 bg-transparent border-0"
              onClick={() => setShowModificationHistory(false)}
              style={{ cursor: "pointer", fontSize: "20px" }}
            ></button>
          </div>

          <div className="mb-3">
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "600",
                margin: "0",
                color: "#212121",
              }}
            >
              {bookingDetails.vendorName || "N/A"}
            </h2>
            <p style={{ color: "#6B7280", margin: "4px 0 0 0" }}>
              Booking #{bookingDetails.bookingId || bookingDetails._id || "N/A"}
            </p>
          </div>

          <div className="flex justify-content-end">
            <span
              style={{
                backgroundColor: "#EBF5FF",
                color: "#3B82F6",
                padding: "4px 16px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Modification In {bookingDetails.bookingStatus || "N/A"}
            </span>
          </div>

          <div
            style={{
              height: "1px",
              backgroundColor: "#E5E7EB",
              margin: "18px 0",
            }}
          ></div>

          <div className="flex align-items-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "#6B7280", marginRight: "8px" }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                margin: "0",
                color: "#111827",
              }}
            >
              Modification History
            </h3>
          </div>

          <div
            style={{
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  marginBottom: "4px",
                  fontWeight: "500",
                }}
              >
                Requested:
              </div>
              <div style={{ color: "#111827", fontWeight: "500" }}>
                {bookingDetails.dateTime
                  ? new Date(bookingDetails.dateTime).toLocaleString()
                  : "N/A"}
              </div>
              <div style={{ color: "#111827", fontWeight: "500" }}></div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  marginBottom: "4px",
                  fontWeight: "500",
                }}
              >
                Status:
              </div>
              <span
                style={{
                  backgroundColor: "#DCFCE7",
                  color: "#16A34A",
                  padding: "4px 12px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Sent
              </span>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  marginBottom: "4px",
                  fontWeight: "500",
                }}
              >
                Vendor Seen:
              </div>
              <div
                className="flex align-items-center"
                style={{ color: "#16A34A" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: "4px" }}
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Yes (at 16:10 PM)</span>
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  marginBottom: "4px",
                  fontWeight: "500",
                }}
              >
                Response:
              </div>
              <span
                style={{
                  backgroundColor: "#FEF9C3",
                  color: "#854D0E",
                  padding: "4px 12px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Pending
              </span>
            </div>
          </div>

          <div
            style={{
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  marginBottom: "4px",
                  fontWeight: "500",
                }}
              >
                Requested:
              </div>
              <div style={{ color: "#111827", fontWeight: "500" }}>
                April 14, 2025, 16:05 PM (PKT)
              </div>
              <div style={{ color: "#111827", fontWeight: "500" }}>
                Change delivery time to 11:00 AM
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  marginBottom: "4px",
                  fontWeight: "500",
                }}
              >
                Status:
              </div>
              <div className="flex align-items-center">
                <span
                  style={{
                    backgroundColor: "#DCFCE7",
                    color: "#16A34A",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginRight: "8px",
                  }}
                >
                  Vendor Accepted
                </span>
                <span style={{ fontSize: "14px", color: "#6B7280" }}>
                  Accepted at 16:15PM
                </span>
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  marginBottom: "4px",
                  fontWeight: "500",
                }}
              >
                Vendor Seen:
              </div>
              <div
                className="flex align-items-center"
                style={{ color: "#16A34A" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: "4px" }}
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Yes (at 16:10 PM)</span>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default BookingDetails;

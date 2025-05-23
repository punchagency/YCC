import { LineWeight } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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

const BookingDetails = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get booking details from location state or initialize empty object
  const [bookingDetails, setBookingDetails] = useState(
    location.state?.bookingDetails || {}
  );

  const [showModificationHistory, setShowModificationHistory] = useState(false);

  // If no booking details in state, fetch them using the ID
  useEffect(() => {
    if (!location.state?.bookingDetails && bookingId) {
      // You would implement a function to fetch booking by ID
      fetchBookingById(bookingId);
    }
  }, [bookingId, location.state]);

  // Function to fetch booking by ID (implement this with your API)
  const fetchBookingById = async (id) => {
    console.log("Fetching booking details for ID:", id);
    try {
      // Call your API service to get booking details
      // const response = await getBookingById(id);
      // if (response.success) {
      //   setBookingDetails(response.data);
      // }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  // Function to navigate to modify service page
  const handleNavigateToModifyService = () => {
    navigate(`/crew/booking/modify/${bookingId}`, {
      state: { bookingDetails },
    });
  };

  // Simple function to go back
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="mb-6 ml-5 mt-5 flex align-items-center">
        <img
          src={vector}
          alt="vector"
          width="10px"
          height="10px"
          objectFit="contain"
          onClick={handleGoBack}
          style={{ cursor: "pointer" }}
        />
        <h2 className="ml-2">Booking Detail</h2>
      </div>

      <div>
        <div className="flex justify-content-around">
          <div
            className="bg-white pt-4 pb-4 pl-5 pr-5"
            style={{ width: "55%", borderRadius: "10px" }}
          >
            <div className="mb-5">
              <h2>
                Booking{" "}
                {bookingDetails.bookingId || bookingDetails._id || "N/A"}
              </h2>
              <p>Payment Status: {bookingDetails.paymentStatus || "N/A"}</p>
            </div>
            <div className="flex justify-content-between mb-5">
              <div>
                <h3>Service Details</h3>
                <div className="flex align-items-center mb-3">
                  <img
                    src={cleaning}
                    alt="cleaning"
                    width="15px"
                    height="15px"
                    className="mr-2"
                  />
                  <p>
                    {(bookingDetails.services &&
                      bookingDetails.services[0]?.service?.name) ||
                      "N/A"}
                  </p>
                </div>

                <div className="flex align-items-center mb-3">
                  <img
                    src={calendar}
                    alt="calendar"
                    width="15px"
                    height="15px"
                    className="mr-2"
                  />
                  <p>
                    {bookingDetails.dateTime
                      ? new Date(bookingDetails.dateTime).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div className="flex align-items-center mb-3">
                  <img
                    src={location}
                    alt="location"
                    width="15px"
                    height="15px"
                    className="mr-2"
                  />
                  <p>
                    {bookingDetails.serviceLocation ||
                      bookingDetails.vendorLocation ||
                      "N/A"}
                  </p>
                </div>
                <div className="flex align-items-center mb-3">
                  <img
                    src={dollar}
                    alt="dollar"
                    width="10px"
                    height="15px"
                    className="mr-2"
                  />
                  <p>
                    $
                    {(bookingDetails.services &&
                      bookingDetails.services[0]?.service?.price) ||
                      "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <h3>Vendor Information</h3>
                <p>{bookingDetails.vendorName || "N/A"}</p>
                <p>{bookingDetails.vendorDescription || "Service Provider"}</p>
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
            <div>
              <div className="mb-4">
                <h2>Modify Meeting</h2>
              </div>
              <div className="flex">
                <button
                  className=""
                  style={{
                    backgroundColor: "#D5D5D54D",
                    border: "1px solid #D5D5D54D",
                    borderRadius: "4px",
                    width: "150px",
                    height: "35px",
                    marginRight: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={calendar}
                    alt="calendar"
                    width="15px"
                    height="15px"
                    className="mr-2"
                  />
                  Reschedule
                </button>
                <button
                  className=""
                  style={{
                    backgroundColor: "#D5D5D54D",
                    border: "1px solid #D5D5D54D",
                    borderRadius: "4px",
                    width: "150px",
                    height: "35px",
                    marginRight: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={handleNavigateToModifyService}
                >
                  <img
                    src={editLogo}
                    alt="editLogo"
                    width="15px"
                    height="15px"
                    className="mr-2"
                  />
                  Modify Service
                </button>
                <button
                  className=""
                  style={{
                    backgroundColor: "#D5D5D54D",
                    border: "1px solid #D5D5D54D",
                    borderRadius: "4px",
                    width: "150px",
                    height: "35px",
                    marginRight: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowModificationHistory(true)}
                >
                  <img
                    src={editLogo}
                    alt="editLogo"
                    width="15px"
                    height="15px"
                    className="mr-2"
                  />
                  Modify History
                </button>
                <button
                  className=""
                  style={{
                    backgroundColor: "#EF444433",
                    border: "1px solid #EF444433",
                    borderRadius: "4px",
                    width: "150px",
                    height: "35px",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <div
            className="bg-white"
            style={{
              width: "40%",
              padding: "20px",
              borderRadius: "10px",
              height: "350px",
            }}
          >
            <div className="mb-5">
              <h2>Booking History</h2>
            </div>
            <div
              className="flex justify-content-between align-items-center"
              style={{
                border: "1px solid #D5D5D54D",
                borderRadius: "10px",
                padding: "5px 15px",
                alignContent: "center",
                marginBottom: "20px",
              }}
            >
              <div style={{ lineHeight: "1.5" }}>
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
                  padding: "5px 10px",
                  borderRadius: "5px",
                }}
              >
                <p>{bookingDetails.bookingStatus || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-white"
          style={{
            width: "55%",
            padding: "20px",
            borderRadius: "10px",
            marginLeft: "20px",
            marginTop: "20px",
          }}
        >
          <h1 className="mb-5">Report an Issue</h1>
          <form>
            <textarea
              type="text"
              placeholder="Issue Description"
              style={{
                width: "100%",
                height: "150px",
                borderRadius: "10px",
                border: "1px solid lightgrey",
                padding: "10px",
                outline: "1px solid lightgrey",
              }}
            />
            <br />
            <button
              style={{
                backgroundColor: "#EF4444",
                color: "white",
                width: "150px",
                height: "35px",
                borderRadius: "8px",
                border: "1px solid #EF4444",
                marginTop: "10px",
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
              Booking #
              {bookingDetails.bookingId || bookingDetails._id || "N/A"}
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
              Modification In{" "}
              {bookingDetails.bookingStatus || "N/A"}
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
              <div style={{ color: "#111827", fontWeight: "500" }}>
                
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
    </>
  );
};

export default BookingDetails;

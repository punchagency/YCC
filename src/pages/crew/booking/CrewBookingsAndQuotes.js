import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../../context/theme/themeContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getBookings } from "../../../services/crew/crewBookingService";
import { useToast } from "../../../components/Toast";
import { useNavigate, useOutletContext } from "react-router-dom";
import BookingTable from "./table";
import QuotesTable from "../../quote-related-pages/customers/QuotesTable";

const CrewBookingsAndQuotes = () => {
  const [view, setView] = useState("bookings");
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isLargeDesktop = useMediaQuery("(min-width: 1400px)");
  const { showError } = useToast();
  const navigate = useNavigate();
  const outletContext = useOutletContext();

  // State for bookings data (same as BookingTable)
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch bookings (same logic as BookingTable)
  const fetchBookings = useCallback(async () => {
    try {
      const response = await getBookings({ page, limit });
      console.log("Fetched bookings:", response);

      if (response.status) {
        setBookings(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalItems || 0);
      } else {
        setError(response.error || "Failed to fetch bookings");
        showError(response.error || "Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Error in fetching bookings:", err);
      setError("An unexpected error occurred");
      showError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [showError, page, limit]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (outletContext && outletContext.setPageTitle) {
      outletContext.setPageTitle("Bookings");
    }
  }, [outletContext]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-blue-100 text-blue-800";
      case "Confirmed":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle card click - navigate to booking details (same as eye icon on desktop)
  const handleCardClick = useCallback(
    (booking) => {
      console.log(
        "Viewing details for booking:",
        booking.bookingId || booking._id
      );

      // Navigate to details page with state containing booking information
      navigate(`/crew/booking/details/${booking.bookingId || booking._id}`, {
        state: { bookingDetails: booking },
      });
    },
    [navigate]
  );

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: theme === "light" ? "#F3F4F6" : "#181A20",
        ...(isMobile
          ? {
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden", // Prevent body/html scroll on mobile
            }
          : {}),
      }}
    >
      {/* Fixed filter buttons on mobile */}
      <div
        style={{
          position: isMobile ? "sticky" : "static",
          top: isMobile ? 0 : undefined,
          zIndex: 10,
          background: isMobile
            ? theme === "light"
              ? "#fff"
              : "#181A20"
            : "transparent", // transparent on desktop/tablet
          display: "flex",
          justifyContent: "center",
          gap: 16,
          padding: isMobile ? "12px 0 8px 0" : "32px 0 28px 0",
          borderBottom: isMobile ? "1px solid #eee" : undefined,
          minHeight: isMobile ? 60 : undefined,
        }}
      >
        <button
          style={{
            padding: "14px 36px",
            borderRadius: 18,
            border:
              view === "bookings"
                ? `2.5px solid ${theme === "light" ? "#0387d9" : "#90caf9"}`
                : "1.5px solid #e5e7eb",
            background:
              view === "bookings"
                ? theme === "light"
                  ? "#0387d9"
                  : "#23262F"
                : "#fff",
            color:
              view === "bookings"
                ? "#fff"
                : theme === "light"
                ? "#0387d9"
                : "#90caf9",
            fontWeight: 700,
            fontSize: 18,
            cursor: view === "bookings" ? "default" : "pointer",
            boxShadow:
              view === "bookings" ? "0 2px 8px rgba(3,135,217,0.10)" : "none",
            transition:
              "background 0.18s, color 0.18s, border 0.18s, box-shadow 0.18s, transform 0.18s",
            outline: "none",
          }}
          onMouseOver={(e) => {
            if (view !== "bookings") {
              e.currentTarget.style.background = "#e6f3fb";
              e.currentTarget.style.transform = "scale(1.04)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(3,135,217,0.12)";
            }
          }}
          onMouseOut={(e) => {
            if (view !== "bookings") {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = `2px solid ${
              theme === "light" ? "#0387d9" : "#90caf9"
            }`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
          }}
          onClick={() => setView("bookings")}
          disabled={view === "bookings"}
        >
          Bookings
        </button>
        <button
          style={{
            padding: "14px 36px",
            borderRadius: 18,
            border:
              view === "quotes"
                ? `2.5px solid ${theme === "light" ? "#0387d9" : "#90caf9"}`
                : "1.5px solid #e5e7eb",
            background:
              view === "quotes"
                ? theme === "light"
                  ? "#0387d9"
                  : "#23262F"
                : "#fff",
            color:
              view === "quotes"
                ? "#fff"
                : theme === "light"
                ? "#0387d9"
                : "#90caf9",
            fontWeight: 700,
            fontSize: 18,
            cursor: view === "quotes" ? "default" : "pointer",
            boxShadow:
              view === "quotes" ? "0 2px 8px rgba(3,135,217,0.10)" : "none",
            transition:
              "background 0.18s, color 0.18s, border 0.18s, box-shadow 0.18s, transform 0.18s",
            outline: "none",
          }}
          onMouseOver={(e) => {
            if (view !== "quotes") {
              e.currentTarget.style.background = "#e6f3fb";
              e.currentTarget.style.transform = "scale(1.04)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(3,135,217,0.12)";
            }
          }}
          onMouseOut={(e) => {
            if (view !== "quotes") {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = `2px solid ${
              theme === "light" ? "#0387d9" : "#90caf9"
            }`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
          }}
          onClick={() => setView("quotes")}
          disabled={view === "quotes"}
        >
          Quotes
        </button>
      </div>

      {/* Bookings/Quotes content */}
      <div
        style={{
          width: isLargeDesktop ? "100%" : "100%",
          maxWidth: isLargeDesktop ? "1400px" : "100%",
          ...(isMobile
            ? {
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                paddingTop: 116, // 56px title bar + 60px filter bar
                paddingBottom: 16, // ensure last card is visible
              }
            : {
                display: "flex",
                flexDirection: "column",
              }),
          justifyContent: "flex-start",
          alignItems: "center",
          boxSizing: "border-box",
          padding: isMobile ? "0 8px" : isLargeDesktop ? "0" : "0 10px",
        }}
      >
        {view === "bookings" ? (
          isMobile ? (
            // Mobile: render bookings as cards using the same data as table
            loading ? (
              <div
                style={{ textAlign: "center", color: "#888", marginTop: 32 }}
              >
                Loading...
              </div>
            ) : error ? (
              <div
                style={{ textAlign: "center", color: "#888", marginTop: 32 }}
              >
                Error: {error}
              </div>
            ) : Array.isArray(bookings) && bookings.length > 0 ? (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {bookings.map((booking, idx) => (
                  <div
                    key={booking._id || idx}
                    style={{
                      background: theme === "light" ? "#fff" : "#23262F",
                      borderRadius: 10,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      padding: 16,
                      marginBottom: 0,
                      marginTop: idx === 0 ? 12 : 0, // 12px gap above first card only
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    onClick={() => handleCardClick(booking)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0,0,0,0.06)";
                    }}
                  >
                    <div
                      style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}
                    >
                      Booking ID: {booking.bookingId || booking._id}
                    </div>
                    <div>
                      <b>Service Type:</b>{" "}
                      {booking.serviceType || booking.service_type || "-"}
                    </div>
                    <div>
                      <b>Vendor Name:</b>{" "}
                      {booking.vendorName || booking.vendor_name || "-"}
                    </div>
                    <div>
                      <b>Location:</b>{" "}
                      {booking.location ||
                        booking.vesselLocation ||
                        booking.serviceLocation ||
                        "-"}
                    </div>
                    <div>
                      <b>Date & Time:</b>{" "}
                      {booking.dateTime || booking.date_time || "-"}
                    </div>
                    <div>
                      <b>Status:</b>{" "}
                      {booking.bookingStatus || booking.status || "-"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{ textAlign: "center", color: "#888", marginTop: 32 }}
              >
                No bookings found
              </div>
            )
          ) : (
            // Desktop/tablet: render as table (unchanged)
            <div
              style={{
                width: "100%",
                maxWidth: isLargeDesktop ? "1400px" : "100%",
                overflowX: "auto",
              }}
            >
              <table style={{ width: "100%", minWidth: 600 }}>
                <BookingTable />
              </table>
            </div>
          )
        ) : (
          // Quotes view (keep as is)
          <QuotesTable />
        )}
      </div>
    </div>
  );
};

export default CrewBookingsAndQuotes;

import React, { useState, useEffect } from "react";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getBookings } from "../../../services/crew/crewBookingService";
import jsPDF from "jspdf";
import "jspdf-autotable";

import {
  FiEye,
  FiDownload,
  FiEdit,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";

const BookingTable = () => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch bookings when component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookings();
        console.log("Fetched bookings:", response);

        if (response.status) {
          setBookings(response.data.data || []);
        } else {
          setError(response.error || "Failed to fetch bookings");
        }
      } catch (err) {
        console.error("Error in fetching bookings:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === "asc" ? (
        <FaSortAmountUp className="ml-1" />
      ) : (
        <FaSortAmountDown className="ml-1" />
      );
    }
    return <FaSortAmountUp className="ml-1 opacity-30" />;
  };

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

  const handleViewDetails = (bookingId) => {
    console.log("Viewing details for booking:", bookingId);

    // Find the booking object by ID
    const bookingDetails = bookings.find(
      (booking) => booking.bookingId === bookingId || booking._id === bookingId
    );

    if (bookingDetails) {
      console.log("Found booking details:", bookingDetails);

      // Navigate to details page with state containing booking information
      navigate(`/crew/booking/details/${bookingId}`, {
        state: { bookingDetails },
      });
    } else {
      console.error("Booking not found with ID:", bookingId);
    }
  };

  // Function to handle downloading booking details as PDF
  const handleDownloadPDF = (booking) => {
    console.log(
      "Downloading PDF for booking:",
      booking.bookingId || booking._id
    );

    try {
      // Create a new PDF document
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(20);
      doc.text("Booking Details", 14, 22);

      // Add booking ID and date
      doc.setFontSize(12);
      doc.text(
        `Booking ID: ${booking.bookingId || booking._id || "N/A"}`,
        14,
        32
      );
      doc.text(
        `Date: ${
          booking.dateTime ? new Date(booking.dateTime).toLocaleString() : "N/A"
        }`,
        14,
        38
      );

      // Add vendor information
      doc.setFontSize(16);
      doc.text("Vendor Information", 14, 48);
      doc.setFontSize(12);
      doc.text(`Vendor: ${booking.vendorName || "N/A"}`, 14, 54);

      // Add service details
      doc.setFontSize(16);
      doc.text("Service Details", 14, 64);
      doc.setFontSize(12);

      const serviceName =
        booking.services &&
        booking.services.length > 0 &&
        booking.services[0].service
          ? booking.services[0].service.name
          : "N/A";

      const servicePrice =
        booking.services &&
        booking.services.length > 0 &&
        booking.services[0].service
          ? `$${booking.services[0].service.price}`
          : "N/A";

      doc.text(`Service: ${serviceName}`, 14, 70);
      doc.text(
        `Location: ${
          booking.serviceLocation || booking.vendorLocation || "N/A"
        }`,
        14,
        76
      );
      doc.text(`Price: ${servicePrice}`, 14, 82);
      doc.text(`Status: ${booking.status || "Pending"}`, 14, 88);

      // Add service description if available
      if (
        booking.services &&
        booking.services.length > 0 &&
        booking.services[0].service &&
        booking.services[0].service.description
      ) {
        doc.setFontSize(16);
        doc.text("Service Description", 14, 98);
        doc.setFontSize(12);
        doc.text(booking.services[0].service.description, 14, 104);
      }

      // Generate filename with booking ID
      const filename = `booking-${
        booking.bookingId || booking._id || "details"
      }.pdf`;

      // Save the PDF
      doc.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white p-4 m-4 flex justify-center items-center h-64">
        <p>Loading bookings...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white p-4 m-4 w-full">
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          <p>Error: {error}</p>
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 mt-2 ml-4 mr-4 mb-2 w-full">
        {/* Booking Table */}
        <div className="pl-2 pr-2 pt-6 pb-2 rounded-xl shadow-sm mt-1 bg-white" style={{borderRadius:"10px"}}>
          {bookings.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No bookings found.
            </div>
          ) : (
            <div
              className="overflow-x-hidden"
              style={{
                width: "100%",
                tableLayout: "fixed",
                borderCollapse: "collapse",
              }}
            >
              <table style={{ width: "100%" }}>
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      style={{
                        width: "12%",
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                      onClick={() => handleSort("bookingId")}
                    >
                      <div className="flex items-center">
                        Booking ID {getSortIcon("bookingId")}
                      </div>
                    </th>
                    <th
                      style={{
                        width: "15%",
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                      onClick={() => handleSort("serviceType")}
                    >
                      <div className="flex items-center">
                        Service Type {getSortIcon("serviceType")}
                      </div>
                    </th>
                    <th
                      style={{
                        width: "20%",
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                      onClick={() => handleSort("vendorName")}
                    >
                      <div className="flex items-center">
                        Vendor Name {getSortIcon("vendorName")}
                      </div>
                    </th>
                    <th
                      style={{
                        width: "15%",
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                      onClick={() => handleSort("location")}
                    >
                      <div className="flex items-center">
                        Location {getSortIcon("location")}
                      </div>
                    </th>
                    <th
                      style={{
                        width: "15%",
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                      onClick={() => handleSort("dateTime")}
                    >
                      <div className="flex items-center">
                        Date & Time {getSortIcon("dateTime")}
                      </div>
                    </th>
                    <th
                      style={{
                        width: "10%",
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status {getSortIcon("status")}
                      </div>
                    </th>
                    <th
                      style={{
                        width: "10%",
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Actions {getSortIcon("status")}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {item.bookingId || "N/A"}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {item.services &&
                        item.services.length > 0 &&
                        item.services[0].service
                          ? item.services[0].service.name || "N/A"
                          : "N/A"}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {item.vendorName || "N/A"}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {item.serviceLocation || item.vendorLocation || "N/A"}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {item.dateTime
                          ? new Date(item.dateTime).toLocaleString()
                          : "N/A"}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                            item.status || ""
                          )}`}
                        >
                          {item.status || "Pending"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <div className="flex justify-end space-x-4">
                          <div
                            style={{
                              border: "1px solid lightgrey",
                              padding: "5px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleViewDetails(item.bookingId || item._id)
                            }
                          >
                            <FiEye size={18} />
                          </div>
                          <div
                            style={{
                              border: "1px solid lightgrey",
                              padding: "5px",
                            }}
                          >
                            <FiEdit size={18} />
                          </div>
                          <div
                            style={{
                              border: "1px solid lightgrey",
                              padding: "5px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleDownloadPDF(item)}
                          >
                            <FiDownload
                              size={18}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div
            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-1 sm:px-6 mt-4"
            style={{ height: "50px" }}
          >
            {/* Mobile view pagination */}
            <div className="flex flex-1 justify-between sm:hidden">
              <div>
                <p className="text-xs text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">10</span> of{" "}
                  <span className="font-medium">200</span> results
                </p>
              </div>
              <div className="flex">
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <FiChevronLeft size={15} />
                </a>
                <a
                  href="#"
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <FiChevronRight size={15} />
                </a>
              </div>
            </div>

            {/* Desktop view pagination */}
            <div className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-600 bg-white border rounded-md shadow-sm">
              {/* Left: Items per page and count */}
              <div className="flex items-center ">
                {/* Items per page dropdown */}
                <div className="">
                  <span className="text-gray-500 p-3">10</span>
                  <FiChevronDown className="text-xs" />
                </div>
                <span className="text-gray-500">Items Per Page</span>
                <span className="text-gray-500">1–10 Of 200 Items</span>
              </div>

              {/* Right: Page navigation */}
              <div className="flex items-center gap-2">
                {/* Page number dropdown */}
                <div className="">
                  <span>1</span>
                  <FiChevronDown className="text-xs" />
                </div>
                <span className="text-gray-500">Of 44 Pages</span>

                {/* Arrows */}
                <button className="text-gray-400 hover:text-gray-600">
                  <FiChevronLeft />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingTable;

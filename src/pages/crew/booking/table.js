import React, { useState } from "react";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // Sample booking data
  const bookingItems = [
    {
      bookingId: "BKG-2023-001",
      serviceType: "Maintenance",
      vendorName: "Marine Services Inc.",
      location: "Port A, Dock 3",
      dateTime: "01/15/2025 10:00 AM",
      status: "Confirmed",
    },
    {
      bookingId: "BKG-2023-002",
      serviceType: "Cleaning",
      vendorName: "CleanSeas Co.",
      location: "Port B, Dock 7",
      dateTime: "01/17/2025 2:30 PM",
      status: "Pending",
    },
    {
      bookingId: "BKG-2023-003",
      serviceType: "Repair",
      vendorName: "FixIt Marine",
      location: "Port A, Dock 5",
      dateTime: "01/18/2025 9:15 AM",
      status: "Completed",
    },
    {
      bookingId: "BKG-2023-004",
      serviceType: "Inspection",
      vendorName: "SafeSeas Inspectors",
      location: "Port C, Dock 2",
      dateTime: "01/20/2025 11:45 AM",
      status: "Confirmed",
    },
    {
      bookingId: "BKG-2023-005",
      serviceType: "Refueling",
      vendorName: "Marine Fuels Ltd.",
      location: "Port B, Dock 1",
      dateTime: "01/21/2025 8:00 AM",
      status: "Pending",
    },
    {
      bookingId: "BKG-2023-006",
      serviceType: "Maintenance",
      vendorName: "Marine Services Inc.",
      location: "Port A, Dock 6",
      dateTime: "01/22/2025 3:15 PM",
      status: "Cancelled",
    },
  ];

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
    navigate(`/crew/booking/details/${bookingId}`);
  };

  return (
    <>
      <div className="bg-white p-4 m-4">
        {/* Booking Table */}
        <div className="p-2 bg-white rounded-xl shadow-sm mt-5">
          <div
            className="overflow-x-hidden"
            style={{
              width: "100%",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
          >
            <table>
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
                      width: "13%",
                      textAlign: "right",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookingItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {item.bookingId}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {item.serviceType}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {item.vendorName}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {item.location}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {item.dateTime}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
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
                          onClick={() => handleViewDetails(item.bookingId)}
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
                          }}
                        >
                          <FiDownload size={18} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

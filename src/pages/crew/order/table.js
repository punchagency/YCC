import React, { useState } from "react";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

import {
  FiEye,
  FiDownload,
  FiEdit,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";

const OrderTable = () => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Sample order data
  const orderItems = [
    {
      orderId: "ORD-2023-001",
      vendorName: "Aqua Pure Inc.",
      datePlaced: "01/15/2025",
      estDelivery: "01/20/2025",
      status: "Processing",
    },
    {
      orderId: "ORD-2023-002",
      vendorName: "Farm Fresh Supplies",
      datePlaced: "01/12/2025",
      estDelivery: "01/18/2025",
      status: "Shipped",
    },
    {
      orderId: "ORD-2023-003",
      vendorName: "CleanCo",
      datePlaced: "01/10/2025",
      estDelivery: "01/17/2025",
      status: "Delivered",
    },
    {
      orderId: "ORD-2023-004",
      vendorName: "Marine Parts Ltd.",
      datePlaced: "01/08/2025",
      estDelivery: "01/15/2025",
      status: "Processing",
    },
    {
      orderId: "ORD-2023-005",
      vendorName: "SafeSeas Equipment",
      datePlaced: "01/05/2025",
      estDelivery: "01/12/2025",
      status: "Delivered",
    },
    {
      orderId: "ORD-2023-006",
      vendorName: "MedSupply Co.",
      datePlaced: "01/03/2025",
      estDelivery: "01/10/2025",
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
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-yellow-100 text-yellow-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="bg-white p-4 m-4">
        {/* Order Table */}
        <div className="p-2 bg-white rounded-xl shadow-sm mt-5">
          <div className="overflow-x-auto">
            <table
              style={{
                width: "100%",
                tableLayout: "fixed",
                borderCollapse: "collapse",
              }}
            >
              <thead className="bg-gray-50">
                <tr>
                  <th
                    style={{
                      width: "15%",
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                    onClick={() => handleSort("orderId")}
                  >
                    <div className="flex items-center">
                      Order ID {getSortIcon("orderId")}
                    </div>
                  </th>
                  <th
                    style={{
                      width: "25%",
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
                    onClick={() => handleSort("datePlaced")}
                  >
                    <div className="flex items-center">
                      Date Placed {getSortIcon("datePlaced")}
                    </div>
                  </th>
                  <th
                    style={{
                      width: "15%",
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                    onClick={() => handleSort("estDelivery")}
                  >
                    <div className="flex items-center">
                      Est. Delivery {getSortIcon("estDelivery")}
                    </div>
                  </th>
                  <th
                    style={{
                      width: "15%",
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
                      width: "15%",
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
                {orderItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {item.orderId}
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
                      {item.datePlaced}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {item.estDelivery}
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
                          }}
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

export default OrderTable;

import React, { useState } from "react";
import {
  FaSortAmountDown,
  FaSortAmountUp,
  FaChevronDown,
} from "react-icons/fa";
import sort from "../../../assets/images/crew/sort.png";
import eyesIn from "../../../assets/images/crew/eyes-in.png";
import editLogo from "../../../assets/images/crew/editLogo.png";
import deleteLogo from "../../../assets/images/crew/deleteLogo.png";
import "../inventory/inventory.css"; // Reuse the inventory CSS
import { Dialog } from "primereact/dialog";

const Table = () => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Sample invoice data matching the screenshot
  const invoices = [
    {
      id: "INV-001",
      vendor: "John Doe",
      date: "01/03/2025",
      amount: 12000.0,
      status: "In Progress",
      details: {
        invoiceNo: "INV-001",
        serviceName: "Yacht Maintenance",
        serviceFee: 11500,
        taxRate: 5,
        taxAmount: 575,
        discount: 75,
        total: 12000,
        bookingDate: "01/03/2025",
        paymentMethod: "Credit Card",
        cardEnding: "4321",
        paymentStatus: "In Progress",
      },
    },
    {
      id: "INV-002",
      vendor: "Jane Smith",
      date: "01/04/2025",
      amount: 8500.0,
      status: "Completed",
      details: {
        invoiceNo: "INV-002",
        serviceName: "Crew Training",
        serviceFee: 8000,
        taxRate: 5,
        taxAmount: 400,
        discount: 0,
        total: 8500,
        bookingDate: "01/04/2025",
        paymentMethod: "Bank Transfer",
        cardEnding: "N/A",
        paymentStatus: "Completed",
      },
    },
    {
      id: "INV-003",
      vendor: "Alice Johnson",
      date: "01/05/2025",
      amount: 15200.0,
      status: "Pending",
      details: {
        invoiceNo: "INV-003",
        serviceName: "Engine Repair",
        serviceFee: 14500,
        taxRate: 5,
        taxAmount: 725,
        discount: 25,
        total: 15200,
        bookingDate: "01/05/2025",
        paymentMethod: "Visa",
        cardEnding: "7890",
        paymentStatus: "Pending",
      },
    },
    {
      id: "INV-004",
      vendor: "Bob Brown",
      date: "01/06/2025",
      amount: 9750.0,
      status: "In Progress",
      details: {
        invoiceNo: "INV-004",
        serviceName: "Interior Design",
        serviceFee: 9500,
        taxRate: 5,
        taxAmount: 475,
        discount: 225,
        total: 9750,
        bookingDate: "01/06/2025",
        paymentMethod: "Mastercard",
        cardEnding: "5678",
        paymentStatus: "In Progress",
      },
    },
    {
      id: "INV-005",
      vendor: "Carol White",
      date: "01/07/2025",
      amount: 22300.0,
      status: "Completed",
      details: {
        invoiceNo: "INV-005",
        serviceName: "Hull Painting",
        serviceFee: 21000,
        taxRate: 5,
        taxAmount: 1050,
        discount: 0,
        total: 22300,
        bookingDate: "01/07/2025",
        paymentMethod: "American Express",
        cardEnding: "9012",
        paymentStatus: "Completed",
      },
    },
    {
      id: "INV-006",
      vendor: "David Green",
      date: "01/08/2025",
      amount: 5600.0,
      status: "Pending",
      details: {
        invoiceNo: "INV-006",
        serviceName: "Safety Inspection",
        serviceFee: 5500,
        taxRate: 5,
        taxAmount: 275,
        discount: 175,
        total: 5600,
        bookingDate: "01/08/2025",
        paymentMethod: "Visa",
        cardEnding: "3456",
        paymentStatus: "Pending",
      },
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
      case "In Progress":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    if (checked) {
      // Select all items
      const allItemIds = invoices.map((item) => item.id);
      setSelectedItems(allItemIds);
    } else {
      // Deselect all
      setSelectedItems([]);
    }
  };

  // Handle individual item selection
  const handleSelectItem = (e, itemId) => {
    const checked = e.target.checked;

    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));

      // If we're unchecking an item, also uncheck the "select all" checkbox
      if (selectAll) {
        setSelectAll(false);
      }
    }
  };

  // Handle bulk delete function
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    // Implement delete functionality here
    console.log("Deleting items:", selectedItems);
  };

  // View item handler
  const handleViewItem = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  // Function to close the modal
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedInvoice(null);
  };

  // Edit handler
  const handleEdit = (index) => {
    console.log("Editing item:", invoices[index]);
    // Implement edit functionality
  };

  // Delete handler
  const handleDelete = (index) => {
    console.log("Deleting item:", invoices[index]);
    // Implement delete functionality
  };

  return (
    <>
      <div className="p-6 bg-white rounded-xl shadow-sm mx-5 my-5">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment & Invoice Tracker
        </h1>
        <p className="text-gray-600 mb-6">
          Monitor outstanding invoices, track completed payments, and manage
          upcoming expenses. Use filters and sorting options for easy navigation
          and quick access to financial details.
        </p>

        <div className="overflow-hidden">
          <table
            className="inventory-header-table"
            style={{
              width: "100%",
              tableLayout: "fixed",
              borderCollapse: "collapse",
              marginBottom: "0",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    width: "5%",
                    textAlign: "center",
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      style={{
                        margin: 0,
                        width: "17px",
                        height: "17px",
                      }}
                    />
                    {selectedItems.length > 0 && (
                      <i
                        className="pi pi-trash"
                        style={{
                          cursor: "pointer",
                          color: "#ff4d4f",
                          marginLeft: "8px",
                        }}
                        onClick={handleBulkDelete}
                      ></i>
                    )}
                  </div>
                </th>
                <th
                  style={{
                    width: "15%",
                    textAlign: "left",
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={sort}
                      alt="sort"
                      style={{
                        width: "15px",
                        height: "15px",
                        marginRight: "5px",
                      }}
                    />
                    <p style={{ margin: 0, flex: 1, fontSize: "12px" }}>
                      Inv. No.
                    </p>
                  </div>
                </th>
                <th
                  style={{
                    width: "20%",
                    textAlign: "left",
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={sort}
                      alt="sort"
                      style={{
                        width: "15px",
                        height: "15px",
                        marginRight: "5px",
                      }}
                    />
                    <p style={{ margin: 0, flex: 1, fontSize: "12px" }}>
                      Vendor
                    </p>
                  </div>
                </th>
                <th
                  style={{
                    width: "15%",
                    textAlign: "left",
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={sort}
                      alt="sort"
                      style={{
                        width: "15px",
                        height: "15px",
                        marginRight: "5px",
                      }}
                    />
                    <p style={{ margin: 0, flex: 1, fontSize: "12px" }}>Date</p>
                  </div>
                </th>
                <th
                  style={{
                    width: "15%",
                    textAlign: "left",
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={sort}
                      alt="sort"
                      style={{
                        width: "15px",
                        height: "15px",
                        marginRight: "5px",
                      }}
                    />
                    <p style={{ margin: 0, flex: 1, fontSize: "12px" }}>
                      Amount
                    </p>
                  </div>
                </th>
                <th
                  style={{
                    width: "15%",
                    textAlign: "left",
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={sort}
                      alt="sort"
                      style={{
                        width: "15px",
                        height: "15px",
                        marginRight: "5px",
                      }}
                    />
                    <p style={{ margin: 0, flex: 1, fontSize: "12px" }}>
                      Status
                    </p>
                  </div>
                </th>
                <th
                  style={{
                    width: "15%",
                    textAlign: "left",
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        flex: 1,
                        fontSize: "12px",
                        textAlign: "center",
                      }}
                    >
                      Actions
                    </p>
                  </div>
                </th>
              </tr>
            </thead>
          </table>

          <table
            className="inventory-table"
            style={{
              width: "100%",
              tableLayout: "fixed",
              borderCollapse: "collapse",
              marginTop: "0",
            }}
          >
            <tbody>
              {invoices.map((invoice, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td
                    style={{
                      width: "5%",
                      padding: "10px",
                      textAlign: "center",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(invoice.id)}
                      onChange={(e) => handleSelectItem(e, invoice.id)}
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </td>
                  <td
                    style={{
                      width: "15%",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {invoice.id}
                  </td>
                  <td
                    style={{
                      width: "20%",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {invoice.vendor}
                  </td>
                  <td
                    style={{
                      width: "15%",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {invoice.date}
                  </td>
                  <td
                    style={{
                      width: "15%",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    $
                    {invoice.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    style={{
                      width: "15%",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        invoice.status
                      )}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td
                    style={{
                      width: "15%",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={eyesIn}
                        alt="view"
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleViewItem(invoice)}
                      />
                      <img
                        src={editLogo}
                        alt="edit"
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleEdit(index)}
                      />
                      <img
                        src={deleteLogo}
                        alt="delete"
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDelete(index)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination footer */}
          <div
            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4"
            style={{ height: "50px" }}
          >
          <div>
          </div>
            <div className="flex flex-1 justify-between sm:hidden">
              <div className="text-xs text-gray-700">
                Page <span className="font-medium">1</span> of{" "}
                <span className="font-medium">10</span>
              </div>
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{invoices.length}</span> of{" "}
                  <span className="font-medium">{invoices.length}</span> results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    <span className="sr-only">Previous</span>
                    <FaChevronDown className="h-3 w-3 rotate-90" />
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 bg-blue-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    <span className="sr-only">Next</span>
                    <FaChevronDown className="h-3 w-3 -rotate-90" />
                  </button>
                </nav>
              </div>
            </div>
            
          </div>

          
        </div>

        {/* Invoice Details Modal */}
        <Dialog
          visible={showDetailsModal}
          onHide={closeDetailsModal}
          header="Payment & Invoice Tracker Details"
          modal
          style={{ width: "500px" }}
          contentStyle={{ padding: 0 }}
          headerStyle={{ borderBottom: "1px solid #e5e7eb", padding: "1rem" }}
          footer={null}
        >
          {selectedInvoice && (
            <div className="invoice-details">
              {/* Invoice Number */}
              <div
                className="detail-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "1rem",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div
                  className="label"
                  style={{ fontWeight: 500, color: "#4b5563" }}
                >
                  Invoice No.
                </div>
                <div className="value" style={{ color: "#111827" }}>
                  {selectedInvoice.details?.invoiceNo || selectedInvoice.id}
                </div>
              </div>

              {/* Service Name */}
              <div
                className="detail-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "1rem",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div
                  className="label"
                  style={{ fontWeight: 500, color: "#4b5563" }}
                >
                  Service Name
                </div>
                <div className="value" style={{ color: "#111827" }}>
                  {selectedInvoice.details?.serviceName ||
                    "Service details not available"}
                </div>
              </div>

              {/* Amount Breakdown Section */}
              <div
                className="amount-breakdown"
                style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb" }}
              >
                <div
                  className="section-title"
                  style={{ fontWeight: 600, marginBottom: "0.75rem" }}
                >
                  Amount Breakdown
                </div>

                {/* Service Fee */}
                <div
                  className="breakdown-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div className="label">1. Service Fee</div>
                  <div className="value">
                    $
                    {selectedInvoice.details?.serviceFee ||
                      selectedInvoice.amount}
                  </div>
                </div>

                {/* Tax */}
                <div
                  className="breakdown-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div className="label">
                    2. Tax ({selectedInvoice.details?.taxRate || 5}%)
                  </div>
                  <div className="value">
                    ${selectedInvoice.details?.taxAmount || 0}
                  </div>
                </div>

                {/* Discount */}
                <div
                  className="breakdown-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div className="label">3. Discount Applied</div>
                  <div className="value" style={{ color: "#ef4444" }}>
                    -${selectedInvoice.details?.discount || 0}
                  </div>
                </div>

                {/* Total */}
                <div
                  className="breakdown-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 600,
                  }}
                >
                  <div className="label">4. Total</div>
                  <div className="value">${selectedInvoice.amount}</div>
                </div>
              </div>

              {/* Linked Booking Date */}
              <div
                className="detail-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "1rem",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div
                  className="label"
                  style={{ fontWeight: 500, color: "#4b5563" }}
                >
                  Linked Booking Date
                </div>
                <div className="value" style={{ color: "#111827" }}>
                  {selectedInvoice.details?.bookingDate || selectedInvoice.date}
                </div>
              </div>

              {/* Payment Method */}
              <div
                className="detail-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "1rem",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div
                  className="label"
                  style={{ fontWeight: 500, color: "#4b5563" }}
                >
                  Payment Method
                </div>
                <div className="value" style={{ color: "#111827" }}>
                  {selectedInvoice.details?.paymentMethod
                    ? `${selectedInvoice.details.paymentMethod}${
                        selectedInvoice.details.cardEnding !== "N/A"
                          ? ` - Ending ${selectedInvoice.details.cardEnding}`
                          : ""
                      }`
                    : "Payment method not specified"}
                </div>
              </div>

              {/* Payment Status */}
              <div
                className="detail-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "1rem",
                }}
              >
                <div
                  className="label"
                  style={{ fontWeight: 500, color: "#4b5563" }}
                >
                  Payment Status
                </div>
                <div className="value">
                  <span
                    style={{
                      backgroundColor:
                        selectedInvoice.status === "Completed"
                          ? "#e0f2fe"
                          : selectedInvoice.status === "In Progress"
                          ? "#dcfce7"
                          : "#fef9c3",
                      color:
                        selectedInvoice.status === "Completed"
                          ? "#0369a1"
                          : selectedInvoice.status === "In Progress"
                          ? "#166534"
                          : "#854d0e",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </>
  );
};

export default Table;

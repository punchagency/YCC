import React, { useState } from "react";
import Stock from "./stock";
import green from "../../../assets/images/crew/green.png"
import danger from "../../../assets/images/crew/danger.png"
import {
  FaChevronDown,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { FiEye, FiDownload, FiEdit } from "react-icons/fi";
import sort from "../../../assets/images/crew/sort.png";
import eyesIn from "../../../assets/images/crew/eyes-in.png";
import editLogo from "../../../assets/images/crew/editLogo.png";
import deleteLogo from "../../../assets/images/crew/deleteLogo.png";
import "./inventory.css";

const Inventory = () => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Sample inventory data
  const inventoryItems = [
    {
      id: "1",
      name: "Bottled Water",
      category: "Beverages",
      vendor: "Aqua Pure Inc.",
      quantity: 120,
      lastUpdated: "01/15/2025",
      status: "In Stock",
    },
    {
      id: "2",
      name: "Fresh Produce",
      category: "Food",
      vendor: "Farm Fresh Supplies",
      quantity: 45,
      lastUpdated: "01/12/2025",
      status: "Low Stock",
    },
    {
      id: "3",
      name: "Cleaning Supplies",
      category: "Maintenance",
      vendor: "CleanCo",
      quantity: 78,
      lastUpdated: "01/10/2025",
      status: "In Stock",
    },
    {
      id: "4",
      name: "Engine Oil",
      category: "Mechanical",
      vendor: "Marine Parts Ltd.",
      quantity: 12,
      lastUpdated: "01/08/2025",
      status: "Low Stock",
    },
    {
      id: "5",
      name: "Life Jackets",
      category: "Safety",
      vendor: "SafeSeas Equipment",
      quantity: 25,
      lastUpdated: "01/05/2025",
      status: "In Stock",
    },
    {
      id: "6",
      name: "First Aid Kit",
      category: "Medical",
      vendor: "MedSupply Co.",
      quantity: 8,
      lastUpdated: "01/03/2025",
      status: "Critical",
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

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    if (checked) {
      // Select all items
      const allItemIds = inventoryItems.map((item) => item.id);
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
  const handleViewItem = (item) => {
    console.log("Viewing item:", item);
    // Implement view functionality
  };

  // Edit handler
  const handleEdit = (index) => {
    console.log("Editing item:", inventoryItems[index]);
    // Implement edit functionality
  };

  // Delete handler
  const handleDelete = (index) => {
    console.log("Deleting item:", inventoryItems[index]);
    // Implement delete functionality
  };

  return (
    <>
      <div className="flex justify-content-between">
        <div className="bg-white p-4 m-4" style={{ width: "90%" }}>
          <Stock />

          {/* Inventory Table */}
          <div className="p-2 bg-white rounded-xl shadow-sm mt-5">
            <div className="overflow-x-auto">
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
                          Item Name
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
                          Category
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
                          Vendors
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
                          Quantity
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
                        width: "10%",
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
                  {inventoryItems.map((item, index) => (
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
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => handleSelectItem(e, item.id)}
                          style={{
                            width: "16px",
                            height: "16px",
                          }}
                        />
                      </td>
                      <td
                        style={{
                          width: "20%",
                          padding: "10px",
                          borderBottom: "1px solid #eee",
                          fontSize: "9px",
                        }}
                      >
                        {item.name}
                      </td>
                      <td
                        style={{
                          width: "15%",
                          padding: "10px",
                          borderBottom: "1px solid #eee",
                          fontSize: "9px",
                        }}
                      >
                        {item.category}
                      </td>
                      <td
                        style={{
                          width: "20%",
                          padding: "10px",
                          borderBottom: "1px solid #eee",
                          fontSize: "9px",
                        }}
                      >
                        {item.vendor}
                      </td>
                      <td
                        style={{
                          width: "15%",
                          padding: "10px",
                          borderBottom: "1px solid #eee",
                          fontSize: "9px",
                        }}
                      >
                        {item.quantity} units
                      </td>
                      <td
                        style={{
                          width: "15%",
                          padding: "10px",
                          borderBottom: "1px solid #eee",
                          fontSize: "9px",
                        }}
                      >
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === "In Stock"
                              ? "bg-green-100 text-green-800"
                              : item.status === "Low Stock"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td
                        style={{
                          width: "10%",
                          padding: "10px",
                          borderBottom: "1px solid #eee",
                          fontSize: "9px",
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
                            onClick={() => handleViewItem(item)}
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
                      <span className="font-medium">10</span> of{" "}
                      <span className="font-medium">
                        {inventoryItems.length}
                      </span>{" "}
                      results
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
          </div>
        </div>
        <div></div>
        <div style={{ width: "30%" }}>
          <div
            className="bg-white p-4 m-4"
            style={{ height: "200px", borderRadius: "10px", width: "90%" }}
          >
            <div>
              <h2>Low Stock Alerts</h2>
              <div
                className="flex justify-content-between"
                style={{
                  backgroundColor: "#FF30211A",
                  padding: "10px",
                  marginBottom: "10px",
                  marginTop: "20px",
                  borderRadius: "5px",
                }}
              >
                <p>Safety Gloves (5 remaining)</p>
                <p>Reorder</p>
              </div>
              <div
                className="flex justify-content-between"
                style={{
                  backgroundColor: "#FBBC051A",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <p>First Aid Kits (5 remaining)</p>
                <p>Reorder</p>
              </div>
            </div>
          </div>
          <div
            className="bg-white p-4 m-4"
            style={{ height: "200px", borderRadius: "10px", width: "90%" }}
          >
            <div>
              <h2>Recent Activity</h2>
              <div
                className="flex justify-content-between"
                style={{
                  marginTop: "20px",
                  marginBottom: "10px",
                }}
              >
                <div className="flex items-center">
                  <img
                    src={green}
                    alt="green"
                    width="20px"
                    height="20px"
                    className="mr-1"
                  />
                  <p>Added 20 safety helmets</p>
                </div>

                <p style={{ fontSize: "13px", width: "100px" }}>2 hrs ago</p>
              </div>
              <div className="flex justify-content-between">
                <div className="flex items-center">
                  <img
                    src={danger}
                    alt="danger"
                    width="20px"
                    height="20px"
                    className="mr-1"
                  />
                  <p>Used 5 First Aid Kits</p>
                </div>
                <p style={{ fontSize: "13px", width: "100px" }}>2 hrs ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inventory;

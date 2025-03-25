import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
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

const Invent = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [viewItem, setViewItem] = useState({
    id: null,
    productName: "",
    category: "",
    serviceArea: "",
    stockQuantity: "",
    price: "",
  });

  // Sample inventory data
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      productName: "Diesel Fuel",
      category: "Fuel",
      serviceArea: "Caribean",
      stockQuantity: 500,
      price: 150.0,
    },
    {
      id: 2,
      productName: "First Aid Kit Pro",
      category: "Medical",
      serviceArea: "All Areas",
      stockQuantity: 15,
      price: 275.5,
    },
    {
      id: 3,
      productName: "Engine Oil Filter",
      category: "Engine Parts",
      serviceArea: "Engine Room",
      stockQuantity: 45,
      price: 89.99,
    },
    {
      id: 4,
      productName: "Navigation Compass",
      category: "Navigation",
      serviceArea: "Bridge",
      stockQuantity: 8,
      price: 450.0,
    },
    {
      id: 5,
      productName: "Life Jacket Type III",
      category: "Safety Equipment",
      serviceArea: "Deck",
      stockQuantity: 50,
      price: 125.0,
    },
    {
      id: 6,
      productName: "Hydraulic Fluid",
      category: "Maintenance",
      serviceArea: "Engine Room",
      stockQuantity: 30,
      price: 65.75,
    },
    {
      id: 7,
      productName: "LED Floodlight",
      category: "Electrical",
      serviceArea: "Exterior",
      stockQuantity: 12,
      price: 189.99,
    },
    // Add more items as needed
  ]);

  const [editItem, setEditItem] = useState({
    id: null,
    productName: "",
    category: "",
    serviceArea: "",
    stockQuantity: "",
    price: "",
  });

  const [newItem, setNewItem] = useState({
    productName: "",
    category: "",
    serviceArea: "",
    stockQuantity: "",
    price: "",
  });

  const goCrewDashboardPage = () => {
    navigate("/crew/dashboard");
  };
  const goInventorySummaryPage = () => {
    navigate("/crew/inventory/summary");
  };

  const handleEdit = (index) => {
    const item = inventoryItems[index];
    setEditItem({
      id: index,
      productName: item.productName,
      category: item.category,
      serviceArea: item.serviceArea,
      stockQuantity: item.stockQuantity.toString(),
      price: item.price.toFixed(2),
    });
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    const updatedItems = [...inventoryItems];
    updatedItems[editItem.id] = {
      ...updatedItems[editItem.id],
      productName: editItem.productName,
      category: editItem.category,
      serviceArea: editItem.serviceArea,
      stockQuantity: parseInt(editItem.stockQuantity),
      price: parseFloat(editItem.price),
    };

    setInventoryItems(updatedItems);
    setShowEditModal(false);
  };

  const handleDelete = (index) => {
    setItemToDelete(index);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    const updatedItems = inventoryItems.filter(
      (_, index) => index !== itemToDelete
    );
    setInventoryItems(updatedItems);
    setShowDeleteConfirmation(false);
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleSaveProduct = () => {
    // Create a new product with the form data
    const product = {
      id: inventoryItems.length + 1,
      productName: newItem.productName,
      category: newItem.category,
      serviceArea: newItem.serviceArea,
      stockQuantity: parseInt(newItem.stockQuantity),
      price: parseFloat(newItem.price),
    };

    // Add the new product to the inventory
    setInventoryItems([...inventoryItems, product]);

    // Reset the form and close the modal
    setNewItem({
      productName: "",
      category: "",
      serviceArea: "",
      stockQuantity: "",
      price: "",
    });
    setShowAddModal(false);
  };

  const handleView = (index) => {
    const item = inventoryItems[index];
    setViewItem({
      id: index,
      productName: item.productName,
      category: item.category,
      serviceArea: item.serviceArea,
      stockQuantity: item.stockQuantity.toString(),
      price: item.price.toFixed(2),
    });
    setShowViewModal(true);
  };

  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3>Inventory</h3>
          </div>
        </div>
      </div>

      <div className="inventory-container">
        <div className="inventory-summary">
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
                      Product Name
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
                      Service Area
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
                      Stock Quantity
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
                      Price
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
                      Manage
                    </p>
                  </div>
                </th>
                <th
                  style={{
                    width: "5%",
                    textAlign: "center",
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <input
                    type="checkbox"
                    style={{
                      margin: 0,
                      width: "14px",
                      height: "14px",
                    }}
                  />
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
                <tr key={index}>
                  <td
                    style={{
                      width: "20%",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {item.productName}
                  </td>
                  <td
                    style={{
                      width: "15%",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {item.category}
                  </td>
                  <td
                    style={{
                      width: "15%",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {item.serviceArea}
                  </td>
                  <td
                    style={{
                      width: "15%",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {item.stockQuantity} units
                  </td>
                  <td
                    style={{
                      width: "15%",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    ${item.price.toFixed(2)}
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
                        onClick={() => handleView(index)}
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
                      style={{
                        width: "12px",
                        height: "12px",
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <button
              style={{
                backgroundColor: "#0387D9",
                color: "#fff",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
              onClick={handleAddProduct}
            >
              <img
                src={plus}
                alt="add"
                style={{ width: "15px", height: "15px" }}
              />{" "}
              Add New Product
            </button>
          </div>
        </div>
      </div>

      <Dialog
        visible={showEditModal}
        onHide={() => setShowEditModal(false)}
        header="Edit Inventory Item"
        className="edit-inventory-modal"
        modal
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        style={{ width: "35vw" }}
        maskStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div className="edit-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="productName">Product Name</label>
              <InputText
                id="productName"
                value={editItem.productName}
                onChange={(e) =>
                  setEditItem({ ...editItem, productName: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <InputText
                id="category"
                value={editItem.category}
                onChange={(e) =>
                  setEditItem({ ...editItem, category: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="serviceArea">Service Area</label>
              <InputText
                id="serviceArea"
                value={editItem.serviceArea}
                onChange={(e) =>
                  setEditItem({ ...editItem, serviceArea: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="stockQuantity">Stock Quantity</label>
              <InputText
                id="stockQuantity"
                type="number"
                value={editItem.stockQuantity}
                onChange={(e) =>
                  setEditItem({ ...editItem, stockQuantity: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <InputText
                id="price"
                type="number"
                step="0.01"
                value={editItem.price}
                onChange={(e) =>
                  setEditItem({ ...editItem, price: e.target.value })
                }
              />
            </div>
          </div>

          <div className="button-row">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setShowEditModal(false)}
              className="p-button-text"
              style={{
                backgroundColor: "#EF4444",
                color: "#fff",
                width: "200px",
              }}
            />
            <Button
              label="Update"
              icon="pi pi-check"
              onClick={handleUpdate}
              autoFocus
              style={{
                backgroundColor: "#0387D9",
                color: "#fff",
                width: "200px",
              }}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={showAddModal}
        onHide={() => setShowAddModal(false)}
        header="Add New Product"
        className="add-inventory-modal"
        modal
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        style={{ width: "35vw" }}
        contentStyle={{ overflow: "visible" }}
        maskStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div className="add-form" style={{ overflow: "hidden" }}>
          <div className="form-row">
            <div
              className="form-group"
              style={{ display: "block", marginBottom: "15px" }}
            >
              <label htmlFor="productName">Product Name</label>
              <InputText
                id="productName"
                value={newItem.productName}
                onChange={(e) =>
                  setNewItem({ ...newItem, productName: e.target.value })
                }
                style={{ width: "100%" }}
              />
            </div>
            <div
              className="form-group"
              style={{ display: "block", marginBottom: "15px" }}
            >
              <label htmlFor="category">Category</label>
              <InputText
                id="category"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div className="form-row">
            <div
              className="form-group"
              style={{ display: "block", marginBottom: "15px" }}
            >
              <label htmlFor="serviceArea">Service Area</label>
              <InputText
                id="serviceArea"
                value={newItem.serviceArea}
                onChange={(e) =>
                  setNewItem({ ...newItem, serviceArea: e.target.value })
                }
                style={{ width: "100%" }}
              />
            </div>
            <div
              className="form-group"
              style={{ display: "block", marginBottom: "15px" }}
            >
              <label htmlFor="stockQuantity">Stock Quantity</label>
              <InputText
                id="stockQuantity"
                type="number"
                value={newItem.stockQuantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, stockQuantity: e.target.value })
                }
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div className="form-row">
            <div
              className="form-group"
              style={{ display: "block", marginBottom: "15px" }}
            >
              <label htmlFor="price">Price</label>
              <InputText
                id="price"
                type="number"
                step="0.01"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div
            className="button-row"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setShowAddModal(false)}
              className="p-button-text"
              style={{
                backgroundColor: "#EF4444",
                color: "#fff",
                width: "200px",
              }}
            />
            <Button
              label="Save Product"
              icon="pi pi-check"
              onClick={handleSaveProduct}
              autoFocus
              style={{
                backgroundColor: "#0387D9",
                color: "#fff",
                width: "200px",
              }}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        header="Confirm Deletion"
        modal
        maskStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(4px)",
        }}
        footer={
          <div>
            <Button
              label="No"
              icon="pi pi-times"
              onClick={() => setShowDeleteConfirmation(false)}
              className="p-button-text"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              onClick={confirmDelete}
              autoFocus
              className="p-button-danger"
            />
          </div>
        }
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle"
            style={{ fontSize: "2rem", color: "#ff9800", marginRight: "10px" }}
          ></i>
          <span>Are you sure you want to delete this product?</span>
        </div>
      </Dialog>

      <Dialog
        visible={showViewModal}
        onHide={() => setShowViewModal(false)}
        header="Invent Summary"
        className="view-inventory-modal"
        modal
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        style={{ width: "30vw" }}
        maskStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(4px)",
        }}
      >
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
              }}
            >
              <label htmlFor="productName">Product Name</label>
              <div className="view-field">{viewItem.productName}</div>
            </div>
            <div
              className="form-group"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <label htmlFor="category">Category</label>
              <div className="view-field">{viewItem.category}</div>
            </div>
          </div>

          <div className="form-row">
            <div
              className="form-group"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <label htmlFor="serviceArea">Service Area</label>
              <div className="view-field">{viewItem.serviceArea}</div>
            </div>
            <div
              className="form-group"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <label htmlFor="stockQuantity">Stock Quantity</label>
              <div className="view-field">{viewItem.stockQuantity}</div>
            </div>
          </div>

          <div className="form-row">
            <div
              className="form-group"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <label htmlFor="price">Price</label>
              <div className="view-field">${viewItem.price}</div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Invent;

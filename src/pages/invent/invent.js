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

const Invent = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

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
                    <div style={{ display: "flex", gap: "10px" }}>
                      <img
                        src={editLogo}
                        alt="edit"
                        onClick={() => handleEdit(index)}
                        style={{
                          cursor: "pointer",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                      <img
                        src={deleteLogo}
                        alt="delete"
                        style={{
                          cursor: "pointer",
                          width: "18px",
                          height: "18px",
                        }}
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
        </div>
      </div>

      <Dialog
        visible={showEditModal}
        onHide={() => setShowEditModal(false)}
        header="Edit Inventory Item"
        className="edit-inventory-modal"
        modal
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        style={{ width: "50vw" }}
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
            />
            <Button
              label="Update"
              icon="pi pi-check"
              onClick={handleUpdate}
              autoFocus
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Invent;

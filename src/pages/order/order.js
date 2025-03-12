import React from "react";

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
import lockLogo from "../../assets/images/crew/lockLogo.png";
import dropdown from "../../assets/images/crew/dropdown.png";
import cart from "../../assets/images/crew/cart.png";
import iconcontainer from "../../assets/images/crew/iconContainer.png";
import neworder from "../../assets/images/crew/neworder.png";
import buttonorder from "../../assets/images/crew/buttonorder.png";
const Order = () => {
  const navigate = useNavigate();
  const goCrewDashboardPage = () => {
    navigate("/crew/dashboard");
  };
  const goInventorySummaryPage = () => {
    navigate("/crew/inventory/summary");
  };
  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3>Orders</h3>
          </div>
        </div>
      </div>

      <div>
        <div>
          <h4 style={{ textAlign: "left", paddingLeft: "10px" }}>
            Order Summary
          </h4>
        </div>
        <div className="box-order-container">
          <div className="box1-order">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 9px",
              }}
            >
              <div>
                <img src={lockLogo} alt="lockLogo" />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ marginRight: "5px" }}>This week</p>
                <img
                  src={dropdown}
                  alt="dropdown"
                  style={{ width: "15px", height: "15px" }}
                />
              </div>
            </div>
            <div className="pending-order-container">
              <div>
                <p>All Orders</p>
                <p>0</p>
              </div>
              <div>
                <p>Pending</p>
                <p>0</p>
              </div>
              <div>
                <p>Completed</p>
                <p>0</p>
              </div>
            </div>
          </div>
          <div className="box1-order">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 9px",
              }}
            >
              <div>
                <img src={lockLogo} alt="lockLogo" />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ marginRight: "5px" }}>This week</p>
                <img
                  src={dropdown}
                  alt="dropdown"
                  style={{ width: "15px", height: "15px" }}
                />
              </div>
            </div>
            <div className="pending-order-container">
              <div>
                <p>Canceled</p>
                <p>0</p>
              </div>
              <div>
                <p>Returned</p>
                <p>0</p>
              </div>
              <div>
                <p>Damaged</p>
                <p>0</p>
              </div>
            </div>
          </div>
          <div className="box1-order">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 9px",
              }}
            >
              <div>
                <img src={cart} alt="cart" />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ marginRight: "5px" }}>This week</p>
                <img
                  src={dropdown}
                  alt="dropdown"
                  style={{ width: "15px", height: "15px" }}
                />
              </div>
            </div>
            <div className="pending-order-container">
              <div>
                <p style={{ color: "#EF4444" }}>Abandoned Cart</p>
                <p>0</p>
              </div>
              <div>
                <p>Customers</p>
                <p>0</p>
              </div>
            </div>
          </div>
        </div>
        <div className="no-order-container">
          <div className="no-order-container-wrapper">
            <div>
              <img
                src={iconcontainer}
                alt="iconcontainer"
                className="icon-container"
              />
            </div>
            <div>
              <h3>No Orders Yet?</h3>
              <p>Add products to your store and start selling to see orders</p>
              <button>
                <img src={neworder} alt="neworder" className="neworder-icon"/> <span>Create New Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;

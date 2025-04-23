import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo-login.png";
import homeLogo from "../assets/images/crew/homeLogo.png";
import orderLogo from "../assets/images/crew/order1.png";
import financeLogo from "../assets/images/crew/financeLogo.png";
import complianceLogo from "../assets/images/crew/complianceLogo.png";
import reportLogo from "../assets/images/crew/reportLogo.png";
import settingsLogo from "../assets/images/crew/settingsLogo.png";
import helpLogo from "../assets/images/crew/info.png";
import contactLogo from "../assets/images/crew/shape.png";
import logoutLogo from "../assets/images/crew/logout.png";
import "../styles/mobileSidebar.css"; // Import the sidebar styles

const MobileSidebar = ({ isOpen, onClose, role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };
  
  // Check if the current path matches the menu item path
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          display: isOpen ? "block" : "none",
        }}
      ></div>
      <div
        className={`mobile-sidebar ${isOpen ? "active" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: isOpen ? 0 : "-100%",
          width: "100%",
          maxWidth: "280px",
          height: "100vh",
          backgroundColor: "red",
          zIndex: 1001,
          transition: "left 0.3s ease",
          overflowY: "auto",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="sidebar-header">
          <div className="logo">
            <img src={logo} alt="Company Logo" />
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <ul
          className="sidebar-menu"
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            height: "calc(100vh - 70px)",
            overflowY: "auto",
          }}
        >
          <li className={isActive("/admin/dashboard") ? "active" : ""}>
            <a
              href="#"
              onClick={() => handleNavigation("/admin/dashboard")}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px 20px",
                textDecoration: "none",
                color: isActive("/admin/dashboard") ? "#0387D9" : "#333",
                borderBottom: "1px solid #f5f5f5",
                backgroundColor: isActive("/admin/dashboard")
                  ? "#f0f7ff"
                  : "transparent",
                textAlign: "left",
              }}
            >
              <span className="icon" style={{ marginRight: "15px" }}>
                <img
                  src={homeLogo}
                  alt="Dashboard"
                  style={{ width: "18px", height: "18px" }}
                />
              </span>
              Dashboard
            </a>
          </li>

          <li className={isActive("/admin/calendar") ? "active" : ""}>
            <a
              href="#"
              onClick={() => handleNavigation("/admin/calendar")}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px 20px",
                textDecoration: "none",
                color: isActive("/admin/calendar") ? "#0387D9" : "#333",
                borderBottom: "1px solid #f5f5f5",
                backgroundColor: isActive("/admin/calendar")
                  ? "#f0f7ff"
                  : "transparent",
                textAlign: "left",
              }}
            >
              <span className="icon" style={{ marginRight: "15px" }}>
                <i
                  className="pi pi-calendar"
                  style={{ fontSize: "18px" }}
                ></i>
              </span>
              Calendar
            </a>
          </li>

          <li className={isActive("/admin/inventory") ? "active" : ""}>
            <a
              href="#"
              onClick={() => handleNavigation("/admin/inventory")}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px 20px",
                textDecoration: "none",
                color: isActive("/admin/inventory") ? "#0387D9" : "#333",
                borderBottom: "1px solid #f5f5f5",
                backgroundColor: isActive("/admin/inventory")
                  ? "#f0f7ff"
                  : "transparent",
                textAlign: "left",
              }}
            >
              <span className="icon" style={{ marginRight: "15px" }}>
                <i className="pi pi-file" style={{ fontSize: "18px" }}></i>
              </span>
              Inventory Management
            </a>
          </li>

          <li className={isActive("/admin/orders") ? "active" : ""}>
            <a
              href="#"
              onClick={() => handleNavigation("/admin/orders")}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px 20px",
                textDecoration: "none",
                color: isActive("/admin/orders") ? "#0387D9" : "#333",
                borderBottom: "1px solid #f5f5f5",
                backgroundColor: isActive("/admin/orders")
                  ? "#f0f7ff"
                  : "transparent",
                textAlign: "left",
              }}
            >
              <span className="icon" style={{ marginRight: "15px" }}>
                <img
                  src={orderLogo}
                  alt="Orders"
                  style={{ width: "18px", height: "18px" }}
                />
              </span>
              Orders
            </a>
          </li>

          <li className={isActive("/admin/bookings") ? "active" : ""}>
            <a
              href="#"
              onClick={() => handleNavigation("/admin/bookings")}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px 20px",
                textDecoration: "none",
                color: isActive("/admin/bookings") ? "#0387D9" : "#333",
                borderBottom: "1px solid #f5f5f5",
                backgroundColor: isActive("/admin/bookings")
                  ? "#f0f7ff"
                  : "transparent",
                textAlign: "left",
              }}
            >
              <span className="icon" style={{ marginRight: "15px" }}>
                <img
                  src={orderLogo}
                  alt="Bookings"
                  style={{ width: "18px", height: "18px" }}
                />
              </span>
              Bookings
            </a>
          </li>

          <li className={isActive("/admin/financial-management") ? "active" : ""}>
            <a
              href="#"
              onClick={() => handleNavigation("/admin/financial-management")}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px 20px",
                textDecoration: "none",
                color: isActive("/admin/financial-management") ? "#0387D9" : "#333",
                borderBottom: "1px solid #f5f5f5",
                backgroundColor: isActive("/admin/financial-management")
                  ? "#f0f7ff"
                  : "transparent",
                textAlign: "left",
              }}
            >
              <span className="icon" style={{ marginRight: "15px" }}>
                <img
                  src={financeLogo}
                  alt="Financial"
                  style={{ width: "18px", height: "18px" }}
                />
              </span>
              Financial Management
            </a>
          </li>

          <li className={isActive("/admin/notifications") ? "active" : ""}>
            <a
              href="#"
              onClick={() => handleNavigation("/admin/notifications")}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px 20px",
                textDecoration: "none",
                color: isActive("/admin/notifications") ? "#0387D9" : "#333",
                borderBottom: "1px solid #f5f5f5",
                backgroundColor: isActive("/admin/notifications")
                  ? "#f0f7ff"
                  : "transparent",
                textAlign: "left",
              }}
            >
              <span className="icon" style={{ marginRight: "15px" }}>
                <img
                  src={complianceLogo}
                  alt="Notifications"
                  style={{ width: "18px", height: "18px" }}
                />
              </span>
              Notifications
            </a>
          </li>

          <li className={isActive("/admin/reports") ? "active" : ""}>
            <a
              href="#"
              onClick={() => handleNavigation("/admin/reports")}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px 20px",
                textDecoration: "none",
                color: isActive("/admin/reports") ? "#0387D9" : "#333",
                borderBottom: "1px solid #f5f5f5",
                backgroundColor: isActive("/admin/reports")
                  ? "#f0f7ff"
                  : "transparent",
                textAlign: "left",
              }}
            >
              <span className="icon" style={{ marginRight: "15px" }}>
                <img
                  src={reportLogo}
                  alt="Reports"
                  style={{ width: "18px", height: "18px" }}
                />
              </span>
              Reports
            </a>
          </li>

          <li className={isActive("/admin/settings") ? "active" : ""}>
            <a
              href="#"
              onClick={() => handleNavigation("/admin/settings")}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px 20px",
                textDecoration: "none",
                color: isActive("/admin/settings") ? "#0387D9" : "#333",
                borderBottom: "1px solid #f5f5f5",
                backgroundColor: isActive("/admin/settings")
                  ? "#f0f7ff"
                  : "transparent",
                textAlign: "left",
              }}
            >
              <span className="icon" style={{ marginRight: "15px" }}>
                <img
                  src={settingsLogo}
                  alt="Settings"
                  style={{ width: "18px", height: "18px" }}
                />
              </span>
              Settings
            </a>
          </li>

          <li className={isActive("/help") ? "active" : ""}>
            <a
              href="#"
              onClick={() => handleNavigation("/admin/help")}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px 20px",
                textDecoration: "none",
                color: isActive("/admin/help") ? "#0387D9" : "#333",
                borderBottom: "1px solid #f5f5f5",
                backgroundColor: isActive("/admin/help")
                  ? "#f0f7ff"
                  : "transparent",
                textAlign: "left",
              }}
            >
              <span className="icon" style={{ marginRight: "15px" }}>
                <img
                  src={helpLogo}
                  alt="Help"
                  style={{ width: "18px", height: "18px" }}
                />
              </span>
              Help Centre
            </a>
          </li>

          <li className={isActive("/contact") ? "active" : ""}>
            <a
              href="#"
              onClick={() => handleNavigation("/admin/contact")}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px 20px",
                textDecoration: "none",
                color: isActive("/admin/contact") ? "#0387D9" : "#333",
                borderBottom: "1px solid #f5f5f5",
                backgroundColor: isActive("/admin/contact")
                  ? "#f0f7ff"
                  : "transparent",
                textAlign: "left",
              }}
            >
              <span className="icon" style={{ marginRight: "15px" }}>
                <img
                  src={contactLogo}
                  alt="Contact"
                  style={{ width: "18px", height: "18px" }}
                />
              </span>
              Contact Us
            </a>
          </li>

          <li className="logout">
            <a
              href="#"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px 20px",
                textDecoration: "none",
                color: "#333",
                borderBottom: "1px solid #f5f5f5",
                backgroundColor: "transparent",
                textAlign: "left",
              }}
            >
              <span className="icon" style={{ marginRight: "15px" }}>
                <img
                  src={logoutLogo}
                  alt="Logout"
                  style={{ width: "18px", height: "18px" }}
                />
              </span>
              Log Out
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default MobileSidebar;

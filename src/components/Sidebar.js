import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png"; // Update with your actual logo path

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: "pi pi-home", path: "/dashboard" },
    { name: "Calendar", icon: "pi pi-calendar", path: "/calendar" },
    {
      name: "Inventory Management",
      icon: "pi pi-box",
      path: "/crew/inventory/dashboard",
    },
    { name: "Orders", icon: "pi pi-shopping-cart", path: "/orders" },
    { name: "Bookings", icon: "pi pi-book", path: "/bookings" },
    { name: "Financial Management", icon: "pi pi-dollar", path: "/financial" },
    { name: "Notifications", icon: "pi pi-bell", path: "/notifications" },
    { name: "Reports", icon: "pi pi-chart-bar", path: "/reports" },
    { name: "Settings", icon: "pi pi-cog", path: "/settings" },
    { name: "Help Centre", icon: "pi pi-question-circle", path: "/help" },
    { name: "Contact Us", icon: "pi pi-envelope", path: "/contact" },
  ];

  return (
    <div
      className={`sidebar ${isOpen ? "open" : "closed"}`}
      style={{
        height: "100vh",
        position: "fixed",
        top: 0,
        left: isOpen ? 0 : "-280px",
        width: "280px",
        backgroundColor: "red",
        transition: "left 0.3s ease",
        zIndex: 1000,
        boxShadow: isOpen ? "0 0 10px rgba(0,0,0,0.1)" : "none",
        overflowY: "auto",
      }}
    >
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        <button
          className="close-button"
          onClick={toggleSidebar}
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
      <nav className="sidebar-nav">
        <ul
          className="sidebar-menu"
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={location.pathname === item.path ? "active" : ""}
              style={{
                borderBottom: "1px solid #f5f5f5",
              }}
            >
              <Link
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "15px 20px",
                  textDecoration: "none",
                  color: location.pathname === item.path ? "#0387D9" : "#333",
                  backgroundColor:
                    location.pathname === item.path ? "#f0f7ff" : "transparent",
                }}
              >
                <span className="icon" style={{ marginRight: "15px" }}>
                  <i className={item.icon}></i>
                </span>
                <span className="text">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

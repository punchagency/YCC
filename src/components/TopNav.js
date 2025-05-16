import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { useTheme } from "../context/theme/themeContext";
import logo from "../assets/images/logo-login.png";
import dashboardLogo from "../assets/images/crew/dashboard-icon.png";
import calendarLogo from "../assets/images/crew/calendar-icon.png";
import inventoryLogo from "../assets/images/crew/inventory-icon.png";
import orderLogo from "../assets/images/crew/order-icon.png";
import bookingLogo from "../assets/images/crew/booking-icon.png";
import financeLogo from "../assets/images/crew/financial-icon.png";
import settingsLogo from "../assets/images/crew/settings-icon.png";
import notificationLogo from "../assets/images/crew/notification-icon.png";
import reportLogo from "../assets/images/crew/report-icon.png";
import logoutLogo from "../assets/images/crew/logout.png";
import { useUser } from "../context/userContext";

const TopNav = ({ isOpen, onClose, role = "admin" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { user } = useUser();
  const isCrewMember = user?.role === "crew_member";

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleLogout = () => {
    confirmDialog({
      message: "Are you sure you want to log out?",
      header: "Logout Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Yes",
      rejectLabel: "Cancel",
      accept: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
      reject: () => {
        // Do nothing on cancel
      },
    });
  };

  // Create role-specific menu items
  const crewMenuItems = [
    {
      label: "Dashboard",
      icon: dashboardLogo,
      path: "/crew/dashboard",
    },
    {
      label: "Calendar",
      icon: calendarLogo,
      path: "/crew/calendar",
    },
    {
      label: "Inventory Management",
      icon: inventoryLogo,
      path: "/admin/inventory-management",
    },
    {
      label: "Orders",
      icon: orderLogo,
      path: "/admin/orders-management",
    },
    {
      label: "Bookings",
      icon: bookingLogo,
      path: "/admin/bookings-management",
    },
    {
      label: "Financial Management",
      icon: financeLogo,
      path: "/admin/financial-management",
    },
    {
      label: "Notifications",
      icon: notificationLogo,
      path: "/admin/notifications",
    },
    {
      label: "Reports",
      icon: reportLogo,
      path: "/admin/reports",
    },
    {
      label: "Settings",
      icon: settingsLogo,
      path: "/admin/settings",
    },
    {
      label: "Log Out",
      icon: logoutLogo,
      onClick: handleLogout,
      divider: true,
    },
  ];

  const adminMenuItems = [
    {
      label: "Dashboard",
      icon: dashboardLogo,
      path: "/admin/dashboard",
    },
    {
      label: "Inventory Management",
      icon: inventoryLogo,
      path: "/admin/inventory-management",
    },
    {
      label: "Orders",
      icon: orderLogo,
      path: "/admin/orders-management",
    },
    {
      label: "Bookings",
      icon: bookingLogo,
      path: "/admin/bookings-management",
    },
    {
      label: "Financial Management",
      icon: financeLogo,
      path: "/admin/financial-management",
    },
    {
      label: "Notifications",
      icon: notificationLogo,
      path: "/admin/notifications",
    },
    {
      label: "Reports",
      icon: reportLogo,
      path: "/admin/reports",
    },
    {
      label: "Settings",
      icon: settingsLogo,
      path: "/admin/settings",
    },
    {
      label: "Log Out",
      icon: logoutLogo,
      onClick: handleLogout,
      divider: true,
    },
  ];

  // Choose menu items based on user role
  const menuItems = isCrewMember ? crewMenuItems : adminMenuItems;

  const handleNavigation = (path, onClick) => {
    if (onClick) {
      onClick();
    } else if (path) {
      navigate(path);
    }
    onClose();
  };

  return (
    <div
      className={`top-nav-container ${isOpen ? "open" : ""}`}
      style={{
        position: "fixed",
        top: isOpen ? "0" : "-100%",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: theme === "light" ? "#FFFFFF" : "#03141F",
        zIndex: 1000,
        transition: "top 0.3s ease-in-out",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div className="logo-container">
          <img src={logo} alt="Logo" style={{ height: "40px" }} />
        </div>
        <Button
          icon="pi pi-times"
          className="p-button-rounded p-button-text"
          onClick={onClose}
          style={{
            fontSize: "1.5rem",
            color: theme === "light" ? "#000000" : "#FFFFFF",
          }}
        />
      </div>

      <div className="menu-items" style={{ marginTop: "20px" }}>
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.divider && (
              <div
                style={{
                  height: "1px",
                  backgroundColor: theme === "light" ? "#E4E7EC" : "#1E2A35",
                  margin: "15px 0",
                }}
              ></div>
            )}

            <div
              className={`menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px 10px",
                borderRadius: "8px",
                marginBottom: "10px",
                backgroundColor:
                  location.pathname === item.path
                    ? theme === "light"
                      ? "#F0F5FF"
                      : "#1A2A3A"
                    : "transparent",
                cursor: "pointer",
              }}
              onClick={() => handleNavigation(item.path, item.onClick)}
            >
              <img
                src={item.icon}
                alt={item.label}
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "15px",
                  opacity: location.pathname === item.path ? "1" : "0.7",
                }}
              />
              <span
                style={{
                  color: theme === "light" ? "#103B57" : "#FFFFFF",
                  fontSize: "16px",
                  fontWeight: location.pathname === item.path ? "600" : "400",
                }}
              >
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopNav;

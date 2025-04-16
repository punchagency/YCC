import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PanelMenu } from "primereact/panelmenu";
import { Button } from "primereact/button";
import { useUser } from "../context/userContext";
import logo from "../assets/images/logo-login.png";
// import orderLogo from "../assets/images/crew/order1.png";
// import financeLogo from "../assets/images/crew/financeLogo.png";
// import complianceLogo from "../assets/images/crew/complianceLogo.png";
// import reportLogo from "../assets/images/crew/reportLogo.png";
// import settingsLogo from "../assets/images/crew/settingsLogo.png";
// import homeLogo from "../assets/images/crew/homeLogo.png";
// import helpLogo from "../assets/images/crew/info.png";
// import contactLogo from "../assets/images/crew/shape.png";
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
import { useTheme } from "../context/theme/themeContext";
import { confirmDialog } from "primereact/confirmdialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import "../styles/menu.css";

const LeftMenu = ({ role, isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { theme, changeTheme } = useTheme();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(null);

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
      style: { textAlign: "center" },
      footer: (options) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <Button
            label="Cancel"
            className="p-button-outlined"
            onClick={options.reject}
          />
          <Button
            label="Yes"
            className="p-button-danger"
            onClick={options.accept}
          />
        </div>
      ),
    });
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: <img src={dashboardLogo} alt="Dashboard" width={15} height={15} />,
      className:
        location.pathname === "/admin/dashboard"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => {
        navigate("/admin/dashboard");
      },
      style:{color:"red"}
    },
    {
      label: "Calendar",
      icon: <img src={calendarLogo} alt="Calendar" width={15} height={15} />,
      className:
        location.pathname === "/admin/calendar-management"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => {
        navigate("/admin/calendar-management");
      },
    },
    {
      label: "Inventory Management",
      icon: <img src={inventoryLogo} alt="Inventory" width={15} height={15} />,
      className:
        location.pathname === "/admin/inventory-management"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => {
        navigate("/admin/inventory-management");
      },
    },
    {
      label: "Orders",
      icon: <img src={orderLogo} alt="Orders" width={15} height={15} />,
      className:
        location.pathname === "/admin/orders-management"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => {
        navigate("/admin/orders-management");
      },
    },
    {
      label: "Bookings",
      icon: <img src={bookingLogo} alt="Bookings" width={15} height={15} />,
      className:
        location.pathname === "/admin/bookings-management"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => {
        navigate("/admin/bookings-management");
      },
    },
    {
      label: "Financial Management",
      icon: (
        <img
          src={financeLogo}
          alt="Financial Management"
          width={15}
          height={15}
        />
      ),
      className:
        location.pathname === "/admin/financial-management"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => {
        navigate("/admin/financial-management");
      },
    },
    {
      label: "Notifications",
      icon: (
        <img
          src={notificationLogo}
          alt="Compliance Tracking"
          width={15}
          height={15}
        />
      ),
      className:
        location.pathname === "/admin/notifications"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => {
        navigate("/admin/notifications");
      },
    },
    {
      label: "Reports",
      icon: <img src={reportLogo} alt="Reports" width={15} height={15} />,
      className:
        location.pathname === "/admin/reports"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => {
        navigate("/admin/reports");
      },
    },
    {
      label: "Settings",
      icon: <img src={settingsLogo} alt="Settings" width={15} height={15} />,
      className:
        location.pathname === "/admin/settings"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => {
        navigate("/admin/settings");
      },
    },
    {
      separator: true,
      style: { margin: "15px 0" },
    },
    {
      label: "Log Out",
      icon: <img src={logoutLogo} alt="Log Out" width={15} height={15} />,
      command: handleLogout,
      style: { color: "#FF4B4B" },
    },
  ];

  menuItems.forEach((item) => {
    if (item.label) {
      item.style = {
        ...item.style,
        color: theme === "light" ? "#103B57" : "#FFFFFF",
      };
      item.className = `${item.className || ""} menu-item`;
      
    }
  });

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .p-panelmenu .p-menuitem-text {
        transition: color 0.2s;
      }
      .p-panelmenu .p-panelmenu-header > a:hover .p-menuitem-text,
      .p-panelmenu .p-menuitem-link:hover .p-menuitem-text {
        color: white !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <ConfirmDialog />
      <div
        className={`left-menu ${isCollapsed ? "collapsed" : ""}`}
        style={{
          backgroundColor: theme === "light" ? "#F8FBFF" : "#03141F",
        }}
      >
        <div className="flex justify-content-center align-items-center logo-wraper">
          <div className="logo relative">
            <a href="/admin/dashboard">
              <img src={logo} alt="Company logo" className="image-full" />
            </a>
          </div>
          <Button
            icon="pi pi-times"
            text
            className="p-0 collapse-close-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        </div>
        <div>
          <PanelMenu model={menuItems} />
        </div>
      </div>
    </>
  );
};

export default LeftMenu;

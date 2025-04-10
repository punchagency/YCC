import React, { useState } from "react";
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
        location.pathname === "/admin/dashboard" ? "active-menu-item" : "",
      command: () => {
        navigate("/admin/dashboard");
      },
      onMouseDown: () => {
        document.body.classList.add("menu-item-active");
      },
      onMouseUp: () => {
        document.body.classList.remove("menu-item-active");
      },
    },
    {
      label: "Calendar",
      icon: <img src={calendarLogo} alt="Calendar" width={15} height={15} />,
      className:
        location.pathname === "/admin/calendar-management"
          ? "active-menu-item"
          : "",
      command: () => {
        navigate("/admin/calendar-management");
      },
      onMouseDown: () => {
        document.body.classList.add("menu-item-active");
      },
      onMouseUp: () => {
        document.body.classList.remove("menu-item-active");
      },
    },
    {
      label: "Inventory Management",
      icon: <img src={inventoryLogo} alt="Inventory" width={15} height={15} />,
      className:
        location.pathname === "/admin/inventory-management"
          ? "active-menu-item"
          : "",
      command: () => {
        navigate("/admin/inventory-management");
      },
      onMouseDown: () => {
        document.body.classList.add("menu-item-active");
      },
      onMouseUp: () => {
        document.body.classList.remove("menu-item-active");
      },
    },
    {
      label: "Orders",
      icon: <img src={orderLogo} alt="Orders" width={15} height={15} />,
      className:
        location.pathname === "/admin/orders-management"
          ? "active-menu-item"
          : "",
      command: () => {
        navigate("/admin/orders-management");
      },
      onMouseDown: () => {
        document.body.classList.add("menu-item-active");
      },
      onMouseUp: () => {
        document.body.classList.remove("menu-item-active");
      },
    },
    {
      label: "Bookings",
      icon: <img src={bookingLogo} alt="Bookings" width={15} height={15} />,
      className:
        location.pathname === "/admin/bookings-management"
          ? "active-menu-item"
          : "",
      command: () => {
        navigate("/admin/bookings-management");
      },
      onMouseDown: () => {
        document.body.classList.add("menu-item-active");
      },
      onMouseUp: () => {
        document.body.classList.remove("menu-item-active");
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
      command: () => {
        navigate("/admin/financial-management");
      },
      onMouseDown: () => {
        document.body.classList.add("menu-item-active");
      },
      onMouseUp: () => {
        document.body.classList.remove("menu-item-active");
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
      command: () => {
        navigate("/admin/notifications");
      },
      onMouseDown: () => {
        document.body.classList.add("menu-item-active");
      },
      onMouseUp: () => {
        document.body.classList.remove("menu-item-active");
      },
    },
    {
      label: "Reports",
      icon: <img src={reportLogo} alt="Reports" width={15} height={15} />,
      command: () => {
        navigate("/admin/reports");
      },
      onMouseDown: () => {
        document.body.classList.add("menu-item-active");
      },
      onMouseUp: () => {
        document.body.classList.remove("menu-item-active");
      },
    },
    {
      label: "Settings",
      icon: <img src={settingsLogo} alt="Settings" width={15} height={15} />,
      command: () => {
        navigate("/admin/settings");
      },
      onMouseDown: () => {
        document.body.classList.add("menu-item-active");
      },
      onMouseUp: () => {
        document.body.classList.remove("menu-item-active");
      },
    },
    {
      separator: true,
      style: { margin: "15px 0" },
    },
    // {
    //   label: "Help Centre",
    //   icon: <img src={helpLogo} alt="Help Centre" width={15} height={15} />,
    //   command: () => {
    //     navigate("/crew/help");
    //   },
    // },
    // {
    //   label: "Contact Us",
    //   icon: <img src={contactLogo} alt="Contact Us" width={15} height={15} />,
    //   command: () => {
    //     navigate("/crew/contact");
    //   },
    // },
    {
      label: "Log Out",
      icon: <img src={logoutLogo} alt="Log Out" width={15} height={15} />,
      command: handleLogout,
      style: { color: "#FF4B4B" },
      onMouseDown: () => {
        document.body.classList.add("menu-item-active");
      },
      onMouseUp: () => {
        document.body.classList.remove("menu-item-active");
      },
    },
  ];

  // Create a better active state handler
  const handleActiveStateStart = (e) => {
    // Stop event propagation to prevent PrimeReact from handling it
    e.stopPropagation();
    document.body.classList.add("menu-item-active");
  };

  const handleActiveStateEnd = (e) => {
    // Add a small delay to make the effect visible
    setTimeout(() => {
      document.body.classList.remove("menu-item-active");
    }, 300);
  };

  // Apply these handlers to each menu item
  menuItems.forEach((item) => {
    if (item.label) {
      item.onMouseDown = handleActiveStateStart;
      item.onMouseUp = handleActiveStateEnd;
      item.onMouseLeave = handleActiveStateEnd;

      // Override any PrimeReact built-in handlers
      item.props = {
        ...item.props,
        className: `${item.className || ""} custom-menu-item`,
        onMouseDown: handleActiveStateStart,
        onMouseUp: handleActiveStateEnd,
        onMouseLeave: handleActiveStateEnd,
      };
    }
  });

  menuItems.forEach((item) => {
    if (item.label) {
      item.style = {
        ...item.style,
        color: theme === "light" ? "#103B57" : "#FFFFFF",
      };
      item.className = `${item.className || ""} no-hover-effect`;
    }
  });

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

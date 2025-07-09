import React, { useEffect } from "react";
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
import CustomButton from "./Button";

const LeftMenu = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const location = useLocation();
  const { user } = useUser();

  // Get role name from object or string
  let userRole = user?.role;
  if (typeof userRole === "object" && userRole.name) {
    userRole = userRole.name;
  }

  const isCrewMember = userRole === "crew_member";
  const isSupplier = userRole === "supplier";

  const handleLogout = () => {
    confirmDialog({
      message: "Are you sure you want to log out?",
      header: "Logout Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Yes",
      rejectLabel: "Cancel",
      style: { textAlign: "center" },
      accept: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("user");
        window.location.href = "/login";
      },
      footer: (options) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <Button
            label="Cancel"
            className="p-button-text"
            onClick={options.reject}
            style={{
              width: "100px",
              backgroundColor: "#f3f4f6",
              color: "#000000",
              border: "1px solid #e5e7eb",
            }}
          />
          <Button
            label="Yes"
            className="p-button-danger"
            onClick={options.accept}
            style={{ width: "100px" }}
          />
        </div>
      ),
    });
  };

  const crewMenuItems = [
    {
      label: "Dashboard",
      icon: <img src={dashboardLogo} alt="Dashboard" width={15} height={15} />,
      className:
        location.pathname === "/crew/dashboard"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => navigate("/crew/dashboard"),
    },
    {
      label: "Crew",
      icon: <img src={bookingLogo} alt="Bookings" width={15} height={15} />,
      className:
        location.pathname.startsWith("/crew/") &&
        [
          "/crew/legal-resources",
          "/crew/training",
          "/crew/accomodation",
          "/crew/document-management",
        ].some((path) => location.pathname === path)
          ? "active-menu-item menu-red-background"
          : "",
      items: [
        {
          label: "Legal Resources",
          icon: (
            <img
              src={reportLogo}
              alt="Legal Resources"
              width={15}
              height={15}
            />
          ),
          className:
            location.pathname === "/crew/legal-resources"
              ? "active-menu-item menu-red-background"
              : "",
          command: () => navigate("/crew/legal-resources"),
        },
        {
          label: "Crew Training",
          icon: (
            <img src={calendarLogo} alt="Training" width={15} height={15} />
          ),
          className: location.pathname === "/crew/training",

          command: () => navigate("/crew/training"),
        },
        {
          label: "Accommodation",
          icon: (
            <img
              src={settingsLogo}
              alt="Accommodation"
              width={15}
              height={15}
            />
          ),
          className: location.pathname === "/crew/accommodation",

          command: () => navigate("/crew/accomodation"),
        },
        {
          label: "Document Management",
          icon: (
            <img
              src={notificationLogo}
              alt="Documents"
              width={15}
              height={15}
            />
          ),
          className:
            location.pathname === "/crew/document-management"
              ? "active-menu-item menu-red-background"
              : "",
          command: () => navigate("/crew/document-management"),
        },
      ],
    },
    {
      label: "Calendar",
      icon: <img src={calendarLogo} alt="Calendar" width={15} height={15} />,
      className:
        location.pathname === "/crew/calendar"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => navigate("/crew/calendar"),
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
        location.pathname === "/crew/financial-management"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => navigate("/crew/financial-management"),
    },
    {
      label: "Bookings",
      icon: <img src={bookingLogo} alt="Bookings" width={15} height={15} />,
      className:
        location.pathname === "/crew/booking"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => navigate("/crew/booking"),
    },
    {
      label: "Inventory Management",
      icon: (
        <img
          src={inventoryLogo}
          alt="Inventory Management"
          width={15}
          height={15}
        />
      ),
      className:
        location.pathname === "/crew/inventory-management"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => navigate("/crew/inventory-management"),
    },
    {
      label: "Orders",
      icon: <img src={orderLogo} alt="Orders" width={15} height={15} />,
      className:
        location.pathname === "/crew/orders-management"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => navigate("/crew/orders-management"),
    },
    {
      label: "Notifications",
      icon: (
        <img
          src={notificationLogo}
          alt="Notifications"
          width={15}
          height={15}
        />
      ),
      className:
        location.pathname === "/crew/notifications"
          ? "active-menu-item menu-red-background"
          : "",

      command: () => navigate("/crew/notifications"),
    },

    {
      label: "Reports",
      icon: <img src={reportLogo} alt="Reports" width={15} height={15} />,
      className:
        location.pathname === "/crew/reports"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => navigate("/crew/reports"),
    },
    {
      label: "Settings",
      icon: <img src={settingsLogo} alt="Settings" width={15} height={15} />,
      className:
        location.pathname === "/crew/settings"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => {
        navigate("/crew/settings");
      },
    },
    {
      separator: true,
      style: { margin: "15px 0" },
    },
  ];

  const adminMenuItems = [
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
      style: { color: "red" },
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
  ];

  const supplierMenuItems = [
    {
      label: "Dashboard",
      icon: <img src={dashboardLogo} alt="Dashboard" width={15} height={15} />,
      className:
        location.pathname === "/supplier/dashboard"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => {
        navigate("/supplier/dashboard");
      },
    },
    {
      label: "Inventory Management",
      icon: <img src={inventoryLogo} alt="Inventory" width={15} height={15} />,
      className:
        location.pathname === "/supplier/inventory"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => {
        navigate("/supplier/inventory");
      },
    },
    {
      label: "Settings",
      icon: <img src={settingsLogo} alt="Settings" width={15} height={15} />,
      className:
        location.pathname === "/supplier/settings"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => {
        navigate("/supplier/settings");
      },
    },
    {
      label: "Profile",
      icon: <img src={settingsLogo} alt="Profile" width={15} height={15} />,
      className:
        location.pathname === "/supplier/profile"
          ? "active-menu-item menu-red-background"
          : "",
      command: () => {
        navigate("/supplier/profile");
      },
    },
    {
      separator: true,
      style: { margin: "15px 0" },
    },
  ];

  const menuItems = isCrewMember ? crewMenuItems : isSupplier ? supplierMenuItems : adminMenuItems;

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
    const style = document.createElement("style");
    style.textContent = `
      .p-panelmenu .p-menuitem-text {
        transition: none; /* Remove transition */
        color: #000000 !important; /* Force black text color */
      }
      
      /* Make all menu items white background, including on hover */
      .p-panelmenu .p-panelmenu-header > a,
      .p-panelmenu .p-panelmenu-header > a:hover,
      .p-panelmenu .p-panelmenu-content .p-menuitem .p-menuitem-link,
      .p-panelmenu .p-panelmenu-content .p-menuitem .p-menuitem-link:hover,
      .p-panelmenu .p-menuitem .p-menuitem-link:focus,
      .p-panelmenu-content,
      .p-submenu-list {
        background-color: #FFFFFF !important;
      }
      
      /* Make all text black explicitly */
      .p-panelmenu .p-panelmenu-header > a .p-menuitem-text,
      .p-panelmenu .p-menuitem-link .p-menuitem-text {
        color: #000000 !important;
      }
      
      /* For dark mode compatibility - keep dark mode with black text */
      .dark .p-panelmenu .p-panelmenu-header > a,
      .dark .p-panelmenu .p-panelmenu-header > a:hover,
      .dark .p-panelmenu .p-panelmenu-content .p-menuitem .p-menuitem-link,
      .dark .p-panelmenu .p-panelmenu-content .p-menuitem .p-menuitem-link:hover {
        background-color: #03141F !important;
      }
      
      /* Even in dark mode, keep text black */
      .dark .p-panelmenu .p-panelmenu-header > a .p-menuitem-text,
      .dark .p-panelmenu .p-menuitem-link .p-menuitem-text {
        color: #000000 !important;
      }
      
      /* Remove hover effects for all menu items but keep black text */
      .p-panelmenu .p-menuitem-link:hover .p-menuitem-text,
      .p-panelmenu .p-panelmenu-header > a:hover .p-menuitem-text {
        color: #000000 !important;
        transform: none !important;
        text-decoration: none !important;
      }
      
      /* Fix any icon hover effects */
      .p-panelmenu .p-menuitem-link:hover .p-menuitem-icon,
      .p-panelmenu .p-panelmenu-header > a:hover .p-menuitem-icon,
      .p-panelmenu .p-panelmenu-header > a:hover .p-panelmenu-icon {
        color: inherit !important;
        transform: none !important;
      }
      
      /* Remove any hover borders or outlines */
      .p-panelmenu .p-panelmenu-header > a:focus,
      .p-panelmenu .p-menuitem .p-menuitem-link:focus {
        box-shadow: none !important;
        outline: none !important;
      }
      
      /* Remove background ripple effect */
      .p-ink {
        display: none !important;
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
            <a href={isCrewMember ? "/" : "/"}>
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
        <div className="menu-container">
          <PanelMenu model={menuItems} />
        </div>
        <div className="logout-container">
          <CustomButton
            onClick={handleLogout}
            style={{
              backgroundColor: "#FFE5E5",
              color: "#FF4B4B",
              border: "2px solid #FFB3B3",
              borderRadius: 8,
              fontWeight: 700,
              width: "100%",
              fontSize: 16,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#FFB3B3";
              e.target.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#FFE5E5";
              e.target.style.color = "#FF4B4B";
            }}
          >
            <img src={logoutLogo} alt="Log Out" width={18} height={18} /> Log
            Out
          </CustomButton>
        </div>
      </div>
    </>
  );
};

export default LeftMenu;

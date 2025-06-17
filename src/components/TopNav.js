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
import PeopleIcon from "@mui/icons-material/People";
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
      acceptClassName: "custom-mobile-logout-accept",
      rejectClassName: "custom-mobile-logout-reject",
      acceptLabel: "Yes",
      rejectLabel: "Cancel",
      accept: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
      reject: () => {},
      footer: (options) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 12,
          }}
        >
          <Button
            label="Cancel"
            className="custom-mobile-logout-reject"
            onClick={options.reject}
            style={{
              width: 110,
              backgroundColor: "#f3f4f6",
              color: "#000000",
              border: "1px solid #e5e7eb",
              fontWeight: 600,
              fontSize: 16,
            }}
          />
          <Button
            label="Yes"
            className="custom-mobile-logout-accept"
            onClick={options.accept}
            style={{
              width: 110,
              backgroundColor: "#FF4B4B",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              border: "none",
            }}
          />
        </div>
      ),
    });
  };

  // Move the custom style injection useEffect here
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .custom-mobile-logout-accept {
        background-color: #FF4B4B !important;
        color: #fff !important;
        border: none !important;
        font-weight: 600 !important;
        font-size: 16px !important;
        width: 110px !important;
      }
      .custom-mobile-logout-reject {
        background-color: #f3f4f6 !important;
        color: #000 !important;
        border: 1px solid #e5e7eb !important;
        font-weight: 600 !important;
        font-size: 16px !important;
        width: 110px !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Inject mobile-only style for accommodation icon/text rows when mobile menu is open and on /crew/accomodation
  useEffect(() => {
    const isAccommodation = location.pathname === "/crew/accomodation";
    let style;
    if (isOpen && isAccommodation) {
      style = document.createElement("style");
      style.textContent = `
        @media (max-width: 600px) {
          .flex.align-items-center.mb-3 {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            justify-content: flex-start !important;
            align-items: center !important;
          }
          .flex.align-items-center.mb-3 p {
            margin-left: 6px !important;
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            text-align: left !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      if (style) document.head.removeChild(style);
    };
  }, [isOpen, location.pathname]);

  // Create role-specific menu items
  const crewMenuItems = [
    {
      label: "Dashboard",
      icon: dashboardLogo,
      path: "/crew/dashboard",
    },
    {
      label: "Crew",
      icon: (
        <PeopleIcon style={{ color: theme === "light" ? "#103B57" : "#fff" }} />
      ),
      path: "/crew",
      subItems: [
        {
          label: "Legal Resources",
          path: "/crew/legal-resources",
        },
        {
          label: "Crew Training",
          path: "/crew/training",
        },
        {
          label: "Accommodation",
          path: "/crew/accomodation",
        },
        {
          label: "Document Management",
          path: "/crew/document-management",
        },
      ],
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

  const handleNavigation = (path, onClick, subItems) => {
    if (onClick) {
      onClick();
    } else if (subItems && subItems.length > 0) {
      setOpenSubMenu((prev) => (prev === path ? null : path));
    } else if (path) {
      navigate(path);
      onClose();
    }
  };

  const [openSubMenu, setOpenSubMenu] = React.useState(null);

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
        <div 
          className="logo-container" 
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
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
                position: "relative",
              }}
              onClick={() =>
                handleNavigation(item.path, item.onClick, item.subItems)
              }
            >
              {typeof item.icon === "string" ? (
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
              ) : (
                <span
                  style={{
                    marginRight: "15px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {item.icon}
                </span>
              )}
              <span
                style={{
                  color: theme === "light" ? "#103B57" : "#FFFFFF",
                  fontSize: "16px",
                  fontWeight: location.pathname === item.path ? "600" : "400",
                }}
              >
                {item.label}
              </span>
              {item.subItems && (
                <span style={{ marginLeft: "auto", fontSize: 18 }}>
                  {openSubMenu === item.path ? "▲" : "▼"}
                </span>
              )}
            </div>
            {/* Responsive Crew Dropdown */}
            {item.subItems && openSubMenu === item.path && (
              <div
                style={{
                  background: theme === "light" ? "#F8FBFF" : "#1A2A3A",
                  borderRadius: 8,
                  marginLeft: 40,
                  marginBottom: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  padding: "8px 0",
                  minWidth: 180,
                  zIndex: 1100,
                  position: "relative",
                }}
              >
                {item.subItems.map((sub, subIdx) => (
                  <div
                    key={subIdx}
                    className="menu-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 16px",
                      borderRadius: "6px",
                      marginBottom: 4,
                      backgroundColor:
                        location.pathname === sub.path
                          ? theme === "light"
                            ? "#F0F5FF"
                            : "#1A2A3A"
                          : "transparent",
                      color: theme === "light" ? "#103B57" : "#FFFFFF",
                      fontWeight: location.pathname === sub.path ? 600 : 400,
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate(sub.path);
                      setOpenSubMenu(null);
                      onClose();
                    }}
                  >
                    {sub.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopNav;

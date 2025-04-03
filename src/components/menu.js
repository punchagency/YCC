import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PanelMenu } from "primereact/panelmenu";
import { Button } from "primereact/button";
import { useUser } from "../context/userContext";
import logo from "../assets/images/logo-login.png";
import orderLogo from "../assets/images/crew/order1.png";
import financeLogo from "../assets/images/crew/financeLogo.png";
import complianceLogo from "../assets/images/crew/complianceLogo.png";
import reportLogo from "../assets/images/crew/reportLogo.png";
import settingsLogo from "../assets/images/crew/settingsLogo.png";
import homeLogo from "../assets/images/crew/homeLogo.png";
import helpLogo from "../assets/images/crew/info.png";
import contactLogo from "../assets/images/crew/shape.png";
import logoutLogo from "../assets/images/crew/logout.png";

const LeftMenu = ({ role, isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      icon: <img src={homeLogo} alt="Dashboard" width={15} height={15} />,
      className: location.pathname === "/admin/dashboard" ? "active-menu-item" : "",
      command: () => {
        navigate("/admin/dashboard");
      },
    },
    {
      label: "Calendar",
      icon: "pi pi-calendar",
      className: location.pathname === "/admin/calendar-management" ? "active-menu-item" : "",
      command: () => {
        navigate("/admin/calendar-management");
      },
    },
    {
      label: "Inventory Management",
      icon: "pi pi-file",
      className: location.pathname === "/admin/inventory-management" ? "active-menu-item" : "",
      command: () => {
        navigate("/admin/inventory-management");
      },
    },
    {
      label: "Orders",
      icon: <img src={orderLogo} alt="Orders" width={15} height={15} />,
      className: location.pathname === "/admin/orders-management" ? "active-menu-item" : "",
      command: () => {
        navigate("/admin/orders-management");
      },
    },
    {
      label: "Bookings",
      icon: <img src={orderLogo} alt="Bookings" width={15} height={15} />,
      className: location.pathname === "/admin/bookings-management" ? "active-menu-item" : "",
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
      command: () => {
        navigate("/admin/financial-management");
      },
    },
    {
      label: "Notifications",
      icon: (
        <img
          src={complianceLogo}
          alt="Compliance Tracking"
          width={15}
          height={15}
        />
      ),
      command: () => {
        navigate("/admin/notifications");
      },
    },
    {
      label: "Reports",
      icon: <img src={reportLogo} alt="Reports" width={15} height={15} />,
      command: () => {
        navigate("/admin/reports");
      },
    },
    {
      label: "Settings",
      icon: <img src={settingsLogo} alt="Settings" width={15} height={15} />,
      command: () => {
        navigate("/admin/settings");
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
      command: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
      style: { color: "#FF4B4B" },
    },
  ];

  return (
    <div className={`left-menu ${isCollapsed ? "collapsed" : ""}`}>
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
      <div >
        <PanelMenu  model={menuItems} />
      </div>
    </div>
  );
};

export default LeftMenu;

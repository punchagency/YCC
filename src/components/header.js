import React, { useRef, useState } from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import avatar from "../assets/images/avatar.svg";
import { OverlayPanel } from "primereact/overlaypanel";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { useNavigate, useLocation } from "react-router-dom";
import hamburger from "../assets/images/crew/hamburger.png";
import searchLogo from "../assets/images/crew/searchLogo.png";
import { useUser } from "./../context/userContext"; // Import User Context
import { Dropdown } from "primereact/dropdown";
import { Menu } from "primereact/menu";
import manprofile from "../assets/images/crew/manprofile.png";
import sortBy from "../assets/images/crew/sortBy.png";
import more from "../assets/images/crew/more.png";
import filterBy from "../assets/images/crew/filterBy.png";
import icon from "../assets/images/crew/Icon.png";
import share from "../assets/images/crew/share.png";
import MobileSidebar from "./MobileSidebar"; // Re-import MobileSidebar

const AdminHeader = ({ isCollapsed, setIsCollapsed, role, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isBookingsPage = location.pathname.includes("/bookings");
  const overlayPanelRef = useRef(null);
  const { user, logoutUser } = useUser(); // Get user data from context
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);
  const shareMenuRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Add refs for the new menus
  const filterMenuRef = useRef(null);
  const sortMenuRef = useRef(null);

  // Define menu items for Filter and Sort
  const filterItems = [
    {
      label: "Vendor",
      command: () => {
        console.log("Filter by Vendor");
      },
    },
    {
      label: "Yacht",
      command: () => {
        console.log("Filter by Yacht");
      },
    },
    {
      label: "Order Status",
      command: () => {
        console.log("Filter by Order Status");
      },
    },
    {
      label: "Priority",
      command: () => {
        console.log("Filter by Priority");
      },
    },
    {
      label: "Delivery Date",
      command: () => {
        console.log("Filter by Delivery Date");
      },
    },
  ];

  const sortItems = [
    {
      label: "Date Placed",
      command: () => {
        console.log("Sort by Date Placed");
      },
    },
    {
      label: "Order Value",
      command: () => {
        console.log("Sort by Order Value");
      },
    },
    {
      label: "Urgency",
      command: () => {
        console.log("Sort by Urgency");
      },
    },
    {
      label: "Fulfillment Status",
      command: () => {
        console.log("Sort by Fulfillment Status");
      },
    },
  ];

  // Share menu items
  const shareItems = [
    {
      label: "Email",
      icon: "pi pi-envelope",
      command: () => {
        console.log("Share via email");
      },
    },
    {
      label: "Export as PDF",
      icon: "pi pi-file-pdf",
      command: () => {
        console.log("Export as PDF");
      },
    },
    {
      label: "Export as Excel",
      icon: "pi pi-file-excel",
      command: () => {
        console.log("Export as Excel");
      },
    },
  ];

  const [notifications] = useState([
    {
      title: "Deficiency Follow-Ups",
      message: "The recent MARPOL Annex I audit ..",
      isNew: true,
      create_at: "2 hours ago",
    },
    {
      title: "Upcoming Certification Expirations",
      message: "The ISPS Code certification for Vessel..",
      isNew: false,
      create_at: "Yesterday",
    },
    {
      title: "Scheduled Inspections",
      message: "Vessel A has a scheduled Flag State ins..",
      isNew: false,
      create_at: "Nov 7, 2024",
    },
  ]);

  // Get user's name from the profile data
  const userName = "";

  // Get profile picture if available
  const profilePicture = user?.profile?.profilePicture || avatar;

  const handleLogout = () => {
    logoutUser(); // Clears user data
    navigate("/login"); // Redirect to login page
  };

  const viewAllNotifications = () => {
    if (role === "Captain") {
      navigate("/notifications");
    } else {
      navigate("/crew/notifications");
    }
  };

  // Detect if we're on mobile
  const isMobile = window.innerWidth <= 768;

  const start = (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: "15px",
        }}
      >
        {/* Hamburger Menu */}
        <div
          style={{
            cursor: "pointer",
            marginRight: "10px",
          }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <img
            src={hamburger}
            alt="menu"
            style={{ width: "24px", height: "24px" }}
          />
        </div>

        {/* Search Input */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "350px",
          }}
        >
          <img
            src={searchLogo}
            alt="search"
            style={{ position: "absolute", left: "10px" }}
          />
          <input
            type="text"
            placeholder="Search Reports"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              paddingLeft: "35px",
              width: "100%",
              height: "40px",
              border: "1px solid #ced4da",
              borderRadius: "30px",
              backgroundColor: "#F5F6FA",
              fontSize: "10px",
            }}
          />
        </div>

        {/* Controls Container */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Filter By Button and Menu */}
            <Menu model={filterItems} popup ref={filterMenuRef} />
            <Button
              label="Filter By"
              icon={
                <img
                  src={filterBy}
                  alt="filter"
                  style={{
                    width: "12px",
                    height: "12px",
                    marginRight: "4px",
                  }}
                />
              }
              onClick={(e) => filterMenuRef.current.toggle(e)}
              style={{
                height: "30px",
                width: "85px",
                backgroundColor: "#F5F6FA",
                border: "1px solid #ced4da",
                borderRadius: "8px",
                color: "#495057",
                fontSize: "12px",
                padding: "0.5rem 0.5rem",
                marginLeft: "-10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            />

            {/* Sort By Button and Menu */}
            <Menu model={sortItems} popup ref={sortMenuRef} />
            <Button
              label="Sort By"
              icon={
                <img
                  src={sortBy}
                  alt="sort"
                  style={{
                    width: "12px",
                    height: "12px",
                    marginRight: "4px",
                  }}
                />
              }
              onClick={(e) => sortMenuRef.current.toggle(e)}
              style={{
                height: "30px",
                width: "85px",
                backgroundColor: "#F5F6FA",
                border: "1px solid #ced4da",
                borderRadius: "8px",
                color: "#495057",
                fontSize: "12px",
                padding: "0.5rem 0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            />

            {/* Share Button and Menu */}
            <Menu model={shareItems} popup ref={shareMenuRef} />
            <Button
              label="Share"
              icon={
                <img
                  src={share}
                  alt="share"
                  style={{ width: "12px", height: "12px" }}
                />
              }
              onClick={(e) => shareMenuRef.current.toggle(e)}
              style={{
                height: "30px",
                width: "85px",
                backgroundColor: "#F5F6FA",
                border: "1px solid #ced4da",
                borderRadius: "8px",
                color: "#495057",
                fontSize: "12px",
                padding: "0.5rem 0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            />
          </div>
        )}
      </div>
    </>
  );

  const end = (
    <>
      {/* Theme Toggle Switch */}

      {/* Notification Overlay Panel */}
      <OverlayPanel ref={overlayPanelRef} className="notification-overlay">
        <div className="flex align-items-center justify-content-between mb-3">
          <div className="flex align-items-center title">
            <i className="pi pi-bell" />
            <h4 className="mx-2">Notifications</h4>
            <Badge value={notifications?.length} severity="warning"></Badge>
          </div>
        </div>

        <ul className="notification-list mb-3">
          {notifications.map((item, index) => (
            <li key={index}>
              <Card className={item.isNew === true ? "new mb-2" : "mb-2"}>
                <div className="flex justify-content-between">
                  <div>
                    {item?.isNew === true ? (
                      <Badge value="New" severity="success"></Badge>
                    ) : (
                      ""
                    )}
                    <h3 className="mb-2">{item.title}</h3>
                    <p className="m-0">{item.message}</p>
                  </div>
                  <div>
                    <p className="text-right time">{item.create_at}</p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
        <Button
          label="View all notifications"
          outlined
          className="w-full p-outline-button-primary"
          onClick={viewAllNotifications}
        />
      </OverlayPanel>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#F5F6FA",
            borderRadius: "30px",
            padding: "2px",
            width: "64px",
            height: "32px",
            marginRight: "16px",
            cursor: "pointer",
            position: "relative",
          }}
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {/* Sun Icon */}
          <div
            style={{
              width: "50%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={isDarkMode ? "#94A3B8" : "#0F172A"}
            >
              <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" />
              <path d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20" />
            </svg>
          </div>
          {/* Moon Icon */}
          <div
            style={{
              width: "50%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={isDarkMode ? "#0F172A" : "#94A3B8"}
            >
              <path d="M21.9548 12.9564C20.5779 15.3717 17.9791 17.0001 15 17.0001C10.5817 17.0001 7 13.4184 7 9.00006C7 6.02097 8.62837 3.42225 11.0436 2.04535C5.96731 2.52504 2 6.79927 2 12.0001C2 17.5229 6.47715 22.0001 12 22.0001C17.2008 22.0001 21.475 18.0327 21.9548 12.9564Z" />
            </svg>
          </div>
          {/* Sliding Background */}
          <div
            style={{
              position: "absolute",
              width: "50%",
              height: "28px",
              backgroundColor: "#fff",
              borderRadius: "28px",
              transition: "transform 0.3s ease",
              transform: `translateX(${isDarkMode ? "100%" : "0"})`,
              left: "2px",
              top: "2px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        </div>

        {/* Notification Bell */}
        <Button
          icon={
            <img
              src={icon}
              alt="notification"
              style={{ width: "24px", height: "24px",  }}
            />
          }
          className="notifications"
          onClick={(event) => overlayPanelRef.current.toggle(event)}
          aria-haspopup
          style={{
            width: "40px",
            height: "40px",
            background: "transparent",
            border: "none",
          }}
        />
        <img
          src={manprofile}
          alt="Profile"
          className="profile-image"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p>{userName}</p>
            <p>Admin</p>
          </div>
          <div style={{ marginTop: "-20px" }}>
            <img
              src={more}
              alt="more"
              style={{ width: "15px", height: "15px" }}
            />
          </div>
        </div>
      </div>
    </>
  );

  // Return both the Menubar and the MobileSidebar
  return (
    <>
      <Menubar
        start={start}
        end={end}
        style={{
          padding: isMobile ? "8px" : "16px",
          flexWrap: "wrap",
        }}
      />
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        role={role}
      />
    </>
  );
};

export default AdminHeader;

import React, { useRef, useState, useEffect } from "react";
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
import { useTheme } from "../context/theme/themeContext";
import { getNotifications } from "../services/notification/notificationService";
import { Dialog } from "primereact/dialog";
import { 
  downloadInventoryReport,
  downloadOrderReport,
  downloadBookingReport,
  downloadFinancialReport,
  downloadInventoryExcel,
  downloadOrderExcel,
  downloadBookingExcel,
  downloadFinancialExcel
} from "../services/reports/reports";
import './header.css';

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
  const { theme, changeTheme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getNotifications();
      if (response.success) {
        const transformedData = response.data.map((item) => ({
          priority: item.priority || "Low",
          type: item.type || "General Issue",
          description: item.message || item.description,
          status: item.status || "Pending",
          createdAt: item.create_at || item.createdAt,
          _id: item._id,
        }));
        setNotifications(transformedData);
        setError(null);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

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
   // {
      //label: "Email",
      //icon: "pi pi-envelope",
      //command: () => {
       // console.log("Share via email");
      //},
    //},
   // {
     // label: "Export as PDF",
      //icon: "pi pi-file-pdf",
      //command: () => {
        //setShowExportModal(true);
      //},
    //},
    {
      label: "Export as Excel",
      icon: "pi pi-file-excel",
      command: () => {
        setShowExcelModal(true);
      },
    },
  ];

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
      navigate("/admin/notifications");
    } else {
      navigate("/admin/notifications");
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
          className="hamburger-container"
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
      <OverlayPanel
        ref={overlayPanelRef}
        className="notification-overlay"
        style={{ width: "320px", padding: "16px" }}
      >
        <div className="flex align-items-center justify-content-between mb-3">
          <div className="flex align-items-center">
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
              Notifications
            </h4>
          </div>
        </div>

        <div
          className="notification-list"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {notifications.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "12px 0",
                borderBottom: "1px solid #E4E7EC",
                position: "relative",
              }}
            >
              {/* Priority Dot */}
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor:
                    item.priority === "High"
                      ? "#F04438"
                      : item.priority === "Medium"
                      ? "#F79009"
                      : "#12B76A",
                  marginTop: "6px",
                  marginRight: "12px",
                }}
              />

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#344054",
                      marginBottom: "4px",
                    }}
                  >
                    {item.priority} Priority
                  </span>

                  {/* More Options Icon */}
                  <button
                    style={{
                      border: "none",
                      background: "none",
                      padding: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <i
                      className="pi pi-ellipsis-h"
                      style={{ color: "#667085", fontSize: "16px" }}
                    />
                  </button>
                </div>

                <p
                  style={{
                    margin: "0",
                    fontSize: "14px",
                    color: "#475467",
                  }}
                >
                  {item.description}
                </p>

                <span
                  style={{
                    fontSize: "12px",
                    color: "#667085",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {item.create_at}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <Button
          label="View All Notifications"
          className="p-button-text"
          style={{
            width: "100%",
            marginTop: "16px",
            color: "#0387D9",
            border: "1px solid #0387D9",
            borderRadius: "8px",
            padding: "8px",
            backgroundColor: "transparent",
          }}
          onClick={viewAllNotifications}
        />
      </OverlayPanel>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* <div
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
          onClick={() => changeTheme()}
        >
         
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
              fill={theme === "light" ? "#94A3B8" : "#0F172A"}
            >
              <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" />
              <path d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20" />
            </svg>
          </div>
          
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
              fill={theme === "light" ? "#0F172A" : "#94A3B8"}
            >
              <path d="M21.9548 12.9564C20.5779 15.3717 17.9791 17.0001 15 17.0001C10.5817 17.0001 7 13.4184 7 9.00006C7 6.02097 8.62837 3.42225 11.0436 2.04535C5.96731 2.52504 2 6.79927 2 12.0001C2 17.5229 6.47715 22.0001 12 22.0001C17.2008 22.0001 21.475 18.0327 21.9548 12.9564Z" />
            </svg>
          </div>
          Sliding Background
          <div
            style={{
              position: "absolute",
              width: "50%",
              height: "28px",
              backgroundColor: "#fff",
              borderRadius: "28px",
              transition: "transform 0.3s ease",
              transform: `translateX(${theme === "light" ? "100%" : "0"})`,
              left: "2px",
              top: "2px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        </div> */}

        {/* Notification Bell */}
        <Button
          icon={
            <img
              src={icon}
              alt="notification"
              style={{ width: "24px", height: "24px" }}
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
        <div 
          className="profile-section"
          onClick={() => navigate("/admin/profile")}
          style={{ cursor: "pointer" }}
        >
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
        </div>
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

  const handleExport = async (type) => {
    try {
      switch (type) {
        case "inventory":
          const inventoryResult = await downloadInventoryReport();
          if (!inventoryResult.success) {
            console.error("Failed to download inventory report");
          }
          break;
        case "order":
          const orderResult = await downloadOrderReport();
          if (!orderResult.success) {
            console.error("Failed to download order report");
          }
          break;
        case "booking":
          const bookingResult = await downloadBookingReport();
          if (!bookingResult.success) {
            console.error("Failed to download booking report");
          }
          break;
        case "financial":
          console.log("Starting financial export...");
          const financialResult = await downloadFinancialReport();
          console.log("Financial export result:", financialResult);
          if (!financialResult.success) {
            console.error("Failed to download financial report");
          }
          break;
        default:
          console.log("Unknown report type");
      }
    } catch (error) {
      console.error("Error in handleExport:", error);
    } finally {
      setShowExportModal(false);
    }
  };

  const handleExcelExport = async (type) => {
    try {
      switch (type) {
        case "inventory":
          const inventoryResult = await downloadInventoryExcel();
          if (!inventoryResult.success) {
            console.error("Failed to download inventory excel");
          }
          break;
        case "order":
          const orderResult = await downloadOrderExcel();
          if (!orderResult.success) {
            console.error("Failed to download order excel");
          }
          break;
        case "booking":
          const bookingResult = await downloadBookingExcel();
          if (!bookingResult.success) {
            console.error("Failed to download booking excel");
          }
          break;
        case "financial":
          const financialResult = await downloadFinancialExcel();
          if (!financialResult.success) {
            console.error("Failed to download financial excel");
          }
          break;
        default:
          console.log("Unknown report type");
      }
    } catch (error) {
      console.error("Error downloading excel:", error);
    } finally {
      setShowExcelModal(false);
    }
  };
  
  // Return both the Menubar and the MobileSidebar
  return (
    <>
      <Menubar 
        start={start} 
        end={end} 
        style={{ 
          padding: isMobile ? "8px" : "16px",
          flexWrap: "wrap",
          backgroundColor: theme === "light" ? "#F8FBFF" : "#03141F",
          color: theme === "light" ? "#103B57" : "#F8FBFF",
        }}
      />
      <MobileSidebar 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        style={{
          backgroundColor: theme === "light" ? "#F8FBFF" : "#03141F",
          color: theme === "light" ? "#103B57" : "#F8FBFF",
        }}
        role={role}
      />

      {/* Add the Export Modal */}
      <Dialog
        visible={showExportModal}
        onHide={() => setShowExportModal(false)}
        header="Export Reports"
        style={{ width: "400px" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        modal
        className="export-modal"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Button
            label="Export Order Report"
            icon="pi pi-file-pdf"
            onClick={() => handleExport("order")}
            style={{
              backgroundColor: "#ffffff",
              color: "#495057",
              border: "1px solid #ced4da",
              justifyContent: "flex-start",
              padding: "1rem",
              width: "100%",
            }}
          />
          <Button
            label="Export Booking Report"
            icon="pi pi-file-pdf"
            onClick={() => handleExport("booking")}
            style={{
              backgroundColor: "#ffffff",
              color: "#495057",
              border: "1px solid #ced4da",
              justifyContent: "flex-start",
              padding: "1rem",
              width: "100%",
            }}
          />
          <Button
            label="Export Inventory Report"
            icon="pi pi-file-pdf"
            onClick={() => handleExport("inventory")}
            style={{
              backgroundColor: "#ffffff",
              color: "#495057",
              border: "1px solid #ced4da",
              justifyContent: "flex-start",
              padding: "1rem",
              width: "100%",
            }}
          />
          <Button
            label="Export Financial Report"
            icon="pi pi-file-pdf"
            onClick={() => handleExport("financial")}
            style={{
              backgroundColor: "#ffffff",
              color: "#495057",
              border: "1px solid #ced4da",
              justifyContent: "flex-start",
              padding: "1rem",
              width: "100%",
            }}
          />
        </div>
      </Dialog>

      {/* Add the Excel Export Modal */}
      <Dialog
        visible={showExcelModal}
        onHide={() => setShowExcelModal(false)}
        header="Export Excel Reports"
        style={{ width: "400px" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        modal
        className="export-modal"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Button
            label="Export Order Excel"
            icon="pi pi-file-excel"
            onClick={() => handleExcelExport("order")}
            style={{
              backgroundColor: "#ffffff",
              color: "#495057",
              border: "1px solid #ced4da",
              justifyContent: "flex-start",
              padding: "1rem",
              width: "100%",
            }}
          />
          <Button
            label="Export Booking Excel"
            icon="pi pi-file-excel"
            onClick={() => handleExcelExport("booking")}
            style={{
              backgroundColor: "#ffffff",
              color: "#495057",
              border: "1px solid #ced4da",
              justifyContent: "flex-start",
              padding: "1rem",
              width: "100%",
            }}
          />
          <Button
            label="Export Inventory Excel"
            icon="pi pi-file-excel"
            onClick={() => handleExcelExport("inventory")}
            style={{
              backgroundColor: "#ffffff",
              color: "#495057",
              border: "1px solid #ced4da",
              justifyContent: "flex-start",
              padding: "1rem",
              width: "100%",
            }}
          />
          <Button
            label="Export Financial Excel"
            icon="pi pi-file-excel"
            onClick={() => handleExcelExport("financial")}
            style={{
              backgroundColor: "#ffffff",
              color: "#495057",
              border: "1px solid #ced4da",
              justifyContent: "flex-start",
              padding: "1rem",
              width: "100%",
            }}
          />
        </div>
      </Dialog>
    </>
  );
};

export default AdminHeader;

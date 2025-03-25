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

const AdminHeader = ({ isCollapsed, setIsCollapsed, role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isBookingsPage = location.pathname.includes("/bookings");
  const overlayPanelRef = useRef(null);
  const { user, logoutUser } = useUser(); // Get user data from context
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);
  const shareMenuRef = useRef(null);

  // Filter options
  const filterOptions = [
    { label: "Vendor", value: "vendor" },
    { label: "Yacht", value: "yacht" },
    { label: "Order Status", value: "orderStatus" },
    { label: "Priority", value: "priority" },
    { label: "Delivery Date", value: "deliveryDate" },
  ];

  // Sort options
  const sortOptions = [
    { label: "Date Placed", value: "datePlaced" },
    { label: "Order Value", value: "orderValue" },
    { label: "Urgency", value: "urgency" },
    { label: "Fulfillment Status", value: "fulfillmentStatus" },
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
  const userName =
    user?.profile?.firstName && user?.profile?.lastName
      ? `${user.profile.firstName} ${user.profile.lastName}`
      : user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : "User";

  // Get profile picture if available
  const profilePicture = user?.profile?.profilePicture || avatar;

  const handleLogout = () => {
    logoutUser(); // Clears user data
    navigate("/login"); // Redirect to login page
  };

  const start = (
    <>
      <div
        className="header-container"
        style={{ display: "flex", alignItems: "center", width: "100%" }}
      >
        <div className="hamburger">
          <img src={hamburger} alt="Profile" className="profile-image" />
        </div>

        {/* Search container as a separate div */}
        <div
          className="search-container"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            flex: "1",
            marginRight: "15px",
          }}
        >
          <img
            src={searchLogo}
            alt="search"
            className="profile-image"
            style={{ position: "absolute", left: "10px" }}
          />
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ paddingLeft: "35px", width: "100%" }}
          />
        </div>

        {/* Only show these controls on the Bookings page - outside the search container */}
        {isBookingsPage && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {/* Filter Dropdown */}
            <Dropdown
              value={selectedFilter}
              options={filterOptions}
              onChange={(e) => setSelectedFilter(e.value)}
              placeholder="Filter By"
              style={{
                width: "120px",
                height: "36px",
                textAlign: "center",
                alignItems: "center",
              }}
              panelStyle={{ fontSize: "0.7rem" }}
            />

            {/* Sort Dropdown */}
            <Dropdown
              value={selectedSort}
              options={sortOptions}
              onChange={(e) => setSelectedSort(e.value)}
              placeholder="Sort By"
              style={{
                width: "120px",
                height: "36px",
                textAlign: "center",
                alignItems: "center",
              }}
              panelStyle={{ fontSize: "0.7rem" }}
            />

            {/* Share Button */}
            <Button
              icon="pi pi-share-alt"
              className="p-button-outlined p-button-sm"
              onClick={(e) => shareMenuRef.current.toggle(e)}
              aria-controls="share-menu"
              aria-haspopup
              style={{ height: "36px", width: "36px" }}
            />
            <Menu model={shareItems} popup ref={shareMenuRef} id="share-menu" />
          </div>
        )}
      </div>

      {/* Display selected filters if any - only on Bookings page */}
      {isBookingsPage && (selectedFilter || selectedSort) && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
            flexWrap: "wrap",
          }}
        >
          {selectedFilter && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f0f7ff",
                padding: "5px 10px",
                borderRadius: "4px",
                border: "1px solid #d0e1fd",
              }}
            >
              <span>
                Filter:{" "}
                {filterOptions.find((f) => f.value === selectedFilter)?.label}
              </span>
              <Button
                icon="pi pi-times"
                className="p-button-text p-button-rounded p-button-sm"
                onClick={() => setSelectedFilter(null)}
                style={{ padding: "2px", margin: "0 0 0 5px" }}
              />
            </div>
          )}

          {selectedSort && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f0f7ff",
                padding: "5px 10px",
                borderRadius: "4px",
                border: "1px solid #d0e1fd",
              }}
            >
              <span>
                Sort: {sortOptions.find((s) => s.value === selectedSort)?.label}
              </span>
              <Button
                icon="pi pi-times"
                className="p-button-text p-button-rounded p-button-sm"
                onClick={() => setSelectedSort(null)}
                style={{ padding: "2px", margin: "0 0 0 5px" }}
              />
            </div>
          )}
        </div>
      )}
    </>
  );

  const viewAllNotifications = () => {
    if (role === "Captain") {
      navigate("/notifications");
    } else {
      navigate("/crew/notifications");
    }
  };

  const end = (
    <>
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
        <Button
          icon="pi pi-bell"
          className="notifications"
          onClick={(event) => overlayPanelRef.current.toggle(event)}
          aria-haspopup
          rounded
        />
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={avatar}
            alt="Profile"
            className="profile-image"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <p>{userName}</p>
        </div>
      </div>
    </>
  );
  return <Menubar start={start} end={end} />;
};

export default AdminHeader;

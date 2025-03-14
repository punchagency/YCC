import React, { useRef, useState } from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import avatar from "../assets/images/avatar.svg";
import { OverlayPanel } from "primereact/overlaypanel";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { useNavigate } from "react-router-dom";
import hamburger from "../assets/images/crew/hamburger.png";
import searchLogo from "../assets/images/crew/searchLogo.png";
import { useUser } from "./../context/userContext"; // Import User Context


const AdminHeader = ({ isCollapsed, setIsCollapsed, role }) => {
  const navigate = useNavigate();
  const overlayPanelRef = useRef(null);
  const { user, logoutUser } = useUser(); // Get user data from context

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

  const handleLogout = () => {
    logoutUser(); // Clears user data
    navigate("/login"); // Redirect to login page
  };

  const start = (
    <>
      {/* <div className="flex align-items-center profile">

        <Button
          icon="pi pi-bars"
          text
          className="p-0 collapse-btn mr-3"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
        <img src={avatar} alt="Profile" className="profile-image" />
        <span className="profile-name">
        Welcome, <strong>{user?.firstName || "User"}</strong>
        
        </span>
      </div> */}
      <div className="header-container">
          <div className="hamburger">
            <img src={hamburger} alt="Profile" className="profile-image" />
          </div>
          <div className="search-container">
            <img src={searchLogo} alt="search" className="profile-image" />
            <input type="text" placeholder="Search" />
          </div>
      </div>
    </>
  );
  const viewAllNotifications = () => {
    if (role === "Captain") {
      navigate("/notifications");

    }
    else {
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

          {/* <Button label="Mark all read" text className="p-0 mark-btn" /> */}
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
      <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
        <Button
          icon="pi pi-bell"
          className="notifications"
          onClick={(event) => overlayPanelRef.current.toggle(event)}
          aria-haspopup
          rounded
        />
        <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
          <img src={avatar} alt="Profile" className="profile-image" />
          <p>Alex Seiger</p>
        </div>
      </div>
    </>
  );
  return <Menubar start={start} end={end} />;
};

export default AdminHeader;
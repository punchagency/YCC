import React, { useRef, useState } from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import avatar from "../assets/images/avatar.svg";
import { OverlayPanel } from "primereact/overlaypanel";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const overlayPanelRef = useRef(null);
  const [notifications, setNotifications] = useState([
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

  const start = (
    <>
      <div className="flex align-items-center profile">
        <img src={avatar} alt="Profile" className="profile-image" />
        <span className="profile-name">
          Welcome, <strong>Christopher</strong>
        </span>
        <Button 
          icon="pi pi-bars" 
          text 
          className="p-0 collapse-btn ml-4" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </div>
    </>
  );
  const viewAllNotifications = () => {
    navigate("/notifications");
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
      <Button
        icon="pi pi-bell"
        className="notifications"
        onClick={(event) => overlayPanelRef.current.toggle(event)}
        aria-haspopup
        rounded
      />
    </>
  );
  return <Menubar start={start} end={end} />;
};

export default AdminHeader;

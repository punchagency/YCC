import { useRef, useState } from "react";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useMediaQuery } from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import NotificationDetailsModal from "../../../components/NotificationDetailsModal";
import NotificationTable from "./table";
import { TableSkeleton } from "../../../components/TableSkeleton";
import { useToast } from "../../../components/Toast";

// Static dummy data for crew notifications
const dummyNotifications = [
  {
    _id: "1",
    priority: "High",
    type: "Maintenance Alert",
    description:
      "Engine room requires immediate inspection due to unusual noise reported by engineering staff.",
    status: "Pending",
    createdAt: "2023-06-15T10:30:00Z",
  },
  {
    _id: "2",
    priority: "Medium",
    type: "Schedule Change",
    description:
      "Port arrival time changed from 14:00 to 16:00 due to weather conditions.",
    status: "In Progress",
    createdAt: "2023-06-14T08:45:00Z",
  },
  {
    _id: "3",
    priority: "Low",
    type: "Inventory Update",
    description:
      "Fresh produce delivery scheduled for tomorrow morning at 08:00.",
    status: "Resolved",
    createdAt: "2023-06-13T15:20:00Z",
  },
  {
    _id: "4",
    priority: "High",
    type: "Safety Drill",
    description:
      "Mandatory safety drill scheduled for all crew members tomorrow at 09:00.",
    status: "Pending",
    createdAt: "2023-06-12T11:10:00Z",
  },
  {
    _id: "5",
    priority: "Medium",
    type: "Staff Meeting",
    description:
      "Department heads meeting in the conference room at 13:00 today.",
    status: "In Progress",
    createdAt: "2023-06-11T09:30:00Z",
  },
  {
    _id: "6",
    priority: "Low",
    type: "Training Opportunity",
    description:
      "New safety equipment training available. Sign up by the end of the week.",
    status: "Resolved",
    createdAt: "2023-06-10T14:15:00Z",
  },
  {
    _id: "7",
    priority: "High",
    type: "Weather Alert",
    description:
      "Rough seas expected in the next 24 hours. Secure all loose equipment and prepare accordingly.",
    status: "Pending",
    createdAt: "2023-06-09T16:40:00Z",
  },
];

export default function Notification({ role }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications] = useState(dummyNotifications); // Use static data
  const [loading, setLoading] = useState(false); // Set to false since we're using static data
  const [statusLoading, setStatusLoading] = useState(false);
  const toast = useRef(null);
  const { showSuccess, showError } = useToast();

  // Add responsive detection
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("sm", "md"));
  const { theme } = useMuiTheme();

  const filteredNotifications = notifications.filter((notification) =>
    activeFilter === "all"
      ? true
      : notification.priority.toLowerCase() === activeFilter.toLowerCase()
  );

  const handleFilterClick = (filter) => setActiveFilter(filter);

  const handleViewDetails = (row) => {
    setSelectedNotification(row);
    setShowModal(true);
  };

  const handleStatusChange = (notificationId, newStatus) => {
    // Just simulate status change with static data
    setStatusLoading(true);

    // Update local state only
    setTimeout(() => {
      // No need to call API, just update UI
      showSuccess(`Notification status changed to ${newStatus}`);
      setStatusLoading(false);
    }, 500);
  };

  return (
    <>
      <Toast ref={toast} />
      <div
        className="notification-container"
        style={{ background: "#F8FBFF", minHeight: "100vh", width: "100%" }}
      >
        <div
          className="notification-header"
          style={{
            display: "flex",
            alignItems: "center",
            padding: isMobile ? "10px 15px" : "15px 20px",
          }}
        >
          <h3 style={{ fontSize: isMobile ? "18px" : "20px" }}>
             Notifications
          </h3>
          <Badge
            value={notifications.length}
            severity="danger"
            style={{ marginLeft: "7px" }}
          />
        </div>

        <div
          className="notification-filter"
          style={{
            overflowX: isMobile ? "auto" : "visible",
            whiteSpace: isMobile ? "nowrap" : "normal",
            padding: isMobile ? "0 15px" : "0 20px",
          }}
        >
          {["all", "high", "medium", "low"].map((filter) => (
            <Button
              key={filter}
              label={
                filter.charAt(0).toUpperCase() +
                filter.slice(1) +
                (isMobile ? "" : " Priority")
              }
              className={`p-button-text ${
                activeFilter === filter ? "p-button-primary" : ""
              }`}
              onClick={() => handleFilterClick(filter)}
              style={{
                padding: isMobile ? "6px 10px" : "8px 16px",
                fontSize: isMobile ? "12px" : "14px",
              }}
            />
          ))}
        </div>

        {/* Table component */}
        <NotificationTable
          notifications={notifications}
          selectedNotification={selectedNotification}
          setSelectedNotification={setSelectedNotification}
          handleViewDetails={handleViewDetails}
          handleStatusChange={handleStatusChange}
          statusLoading={statusLoading}
          isMobile={isMobile}
          isTablet={isTablet}
          filteredNotifications={filteredNotifications}
        />
      </div>

      <NotificationDetailsModal
        visible={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        notificationData={selectedNotification}
      />
    </>
  );
}

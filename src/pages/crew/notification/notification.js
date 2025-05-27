import { useRef, useState, useEffect } from "react";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useMediaQuery } from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import NotificationDetailsModal from "../../../components/NotificationDetailsModal";
import NotificationTable from "./table";
import { TableSkeleton } from "../../../components/TableSkeleton";
import { useToast } from "../../../components/Toast";
import {
  fetchCrewNotifications,
  updateNotificationStatus,
  markNotificationAsRead,
} from "../../../services/crew/crewNotificationService";

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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const toast = useRef(null);
  const { showSuccess, showError } = useToast();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Add responsive detection
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("sm", "md"));
  const { theme } = useMuiTheme();

  // Transform API notification to table format
  const transformNotification = (notification) => {
    console.log("Transforming notification:", notification);
    return {
      _id: notification._id,
      priority: notification.type === "inventory" ? "Medium" : "High",
      type: notification.title,
      description: notification.message,
      status: notification.read ? "Read" : "Unread",
      createdAt: notification.createdAt,
      data: notification.data,
    };
  };

  // Add useEffect to fetch notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        console.log("Fetching notifications with page:", page, "limit:", limit);

        const response = await fetchCrewNotifications({ page, limit });
        console.log("Raw API Response:", response);

        if (response.success && response.data?.notifications) {
          console.log(
            "Raw notifications from API:",
            response.data.notifications
          );

          // Transform the notifications to match the table format
          const transformedNotifications = response.data.notifications.map(
            transformNotification
          );
          console.log(
            "Transformed notifications for table:",
            transformedNotifications
          );

          setNotifications(transformedNotifications);
        } else {
          console.error("Failed to load notifications:", response.error);
          showError(response.error || "Failed to load notifications");
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error loading notifications:", error);
        showError("Failed to load notifications");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [page, limit]);

  // Ensure notifications is an array before filtering
  const filteredNotifications = Array.isArray(notifications)
    ? notifications.filter((notification) => {
        console.log("Filtering notification:", notification);
        return activeFilter === "all"
          ? true
          : notification.priority.toLowerCase() === activeFilter.toLowerCase();
      })
    : [];

  const handleFilterClick = (filter) => {
    console.log("Filter clicked:", filter);
    setActiveFilter(filter);
  };

  const handleViewDetails = async (row) => {
    try {
      console.log("Viewing details for notification:", row);

      // Mark notification as read if it's unread
      if (row.status === "Unread") {
        console.log("Marking notification as read:", row._id);
        const response = await markNotificationAsRead(row._id);

        if (response.success) {
          console.log("Successfully marked as read");
          // Update the notification in the list
          const updatedNotifications = notifications.map((notification) =>
            notification._id === row._id
              ? { ...notification, status: "Read" }
              : notification
          );
          setNotifications(updatedNotifications);
        } else {
          console.error("Failed to mark as read:", response.error);
          showError("Failed to mark notification as read");
        }
      }

      setSelectedNotification(row);
      setShowModal(true);
    } catch (error) {
      console.error("Error handling view details:", error);
      showError("Failed to open notification details");
    }
  };

  const handleStatusChange = async (notificationId, newStatus) => {
    try {
      console.log(
        "Updating status for notification:",
        notificationId,
        "to:",
        newStatus
      );
      setStatusLoading(true);

      const response = await updateNotificationStatus(
        notificationId,
        newStatus
      );
      console.log("Status update response:", response);

      if (response.success) {
        showSuccess(`Notification marked as ${newStatus}`);
        // Refresh notifications after status change
        const updatedResponse = await fetchCrewNotifications({ page, limit });
        if (updatedResponse.success && updatedResponse.data?.notifications) {
          const transformedNotifications =
            updatedResponse.data.notifications.map(transformNotification);
          setNotifications(transformedNotifications);
        }
      } else {
        showError(response.error || "Failed to update notification status");
      }
    } catch (error) {
      console.error("Error updating notification status:", error);
      showError("Failed to update notification status");
    } finally {
      setStatusLoading(false);
    }
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

        {loading ? (
          <div style={{ padding: "20px" }}>
            <TableSkeleton />
          </div>
        ) : (
          <NotificationTable
            notifications={filteredNotifications}
            selectedNotification={selectedNotification}
            setSelectedNotification={setSelectedNotification}
            handleViewDetails={handleViewDetails}
            handleStatusChange={handleStatusChange}
            statusLoading={statusLoading}
            isMobile={isMobile}
            isTablet={isTablet}
            loading={loading}
          />
        )}
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

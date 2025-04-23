import { useRef, useState, useEffect } from "react";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tooltip } from "primereact/tooltip";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { useMediaQuery } from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { Box, Typography, Card, CardContent, Chip } from "@mui/material";
import NotificationDetailsModal from "../../components/NotificationDetailsModal";
import sortNotification from "../../assets/images/crew/sortnotification.png";
import {
  getNotifications,
  updateNotificationStatus,
  updateComplaintStatus,
} from "../../services/notification/notificationService";
import { TableSkeleton } from "../../components/TableSkeleton";
import { useToast } from "../../components/Toast";
import React from "react";

// Mobile notification card component
const MobileNotificationCard = ({
  notification,
  handleViewDetails,
  handleStatusChange,
  statusLoading,
  theme,
}) => {
  const cellStatusMenu = useRef(null);

  const statusStyles = {
    "resolve & archive": { bg: "#ECFDF3", color: "#027A48" },
    flagged: { bg: "#EFF8FF", color: "#175CD3" },
    "escalate unresolved": { bg: "#FEF3F2", color: "#B42318" },
    "assign to a manager": { bg: "#F9F5FF", color: "#6941C6" },
    pending: { bg: "#FEF3F2", color: "#B42318" },
    "in-progress": { bg: "#FFFAEB", color: "#B54708" },
    resolved: { bg: "#ECFDF3", color: "#027A48" },
    dismissed: { bg: "#F2F4F7", color: "#344054" },
  };

  const style = statusStyles[notification.status.toLowerCase()] || {
    bg: "#F2F4F7",
    color: "#344054",
  };

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in-progress" },
    { label: "Resolved", value: "resolved" },
    { label: "Dismissed", value: "dismissed" },
    { label: "Flagged", value: "flagged" },
  ];

  const statusMenuItems = statusOptions.map((option) => ({
    label: option.label,
    command: () => handleStatusChange(notification._id, option.value),
  }));

  const priorityStyles = {
    high: { bg: "#ECFDF3", color: "#027A48" },
    medium: { bg: "#FFFAEB", color: "#B54708" },
    low: { bg: "#FEF3F2", color: "#B42318" },
  };

  const priorityStyle = priorityStyles[notification.priority.toLowerCase()] || {
    bg: "#F2F4F7",
    color: "#344054",
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        backgroundColor: "#F8FBFF",
        height: "100%",
        width: "100%",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1.5,
            alignItems: "center",
          }}
        >
          <Chip
            label={notification.priority}
            size="small"
            sx={{
              backgroundColor: priorityStyle.bg,
              color: priorityStyle.color,
              fontSize: "12px",
              height: "24px",
            }}
          />
          <Chip
            label={notification.status}
            size="small"
            sx={{
              backgroundColor: style.bg,
              color: style.color,
              fontSize: "12px",
              height: "24px",
            }}
          />
        </Box>

        <Typography
          variant="subtitle1"
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            mb: 1,
            color: "#101828",
          }}
        >
          {notification.type}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontSize: "13px",
            mb: 2,
            color: "#475467",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {notification.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: "12px",
              color: "#667085",
            }}
          >
            {new Date(notification.createdAt).toLocaleDateString()}
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              icon="pi pi-check-circle"
              className="p-button-rounded p-button-text p-button-sm"
              tooltip="Change Status"
              tooltipOptions={{ position: "top" }}
              onClick={(e) => cellStatusMenu.current.toggle(e)}
              disabled={statusLoading}
              style={{ padding: "6px" }}
            />
            <Menu
              model={statusMenuItems}
              popup
              ref={cellStatusMenu}
              id={`status-menu-${notification._id}`}
            />

            <Button
              label="View"
              className="p-button-outlined p-button-sm"
              style={{
                border: "1px solid #D0D5DD",
                color: "#344054",
                backgroundColor: "white",
                padding: "6px 12px",
                fontSize: "12px",
                borderRadius: "8px",
              }}
              onClick={() => handleViewDetails(notification)}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const StatusCell = React.memo(
  ({ rowData, handleStatusChange, statusLoading }) => {
    const cellStatusMenu = useRef(null);

    const statusStyles = {
      "resolve & archive": { bg: "#ECFDF3", color: "#027A48" },
      flagged: { bg: "#EFF8FF", color: "#175CD3" },
      "escalate unresolved": { bg: "#FEF3F2", color: "#B42318" },
      "assign to a manager": { bg: "#F9F5FF", color: "#6941C6" },
      pending: { bg: "#FEF3F2", color: "#B42318" },
      "in-progress": { bg: "#FFFAEB", color: "#B54708" },
      resolved: { bg: "#ECFDF3", color: "#027A48" },
      dismissed: { bg: "#F2F4F7", color: "#344054" },
    };

    const style = statusStyles[rowData.status.toLowerCase()] || {
      bg: "#F2F4F7",
      color: "#344054",
    };

    const statusOptions = [
      { label: "Pending", value: "pending" },
      { label: "In Progress", value: "in-progress" },
      { label: "Resolved", value: "resolved" },
      { label: "Dismissed", value: "dismissed" },
      { label: "Flagged", value: "flagged" },
    ];

    const statusMenuItems = statusOptions.map((option) => ({
      label: option.label,
      command: () => handleStatusChange(rowData._id, option.value),
    }));

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            backgroundColor: style.bg,
            color: style.color,
            padding: "2px 8px",
            borderRadius: "16px",
            fontSize: "12px",
            marginRight: "8px",
          }}
        >
          {rowData.status}
        </span>
        <Button
          icon="pi pi-check-circle"
          className="p-button-rounded p-button-text p-button-sm"
          tooltip="Change Status"
          tooltipOptions={{ position: "top" }}
          onClick={(e) => cellStatusMenu.current.toggle(e)}
          disabled={statusLoading}
        />
        <Menu
          model={statusMenuItems}
          popup
          ref={cellStatusMenu}
          id={`status-menu-${rowData._id}`}
        />
      </div>
    );
  }
);

export default function Notifications({ role }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const statusMenu = useRef(null);
  const toast = useRef(null);
  const { showSuccess, showError } = useToast();
  const menuRefs = useRef({});

  // Add responsive detection
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("sm", "md"));
  const { theme } = useMuiTheme();

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
        showToast(
          "error",
          "Error",
          response.error || "Failed to fetch notifications"
        );
      }
    } catch (err) {
      setError("Failed to fetch notifications");
      showToast(
        "error",
        "Error",
        "An error occurred while fetching notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  const showToast = (severity, summary, detail) => {
    if (toast.current) {
      toast.current.show({ severity, summary, detail, life: 3000 });
    }

    if (severity === "success" && showSuccess) {
      showSuccess(detail);
    } else if (severity === "error" && showError) {
      showError(detail);
    }
  };

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

  const handleStatusChange = async (notificationId, newStatus) => {
    setStatusLoading(true);
    try {
      const response = await updateComplaintStatus(notificationId, newStatus);
      if (response.success) {
        // Update the local state
        setNotifications(
          notifications.map((notification) =>
            notification._id === notificationId
              ? { ...notification, status: newStatus }
              : notification
          )
        );

        showToast(
          "success",
          "Success",
          `Notification status changed to ${newStatus}`
        );
      } else {
        showToast(
          "error",
          "Error",
          response.error || "Failed to update status"
        );
      }
    } catch (error) {
      showToast("error", "Error", "An error occurred while updating status");
    } finally {
      setStatusLoading(false);
    }
  };

  const priorityTemplate = (rowData) => {
    const bgColors = {
      high: { bg: "#ECFDF3", color: "#027A48" },
      medium: { bg: "#FFFAEB", color: "#B54708" },
      low: { bg: "#FEF3F2", color: "#B42318" },
    };

    const style = bgColors[rowData.priority.toLowerCase()] || {
      bg: "#F2F4F7",
      color: "#344054",
    };

    return (
      <span
        style={{
          backgroundColor: style.bg,
          color: style.color,
          padding: "2px 8px",
          borderRadius: "16px",
          fontSize: "12px",
        }}
      >
        {rowData.priority}
      </span>
    );
  };

  const statusTemplate = (rowData) => {
    return (
      <StatusCell
        rowData={rowData}
        handleStatusChange={handleStatusChange}
        statusLoading={statusLoading}
      />
    );
  };

  const actionTemplate = (rowData) => {
    return (
      <Button
        label="View Details"
        className="p-button-outlined"
        style={{
          border: "1px solid #D0D5DD",
          color: "#344054",
          backgroundColor: "white",
          padding: isTablet ? "6px 12px" : "8px 14px",
          fontSize: isTablet ? "12px" : "14px",
          borderRadius: "8px",
        }}
        onClick={() => handleViewDetails(rowData)}
      />
    );
  };

  if (loading) {
    return (
      <div className="notification-container">
        <div
          className="notification-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: isMobile ? "10px 15px" : "15px 20px",
          }}
        >
          <h3 style={{ fontSize: isMobile ? "18px" : "20px" }}>
            Notifications
          </h3>
          <Badge value="--" severity="danger" />
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
              disabled={true}
              style={{
                color: "black",
                padding: isMobile ? "6px 10px" : "8px 16px",
                fontSize: isMobile ? "12px" : "14px",
              }}
            />
          ))}
        </div>

        <TableSkeleton
          columns={[
            { width: isMobile ? "80px" : "100px" }, // Priority
            { width: isMobile ? "120px" : "150px" }, // Type
            { width: isMobile ? "200px" : "300px" }, // Description
            { width: isMobile ? "120px" : "150px" }, // Status
            { width: isMobile ? "100px" : "120px" }, // Action
          ]}
          rows={5}
          showHeader={true}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="notification-container">
        <div
          className="error-message"
          style={{ padding: "20px", textAlign: "center", color: "#dc3545" }}
        >
          Error: {error}
        </div>
      </div>
    );
  }

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

        {/* Mobile View */}
        {isMobile && (
          <Box sx={{ padding: "15px" }}>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <MobileNotificationCard
                  key={notification._id}
                  notification={notification}
                  handleViewDetails={handleViewDetails}
                  handleStatusChange={handleStatusChange}
                  statusLoading={statusLoading}
                  theme={theme}
                />
              ))
            ) : (
              <Typography
                sx={{
                  textAlign: "center",
                  color: "#667085",
                  padding: "20px 0",
                }}
              >
                No notifications found
              </Typography>
            )}
          </Box>
        )}

        {/* Desktop/Tablet View */}
        {!isMobile && (
          <div
            className="notification-table"
            style={{
              padding: isTablet ? "15px" : "20px",
              overflowX: "auto",
            }}
          >
            <DataTable
              value={filteredNotifications}
              responsiveLayout="scroll"
              style={{
                border: "1px solid #EAECF0",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Column
                field="priority"
                header="Priority"
                body={priorityTemplate}
                style={{ padding: isTablet ? "12px 16px" : "16px 24px" }}
                headerStyle={{
                  backgroundColor: "#F9FAFB",
                  color: "#667085",
                  fontWeight: "500",
                  fontSize: isTablet ? "11px" : "12px",
                  padding: isTablet ? "10px 16px" : "12px 24px",
                  borderBottom: "1px solid #EAECF0",
                }}
              />
              <Column
                field="type"
                header="Type"
                style={{ padding: isTablet ? "12px 16px" : "16px 24px" }}
                headerStyle={{
                  backgroundColor: "#F9FAFB",
                  color: "#667085",
                  fontWeight: "500",
                  fontSize: isTablet ? "11px" : "12px",
                  padding: isTablet ? "10px 16px" : "12px 24px",
                  borderBottom: "1px solid #EAECF0",
                }}
              />
              <Column
                field="description"
                header="Description"
                style={{
                  padding: isTablet ? "12px 16px" : "16px 24px",
                  maxWidth: isTablet ? "200px" : "300px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                headerStyle={{
                  backgroundColor: "#F9FAFB",
                  color: "#667085",
                  fontWeight: "500",
                  fontSize: isTablet ? "11px" : "12px",
                  padding: isTablet ? "10px 16px" : "12px 24px",
                  borderBottom: "1px solid #EAECF0",
                }}
              />
              <Column
                field="status"
                header="Status"
                body={statusTemplate}
                style={{ padding: isTablet ? "12px 16px" : "16px 24px" }}
                headerStyle={{
                  backgroundColor: "#F9FAFB",
                  color: "#667085",
                  fontWeight: "500",
                  fontSize: isTablet ? "11px" : "12px",
                  padding: isTablet ? "10px 16px" : "12px 24px",
                  borderBottom: "1px solid #EAECF0",
                }}
              />
              <Column
                header="Actions"
                body={actionTemplate}
                style={{ padding: isTablet ? "12px 16px" : "16px 24px" }}
                headerStyle={{
                  backgroundColor: "#F9FAFB",
                  color: "#667085",
                  fontWeight: "500",
                  fontSize: isTablet ? "11px" : "12px",
                  padding: isTablet ? "10px 16px" : "12px 24px",
                  borderBottom: "1px solid #EAECF0",
                }}
              />
            </DataTable>
          </div>
        )}
      </div>

      <NotificationDetailsModal
        visible={showModal}
        onHide={() => {
          setShowModal(false);
          // Refresh notifications after modal is closed to get updated status
          fetchNotifications();
        }}
        notificationData={selectedNotification}
      />
    </>
  );
}

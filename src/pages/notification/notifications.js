import { useRef, useState, useEffect } from "react";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tooltip } from "primereact/tooltip";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import NotificationDetailsModal from "../../components/NotificationDetailsModal";
import sortNotification from "../../assets/images/crew/sortnotification.png";
import {
  getNotifications,
  updateNotificationStatus,
  updateComplaintStatus,
} from "../../services/notification/notificationService";
import { TableSkeleton } from "../../components/TableSkeleton";
import { useToast } from "../../components/Toast";

export default function Notifications({ role }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const toast = useRef(null);
  const { showSuccess, showError } = useToast();
  const menuRefs = useRef({});

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
        showToast("error", "Error", response.error || "Failed to fetch notifications");
      }
    } catch (err) {
      setError("Failed to fetch notifications");
      showToast("error", "Error", "An error occurred while fetching notifications");
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

        showToast("success", "Success", `Notification status changed to ${newStatus}`);
      } else {
        showToast("error", "Error", response.error || "Failed to update status");
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
      { label: "Flagged", value: "flagged" },
    ];

    const statusMenuItems = statusOptions.map((option) => ({
      label: option.label,
      command: () => {
        console.log(`Changing notification ${rowData._id} status to ${option.value}`);
        handleStatusChange(rowData._id, option.value);
      },
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
          onClick={(e) => menuRefs.current[rowData._id]?.toggle(e)}
          disabled={statusLoading}
        />
        <Menu
          model={statusMenuItems}
          popup
          ref={(el) => menuRefs.current[rowData._id] = el}
          id={`status-menu-${rowData._id}`}
        />
      </div>
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
          padding: "8px 14px",
          fontSize: "14px",
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
          }}
        >
          <h3>Notifications</h3>
          <Badge value="--" severity="danger" />
        </div>

        <div className="notification-filter">
          {["all", "high", "medium", "low"].map((filter) => (
            <Button
              key={filter}
              label={
                filter.charAt(0).toUpperCase() + filter.slice(1) + " Priority"
              }
              className={`p-button-text ${
                activeFilter === filter ? "p-button-primary" : ""
              }`}
              disabled={true}
              style={{ color: "black" }}
            />
          ))}
        </div>

        <TableSkeleton
          columns={[
            { width: "100px" }, // Priority
            { width: "150px" }, // Type
            { width: "300px" }, // Description
            { width: "150px" }, // Status
            { width: "120px" }, // Action
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
      <div className="notification-container">
        <div
          className="notification-header"
          style={{ display: "flex", alignItems: "center" }}
        >
          <h3>Notifications</h3>
          <Badge
            value={notifications.length}
            severity="danger"
            style={{ marginLeft: "7px" }}
          />
        </div>

        <div className="notification-filter">
          {["all", "high", "medium", "low"].map((filter) => (
            <Button
              key={filter}
              label={
                filter.charAt(0).toUpperCase() + filter.slice(1) + " Priority"
              }
              className={`p-button-text ${
                activeFilter === filter ? "p-button-primary" : ""
              }`}
              onClick={() => handleFilterClick(filter)}
            />
          ))}
        </div>

        <div className="notification-table" style={{ padding: "20px" }}>
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
              style={{ padding: "16px 24px" }}
              headerStyle={{
                backgroundColor: "#F9FAFB",
                color: "#667085",
                fontWeight: "500",
                fontSize: "12px",
                padding: "12px 24px",
                borderBottom: "1px solid #EAECF0",
              }}
            />
            <Column
              field="type"
              header="Type"
              style={{ padding: "16px 24px" }}
              headerStyle={{
                backgroundColor: "#F9FAFB",
                color: "#667085",
                fontWeight: "500",
                fontSize: "12px",
                padding: "12px 24px",
                borderBottom: "1px solid #EAECF0",
              }}
            />
            <Column
              field="description"
              header="Description"
              style={{ padding: "16px 24px" }}
              headerStyle={{
                backgroundColor: "#F9FAFB",
                color: "#667085",
                fontWeight: "500",
                fontSize: "12px",
                padding: "12px 24px",
                borderBottom: "1px solid #EAECF0",
              }}
            />
            <Column
              field="status"
              header="Status"
              body={statusTemplate}
              style={{ padding: "16px 24px" }}
              headerStyle={{
                backgroundColor: "#F9FAFB",
                color: "#667085",
                fontWeight: "500",
                fontSize: "12px",
                padding: "12px 24px",
                borderBottom: "1px solid #EAECF0",
              }}
            />
            <Column
              header="Actions"
              body={actionTemplate}
              style={{ padding: "16px 24px" }}
              headerStyle={{
                backgroundColor: "#F9FAFB",
                color: "#667085",
                fontWeight: "500",
                fontSize: "12px",
                padding: "12px 24px",
                borderBottom: "1px solid #EAECF0",
              }}
            />
          </DataTable>
        </div>
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

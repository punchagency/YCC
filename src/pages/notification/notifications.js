"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Badge } from "primereact/badge"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Menu } from "primereact/menu"
import { Toast } from "primereact/toast"
import { useMediaQuery } from "@mui/material"
import { useTheme as useMuiTheme } from "@mui/material/styles"
import { Box, Typography, Card, CardContent, Chip } from "@mui/material"
import NotificationDetailsModal from "../../components/NotificationDetailsModal"
import { getNotifications, updateComplaintStatus } from "../../services/notification/notificationService"
import { TableSkeleton } from "../../components/TableSkeleton"
import { useToast } from "../../components/Toast"
import React from "react"

// Mobile notification card component
const MobileNotificationCard = ({ notification, handleViewDetails, handleStatusChange, statusLoading, theme }) => {
  const cellStatusMenu = useRef(null)

  const statusStyles = {
    read: { bg: "#ECFDF3", color: "#027A48" },
    unread: { bg: "#FEF3F2", color: "#B42318" },
  }

  const style = statusStyles[notification?.read ? "read" : "unread"] || {
    bg: "#F2F4F7",
    color: "#344054",
  }

  const priorityStyles = {
    high: { bg: "#ECFDF3", color: "#027A48" },
    medium: { bg: "#FFFAEB", color: "#B54708" },
    low: { bg: "#FEF3F2", color: "#B42318" },
  }

  const priorityStyle = priorityStyles[(notification?.priority || "").toLowerCase()] || {
    bg: "#F2F4F7",
    color: "#344054",
  }

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
            label={notification?.priority || "N/A"}
            size="small"
            sx={{
              backgroundColor: priorityStyle.bg,
              color: priorityStyle.color,
              fontSize: "12px",
              height: "24px",
            }}
          />
          <Chip
            label={notification?.read ? "Read" : "Unread"}
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
          {notification?.type || "N/A"}
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
          {notification?.message || "No message available"}
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
            {notification?.createdAt ? new Date(notification.createdAt).toLocaleDateString() : "N/A"}
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
              model={[
                {
                  label: "Mark as Read",
                  command: () => handleStatusChange(notification._id, "read"),
                },
                {
                  label: "Mark as Unread",
                  command: () => handleStatusChange(notification._id, "unread"),
                },
              ]}
              popup
              ref={cellStatusMenu}
              id={`status-menu-${notification?._id || Math.random()}`}
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
  )
}

const StatusCell = React.memo(({ rowData, handleStatusChange, statusLoading }) => {
  const cellStatusMenu = useRef(null)

  const statusStyles = {
    "resolve & archive": { bg: "#ECFDF3", color: "#027A48" },
    flagged: { bg: "#EFF8FF", color: "#175CD3" },
    "escalate unresolved": { bg: "#FEF3F2", color: "#B42318" },
    "assign to a manager": { bg: "#F9F5FF", color: "#6941C6" },
    pending: { bg: "#FEF3F2", color: "#B42318" },
    "in-progress": { bg: "#FFFAEB", color: "#B54708" },
    resolved: { bg: "#ECFDF3", color: "#027A48" },
    dismissed: { bg: "#F2F4F7", color: "#344054" },
  }

  const style = statusStyles[rowData.status.toLowerCase()] || {
    bg: "#F2F4F7",
    color: "#344054",
  }

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in-progress" },
    { label: "Resolved", value: "resolved" },
    { label: "Dismissed", value: "dismissed" },
    { label: "Flagged", value: "flagged" },
  ]

  const statusMenuItems = statusOptions.map((option) => ({
    label: option.label,
    command: () => handleStatusChange(rowData._id, option.value),
  }))

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
      <Menu model={statusMenuItems} popup ref={cellStatusMenu} id={`status-menu-${rowData._id}`} />
    </div>
  )
})

// Modern Filter Component
const NotificationFilter = ({ activeFilter, onFilterChange, isMobile }) => {
  const filters = [
    { key: "all", label: "All", icon: "pi pi-list" },
    { key: "high", label: "High Priority", icon: "pi pi-exclamation-triangle", color: "#DC2626" },
    { key: "medium", label: "Medium Priority", icon: "pi pi-minus", color: "#D97706" },
    { key: "low", label: "Low Priority", icon: "pi pi-circle", color: "#059669" },
  ]

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        borderRadius: "12px",
        padding: isMobile ? "12px" : "16px",
        margin: isMobile ? "0 16px 20px 16px" : "0 20px 24px 20px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        border: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: isMobile ? "8px" : "12px",
          overflowX: "auto",
          paddingBottom: "4px",
        }}
      >
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key
          return (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: isMobile ? "8px 12px" : "10px 16px",
                borderRadius: "8px",
                border: isActive ? "2px solid #0387D9" : "1px solid #e2e8f0",
                backgroundColor: isActive ? "#0387D9" : "#ffffff",
                color: isActive ? "#ffffff" : "#374151",
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: isActive ? "600" : "500",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                whiteSpace: "nowrap",
                flexShrink: 0,
                boxShadow: isActive ? "0 4px 12px rgba(3, 135, 217, 0.3)" : "0 1px 2px rgba(0, 0, 0, 0.05)",
                transform: isActive ? "translateY(-1px)" : "translateY(0)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = "#f8fafc"
                  e.target.style.borderColor = "#cbd5e1"
                  e.target.style.transform = "translateY(-1px)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = "#ffffff"
                  e.target.style.borderColor = "#e2e8f0"
                  e.target.style.transform = "translateY(0)"
                }
              }}
            >
              <i
                className={filter.icon}
                style={{
                  fontSize: isMobile ? "12px" : "14px",
                  color: isActive ? "#ffffff" : filter.color || "#6b7280",
                }}
              />
              <span>
                {isMobile && filter.key !== "all"
                  ? filter.key.charAt(0).toUpperCase() + filter.key.slice(1)
                  : filter.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Notifications({ role }) {
  const [showModal, setShowModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const toast = useRef(null)
  const { showSuccess, showError } = useToast()

  // Add responsive detection
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("sm", "md"))
  const { theme } = useMuiTheme()

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      console.log("Fetching notifications with page:", page, "limit:", limit, "filter:", activeFilter)

      const response = await getNotifications({
        page,
        limit,
        priority: activeFilter !== "all" ? activeFilter : undefined,
      })

      console.log("Notifications response:", response)

      if (response.success) {
        setNotifications(response.data)
        setTotalPages(response.pagination.pages)
        setTotalItems(response.pagination.total)
        setError(null)
      } else {
        setError(response.error)
        showError(response.error || "Failed to fetch notifications")
      }
    } catch (err) {
      console.error("Error loading notifications:", err)
      setError("Failed to fetch notifications")
      showError("Failed to fetch notifications")
    } finally {
      setLoading(false)
    }
  }, [page, limit, activeFilter, showError])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleFilterClick = (filter) => {
    console.log("Filter clicked:", filter)
    setActiveFilter(filter)
    setPage(1) // Reset to first page when filter changes
  }

  const handleViewDetails = (notification) => {
    console.log("Viewing details for notification:", notification)
    setSelectedNotification(notification)
    setShowModal(true)
  }

  const handleStatusChange = async (notificationId, newStatus) => {
    setStatusLoading(true)
    try {
      const response = await updateComplaintStatus(notificationId, newStatus)
      if (response.success) {
        // Update the local state
        setNotifications(
          notifications.map((notification) =>
            notification._id === notificationId ? { ...notification, read: newStatus === "read" } : notification,
          ),
        )

        showSuccess(`Notification marked as ${newStatus}`)
      } else {
        showError(response.error || "Failed to update status")
      }
    } catch (error) {
      showError("An error occurred while updating status")
    } finally {
      setStatusLoading(false)
    }
  }

  const priorityTemplate = (rowData) => {
    const bgColors = {
      high: { bg: "#ECFDF3", color: "#027A48" },
      medium: { bg: "#FFFAEB", color: "#B54708" },
      low: { bg: "#FEF3F2", color: "#B42318" },
    }

    const style = bgColors[rowData.priority.toLowerCase()] || {
      bg: "#F2F4F7",
      color: "#344054",
    }

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
    )
  }

  const statusTemplate = (rowData) => {
    return (
      <div style={{ position: "relative" }}>
        <span
          style={{
            backgroundColor: rowData.read ? "#ECFDF3" : "#FEF3F2",
            color: rowData.read ? "#027A48" : "#B42318",
            padding: "2px 8px",
            borderRadius: "16px",
            fontSize: "12px",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {rowData.read ? "Read" : "Unread"}
        </span>
      </div>
    )
  }

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
    )
  }

  if (loading) {
    return (
      <div className="notification-container" style={{ background: "#F8FBFF", minHeight: "100vh", width: "100%" }}>
        <div
          className="notification-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: isMobile ? "16px 20px" : "20px 24px",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <h3
            style={{
              fontSize: isMobile ? "20px" : "24px",
              fontWeight: "700",
              color: "#1f2937",
              margin: 0,
            }}
          >
            Notifications
          </h3>
          <Badge value="--" severity="danger" />
        </div>

        <NotificationFilter activeFilter={activeFilter} onFilterChange={handleFilterClick} isMobile={isMobile} />

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
    )
  }

  if (error) {
    return (
      <div className="notification-container">
        <div className="error-message" style={{ padding: "20px", textAlign: "center", color: "#dc3545" }}>
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <>
      <Toast ref={toast} />
      <div className="notification-container" style={{ background: "#F8FBFF", minHeight: "100vh", width: "100%" }}>
        <div
          className="notification-header"
          style={{
            display: "flex",
            alignItems: "center",
            padding: isMobile ? "16px 20px" : "20px 24px",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <h3
            style={{
              fontSize: isMobile ? "20px" : "24px",
              fontWeight: "700",
              color: "#1f2937",
              margin: 0,
            }}
          >
            Notifications
          </h3>
          <Badge value={notifications.length} severity="danger" style={{ marginLeft: "12px" }} />
        </div>

        <NotificationFilter activeFilter={activeFilter} onFilterChange={handleFilterClick} isMobile={isMobile} />

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
              value={notifications}
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
                field="message"
                header="Message"
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
                field="read"
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

            {/* Pagination */}
            <div
              className="pagination"
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ color: "#667085" }}>
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalItems)} of {totalItems} items
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  icon="pi pi-chevron-left"
                  className="p-button-text"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                />
                <Button
                  icon="pi pi-chevron-right"
                  className="p-button-text"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Mobile View */}
        {isMobile && (
          <Box sx={{ padding: "15px" }}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
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
      </div>

      <NotificationDetailsModal
        visible={showModal}
        onHide={() => {
          setShowModal(false)
          fetchNotifications()
        }}
        notificationData={selectedNotification}
      />
    </>
  )
}

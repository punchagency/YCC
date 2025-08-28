"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { useMediaQuery } from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { Box, Typography, Card, CardContent, Chip } from "@mui/material";
import NotificationDetailsModal from "../../components/NotificationDetailsModal";
import {
  getNotifications,
  markNotificationAsRead,
} from "../../services/notification/notificationService";
import NotificationsSkeleton from "../../components/NotificationsSkeleton";
import { useToast } from "../../components/Toast";
import { Pagination } from "../../components/pagination";
import React from "react";
import { useOutletContext } from "react-router-dom";

// Mobile notification card component
const MobileNotificationCard = ({
  notification,
  handleViewDetails,
  handleStatusChange,
  statusLoading,
  theme,
}) => {
  const cellStatusMenu = useRef(null);

  // Add click outside handler for mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      try {
        if (cellStatusMenu.current && cellStatusMenu.current.getElement) {
          const menuElement = cellStatusMenu.current.getElement();
          if (menuElement && !menuElement.contains(event.target)) {
            cellStatusMenu.current.hide();
          }
        }
      } catch (error) {
        // Silently handle any errors to prevent ugly error messages
        console.warn("Menu close error:", error);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const statusStyles = {
    read: { bg: "#ECFDF3", color: "#027A48" },
    unread: { bg: "#FEF3F2", color: "#B42318" },
  };

  const style = statusStyles[notification?.read ? "read" : "unread"] || {
    bg: "#F2F4F7",
    color: "#344054",
  };

  const priorityStyles = {
    high: { bg: "#ECFDF3", color: "#027A48" },
    medium: { bg: "#FFFAEB", color: "#B54708" },
    low: { bg: "#FEF3F2", color: "#B42318" },
  };

  const priorityStyle = priorityStyles[
    (notification?.priority || "").toLowerCase()
  ] || {
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
        // height: "100%",
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
          {notification?.title || "N/A"}
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
            {notification?.createdAt
              ? new Date(notification.createdAt).toLocaleDateString()
              : "N/A"}
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              label="View"
              className="p-button-outlined p-button-sm mobile-view-details-btn"
              style={{
                border: "1px solid #D0D5DD",
                color: "#344054",
                backgroundColor: "white",
                padding: "6px 12px",
                fontSize: "12px",
                borderRadius: "8px",
                transition: "background 0.2s, border-color 0.2s, color 0.2s",
              }}
              onClick={() => handleViewDetails(notification)}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// const StatusCell = React.memo(
//   ({ rowData, handleStatusChange, statusLoading }) => {
//     const cellStatusMenu = useRef(null);

//     // Add click outside handler for desktop menu
//     useEffect(() => {
//       const handleClickOutside = (event) => {
//         try {
//           if (cellStatusMenu.current && cellStatusMenu.current.getElement) {
//             const menuElement = cellStatusMenu.current.getElement();
//             if (menuElement && !menuElement.contains(event.target)) {
//               cellStatusMenu.current.hide();
//             }
//           }
//         } catch (error) {
//           // Silently handle any errors to prevent ugly error messages
//           console.warn("Menu close error:", error);
//         }
//       };

//       document.addEventListener("mousedown", handleClickOutside);
//       return () => {
//         document.removeEventListener("mousedown", handleClickOutside);
//       };
//     }, []);

//     const statusOptions = [{ label: "Mark as Read", value: "read" }];

//     const statusMenuItems = statusOptions.map((option) => ({
//       label: option.label,
//       command: () => handleStatusChange(rowData._id, option.value),
//     }));

//     return (
//       <div style={{ display: "flex", alignItems: "center" }}>
//         <span
//           style={{
//             backgroundColor: rowData.read ? "#ECFDF3" : "#FEF3F2",
//             color: rowData.read ? "#027A48" : "#B42318",
//             padding: "2px 8px",
//             borderRadius: "16px",
//             fontSize: "12px",
//             display: "inline-flex",
//             alignItems: "center",
//             gap: "4px",
//           }}
//         >
//           {rowData.read ? "Read" : "Unread"}
//         </span>
//         <Button
//           icon="pi pi-check-circle"
//           className="p-button-rounded p-button-text p-button-sm"
//           tooltip="Change Status"
//           tooltipOptions={{ position: "top" }}
//           onClick={(e) => cellStatusMenu.current.toggle(e)}
//           disabled={statusLoading}
//         />
//         <Menu
//           model={statusMenuItems}
//           popup
//           ref={cellStatusMenu}
//           id={`status-menu-${rowData._id}`}
//         />
//       </div>
//     );
//   }
// );

// Modern Compact Filter Component with Dropdowns
const NotificationFilter = ({
  activeFilter,
  activeStatusFilter,
  onFilterChange,
  onStatusFilterChange,
  isMobile,
}) => {
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const priorityFilters = [
    { key: "all", label: "All Priorities", icon: "pi pi-list" },
    {
      key: "high",
      label: "High Priority",
      icon: "pi pi-exclamation-triangle",
      color: "#DC2626",
    },
    {
      key: "medium",
      label: "Medium Priority",
      icon: "pi pi-minus",
      color: "#D97706",
    },
    {
      key: "low",
      label: "Low Priority",
      icon: "pi pi-circle",
      color: "#059669",
    },
  ];

  const statusFilters = [
    { key: "all", label: "All Status", icon: "pi pi-list" },
    { key: "unread", label: "Unread", icon: "pi pi-circle", color: "#DC2626" },
    {
      key: "read",
      label: "Read",
      icon: "pi pi-check-circle",
      color: "#059669",
    },
  ];

  const getActiveFilterLabel = (filters, activeKey) => {
    const filter = filters.find((f) => f.key === activeKey);
    return filter ? filter.label : "Select...";
  };

  const getActiveFilterIcon = (filters, activeKey) => {
    const filter = filters.find((f) => f.key === activeKey);
    return filter ? filter.icon : "pi pi-list";
  };

  const getActiveFilterColor = (filters, activeKey) => {
    const filter = filters.find((f) => f.key === activeKey);
    return filter ? filter.color : "#6b7280";
  };

  // Custom click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".custom-dropdown")) {
        setPriorityDropdownOpen(false);
        setStatusDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePrioritySelect = (key) => {
    onFilterChange(key);
    setPriorityDropdownOpen(false);
  };

  const handleStatusSelect = (key) => {
    onStatusFilterChange(key);
    setStatusDropdownOpen(false);
  };

  return (
    <>
      <style>
        {`
          .filter-dropdown-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: ${isMobile ? "10px 14px" : "12px 16px"};
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            color: #374151;
            font-size: ${isMobile ? "13px" : "14px"};
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            min-width: ${isMobile ? "140px" : "160px"};
            justify-content: space-between;
          }

          .filter-dropdown-button:hover {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-color: #cbd5e1;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .filter-dropdown-button:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .filter-dropdown-content {
            display: flex;
            align-items: center;
            gap: 6px;
            flex: 1;
          }

          .filter-dropdown-chevron {
            font-size: 12px;
            color: #6b7280;
            transition: transform 0.2s ease;
          }

          .filter-dropdown-button:hover .filter-dropdown-chevron {
            color: #374151;
          }

          .custom-dropdown {
            position: relative;
          }

          .custom-dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05);
            z-index: 1000;
            margin-top: 4px;
            padding: 4px;
            min-width: 100%;
          }

          .custom-dropdown-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #374151;
            font-size: ${isMobile ? "13px" : "14px"};
          }

          .custom-dropdown-item:hover {
            background-color: #f8fafc;
          }

          .custom-dropdown-item.active {
            background-color: #eff6ff;
            color: #1d4ed8;
            font-weight: 600;
          }

          .custom-dropdown-item i {
            font-size: ${isMobile ? "12px" : "14px"};
          }
        `}
      </style>

      <div
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          borderRadius: "12px",
          padding: isMobile ? "16px" : "20px",
          margin: isMobile ? "0 16px 6px 16px" : "0 20px 4px 20px",
          boxShadow:
            "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "12px" : "16px",
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          {/* Filter Label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#374151",
              fontWeight: "600",
              fontSize: isMobile ? "14px" : "16px",
              minWidth: "fit-content",
            }}
          >
            <i
              className="pi pi-filter"
              style={{ fontSize: isMobile ? "14px" : "16px", color: "#6b7280" }}
            />
            <span>Filters</span>
          </div>

          {/* Priority Filter Dropdown */}
          <div className="custom-dropdown">
            <button
              className="filter-dropdown-button"
              onClick={() => setPriorityDropdownOpen(!priorityDropdownOpen)}
            >
              <div className="filter-dropdown-content">
                <i
                  className={getActiveFilterIcon(priorityFilters, activeFilter)}
                  style={{
                    fontSize: isMobile ? "12px" : "14px",
                    color: getActiveFilterColor(priorityFilters, activeFilter),
                  }}
                />
                <span>
                  {getActiveFilterLabel(priorityFilters, activeFilter)}
                </span>
              </div>
              <i
                className={`pi pi-chevron-down filter-dropdown-chevron ${
                  priorityDropdownOpen ? "rotate-180" : ""
                }`}
                style={{
                  transform: priorityDropdownOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </button>
            {priorityDropdownOpen && (
              <div className="custom-dropdown-menu">
                {priorityFilters.map((filter) => (
                  <div
                    key={filter.key}
                    className={`custom-dropdown-item ${
                      activeFilter === filter.key ? "active" : ""
                    }`}
                    onClick={() => handlePrioritySelect(filter.key)}
                  >
                    <i
                      className={filter.icon}
                      style={{ color: filter.color || "#6b7280" }}
                    />
                    <span>{filter.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="custom-dropdown">
            <button
              className="filter-dropdown-button"
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            >
              <div className="filter-dropdown-content">
                <i
                  className={getActiveFilterIcon(
                    statusFilters,
                    activeStatusFilter
                  )}
                  style={{
                    fontSize: isMobile ? "12px" : "14px",
                    color: getActiveFilterColor(
                      statusFilters,
                      activeStatusFilter
                    ),
                  }}
                />
                <span>
                  {getActiveFilterLabel(statusFilters, activeStatusFilter)}
                </span>
              </div>
              <i
                className={`pi pi-chevron-down filter-dropdown-chevron ${
                  statusDropdownOpen ? "rotate-180" : ""
                }`}
                style={{
                  transform: statusDropdownOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </button>
            {statusDropdownOpen && (
              <div className="custom-dropdown-menu">
                {statusFilters.map((filter) => (
                  <div
                    key={filter.key}
                    className={`custom-dropdown-item ${
                      activeStatusFilter === filter.key ? "active" : ""
                    }`}
                    onClick={() => handleStatusSelect(filter.key)}
                  >
                    <i
                      className={filter.icon}
                      style={{ color: filter.color || "#6b7280" }}
                    />
                    <span>{filter.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Filters Indicator */}
          {(activeFilter !== "all" || activeStatusFilter !== "all") && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginLeft: isMobile ? "0" : "auto",
                flexWrap: "wrap",
              }}
            >
              {activeFilter !== "all" && (
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #0387D9 0%, #0369A1 100%)",
                    color: "#ffffff",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {activeFilter}
                  <button
                    onClick={() => onFilterChange("all")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ffffff",
                      cursor: "pointer",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <i className="pi pi-times" style={{ fontSize: "10px" }} />
                  </button>
                </span>
              )}
              {activeStatusFilter !== "all" && (
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    color: "#ffffff",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {activeStatusFilter}
                  <button
                    onClick={() => onStatusFilterChange("all")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ffffff",
                      cursor: "pointer",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <i className="pi pi-times" style={{ fontSize: "10px" }} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default function Notifications({ role }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const toast = useRef(null);
  const { showSuccess, showError } = useToast();

  // Add responsive detection
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("sm", "md"));
  const { theme } = useMuiTheme();
  const { setPageTitle } = useOutletContext() || {};

  useEffect(() => {
    if (setPageTitle) setPageTitle("Notifications");
  }, [setPageTitle]);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getNotifications({
        page,
        limit,
        priority: activeFilter !== "all" ? activeFilter : undefined,
        status: activeStatusFilter !== "all" ? activeStatusFilter : undefined,
      });

      if (response.success) {
        setNotifications(response.data);
        setTotalPages(response.pagination.pages);
        setTotalItems(response.pagination.total);
        setError(null);
      } else {
        setError(response.error);
        showError(response.error || "Failed to fetch notifications");
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError("Failed to fetch notifications");
      showError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, [page, limit, activeFilter, activeStatusFilter, showError]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setPage(1); // Reset to first page when filter changes
  };

  const handleStatusFilterClick = (filter) => {
    setActiveStatusFilter(filter);
    setPage(1); // Reset to first page when status filter changes
  };

  const handleViewDetails = async (notification) => {
    // If not read, optimistically update selectedNotification to read: true
    if (!notification.read) {
      setSelectedNotification({ ...notification, read: true });
    } else {
      setSelectedNotification(notification);
    }
    setShowModal(true);

    // Auto-mark as read when viewing details (if not already read)
    if (!notification.read) {
      try {
        const response = await markNotificationAsRead(notification._id);
        if (response.success) {
          // Update the local state
          setNotifications(
            notifications.map((notif) =>
              notif._id === notification._id ? { ...notif, read: true } : notif
            )
          );
        }
      } catch (error) {
        // Silently handle errors - don't show error for auto-read
        // console.warn("Auto-read error:", error);
      }
    }
  };

  const handleStatusChange = async (notificationId, newStatus) => {
    setStatusLoading(true);
    try {
      // For now, we only support marking as read since that's what the backend supports
      // The newStatus parameter is ignored since the backend only marks as read
      const response = await markNotificationAsRead(notificationId);
      if (response.success) {
        // Update the local state
        setNotifications(
          notifications.map((notification) =>
            notification._id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );

        showSuccess("Notification marked as read");
      } else {
        showError(response.error || "Failed to update status");
      }
    } catch (error) {
      showError("An error occurred while updating status");
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
    );
  };

  const actionTemplate = (rowData) => {
    return (
      <Button
        label="View Details"
        className="p-button-outlined desktop-view-details-btn"
        style={{
          border: "1px solid #D0D5DD",
          color: "#344054",
          backgroundColor: "white",
          padding: isTablet ? "6px 12px" : "8px 14px",
          fontSize: isTablet ? "12px" : "14px",
          borderRadius: "8px",
          transition: "background 0.2s, border-color 0.2s, color 0.2s",
        }}
        onClick={() => handleViewDetails(rowData)}
      />
    );
  };

  // --- Filtering logic ---
  const filteredNotifications = notifications.filter((notif) => {
    let priorityMatch = true;
    let statusMatch = true;
    if (activeFilter !== "all") {
      priorityMatch =
        notif.priority && notif.priority.toLowerCase() === activeFilter;
    }
    if (activeStatusFilter !== "all") {
      statusMatch = activeStatusFilter === "read" ? notif.read : !notif.read;
    }
    return priorityMatch && statusMatch;
  });

  if (loading) {
    return (
      <div
        className="flex flex-column bg-[#F8FBFF] h-auto min-h-screen overflow-visible w-full max-w-full"
        style={{
          paddingTop: isMobile ? "67px" : "0",
        }}
      >
        <NotificationsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="notification-container"
        style={{
          paddingTop: isMobile ? "67px" : "0",
        }}
      >
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
        className={
          `flex flex-column bg-[#F8FBFF] h-auto w-full max-w-full` +
          (isMobile ? "" : " notification-desktop-container")
        }
        style={{
          paddingTop: isMobile ? "0" : "0",
          ...(isMobile ? {} : { overflow: "unset" }),
        }}
      >
        <div className="mb-4"></div>

        <NotificationFilter
          activeFilter={activeFilter}
          activeStatusFilter={activeStatusFilter}
          onFilterChange={handleFilterClick}
          onStatusFilterChange={handleStatusFilterClick}
          isMobile={isMobile}
        />

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
                field="title"
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

            {/* Use the new Pagination component */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={limit}
              onPageChange={setPage}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          </div>
        )}

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

            {/* Add pagination to mobile view */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={limit}
              onPageChange={setPage}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          </Box>
        )}
      </div>

      <NotificationDetailsModal
        visible={showModal}
        onHide={() => {
          setShowModal(false);
          fetchNotifications();
        }}
        notificationData={selectedNotification}
      />
    </>
  );
}

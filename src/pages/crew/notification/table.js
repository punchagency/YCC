import React, { useState } from "react";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useMediaQuery } from "@mui/material";
import { Box, Typography, Card, CardContent, Chip } from "@mui/material";
import sort from "../../../assets/images/crew/sort.png";
import eyesIn from "../../../assets/images/crew/eyes-in.png";
import editLogo from "../../../assets/images/crew/editLogo.png";
import deleteLogo from "../../../assets/images/crew/deleteLogo.png";
import "../inventory/inventory.css"; // Reuse the inventory CSS

// Mobile notification card component
const MobileNotificationCard = ({ notification, handleViewDetails }) => {
  return (
    <Card
      sx={{
        mb: 2,
        boxShadow:
          "0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)",
        borderRadius: "8px",
        border: "1px solid #EAECF0",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Chip
            label={notification.priority}
            size="small"
            sx={{
              backgroundColor:
                notification.priority.toLowerCase() === "high"
                  ? "#ECFDF3"
                  : notification.priority.toLowerCase() === "medium"
                  ? "#FFFAEB"
                  : "#FEF3F2",
              color:
                notification.priority.toLowerCase() === "high"
                  ? "#027A48"
                  : notification.priority.toLowerCase() === "medium"
                  ? "#B54708"
                  : "#B42318",
              fontSize: "12px",
              fontWeight: "500",
              borderRadius: "16px",
              height: "24px",
            }}
          />

          <Chip
            label={notification.status}
            size="small"
            sx={{
              backgroundColor:
                notification.status === "Resolved"
                  ? "#ECFDF3"
                  : notification.status === "In Progress"
                  ? "#F8F9FC"
                  : "#FEF3F2",
              color:
                notification.status === "Resolved"
                  ? "#027A48"
                  : notification.status === "In Progress"
                  ? "#363F72"
                  : "#B42318",
              fontSize: "12px",
              fontWeight: "500",
              borderRadius: "16px",
              height: "24px",
            }}
          />
        </Box>

        <Typography
          variant="body2"
          sx={{ mb: 1, fontWeight: "500", color: "#101828" }}
        >
          {notification.type}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 2,
            color: "#667085",
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
          <Typography variant="caption" sx={{ color: "#667085" }}>
            {new Date(notification.createdAt).toLocaleDateString()}
          </Typography>

          <Button
            label="View Details"
            className="p-button-outlined"
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
      </CardContent>
    </Card>
  );
};

// Status Cell component
const StatusCell = ({ rowData }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return { bg: "#ECFDF3", color: "#027A48" };
      case "In Progress":
        return { bg: "#F8F9FC", color: "#363F72" };
      case "Pending":
        return { bg: "#FEF3F2", color: "#B42318" };
      default:
        return { bg: "#F2F4F7", color: "#344054" };
    }
  };

  const style = getStatusStyle(rowData.status);

  return (
    <div style={{ position: "relative" }}>
      <span
        style={{
          backgroundColor: style.bg,
          color: style.color,
          padding: "2px 8px",
          borderRadius: "16px",
          fontSize: "12px",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {rowData.status}
      </span>
    </div>
  );
};

const NotificationTable = ({
  handleViewDetails,
  isMobile,
  isTablet,
  filteredNotifications,
}) => {
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
    return <StatusCell rowData={rowData} />;
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

  return (
    <>
      {/* Mobile View */}
      {isMobile && (
        <Box sx={{ padding: "15px" }}>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <MobileNotificationCard
                key={notification._id}
                notification={notification}
                handleViewDetails={handleViewDetails}
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
            overflowX: "hidden", // Hide scrollbar
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
    </>
  );
};

export default NotificationTable;

import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import profilenoti from "../../../../assets/images/crew/profilenoti.png";


export const EventCard = ({
  title,
  start,
  location,
  description,
  event,
  onUpdate,
  onDelete,
  onAddGuest,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    handleMenuClose();
    onUpdate(event);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(event);
  };

  const handleAddGuest = () => {
    handleMenuClose();
    onAddGuest(event);
  };

  // Helper function to format the date/time
  const formatEventTime = (startDate) => {
    const date = new Date(startDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Helper function to format location
  const formatLocation = (location) => {
    const locationMap = {
      zoom: "Virtual - Zoom Meeting",
      "google-meet": "Virtual - Google Meet",
      "ms-teams": "Virtual - Microsoft Teams",
      "in-person": "In Person Meeting",
    };
    return locationMap[location] || location;
  };

  // Add this helper function to get guest count
  const getGuestCount = (event) => {
    const emailCount = event.guestEmails?.length || 0;
    const guestCount = event.guests?.length || 0;
    return emailCount + guestCount;
  };

  return (
    <div
      className="profiles"
      style={{
        display: "flex",
        alignItems: "flex-start",
        padding: "10px 0",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 4px 12px rgba(0,0,0,0.1)"
          : "0 2px 4px rgba(0,0,0,0.05)",
        borderRadius: "8px",
        backgroundColor: isHovered ? "#f8f9fa" : "transparent",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ marginRight: "12px" }}>
        <img
          src={profilenoti}
          alt="profile"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            transition: "transform 0.3s ease",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
        />
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h3
            style={{
              margin: "0 0 5px 0",
              fontSize: "16px",
              color: isHovered ? "#0387D9" : "#333",
              transition: "color 0.3s ease",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: "0 0 5px 0",
              color: "#666",
              transition: "color 0.3s ease",
            }}
          >
            {formatEventTime(start)}
          </p>
          <p
            style={{
              margin: 0,
              color: "#666",
              transition: "color 0.3s ease",
            }}
          >
            {formatLocation(location)}
          </p>
          {description && (
            <p
              style={{
                margin: "5px 0 0 0",
                color: "#666",
                transition: "color 0.3s ease",
              }}
            >
              {description}
            </p>
          )}

          {/* Add this to show guest count */}
          {getGuestCount(event) > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
                color: "#0387D9",
                fontSize: "12px",
                transition: "all 0.3s ease",
                opacity: isHovered ? 1 : 0.8,
              }}
            >
              <i className="pi pi-users" style={{ marginRight: "5px" }}></i>
              <span>
                {getGuestCount(event)}{" "}
                {getGuestCount(event) === 1 ? "guest" : "guests"}
              </span>
            </div>
          )}
        </div>
        <div className="event-actions">
          <MoreVertIcon
            fontSize="small"
            onClick={handleMenuClick}
            style={{
              color: "#667085",
              cursor: "pointer",
              transition: "transform 0.3s ease",
              transform: isHovered ? "scale(1.2)" : "scale(1)",
            }}
          />
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleUpdate}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Update Event</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete Event</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleAddGuest}>
              <ListItemIcon>
                <PersonAddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Add Guest</ListItemText>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};
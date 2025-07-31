import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import three from "../../../../assets/images/crew/three.png";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";

export const DayEventsModal = ({
  visible,
  onHide,
  events,
  selectedDate,
  onUpdate,
  onDelete,
  onAddGuest,
}) => {
  const [anchorEls, setAnchorEls] = useState({});

  const handleModalHide = () => {
    setAnchorEls({});
    onHide();
  };

  const handleMenuClick = (index, event) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEls(prev => ({ ...prev, [index]: event.currentTarget }));
  };

  const handleMenuClose = (index) => {
    setAnchorEls(prev => ({ ...prev, [index]: null }));
  };

  const handleUpdate = (event, index) => {
    handleMenuClose(index);
    onUpdate(event);
  };

  const handleDelete = (event, index) => {
    handleMenuClose(index);
    onDelete(event);
  };

  const handleAddGuest = (event, index) => {
    handleMenuClose(index);
    onAddGuest(event);
  };

  return (
    <Dialog open={visible} onClose={handleModalHide} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {`Events for ${selectedDate?.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}`}
        <IconButton
          aria-label="close"
          onClick={handleModalHide}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div className="day-events-content">
          {events.length === 0 ? (
            <p>No events scheduled for this day.</p>
          ) : (
            events.map((event, index) => (
              <div
                key={event._id}
                className="event-item"
                style={{
                  position: "relative",
                  marginBottom: 24,
                  borderBottom: "1px solid #eee",
                  paddingBottom: 16,
                }}
              >
                {/* Three-dot image at top right with menu (PrimeReact Menu, keep for now) */}
                <img
                  src={three}
                  alt="menu"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    cursor: "pointer",
                  }}
                  onClick={(e) => handleMenuClick(index, e)}
                />
                <Menu
                  anchorEl={anchorEls[index]}
                  open={Boolean(anchorEls[index])}
                  onClose={() => handleMenuClose(index)}
                >
                  <MenuItem onClick={() => handleUpdate(event, index)}>
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Update Event</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleDelete(event, index)}>
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete Event</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleAddGuest(event, index)}>
                    <ListItemIcon>
                      <PersonAddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Add Guest</ListItemText>
                  </MenuItem>
                </Menu>
                <h3
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "18px",
                    color: "#344054",
                  }}
                >
                  {event.title}
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <i
                    className="pi pi-calendar"
                    style={{ marginRight: "8px", color: "#667085" }}
                  ></i>
                  <span style={{ fontSize: "14px", color: "#475467" }}>
                    {new Date(event.start).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <i
                    className="pi pi-map-marker"
                    style={{ marginRight: "8px", color: "#667085" }}
                  ></i>
                  <span style={{ fontSize: "14px", color: "#475467" }}>
                    {event.location}
                  </span>
                </div>
                {event.description && (
                  <p
                    style={{
                      margin: "10px 0 0 0",
                      fontSize: "14px",
                      color: "#475467",
                      padding: "10px",
                      backgroundColor: "#fff",
                      borderRadius: "4px",
                    }}
                  >
                    {event.description}
                  </p>
                )}

                {/* Add this section to display guests */}
                {(event.guests?.length > 0 ||
                  event.guestEmails?.length > 0) && (
                    <div
                      className="event-guests"
                      style={{
                        marginTop: "15px",
                        padding: "10px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "4px",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          marginBottom: "8px",
                          color: "#344054",
                        }}
                      >
                        Guests
                      </h4>

                      <div className="guest-list">
                        {event.guestEmails &&
                          event.guestEmails.map((email, idx) => (
                            <div
                              key={"email-" + idx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "5px",
                              }}
                            >
                              <i
                                className="pi pi-envelope"
                                style={{
                                  marginRight: "8px",
                                  color: "#667085",
                                  fontSize: "12px",
                                }}
                              ></i>
                              <span
                                style={{ fontSize: "13px", color: "#475467" }}
                              >
                                {email}
                              </span>
                            </div>
                          ))}

                        {event.guests &&
                          event.guests.map((guest, idx) => (
                            <div
                              key={"guest-" + idx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "5px",
                              }}
                            >
                              <i
                                className="pi pi-user"
                                style={{
                                  marginRight: "8px",
                                  color: "#667085",
                                  fontSize: "12px",
                                }}
                              ></i>
                              <span
                                style={{ fontSize: "13px", color: "#475467" }}
                              >
                                {guest.email || guest.name || `Guest ${idx + 1}`}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalHide} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
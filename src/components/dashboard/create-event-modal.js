import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import { Dialog } from "primereact/dialog";
import { useCalendar } from "../../context/calendar/calendarContext";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Calendar as PrimeCalendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";

const CreateEventModal = ({ open, handleClose }) => {
  const { addEvent } = useCalendar();
  const locationOptions = [
    { label: "Zoom", value: "Zoom" },
    { label: "Google Meet", value: "Google Meet" },
    { label: "Microsoft Teams", value: "Microsoft Teams" },
    { label: "In-Person", value: "In-Person" },
  ];
  const [event, setEvent] = useState({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(),
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, value) => {
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Handle event submission (e.g., save to the database)
    event.start = new Date(event.start).toISOString();
    event.end = new Date(event.end).toISOString();
    addEvent(event);
    event.title = "";
    event.description = "";
    event.start = new Date();
    event.end = new Date();
    event.location = "";
    handleClose();
  };

  return (
    <Dialog
      visible={open}
      onHide={handleClose}
      header="Create Event"
      style={{ width: "500px" }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="body1"
              sx={{ fontSize: "14px", color: "#000000" }}
            >
              Event Title *
            </Typography>
            <TextField
              fullWidth
              name="title"
              value={event.title}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="body1"
              sx={{ fontSize: "14px", color: "#000000" }}
            >
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="description"
              value={event.description}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="body1"
              sx={{ fontSize: "14px", color: "#000000" }}
            >
              Start Date *
            </Typography>
            <PrimeCalendar
              id="start"
              value={event.start}
              onChange={(e) => handleDateChange("start", e.value)}
              showTime
              showSeconds={false}
              placeholder="Select start date and time"
              required
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="body1"
              sx={{ fontSize: "14px", color: "#000000" }}
            >
              End Date
            </Typography>
            <PrimeCalendar
              id="end"
              value={event.end}
              onChange={(e) => handleDateChange("end", e.value)}
              showTime
              showSeconds={false}
              placeholder="Select end date and time"
              required
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="body1"
              sx={{ fontSize: "14px", color: "#000000" }}
            >
              Location *
            </Typography>
            <Dropdown
              id="location"
              value={event.location}
              options={locationOptions}
              onChange={(e) => setEvent({ ...event, location: e.value })}
              placeholder="Select location type"
              style={{ width: "100%" }}
            />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<AddBoxIcon />}
          sx={{
            bgcolor: "#0387d9",
            color: "#ffffff",
            borderRadius: "10px",
            padding: "10px 20px",
            fontWeight: 500,
            textTransform: "none",
            fontSize: "12px",
            ":hover": {
              bgcolor: "rgba(3, 135, 217, 0.9)",
            },
          }}
          onClick={handleSubmit}
        >
          Create Event
        </Button>
      </Box>
    </Dialog>
  );
};

export default CreateEventModal;

import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Grid, DialogActions } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useCalendar } from "../../context/calendar/calendarContext";
import AddBoxIcon from '@mui/icons-material/AddBox';

const CreateEventModal = ({ open, handleClose }) => {
const { addEvent } = useCalendar()
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
    console.log(event);
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
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: '65vh',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Create Event
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2, p: 2 }}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Event Title"
          name="title"
          value={event.title}
          onChange={handleChange}
          variant="outlined"
          sx={{ borderRadius: "8px" }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          name="description"
          value={event.description}
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Start Date & Time"
            value={event.start}
            onChange={(newValue) => handleDateChange("start", newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                variant="outlined"
              />
            )}
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="End Date & Time"
            value={event.end}
            onChange={(newValue) => handleDateChange("end", newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                variant="outlined"
              />
            )}
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Location"
          name="location"
          value={event.location}
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>
    </Grid>
        <DialogActions sx={{ mt: 2 }}>
          <Button onClick={handleClose} 
          variant="outlined"
           sx={{
            bgcolor: "#ffffff",
            color: "#000000",
            borderRadius: "10px",
            padding: "10px 20px",
            fontWeight: 500,
            textTransform: "none",
            fontSize: "12px",
            ":hover": {
              bgcolor: "rgba(0, 0, 0, 0.1)",
            },
          }}>
            Cancel
          </Button>
          <Button variant="contained"
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
          onClick={handleSubmit}>
            Create Event
          </Button>
        </DialogActions>
      </Box>
    </Modal>
  );
};

export default CreateEventModal;


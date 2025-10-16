import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCalendar } from "../../context/calendar/calendarContext";
import EditIcon from "@mui/icons-material/Edit";
import { Calendar as PrimeCalendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";

const EditEventModal = ({ open, handleClose, eventData, zIndex = 1300 }) => {
  console.log('EditEventModal rendered with props - open:', open, 'eventData:', eventData, 'zIndex:', zIndex); // Debug log
  const { updateEvent } = useCalendar();
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

  // Update event state when eventData changes
  useEffect(() => {
    console.log('EditEventModal useEffect triggered - eventData:', eventData, 'open:', open); // Debug log
    
    // Reset form when modal opens but no eventData
    if (open && !eventData) {
      console.log('Modal opened but no eventData - resetting form'); // Debug log
      setEvent({
        title: "",
        description: "",
        start: new Date(),
        end: new Date(),
        location: "",
      });
      return;
    }
    
    // Populate form when we have eventData and modal is open
    if (eventData && open) {
      const newEventState = {
        title: eventData.title || "",
        description: eventData.description || "",
        start: eventData.start ? new Date(eventData.start) : new Date(),
        end: eventData.end ? new Date(eventData.end) : new Date(),
        location: eventData.location || "",
      };
      

      setEvent(newEventState);
      
      // Force a re-render check
      setTimeout(() => {
        console.log('EditEventModal - current event state after setState:', event);
      }, 100);
    }
  }, [eventData, open]);

  // Additional useEffect to handle eventData changes when modal is already open
  useEffect(() => {
    if (eventData) {
      const newEventState = {
        title: eventData.title || "",
        description: eventData.description || "",
        start: eventData.start ? new Date(eventData.start) : new Date(),
        end: eventData.end ? new Date(eventData.end) : new Date(),
        location: eventData.location || "",
      };
      setEvent(newEventState);
    }
  }, [eventData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, value) => {
    if (name === "start") {
      // When start date changes, ensure end date is not before start date
      setEvent((prev) => {
        const newStart = value;
        const currentEnd = prev.end;
        
        // If end date is before new start date, set end date to 1 hour after start
        if (currentEnd < newStart) {
          return {
            ...prev,
            start: newStart,
            end: new Date(newStart.getTime() + 60 * 60 * 1000),
          };
        }
        
        return { ...prev, [name]: value };
      });
    } else {
      setEvent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    console.log('EditEventModal handleSubmit called'); // Debug log
    console.log('Current event state:', event); // Debug log
    console.log('EventData for ID:', eventData); // Debug log
    
    // Handle event update
    const updatedEvent = {
      ...event,
      start: new Date(event.start).toISOString(),
      end: new Date(event.end).toISOString(),
    };
    
    // Handle both possible ID formats
    const eventId = eventData.id || eventData._id;
    console.log('Using eventId for update:', eventId); // Debug log
    console.log('Sending updatedEvent:', updatedEvent); // Debug log
    
    if (!eventId) {
      console.error('No valid event ID found for update!');
      return;
    }
    
    updateEvent(eventId, updatedEvent);
    handleClose();
  };

  const handleModalClose = () => {
    // Reset form when modal closes
    setEvent({
      title: "",
      description: "",
      start: new Date(),
      end: new Date(),
      location: "",
    });
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
        <Typography variant="h6" fontWeight={600}>Edit Event</Typography>
        <IconButton onClick={handleModalClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
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
              onFocus={() => console.log('Title field focused, current value:', event.title)}
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
              minDate={new Date()} // Prevent selecting past dates for new events
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
              minDate={event.start} // End date must be after start date
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
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleModalClose} variant="outlined">
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
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
          Update Event
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEventModal;

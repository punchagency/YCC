import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "65vw",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const ViewEventModal = ({ open, handleClose, event }) => {
    console.log('event being viewed', event);
  if (!event) return null;

  const formatDate = (date) =>
    new Date(date).toLocaleString("default", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
  
  <Modal open={open} onClose={handleClose}>
    <Box sx={style}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Event Details</Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
  
      <Divider sx={{ my: 2 }} />
  
      {event && event.length > 0 ? (
        event.map((e, index) => (
          <Box key={index} mb={3} p={2} border="1px solid #ddd" borderRadius={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              {e.title}
            </Typography>
  
            <Typography variant="body2" color="text.secondary" mb={1}>
              {e.description}
            </Typography>
  
            <Typography variant="body2" mb={0.5}>
              <strong>Start:</strong> {formatDate(e.start)}
            </Typography>
  
            <Typography variant="body2" mb={0.5}>
              <strong>End:</strong> {formatDate(e.end)}
            </Typography>
  
            <Typography variant="body2">
              <strong>Location:</strong> {e.location}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography variant="body2">No events found</Typography>
      )}
    </Box>
  </Modal>
  
  );
};

export default ViewEventModal;

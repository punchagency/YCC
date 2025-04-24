import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  Dialog,
  DialogActions,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarIcon from "@mui/icons-material/CalendarMonth";
import { useCalendar } from "../../context/calendar/calendarContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";


const ViewEventModal = ({ open, handleClose, event }) => {
  const { addGuest } = useCalendar();
  const [openAddGuestModal, setOpenAddGuestModal] = useState(false);
  const [guestEmails, setGuestEmails] = useState([]);
  const [guestEmail, setGuestEmail] = useState("");
  const [eventId, setEventId] = useState("");

  const formatDate = (date) =>
    new Date(date).toLocaleString("default", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleAddGuestModal = () => {
    setOpenAddGuestModal(!openAddGuestModal);
  };
  const handleAddGuest = () => {
    addGuest(eventId, guestEmails);
    setGuestEmails([]);
    setOpenAddGuestModal(false);
    handleClose();
  };
  if (!event) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx=
      {{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: '70%', md: '50%' },
        maxHeight: '80vh',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 2,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Event Details</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {event && event.length > 0 ? (
          event.map((e, index) => (
            <Box
              key={index}
              mb={3}
              p={2}
              border="1px solid #ddd"
              borderRadius={2}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {e.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={1}>
                {e.description}
              </Typography>

              <Typography variant="body2" mb={0.5}>
                <strong>
                  {" "}
                  <CalendarIcon sx={{ fontSize: "16px" }} /> Start:
                </strong>{" "}
                {formatDate(e.start)}
              </Typography>

              <Typography variant="body2" mb={0.5}>
                <strong>
                  {" "}
                  <CalendarIcon sx={{ fontSize: "16px" }} /> End:
                </strong>{" "}
                {formatDate(e.end)}
              </Typography>

              <Typography variant="body2">
                <strong>
                  {" "}
                  <LocationOnIcon sx={{ fontSize: "16px" }} /> Location:
                </strong>{" "}
                {e.location}
              </Typography>

              <Box
                mt={1}
                mb={1}
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
                gap={1}
                fontSize="10px"
                fontWeight="bold"
                bgcolor="#f0f0f0"
                p={1}
                borderRadius={1}
              >
                Guest List:
                {e.guests.map((guest, index) => (
                  <Typography sx={{fontSize: "10px"}} key={index}>{guest.email}</Typography>
                ))}
                {e.guestEmails.map((guest, index) => (
                  <Typography sx={{fontSize: "10px"}} key={index}>{guest}</Typography>
                ))}

              </Box>

              
      {openAddGuestModal && (
        <Dialog open={openAddGuestModal} onClose={handleAddGuestModal}>
          <Box sx={{ p: 4, minWidth: "400px" }}>
            <Typography variant="h6">Add Guests</Typography>
            <TextField
              label="Guest Email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <CustomAddIconButton
            variant="outlined"
              onClick={() => {
                if (guestEmail.trim()) {
                  setGuestEmails([...guestEmails, guestEmail.trim()]);
                  setGuestEmail("");
                }
              }}
            >
            <AddIcon sx={{fontSize: "15px"}} />  Add
            </CustomAddIconButton>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Guest List</Typography>
              {guestEmails.map((email, i) => (
                <Box
                  key={i}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>{email}</Typography>
                  <CustomRemoveIconButton
                    size="small"
                    variant="contained"
                    onClick={() =>
                      setGuestEmails(
                        guestEmails.filter((_, index) => index !== i)
                      )
                    }
                  >
                    <RemoveIcon sx={{fontSize: "15px"}} /> Remove
                  </CustomRemoveIconButton>
                </Box>
              ))}
            </Box>

            <DialogActions sx={{ mt: 3 }}>
              <CustomCancelButton variant="outlined" onClick={handleAddGuestModal}>Cancel</CustomCancelButton>
              <CustomConfirmButton onClick={() => handleAddGuest()} variant="contained">
                Confirm
              </CustomConfirmButton>
            </DialogActions>
          </Box>
        </Dialog>
      )}

              <Box
                display="flex"
                justifyContent="flex-end"
                gap={2}
                alignItems="center"
              >
                <CustomConfirmButton
                  variant="contained"
                  onClick={() => {
                    handleAddGuestModal();
                    setEventId(e._id);
                  }}
                >
                  Add Guests
                </CustomConfirmButton>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body2">No events found</Typography>
        )}
      </Box>

    </Modal>
  );
};

const CustomConfirmButton = styled(Button)({
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
});

const CustomCancelButton = styled(Button)({
  bgcolor: "#f0f0f0",
  color: "#000000",
  borderRadius: "10px",
  padding: "10px 20px",
  fontWeight: 500,
  textTransform: "none",
  fontSize: "12px",
});

const CustomAddIconButton = styled(Button)({
  bgcolor: "#0387d9",
  color: "black",
  borderRadius: "10px",
  padding: "10px 20px",
  fontWeight: 500,
  textTransform: "none",
  fontSize: "12px",
  ":hover": {
    bgcolor: "rgba(3, 135, 217, 0.9)",
  },
});

const CustomRemoveIconButton = styled(Button)({
  backgroundColor: "#f44336", // red
  color: "#fff",
  borderRadius: "8px",
  padding: "4px 10px",
  fontWeight: 500,
  textTransform: "none",
  fontSize: "12px",
  minWidth: "unset", // keeps it slim
  lineHeight: 1.2,
  "&:hover": {
    backgroundColor: "#d32f2f",
  },
});

export default ViewEventModal;

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
  Chip,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarIcon from "@mui/icons-material/CalendarMonth";
import { useCalendar } from '../../context/calendar/calendarContext';
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmailIcon from "@mui/icons-material/Email";
import { addGuestService } from "../../services/calendar/calendarService";
import { useToast } from '../../components/Toast';


const ViewEventModal = ({ open, handleClose, event }) => {
  const { fetchEventsByDate } = useCalendar();
  const [openAddGuestModal, setOpenAddGuestModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestEmails, setGuestEmails] = useState([]);
  const [guestEmail, setGuestEmail] = useState("");
  const [eventId, setEventId] = useState("");
  const { showError, showSuccess } = useToast();

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
    if (!openAddGuestModal) {
      setGuestEmails([]);
      setGuestEmail("");
    }
  };
  const handleAddGuest = async () => {
    if (guestEmails.length === 0) return;
    setLoading(true);

    try {
      const response = await addGuestService(eventId, guestEmails);

      if (response.success) {
        showSuccess(response.message);
        fetchEventsByDate();
      } else {
        showError(response.error || "Failed to add guests");
      }
      setGuestEmails([]);
      setOpenAddGuestModal(false);
      handleClose();
    } catch (error) {
      showError("An error occurred while adding guests");
    } finally {
      setLoading(false);
    }
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
                  <Typography sx={{ fontSize: "10px" }} key={index}>{guest.email}</Typography>
                ))}
                {e.guestEmails.map((guest, index) => (
                  <Typography sx={{ fontSize: "10px" }} key={index}>{guest}</Typography>
                ))}

              </Box>


              {openAddGuestModal && (
                <Dialog
                  open={openAddGuestModal}
                  onClose={handleAddGuestModal}
                  maxWidth="sm"
                  fullWidth
                  PaperProps={{
                    sx: {
                      borderRadius: 3,
                      p: { xs: 2, sm: 3 }
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <PersonAddIcon sx={{ color: '#0387d9', fontSize: 28 }} />
                    <Typography variant="h5" fontWeight={600}>Add Guests</Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <TextField
                      label="Guest Email"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && guestEmail.trim()) {
                          const email = guestEmail.trim();
                          if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                            if (!guestEmails.includes(email)) {
                              setGuestEmails([...guestEmails, email]);
                              setGuestEmail("");
                            }
                          }
                        }
                      }}
                      fullWidth
                      variant="outlined"
                      placeholder="Enter email and press Enter or click Add"
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: '#757575' }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                    <CustomAddIconButton
                      fullWidth
                      onClick={() => {
                        const email = guestEmail.trim();
                        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                          if (!guestEmails.includes(email)) {
                            setGuestEmails([...guestEmails, email]);
                            setGuestEmail("");
                          }
                        }
                      }}
                      sx={{ mt: 1.5 }}
                    >
                      <AddIcon sx={{ fontSize: 18, mr: 0.5 }} /> Add Email
                    </CustomAddIconButton>
                  </Box>

                  {guestEmails.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" mb={1.5}>
                        {guestEmails.length} Guest{guestEmails.length > 1 ? 's' : ''} Added
                      </Typography>
                      <Stack
                        direction="row"
                        flexWrap="wrap"
                        gap={1}
                        sx={{
                          maxHeight: 200,
                          overflowY: 'auto',
                          p: 2,
                          bgcolor: '#f8f9fa',
                          borderRadius: 2,
                        }}
                      >
                        {guestEmails.map((email, i) => (
                          <Chip
                            key={i}
                            label={email}
                            onDelete={() => setGuestEmails(guestEmails.filter((_, index) => index !== i))}
                            color="primary"
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
                              '& .MuiChip-deleteIcon': {
                                color: '#f44336',
                                '&:hover': {
                                  color: '#d32f2f',
                                }
                              }
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <DialogActions sx={{ px: 0, pt: 2 }}>
                    <CustomCancelButton onClick={handleAddGuestModal}>Cancel</CustomCancelButton>
                    <CustomConfirmButton
                      onClick={handleAddGuest}
                      disabled={guestEmails.length === 0}
                    >
                      Add {guestEmails.length > 0 && `(${guestEmails.length})`} Guest{guestEmails.length !== 1 ? 's' : ''}
                    </CustomConfirmButton>
                  </DialogActions>
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
                  disabled={loading}
                  onClick={() => {
                    handleAddGuestModal();
                    setEventId(e._id);
                  }}
                >
                  {loading ? "Adding..." : "Add Guests"}
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
  backgroundColor: "#0387d9",
  color: "#ffffff",
  borderRadius: "10px",
  padding: "10px 20px",
  fontWeight: 500,
  textTransform: "none",
  fontSize: "12px",
  "&:hover": {
    backgroundColor: "rgba(3, 135, 217, 0.9)",
  },
  "&:disabled": {
    backgroundColor: "#ccc",
    color: "#666",
  },
});

const CustomCancelButton = styled(Button)({
  backgroundColor: "#f0f0f0",
  color: "#000000",
  borderRadius: "10px",
  padding: "10px 20px",
  fontWeight: 500,
  textTransform: "none",
  fontSize: "12px",
  "&:hover": {
    backgroundColor: "#e0e0e0",
  },
});

const CustomAddIconButton = styled(Button)({
  backgroundColor: "#0387d9",
  color: "#ffffff",
  borderRadius: "10px",
  padding: "10px 20px",
  fontWeight: 500,
  textTransform: "none",
  fontSize: "12px",
  "&:hover": {
    backgroundColor: "rgba(3, 135, 217, 0.9)",
  },
});



export default ViewEventModal;

import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Dialog, 
  Stack, 
  Chip 
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmailIcon from "@mui/icons-material/Email";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import { useCalendar } from "../../context/calendar/calendarContext";

const CustomAddIconButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#0387d9',
  color: '#ffffff',
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '14px',
  boxShadow: '0 4px 12px rgba(3, 135, 217, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#0266b3',
    boxShadow: '0 6px 16px rgba(3, 135, 217, 0.4)',
    transform: 'translateY(-1px)',
  },
}));

const AddGuestModal = ({ open, handleClose, selectedEvent }) => {
  console.log('AddGuestModal rendered - open:', open, 'selectedEvent:', selectedEvent); // Debug log
  
  const { addGuest } = useCalendar();
  const [guestEmail, setGuestEmail] = useState("");
  const [guestEmails, setGuestEmails] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddEmail = () => {
    console.log('handleAddEmail called with email:', guestEmail); // Debug log
    const email = guestEmail.trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (!guestEmails.includes(email)) {
        console.log('Adding email to list:', email); // Debug log
        setGuestEmails([...guestEmails, email]);
        setGuestEmail("");
      } else {
        console.log('Email already exists in list:', email); // Debug log
      }
    } else {
      console.log('Invalid email format:', email); // Debug log
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && guestEmail.trim()) {
      handleAddEmail();
    }
  };

  const handleRemoveEmail = (indexToRemove) => {
    console.log('Removing email at index:', indexToRemove); // Debug log
    setGuestEmails(guestEmails.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmitGuests = async () => {
    console.log('handleSubmitGuests called'); // Debug log
    console.log('Selected event:', selectedEvent); // Debug log
    console.log('Guest emails to add:', guestEmails); // Debug log

    if (!selectedEvent) {
      console.error('No selected event available'); // Debug log
      return;
    }

    if (guestEmails.length === 0) {
      console.log('No guest emails to add'); // Debug log
      return;
    }

    setIsSubmitting(true);

    try {
      // Get event ID (handle both _id and id)
      const eventId = selectedEvent._id || selectedEvent.id;
      console.log('Using event ID:', eventId); // Debug log

      if (!eventId) {
        console.error('No valid event ID found'); // Debug log
        setIsSubmitting(false);
        return;
      }

      // Call the addGuest function from calendar context
      await addGuest(eventId, guestEmails);
      
      console.log('Guests added successfully'); // Debug log
      
      // Reset form and close modal
      setGuestEmails([]);
      setGuestEmail("");
      handleClose();
    } catch (error) {
      console.error('Error adding guests:', error); // Debug log
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    console.log('AddGuestModal closing'); // Debug log
    // Reset form when modal closes
    setGuestEmails([]);
    setGuestEmail("");
    setIsSubmitting(false);
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
          onKeyPress={handleKeyPress}
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
          onClick={handleAddEmail}
          sx={{ mt: 1.5 }}
          disabled={!guestEmail.trim()}
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
                onDelete={() => handleRemoveEmail(i)}
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

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          onClick={handleModalClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>
        <CustomAddIconButton
          onClick={handleSubmitGuests}
          disabled={guestEmails.length === 0 || isSubmitting}
          sx={{ px: 3, py: 1 }}
        >
          <PersonAddIcon sx={{ fontSize: 18, mr: 0.5 }} />
          {isSubmitting ? 'Adding...' : `Add ${guestEmails.length} Guest${guestEmails.length > 1 ? 's' : ''}`}
        </CustomAddIconButton>
      </Box>
    </Dialog>
  );
};

export default AddGuestModal;

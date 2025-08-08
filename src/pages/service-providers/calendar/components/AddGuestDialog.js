import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
  Stack,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
  Add as AddIcon,
  Email as EmailIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { formValidators } from '../calendarHelpers';

const AddGuestDialog = ({
  open,
  onClose,
  onAddGuests,
  event,
  isSubmitting = false,
}) => {
  const theme = useTheme();
  const [emails, setEmails] = useState(['']);
  const [errors, setErrors] = useState([]);
  
  if (!event) return null;
  
  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
    
    // Clear error when field is edited
    if (errors[index]) {
      const newErrors = [...errors];
      newErrors[index] = '';
      setErrors(newErrors);
    }
  };
  
  const addEmailField = () => {
    setEmails([...emails, '']);
    setErrors([...errors, '']);
  };
  
  const removeEmailField = (index) => {
    const newEmails = emails.filter((_, i) => i !== index);
    const newErrors = errors.filter((_, i) => i !== index);
    setEmails(newEmails);
    setErrors(newErrors);
  };
  
  const handleSubmit = () => {
    // Validate emails
    const newErrors = emails.map(email => 
      email.trim() === '' 
        ? 'Email is required' 
        : !formValidators.validateEmail(email) 
          ? 'Invalid email format' 
          : ''
    );
    
    setErrors(newErrors);
    
    if (newErrors.some(error => error !== '')) {
      return;
    }
    
    // Filter out empty emails (shouldn't happen due to validation)
    const validEmails = emails.filter(email => email.trim() !== '');
    
    if (validEmails.length === 0) {
      return;
    }
    
    onAddGuests(event._id, validEmails);
  };
  
  const handleClose = () => {
    setEmails(['']);
    setErrors([]);
    onClose();
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 5,
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: 'linear-gradient(135deg, #0288d1 0%, #03a9f4 100%)',
          color: theme.palette.mode === 'light' ? '#333' : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonAddIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Add Guests to Event
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          disabled={isSubmitting}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, mt: 1, '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: alpha(theme.palette.info.main, 0.2), borderRadius: '4px' } }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Event: {event.title}
          </Typography>
        </Box>
        
        {/* Current Guests */}
        {(event.guestEmails?.length > 0 || event.guests?.length > 0) && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Current Guests:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {event.guestEmails?.map((email, index) => (
                <Chip
                  key={`email-${index}`}
                  icon={<EmailIcon />}
                  label={email}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
              {event.guests?.map((guest, index) => (
                <Chip
                  key={`guest-${index}`}
                  icon={<PersonAddIcon />}
                  label={guest.email || guest.name || `Guest ${index + 1}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
        
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Add New Guests:
        </Typography>
        
        <Stack spacing={2} sx={{ mt: 1 }}>
          {emails.map((email, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                label={`Guest Email ${index + 1}`}
                fullWidth
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                error={!!errors[index]}
                helperText={errors[index]}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                  sx: { borderRadius: 1 },
                }}
              />
              {emails.length > 1 && (
                <IconButton
                  color="error"
                  onClick={() => removeEmailField(index)}
                  disabled={isSubmitting}
                  sx={{ flexShrink: 0 }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
        </Stack>
        
        <Button
          startIcon={<AddIcon />}
          onClick={addEmailField}
          disabled={isSubmitting}
          sx={{ mt: 2, textTransform: 'none' }}
        >
          Add Another Email
        </Button>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        py: 2, 
        bgcolor: theme.palette.mode === 'light' ? alpha('#e1f5fe', 0.8) : alpha('#0a1929', 0.8),
        borderTop: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
      }}>
        <Button 
          onClick={handleClose} 
          color="inherit"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleSubmit}
          disabled={isSubmitting || emails.every(email => email.trim() === '')}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 1,
            backgroundColor: "#0387D9",
            color: "white",
            fontWeight: 600,
            '&:hover': {
              backgroundColor: "#0066cc",
            },
          }}
        >
          {isSubmitting ? 'Sending Invites...' : 'Send Invites'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGuestDialog;

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Event as EventIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { formValidators } from '../calendarHelpers';

const locationOptions = [
  { value: 'zoom', label: 'Zoom Meeting' },
  { value: 'google-meet', label: 'Google Meet' },
  { value: 'ms-teams', label: 'Microsoft Teams' },
  { value: 'in-person', label: 'In Person' },
];

const CreateEventDialog = ({
  open,
  onClose,
  onSave,
  initialDate = null,
  editMode = false,
  eventData = null,
}) => {
  const theme = useTheme();
  
  const [event, setEvent] = useState({
    title: '',
    description: '',
    start: initialDate || new Date(),
    end: null,
    location: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form when editing an existing event
  useEffect(() => {
    try {
      if (editMode && eventData) {
        let startDate = new Date();
        let endDate = null;
        
        // Safely parse start date
        if (eventData.start) {
          try {
            startDate = new Date(eventData.start);
            if (isNaN(startDate.getTime())) {
              console.error('Invalid start date from eventData');
              startDate = new Date();
            }
          } catch (error) {
            console.error('Error parsing start date:', error);
            startDate = new Date();
          }
        }
        
        // Safely parse end date
        if (eventData.end) {
          try {
            endDate = new Date(eventData.end);
            if (isNaN(endDate.getTime())) {
              console.error('Invalid end date from eventData');
              endDate = null;
            }
          } catch (error) {
            console.error('Error parsing end date:', error);
            endDate = null;
          }
        }
        
        setEvent({
          ...eventData,
          start: startDate,
          end: endDate,
        });
      } else if (!editMode) {
        // Reset form for new event
        let startDate = new Date();
        
        // Safely parse initialDate if provided
        if (initialDate) {
          try {
            startDate = new Date(initialDate);
            if (isNaN(startDate.getTime())) {
              console.error('Invalid initialDate');
              startDate = new Date();
            }
          } catch (error) {
            console.error('Error parsing initialDate:', error);
            startDate = new Date();
          }
        }
        
        setEvent({
          title: '',
          description: '',
          start: startDate,
          end: null,
          location: '',
        });
      }
    } catch (error) {
      console.error('Error in form initialization:', error);
      // Fallback to default values
      setEvent({
        title: '',
        description: '',
        start: new Date(),
        end: null,
        location: '',
      });
    }
    
    setErrors({});
  }, [editMode, eventData, initialDate, open]);
  
  const handleChange = (field) => (e) => {
    setEvent({ ...event, [field]: e.target.value });
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };
  
  const handleDateChange = (field) => (date) => {
    setEvent({ ...event, [field]: date });
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };
  
  const handleSubmit = async () => {
    try {
      // Make sure we're working with properly formatted data
      const eventToValidate = {
        ...event,
        // Ensure start and end are proper Date objects
        start: event.start instanceof Date ? event.start : new Date(event.start),
        end: event.end ? (event.end instanceof Date ? event.end : new Date(event.end)) : null
      };
      
      // Validate form
      const validation = formValidators.validateEventForm(eventToValidate);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
      
      setIsSubmitting(true);
      
      // Send the validated event data
      await onSave(eventToValidate);
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      setErrors({ 
        submit: 'An error occurred while saving the event. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          bgcolor: editMode 
            ? 'linear-gradient(135deg, #0066cc 0%, #0387D9 100%)'
            : 'linear-gradient(135deg, #003366 0%, #0066cc 100%)',
          color: theme.palette.mode === 'light' ? '#333' : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EventIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            {editMode ? 'Edit Event' : 'Create New Event'}
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: alpha(theme.palette.primary.main, 0.2), borderRadius: '4px' } }}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Event Title"
            fullWidth
            required
            value={event.title}
            onChange={handleChange('title')}
            error={!!errors.title}
            helperText={errors.title}
            InputProps={{
              sx: {
                borderRadius: 1,
              },
            }}
          />
          
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={event.description}
            onChange={handleChange('description')}
            InputProps={{
              sx: {
                borderRadius: 1,
              },
            }}
          />
          
          <FormControl fullWidth>
            <InputLabel id="location-label">Location</InputLabel>
            <Select
              labelId="location-label"
              value={event.location}
              label="Location"
              onChange={handleChange('location')}
              sx={{ borderRadius: 1 }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {locationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {/* Start Date & Time */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              required
              value={event.start && event.start instanceof Date ? event.start.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value;
                let time = '00:00:00';
                
                try {
                  if (event.start instanceof Date) {
                    time = event.start.toTimeString().slice(0, 8); // HH:MM:SS format
                  }
                } catch (error) {
                  console.error('Error formatting time:', error);
                }
                
                try {
                  const newDate = new Date(`${date}T${time}`);
                  handleDateChange('start')(newDate);
                } catch (error) {
                  console.error('Error creating date:', error);
                  // Fallback to current date with selected date
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  handleDateChange('start')(today);
                }
              }}
              error={!!errors.start}
              helperText={errors.start}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: { borderRadius: 1 },
              }}
            />
            <TextField
              label="Start Time"
              type="time"
              fullWidth
              required
              value={event.start && event.start instanceof Date ? event.start.toTimeString().slice(0, 5) : ''}
              onChange={(e) => {
                const time = e.target.value;
                let dateStr = new Date().toISOString().split('T')[0]; // Default to today
                
                try {
                  if (event.start instanceof Date) {
                    dateStr = event.start.toISOString().split('T')[0];
                  }
                } catch (error) {
                  console.error('Error formatting date:', error);
                }
                
                try {
                  const newDate = new Date(`${dateStr}T${time}:00`);
                  if (!isNaN(newDate.getTime())) { // Check if date is valid
                    handleDateChange('start')(newDate);
                  } else {
                    throw new Error('Invalid date');
                  }
                } catch (error) {
                  console.error('Error creating date with time:', error);
                  // Fallback to current date with selected time
                  const [hours, minutes] = time.split(':').map(Number);
                  const today = new Date();
                  if (!isNaN(hours) && !isNaN(minutes)) {
                    today.setHours(hours, minutes, 0, 0);
                  }
                  handleDateChange('start')(today);
                }
              }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: { borderRadius: 1 },
              }}
            />
          </Box>
          
          {/* End Date & Time (Optional) */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="End Date (Optional)"
              type="date"
              fullWidth
              value={event.end && event.end instanceof Date ? event.end.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value;
                if (!date) {
                  handleDateChange('end')(null);
                  return;
                }
                
                let time = '00:00:00';
                try {
                  if (event.end instanceof Date) {
                    time = event.end.toTimeString().slice(0, 8); // HH:MM:SS format
                  } else if (event.start instanceof Date) {
                    // Default to start time + 1 hour if no end time is set
                    const endTime = new Date(event.start);
                    endTime.setHours(endTime.getHours() + 1);
                    time = endTime.toTimeString().slice(0, 8);
                  }
                } catch (error) {
                  console.error('Error formatting end time:', error);
                }
                
                try {
                  const newDate = new Date(`${date}T${time}`);
                  if (!isNaN(newDate.getTime())) { // Check if date is valid
                    handleDateChange('end')(newDate);
                  } else {
                    throw new Error('Invalid end date');
                  }
                } catch (error) {
                  console.error('Error creating end date:', error);
                  // Fallback to start date + 1 hour
                  if (event.start instanceof Date) {
                    const endTime = new Date(event.start);
                    endTime.setHours(endTime.getHours() + 1);
                    handleDateChange('end')(endTime);
                  } else {
                    handleDateChange('end')(null);
                  }
                }
              }}
              error={!!errors.end}
              helperText={errors.end}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: { borderRadius: 1 },
              }}
            />
            <TextField
              label="End Time (Optional)"
              type="time"
              fullWidth
              value={event.end && event.end instanceof Date ? event.end.toTimeString().slice(0, 5) : ''}
              onChange={(e) => {
                const time = e.target.value;
                if (!time) {
                  handleDateChange('end')(null);
                  return;
                }
                
                let dateStr = new Date().toISOString().split('T')[0]; // Default to today
                
                try {
                  if (event.end instanceof Date) {
                    dateStr = event.end.toISOString().split('T')[0];
                  } else if (event.start instanceof Date) {
                    dateStr = event.start.toISOString().split('T')[0];
                  }
                } catch (error) {
                  console.error('Error formatting end date:', error);
                }
                
                try {
                  const newDate = new Date(`${dateStr}T${time}:00`);
                  if (!isNaN(newDate.getTime())) { // Check if date is valid
                    handleDateChange('end')(newDate);
                  } else {
                    throw new Error('Invalid end date with time');
                  }
                } catch (error) {
                  console.error('Error creating end date with time:', error);
                  // Fallback to start date with selected time
                  const [hours, minutes] = time.split(':').map(Number);
                  
                  if (!isNaN(hours) && !isNaN(minutes)) {
                    if (event.start instanceof Date) {
                      const endTime = new Date(event.start);
                      endTime.setHours(hours, minutes, 0, 0);
                      handleDateChange('end')(endTime);
                    } else {
                      const today = new Date();
                      today.setHours(hours, minutes, 0, 0);
                      handleDateChange('end')(today);
                    }
                  } else {
                    handleDateChange('end')(null);
                  }
                }
              }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: { borderRadius: 1 },
              }}
            />
          </Box>
        </Stack>
      </DialogContent>
      
      <DialogActions 
        sx={{ 
          px: 3, 
          py: 2, 
          bgcolor: theme.palette.mode === 'light' ? alpha('#f5f5f5', 0.8) : alpha('#1a1a1a', 0.8),
          borderTop: `1px solid ${theme.palette.divider}`,
          flexDirection: 'column',
          alignItems: 'stretch'
        }}
      >
        {errors.submit && (
          <Typography 
            color="error" 
            variant="caption" 
            sx={{ 
              mb: 2, 
              textAlign: 'center',
              bgcolor: alpha(theme.palette.error.main, 0.1),
              py: 1,
              borderRadius: 1
            }}
          >
            {errors.submit}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={isSubmitting}
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
            {isSubmitting ? 'Saving...' : editMode ? 'Update' : 'Create'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEventDialog;

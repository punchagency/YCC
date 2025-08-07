import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Stack,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Event as EventIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { calendarHelpers } from '../calendarHelpers';
import EventCard from './EventCard';

const DayEventsDialog = ({
  open,
  onClose,
  date,
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onAddGuest,
}) => {
  const theme = useTheme();
  
  if (!date) return null;
  
  const formattedDate = format(date, 'EEEE, MMMM d, yyyy');
  const dayEvents = calendarHelpers.getEventsForDay(events, date);
  
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
          bgcolor: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)',
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
            {formattedDate}
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
      
      <DialogContent sx={{ p: 2, mt: 1, '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: alpha(theme.palette.primary.main, 0.2), borderRadius: '4px' } }}>
        {dayEvents.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 6,
              textAlign: 'center',
            }}
          >
            <EventIcon
              sx={{
                fontSize: 60,
                color: alpha(theme.palette.text.primary, 0.2),
                mb: 2,
              }}
            />
            <Typography variant="h6" color="text.secondary">
              No events scheduled
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Click the button below to add a new event
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2} divider={<Divider flexItem />}>
            {dayEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onUpdate={onUpdateEvent}
                onDelete={onDeleteEvent}
                onAddGuest={onAddGuest}
              />
            ))}
          </Stack>
        )}
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        py: 2, 
        bgcolor: theme.palette.mode === 'light' ? alpha('#f5f5f5', 0.8) : alpha('#1a1a1a', 0.8),
        borderTop: `1px solid ${theme.palette.divider}`,
      }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            onClose();
            onAddEvent(date);
          }}
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
          Add Event
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DayEventsDialog;

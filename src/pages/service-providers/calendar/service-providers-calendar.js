import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from "../../../context/theme/themeContext";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  Snackbar,
  Paper,
  Stack,
  useMediaQuery,
  useTheme as useMuiTheme,
  alpha,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  List as ListIcon,
  Event as EventIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
} from "@mui/icons-material";
import { format, addMonths, subMonths } from 'date-fns';
import { createEvent, fetchEvents, updateEvent, deleteEvent, inviteGuests } from '../../../services/calendar/calendarService';
import { calendarHelpers, eventProcessors, apiHandlers } from './calendarHelpers';

// Import components
import CalendarGrid from './components/CalendarGrid';
import EventCard from './components/EventCard';
import DayEventsDialog from './components/DayEventsDialog';
import CreateEventDialog from './components/CreateEventDialog';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';
import AddGuestDialog from './components/AddGuestDialog';

const ServiceProvidersCalendar = () => {
  // Get page title setter from outlet context
  const { setPageTitle } = useOutletContext() || {};

  // Set page title on component mount
  useEffect(() => {
    if (setPageTitle) setPageTitle("Calendar");
  }, [setPageTitle]);

  // Theme and responsive hooks
  const customTheme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // State management for events, loading, and view modes
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeView, setActiveView] = useState(isMobile ? 'events' : 'calendar'); // 'calendar' or 'events'
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal states
  const [modals, setModals] = useState({
    createEvent: false,
    editEvent: false,
    dayEvents: false,
    deleteConfirmation: false,
    addGuest: false,
  });

  // Operation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Enhanced data fetching with retry logic and better error handling
  const loadEvents = useCallback(async (showLoadingState = true) => {
    if (showLoadingState) {
      setLoading(true);
    }
    setError(null);

    try {
      const { start: startDate, end: endDate } = calendarHelpers.getMonthRange(currentDate);

      const result = await fetchEvents(startDate, endDate);
      if (result.success) {
        const eventsData = result.data || [];
        // Sort events by time for better display
        const sortedEvents = calendarHelpers.sortEventsByTime(eventsData);
        setEvents(sortedEvents);
      } else {
        const errorMessage = apiHandlers.createErrorMessage(result.error, 'Failed to load events');
        setError(errorMessage);
      }
    } catch (err) {
      const errorMessage = apiHandlers.createErrorMessage(err, 'An unexpected error occurred while loading events');
      setError(errorMessage);
    } finally {
      if (showLoadingState) {
        setLoading(false);
      }
    }
  }, [currentDate]);

  // Refresh events without showing loading state (for background updates)
  const refreshEvents = useCallback(async () => {
    await loadEvents(false);
  }, [loadEvents]);

  // Load events on component mount and date changes
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Filtered and processed events for display
  const processedEvents = useMemo(() => {
    return eventProcessors.processEventsForCalendar(events, currentDate);
  }, [events, currentDate]);

  // Handle mobile view toggle
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setActiveView(newView);
    }
  };

  // Navigation handlers
  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Modal handlers
  const openModal = (modalName, data = null) => {
    if (modalName === 'editEvent' || modalName === 'deleteConfirmation' || modalName === 'addGuest') {
      setSelectedEvent(data);
    } else if (modalName === 'dayEvents') {
      setSelectedDate(data);
    } else if (modalName === 'createEvent') {
      setSelectedDate(data || new Date());
    }

    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));

    if (modalName !== 'dayEvents') {
      setSelectedEvent(null);
    }
  };

  // Event handlers
  const handleCreateEvent = async (eventData) => {
    setIsSubmitting(true);

    try {
      const result = await createEvent(eventData);

      if (result.success) {
        showSuccess('Event created successfully');
        await refreshEvents();
      } else {
        showError(apiHandlers.createErrorMessage(result.error, 'Failed to create event'));
      }
    } catch (error) {
      showError(apiHandlers.createErrorMessage(error, 'An error occurred while creating the event'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEvent = async (eventData) => {
    if (!selectedEvent?._id) return;

    setIsSubmitting(true);

    try {
      const result = await updateEvent(selectedEvent._id, eventData);

      if (result.success) {
        showSuccess('Event updated successfully');
        await refreshEvents();
      } else {
        showError(apiHandlers.createErrorMessage(result.error, 'Failed to update event'));
      }
    } catch (error) {
      showError(apiHandlers.createErrorMessage(error, 'An error occurred while updating the event'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent?._id) return;

    setIsSubmitting(true);

    try {
      const result = await deleteEvent(selectedEvent._id);

      if (result.success) {
        showSuccess('Event deleted successfully');
        closeModal('deleteConfirmation');
        await refreshEvents();
      } else {
        showError(apiHandlers.createErrorMessage(result.error, 'Failed to delete event'));
      }
    } catch (error) {
      showError(apiHandlers.createErrorMessage(error, 'An error occurred while deleting the event'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddGuests = async (eventId, guestEmails) => {
    setIsSubmitting(true);

    try {
      const result = await inviteGuests(eventId, guestEmails);

      if (result.success) {
        showSuccess('Invitations sent successfully');
        closeModal('addGuest');
        await refreshEvents();
      } else {
        showError(apiHandlers.createErrorMessage(result.error, 'Failed to send invitations'));
      }
    } catch (error) {
      showError(apiHandlers.createErrorMessage(error, 'An error occurred while sending invitations'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Notification handlers
  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseSuccess = () => {
    setSuccess(null);
  };

  // Show success notification
  const showSuccess = (message) => {
    setSuccess(message);
  };

  // Show error notification
  const showError = (message) => {
    setError(message);
  };

  // Day click handler for calendar
  const handleDayClick = (date) => {
    setSelectedDate(date);
    openModal('dayEvents', date);
  };

  React.useEffect(() => {
    const handleCreateEventModal = () => {
      openModal('createEvent');
    };
    window.addEventListener('openCreateEventModal', handleCreateEventModal);
    return () => window.removeEventListener('openCreateEventModal', handleCreateEventModal);
  }, []);

  return (
    <Box
      sx={{ p: { xs: 0.8, sm: 1, md: 2, lg: 3 }, paddingTop: "50px !important" }}
    >
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 3,
          background: customTheme.theme === "light"
            ? 'linear-gradient(135deg, #003366 0%, #0066cc 100%)'
            : 'linear-gradient(135deg, #001a33 0%, #003366 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', top: -20, right: -20, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', zIndex: 0 }} />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Calendar
              </Typography>
              <Typography sx={{ opacity: 0.9, color: '#fafafa' }}>
                Manage your events and appointments
              </Typography>
            </Box>
            <Chip
              icon={<CalendarIcon />}
              label={`${events.length} Events`}
              sx={{
                bgcolor: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontWeight: 500,
                mt: { xs: 2, sm: 0 },
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
          </Stack>
        </Box>
      </Paper>

      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: 2,
        }}
      >


        {/* <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openModal('createEvent')}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            backgroundColor: "#0387D9",
            color: "white",
            '&:hover': {
              backgroundColor: "#0066cc",
            },
            boxShadow: '0 2px 8px rgba(3, 135, 217, 0.3)',
          }}
        >
          Add Event
        </Button> */}
      </Box>

      {/* Mobile View Toggle */}
      {isMobile && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={activeView}
            exclusive
            onChange={handleViewChange}
            aria-label="calendar view toggle"
            sx={{
              backgroundColor: muiTheme.palette.background.paper,
              borderRadius: 2,
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: '8px !important',
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                py: 1,
                '&.Mui-selected': {
                  backgroundColor: muiTheme.palette.primary.main,
                  color: muiTheme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: muiTheme.palette.primary.dark,
                  },
                },
              },
            }}
          >
            <ToggleButton value="events" aria-label="events view">
              <ListIcon sx={{ mr: 1 }} />
              Events
            </ToggleButton>
            <ToggleButton value="calendar" aria-label="calendar view">
              <CalendarIcon sx={{ mr: 1 }} />
              Calendar
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      {/* Main Content Grid */}
      <Grid container spacing={3} sx={{ minHeight: '600px' }}>
        {/* Events Sidebar/View */}
        <Grid
          item
          xs={12}
          md={4}
          lg={3}
          sx={{
            display: isMobile
              ? (activeView === 'events' ? 'block' : 'none')
              : 'block',
          }}
        >
          <Paper
            elevation={2}
            sx={{
              height: '100%',
              borderRadius: 3,
              overflow: 'hidden',
              backgroundColor: customTheme.theme === 'light' ? '#ffffff' : '#1a1a1a',
              border: `1px solid ${alpha(muiTheme.palette.divider, 0.5)}`,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${muiTheme.palette.divider}`,
                backgroundColor: customTheme.theme === 'light' ? alpha('#003366', 0.05) : alpha('#003366', 0.15),
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: muiTheme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <ListIcon />
                Events
              </Typography>
            </Box>

            <Box sx={{ p: 2, height: 'calc(100% - 60px)', overflow: 'auto' }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    color: muiTheme.palette.text.secondary,
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Failed to load events
                  </Typography>

                </Box>
              ) : processedEvents.currentMonth.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    color: muiTheme.palette.text.secondary,
                  }}
                >
                  <EventIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1">
                    No events for {format(currentDate, 'MMMM yyyy')}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Click "Add Event" to create your first event
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {processedEvents.currentMonth.map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      onUpdate={(event) => openModal('editEvent', event)}
                      onDelete={(event) => openModal('deleteConfirmation', event)}
                      onAddGuest={(event) => openModal('addGuest', event)}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Calendar Grid */}
        <Grid
          item
          xs={12}
          md={8}
          lg={9}
          sx={{
            display: isMobile
              ? (activeView === 'calendar' ? 'block' : 'none')
              : 'block',
          }}
        >
          <Paper
            elevation={2}
            sx={{
              height: 'auto',
              borderRadius: 3,
              overflow: 'hidden',
              backgroundColor: customTheme.theme === 'light' ? '#ffffff' : '#1a1a1a',
              border: `1px solid ${alpha(muiTheme.palette.divider, 0.5)}`,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${muiTheme.palette.divider}`,
                backgroundColor: customTheme.theme === 'light' ? alpha('#003366', 0.05) : alpha('#003366', 0.15),
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: muiTheme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <CalendarIcon />
                {format(currentDate, 'MMMM yyyy')}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  onClick={handlePreviousMonth}
                  sx={{
                    minWidth: 'auto',
                    p: 1,
                    borderRadius: 2,
                    color: '#0387D9',
                    '&:hover': {
                      backgroundColor: alpha('#0387D9', 0.1),
                    },
                  }}
                >
                  <ChevronLeftIcon />
                </Button>
                <Button
                  size="small"
                  onClick={handleToday}
                  variant="outlined"
                  startIcon={<TodayIcon />}
                  sx={{
                    textTransform: 'none',
                    px: 2,
                    borderRadius: 2,
                    borderColor: '#0387D9',
                    color: '#0387D9',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#0066cc',
                      backgroundColor: alpha('#0387D9', 0.1),
                    },
                  }}
                >
                  Today
                </Button>
                <Button
                  size="small"
                  onClick={handleNextMonth}
                  sx={{
                    minWidth: 'auto',
                    p: 1,
                    borderRadius: 2,
                    color: '#0387D9',
                    '&:hover': {
                      backgroundColor: alpha('#0387D9', 0.1),
                    },
                  }}
                >
                  <ChevronRightIcon />
                </Button>
              </Stack>
            </Box>

            <Box sx={{ p: 2, height: 'calc(100% - 60px)', overflow: 'auto' }}>
              {loading ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'auto',
                  }}
                >
                  <CircularProgress size={40} />
                </Box>
              ) : error ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    color: muiTheme.palette.text.secondary,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Failed to load calendar
                  </Typography>

                </Box>
              ) : (
                <CalendarGrid
                  currentDate={currentDate}
                  events={events}
                  onDayClick={handleDayClick}
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialogs */}
      <CreateEventDialog
        open={modals.createEvent}
        onClose={() => closeModal('createEvent')}
        onSave={handleCreateEvent}
        initialDate={selectedDate}
        editMode={false}
      />

      <CreateEventDialog
        open={modals.editEvent}
        onClose={() => closeModal('editEvent')}
        onSave={handleUpdateEvent}
        editMode={true}
        eventData={selectedEvent}
      />

      <DayEventsDialog
        open={modals.dayEvents}
        onClose={() => closeModal('dayEvents')}
        date={selectedDate}
        events={events}
        onAddEvent={(date) => {
          closeModal('dayEvents');
          openModal('createEvent', date);
        }}
        onUpdateEvent={(event) => {
          closeModal('dayEvents');
          openModal('editEvent', event);
        }}
        onDeleteEvent={(event) => {
          closeModal('dayEvents');
          openModal('deleteConfirmation', event);
        }}
        onAddGuest={(event) => {
          closeModal('dayEvents');
          openModal('addGuest', event);
        }}
      />

      <DeleteConfirmationDialog
        open={modals.deleteConfirmation}
        onClose={() => closeModal('deleteConfirmation')}
        onConfirm={handleDeleteEvent}
        event={selectedEvent}
        isDeleting={isSubmitting}
      />

      <AddGuestDialog
        open={modals.addGuest}
        onClose={() => closeModal('addGuest')}
        onAddGuests={handleAddGuests}
        event={selectedEvent}
        isSubmitting={isSubmitting}
      />

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ServiceProvidersCalendar;
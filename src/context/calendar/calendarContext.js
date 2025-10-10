import { createContext, useState, useContext, useCallback } from "react";
import { fetchEvents, createEvent, addGuestService, updateEvent as updateEventService, deleteEvent as deleteEventService } from "../../services/calendar/calendarService";
import { useToast } from '../toast/toastContext';
export const CalendarContext = createContext();


export const useCalendar = () => {
    const context = useContext(CalendarContext);
 
    if (!context) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
}

export const CalendarProvider = ({ children }) => {
    const { toast } = useToast();
    const startOfCurrentMonth = new Date();
startOfCurrentMonth.setDate(1);
startOfCurrentMonth.setHours(0, 0, 0, 0);

const endOfCurrentMonth = new Date(startOfCurrentMonth);
endOfCurrentMonth.setMonth(endOfCurrentMonth.getMonth() + 1);
endOfCurrentMonth.setDate(0); // Sets to the last day of the previous month (i.e., current month)
endOfCurrentMonth.setHours(23, 59, 59, 999);

const startOfNextMonth = new Date(endOfCurrentMonth);
startOfNextMonth.setDate(1);
startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);
startOfNextMonth.setHours(0, 0, 0, 0);

const endOfNextMonth = new Date(startOfNextMonth);
endOfNextMonth.setMonth(endOfNextMonth.getMonth() + 1);
endOfNextMonth.setDate(0);
endOfNextMonth.setHours(23, 59, 59, 999);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startDate, setStartDate] = useState(startOfCurrentMonth);
    const [endDate, setEndDate] = useState(endOfCurrentMonth);
    const [events, setEvents] = useState([]);
    const [eventsForTodayAndTomorrow, setEventsForTodayAndTomorrow] = useState([]);

    const addEvent = async (event) => {
        const response = await createEvent(event);
        if (response.success) {
            fetchEventsForTodayAndTomorrow()
            setEvents([...events, response.data.data]);
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Event added successfully' });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: response.error || 'Failed to add event' });
        }
    }

    const fetchEventsByDate = useCallback(async (startDate, endDate) => {
        if (!startDate || !endDate) {
            startDate = startOfCurrentMonth;
            endDate = endOfCurrentMonth;
        }
        const response = await fetchEvents(startDate, endDate);
        if (response && response.data && response.data.data) {
            setEvents(response.data.data);
        } else {
            setEvents([]);
        }
    }, []);

    const fetchEventsForTodayAndTomorrow = useCallback(async () => {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        const startOfTomorrow = new Date();
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
        startOfTomorrow.setHours(0, 0, 0, 0);
        const endOfTomorrow = new Date();
        endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
        endOfTomorrow.setHours(23, 59, 59, 999);
        const response = await fetchEvents(startOfToday, endOfTomorrow);
        if (response && response.data && response.data.data) {
            setEventsForTodayAndTomorrow(response.data.data);
        } else {
            setEventsForTodayAndTomorrow([]);
        }
    }, []);

    const addGuest = async (eventId, guestEmails) => {
        const response = await addGuestService(eventId, guestEmails);
        if (response.success) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Guest added successfully' });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: response.error || 'Failed to add guest' });
        }
        fetchEventsByDate();
    }

    const updateEvent = async (eventId, eventData) => {
        if (!eventId) {
            console.error('No eventId provided to updateEvent');
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No event ID provided' });
            return;
        }
        
        try {
            const response = await updateEventService(eventId, eventData);
            
            if (response.success) {
                // Update the events in state
                setEvents(events.map(event => {
                    const currentEventId = event._id || event.id;
                    return currentEventId === eventId ? { ...event, ...eventData } : event;
                }));
                fetchEventsByDate();
                fetchEventsForTodayAndTomorrow();
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Event updated successfully' });
            } else {
                console.error('Update failed:', response.error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: response.error || 'Failed to update event' });
            }
        } catch (error) {
            console.error('Error in updateEvent:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred' });
        }
    }

    const removeEvent = async (eventId) => {
        if (!eventId) {
            console.error('No eventId provided to removeEvent');
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No event ID provided' });
            return;
        }
        
        try {
            const response = await deleteEventService(eventId);
            
            if (response.success) {
                // Remove the event from state
                setEvents(events.filter(event => {
                    const currentEventId = event._id || event.id;
                    return currentEventId !== eventId;
                }));
                fetchEventsByDate();
                fetchEventsForTodayAndTomorrow();
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Event deleted successfully' });
            } else {
                console.error('Delete failed:', response.error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: response.error || 'Failed to delete event' });
            }
        } catch (error) {
            console.error('Error in removeEvent:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred' });
        }
    }
        const value = {
            selectedDate,
            setSelectedDate,
            events,
            setEvents,
            fetchEventsByDate,
            addEvent,
            updateEvent,
            removeEvent,
            startDate,
            setStartDate,
            endDate,
            setEndDate,
            addGuest,
            eventsForTodayAndTomorrow,
            fetchEventsForTodayAndTomorrow,

        }
  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};



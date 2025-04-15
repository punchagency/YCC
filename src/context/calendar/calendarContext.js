import { createContext, useState, useContext } from "react";
import { fetchEvents, createEvent, addGuestService } from "../../services/calendar/calendarService";
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
    const currentMonth = new Date();
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startDate, setStartDate] = useState(currentMonth);
    const [endDate, setEndDate] = useState(nextMonth);
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

    const fetchEventsByDate = async (startDate, endDate) => {
        if (!startDate || !endDate) {
            startDate = currentMonth;
            endDate = nextMonth;
        }
        const response = await fetchEvents(startDate, endDate);
        setEvents(response.data.data || []);
    };

    const fetchEventsForTodayAndTomorrow = async () => {
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
        setEventsForTodayAndTomorrow(response.data.data || []);
    };

    const addGuest = async (eventId, guestEmails) => {
        const response = await addGuestService(eventId, guestEmails);
        if (response.success) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Guest added successfully' });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: response.error || 'Failed to add guest' });
        }
        fetchEventsByDate();
    }
        const value = {
            selectedDate,
            setSelectedDate,
            events,
            setEvents,
            fetchEventsByDate,
            addEvent,
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



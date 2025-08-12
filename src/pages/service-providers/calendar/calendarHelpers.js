import { format, startOfMonth, endOfMonth, addDays, startOfWeek, endOfWeek, isSameMonth, isSameDay, parseISO, isToday, isAfter } from 'date-fns';

// Calendar utility functions
export const calendarHelpers = {
  // Get the range for a month (first day to last day)
  getMonthRange: (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return { start, end };
  },
  
  // Get calendar days including days from previous and next months to fill the grid
  getCalendarDays: (date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const days = [];
    let currentDate = startDate;
    
    while (currentDate <= endDate) {
      days.push({
        date: currentDate,
        isCurrentMonth: isSameMonth(currentDate, monthStart),
        isToday: isToday(currentDate),
      });
      currentDate = addDays(currentDate, 1);
    }
    
    return days;
  },
  
  // Parse date from ISO string
  parseEventDate: (dateString) => {
    return parseISO(dateString);
  },
  
  // Check if a date is today
  isDateToday: (date) => {
    return isToday(date);
  },
  
  // Format event time for display
  formatEventTime: (start, end) => {
    const startDate = parseISO(start);
    const endDate = end ? parseISO(end) : null;
    
    const timeFormat = 'h:mm a';
    const dateFormat = 'MMM d';
    
    if (isToday(startDate)) {
      return `Today, ${format(startDate, timeFormat)}${endDate ? ` - ${format(endDate, timeFormat)}` : ''}`;
    }
    
    return `${format(startDate, dateFormat)}, ${format(startDate, timeFormat)}${
      endDate ? ` - ${format(endDate, timeFormat)}` : ''
    }`;
  },
  
  // Sort events by date and time
  sortEventsByTime: (events) => {
    return [...events].sort((a, b) => {
      const dateA = parseISO(a.start);
      const dateB = parseISO(b.start);
      return dateA - dateB;
    });
  },
  
  // Get events for a specific day
  getEventsForDay: (events, day) => {
    return events.filter(event => {
      const eventDate = parseISO(event.start);
      return isSameDay(eventDate, day);
    });
  },
  
  // Format location for display
  formatLocation: (location) => {
    const locationMap = {
      zoom: "Virtual - Zoom Meeting",
      "google-meet": "Virtual - Google Meet",
      "ms-teams": "Virtual - Microsoft Teams",
      "in-person": "In Person Meeting",
    };
    return locationMap[location] || location;
  },
};

// Event processing functions
export const eventProcessors = {
  // Process events for calendar display
  processEventsForCalendar: (events, currentDate) => {
    const today = new Date();
    
    return {
      // Events in the current month
      currentMonth: events.filter(event => {
        const eventDate = parseISO(event.start);
        return isSameMonth(eventDate, currentDate);
      }),
      
      // Upcoming events (today and future)
      upcoming: events.filter(event => {
        const eventDate = parseISO(event.start);
        return isAfter(eventDate, today) || isToday(eventDate);
      }).slice(0, 5), // Limit to 5 upcoming events
      
      // Today's events
      today: events.filter(event => {
        const eventDate = parseISO(event.start);
        return isToday(eventDate);
      }),
    };
  },
  
  // Group events by day for calendar grid
  groupEventsByDay: (events, days) => {
    return days.map(day => {
      const dayEvents = events.filter(event => {
        const eventDate = parseISO(event.start);
        return isSameDay(eventDate, day.date);
      });
      
      return {
        ...day,
        events: dayEvents,
      };
    });
  },
};

// API response handlers
export const apiHandlers = {
  // Handle API response
  handleApiResponse: (response, successMessage) => {
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: successMessage,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  },
  
  // Create error message
  createErrorMessage: (error, defaultMessage) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    return defaultMessage;
  },
};

// Form validation functions
export const formValidators = {
  // Validate event form
  validateEventForm: (eventData) => {
    const errors = {};
    
    if (!eventData.title?.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!eventData.start) {
      errors.start = 'Start date is required';
    }
    
    if (eventData.end && eventData.start) {
      // Handle different types of date inputs (Date objects or ISO strings)
      let endDate, startDate;
      
      try {
        // If they're Date objects, use them directly
        if (eventData.end instanceof Date) {
          endDate = eventData.end;
        } else {
          // Otherwise try to parse as ISO string
          endDate = parseISO(String(eventData.end));
        }
        
        if (eventData.start instanceof Date) {
          startDate = eventData.start;
        } else {
          startDate = parseISO(String(eventData.start));
        }
        
        // Compare the dates
        if (endDate < startDate) {
          errors.end = 'End date must be after start date';
        }
      } catch (error) {
        console.error('Error comparing dates:', error);
        errors.end = 'Invalid date format';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
  
  // Validate email format
  validateEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },
};
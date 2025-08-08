import React, { useState } from 'react';
import { format } from 'date-fns';
import { calendarHelpers, eventProcessors } from '../calendarHelpers';
import { Box, Typography, useTheme, alpha } from '@mui/material';

const CalendarGrid = ({ currentDate, events, onDayClick }) => {
  const days = calendarHelpers.getCalendarDays(currentDate);
  const daysWithEvents = eventProcessors.groupEventsByDay(events, days);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [hoveredDayIndex, setHoveredDayIndex] = useState(null);
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {/* Weekday Headers */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 1,
          pb: 1
        }}
      >
        {weekdays.map((day, index) => (
          <Box 
            key={day} 
            sx={{ 
              py: 1,
              textAlign: 'center',
              fontWeight: 600,
              color: index === 0 || index === 6 
                ? alpha(theme.palette.text.primary, 0.7) 
                : theme.palette.text.primary,
            }}
          >
            <Typography variant="subtitle2">{day}</Typography>
          </Box>
        ))}
      </Box>

      {/* Calendar Days Grid */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridTemplateRows: 'repeat(6, 1fr)',
          gap: 1,
          height: 'calc(100% - 48px)',
        }}
      >
        {daysWithEvents.map((day, index) => {
          const isHovered = hoveredDayIndex === index;
          return (
            <Box
              key={index}
              onClick={() => onDayClick(day.date)}
              onMouseEnter={() => setHoveredDayIndex(index)}
              onMouseLeave={() => setHoveredDayIndex(null)}
              sx={{
                position: 'relative',
                height: '100%',
                p: 1,
                borderRadius: 2,
                cursor: 'pointer',
                bgcolor: day.isToday 
                  ? alpha('#0387D9', 0.1)
                  : day.isCurrentMonth 
                    ? theme.palette.background.paper
                    : alpha(theme.palette.action.disabledBackground, 0.3),
                border: day.isToday 
                  ? `1px solid #0387D9`
                  : `1px solid ${theme.palette.divider}`,
                boxShadow: isHovered ? '0 4px 6px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  borderColor: day.isToday ? '#0387D9' : alpha(theme.palette.primary.main, 0.5),
                }
              }}
            >
              {/* Day Number */}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: day.isToday ? 700 : day.isCurrentMonth ? 500 : 400,
                  color: !day.isCurrentMonth 
                    ? alpha(theme.palette.text.secondary, 0.5)
                    : day.isToday 
                      ? '#0387D9'
                      : theme.palette.text.primary,
                  mb: 0.5,
                  textAlign: 'right',
                  transition: 'color 0.3s ease',
                }}
              >
                {format(day.date, 'd')}
              </Typography>

              {/* Events for the day */}
              {day.events.length > 0 ? (
                <Box sx={{ mt: 0.5, overflow: 'hidden' }}>
                  {day.events.slice(0, 2).map((event, idx) => {
                    // Determine color based on event type/location
                    const eventColor = event.location === 'zoom' || event.location === 'google-meet' || event.location === 'ms-teams'
                      ? '#0387D9'
                      : event.location === 'in-person'
                        ? '#4caf50'
                        : '#ff9800';
                        
                    return (
                      <Box
                        key={event._id || idx}
                        sx={{
                          bgcolor: eventColor,
                          color: 'white',
                          py: 0.25,
                          px: 0.75,
                          borderRadius: 1,
                          fontSize: '10px',
                          mb: 0.5,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          transition: 'all 0.3s ease',
                          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontWeight: 500,
                        }}
                        title={event.title}
                      >
                        <Typography variant="caption" sx={{ fontSize: '9px', fontWeight: 600 }}>
                          {format(calendarHelpers.parseEventDate(event.start), 'h:mm')}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '9px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {event.title}
                        </Typography>
                      </Box>
                    );
                  })}
                  
                  {/* More events indicator */}
                  {day.events.length > 2 && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#0387D9',
                        fontWeight: 600,
                        textAlign: 'center',
                        display: 'block',
                        fontSize: '10px',
                        transition: 'color 0.3s ease',
                      }}
                    >
                      +{day.events.length - 2} more
                    </Typography>
                  )}
                </Box>
              ):(
                <Box sx={{ mt: 0.5, overflow: 'hidden', height: '20px' }}>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CalendarGrid;

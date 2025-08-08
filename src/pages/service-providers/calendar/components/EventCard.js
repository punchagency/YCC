import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  MoreVert as MoreVertIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  People as PeopleIcon
} from '@mui/icons-material';


const EventCard = ({ event, onUpdate, onDelete, onAddGuest }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    handleMenuClose();
    onUpdate(event);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(event);
  };

  const handleAddGuest = () => {
    handleMenuClose();
    onAddGuest(event);
  };

  // Helper function to format the date/time
  const formatEventTime = (startDate) => {
    const date = new Date(startDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Helper function to format location
  const formatLocation = (location) => {
    const locationMap = {
      zoom: "Virtual - Zoom Meeting",
      "google-meet": "Virtual - Google Meet",
      "ms-teams": "Virtual - Microsoft Teams",
      "in-person": "In Person Meeting",
    };
    return locationMap[location] || location;
  };

  // Add this helper function to get guest count
  const getGuestCount = () => {
    const emailCount = event.guestEmails?.length || 0;
    const guestCount = event.guests?.length || 0;
    return emailCount + guestCount;
  };

  return (
    <Card
      elevation={isHovered ? 3 : 1}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        '&:hover': {
          borderColor: alpha(theme.palette.primary.main, 0.3),
        },
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Colored top border based on event type/location */}
      <Box sx={{ 
        height: '4px', 
        width: '100%', 
        bgcolor: event.location === 'zoom' || event.location === 'google-meet' || event.location === 'ms-teams' 
          ? '#0387D9' 
          : event.location === 'in-person' 
            ? '#4caf50' 
            : '#ff9800' 
      }} />
      
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha('#0387D9', 0.1),
              color: '#0387D9',
              width: 40,
              height: 40,
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <EventIcon />
          </Avatar>
          
          <Box sx={{ flex: 1, pr: 4 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600, 
                mb: 0.5,
                color: isHovered ? '#0387D9' : 'text.primary',
                transition: 'color 0.3s ease',
                lineHeight: 1.2,
              }}
            >
              {event.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                mb: 0.5,
                fontSize: '0.875rem',
              }}
            >
              {formatEventTime(event.start)}
            </Typography>
            
            {event.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <LocationIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5, fontSize: '0.875rem' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatLocation(event.location)}
                </Typography>
              </Box>
            )}
            
            {event.description && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
                <DescriptionIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5, fontSize: '0.875rem', mt: 0.3 }} />
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {event.description}
                </Typography>
              </Box>
            )}

            {getGuestCount() > 0 && (
              <Chip
                icon={<PeopleIcon fontSize="small" />}
                label={`${getGuestCount()} ${getGuestCount() === 1 ? "guest" : "guests"}`}
                size="small"
                sx={{ 
                  mt: 1, 
                  bgcolor: alpha('#0387D9', 0.1),
                  color: '#0387D9',
                  fontWeight: 500,
                  '& .MuiChip-icon': { color: '#0387D9' }
                }}
              />
            )}
          </Box>
          
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: theme.palette.text.secondary,
              '&:hover': {
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                borderRadius: 2,
                minWidth: 180,
                boxShadow: '0px 5px 15px rgba(0,0,0,0.15)',
              }
            }}
          >
            <MenuItem onClick={handleUpdate}>
              <ListItemIcon>
                <EditIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
              </ListItemIcon>
              <ListItemText>Update Event</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleAddGuest}>
              <ListItemIcon>
                <PersonAddIcon fontSize="small" sx={{ color: theme.palette.info.main }} />
              </ListItemIcon>
              <ListItemText>Add Guest</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
              </ListItemIcon>
              <ListItemText>Delete Event</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;

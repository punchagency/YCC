import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import Logo from '../../assets/images/logo-login.png';
import { useNavigate, useLocation } from 'react-router-dom';


const DashboardSidebar = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = [
    { icon: <DashboardIcon />, text: "Dashboard", active: true, link: "/new/dashboard" },
    { icon: <CalendarTodayIcon />, text: "Calendar", link: "/new/calendar" },
    { icon: <InventoryIcon />, text: "Inventory Management", link: "/new/inventory" },
    { icon: <ShoppingCartIcon />, text: "Orders", badge: 8, link: "/new/orders" },
    { icon: <BookOnlineIcon />, text: "Bookings", link: "/new/bookings" },
    { icon: <AccountBalanceWalletIcon />, text: "Financial Management", link: "/new/financial" },
    { icon: <NotificationsIcon />, text: "Notifications", link: "/new/notifications" },
    { icon: <AssessmentIcon />, text: "Reports", link: "/new/reports" },
    { icon: <SettingsIcon />, text: "Settings", link: "/new/settings" },
  ];

  const handleMenuItemClick = (item) => {
    navigate(item.link);
  };



  return (
    <Box sx={{
      width: '210px',
      position: 'fixed',
      height: '100vh',
      backgroundColor: 'white',
      borderRight: '1px solid #E3E3E3',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{
        padding: '16px',
        borderBottom: '1px solid #E3E3E3',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <img
          src={Logo}
          alt="Yacht Centre Logo"
          style={{ width: '120px' }}
        />
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '8px',
        gap: '4px'
      }}>
        {menuItems.map((item, index) => (
          <MenuItem key={index} active={location.pathname === item.link} onClick={() => handleMenuItemClick(item)}>
            <MenuItemIcon>{item.icon}</MenuItemIcon>
            <MenuItemText active={location.pathname === item.link}>{item.text}</MenuItemText>
            {item.badge && (
              <MenuBadge>{item.badge}</MenuBadge>
            )}
          </MenuItem>
        ))}
      </Box>
    </Box>
  );
};

const MenuItem = styled(Box)(({ active }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  backgroundColor: active ? '#0387D9' : 'transparent',
  color: active ? 'white' : '#646464',
  '&:hover': {
    backgroundColor: active ? '#0387D9' : '#F5F5F5',
  }
}));

const MenuItemIcon = styled(Box)({
  marginRight: '8px',
  display: 'flex',
  alignItems: 'center',
  '& > svg': {
    fontSize: '20px'
  }
});

const MenuItemText = styled(Typography)(({ active }) => ({
  fontFamily: 'Plus Jakarta Sans',
  fontWeight: 600,
  fontSize: '12px',
  lineHeight: '100%',
  letterSpacing: '0%',
  textTransform: 'capitalize',
  color: active ? 'white' : '#212121'
}));

const MenuBadge = styled(Box)({
  backgroundColor: '#EF4444',
  color: 'white',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  marginLeft: 'auto',
  fontFamily: 'Inter'
});

export default DashboardSidebar;
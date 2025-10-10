import React from "react";
import { Box, Typography, Popover, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useTheme } from "../../context/theme/themeContext";

const EventOptionsMenu = ({ open, handleClose, onEdit, onDelete, onAddGuest, anchorEl }) => {
  const { theme } = useTheme();

  const menuItems = [
    {
      icon: <EditIcon sx={{ fontSize: "18px" }} />,
      label: "Edit Event",
      onClick: () => {
        onEdit();
        handleClose();
      },
      color: "#0387d9"
    },
    {
      icon: <DeleteIcon sx={{ fontSize: "18px" }} />,
      label: "Delete Event",
      onClick: () => {
        onDelete();
        handleClose();
      },
      color: "#d32f2f"
    },
    {
      icon: <PersonAddIcon sx={{ fontSize: "18px" }} />,
      label: "Add Guest",
      onClick: () => {
        onAddGuest();
        handleClose();
      },
      color: "#2e7d32"
    }
  ];

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{
        '& .MuiPopover-paper': {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px',
          minWidth: '160px',
        }
      }}
    >
      <Paper
        sx={{
          backgroundColor: theme === "light" ? "#ffffff" : "#2d2d2d",
          border: theme === "light" ? "1px solid #e0e0e0" : "1px solid #444444",
        }}
      >
        <Box sx={{ py: 1 }}>
          {menuItems.map((item, index) => (
            <Box
              key={index}
              onClick={item.onClick}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: theme === "light" ? "#f5f5f5" : "#333333",
                },
              }}
            >
              <Box
                sx={{
                  color: item.color,
                  mr: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {item.icon}
              </Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: theme === "light" ? "#212121" : "white",
                }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Popover>
  );
};

export default EventOptionsMenu;

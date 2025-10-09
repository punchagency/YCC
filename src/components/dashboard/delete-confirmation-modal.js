import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Dialog } from "primereact/dialog";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";

const DeleteConfirmationModal = ({ open, handleClose, onConfirm, eventTitle }) => {
  return (
    <Dialog
      visible={open}
      onHide={handleClose}
      header="Delete Event"
      style={{ width: "400px" }}
    >
      <Box sx={{ textAlign: "center", py: 2 }}>
        <Typography
          variant="body1"
          sx={{ 
            fontSize: "16px", 
            color: "#000000", 
            mb: 1,
            fontWeight: 500 
          }}
        >
          Are you sure you want to delete this event?
        </Typography>
        
        <Typography
          variant="body2"
          sx={{ 
            fontSize: "14px", 
            color: "#666666", 
            mb: 3,
            fontStyle: "italic"
          }}
        >
          "{eventTitle}"
        </Typography>
        
        <Typography
          variant="body2"
          sx={{ 
            fontSize: "12px", 
            color: "#999999", 
            mb: 3 
          }}
        >
          This action cannot be undone.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          startIcon={<CancelIcon />}
          sx={{
            borderColor: "#666666",
            color: "#666666",
            borderRadius: "10px",
            padding: "10px 20px",
            fontWeight: 500,
            textTransform: "none",
            fontSize: "12px",
            ":hover": {
              borderColor: "#333333",
              color: "#333333",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          sx={{
            bgcolor: "#d32f2f",
            color: "#ffffff",
            borderRadius: "10px",
            padding: "10px 20px",
            fontWeight: 500,
            textTransform: "none",
            fontSize: "12px",
            ":hover": {
              bgcolor: "#b71c1c",
            },
          }}
          onClick={onConfirm}
        >
          Delete Event
        </Button>
      </Box>
    </Dialog>
  );
};

export default DeleteConfirmationModal;

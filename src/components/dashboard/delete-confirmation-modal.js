import React from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";

const DeleteConfirmationModal = ({ open, handleClose, onConfirm, eventTitle, zIndex = 1300 }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
        <Typography variant="h6" fontWeight={600}>Delete Event</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
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
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, justifyContent: "center" }}>
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
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;

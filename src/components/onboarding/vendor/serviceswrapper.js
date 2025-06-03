import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    useTheme,
    useMediaQuery,
    IconButton,
  } from "@mui/material";
  import { Close as CloseIcon } from "@mui/icons-material";
  import { useState } from "react";
  import { Toast } from "primereact/toast";
  import { useRef } from "react";
  import { useParams } from 'react-router-dom';
  
  const ServicesWrapper = ({ servicesData, onServiceUpdate }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editedItem, setEditedItem] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const toast = useRef(null);
    const { id: userId } = useParams(); // Get userId from URL params
  
    // Sample data - replace with your actual data source
    const handleRowClick = (serviceItem) => {
      setSelectedItem(serviceItem);
      setEditedItem({
        name: serviceItem.name,
        description: serviceItem.description,
        price: serviceItem.price,
      });
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      setSelectedItem(null);
      setEditedItem(null);
    };
  
    const handleSave = async () => {
      try {
        setIsUpdating(true);
        
        if (!userId) {
          throw new Error('User ID not found');
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/services/update/${selectedItem._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            name: editedItem.name,
            price: editedItem.price,
            description: editedItem.description
          }),
        });

        const data = await response.json();

        if (!data.status) {
          throw new Error(data.message || 'Failed to update service');
        }

        // Call the callback to update the parent component's state
        if (onServiceUpdate) {
          onServiceUpdate(data.data);
        }

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Service updated successfully",
        });

        handleClose();
      } catch (error) {
        console.error('Error updating service:', error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.message || "Failed to update service",
        });
      } finally {
        setIsUpdating(false);
      }
    };
  
    const handleChange = (field) => (event) => {
      setEditedItem({
        ...editedItem,
        [field]: event.target.value,
      });
    };
  
    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: 'auto' }}>
        <Toast ref={toast} />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '14px', sm: '16px' }
                }}>Service Name</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '14px', sm: '16px' },
                  display: { xs: 'none', sm: 'table-cell' }
                }}>Description</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '14px', sm: '16px' }
                }}>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicesData.map((item) => (
                <TableRow
                  key={item._id}
                  onClick={() => handleRowClick(item)}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      cursor: "pointer",
                    },
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell sx={{ 
                    fontSize: { xs: '14px', sm: '16px' },
                    py: { xs: 1, sm: 2 }
                  }}>{item.name}</TableCell>
                  <TableCell sx={{ 
                    fontSize: { xs: '14px', sm: '16px' },
                    display: { xs: 'none', sm: 'table-cell' },
                    py: { xs: 1, sm: 2 }
                  }}>{item.description}</TableCell>
                  <TableCell sx={{ 
                    fontSize: { xs: '14px', sm: '16px' },
                    py: { xs: 1, sm: 2 }
                  }}>${item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        <Dialog 
          open={open} 
          onClose={handleClose} 
          maxWidth="sm" 
          fullWidth 
          PaperProps={{
            sx: {
              width: { xs: '95%', sm: '500px' },
              m: { xs: 2, sm: 3 }
            }
          }}
        >
          <DialogTitle sx={{ 
            p: { xs: 1.5, sm: 2 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            Edit Service
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2, 
              pt: { xs: 1, sm: 2 }
            }}>
              <TextField
                label="Service Name"
                value={editedItem?.name || ''}
                onChange={handleChange('name')}
                fullWidth
                size={isMobile ? "small" : "medium"}
              />
              <TextField
                label="Price"
                type="number"
                value={editedItem?.price || ''}
                onChange={handleChange('price')}
                fullWidth
                size={isMobile ? "small" : "medium"}
              />
              <TextField
                label="Description"
                value={editedItem?.description || ''}
                onChange={handleChange('description')}
                fullWidth
                multiline
                rows={isMobile ? 2 : 3}
                size={isMobile ? "small" : "medium"}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ 
            p: { xs: 1.5, sm: 2 },
            gap: 1
          }}>
            <Button 
              onClick={handleClose}
              fullWidth={isMobile}
              size={isMobile ? "small" : "medium"}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained"
              fullWidth={isMobile}
              size={isMobile ? "small" : "medium"}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
  
  export default ServicesWrapper;


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
  } from "@mui/material";
  import { useState } from "react";
  import { useService } from "../../../context/service/serviceContext";
  import { useToast } from "../../../context/toast/toastContext";
  import DeleteIcon from '@mui/icons-material/Delete';
  import AddBoxIcon from '@mui/icons-material/AddBox';
  import EditIcon from '@mui/icons-material/Edit';
  const ServicesWrapper = ({ servicesData, setServicesData }) => {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editedItem, setEditedItem] = useState(null);
    const { updateService, createService, deleteService } = useService();
    const { toast } = useToast();

    const handleCreateNew = () => {
      setSelectedItem(null);
      setEditedItem({
        name: '',
        description: '',
        price: '',
      });
      setOpen(true);
    };

    const handleDelete = async (serviceItem, event) => {
      event.stopPropagation(); // Prevent row click
      try {
        const response = await deleteService(serviceItem._id);
        if (response.status) {
          setServicesData(servicesData.filter(item => item._id !== serviceItem._id));
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while deleting the service'
        });
      }
    };

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
        if (selectedItem) {
          // Update existing service
          const updatedService = {
            _id: selectedItem._id,
            name: editedItem.name,
            description: editedItem.description,
            price: editedItem.price,
          };
          const response = await updateService(selectedItem._id, updatedService);
          if (response.status) {
            setServicesData(servicesData.map(item => item._id === selectedItem._id ? updatedService : item));
          }
        } else {
          // Create new service
          const response = await createService(editedItem);
          if (response.status) {
            setServicesData([...servicesData, response.data.services]);
          }
        }
        handleClose();
      } catch (error) {
        console.error('Error saving service:', error);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while saving the service'
        });
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
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
           variant="contained"
           startIcon={
             <AddBoxIcon sx={{ fontSize: "16px" }} />
           }
           sx={{
             bgcolor: "#0387d9",
             color: "#ffffff",
             borderRadius: "10px",
             padding: { xs: "8px 15px", md: "10px 20px" },
             fontWeight: 500,
             textTransform: "none",
             fontSize: { xs: "11px", md: "12px" },
             "&:hover": {
               bgcolor: "rgba(3, 135, 217, 0.9)",
             },
           }}
          onClick={handleCreateNew}>
            Add New Service
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Service Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
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
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="text"
                        color="error"
                        onClick={(e) => handleDelete(item, e)}
                        size="small"
                        sx={{
                          minWidth: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.04)',
                          },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: '20px' }} />
                      </Button>

                      <Button
                        variant="text"
                        color="primary"
                        onClick={(e) => handleRowClick(item)}
                        size="small"
                        sx={{
                          minWidth: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.04)',
                          },
                        }}
                      >
                        <EditIcon sx={{ fontSize: '20px' }} />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth disablePortal>
          <DialogTitle>{selectedItem ? 'Edit Service' : 'Create New Service'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Service Name"
                value={editedItem?.name || ''}
                onChange={handleChange('name')}
                fullWidth
              />
              <TextField
                label="Price"
                type="number"
                value={editedItem?.price || ''}
                onChange={handleChange('price')}
                fullWidth
              />
              <TextField
                label="Description"
                value={editedItem?.description || ''}
                onChange={handleChange('description')}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
  
  export default ServicesWrapper;

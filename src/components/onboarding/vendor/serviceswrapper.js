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
  
  const ServicesWrapper = ({ servicesData }) => {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editedItem, setEditedItem] = useState(null);
  
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
  
    const handleSave = () => {
      console.log('Saving updated item:', {
        ...selectedItem,
        service: {
          ...selectedItem,
          name: editedItem.name,
          description: editedItem.description,
          price: editedItem.price,
        },
      });
      // Add your save logic here
      handleClose();
    };
  
    const handleChange = (field) => (event) => {
      setEditedItem({
        ...editedItem,
        [field]: event.target.value,
      });
    };
  
    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: 'auto' }}>
  
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Service Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth disablePortal>
          <DialogTitle>Edit Services</DialogTitle>
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

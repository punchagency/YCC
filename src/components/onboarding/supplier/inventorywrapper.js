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
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useInventory } from "../../../context/inventory/inventoryContext";
import { useToast } from "../../../context/toast/toastContext";
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';

const InventoryWrapper = ({ inventoryData, setInventoryData }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const { updateInventoryItem, deleteInventoryItem, createInventoryItem } = useInventory();
  const { toast } = useToast();

  const handleRowClick = (inventoryItem) => {
    setSelectedItem(inventoryItem);
    setEditedItem({
      name: inventoryItem.product.name,
      category: inventoryItem.product.category,
      serviceArea: inventoryItem.product.serviceArea || '',
      quantity: inventoryItem.quantity,
      sku: inventoryItem.product.sku,
      price: inventoryItem.price,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
    setEditedItem(null);
  };

  const handleCreateNew = () => {
    setSelectedItem(null);
    setEditedItem({
      name: '',
      category: '',
      serviceArea: '',
      quantity: '',
      sku: '',
      price: '',
    });
    setOpen(true);
  };

  const handleDelete = async (inventoryItem, event) => {
    event.stopPropagation(); // Prevent row click
    try {
      const response = await deleteInventoryItem(inventoryItem._id);
      if (response.status) {
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Inventory item deleted successfully'
        });
        setInventoryData(inventoryData.filter(item => item._id !== inventoryItem._id));
      }
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while deleting the inventory item'
      });
    }
  };

  const handleSave = async () => {
    try {
      if (selectedItem) {
        // Update existing inventory item
        const updatedInventoryItem = {
          _id: selectedItem._id,
            name: editedItem.name,
            category: editedItem.category,
            serviceArea: editedItem.serviceArea,
            sku: editedItem.sku,
          price: editedItem.price,
          quantity: editedItem.quantity,
        };
        const response = await updateInventoryItem(selectedItem._id, updatedInventoryItem);
        if (response.status) {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Inventory item updated successfully'
          });
          setInventoryData(inventoryData.map(item => 
            item._id === selectedItem._id ? {
              _id: item._id,
              product: {
                name: editedItem.name,
                category: editedItem.category,
                serviceArea: editedItem.serviceArea,
                sku: editedItem.sku,
              },
              quantity: editedItem.quantity,
              price: editedItem.price,
            } : item
          ));
        }
      } else {
        // Create new inventory item
        const newInventoryItem = {
            name: editedItem.name,
            category: editedItem.category,
            serviceArea: editedItem.serviceArea,
            sku: editedItem.sku,
          price: editedItem.price,
          quantity: editedItem.quantity,
        };
        const response = await createInventoryItem(newInventoryItem);
        if (response.status) {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Inventory item created successfully'
          });
          setInventoryData([...inventoryData, {
            _id: response.data._id,
            product: {
              name: response.data.product.name,
              category: response.data.product.category,
              serviceArea: response.data.product.serviceArea,
              sku: response.data.product.sku,
            },
            quantity: response.data.quantity,
            price: response.data.price,
          }]);
        }else{
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while creating the inventory item'
          });
        }
      }
      handleClose();
    } catch (error) {
      console.error('Error saving inventory item:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while saving the inventory item'
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
          startIcon={<AddBoxIcon sx={{ fontSize: "16px" }} />}
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
          onClick={handleCreateNew}
        >
          Add New Item
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Product Name</TableCell>
              <TableCell>Product Category</TableCell>
              <TableCell>Service Area</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryData.map((item) => (
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
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.product.category}</TableCell>
                <TableCell>{item.product.serviceArea || "N/A"}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.product?.sku}</TableCell>
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
        <DialogTitle>Edit Product Details</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Product Name"
              value={editedItem?.name || ''}
              onChange={handleChange('name')}
              fullWidth
            />
            <TextField
              label="Product Category"
              value={editedItem?.category || ''}
              onChange={handleChange('category')}
              fullWidth
            />
            <TextField
              select
              label="Service Area"
              value={editedItem?.serviceArea || ''}
              onChange={handleChange('serviceArea')}
              fullWidth
            >
              {['caribbean', 'mediterranean', 'usa'].map((area) => (
                <MenuItem key={area} value={area}>
                  {area.charAt(0).toUpperCase() + area.slice(1)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Quantity"
              type="number"
              value={editedItem?.quantity || ''}
              onChange={handleChange('quantity')}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={editedItem?.price || ''}
              onChange={handleChange('price')}
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

export default InventoryWrapper;

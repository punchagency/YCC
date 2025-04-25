import {
  Typography,
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

const InventoryWrapper = ({ inventoryData }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editedItem, setEditedItem] = useState(null);

  // Sample data - replace with your actual data source
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

  const handleSave = () => {
    console.log('Saving updated item:', {
      ...selectedItem,
      product: {
        ...selectedItem.product,
        name: editedItem.name,
        category: editedItem.category,
        serviceArea: editedItem.serviceArea,
        sku: editedItem.sku,
      },
      quantity: editedItem.quantity,
      price: editedItem.price,
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
              <TableCell>Product Name</TableCell>
              <TableCell>Product Category</TableCell>
              <TableCell>Service Area</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Price</TableCell>
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
                <TableCell>{item.product.sku}</TableCell>
                <TableCell>${item.price}</TableCell>
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
              label="Service Area"
              value={editedItem?.serviceArea || ''}
              onChange={handleChange('serviceArea')}
              fullWidth
            />
            <TextField
              label="Quantity"
              type="number"
              value={editedItem?.quantity || ''}
              onChange={handleChange('quantity')}
              fullWidth
            />
            <TextField
              label="SKU"
              value={editedItem?.sku || ''}
              onChange={handleChange('sku')}
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

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
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { useState, useRef } from "react";
import { updateInventoryItem } from "../../../services/inventory/inventoryService";
import { Toast } from "primereact/toast";
import { useParams } from "react-router-dom";
import { formatAmount, unformatAmount } from "../../../utils/formatAmount";

const InventoryWrapper = ({ inventoryData, onInventoryUpdate }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);
  const { id: userId } = useParams();

  // Sample data - replace with your actual data source
  const handleRowClick = (inventoryItem) => {
    setSelectedItem(inventoryItem);
    setEditedItem({
      name: inventoryItem.product.name,
      category: inventoryItem.product.category,
      serviceArea: inventoryItem.product.serviceArea || '',
      quantity: inventoryItem.quantity,
      sku: inventoryItem.product.sku,
      price: formatAmount(inventoryItem.price), // Format price for display
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
    setEditedItem(null);
  };

  const handleSave = async () => {
    if (!selectedItem || !editedItem) return;

    setIsLoading(true);
    try {
      const updateData = {
        productName: editedItem.name,
        category: editedItem.category,
        serviceArea: editedItem.serviceArea,
        quantity: Number(editedItem.quantity),
        price: unformatAmount(editedItem.price), // Convert formatted price back to number
        sku: editedItem.sku || ''
      };

      const result = await updateInventoryItem(selectedItem._id, updateData, userId);

      if (result.success) {
        // Update the local inventory data with the correct data structure
        const updatedInventory = result.data.data;
        if (onInventoryUpdate) {
          onInventoryUpdate(updatedInventory);
        }

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Product updated successfully",
          life: 3000,
        });
        handleClose();
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: result.error || "Failed to update product",
          life: 3000,
        });
      }
    } catch (error) {
      //console.error('Error updating inventory:', error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An unexpected error occurred",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    
    if (field === 'price') {
      // Handle price formatting
      const formattedValue = formatAmount(value);
      
      setEditedItem({
        ...editedItem,
        [field]: formattedValue
      });
    } else {
      setEditedItem({
        ...editedItem,
        [field]: value,
      });
    }
  };

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100%", 
      overflow: 'auto', 
      gap: 2,
      px: { xs: 2, sm: 3 }
    }}>
      <Toast ref={toast} />
      <Alert 
        severity="info" 
        icon={<EditIcon />}
        sx={{ 
          flexShrink: 0,
          '& .MuiAlert-message': {
            fontSize: { xs: '14px', sm: '16px' }
          }
        }}
      >
        <Typography variant="body1">
          Click on any product row to see the full details or to edit its content.
        </Typography>
      </Alert>

      <TableContainer 
        component={Paper}
        sx={{ 
          height: '100%',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
            '&:hover': {
              background: '#555',
            },
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: '#f5f5f5',
                  width: { xs: '50%', sm: '30%' }
                }}
              >
                Product Name
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: '#f5f5f5',
                  display: { xs: 'none', sm: 'table-cell' },
                  width: { sm: '25%' }
                }}
              >
                Product Category
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: '#f5f5f5',
                  display: { xs: 'none', sm: 'table-cell' },
                  width: { sm: '20%' }
                }}
              >
                Service Area
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: '#f5f5f5',
                  width: { xs: '25%', sm: '10%' }
                }}
              >
                Quantity
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: '#f5f5f5',
                  display: { xs: 'none', sm: 'table-cell' },
                  width: { sm: '15%' }
                }}
              >
                SKU
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: '#f5f5f5',
                  width: { xs: '25%', sm: '10%' }
                }}
              >
                Price
              </TableCell>
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
                <TableCell 
                  sx={{ 
                    maxWidth: { xs: '150px', sm: '200px' },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={item.product.name}
                >
                  {item.product.name}
                </TableCell>
                <TableCell 
                  sx={{ 
                    display: { xs: 'none', sm: 'table-cell' },
                    maxWidth: '150px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={item.product.category}
                >
                  {item.product.category}
                </TableCell>
                <TableCell 
                  sx={{ 
                    display: { xs: 'none', sm: 'table-cell' },
                    maxWidth: '120px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={item.product.serviceArea || "N/A"}
                >
                  {item.product.serviceArea || "N/A"}
                </TableCell>
                <TableCell>
                  {item.quantity}
                </TableCell>
                <TableCell 
                  sx={{ 
                    display: { xs: 'none', sm: 'table-cell' },
                    maxWidth: '120px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={item.product.sku}
                >
                  {item.product.sku}
                </TableCell>
                <TableCell
                  sx={{ 
                    maxWidth: { xs: '150px', sm: '100px' },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={`$${formatAmount(item.price)}`}
                >
                  ${formatAmount(item.price)}
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
            {/* <TextField
              label="Service Area"
              value={editedItem?.serviceArea || ''}
              onChange={handleChange('serviceArea')}
              fullWidth
            /> */}
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
              value={editedItem?.price || ''}
              onChange={handleChange('price')}
              fullWidth
              InputProps={{
                startAdornment: <span>$</span>
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryWrapper;

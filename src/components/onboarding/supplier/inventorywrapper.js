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
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
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
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100%", 
      overflow: 'auto', 
      gap: 2,
      px: { xs: 2, sm: 3 }
    }}>
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
                  title={`$${item.price}`}
                >
                  ${item.price}
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

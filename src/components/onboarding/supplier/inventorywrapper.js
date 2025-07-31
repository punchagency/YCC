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

const InventoryWrapper = ({ inventoryData, onInventoryUpdate, role }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);
  const { id: userId } = useParams();

  //console.log('inventoryData', inventoryData);

  // Sample data - replace with your actual data source
  const handleRowClick = (inventoryItem) => {
    setSelectedItem(inventoryItem);
    setEditedItem({
      name: inventoryItem.product.name,
      category: inventoryItem.product.category,
      serviceArea: inventoryItem.product.serviceArea || "",
      quantity: inventoryItem.quantity,
      sku: inventoryItem.product.sku,
      price: formatAmount(inventoryItem.product.price), // Format price for display
      warehouseLocation: inventoryItem.warehouseLocation || "",
      description: inventoryItem.product.description || "",
      hsCode: inventoryItem.product.hsCode || "",
      countryOfOrigin: inventoryItem.product.countryOfOrigin || "",
      weight: inventoryItem.product.weight || "",
      height: inventoryItem.product.height || "",
      length: inventoryItem.product.length || "",
      width: inventoryItem.product.width || "",
      productImage: inventoryItem.product.productImage || "",
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
        productId: selectedItem.product._id, // Ensure productId is included
        name: editedItem.name,
        description: editedItem.description,
        category: editedItem.category,
        sku: editedItem.sku,
        hsCode: editedItem.hsCode,
        countryOfOrigin: editedItem.countryOfOrigin,
        weight: editedItem.weight,
        height: editedItem.height,
        length: editedItem.length,
        width: editedItem.width,
        productImage: editedItem.productImage,
        quantity: Number(editedItem.quantity),
        price: unformatAmount(editedItem.price),
        warehouseLocation: editedItem.warehouseLocation,
        userId,
        role,
      };

      const result = await updateInventoryItem(
        selectedItem.inventoryId,
        updateData,
        userId
      );

      if (result.success) {
        // Update the local inventory data with the correct data structure
        const updatedInventory = result.data.data;
        // Find the updated product entry in the returned inventory
        let updatedProductEntry = null;
        if (updatedInventory && updatedInventory.products) {
          updatedProductEntry = updatedInventory.products.find(
            (p) => p.product && p.product._id === selectedItem.product._id
          );
        }
        if (onInventoryUpdate && updatedProductEntry) {
          // Merge updated product and inventory fields for UI
          onInventoryUpdate({
            ...selectedItem,
            ...updatedProductEntry,
            product: {
              ...selectedItem.product,
              ...updatedProductEntry.product,
            },
            quantity: updatedProductEntry.quantity,
            price: updatedProductEntry.product.price,
            warehouseLocation: updatedInventory.warehouseLocation,
          });
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

    if (field === "price") {
      // Handle price formatting
      const formattedValue = formatAmount(value);

      setEditedItem({
        ...editedItem,
        [field]: formattedValue,
      });
    } else {
      setEditedItem({
        ...editedItem,
        [field]: value,
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "auto",
        gap: 2,
        px: { xs: 2, sm: 3 },
      }}
    >
      <Toast ref={toast} />
      <Alert
        severity="info"
        icon={<EditIcon />}
        sx={{
          flexShrink: 0,
          "& .MuiAlert-message": {
            fontSize: { xs: "14px", sm: "16px" },
          },
        }}
      >
        <Typography variant="body1">
          Click on any product row to see the full details or to edit its
          content.
        </Typography>
      </Alert>

      <TableContainer
        component={Paper}
        sx={{
          height: "100%",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
            "&:hover": {
              background: "#555",
            },
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                  width: { xs: "50%", sm: "30%" },
                }}
              >
                Product Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                  display: { xs: "none", sm: "table-cell" },
                  width: { sm: "25%" },
                }}
              >
                Category
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                  width: { xs: "25%", sm: "10%" },
                }}
              >
                Quantity
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                  display: { xs: "none", sm: "table-cell" },
                  width: { sm: "15%" },
                }}
              >
                SKU
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                  display: { xs: "none", md: "table-cell" },
                  width: { md: "15%" },
                }}
              >
                HS Code
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                  width: { xs: "25%", sm: "10%" },
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
                    maxWidth: { xs: "150px", sm: "200px" },
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={item.product.name}
                >
                  {item.product.name}
                </TableCell>
                <TableCell
                  sx={{
                    display: { xs: "none", sm: "table-cell" },
                    maxWidth: "150px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={item.product.category}
                >
                  {item.product.category}
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell
                  sx={{
                    display: { xs: "none", sm: "table-cell" },
                    maxWidth: "120px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={item.product.sku}
                >
                  {item.product.sku}
                </TableCell>
                <TableCell
                  sx={{
                    display: { xs: "none", md: "table-cell" },
                    maxWidth: "120px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={item.product.hsCode || "N/A"}
                >
                  {item.product.hsCode || "N/A"}
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: { xs: "150px", sm: "100px" },
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={`$${formatAmount(item.product.price)}`}
                >
                  ${formatAmount(item.product.price)}
                </TableCell>
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
        disablePortal
      >
        <DialogTitle>Edit Product Details</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label="Product Name"
              value={editedItem?.name || ""}
              onChange={handleChange("name")}
              fullWidth
            />
            <TextField
              label="Product Category"
              value={editedItem?.category || ""}
              onChange={handleChange("category")}
              fullWidth
            />
            <TextField
              label="Description"
              value={editedItem?.description || ""}
              onChange={handleChange("description")}
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              label="HS Code"
              value={editedItem?.hsCode || ""}
              onChange={handleChange("hsCode")}
              fullWidth
            />
            <TextField
              label="Country of Origin"
              value={editedItem?.countryOfOrigin || ""}
              onChange={handleChange("countryOfOrigin")}
              fullWidth
            />
            <TextField
              label="Weight"
              type="number"
              value={editedItem?.weight || ""}
              onChange={handleChange("weight")}
              fullWidth
            />
            <TextField
              label="Height"
              type="number"
              value={editedItem?.height || ""}
              onChange={handleChange("height")}
              fullWidth
            />
            <TextField
              label="Length"
              type="number"
              value={editedItem?.length || ""}
              onChange={handleChange("length")}
              fullWidth
            />
            <TextField
              label="Width"
              type="number"
              value={editedItem?.width || ""}
              onChange={handleChange("width")}
              fullWidth
            />
            <TextField
              label="Quantity"
              type="number"
              value={editedItem?.quantity || ""}
              onChange={handleChange("quantity")}
              fullWidth
            />
            <TextField
              label="SKU"
              value={editedItem?.sku || ""}
              onChange={handleChange("sku")}
              fullWidth
            />
            {/* <TextField
              label="Warehouse Location"
              value={editedItem?.warehouseLocation || ""}
              onChange={handleChange("warehouseLocation")}
              fullWidth
            /> */}
            <TextField
              label="Price"
              value={editedItem?.price || ""}
              onChange={handleChange("price")}
              fullWidth
              InputProps={{
                startAdornment: <span>$</span>,
              }}
            />
            <TextField
              label="Product Image URL"
              value={editedItem?.productImage || ""}
              onChange={handleChange("productImage")}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryWrapper;

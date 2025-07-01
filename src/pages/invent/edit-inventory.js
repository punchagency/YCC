import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Snackbar,
  Alert,
  Autocomplete,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import {
  getInventoryItemById,
  updateInventoryItem,
} from "../../services/inventory/inventoryService";

const categoryOptions = [
  "Fuel",
  "Safety Equipment",
  "Cleaning Supplies",
  "Spare Parts",
  "Electronics",
  "Galley",
  "Deck",
  "Interior",
  "Engine Room",
];

const EditInventory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setPageTitle } = useOutletContext() || {};
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    document.title = "Manage Inventory";
    if (setPageTitle) setPageTitle("Manage Inventory");
    const fetchData = async () => {
      setLoading(true);
      const result = await getInventoryItemById(id);
      if (result.success) {
        const data = result.data;
        setForm({
          productName: data.product?.name || "",
          category: Array.isArray(data.product?.category)
            ? data.product.category
            : data.product?.category
            ? [data.product.category]
            : [],
          serviceArea: data.product?.serviceArea || "",
          stockQuantity: data.quantity || "",
          price: data.price || "",
          description: data.product?.description || "",
          productImage: data.productImage || "",
        });
        setImagePreview(data.productImage || "");
      }
      setLoading(false);
    };
    fetchData();
  }, [id, setPageTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (event, newValue) => {
    setForm((prev) => ({ ...prev, category: newValue }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, productImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("productName", form.productName);
      formData.append("category", JSON.stringify(form.category));
      formData.append("serviceArea", form.serviceArea);
      formData.append("stockQuantity", form.stockQuantity);
      formData.append("price", form.price);
      formData.append("description", form.description);

      if (form.productImage instanceof File) {
        formData.append("inventoryImage", form.productImage);
      }

      // Debug: Log what's being sent
      console.log("Sending form data:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const result = await updateInventoryItem(id, formData);

      if (result.success) {
        setSnackbar({
          open: true,
          message: "Inventory item updated successfully!",
          severity: "success",
        });
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: result.message || "Failed to update inventory item",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      setSnackbar({
        open: true,
        message: "An error occurred while updating the inventory item",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{ p: { xs: 1, md: 4 }, background: "#F6F8FA", minHeight: "100vh" }}
    >
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="stretch">
          <Grid
            item
            xs={12}
            md={6}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <TextField
              label="Product Name"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Service Area"
              name="serviceArea"
              value={form.serviceArea}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price"
              name="price"
              value={form.price}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: <span>$</span>,
                endAdornment: <span>/L</span>,
              }}
            />
            <Box
              flex={1}
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
            >
              <Typography fontWeight={500} mb={1}>
                Upload Photo Here
              </Typography>
              <Box
                sx={{
                  border: "1px dashed #B0B7C3",
                  borderRadius: 2,
                  minHeight: 120,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#B0B7C3",
                  flexDirection: "column",
                  mb: 2,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxHeight: 120,
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={1}
                  >
                    <CloudUpload sx={{ fontSize: 40, color: "#B0B7C3" }} />
                    <Typography variant="body2">
                      Drag Or Browse Image
                    </Typography>
                  </Box>
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                    left: 0,
                    top: 0,
                  }}
                  onChange={handleImageChange}
                  title="Upload"
                />
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <Autocomplete
              multiple
              freeSolo
              options={categoryOptions}
              value={form.category}
              onChange={handleCategoryChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    onDelete={() => {
                      const newCategories = value.filter((_, i) => i !== index);
                      setForm((prev) => ({ ...prev, category: newCategories }));
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  placeholder="Type or select categories..."
                  margin="normal"
                />
              )}
            />
            <TextField
              label="Stock Quantity"
              name="stockQuantity"
              value={form.stockQuantity}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{ endAdornment: <span>Liters</span> }}
            />
            <Box
              flex={1}
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
            >
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                minRows={6}
                placeholder="Write Your Message Here"
                sx={{ height: "100%" }}
                InputProps={{ style: { height: "100%" } }}
              />
            </Box>
          </Grid>
        </Grid>
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditInventory;

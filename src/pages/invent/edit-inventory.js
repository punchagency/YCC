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
  IconButton,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
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
      <Paper
        elevation={3}
        sx={{
          maxWidth: "100vw",
          width: "100%",
          height: "100vh",
          overflowY: "auto",
          m: 0,
          p: { xs: 1.5, sm: 4 },
          borderRadius: { xs: 0, sm: 3 },
          boxShadow: 4,
          position: "relative",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            zIndex: 10,
            fontSize: 32,
          }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
        <Box sx={{ mt: 5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                mb={0.5}
              >
                Product Name
              </Typography>
              <TextField
                name="productName"
                value={form.productName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Paper>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                mb={0.5}
              >
                Category
              </Typography>
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
                        const newCategories = value.filter(
                          (_, i) => i !== index
                        );
                        setForm((prev) => ({
                          ...prev,
                          category: newCategories,
                        }));
                      }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Type or select categories..."
                    size="small"
                  />
                )}
              />
            </Paper>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                mb={0.5}
              >
                Stock Quantity
              </Typography>
              <TextField
                name="stockQuantity"
                value={form.stockQuantity}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{ endAdornment: <span>Liters</span> }}
              />
            </Paper>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                mb={0.5}
              >
                Price
              </Typography>
              <TextField
                name="price"
                value={form.price}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <span>$</span>,
                  endAdornment: <span>/L</span>,
                }}
              />
            </Paper>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                mb={0.5}
              >
                Description
              </Typography>
              <TextField
                name="description"
                value={form.description || "Not available"}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
                multiline
                minRows={4}
                placeholder="Write Your Message Here"
              />
            </Paper>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                mb={0.5}
              >
                Upload Photo Here
              </Typography>
              <Box
                sx={{
                  border: "1px dashed #B0B7C3",
                  borderRadius: 2,
                  minHeight: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#B0B7C3",
                  flexDirection: "column",
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
            </Paper>
          </Box>
        </Box>
        {/* Sticky Save/Cancel Buttons */}
        <Box
          sx={{
            position: { xs: "fixed", sm: "static" },
            left: 0,
            bottom: 0,
            width: "100vw",
            background: "#fff",
            boxShadow: { xs: "0 -2px 8px rgba(0,0,0,0.08)", sm: "none" },
            p: 2,
            zIndex: 20,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate(-1)}
            disabled={saving}
            fullWidth
            sx={{ mb: { xs: 1, sm: 0 } }}
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
            fullWidth
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

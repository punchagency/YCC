import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  useOutletContext,
} from "react-router-dom";

import sort from "../../assets/images/crew/sort.png";
import editLogo from "../../assets/images/crew/editLogo.png";
import deleteLogo from "../../assets/images/crew/deleteLogo.png";
import eyesIn from "../../assets/images/crew/eyes-in.png";
import { useTheme } from "../../context/theme/themeContext";

import { TableSkeleton } from "../../components/TableSkeleton";
import { Pagination } from "../../components/pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Paper,
  Tooltip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Autocomplete,
  Typography,
  Stack,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RemoveIcon from "@mui/icons-material/Remove";

import {
  createInventoryData,
  getAllInventories,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryItemById,
  sendInventoryEmail,
  getAllSuppliers,
} from "../../services/inventory/inventoryService";

const InventoryTableSkeleton = () => {
  const { theme } = useTheme();
  return (
    <div className="inventory-skeleton">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            padding: "10px",
            borderBottom: "1px solid #eaecf0",
            backgroundColor: theme === "light" ? "#FFFFFF" : "#03141F",
          }}
        >
          {[...Array(7)].map((_, j) => (
            <div
              key={j}
              style={{
                flex: j === 0 ? "2" : "1",
                height: "20px",
                backgroundColor: theme === "light" ? "#f3f4f6" : "#1f2937",
                marginRight: "10px",
                borderRadius: "4px",
                animation: "pulse 1.5s infinite",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const Invent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { inventoryId } = useParams(); // Get inventory ID from URL params
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [viewItem, setViewItem] = useState({
    id: null,
    productName: "",
    category: "",
    serviceArea: "",
    stockQuantity: "",
    price: "",
    productImage: null,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Initialize with empty array
  const [inventoryItems, setInventoryItems] = useState([]);

  const [editItem, setEditItem] = useState({
    id: null,
    index: null,
    productName: "",
    category: "",
    stockQuantity: "",
    price: "",
  });

  // Add description to newItem state
  const [newItem, setNewItem] = useState({
    productName: "",
    category: "",
    stockQuantity: "",
    price: "",
    supplier: "",
    description: "",
    fileName: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [suppliersLoading, setSuppliersLoading] = useState(false);

  const { theme } = useTheme();

  // Add this state variable with your other state variables
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Add a state to track whether we should update the URL
  const [shouldUpdateURL, setShouldUpdateURL] = useState(true);

  // Add these state variables with your other state declarations
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  // Add these state variables
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef();
  const [totalItems, setTotalItems] = useState(0);
  const isRequestInProgress = useRef(false); // Add this ref to track ongoing requests

  const { setPageTitle } = useOutletContext() || {};

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  // Add after other useState declarations
  const [stockStatusFilter, setStockStatusFilter] = useState("all");

  // Add this state variable for the dropdown open/close
  const [stockStatusDropdownOpen, setStockStatusDropdownOpen] = useState(false);

  // Add this state to the Invent component
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Add state for supplier search and pagination
  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierPage, setSupplierPage] = useState(1);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const SUPPLIERS_PER_PAGE = 10;

  // Add state for controlling the supplier dropdown open state
  const [supplierDropdownOpen, setSupplierDropdownOpen] = useState(false);

  // 1. Add state for search text and applied filters
  const [searchText, setSearchText] = useState("");
  const [appliedStockStatus, setAppliedStockStatus] =
    useState(stockStatusFilter);
  const [appliedSearchText, setAppliedSearchText] = useState("");

  // Helper to get stock status
  const getStockStatus = (quantity) => {
    if (quantity >= 100) return "high";
    if (quantity >= 50) return "medium";
    return "low";
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedItems(inventoryItems.map((item) => item.id));
      setSelectAll(true);
    } else {
      setSelectedItems([]);
      setSelectAll(false);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) => {
      const newSelected = prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id];
      // If not all items are selected, uncheck selectAll
      if (newSelected.length !== inventoryItems.length) {
        setSelectAll(false);
      } else {
        setSelectAll(true);
      }
      return newSelected;
    });
  };

  const onPageChange = (event, newPage) => {
    console.log("Pagination clicked, newPage:", newPage);
    setPage(newPage - 1);
    // Fetch new page data here if needed
  };

  const onRowsPerPageChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
    // Fetch new page data here if needed
  };

  // Add this function to handle infinite scroll
  const lastInventoryElementRef = useCallback(
    (node) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMoreData();
          }
        },
        {
          root: null,
          rootMargin: "20px",
          threshold: 1.0,
        }
      );
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, hasMore]
  );

  // Inside your component, define the service area options
  const serviceAreaOptions = [
    { label: "Caribbean", value: "caribbean" },
    { label: "Mediterranean", value: "mediterranean" },
    { label: "USA", value: "usa" },
  ];

  // Add new state for email modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
    productName: "",
  });
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Add this useEffect to handle URL parameters
  useEffect(() => {
    // Check if we have an inventory ID in the URL
    if (inventoryId) {
      fetchInventoryItemById(inventoryId);
    }
  }, [inventoryId]);

  // Add scroll event handler
  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      // Clear any existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Debounce the scroll event
      scrollTimeout = setTimeout(() => {
        if (
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 // Trigger 100px before bottom
        ) {
          if (hasMore && !isLoadingMore) {
            loadMoreData();
          }
        }
      }, 150); // 150ms debounce
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [hasMore, isLoadingMore, page]); // Add page to dependencies to prevent stale closures

  // Combined useEffect for initial load and search parameter changes
  useEffect(() => {
    fetchInventoryData(page + 1);
  }, [page, pageSize, appliedSearchText, appliedStockStatus]);

  // Reset to first page when filters/search change
  useEffect(() => {
    setPage(0);
  }, [appliedSearchText, appliedStockStatus]);

  const fetchInventoryData = async (pageNum = 1) => {
    setIsLoading(true);
    try {
      const result = await getAllInventories(
        pageNum,
        pageSize,
        appliedSearchText,
        appliedStockStatus
      );
      if (result.success) {
        const formattedItems = result.data.map((item) => ({
          id: item._id,
          productName: item.product?.name || "Unknown Product",
          category: item.product?.category || "Uncategorized",
          description: item.product?.description || "Not available",
          supplier: item.supplier || "Not available",
          stockQuantity: item.quantity || 0,
          price: item.price || 0,
          productImage: item.productImage || null,
        }));
        setInventoryItems(formattedItems);
        setTotalItems(result.pagination?.totalItems || formattedItems.length);
        setTotalPages(result.pagination?.totalPages || 1);
      } else {
        setInventoryItems([]);
        setTotalItems(0);
        setTotalPages(1);
        console.error("Failed to load inventory data:", result.error);
      }
    } catch (error) {
      setInventoryItems([]);
      setTotalItems(0);
      setTotalPages(1);
      console.error("Error fetching inventory data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreData = async () => {
    if (!hasMore || isLoadingMore || isRequestInProgress.current) return;

    // Set loading state and mark request as in progress
    setIsLoadingMore(true);
    isRequestInProgress.current = true;

    try {
      const nextPage = page + 1;
      await fetchInventoryData(nextPage);
    } catch (error) {
      console.error("Error loading more data:", error);
    } finally {
      setIsLoadingMore(false);
      isRequestInProgress.current = false;
    }
  };

  // Add loading indicator component
  const renderLoadingIndicator = () => {
    if (!isLoadingMore) return null;

    return (
      <div
        style={{
          textAlign: "center",
          padding: "1rem",
          backgroundColor: theme === "light" ? "#FFFFFF" : "#03141F",
          position: "sticky",
          bottom: 0,
          width: "100%",
          zIndex: 1,
        }}
      >
        <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
        <p style={{ marginTop: "0.5rem" }}>Loading more items...</p>
      </div>
    );
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEdit = (index) => {
    const item = inventoryItems[index];
    setEditItem({
      id: item.id,
      index: index,
      productName: item.productName,
      category: item.category,
      stockQuantity: item.stockQuantity.toString(),
      price: item.price.toFixed(2),
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      let updateData;
      let isFormData = false;
      if (editItem.productImage && editItem.productImage instanceof File) {
        updateData = new FormData();
        updateData.append("productName", editItem.productName);
        updateData.append("category", editItem.category);
        updateData.append("stockQuantity", editItem.stockQuantity);
        updateData.append("price", editItem.price);
        updateData.append("description", editItem.description);
        updateData.append("productImage", editItem.productImage);
        isFormData = true;
      } else {
        updateData = {
          productName: editItem.productName,
          category: editItem.category,
          stockQuantity: editItem.stockQuantity,
          price: editItem.price,
          description: editItem.description,
        };
      }
      const result = await updateInventoryItem(
        editItem.id,
        updateData,
        isFormData
      );
      if (result.success) {
        // Update UI with new data
        setInventoryItems((prev) =>
          prev.map((item) =>
            item.id === editItem.id
              ? {
                  ...item,
                  ...editItem,
                  productImage: imagePreview || item.productImage,
                }
              : item
          )
        );
        setShowEditModal(false);
        setSnackbar({
          open: true,
          message: "Product updated successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: result.error || "Update failed",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Update failed", severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (index) => {
    const item = inventoryItems[index];
    setItemToDelete({
      id: item.id,
      index: index,
    });
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsLoading(true);
    try {
      const result = await deleteInventoryItem(itemToDelete.id);
      if (result.success) {
        // Remove the deleted item from the state
        setInventoryItems((prevItems) =>
          prevItems.filter((_, index) => index !== itemToDelete.index)
        );
      } else {
        console.error("Failed to delete product:", result.error);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirmation(false);
      setItemToDelete(null);
    }
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
    setNewItem({
      productName: "",
      category: "",
      stockQuantity: "",
      price: "",
      supplier: "",
      description: "",
      fileName: "",
    });
    setProductImage(null);
    setImagePreview(null);
    setSaveSuccess("");
    setSaveError("");
  };

  // Add this function to handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProductImage(file);
      setNewItem({ ...newItem, fileName: file.name });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Update the handleSaveProduct function to use FormData for image upload
  const handleSaveProduct = async () => {
    if (!newItem.productName || !newItem.category) {
      setSaveError("Product name and category are required");
      return;
    }

    // Validate quantity
    if (!newItem.stockQuantity || newItem.stockQuantity <= 0) {
      setSaveError("Stock quantity must be greater than 0");
      return;
    }

    setIsLoading(true);
    setSaveError("");

    try {
      // Create a FormData object for file upload
      const formData = new FormData();
      formData.append("productName", newItem.productName);
      formData.append("category", newItem.category);
      formData.append("quantity", newItem.stockQuantity);
      formData.append("price", newItem.price);
      // In handleSaveProduct, always send description (backend will ignore if not needed)
      formData.append("description", newItem.description);
      if (newItem.supplier) {
        formData.append("supplierId", newItem.supplier);
      }

      // Append the image file if one was selected
      if (productImage) {
        console.log("Appending inventoryImage to FormData:", productImage);
        formData.append("inventoryImage", productImage);
      }

      const result = await createInventoryData(formData);

      if (result.success) {
        const responseData = result.data.data;
        const product = {
          id: responseData._id,
          productName: responseData.product.name,
          category: responseData.product.category,
          description: responseData.product.description || "Not available",
          supplier: responseData.supplier || "Not available",
          stockQuantity: responseData.quantity,
          price: responseData.price,
          productImage: responseData.productImage || null,
        };

        setInventoryItems([product, ...inventoryItems]);

        // Reset the form including the image
        setNewItem({
          productName: "",
          category: "",
          stockQuantity: "",
          price: "",
          supplier: "",
          description: "",
          fileName: "",
        });
        setProductImage(null);
        setImagePreview(null);
        setSelectedSupplier(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        // Also reset the file input by setting its value to null
        if (fileInputRef.current) fileInputRef.current.value = null;

        setShowAddModal(false);
        setSnackbar({
          open: true,
          message: "Product added successfully!",
          severity: "success",
        });
        setSaveError(""); // Clear any previous errors
      } else {
        setSaveError(
          result.error || "Failed to add inventory. Please try again."
        );
        setSaveSuccess(""); // Clear any previous success messages
        console.error("Failed to add inventory:", result.error);
      }
    } catch (error) {
      setSaveError("An unexpected error occurred. Please try again.");
      console.error("Error adding inventory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the view item handler
  const handleViewItem = (item) => {
    setViewItem(item);
    setShowViewModal(true);

    // Only update URL if we should
    if (shouldUpdateURL) {
      navigate(`/admin/inventory-management/${item.id}`);
    }
  };

  // Simplified modal close handler
  const handleCloseViewModal = () => {
    // Disable URL updates temporarily to prevent race conditions
    setShouldUpdateURL(false);

    // Close the modal
    setShowViewModal(false);

    // Navigate after a short delay
    setTimeout(() => {
      navigate("/admin/inventory-management", { replace: true });

      // Re-enable URL updates after navigation
      setTimeout(() => {
        setShouldUpdateURL(true);
      }, 50);
    }, 50);
  };

  // Effect to handle URL parameters
  useEffect(() => {
    // If we have an ID in the URL and should update
    if (inventoryId && shouldUpdateURL) {
      fetchInventoryItemById(inventoryId);
    }
  }, [inventoryId, shouldUpdateURL]);

  // Effect to handle browser navigation
  useEffect(() => {
    // If we navigate away and the modal is open
    if (!inventoryId && showViewModal && shouldUpdateURL) {
      setShowViewModal(false);
    }
  }, [inventoryId, showViewModal, shouldUpdateURL]);

  // Function to fetch a single inventory item by ID
  const fetchInventoryItemById = async (id) => {
    try {
      setIsLoading(true);
      const result = await getInventoryItemById(id);

      if (result.success) {
        const item = {
          id: result.data._id,
          productName: result.data.product?.name || "Unknown Product",
          category: result.data.product?.category || "Uncategorized",
          description: result.data.product?.description || "Not available",
          supplier: result.data.supplier || "Not available",
          stockQuantity: result.data.quantity || 0,
          price: result.data.price || 0,
          productImage: result.data.productImage || null,
          product: result.data.product, // <-- full product object
        };

        setViewItem(item);
        setShowViewModal(true);
      } else {
        console.error("Failed to load inventory item:", result.error);
      }
    } catch (error) {
      console.error("Error fetching inventory item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add email handling functions
  const handleSendEmail = (item) => {
    // Get email from either supplier.user.email or userInfo.email
    const supplierEmail =
      item.supplier?.user?.email || item.userInfo?.email || "";

    setEmailData({
      to: supplierEmail,
      subject: `Regarding your product: ${item.productName}`,
      message: "",
      productName: item.productName,
    });

    setShowEmailModal(true);
  };

  const handleEmailSubmit = async () => {
    if (!emailData.to || !emailData.subject || !emailData.message.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSendingEmail(true);
    try {
      const result = await sendInventoryEmail(
        emailData.to,
        emailData.subject,
        emailData.message
      );

      if (result.success) {
        setShowEmailModal(false);
        setEmailData({ to: "", subject: "", message: "", productName: "" });
        setSnackbar({
          open: true,
          message: "Email sent successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to send email.",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "An error occurred while sending email.",
        severity: "error",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Render mobile card view for inventory items
  const renderMobileInventoryCards = () => {
    return (
      <div style={{ padding: "0 10px" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ mb: 2, width: "100%" }}
        >
          <Box
            className="custom-dropdown"
            sx={{ minWidth: 160, position: "relative" }}
          >
            <Button
              variant="outlined"
              onClick={() => setStockStatusDropdownOpen((open) => !open)}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                border: "1px solid #e2e8f0",
                background: "linear-gradient(135deg, #fff 0%, #f8fafc 100%)",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
              }}
              fullWidth
            >
              {stockStatusFilter === "all" && "All"}
              {stockStatusFilter === "high" && (
                <>
                  <RadioButtonUncheckedIcon
                    sx={{ color: "#059669", fontSize: 18, mr: 1 }}
                  />
                  <span style={{ color: "#059669" }}>High</span>
                </>
              )}
              {stockStatusFilter === "medium" && (
                <>
                  <RemoveIcon sx={{ color: "#D97706", fontSize: 18, mr: 1 }} />
                  <span style={{ color: "#D97706" }}>Medium</span>
                </>
              )}
              {stockStatusFilter === "low" && (
                <>
                  <ErrorOutlineIcon
                    sx={{ color: "#DC2626", fontSize: 18, mr: 1 }}
                  />
                  <span style={{ color: "#DC2626" }}>Low</span>
                </>
              )}
              <span style={{ marginLeft: 8, fontSize: 12, color: "#6b7280" }}>
                ▼
              </span>
            </Button>
            {stockStatusDropdownOpen && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 2,
                  boxShadow: 3,
                  zIndex: 10,
                  mt: 0.5,
                }}
              >
                {[
                  { key: "all", label: "All" },
                  {
                    key: "high",
                    label: "High",
                    icon: (
                      <RadioButtonUncheckedIcon
                        sx={{ color: "#059669", fontSize: 18, mr: 1 }}
                      />
                    ),
                  },
                  {
                    key: "medium",
                    label: "Medium",
                    icon: (
                      <RemoveIcon
                        sx={{ color: "#D97706", fontSize: 18, mr: 1 }}
                      />
                    ),
                  },
                  {
                    key: "low",
                    label: "Low",
                    icon: (
                      <ErrorOutlineIcon
                        sx={{ color: "#DC2626", fontSize: 18, mr: 1 }}
                      />
                    ),
                  },
                ].map((opt) => (
                  <Box
                    key={opt.key}
                    className={`custom-dropdown-item${
                      stockStatusFilter === opt.key ? " active" : ""
                    }`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      borderRadius: 1,
                      fontWeight: stockStatusFilter === opt.key ? 600 : 400,
                      color:
                        opt.key === "high"
                          ? "#059669"
                          : opt.key === "medium"
                          ? "#D97706"
                          : opt.key === "low"
                          ? "#DC2626"
                          : "#374151",
                      background:
                        stockStatusFilter === opt.key ? "#eff6ff" : undefined,
                      "&:hover": { background: "#f8fafc" },
                    }}
                    onClick={() => {
                      setStockStatusFilter(opt.key);
                      setAppliedStockStatus(opt.key); // Immediately apply and trigger fetch
                      setPage(0); // Optionally reset to first page
                      setStockStatusDropdownOpen(false);
                    }}
                  >
                    {opt.icon && opt.icon}
                    <span>{opt.label}</span>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          <TextField
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by product name..."
            fullWidth
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setAppliedStockStatus(stockStatusFilter);
              setAppliedSearchText(searchText);
            }}
            fullWidth
            sx={{ minWidth: { sm: 120 } }}
          >
            Search
          </Button>
        </Stack>
        {inventoryItems.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                {item.productName}
              </h3>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <img
                  src={eyesIn}
                  alt="view"
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleViewItem(item)}
                />
                <img
                  src={editLogo}
                  alt="edit"
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleEdit(index)}
                />
                <img
                  src={deleteLogo}
                  alt="delete"
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(index)}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                fontSize: "14px",
              }}
            >
              <div>
                <span style={{ color: "#666" }}>Category: </span>
                <span>{item.category}</span>
              </div>
              <div>
                <span style={{ color: "#666" }}>Stock: </span>
                <span>{item.stockQuantity} units</span>
              </div>
              <div>
                <span style={{ color: "#666" }}>Price: </span>
                <span>
                  $
                  {!isNaN(Number(item.price))
                    ? Number(item.price).toFixed(2)
                    : "0.00"}
                </span>
              </div>
            </div>

            {/* Add Send Email button */}
            <div style={{ marginTop: "10px" }}>
              <button
                style={{
                  padding: "8px 12px",
                  borderRadius: "5px",
                  backgroundColor: "#0387D9",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "bold",
                  width: "100%",
                }}
                onClick={() => handleSendEmail(item)}
              >
                Send Email
              </button>
            </div>
          </div>
        ))}
        <Box sx={{ mt: 3, mb: 3, display: "flex", justifyContent: "center" }}>
          <Pagination
            currentPage={page + 1}
            totalPages={Math.ceil(totalItems / pageSize)}
            totalItems={totalItems}
            itemsPerPage={pageSize}
            onPageChange={(newPage) => {
              setPage(newPage - 1);
            }}
          />
        </Box>
      </div>
    );
  };

  // Render inventory items with loading state
  const renderInventoryItems = () => {
    if (isDataLoading) {
      // return (
      //   <div
      //     className="loading-container"
      //     style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
      //   >
      //     <ProgressSpinner
      //       style={{ width: "50px", height: "50px" }}
      //       strokeWidth="4"
      //       fill="var(--surface-ground)"
      //       animationDuration=".5s"
      //     />
      //   </div>
      // );
    }

    if (inventoryItems.length === 0) {
      return (
        <div
          className="empty-state"
          style={{ textAlign: "center", padding: "2rem" }}
        >
          <p>No inventory items found. Add your first product!</p>
        </div>
      );
    }
  };

  // Add this style to your component
  const dropdownStyles = {
    border: "none",
    boxShadow: "none",
  };

  // Add this to your component's useEffect
  useEffect(() => {
    // Add custom styles to remove borders from dropdown
    const style = document.createElement("style");
    style.textContent = `
      .no-border-dropdown .p-dropdown {
        border: none !important;
        box-shadow: none !important;
      }
      
      .no-border-dropdown .p-dropdown:not(.p-disabled).p-focus {
        box-shadow: none !important;
        border-color: transparent !important;
      }
      
      .no-border-dropdown .p-dropdown-panel {
        border: 1px solid #ced4da;
      }
      
      /* Make the input field have only bottom border */
      .no-border-dropdown .p-dropdown .p-dropdown-label {
        border: none;
        border-bottom: 1px solid #ced4da;
        border-radius: 0;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Modify the desktop view to include the loading indicator
  const renderDesktopView = () => {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            p: 2,
            backgroundColor: "#fff",
            borderRadius: 2,
            border: "1px solid #EAECF0",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <span style={{ fontWeight: 500 }}>Stock Status:</span>
          <Box
            className="custom-dropdown"
            sx={{ minWidth: 160, position: "relative" }}
          >
            <Button
              variant="outlined"
              onClick={() => setStockStatusDropdownOpen((open) => !open)}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                border: "1px solid #e2e8f0",
                background: "linear-gradient(135deg, #fff 0%, #f8fafc 100%)",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
              fullWidth
            >
              {stockStatusFilter === "all" && "All"}
              {stockStatusFilter === "high" && (
                <>
                  <RadioButtonUncheckedIcon
                    sx={{ color: "#059669", fontSize: 18, mr: 1 }}
                  />
                  <span style={{ color: "#059669" }}>High</span>
                </>
              )}
              {stockStatusFilter === "medium" && (
                <>
                  <RemoveIcon sx={{ color: "#D97706", fontSize: 18, mr: 1 }} />
                  <span style={{ color: "#D97706" }}>Medium</span>
                </>
              )}
              {stockStatusFilter === "low" && (
                <>
                  <ErrorOutlineIcon
                    sx={{ color: "#DC2626", fontSize: 18, mr: 1 }}
                  />
                  <span style={{ color: "#DC2626" }}>Low</span>
                </>
              )}
              <span style={{ marginLeft: 8, fontSize: 12, color: "#6b7280" }}>
                ▼
              </span>
            </Button>
            {stockStatusDropdownOpen && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 2,
                  boxShadow: 3,
                  zIndex: 10,
                  mt: 0.5,
                }}
              >
                {[
                  { key: "all", label: "All" },
                  {
                    key: "high",
                    label: "High",
                    icon: (
                      <RadioButtonUncheckedIcon
                        sx={{ color: "#059669", fontSize: 18, mr: 1 }}
                      />
                    ),
                  },
                  {
                    key: "medium",
                    label: "Medium",
                    icon: (
                      <RemoveIcon
                        sx={{ color: "#D97706", fontSize: 18, mr: 1 }}
                      />
                    ),
                  },
                  {
                    key: "low",
                    label: "Low",
                    icon: (
                      <ErrorOutlineIcon
                        sx={{ color: "#DC2626", fontSize: 18, mr: 1 }}
                      />
                    ),
                  },
                ].map((opt) => (
                  <Box
                    key={opt.key}
                    className={`custom-dropdown-item${
                      stockStatusFilter === opt.key ? " active" : ""
                    }`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      borderRadius: 1,
                      fontWeight: stockStatusFilter === opt.key ? 600 : 400,
                      color:
                        opt.key === "high"
                          ? "#059669"
                          : opt.key === "medium"
                          ? "#D97706"
                          : opt.key === "low"
                          ? "#DC2626"
                          : "#374151",
                      background:
                        stockStatusFilter === opt.key ? "#eff6ff" : undefined,
                      "&:hover": { background: "#f8fafc" },
                    }}
                    onClick={() => {
                      setStockStatusFilter(opt.key);
                      setAppliedStockStatus(opt.key); // Immediately apply and trigger fetch
                      setPage(0); // Optionally reset to first page
                      setStockStatusDropdownOpen(false);
                    }}
                  >
                    {opt.icon && opt.icon}
                    <span>{opt.label}</span>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "stretch",
              gap: 1,
              mb: 2,
            }}
          >
            <TextField
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by product name..."
              fullWidth
              size="small"
              sx={{ mb: { xs: 1, sm: 0 } }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setAppliedStockStatus(stockStatusFilter);
                setAppliedSearchText(searchText);
              }}
              fullWidth
              sx={{ minWidth: { sm: 120 } }}
            >
              Search
            </Button>
          </Box>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: 0,
            border: "1px solid #EAECF0",
            mt: 2,
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#F9FAFB" }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                    inputProps={{ "aria-label": "select all products" }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Product ID
                    <IconButton size="small">
                      <FilterListIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Product Name
                    <IconButton size="small">
                      <FilterListIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Category
                    <IconButton size="small">
                      <FilterListIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Stock Quantity
                    <IconButton size="small">
                      <FilterListIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Price
                    <IconButton size="small">
                      <FilterListIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Actions
                    <IconButton size="small">
                      <FilterListIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoryItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No products match your filter or search.
                  </TableCell>
                </TableRow>
              ) : (
                inventoryItems.map((item, idx) => (
                  <TableRow
                    key={item.id}
                    hover
                    selected={selectedItems.includes(item.id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        inputProps={{
                          "aria-label": `select product ${item.productName}`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      #{item.id?.slice?.(-6) || item.id || idx + 1}
                    </TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          backgroundColor:
                            getStockStatus(item.stockQuantity) === "high"
                              ? "#ECFDF3"
                              : getStockStatus(item.stockQuantity) === "medium"
                              ? "#FFFAEB"
                              : "#FEF3F2",
                          color:
                            getStockStatus(item.stockQuantity) === "high"
                              ? "#027A48"
                              : getStockStatus(item.stockQuantity) === "medium"
                              ? "#B54708"
                              : "#B42318",
                          padding: "2px 8px",
                          borderRadius: "16px",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {item.stockQuantity} Liters
                      </span>
                    </TableCell>
                    <TableCell>
                      $
                      {!isNaN(Number(item.price))
                        ? Number(item.price).toFixed(2)
                        : "0.00"}
                      /L
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View">
                        <IconButton onClick={() => handleViewItem(item)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() =>
                            navigate(
                              `/admin/inventory-management/edit/${item.id}`
                            )
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(idx)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Send Email">
                        <IconButton onClick={() => handleSendEmail(item)}>
                          <i
                            className="pi pi-envelope"
                            style={{ color: "#0387D9" }}
                          />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3, mb: 3, display: "flex", justifyContent: "center" }}>
          <Pagination
            currentPage={page + 1}
            totalPages={Math.ceil(totalItems / pageSize)}
            totalItems={totalItems}
            itemsPerPage={pageSize}
            onPageChange={(newPage) => {
              console.log("Pagination clicked, newPage:", newPage);
              setPage(newPage - 1);
            }}
          />
        </Box>
      </>
    );
  };

  // Fetch suppliers for the dropdown
  const fetchSuppliers = async () => {
    try {
      setSuppliersLoading(true);
      const result = await getAllSuppliers();
      // Fix: handle paginated and non-paginated responses
      if (result.success && Array.isArray(result.data?.result)) {
        setSuppliers(result.data.result);
      } else if (result.success && Array.isArray(result.data)) {
        setSuppliers(result.data);
      } else {
        console.error("Invalid suppliers data:", result.data);
        setSuppliers([]);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setSuppliers([]);
    } finally {
      setSuppliersLoading(false);
    }
  };

  // Set page title and add event listener for create inventory button
  useEffect(() => {
    if (setPageTitle) setPageTitle("Inventory");

    // Fetch suppliers when component mounts
    fetchSuppliers();

    // Add event listener for create inventory button in title bar
    const handleCreateInventoryModal = () => {
      handleAddProduct();
    };

    window.addEventListener(
      "openCreateInventoryModal",
      handleCreateInventoryModal
    );

    return () => {
      window.removeEventListener(
        "openCreateInventoryModal",
        handleCreateInventoryModal
      );
    };
  }, [setPageTitle]);

  const categoryOptions = [
    {
      label: "Captain",
      value: "Captain",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/captain1.png",
    },
    {
      label: "Crew",
      value: "Crew",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/crew1.png",
    },
    {
      label: "Exterior",
      value: "Exterior",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/exterior1.png",
    },
    {
      label: "Engineering",
      value: "Engineering",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/Engineering1.png",
    },
    {
      label: "Gallery",
      value: "Gallery",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/GALLERY1.png",
    },
    {
      label: "Interior",
      value: "Interior",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/Interior1.png",
    },
  ];

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setSaveSuccess("");
    setSaveError("");
    setSelectedSupplier(null);
    setNewItem({
      productName: "",
      category: "",
      stockQuantity: "",
      price: "",
      supplier: "",
      description: "",
      fileName: "",
    });
  };

  // Filter and paginate suppliers when supplierSearch or suppliers changes
  useEffect(() => {
    const searchTerm = supplierSearch.toLowerCase();
    const filtered = suppliers.filter((option) => {
      const match =
        (option.businessName &&
          option.businessName.toLowerCase().includes(searchTerm)) ||
        (option.companyName &&
          option.companyName.toLowerCase().includes(searchTerm)) ||
        (option.name && option.name.toLowerCase().includes(searchTerm)) ||
        (option.user?.email &&
          option.user.email.toLowerCase().includes(searchTerm));
      return match;
    });
    setFilteredSuppliers(filtered.slice(0, supplierPage * SUPPLIERS_PER_PAGE));
  }, [supplierSearch, suppliers, supplierPage]);

  const fileInputRef = useRef(null);

  return (
    <>
      {/* Loading Overlay for Initial Load */}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "2rem", marginBottom: "10px" }}
            ></div>
            <p>Loading inventory data...</p>
          </div>
        </div>
      )}

      <div
        className="inventory-wrapper"
        style={{
          height: "100%",
          width: "100%",
          maxWidth: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F8FBFF",
        }}
      >
        <div className="inventory-container">
          {isLoading ? (
            <TableSkeleton showSummary={false} />
          ) : (
            <>{isMobile ? renderMobileInventoryCards() : renderDesktopView()}</>
          )}
        </div>
      </div>

      {renderInventoryItems()}

      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          zIndex: 9999,
          "& .MuiDialog-paper": {
            zIndex: 9999,
            backgroundColor: "#ffffff",
            border: "2px solid #0387D9",
            maxWidth: "100vw",
            width: "100%",
            height: "100vh",
            overflowY: "auto",
            m: 0,
            p: { xs: 1.5, sm: 4 },
            borderRadius: { xs: 0, sm: 3 },
            boxShadow: 4,
            position: "relative",
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={() => setShowEditModal(false)}
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
        <Box sx={{ mt: 5, pb: 10 }}>
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
                id="productName"
                value={editItem.productName}
                onChange={(e) =>
                  setEditItem({ ...editItem, productName: e.target.value })
                }
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
              <TextField
                id="category"
                value={editItem.category}
                onChange={(e) =>
                  setEditItem({ ...editItem, category: e.target.value })
                }
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
                Stock Quantity
              </Typography>
              <TextField
                id="stockQuantity"
                type="number"
                value={editItem.stockQuantity}
                onChange={(e) =>
                  setEditItem({ ...editItem, stockQuantity: e.target.value })
                }
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
                Price
              </Typography>
              <TextField
                id="price"
                type="number"
                step="0.01"
                value={editItem.price}
                onChange={(e) =>
                  setEditItem({ ...editItem, price: e.target.value })
                }
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
                Description
              </Typography>
              <TextField
                id="description"
                value={editItem.description || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, description: e.target.value })
                }
                fullWidth
                variant="outlined"
                size="small"
                multiline
                minRows={4}
              />
            </Paper>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                mb={0.5}
              >
                Product Image
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
                  mb: 1,
                }}
              >
                {editItem.productImage || imagePreview ? (
                  <img
                    src={imagePreview || editItem.productImage}
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
                    <CloudUploadIcon sx={{ fontSize: 40, color: "#B0B7C3" }} />
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
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setEditItem({ ...editItem, productImage: file });
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
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
            background: "rgba(255,255,255,0.97)",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.08)",
            p: 2,
            zIndex: 20,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Button
            onClick={() => setShowEditModal(false)}
            disabled={isLoading}
            fullWidth
            sx={{
              mb: { xs: 1, sm: 0 },
              backgroundColor: "#EF4444",
              color: "#fff",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isLoading}
            fullWidth
            sx={{ backgroundColor: "#0387D9", color: "#fff" }}
          >
            {isLoading ? "Updating..." : "Update Product"}
          </Button>
        </Box>
      </Dialog>

      <Dialog
        open={showAddModal}
        onClose={handleCloseAddModal}
        maxWidth="sm"
        fullWidth
        sx={{
          zIndex: 9999,
          "& .MuiDialog-paper": {
            zIndex: 9999,
            backgroundColor: "#ffffff",
            border: "2px solid #0387D9",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: 22,
            pb: 0,
            pr: 5,
            backgroundColor: "#f0f8ff",
          }}
        >
          Add New Product
          <IconButton
            aria-label="close"
            onClick={handleCloseAddModal}
            sx={{ position: "absolute", right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Product Name"
            placeholder="Enter Product Name"
            value={newItem.productName}
            onChange={(e) =>
              setNewItem({ ...newItem, productName: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={newItem.description}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={newItem.category}
              label="Category"
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
              renderValue={(selected) => {
                const option = categoryOptions.find(
                  (opt) => opt.value === selected
                );
                return option ? (
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <img
                      src={option.icon}
                      alt={option.label}
                      style={{ width: 24, height: 24, objectFit: "contain" }}
                      loading="lazy"
                    />
                    {option.label}
                  </span>
                ) : (
                  ""
                );
              }}
              MenuProps={{
                disablePortal: true,
                PaperProps: {
                  sx: {
                    width: 240,
                  },
                },
              }}
            >
              {categoryOptions.map((option, index) => (
                <MenuItem
                  key={option.value || option.label || index}
                  value={option.value}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <img
                      src={option.icon}
                      alt={option.label}
                      style={{ width: 24, height: 24, objectFit: "contain" }}
                      loading="lazy"
                    />
                    {option.label}
                  </span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Price"
            placeholder="Enter Price"
            type="number"
            inputProps={{ min: 1, step: 1 }}
            value={newItem.price}
            onChange={(e) => {
              const val = e.target.value;
              // Allow empty string for clearing
              if (val === "") {
                setNewItem({ ...newItem, price: "" });
              } else {
                setNewItem({ ...newItem, price: val });
              }
            }}
            onBlur={(e) => {
              const val = Number(e.target.value);
              if (val < 1 || isNaN(val)) {
                setNewItem({ ...newItem, price: 1 });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Availability"
            placeholder="In Stock"
            type="number"
            inputProps={{ min: 1, step: 1 }}
            value={newItem.stockQuantity || ""}
            onChange={(e) =>
              setNewItem({ ...newItem, stockQuantity: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2, mb: 1 }}
          >
            <TextField
              label="Upload File"
              placeholder="Browse File Here..."
              value={newItem.fileName || ""}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton component="label">
                    <CloudUploadIcon />
                    <input
                      type="file"
                      hidden
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                  </IconButton>
                ),
              }}
              fullWidth
            />
          </Box>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: 120, maxHeight: 120, margin: "10px 0" }}
            />
          )}
          <Autocomplete
            options={filteredSuppliers}
            getOptionLabel={(option) =>
              option.businessName ||
              option.companyName ||
              option.name ||
              option.user?.email ||
              ""
            }
            filterOptions={(options) => options}
            onInputChange={(event, value) => setSupplierSearch(value)}
            open={supplierDropdownOpen}
            onOpen={() => setSupplierDropdownOpen(true)}
            onClose={() => setSupplierDropdownOpen(false)}
            openOnFocus
            value={selectedSupplier}
            onChange={(event, newValue) => {
              setSelectedSupplier(newValue);
              setNewItem({
                ...newItem,
                supplier: newValue ? newValue._id : "",
              });
            }}
            disablePortal
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Supplier"
                placeholder={
                  suppliersLoading
                    ? "Loading suppliers..."
                    : "Type supplier name, company, or email..."
                }
                margin="normal"
                helperText={
                  suppliersLoading
                    ? "Loading suppliers..."
                    : "Search by business name, company name, or email"
                }
              />
            )}
            renderOption={(props, option, { index }) => (
              <Box
                component="li"
                {...props}
                key={
                  option._id ||
                  option.email ||
                  option.businessName ||
                  option.name ||
                  index
                }
              >
                <Box>
                  <Box sx={{ fontWeight: "bold" }}>
                    {option.businessName || option.companyName || option.name}
                  </Box>
                  <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                    {option.user?.email}
                  </Box>
                </Box>
              </Box>
            )}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            noOptionsText={
              suppliersLoading ? "Loading..." : "No suppliers found"
            }
            loading={suppliersLoading}
            disabled={suppliersLoading}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button
            onClick={handleCloseAddModal}
            variant="contained"
            color="error"
            startIcon={<CloseIcon />}
            sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveProduct}
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
            disabled={isLoading}
          >
            Save Product
          </Button>
        </DialogActions>
        {saveError && (
          <div
            style={{
              color: "red",
              textAlign: "center",
              marginTop: 8,
              marginBottom: 16,
            }}
          >
            {saveError}
          </div>
        )}
        {saveSuccess && (
          <div
            style={{
              color: "green",
              textAlign: "center",
              marginTop: 8,
              marginBottom: 16,
              fontWeight: "bold",
            }}
          >
            {saveSuccess}
          </div>
        )}
      </Dialog>

      <Dialog
        open={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          zIndex: 9999,
          "& .MuiDialog-paper": {
            zIndex: 9999,
            backgroundColor: "#ffffff",
            border: "2px solid #0387D9",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: 22,
            pb: 0,
            pr: 5,
            backgroundColor: "#f0f8ff",
          }}
        >
          Confirm Deletion
          <IconButton
            aria-label="close"
            onClick={() => setShowDeleteConfirmation(false)}
            sx={{ position: "absolute", right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <p>Are you sure you want to delete this product?</p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button
            onClick={() => setShowDeleteConfirmation(false)}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showViewModal}
        onClose={handleCloseViewModal}
        maxWidth="sm"
        fullWidth
        sx={{
          zIndex: 9999,
          "& .MuiDialog-paper": {
            zIndex: 9999,
            backgroundColor: "#ffffff",
            border: "2px solid #0387D9",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: 22,
            pb: 0,
            pr: 5,
            backgroundColor: "#f0f8ff",
          }}
        >
          Inventory Summary
          <IconButton
            aria-label="close"
            onClick={handleCloseViewModal}
            sx={{ position: "absolute", right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: 2,
              background: "#FAFAFA",
              p: 2,
              mb: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ fontWeight: 500, color: "#222", fontSize: 16 }}>
                  {viewItem.productName || "Yacht"}
                </Box>
                <Box sx={{ color: "#6B7280", fontSize: 14 }}>ID</Box>
                <Box
                  sx={{
                    color: "#111827",
                    fontWeight: 500,
                    fontSize: 14,
                    mb: 1,
                  }}
                >
                  #{viewItem.id?.slice?.(-6) || viewItem.id || "—"}
                </Box>
                <Box sx={{ color: "#6B7280", fontSize: 14 }}>Product Name</Box>
                <Box
                  sx={{
                    color: "#111827",
                    fontWeight: 500,
                    fontSize: 14,
                    mb: 1,
                  }}
                >
                  {viewItem.productName}
                </Box>
                <Box sx={{ color: "#6B7280", fontSize: 14 }}>Category</Box>
                <Box
                  sx={{
                    color: "#111827",
                    fontWeight: 500,
                    fontSize: 14,
                    mb: 1,
                  }}
                >
                  {viewItem.category}
                </Box>
                <Box sx={{ color: "#6B7280", fontSize: 14 }}>Price</Box>
                <Box
                  sx={{
                    color: "#111827",
                    fontWeight: 500,
                    fontSize: 14,
                    mb: 1,
                  }}
                >
                  {viewItem.price ? `$${viewItem.price}` : "—"}
                </Box>
                <Box sx={{ color: "#6B7280", fontSize: 14 }}>Availability</Box>
                <Box
                  sx={{
                    color: "#111827",
                    fontWeight: 500,
                    fontSize: 14,
                    mb: 1,
                  }}
                >
                  {viewItem.stockQuantity || "In Stock"}
                </Box>
                <Box sx={{ color: "#6B7280", fontSize: 14 }}>Supplier</Box>
                <Box
                  sx={{
                    color: "#111827",
                    fontWeight: 500,
                    fontSize: 14,
                    mb: 1,
                  }}
                >
                  {typeof viewItem.supplier === "object"
                    ? viewItem.supplier.businessName ||
                      viewItem.supplier.user?.email ||
                      "Not available"
                    : typeof viewItem.supplier === "string" &&
                      viewItem.supplier.trim() !== ""
                    ? viewItem.supplier
                    : "Not available"}
                </Box>
              </Box>
              <Box>
                {viewItem.productImage ? (
                  <img
                    src={viewItem.productImage}
                    alt={viewItem.productName}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 8,
                      objectFit: "cover",
                      marginLeft: 16,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 8,
                      background: "#E5E7EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: 2,
                    }}
                  >
                    <span
                      style={{
                        color: "#9CA3AF",
                        fontSize: 12,
                        textAlign: "center",
                      }}
                    >
                      Not available
                    </span>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ fontWeight: 500, color: "#222", mb: 1 }}>
              Description
            </Box>
            <TextField
              fullWidth
              multiline
              minRows={3}
              variant="outlined"
              InputProps={{ style: { background: "#FAFAFA", borderRadius: 8 } }}
              value={viewItem.product?.description || "Not available"}
              inputProps={{ readOnly: true, style: { color: "#000" } }}
            />
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          zIndex: 9999,
          "& .MuiDialog-paper": {
            zIndex: 9999,
            backgroundColor: "#ffffff",
            border: "2px solid #0387D9",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: 22,
            pb: 0,
            pr: 5,
            backgroundColor: "#f0f8ff",
          }}
        >
          Send Email
          <IconButton
            aria-label="close"
            onClick={() => setShowEmailModal(false)}
            sx={{ position: "absolute", right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label
              htmlFor="to"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              To
            </label>
            <TextField
              id="to"
              value={emailData.to}
              onChange={(e) =>
                setEmailData({ ...emailData, to: e.target.value })
              }
              style={{ width: "100%", padding: "8px" }}
              placeholder="Enter recipient email"
            />
          </div>

          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label
              htmlFor="subject"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              Subject
            </label>
            <TextField
              id="subject"
              value={emailData.subject}
              onChange={(e) =>
                setEmailData({ ...emailData, subject: e.target.value })
              }
              style={{ width: "100%", padding: "8px" }}
              placeholder="Enter email subject"
            />
          </div>

          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label
              htmlFor="message"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              Message
            </label>
            <textarea
              id="message"
              value={emailData.message}
              onChange={(e) =>
                setEmailData({ ...emailData, message: e.target.value })
              }
              style={{
                width: "100%",
                minHeight: "200px",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ced4da",
                resize: "vertical",
              }}
              placeholder="Enter your message"
              required
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button
            onClick={() => setShowEmailModal(false)}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEmailSubmit}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
            disabled={
              !emailData.to ||
              !emailData.subject ||
              !emailData.message ||
              !emailData.message.trim() ||
              isSendingEmail
            }
          >
            Send Email
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Invent;

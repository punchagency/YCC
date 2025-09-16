import React, { useState, useEffect, useRef } from "react";
import {
  useOutletContext, useNavigate
} from "react-router-dom";

import { useTheme } from "../../context/theme/themeContext";
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from '@mui/icons-material/Inventory';
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
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Button,
  Autocomplete,
  Typography,
  Stack,
  Grid,
  Divider,
  Chip,
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ImageIcon from "@mui/icons-material/Image";
import EmailIcon from "@mui/icons-material/Email";
import CircularProgress from "@mui/material/CircularProgress";
import { updateInventoryItem } from "../../services/supplier/supplierService";

import {
  createInventoryData,
  getAllInventories,
  deleteInventoryItem,
  sendInventoryEmail,
  getAllSuppliers,
} from "../../services/inventory/inventoryService";

// const InventoryTableSkeleton = () => {
//   const { theme } = useTheme();
//   return (
//     <div className="inventory-skeleton">
//       {[...Array(10)].map((_, i) => (
//         <div
//           key={i}
//           style={{
//             display: "flex",
//             padding: "10px",
//             borderBottom: "1px solid #eaecf0",
//             backgroundColor: theme === "light" ? "#FFFFFF" : "#03141F",
//           }}
//         >
//           {[...Array(7)].map((_, j) => (
//             <div
//               key={j}
//               style={{
//                 flex: j === 0 ? "2" : "1",
//                 height: "20px",
//                 backgroundColor: theme === "light" ? "#f3f4f6" : "#1f2937",
//                 marginRight: "10px",
//                 borderRadius: "4px",
//                 animation: "pulse 1.5s infinite",
//               }}
//             />
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

const Invent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [viewItem, setViewItem] = useState({
    id: null,
    productId: "",
    productName: "",
    description: "",
    category: [], // always an array
    serviceArea: "",
    stockQuantity: "",
    price: "",
    productImage: null,
    hsCode: '',
    countryOfOrigin: '',
    height: 1,
    width: 1,
    length_: 1,
    weight: 1,
  });
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Initialize with empty array
  const [inventoryItems, setInventoryItems] = useState([]);

  const [editItem, setEditItem] = useState({
    id: null,
    productId: null,
    productName: "",
    description: "",
    category: [], // always an array
    serviceArea: "",
    stockQuantity: "",
    price: "",
    productImage: null,
    hsCode: '',
    countryOfOrigin: '',
    height: 1,
    width: 1,
    length_: 1,
    weight: 1,
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
    hsCode: '',
    countryOfOrigin: '',
    height: 1,
    width: 1,
    length_: 1,
    weight: 1,
  });

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [suppliersLoading, setSuppliersLoading] = useState(false);

  const { theme } = useTheme();

  // Add this state variable with your other state variables
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Add these state variables with your other state declarations
  const [totalPages, setTotalPages] = useState(0);

  // Add these state variables
  const [page, setPage] = useState(0);
  const [hasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const isRequestInProgress = useRef(false); // Add this ref to track ongoing requests

  const { setPageTitle } = useOutletContext() || {};

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [pageSize] = useState(10);

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
  const [supplierPage] = useState(1);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const SUPPLIERS_PER_PAGE = 10;

  // Add state for controlling the supplier dropdown open state
  const [supplierDropdownOpen, setSupplierDropdownOpen] = useState(false);

  // 1. Add state for search text and applied filters
  const [searchText, setSearchText] = useState("");
  const [appliedStockStatus, setAppliedStockStatus] =
    useState(stockStatusFilter);
  const [appliedSearchText, setAppliedSearchText] = useState("");

  // Add this state to the Invent component
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

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

  // const onPageChange = (event, newPage) => {
  //   setPage(newPage - 1);
  //   // Fetch new page data here if needed
  // };

  // const onRowsPerPageChange = (event) => {
  //   setPageSize(parseInt(event.target.value, 10));
  //   setPage(0);
  //   // Fetch new page data here if needed
  // };

  // // Add this function to handle infinite scroll
  // const lastInventoryElementRef = useCallback(
  //   (node) => {
  //     if (isLoadingMore) return;
  //     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver(
  //       (entries) => {
  //         if (entries[0].isIntersecting && hasMore) {
  //           loadMoreData();
  //         }
  //       },
  //       {
  //         root: null,
  //         rootMargin: "20px",
  //         threshold: 1.0,
  //       }
  //     );
  //     if (node) observer.current.observe(node);
  //   },
  //   [isLoadingMore, hasMore]
  // );

  // // Inside your component, define the service area options
  // const serviceAreaOptions = [
  //   { label: "Caribbean", value: "caribbean" },
  //   { label: "Mediterranean", value: "mediterranean" },
  //   { label: "USA", value: "usa" },
  // ];

  // Add new state for email modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
    productName: "",
  });
  const [isSendingEmail, setIsSendingEmail] = useState(false);

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
        const formattedItems = result.data.flatMap((item) =>
          item.products?.map(product => ({
            id: item._id,
            productId: product.productId,
            productName: product.productName || "Unknown Product",
            category: typeof product.category === 'string' ? [product.category] : Array.isArray(product.category) ? product.category : ["Uncategorized"],
            description: product.description || "Not available",
            supplier: item.supplier?.businessName || item.userInfo?.businessName || "Not available",
            stockQuantity: product.quantity || 0,
            price: product.price || 0,
            productImage: product.productImage || null,
            hsCode: product.hsCode || "",
            countryOfOrigin: product.countryOfOrigin || "",
            height: product.height || 0,
            width: product.width || 0,
            length: product['length'] || 0,
            weight: product.weight || 0,
          })) || []
        );
        setInventoryItems(formattedItems);
        setTotalItems(result.pagination?.totalItems || formattedItems.length);
        setTotalPages(result.pagination?.totalPages || 1);
      } else {
        setInventoryItems([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      setInventoryItems([]);
      setTotalItems(0);
      setTotalPages(1);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);;

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      let updateData;
      let isFormData = false;
      if (editItem.productImage && editItem.productImage instanceof File) {
        updateData = new FormData();
        updateData.append("productName", editItem.productName);
        updateData.append("category", editItem.category);
        updateData.append("quantity", editItem.stockQuantity);
        updateData.append("price", editItem.price);
        updateData.append("description", editItem.description);
        updateData.append("productImage", editItem.productImage);
        updateData.append("productId", editItem.productId);
        updateData.append("hsCode", editItem.hsCode);
        updateData.append("countryOfOrigin", editItem.countryOfOrigin);
        updateData.append("height", editItem.height);
        updateData.append("width", editItem.width);
        updateData.append("length", editItem.length_);
        updateData.append("weight", editItem.weight);
        isFormData = true;
      } else {
        updateData = {
          productName: editItem.productName,
          category: editItem.category,
          quantity: editItem.stockQuantity,
          price: editItem.price,
          description: editItem.description,
          productId: editItem.productId,
          hsCode: editItem.hsCode,
          countryOfOrigin: editItem.countryOfOrigin,
          height: editItem.height,
          width: editItem.width,
          length: editItem.length_,
          weight: editItem.weight
        };
      }
      try {
        const result = await updateInventoryItem(
          editItem.id,
          updateData,
          isFormData
        );

        if (result.success) {
          // Handle the nested response structure
          const responseData = result.data?.data || result.data;

          if (!responseData) {
            throw new Error('Invalid response structure');
          }

          // Update UI with new data
          const inventory = responseData;

          // Enhanced formatting with better error handling
          const formattedItems = inventory.products.map((prod) => {

            return {
              id: inventory._id,
              productId: prod.productId, // Use productId from response instead of nested product._id
              productName: prod.productName || "Unknown Product",
              category: Array.isArray(prod.category) ? prod.category : typeof prod.category === 'string' ? [prod.category] : ["Uncategorized"],
              description: prod.description || "Not available",
              supplier: inventory.supplier?.businessName || "Not available",
              stockQuantity: Number(prod.quantity) || 0,
              price: Number(prod.price) || 0,
              productImage: prod.productImage || null,
              sku: prod.sku || "",
              hsCode: prod.hsCode || "",
              countryOfOrigin: prod.countryOfOrigin || "",
              height: Number(prod.height) || 0, // Changed default from 1 to 0 to match API
              width: Number(prod.width) || 0,
              length: Number(prod['length']) || 0, // Fixed typo: was length_
              weight: Number(prod.weight) || 0,
              // Additional fields that might be useful
              warehouseLocation: inventory.warehouseLocation || "",
              createdAt: inventory.createdAt,
              updatedAt: inventory.updatedAt
            };
          });

          // Update the inventory items state
          setInventoryItems(formattedItems);

          // Close modal and show success message
          setShowEditModal(false);
          setSnackbar({
            open: true,
            message: result.data?.message || "Product updated successfully!",
            severity: "success",
          });

        } else {
          // Handle failure case
          setSnackbar({
            open: true,
            message: result.error || result.message || "Update failed",
            severity: "error",
          });
        }

      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || "An unexpected error occurred",
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
      inventoryId: item.id, // inventory document id
      productId: item.productId, // product id inside inventory
      index: index,
    });
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsLoading(true);
    try {
      // Call deleteInventoryItem with inventoryId and productId
      const result = await deleteInventoryItem(itemToDelete.inventoryId, itemToDelete.productId);
      if (result.success) {
        // Remove the deleted item from the state
        setInventoryItems((prevItems) =>
          prevItems.filter((_, index) => index !== itemToDelete.index)
        );
      } else {
      }
    } catch (error) {
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
      setSnackbar({
        message: "Product name and category are required",
        open: true,
        severity: "error",
      });
      return;
    }

    // Validate quantity
    if (!newItem.stockQuantity || newItem.stockQuantity <= 0) {
      setSnackbar({
        message: "Stock quantity must be greater than 0",
        open: true,
        severity: "error",
      });
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
      formData.append("hsCode", newItem.hsCode);
      formData.append("countryOfOrigin", newItem.countryOfOrigin);
      formData.append("height", newItem.height);
      formData.append("width", newItem.width);
      formData.append("length", newItem.length_);
      formData.append("weight", newItem.weight);

      // In handleSaveProduct, always send description (backend will ignore if not needed)
      formData.append("description", newItem.description);
      if (newItem.supplier) {
        formData.append("supplierId", newItem.supplier);
      }

      // Append the image file if one was selected
      if (productImage) {
        formData.append("inventoryImage", productImage);
      }

      const result = await createInventoryData(formData);
      if (result.success) {
        const inventory = result.data.data;
        const formattedItems = inventory.products.map((prod) => ({
          id: inventory._id,
          productId: prod.product._id,
          productName: prod.product.name || "Unknown Product",
          category: Array.isArray(prod.product.category) ? prod.product.category : typeof prod.product.category === 'string' ? [prod.product.category] : ["Uncategorized"],
          description: prod.product.description || "Not available",
          supplier: inventory.supplier?.businessName || "Not available",
          stockQuantity: prod.quantity || 0,
          price: prod.product.price || 0,
          productImage: prod.product.productImage || null,
          hsCode: prod.product.hsCode || "",
          countryOfOrigin: prod.product.countryOfOrigin || "",
          height: prod.product.height || 1,
          width: prod.product.width || 1,
          length: prod.product['length'] || 1,
          weight: prod.product.weight || 1,
        }));
        setInventoryItems(formattedItems);
        setTotalItems(result.pagination?.totalItems || formattedItems.length);
        setTotalPages(result.pagination?.totalPages || 1);

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
      } else {
        setSnackbar({
          message: result.error || "Failed to add inventory. Please try again.",
          open: true,
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        message: "An unexpected error occurred. Please try again.",
        open: true,
        severity: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update the view item handler
  const handleViewItem = (item) => {
    setViewItem({ ...item, length_: item['length'] });
    setShowViewModal(true);
  };
  const handleEditModal = (item) => {
    setEditItem({ ...item, length_: item['length'] });
    setShowEditModal(true);
  };

  // Simplified modal close handler
  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewItem({
      id: null,
      productName: "",
      description: "",
      category: "",
      serviceArea: "",
      stockQuantity: "",
      price: "",
      productImage: null,
      hsCode: '',
      countryOfOrigin: '',
      height: 1,
      width: 1,
      length_: 1,
      weight: 1,
    });
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
      <Box sx={{ px: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            background: theme === "light" ? '#fff' : '#1a1a1a',
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ width: "100%" }}
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
                  background: theme === "light" ? "linear-gradient(135deg, #fff 0%, #f8fafc 100%)" : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1,
                  width: "100%",
                  height: 40,
                }}
                fullWidth
                endIcon={<span style={{ fontSize: 12, color: "#6b7280" }}>▼</span>}
              >
                {stockStatusFilter === "all" && "All Status"}
                {stockStatusFilter === "high" && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RadioButtonUncheckedIcon
                      sx={{ color: "#059669", fontSize: 18 }}
                    />
                    <span style={{ color: "#059669" }}>High Stock</span>
                  </Box>
                )}
                {stockStatusFilter === "medium" && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RemoveIcon sx={{ color: "#D97706", fontSize: 18 }} />
                    <span style={{ color: "#D97706" }}>Medium Stock</span>
                  </Box>
                )}
                {stockStatusFilter === "low" && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ErrorOutlineIcon
                      sx={{ color: "#DC2626", fontSize: 18 }}
                    />
                    <span style={{ color: "#DC2626" }}>Low Stock</span>
                  </Box>
                )}
              </Button>
              {stockStatusDropdownOpen && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: theme === "light" ? "#fff" : "#1a1a1a",
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    zIndex: 10,
                    mt: 0.5,
                    overflow: 'hidden',
                  }}
                >
                  {[
                    { key: "all", label: "All Status" },
                    {
                      key: "high",
                      label: "High Stock",
                      icon: (
                        <RadioButtonUncheckedIcon
                          sx={{ color: "#059669", fontSize: 18 }}
                        />
                      ),
                    },
                    {
                      key: "medium",
                      label: "Medium Stock",
                      icon: (
                        <RemoveIcon
                          sx={{ color: "#D97706", fontSize: 18 }}
                        />
                      ),
                    },
                    {
                      key: "low",
                      label: "Low Stock",
                      icon: (
                        <ErrorOutlineIcon
                          sx={{ color: "#DC2626", fontSize: 18 }}
                        />
                      ),
                    },
                  ].map((opt) => (
                    <Box
                      key={opt.key}
                      className={`custom-dropdown-item${stockStatusFilter === opt.key ? " active" : ""
                        }`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 2,
                        py: 1.5,
                        cursor: "pointer",
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
                          stockStatusFilter === opt.key ?
                            theme === "light" ? "#eff6ff" : "#1e293b" :
                            undefined,
                        "&:hover": {
                          background: theme === "light" ? "#f8fafc" : "#1e293b",
                        },
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  height: 40,
                  '&.Mui-focused': {
                    boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.2)',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setAppliedStockStatus(stockStatusFilter);
                setAppliedSearchText(searchText);
              }}
              sx={{
                minWidth: { sm: 120 },
                height: 40,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              Search
            </Button>
          </Stack>
        </Paper>

        {inventoryItems.map((item, index) => {
          // Determine stock status color
          const stockStatus = getStockStatus(item.stockQuantity);
          const statusColor =
            stockStatus === 'high' ? '#059669' :
              stockStatus === 'medium' ? '#D97706' :
                '#DC2626';

          return (
            <Paper
              key={index}
              elevation={1}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                mb: 2,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                },
                position: 'relative',
                background: theme === "light" ? '#fff' : '#1a1a1a',
              }}
            >
              {/* Status indicator line at top */}
              <Box
                sx={{
                  height: '4px',
                  width: '100%',
                  bgcolor: statusColor,
                }}
              />

              <Box sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {item.productName}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleViewItem(item)}
                      sx={{
                        bgcolor: 'rgba(0, 102, 204, 0.1)',
                        color: '#0066cc',
                        '&:hover': { bgcolor: 'rgba(0, 102, 204, 0.2)' },
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEditModal(item)}
                      sx={{
                        bgcolor: 'rgba(5, 150, 105, 0.1)',
                        color: '#059669',
                        '&:hover': { bgcolor: 'rgba(5, 150, 105, 0.2)' },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(index)}
                      sx={{
                        bgcolor: 'rgba(220, 38, 38, 0.1)',
                        color: '#DC2626',
                        '&:hover': { bgcolor: 'rgba(220, 38, 38, 0.2)' },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>

                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      Category
                    </Typography>
                    <Typography variant="body2">
                      {item.category && item.category.length > 0 && item.category.slice(0, 1).map(cat => cat).join(", ")}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      Stock
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ color: statusColor }}
                    >
                      {item.stockQuantity} units
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      Price
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {!isNaN(Number(item.price))
                        ? formatCurrency(Number(item.price)) + " per unit"
                        : "$0.00"}
                    </Typography>
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<EmailIcon />}
                  onClick={() => handleSendEmail(item)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    py: 1,
                    background: 'linear-gradient(135deg, #0066cc 0%, #0044aa 100%)',
                    boxShadow: '0 4px 12px rgba(0, 102, 204, 0.2)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(0, 102, 204, 0.3)',
                    },
                  }}
                >
                  Contact Supplier
                </Button>
              </Box>
            </Paper>
          );
        })}

        {inventoryItems.length === 0 && !isLoading && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: 'center',
              border: '1px dashed #cbd5e1',
              bgcolor: theme === "light" ? 'rgba(241, 245, 249, 0.6)' : 'rgba(30, 41, 59, 0.6)',
            }}
          >
            <InventoryIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
            <Typography variant="h6" fontWeight={600} color="text.secondary">
              No inventory items found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add your first product to get started
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddProduct}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              Add Product
            </Button>
          </Paper>
        )}

        {inventoryItems.length > 0 && (
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
        )}
      </Box>
    );
  };

  // Render inventory items with loading state
  const renderInventoryItems = () => {
    if (isLoading) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={40} thickness={4} />
          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading inventory items...
          </Typography>
        </Box>
      );
    }
    // Return null when there are items (they'll be rendered by desktop or mobile view)
    return null;
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Modify the desktop view to include the loading indicator
  const renderDesktopView = () => {
    return (
      <>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
            mb: 3,
            p: 2,
            marginTop: "28px",
            backgroundColor: theme === "light" ? "#fff" : "#1a1a1a",
            borderRadius: 3,
            border: "1px solid #EAECF0",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <FilterListIcon color="primary" fontSize="small" />
            <Typography variant="subtitle2" fontWeight={600}>Filters:</Typography>
          </Stack>

          <Box
            className="custom-dropdown"
            sx={{
              minWidth: 180,
              position: "relative",
              flex: { xs: '1 1 100%', sm: '0 1 auto' },
              mt: { xs: 1, sm: 0 },
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setStockStatusDropdownOpen((open) => !open)}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                border: "1px solid #e2e8f0",
                background: theme === "light" ? "linear-gradient(135deg, #fff 0%, #f8fafc 100%)" : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1,
                height: 40,
              }}
              fullWidth
              endIcon={<span style={{ fontSize: 12, color: "#6b7280" }}>▼</span>}
            >
              {stockStatusFilter === "all" && "All Status"}
              {stockStatusFilter === "high" && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RadioButtonUncheckedIcon
                    sx={{ color: "#059669", fontSize: 18 }}
                  />
                  <span style={{ color: "#059669" }}>High Stock</span>
                </Box>
              )}
              {stockStatusFilter === "medium" && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RemoveIcon sx={{ color: "#D97706", fontSize: 18 }} />
                  <span style={{ color: "#D97706" }}>Medium Stock</span>
                </Box>
              )}
              {stockStatusFilter === "low" && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ErrorOutlineIcon
                    sx={{ color: "#DC2626", fontSize: 18 }}
                  />
                  <span style={{ color: "#DC2626" }}>Low Stock</span>
                </Box>
              )}
            </Button>
            {stockStatusDropdownOpen && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: theme === "light" ? "#fff" : "#1a1a1a",
                  border: "1px solid #e2e8f0",
                  borderRadius: 2,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  zIndex: 10,
                  mt: 0.5,
                  overflow: 'hidden',
                }}
              >
                {[
                  { key: "all", label: "All Status" },
                  {
                    key: "high",
                    label: "High Stock",
                    icon: (
                      <RadioButtonUncheckedIcon
                        sx={{ color: "#059669", fontSize: 18 }}
                      />
                    ),
                  },
                  {
                    key: "medium",
                    label: "Medium Stock",
                    icon: (
                      <RemoveIcon
                        sx={{ color: "#D97706", fontSize: 18 }}
                      />
                    ),
                  },
                  {
                    key: "low",
                    label: "Low Stock",
                    icon: (
                      <ErrorOutlineIcon
                        sx={{ color: "#DC2626", fontSize: 18 }}
                      />
                    ),
                  },
                ].map((opt) => (
                  <Box
                    key={opt.key}
                    className={`custom-dropdown-item${stockStatusFilter === opt.key ? " active" : ""
                      }`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 1.5,
                      cursor: "pointer",
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
                        stockStatusFilter === opt.key ?
                          theme === "light" ? "#eff6ff" : "#1e293b" :
                          undefined,
                      "&:hover": {
                        background: theme === "light" ? "#f8fafc" : "#1e293b",
                      },
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

          <Box sx={{ display: 'flex', gap: 2, flex: 1, maxWidth: { xs: '100%', md: '50%' } }}>
            <TextField
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by product name..."
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  height: 40,
                  '&.Mui-focused': {
                    boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.2)',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setAppliedStockStatus(stockStatusFilter);
                setAppliedSearchText(searchText);
              }}
              sx={{
                minWidth: 100,
                height: 40,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              Search
            </Button>
          </Box>
        </Paper>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: theme === "light" ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
            border: `1px solid ${theme === "light" ? "#EAECF0" : "#333"}`,
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead sx={{
              backgroundColor: theme === "light" ? "#F9FAFB" : "#1a1a1a",
              width: "100%",
              borderBottom: `1px solid ${theme === "light" ? "#EAECF0" : "#333"}`,
            }}>
              <TableRow 
                sx={{
                  width: "100%",
                  backgroundColor: theme === "light" ? "#F9FAFB" : "#1a1a1a",
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                    inputProps={{ "aria-label": "select all products" }}
                    sx={{
                      color: theme === "light" ? "#94a3b8" : "#64748b",
                      '&.Mui-checked': {
                        color: '#0066cc',
                      },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: theme === "light" ? "#374151" : "#e2e8f0" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Product ID
                    <IconButton size="small" sx={{ color: theme === "light" ? "#94a3b8" : "#64748b" }}>
                      <FilterListIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                {user.role.name === 'admin' && (
                  <TableCell sx={{ fontWeight: 600, color: theme === "light" ? "#374151" : "#e2e8f0" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      Supplier's Name
                      <IconButton size="small" sx={{ color: theme === "light" ? "#94a3b8" : "#64748b" }}>
                        <FilterListIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 600, color: theme === "light" ? "#374151" : "#e2e8f0" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Product Name
                    <IconButton size="small" sx={{ color: theme === "light" ? "#94a3b8" : "#64748b" }}>
                      <FilterListIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: theme === "light" ? "#374151" : "#e2e8f0" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Category
                    <IconButton size="small" sx={{ color: theme === "light" ? "#94a3b8" : "#64748b" }}>
                      <FilterListIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: theme === "light" ? "#374151" : "#e2e8f0" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Stock Quantity
                    <IconButton size="small" sx={{ color: theme === "light" ? "#94a3b8" : "#64748b" }}>
                      <FilterListIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: theme === "light" ? "#374151" : "#e2e8f0" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Price
                    <IconButton size="small" sx={{ color: theme === "light" ? "#94a3b8" : "#64748b" }}>
                      <FilterListIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: theme === "light" ? "#374151" : "#e2e8f0" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Actions
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoryItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                      <InventoryIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
                      <Typography variant="h5" fontWeight={600} color="text.secondary">
                        No inventory items found
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, mt: 1, maxWidth: 400, mx: 'auto' }}>
                        Start by adding your first product to manage your inventory effectively
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddProduct}
                        startIcon={<AddIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          px: 4,
                          py: 1.5,
                          fontWeight: 600,
                          boxShadow: '0 4px 12px rgba(0, 102, 204, 0.2)',
                        }}
                      >
                        Add Your First Product
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                inventoryItems.map((item, idx) => {
                  const stockStatus = getStockStatus(item.stockQuantity);
                  const statusColor =
                    stockStatus === 'high' ? '#059669' :
                      stockStatus === 'medium' ? '#D97706' :
                        '#DC2626';
                  const statusBgColor =
                    stockStatus === 'high' ? '#ECFDF3' :
                      stockStatus === 'medium' ? '#FFFAEB' :
                        '#FEF3F2';

                  return (
                    <TableRow
                      key={item.id}
                      hover
                      selected={selectedItems.includes(item.id)}
                      sx={{
                        '&:hover': {
                          backgroundColor: theme === "light" ? 'rgba(0, 102, 204, 0.04)' : 'rgba(0, 102, 204, 0.08)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: theme === "light" ? 'rgba(0, 102, 204, 0.08)' : 'rgba(0, 102, 204, 0.12)',
                          '&:hover': {
                            backgroundColor: theme === "light" ? 'rgba(0, 102, 204, 0.12)' : 'rgba(0, 102, 204, 0.16)',
                          },
                        },
                        borderBottom: `1px solid ${theme === "light" ? "#EAECF0" : "#333"}`,
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          inputProps={{
                            "aria-label": `select product ${item.productName}`,
                          }}
                          sx={{
                            color: theme === "light" ? "#94a3b8" : "#64748b",
                            '&.Mui-checked': {
                              color: '#0066cc',
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: theme === "light" ? "#374151" : "#e2e8f0" }}>
                        <Chip
                          label={`#${item.productId?.slice?.(-6) || item.productId || idx + 1}`}
                          size="small"
                          sx={{
                            bgcolor: theme === "light" ? '#f1f5f9' : '#1e293b',
                            color: theme === "light" ? '#334155' : '#94a3b8',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            height: 24,
                          }}
                        />
                      </TableCell>
                      {user.role.name === 'admin' && (
                      <TableCell sx={{ fontWeight: 500, color: theme === "light" ? "#111827" : "#f8fafc" }}>
                        {typeof item.supplier === "object"
                          ? item.supplier.businessName ||
                          item.supplier.user?.email ||
                          "Not available"
                          : typeof item.supplier === "string" &&
                            item.supplier.trim() !== ""
                            ? item.supplier
                            : "Not available"}
                      </TableCell>
                      )}
                      <TableCell sx={{ fontWeight: 500, color: theme === "light" ? "#111827" : "#f8fafc" }}>
                        {item.productName}
                      </TableCell>
                      <TableCell sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {item.category && item.category.length > 0 && item.category.slice(0, 2).map((cat) => (
                          <Chip
                            key={cat}
                            label={cat}
                            size="small"
                            sx={{
                              bgcolor: theme === "light" ? '#f1f5f9' : '#1e293b',
                              color: theme === "light" ? '#334155' : '#94a3b8',
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              height: 24,
                            }}
                          />
                        ))}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            backgroundColor: statusBgColor,
                            color: statusColor,
                            py: 0.5,
                            px: 1.5,
                            borderRadius: 2,
                            display: "inline-flex",
                            alignItems: 'center',
                            gap: 0.5,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            width: 'fit-content',
                          }}
                        >
                          {stockStatus === 'high' && <RadioButtonUncheckedIcon sx={{ fontSize: 14 }} />}
                          {stockStatus === 'medium' && <RemoveIcon sx={{ fontSize: 14 }} />}
                          {stockStatus === 'low' && <ErrorOutlineIcon sx={{ fontSize: 14 }} />}
                          {item.stockQuantity} units
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500, color: theme === "light" ? "#111827" : "#f8fafc" }}>
                        {!isNaN(Number(item.price))
                          ? formatCurrency(Number(item.price))
                          : "$0.00"}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewItem(item)}
                            sx={{
                              bgcolor: 'rgba(0, 102, 204, 0.1)',
                              color: '#0066cc',
                              '&:hover': { bgcolor: 'rgba(0, 102, 204, 0.2)' },
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEditModal(item)}
                            sx={{
                              bgcolor: 'rgba(5, 150, 105, 0.1)',
                              color: '#059669',
                              '&:hover': { bgcolor: 'rgba(5, 150, 105, 0.2)' },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(idx)}
                            sx={{
                              bgcolor: 'rgba(220, 38, 38, 0.1)',
                              color: '#DC2626',
                              '&:hover': { bgcolor: 'rgba(220, 38, 38, 0.2)' },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          {/* {user.role.name === 'admin' && (
                            <IconButton
                              size="small"
                              onClick={() => handleSendEmail(item)}
                              sx={{
                                bgcolor: 'rgba(79, 70, 229, 0.1)',
                                color: '#4F46E5',
                                '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.2)' },
                              }}
                            >
                              <EmailIcon fontSize="small" />
                            </IconButton>
                          )} */}

                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
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
        setSuppliers([]);
      }
    } catch (error) {
      setSuppliers([]);
    } finally {
      setSuppliersLoading(false);
    }
  };

  const handleImportFromCSV = () => {
    navigate(`/supplier/products/onboarding/${user._id}`);
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
    window.addEventListener(
      "openImportInventoryCSVModal",
      handleImportFromCSV
    );

    return () => {
      window.removeEventListener(
        "openCreateInventoryModal",
        handleCreateInventoryModal
      );
      window.removeEventListener(
        "openImportInventoryCSVModal",
        handleImportFromCSV
      );
    };
  }, [setPageTitle]);


  const categoryOptions = [
    {
      label: "Navigation Equipment",
      value: "Navigation Equipment",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/navigation1.png",
    },
    {
      label: "Safety Gear",
      value: "Safety Gear",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/safety1.png",
    },
    {
      label: "Marine Electronics",
      value: "Marine Electronics",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/electronics1.png",
    },
    {
      label: "Deck Equipment",
      value: "Deck_Equipment",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/deck1.png",
    },
    {
      label: "Engine & Propulsion",
      value: "Engine & Propulsion",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/engine1.png",
    },
    {
      label: "Anchoring System",
      value: "Anchoring System",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/anchor1.png",
    },
    {
      label: "Sailing Equipment",
      value: "Sailing Equipment",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/sailing1.png",
    },
    {
      label: "Water Sports Gear",
      value: "Water Sports Gear",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/sports1.png",
    },
    {
      label: "Fishing Equipment",
      value: "Fishing Equipment",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/fishing1.png",
    },
    {
      label: "Marine Furniture",
      value: "Marine Furniture",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/furniture1.png",
    },
    {
      label: "Galley Equipment",
      value: "Galley Equipment",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/galley1.png",
    },
    {
      label: "Refrigeration",
      value: "Refrigeration",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/refrigeration1.png",
    },
    {
      label: "Water Systems",
      value: "Water Systems",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/water1.png",
    },
    {
      label: "Electrical Systems",
      value: "Electrical Systems",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/electrical1.png",
    },
    {
      label: "Hull Maintenance",
      value: "Hull Maintenance",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/maintenance1.png",
    },
    {
      label: "Mooring Equipment",
      value: "Mooring Equipment",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/mooring1.png",
    },
    {
      label: "Communication Systems",
      value: "Communication Systems",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/communication1.png",
    },
    {
      label: "Sea Food Storage",
      value: "Sea Food Storage",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/food_storage1.png",
    },
    {
      label: "Bilge Systems",
      value: "Bilge Systems",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/bilge1.png",
    },
    {
      label: "HVAC Systems",
      value: "HVAC Systems",
      icon: process.env.PUBLIC_URL + "/RescourceIcon/hvac1.png",
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
        open={showEditModal && editItem.id}
        onClose={() => {
          setShowEditModal(false);
          setEditItem({
            id: null,
            productName: "",
            category: [], // always an array
            stockQuantity: "",
            price: "",
            description: "",
            serviceArea: "",
            productImage: null,
            fileName: "",
            height: 1,
            hsCode: '',
            countryOfOrigin: '',
            weight: 1,
            width: 1,
            length_: 1,
          });
        }}
        maxWidth="sm"
        fullWidth
        sx={{
          zIndex: 9999,
          "& .MuiDialog-paper": {
            zIndex: 9999,
            backgroundColor: "#ffffff",
            border: "none",
            maxWidth: { xs: "100%", sm: "600px" },
            width: "100%",
            borderRadius: { xs: 0, sm: "16px" },
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            m: { xs: 0, sm: 2 },
            p: { xs: 0, sm: 0 },
            height: { xs: "100vh", sm: "auto" },
            maxHeight: { xs: "100vh", sm: "90vh" },
            overflowY: "auto",
            position: "relative",
          },
        }}
      >
        <Box sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#fff",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          borderTopLeftRadius: { xs: 0, sm: "16px" },
          borderTopRightRadius: { xs: 0, sm: "16px" },
        }}>
          <Typography variant="h6" fontWeight="600" color="#111827">
            Edit Product
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setShowEditModal(false)}
            sx={{
              color: "#6B7280",
              "&:hover": {
                backgroundColor: "#F3F4F6",
                color: "#111827",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: { xs: 0.8, sm: 1, md: 2, lg: 3 }, pb: { xs: 10, sm: 8 } }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                Product Image
              </Typography>
              <Box
                sx={{
                  border: "1px dashed #D1D5DB",
                  borderRadius: "12px",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#F9FAFB",
                  position: "relative",
                  cursor: "pointer",
                  height: "160px",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#0387D9",
                    backgroundColor: "#F0F9FF",
                  },
                }}
              >
                {editItem.productImage || imagePreview ? (
                  <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                    <img
                      src={imagePreview || editItem.productImage}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover": { backgroundColor: "#fff" },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditItem({ ...editItem, productImage: null });
                        setImagePreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = null;
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={1}
                  >
                    <CloudUploadIcon sx={{ fontSize: 40, color: "#9CA3AF" }} />
                    <Typography variant="body2" color="#6B7280">
                      Drag and drop or click to upload
                    </Typography>
                    <Typography variant="caption" color="#9CA3AF">
                      Supports JPG, PNG or GIF up to 5MB
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
                  ref={fileInputRef}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                Product Name
              </Typography>
              <TextField
                value={editItem.productName}
                onChange={(e) =>
                  setEditItem({ ...editItem, productName: e.target.value })
                }
                fullWidth
                variant="outlined"
                placeholder="Enter product name"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#F9FAFB",
                    "& fieldset": {
                      borderColor: "#E5E7EB",
                    },
                    "&:hover fieldset": {
                      borderColor: "#D1D5DB",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0387D9",
                    },
                  },
                }}
                disabled
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                Category
              </Typography>
              <Autocomplete
                multiple
                options={categoryOptions}
                getOptionLabel={(option) => option.label}
                filterOptions={(options, state) =>
                  options.filter(opt =>
                    !editItem.category.includes(opt.value) &&
                    (!state.inputValue ||
                      opt.label.toLowerCase().includes(state.inputValue.toLowerCase()))
                  )
                }
                open={categoryDropdownOpen}
                onOpen={() => setCategoryDropdownOpen(true)}
                onClose={() => setCategoryDropdownOpen(false)}
                openOnFocus
                value={categoryOptions.filter(opt => editItem.category.includes(opt.value))}
                onChange={(event, newValue) => {
                  setEditItem({
                    ...editItem,
                    category: newValue.map(opt => opt.value),
                  });
                }}
                disablePortal
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={
                      categoryOptions.length === 0
                        ? "No categories available"
                        : "Select categories..."
                    }
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        backgroundColor: "#F9FAFB",
                        "& fieldset": {
                          borderColor: "#E5E7EB",
                        },
                        "&:hover fieldset": {
                          borderColor: "#D1D5DB",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#0387D9",
                        },
                      },
                    }}
                  />
                )}
                renderOption={(props, option, { index }) => (
                  <Box
                    component="li"
                    {...props}
                    key={option.value || index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      py: 1.5,
                      borderBottom: index < categoryOptions.length - 1 ? "1px solid #F3F4F6" : "none"
                    }}
                  >
                    {/* <img
                      src={option.icon}
                      alt={option.label}
                      style={{ width: 24, height: 24, objectFit: "contain" }}
                      loading="lazy"
                    /> */}
                    <span style={{ fontWeight: 500, color: "#111827" }}>{option.label}</span>
                  </Box>
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      // avatar={<img src={option.icon} alt={option.label} style={{ width: 20, height: 20 }} />}
                      {...getTagProps({ index })}
                      sx={{
                        bgcolor: '#f1f5f9',
                        color: '#334155',
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        height: 24,
                        borderRadius: '6px',
                        mr: 0.5,
                      }}
                    />
                  ))
                }
                isOptionEqualToValue={(option, value) => option.value === value.value}
                noOptionsText={categoryOptions.length === 0 ? "No categories found" : "No match"}
                disabled={categoryOptions.length === 0}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                Description
              </Typography>
              <TextField
                value={editItem.description || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, description: e.target.value })
                }
                fullWidth
                variant="outlined"
                placeholder="Enter product description"
                multiline
                rows={4}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#F9FAFB",
                    "& fieldset": {
                      borderColor: "#E5E7EB",
                    },
                    "&:hover fieldset": {
                      borderColor: "#D1D5DB",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0387D9",
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                  Price (per unit)
                </Typography>
                <TextField
                  type="number"
                  value={editItem.price}
                  onChange={(e) =>
                    setEditItem({ ...editItem, price: e.target.value })
                  }
                  fullWidth
                  variant="outlined"
                  placeholder="0.00"
                  InputProps={{
                    startAdornment: (
                      <Typography variant="body2" color="#6B7280" sx={{ mr: 1 }}>
                        $
                      </Typography>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#F9FAFB",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0387D9",
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                  Stock Quantity
                </Typography>
                <TextField
                  type="number"
                  value={editItem.stockQuantity}
                  onChange={(e) =>
                    setEditItem({ ...editItem, stockQuantity: e.target.value })
                  }
                  fullWidth
                  variant="outlined"
                  placeholder="0"
                  InputProps={{
                    endAdornment: (
                      <Typography variant="body2" color="#6B7280" sx={{ ml: 1 }}>
                        units
                      </Typography>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#F9FAFB",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0387D9",
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                  HS Code
                </Typography>
                <TextField
                  type="text"
                  value={editItem.hsCode}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow empty string for clearing
                    if (val === "") {
                      setEditItem({ ...editItem, hsCode: "" });
                    } else {
                      setEditItem({ ...editItem, hsCode: val });
                    }
                  }}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter the HS Code"
                  InputProps={{

                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#F9FAFB",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0387D9",
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                  Country Of Origin
                </Typography>
                <TextField
                  type="text"
                  value={editItem.countryOfOrigin || ""}
                  onChange={(e) => setEditItem({ ...editItem, countryOfOrigin: e.target.value })}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter the country"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#F9FAFB",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0387D9",
                      },
                    },
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                  Height (inches)
                </Typography>
                <TextField
                  type="number"
                  value={editItem.height}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow empty string for clearing
                    if (val === "") {
                      setEditItem({ ...editItem, height: "" });
                    } else {
                      setEditItem({ ...editItem, height: val });
                    }
                  }}
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    if (val < 1 || isNaN(val)) {
                      setEditItem({ ...editItem, height: 1 });
                    }
                  }}
                  fullWidth
                  variant="outlined"
                  placeholder="0.00"
                  InputProps={{
                    endAdornment: (
                      <Typography variant="body2" color="#6B7280" sx={{ ml: 1 }}>
                        in
                      </Typography>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#F9FAFB",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0387D9",
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                  Width (inches)
                </Typography>
                <TextField
                  type="number"
                  value={editItem.width || ""}
                  onChange={(e) => setEditItem({ ...editItem, width: e.target.value })}
                  fullWidth
                  variant="outlined"
                  placeholder="0"
                  InputProps={{
                    endAdornment: (
                      <Typography variant="body2" color="#6B7280" sx={{ ml: 1 }}>
                        in
                      </Typography>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#F9FAFB",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0387D9",
                      },
                    },
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                  Weight (ounces)
                </Typography>
                <TextField
                  type="number"
                  value={editItem.weight}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow empty string for clearing
                    if (val === "") {
                      setEditItem({ ...editItem, weight: "" });
                    } else {
                      setEditItem({ ...editItem, weight: val });
                    }
                  }}
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    if (val < 1 || isNaN(val)) {
                      setEditItem({ ...editItem, weight: 1 });
                    }
                  }}
                  fullWidth
                  variant="outlined"
                  placeholder="0.00"
                  InputProps={{
                    endAdornment: (
                      <Typography variant="body2" color="#6B7280" sx={{ ml: 1 }}>
                        oz
                      </Typography>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#F9FAFB",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0387D9",
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                  Length (inches)
                </Typography>
                <TextField
                  type="number"
                  value={editItem.length_ || ""}
                  onChange={(e) => setEditItem({ ...editItem, length_: e.target.value })}
                  fullWidth
                  variant="outlined"
                  placeholder="0"
                  InputProps={{
                    endAdornment: (
                      <Typography variant="body2" color="#6B7280" sx={{ ml: 1 }}>
                        in
                      </Typography>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#F9FAFB",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0387D9",
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Stack>
        </Box>

        {/* Sticky action buttons */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            width: "100%",
            backgroundColor: "#fff",
            borderTop: "1px solid #f0f0f0",
            p: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "flex-end",
            gap: 2,
            mt: 2,
            zIndex: 5,
          }}
        >
          <Button
            onClick={() => setShowEditModal(false)}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              borderColor: "#D1D5DB",
              color: "#374151",
              fontWeight: 600,
              py: 1.5,
              px: 4,
              "&:hover": {
                borderColor: "#9CA3AF",
                backgroundColor: "#F9FAFB",
              },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isLoading}
            variant="contained"
            sx={{
              borderRadius: "8px",
              backgroundColor: "#0387D9",
              color: "#fff",
              fontWeight: 600,
              py: 1.5,
              px: 4,
              "&:hover": {
                backgroundColor: "#0369A1",
              },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {isLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span className="pi pi-spin pi-spinner" style={{ fontSize: "1rem" }}></span>
                <span>Updating...</span>
              </Box>
            ) : (
              "Save Changes"
            )}
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
            border: "none",
            maxWidth: { xs: "100%", sm: "600px" },
            width: "100%",
            borderRadius: { xs: 0, sm: "16px" },
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            m: { xs: 0, sm: 2 },
            p: { xs: 0, sm: 0 },
            height: { xs: "100vh", sm: "auto" },
            maxHeight: { xs: "100vh", sm: "90vh" },
            overflowY: "auto",
            position: "relative",
          },
        }}
      >
        <Box sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#fff",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          borderTopLeftRadius: { xs: 0, sm: "16px" },
          borderTopRightRadius: { xs: 0, sm: "16px" },
        }}>
          <Typography variant="h6" fontWeight="600" color="#111827">
            Add New Product
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseAddModal}
            sx={{
              color: "#6B7280",
              "&:hover": {
                backgroundColor: "#F3F4F6",
                color: "#111827",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: { xs: 0.8, sm: 1, md: 2, lg: 3 }, pb: { xs: 10, sm: 8 } }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                Product Image
              </Typography>
              <Box
                sx={{
                  border: "1px dashed #D1D5DB",
                  borderRadius: "12px",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#F9FAFB",
                  position: "relative",
                  cursor: "pointer",
                  height: "160px",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#0387D9",
                    backgroundColor: "#F0F9FF",
                  },
                }}
              >
                {imagePreview ? (
                  <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover": { backgroundColor: "#fff" },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setProductImage(null);
                        setImagePreview(null);
                        setNewItem({ ...newItem, fileName: "" });
                        if (fileInputRef.current) fileInputRef.current.value = null;
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={1}
                  >
                    <CloudUploadIcon sx={{ fontSize: 40, color: "#9CA3AF" }} />
                    <Typography variant="body2" color="#6B7280">
                      Drag and drop or click to upload
                    </Typography>
                    <Typography variant="caption" color="#9CA3AF">
                      Supports JPG, PNG or GIF up to 5MB
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
                  ref={fileInputRef}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                Product Name
              </Typography>
              <TextField
                value={newItem.productName}
                onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                fullWidth
                variant="outlined"
                placeholder="Enter product name"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#F9FAFB",
                    "& fieldset": {
                      borderColor: "#E5E7EB",
                    },
                    "&:hover fieldset": {
                      borderColor: "#D1D5DB",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0387D9",
                    },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                Description
              </Typography>
              <TextField
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                fullWidth
                variant="outlined"
                placeholder="Enter product description"
                multiline
                rows={4}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#F9FAFB",
                    "& fieldset": {
                      borderColor: "#E5E7EB",
                    },
                    "&:hover fieldset": {
                      borderColor: "#D1D5DB",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0387D9",
                    },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                Category
              </Typography>
              <FormControl fullWidth>
                <Autocomplete
                  multiple
                  options={categoryOptions}
                  getOptionLabel={(option) => option.label}
                  filterOptions={(options, state) =>
                    options.filter(opt =>
                      !newItem.category.includes(opt.value) &&
                      (!state.inputValue ||
                        opt.label.toLowerCase().includes(state.inputValue.toLowerCase()))
                    )
                  }
                  open={categoryDropdownOpen}
                  onOpen={() => setCategoryDropdownOpen(true)}
                  onClose={() => setCategoryDropdownOpen(false)}
                  openOnFocus
                  value={categoryOptions.filter(opt => newItem.category.includes(opt.value))}
                  onChange={(event, newValue) => {
                    setNewItem({
                      ...newItem,
                      category: newValue.map(opt => opt.value),
                    });
                  }}
                  disablePortal
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={
                        categoryOptions.length === 0
                          ? "No categories available"
                          : "Select categories..."
                      }
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          backgroundColor: "#F9FAFB",
                          "& fieldset": {
                            borderColor: "#E5E7EB",
                          },
                          "&:hover fieldset": {
                            borderColor: "#D1D5DB",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#0387D9",
                          },
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option, { index }) => (
                    <Box
                      component="li"
                      {...props}
                      key={option.value || index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        py: 1.5,
                        borderBottom: index < categoryOptions.length - 1 ? "1px solid #F3F4F6" : "none"
                      }}
                    >
                      {/* <img
                      src={option.icon}
                      alt={option.label}
                      style={{ width: 24, height: 24, objectFit: "contain" }}
                      loading="lazy"
                    /> */}
                      <span style={{ fontWeight: 500, color: "#111827" }}>{option.label}</span>
                    </Box>
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={option.value}
                        label={option.label}
                        // avatar={<img src={option.icon} alt={option.label} style={{ width: 20, height: 20 }} />}
                        {...getTagProps({ index })}
                        sx={{
                          bgcolor: '#f1f5f9',
                          color: '#334155',
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          height: 24,
                          borderRadius: '6px',
                          mr: 0.5,
                        }}
                      />
                    ))
                  }
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  noOptionsText={categoryOptions.length === 0 ? "No categories found" : "No match"}
                  disabled={categoryOptions.length === 0}
                />
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                  Price (per unit)
                </Typography>
                <TextField
                  type="number"
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
                  variant="outlined"
                  placeholder="0.00"
                  InputProps={{
                    startAdornment: (
                      <Typography variant="body2" color="#6B7280" sx={{ mr: 1 }}>
                        $
                      </Typography>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#F9FAFB",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0387D9",
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                  Stock Quantity
                </Typography>
                <TextField
                  type="number"
                  value={newItem.stockQuantity || ""}
                  onChange={(e) => setNewItem({ ...newItem, stockQuantity: e.target.value })}
                  fullWidth
                  variant="outlined"
                  placeholder="0"
                  InputProps={{
                    endAdornment: (
                      <Typography variant="body2" color="#6B7280" sx={{ ml: 1 }}>
                        units
                      </Typography>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#F9FAFB",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0387D9",
                      },
                    },
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                  HS Code
                </Typography>
                <TextField
                  type="text"
                  value={newItem.hsCode}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow empty string for clearing
                    if (val === "") {
                      setNewItem({ ...newItem, hsCode: "" });
                    } else {
                      setNewItem({ ...newItem, hsCode: val });
                    }
                  }}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter the HS Code"
                  InputProps={{

                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#F9FAFB",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0387D9",
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                  Country Of Origin
                </Typography>
                <TextField
                  type="text"
                  value={newItem.countryOfOrigin || ""}
                  onChange={(e) => setNewItem({ ...newItem, countryOfOrigin: e.target.value })}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter the country"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#F9FAFB",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0387D9",
                      },
                    },
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                  Height (inches)
                </Typography>
                <TextField
                  type="number"
                  value={newItem.height}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow empty string for clearing
                    if (val === "") {
                      setNewItem({ ...newItem, height: "" });
                    } else {
                      setNewItem({ ...newItem, height: val });
                    }
                  }}
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    if (val < 1 || isNaN(val)) {
                      setNewItem({ ...newItem, height: 1 });
                    }
                  }}
                  fullWidth
                  variant="outlined"
                  placeholder="0.00"
                  InputProps={{
                    endAdornment: (
                      <Typography variant="body2" color="#6B7280" sx={{ ml: 1 }}>
                        in
                      </Typography>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#F9FAFB",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0387D9",
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                  Width (inches)
                </Typography>
                <TextField
                  type="number"
                  value={newItem.width || ""}
                  onChange={(e) => setNewItem({ ...newItem, width: e.target.value })}
                  fullWidth
                  variant="outlined"
                  placeholder="0"
                  InputProps={{
                    endAdornment: (
                      <Typography variant="body2" color="#6B7280" sx={{ ml: 1 }}>
                        in
                      </Typography>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#F9FAFB",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0387D9",
                      },
                    },
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                  Weight (ounces)
                </Typography>
                <TextField
                  type="number"
                  value={newItem.weight}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow empty string for clearing
                    if (val === "") {
                      setNewItem({ ...newItem, weight: "" });
                    } else {
                      setNewItem({ ...newItem, weight: val });
                    }
                  }}
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    if (val < 1 || isNaN(val)) {
                      setNewItem({ ...newItem, weight: 1 });
                    }
                  }}
                  fullWidth
                  variant="outlined"
                  placeholder="0.00"
                  InputProps={{
                    endAdornment: (
                      <Typography variant="body2" color="#6B7280" sx={{ ml: 1 }}>
                        oz
                      </Typography>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#F9FAFB",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0387D9",
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                  Length (inches)
                </Typography>
                <TextField
                  type="number"
                  value={newItem.length_ || ""}
                  onChange={(e) => setNewItem({ ...newItem, length_: e.target.value })}
                  fullWidth
                  variant="outlined"
                  placeholder="0"
                  InputProps={{
                    endAdornment: (
                      <Typography variant="body2" color="#6B7280" sx={{ ml: 1 }}>
                        in
                      </Typography>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#F9FAFB",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0387D9",
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {user?.role?.name === 'admin' && (
              <Box>
                <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                  Supplier
                </Typography>
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
                      placeholder={
                        suppliersLoading
                          ? "Loading suppliers..."
                          : "Type supplier name, company, or email..."
                      }
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          backgroundColor: "#F9FAFB",
                          "& fieldset": {
                            borderColor: "#E5E7EB",
                          },
                          "&:hover fieldset": {
                            borderColor: "#D1D5DB",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#0387D9",
                          },
                        },
                      }}
                      helperText={
                        suppliersLoading
                          ? "Loading suppliers..."
                          : "Search by business name, company name, or email"
                      }
                      FormHelperTextProps={{
                        sx: { color: "#9CA3AF", mt: 0.5, ml: 1 }
                      }}
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
                      sx={{
                        py: 1.5,
                        borderBottom: index < filteredSuppliers.length - 1 ? "1px solid #F3F4F6" : "none"
                      }}
                    >
                      <Box>
                        <Box sx={{ fontWeight: "600", color: "#111827" }}>
                          {option.businessName || option.companyName || option.name}
                        </Box>
                        <Box sx={{ fontSize: "0.875rem", color: "#6B7280" }}>
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
              </Box>
            )}

          </Stack>
        </Box>

        {saveError && (
          <Box sx={{
            backgroundColor: "#FEF2F2",
            color: "#B91C1C",
            p: 2,
            mx: 3,
            mb: 2,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: 1
          }}>
            <ErrorOutlineIcon fontSize="small" />
            <Typography variant="body2">{saveError}</Typography>
          </Box>
        )}

        {saveSuccess && (
          <Box sx={{
            backgroundColor: "#ECFDF5",
            color: "#065F46",
            p: 2,
            mx: 3,
            mb: 2,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: 1
          }}>
            <CheckCircleIcon fontSize="small" />
            <Typography variant="body2">{saveSuccess}</Typography>
          </Box>
        )}

        {/* Sticky action buttons */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            width: "100%",
            backgroundColor: "#fff",
            borderTop: "1px solid #f0f0f0",
            p: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "flex-end",
            gap: 2,
            zIndex: 5,
          }}
        >
          <Button
            onClick={handleCloseAddModal}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              borderColor: "#D1D5DB",
              color: "#374151",
              fontWeight: 600,
              py: 1.5,
              px: 4,
              "&:hover": {
                borderColor: "#9CA3AF",
                backgroundColor: "#F9FAFB",
              },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveProduct}
            disabled={isLoading}
            variant="contained"
            sx={{
              borderRadius: "8px",
              backgroundColor: "#0387D9",
              color: "#fff",
              fontWeight: 600,
              py: 1.5,
              px: 4,
              "&:hover": {
                backgroundColor: "#0369A1",
              },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {isLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span className="pi pi-spin pi-spinner" style={{ fontSize: "1rem" }}></span>
                <span>Saving...</span>
              </Box>
            ) : (
              "Save Product"
            )}
          </Button>
        </Box>
      </Dialog>

      <Dialog
        open={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        maxWidth="xs"
        fullWidth
        sx={{
          zIndex: 9999,
          "& .MuiDialog-paper": {
            zIndex: 9999,
            backgroundColor: "#ffffff",
            border: "none",
            maxWidth: { xs: "100%", sm: "400px" },
            width: "100%",
            borderRadius: { xs: 0, sm: "16px" },
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            m: { xs: 0, sm: 2 },
            p: { xs: 0, sm: 0 },
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{
          position: "relative",
          backgroundColor: "#FEF2F2",
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: "#FEE2E2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2
            }}
          >
            <DeleteIcon sx={{ fontSize: 32, color: "#DC2626" }} />
          </Box>
          <Typography variant="h6" fontWeight="600" color="#111827" align="center">
            Delete Product
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setShowDeleteConfirmation(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#6B7280",
              "&:hover": {
                backgroundColor: "rgba(107, 114, 128, 0.08)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          <Typography variant="body1" align="center" color="#4B5563" sx={{ mb: 3 }}>
            Are you sure you want to delete this product? This action cannot be undone.
          </Typography>

          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: "center"
          }}>
            <Button
              onClick={() => setShowDeleteConfirmation(false)}
              variant="outlined"
              fullWidth
              sx={{
                borderRadius: "8px",
                borderColor: "#D1D5DB",
                color: "#374151",
                fontWeight: 600,
                py: 1.5,
                "&:hover": {
                  borderColor: "#9CA3AF",
                  backgroundColor: "#F9FAFB",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "8px",
                backgroundColor: "#DC2626",
                color: "#fff",
                fontWeight: 600,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#B91C1C",
                },
              }}
            >
              {isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span className="pi pi-spin pi-spinner" style={{ fontSize: "1rem" }}></span>
                  <span>Deleting...</span>
                </Box>
              ) : (
                "Delete Product"
              )}
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Dialog
        open={showViewModal && viewItem.id}
        onClose={handleCloseViewModal}
        maxWidth="sm"
        fullWidth
        sx={{
          zIndex: 9999,
          "& .MuiDialog-paper": {
            zIndex: 9999,
            backgroundColor: "#ffffff",
            border: "none",
            maxWidth: { xs: "100%", sm: "600px" },
            width: "100%",
            borderRadius: { xs: 0, sm: "16px" },
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            m: { xs: 0, sm: 2 },
            p: { xs: 0, sm: 0 },
            height: { xs: "100vh", sm: "auto" },
            maxHeight: { xs: "100vh", sm: "90vh" },
            overflowY: "auto",
            position: "relative",
          },
        }}
      >
        <Box sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#fff",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          borderTopLeftRadius: { xs: 0, sm: "16px" },
          borderTopRightRadius: { xs: 0, sm: "16px" },
        }}>
          <Typography variant="h6" fontWeight="600" color="#111827">
            Product Details
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseViewModal}
            sx={{
              color: "#6B7280",
              "&:hover": {
                backgroundColor: "#F3F4F6",
                color: "#111827",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: { xs: 0.8, sm: 1, md: 2, lg: 3 } }}>
          <Stack spacing={3}>
            <Box sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              alignItems: { xs: "flex-start", sm: "center" }
            }}>
              {viewItem.productImage ? (
                <Box
                  sx={{
                    width: { xs: "100%", sm: "120px" },
                    height: { xs: "200px", sm: "120px" },
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #E5E7EB",
                    backgroundColor: "#F9FAFB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <img
                    src={viewItem.productImage}
                    alt={viewItem.productName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    width: { xs: "100%", sm: "120px" },
                    height: { xs: "200px", sm: "120px" },
                    borderRadius: "12px",
                    backgroundColor: "#F3F4F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9CA3AF",
                  }}
                >
                  <Box sx={{ textAlign: "center", p: 1 }}>
                    <ImageIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="caption" display="block">
                      No image available
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight="600" color="#111827" gutterBottom>
                  {viewItem.productName}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
                  {viewItem.category && viewItem.category.length > 0 && viewItem.category.map((cat) => (
                    <Chip
                      key={cat}
                      label={cat}
                      size="small"
                      sx={{
                        backgroundColor: "#F3F4F6",
                        color: "#374151",
                        fontWeight: 500,
                        borderRadius: "6px"
                      }}
                    />
                  ))}
                  <Chip
                    label={`ID: ${viewItem.productId?.slice?.(-6) || viewItem.productId || "—"}`}
                    size="small"
                    sx={{
                      backgroundColor: "#F3F4F6",
                      color: "#374151",
                      fontWeight: 500,
                      borderRadius: "6px"
                    }}
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="#6B7280" gutterBottom>
                    Price
                  </Typography>
                  <Typography variant="body1" fontWeight="600" color="#111827">
                    {viewItem.price ? formatCurrency(Number(viewItem.price)) + " per unit" : "—"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="#6B7280" gutterBottom>
                    Stock Quantity
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        backgroundColor:
                          getStockStatus(viewItem.stockQuantity) === "high"
                            ? "#ECFDF3"
                            : getStockStatus(viewItem.stockQuantity) === "medium"
                              ? "#FFFAEB"
                              : "#FEF3F2",
                        color:
                          getStockStatus(viewItem.stockQuantity) === "high"
                            ? "#059669"
                            : getStockStatus(viewItem.stockQuantity) === "medium"
                              ? "#D97706"
                              : "#DC2626",
                        py: 0.5,
                        px: 1.5,
                        borderRadius: "6px",
                        display: "inline-block",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      {viewItem.stockQuantity || 0} units
                    </Box>
                    <Typography variant="body2" color="#6B7280">
                      {getStockStatus(viewItem.stockQuantity) === "high"
                        ? "High stock"
                        : getStockStatus(viewItem.stockQuantity) === "medium"
                          ? "Medium stock"
                          : "Low stock"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="#6B7280" gutterBottom>
                    Supplier
                  </Typography>
                  <Typography variant="body1" fontWeight="600" color="#111827">
                    {typeof viewItem.supplier === "object"
                      ? viewItem.supplier.businessName ||
                      viewItem.supplier.user?.email ||
                      "Not available"
                      : typeof viewItem.supplier === "string" &&
                        viewItem.supplier.trim() !== ""
                        ? viewItem.supplier
                        : "Not available"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="#6B7280" gutterBottom>
                  HS Code
                </Typography>
                <Typography variant="body1" fontWeight="600" color="#111827">
                  {viewItem.hsCode || "—"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="#6B7280" gutterBottom>
                  Country of Origin
                </Typography>
                <Typography variant="body1" fontWeight="600" color="#111827">
                  {viewItem.countryOfOrigin || "—"}
                </Typography>
              </Grid>
            </Grid>

            <Box>
              <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                Description
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "10px",
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  minHeight: "100px",
                }}
              >
                <Typography variant="body2" color="#4B5563" whiteSpace="pre-wrap">
                  {viewItem.description || "No description available"}
                </Typography>
              </Paper>
            </Box>

            {/* Physical Attributes Section */}
            <Box>
              <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                Physical Attributes
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="#6B7280" gutterBottom>
                    Weight
                  </Typography>
                  <Typography variant="body1" fontWeight="600" color="#111827">
                    {viewItem.weight ? `${viewItem.weight} oz` : "—"}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="#6B7280" gutterBottom>
                    Height
                  </Typography>
                  <Typography variant="body1" fontWeight="600" color="#111827">
                    {viewItem.height ? `${viewItem.height} in` : "—"}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="#6B7280" gutterBottom>
                    Width
                  </Typography>
                  <Typography variant="body1" fontWeight="600" color="#111827">
                    {viewItem.width ? `${viewItem.width} in` : "—"}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="#6B7280" gutterBottom>
                    Length
                  </Typography>
                  <Typography variant="body1" fontWeight="600" color="#111827">
                    {viewItem.length_ ? `${viewItem.length_} in` : "—"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

          </Stack>
        </Box>

        {/* Action buttons */}
        <Box
          sx={{
            borderTop: "1px solid #f0f0f0",
            p: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "flex-end",
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            onClick={handleCloseViewModal}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              borderColor: "#D1D5DB",
              color: "#374151",
              fontWeight: 600,
              py: 1.5,
              px: 4,
              "&:hover": {
                borderColor: "#9CA3AF",
                backgroundColor: "#F9FAFB",
              },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              handleCloseViewModal();
              handleEditModal(viewItem);
            }}
            variant="contained"
            sx={{
              borderRadius: "8px",
              backgroundColor: "#0387D9",
              color: "#fff",
              fontWeight: 600,
              py: 1.5,
              px: 4,
              "&:hover": {
                backgroundColor: "#0369A1",
              },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Edit Product
          </Button>
        </Box>
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
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 1000000 }}
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

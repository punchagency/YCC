import React, { useCallback } from 'react';
import { useUser } from "../../../context/userContext";
import { useTheme } from "../../../context/theme/themeContext";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Avatar,
    Chip,
    Alert,
    Snackbar,
    Paper,
    Stack,
    useMediaQuery,
    useTheme as useMuiTheme,
    alpha,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    InputAdornment,
    CircularProgress,
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Skeleton,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    Autocomplete,
} from "@mui/material";
import {
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    RoomService as ServiceIcon,
    AttachMoney as MoneyIcon,
    Description as DescriptionIcon,
    Close as CloseIcon,
    Category as CategoryIcon,
    CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { format } from 'date-fns';
import { createService, deleteService, getAllServices, updateService } from '../../../services/service/newServiceEndpoints';


const ServiceProviderServiceManagement = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const userServiceCategories = user?.vendorProfile.services
    const { theme } = useTheme();
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
    const [services, setServices] = React.useState({ services: [], pagination: {} });
    const [isLoading, setIsLoading] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalMode, setModalMode] = React.useState('create');
    const [selectedService, setSelectedService] = React.useState({});
    const [formData, setFormData] = React.useState({ name: '', price: '', description: '', category: '', image: null });
    const [imagePreview, setImagePreview] = React.useState(null);
    const fileInputRef = React.useRef(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [actionServiceId, setActionServiceId] = React.useState(null);
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
    const [fetchParams, setFetchParams] = React.useState({
        page: 1,
        limit: 10,
        search: '',
    });

    const fetchServices = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getAllServices({ ...fetchParams });
            if (response.status) {
                setServices(response.data);
            } else {
                setSnackbar({ open: true, message: response.error || 'Failed to fetch services', severity: 'error' });
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            setSnackbar({ open: true, message: 'An error occurred while fetching services', severity: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [fetchParams]);

    React.useEffect(() => {
        fetchServices();
    }, [fetchParams, fetchServices]);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchQuery(value);
        setFetchParams(prev => ({ ...prev, search: value, page: 1 }));
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setFetchParams(prev => ({ ...prev, page: newPage + 1 }));
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        setFetchParams(prev => ({ ...prev, limit: newRowsPerPage, page: 1 }));
    };

    const handleMenuOpen = (event, serviceId) => {
        setAnchorEl(event.currentTarget);
        setActionServiceId(serviceId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setActionServiceId(null);
    };

    const handleCreateService = () => {
        setModalMode('create');
        setFormData({ name: '', price: '', description: '', category: '', image: null });
        setSelectedService({});
        setImagePreview(null);
        setModalOpen(true);
    };

    const handleEditService = (service) => {
        setModalMode('update');
        setFormData({ name: service.name, price: service.price.toString(), description: service.description, category: service.category, image: service.image || null });
        setSelectedService(service);
        setImagePreview(service.image || null);
        setModalOpen(true);
        handleMenuClose();
    };

    const handleDeleteService = async (serviceId) => {
        // confirm the user want to delete the service before deleting
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        setIsLoading(true);
        try {
            const response = await deleteService(serviceId);
            if (response.success) {
                setSnackbar({ open: true, message: 'Service deleted successfully', severity: 'success' });
                fetchServices();
            } else {
                setSnackbar({ open: true, message: response.error || 'Failed to delete service', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'An error occurred while deleting service', severity: 'error' });
        } finally {
            setIsLoading(false);
            handleMenuClose();
        }
    };

    const handleFormSubmit = async () => {
        if (!formData.name || !formData.price) {
            setSnackbar({ open: true, message: 'Please fill in all required fields', severity: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            const serviceData = {
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description || null,
                category: formData.category || null,
                serviceImage: formData.image
            };
            console.log({ formData });
            const response = modalMode === 'create'
                ? await createService(serviceData)
                : await updateService(selectedService._id, serviceData);

            if (response.success) {
                setSnackbar({
                    open: true,
                    message: `Service ${modalMode === 'create' ? 'created' : 'updated'} successfully`,
                    severity: 'success'
                });
                setModalOpen(false);
                fetchServices();
            } else {
                setSnackbar({ open: true, message: response.error || `Failed to ${modalMode} service`, severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: `An error occurred while ${modalMode === 'create' ? 'creating' : 'updating'} service`, severity: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormChange = (field) => (event) => {
        if (field === 'category') {
            setFormData(prev => ({ ...prev, [field]: event }));
        } else if (field === 'image') {
            const file = event.target.files[0];
            if (file) {
                setFormData(prev => ({ ...prev, [field]: file }));
                setImagePreview(URL.createObjectURL(file));
            }
        } else {
            setFormData(prev => ({ ...prev, [field]: event.target.value }));
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            return "Invalid Date";
        }
    };
    const handleImportFromCSV = useCallback(() => {
        navigate(`/service-provider/services/onboarding/${user._id}`);
    }, [navigate, user._id]);
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        const handleOpenCreateOrderModal = () => handleCreateService();
        window.addEventListener("openCreateServiceModal", handleOpenCreateOrderModal);
        window.addEventListener(
            "openImportInventoryCSVModal",
            handleImportFromCSV
        );
        return () => {
            window.removeEventListener(
                "openCreateServiceModal",
                handleOpenCreateOrderModal
            );
            window.removeEventListener(
                "openImportInventoryCSVModal",
                handleImportFromCSV
            );
        };
    }, [handleImportFromCSV]);

    const ServiceSkeleton = () => (
        <Card sx={{ mb: 2, borderRadius: 2 }}>
            <CardContent sx={{ p: 2 }}>
                <Stack spacing={2}>
                    {/* Image and basic info row */}
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Skeleton variant="circular" width={50} height={50} />
                        <Stack spacing={0.5} sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="70%" height={24} />
                            <Skeleton variant="text" width="40%" height={18} />
                        </Stack>
                        <Skeleton variant="circular" width={24} height={24} />
                    </Stack>

                    {/* Category */}
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Skeleton variant="circular" width={16} height={16} />
                        <Skeleton variant="text" width="50%" height={20} />
                    </Stack>

                    {/* Price */}
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Skeleton variant="circular" width={16} height={16} />
                        <Skeleton variant="text" width="30%" height={24} />
                    </Stack>

                    {/* Description */}
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                        <Skeleton variant="circular" width={16} height={16} sx={{ mt: 0.5 }} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="100%" height={16} />
                            <Skeleton variant="text" width="85%" height={16} />
                        </Box>
                    </Stack>

                    {/* Created date */}
                    <Skeleton variant="text" width="45%" height={16} />
                </Stack>
            </CardContent>
        </Card>
    );

    const DesktopServiceSkeleton = () => (
        <TableRow>
            {/* Service Image */}
            <TableCell>
                <Skeleton variant="circular" width={50} height={50} />
            </TableCell>

            {/* Service Name */}
            <TableCell>
                <Skeleton variant="text" width="80%" height={20} />
            </TableCell>

            {/* Category */}
            <TableCell>
                <Skeleton variant="text" width="70%" height={20} />
            </TableCell>

            {/* Price */}
            <TableCell>
                <Skeleton variant="text" width="60%" height={20} />
            </TableCell>

            {/* Description */}
            <TableCell>
                <Skeleton variant="text" width="90%" height={18} />
            </TableCell>

            {/* Created Date */}
            <TableCell>
                <Skeleton variant="text" width="75%" height={18} />
            </TableCell>

            {/* Actions */}
            <TableCell align="center">
                <Skeleton variant="circular" width={24} height={24} />
            </TableCell>
        </TableRow>
    );

    const MobileServiceCard = ({ service }) => (
        <Card sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ height: '4px', bgcolor: muiTheme.palette.primary.main, width: '100%' }} />
            {service.image && (
                <Box sx={{ height: 150, overflow: 'hidden', position: 'relative' }}>
                    <img
                        src={service.image}
                        alt={service.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </Box>
            )}
            <CardContent sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                        {service.name}
                    </Typography>
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, service._id)}>
                        <MoreVertIcon />
                    </IconButton>
                </Stack>

                <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <CategoryIcon fontSize="small" color="action" />
                        <Typography variant="body1" fontWeight={500}>
                            {service.category}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <MoneyIcon fontSize="small" color="action" />
                        <Typography variant="h6" fontWeight={500} color="primary">
                            ${service.price.toFixed(2)}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="flex-start">
                        <DescriptionIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                            {service.description}
                        </Typography>
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                        Created: {formatDate(service.createdAt)}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );

    const { setPageTitle } = useOutletContext() || {};
    React.useEffect(() => {
        if (setPageTitle) setPageTitle("Service Management");
    }, [setPageTitle]);

    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <Box sx={{ p: { xs: 0.8, sm: 1, md: 2, lg: 3 }, paddingTop: "50px !important" }}>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    mb: 4,
                    p: 3,
                    borderRadius: 3,
                    background: theme === "light"
                        ? 'linear-gradient(135deg, #003366 0%, #0066cc 100%)'
                        : 'linear-gradient(135deg, #001a33 0%, #003366 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ position: 'absolute', top: -20, right: -20, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
                <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', zIndex: 0 }} />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                Service Management
                            </Typography>
                            <Typography sx={{ opacity: 0.9, color: '#fafafa' }}>
                                Manage your services and pricing
                            </Typography>
                        </Box>
                        <Chip
                            icon={<ServiceIcon />}
                            label={`${services.pagination?.totalServices || 0} Services`}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.15)',
                                color: 'white',
                                fontWeight: 500,
                                mt: { xs: 2, sm: 0 },
                                '& .MuiChip-icon': { color: 'white' }
                            }}
                        />
                    </Stack>
                </Box>
            </Paper>

            {/* Search and Create Button */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={8}>
                    <TextField
                        fullWidth
                        placeholder="Search services by name or description"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                        }}
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
                </Grid>

            </Grid>

            {/* Services Content */}
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {isLoading ? (
                    <>
                        {/* Desktop Table Skeleton */}
                        {!isMobile && (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell>Service Name</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Created Date</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {[...Array(5)].map((_, index) => (
                                            <DesktopServiceSkeleton key={index} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}

                        {/* Mobile Card Skeleton */}
                        {isMobile && (
                            <Box sx={{ p: 2 }}>
                                {[...Array(5)].map((_, index) => (
                                    <ServiceSkeleton key={index} />
                                ))}
                            </Box>
                        )}
                    </>
                ) : services.services?.length === 0 ? (
                    <Box sx={{
                        py: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        px: 3,
                        textAlign: 'center'
                    }}>
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                mb: 2,
                                bgcolor: alpha(muiTheme.palette.primary.main, 0.1),
                                color: muiTheme.palette.primary.main
                            }}
                        >
                            <ServiceIcon sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                            No Services Found
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
                            {searchQuery
                                ? "No services match your search criteria. Try adjusting your search terms."
                                : "You haven't created any services yet. Create your first service to get started."}
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleCreateService}
                            sx={{ borderRadius: 2, fontWeight: 600 }}
                        >
                            Create Your First Service
                        </Button>
                    </Box>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        {!isMobile && (
                            <>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell>Service Name</TableCell>
                                                <TableCell>Category</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell>Created Date</TableCell>
                                                <TableCell align="center">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {services.services?.map((service) => (
                                                <TableRow key={service._id} hover>
                                                    <TableCell>
                                                        {service.image ? (
                                                            <Avatar
                                                                variant="rounded"
                                                                src={service.image}
                                                                alt={service.name}
                                                                sx={{ width: 50, height: 50 }}
                                                            />
                                                        ) : (
                                                            <Avatar
                                                                variant="rounded"
                                                                sx={{
                                                                    width: 50,
                                                                    height: 50,
                                                                    bgcolor: alpha(muiTheme.palette.primary.main, 0.1),
                                                                    color: muiTheme.palette.primary.main
                                                                }}
                                                            >
                                                                <ServiceIcon />
                                                            </Avatar>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body1" fontWeight={500}>
                                                            {service.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body1" fontWeight={500}>
                                                            {service.category}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body1" fontWeight={500} color="primary">
                                                            ${service.price.toFixed(2)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }} noWrap>
                                                            {service.description}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {formatDate(service.createdAt)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <IconButton onClick={(e) => handleMenuOpen(e, service._id)}>
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={services.pagination?.totalServices || 0}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </>
                        )}

                        {/* Mobile Card View */}
                        {isMobile && (
                            <Box sx={{ p: 2 }}>
                                {services.services?.map(service => (
                                    <MobileServiceCard key={service._id} service={service} />
                                ))}
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Pagination
                                        count={services.pagination?.total || 1}
                                        page={services.pagination?.current || 1}
                                        onChange={(e, newPage) => setFetchParams(prev => ({ ...prev, page: newPage }))}
                                        color="primary"
                                    />
                                </Box>
                            </Box>
                        )}
                    </>
                )}
            </Paper>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => {
                    const service = services.services?.find(s => s._id === actionServiceId);
                    if (service) handleEditService(service);
                }}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    Edit Service
                </MenuItem>
                <MenuItem onClick={() => handleDeleteService(actionServiceId)} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Delete Service
                </MenuItem>
            </Menu>

            {/* Service Modal */}
            <Dialog
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                maxWidth="sm"
                fullWidth
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        borderRadius: isMobile ? 0 : 2,
                        m: isMobile ? 0 : 2
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight={600}>
                            {modalMode === 'create' ? 'Create New Service' : 'Update Service'}
                        </Typography>
                        <IconButton onClick={() => setModalOpen(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="600" color="#374151" mb={1}>
                                Service Image
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
                                {formData.image || imagePreview ? (
                                    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                                        <img
                                            src={imagePreview || formData.image}
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
                                                setFormData({ ...formData, image: null });
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
                                            setFormData({ ...formData, image: file });
                                            setImagePreview(URL.createObjectURL(file));
                                        }
                                    }}
                                    ref={fileInputRef}
                                />
                            </Box>
                        </Box>
                        <TextField
                            fullWidth
                            label="Service Name"
                            value={formData.name}
                            onChange={handleFormChange('name')}
                            variant="outlined"
                            placeholder="Enter service name"
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
                        <Autocomplete
                            fullWidth
                            options={userServiceCategories}
                            getOptionLabel={(option) => option}
                            renderInput={(params) => <TextField {...params} label="Service Category"
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
                            />}
                            value={formData.category}
                            onChange={(e, value) => handleFormChange('category')(value)}
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
                        <TextField
                            fullWidth
                            label="Price"
                            type="number"
                            value={formData.price}
                            onChange={handleFormChange('price')}
                            variant="outlined"
                            placeholder="0.00"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
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
                        <TextField
                            fullWidth
                            label="Description"
                            value={formData.description}
                            onChange={handleFormChange('description')}
                            variant="outlined"
                            multiline
                            rows={4}
                            placeholder="Describe your service"
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
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={() => setModalOpen(false)}
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
                        variant="contained"
                        onClick={handleFormSubmit}
                        disabled={isLoading}
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
                        {isLoading ? <CircularProgress size={20} /> : modalMode === 'create' ? 'Create Service' : 'Update Service'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ServiceProviderServiceManagement
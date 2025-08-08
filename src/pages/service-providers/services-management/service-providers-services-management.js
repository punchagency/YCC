import React from 'react';
import { useUser } from "../../../context/userContext";
import { useTheme } from "../../../context/theme/themeContext";
import { useOutletContext } from "react-router-dom";
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
} from "@mui/icons-material";
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { createService, deleteService, getAllServices, updateService } from '../../../services/service/newServiceEndpoints';


const ServiceProviderServiceManagement = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
    const [services, setServices] = React.useState({ services: [], pagination: {} });
    const [isLoading, setIsLoading] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalMode, setModalMode] = React.useState('create');
    const [selectedService, setSelectedService] = React.useState({});
    const [formData, setFormData] = React.useState({ name: '', price: '', description: '' });
    const [searchQuery, setSearchQuery] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [actionServiceId, setActionServiceId] = React.useState(null);
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
    const [fetchParams, setFetchParams] = React.useState({
        page: 1,
        limit: 20,
        search: '',
    });

    const fetchServices = async () => {
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
    };

    React.useEffect(() => {
        fetchServices();
    }, [fetchParams]);

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
        setFormData({ name: '', price: '', description: '' });
        setSelectedService({});
        setModalOpen(true);
    };

    const handleEditService = (service) => {
        setModalMode('update');
        setFormData({ name: service.name, price: service.price.toString(), description: service.description });
        setSelectedService(service);
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
            setSnackbar({ open: true, message: 'Please fill in all fields', severity: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            const serviceData = {
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description || null
            };

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
        setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            return "Invalid Date";
        }
    };
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        const handleOpenCreateOrderModal = () => handleCreateService();
        window.addEventListener("openCreateServiceModal", handleOpenCreateOrderModal);
        return () => {
            window.removeEventListener(
                "openCreateServiceModal",
                handleOpenCreateOrderModal
            );
        };
    }, []);

    const ServiceSkeleton = () => (
        <Card sx={{ mb: 2, borderRadius: 2 }}>
            <CardContent sx={{ p: 2 }}>
                <Stack spacing={2}>
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="40%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="30%" height={20} />
                </Stack>
            </CardContent>
        </Card>
    );

    const MobileServiceCard = ({ service }) => (
        <Card sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ height: '4px', bgcolor: muiTheme.palette.primary.main, width: '100%' }} />
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
        <Box sx={{ p: { xs: 1, sm: 1.4, lg: 4 }, paddingTop: "70px !important" }}>
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
                    />
                </Grid>
                {/* <Grid item xs={12} md={4}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateService}
            sx={{ height: 56, borderRadius: 2, fontWeight: 600 }}
          >
            Create Service
          </Button>
        </Grid> */}
            </Grid>

            {/* Services Content */}
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {isLoading ? (
                    <Box sx={{ p: 2 }}>
                        {[...Array(5)].map((_, index) => (
                            <ServiceSkeleton key={index} />
                        ))}
                    </Box>
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
                                                <TableCell>Service Name</TableCell>
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
                                                        <Typography variant="body1" fontWeight={500}>
                                                            {service.name}
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
                        <TextField
                            fullWidth
                            label="Service Name"
                            value={formData.name}
                            onChange={handleFormChange('name')}
                            variant="outlined"
                            placeholder="Enter service name"
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
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={() => setModalOpen(false)} sx={{ borderRadius: 2 }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleFormSubmit}
                        disabled={isLoading}
                        sx={{ borderRadius: 2, fontWeight: 600, minWidth: 120 }}
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
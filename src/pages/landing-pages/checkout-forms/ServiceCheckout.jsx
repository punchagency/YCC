import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
    Card, CardContent, Typography, TextField, Button, Box, Grid, Skeleton,
    CardMedia, Chip, Rating, Divider, Paper, Container
} from '@mui/material';
import {
    LocationOn,
    Phone,
    Business,
    CheckCircle,
    Schedule,
    Place,
    Email,
} from '@mui/icons-material';
import LandingPageFooter from "../../../components/landing-page-footer";
import LandingPageHeader from "../../../components/landing-page-header";
import { getServiceById } from "../../../services/service/serviceService";
import { findUserByEmail } from "../../../services/authService";
import { User } from 'lucide-react';
import { useToast } from '../../../components/Toast';

/* Service Checkout Form
    Users will provide their data such as name, email, phone, address
    on Submit I will check if the user already exists in the database using the email.
    if the User already exists, I will navigate the user to the Service page in the page and prompt the User to book the selected service.

    if the User does not exists, I will naviage the User to the crew/signup page with the provided data initialized in the signup form.
    after the User signs up, I will navigate the User to the Service page in the page and prompt the User to book the selected service.
*/
const ServiceCheckout = () => {
    const { showError } = useToast();
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const [service, setService] = React.useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [serviceLoading, setServiceLoading] = useState(true);

    React.useEffect(() => {
        if (service?.image) {
            const img = new Image();
            img.onload = () => setImageLoading(false);
            img.onerror = () => {
                setImageLoading(false);
                setImageError(true);
            };
            img.src = service.image;
        } else {
            setImageLoading(false);
        }
    }, [service?.image]);

    React.useEffect(() => {
        const fetchService = async () => {
            try {
                setServiceLoading(true);
                const res = await getServiceById(serviceId);
                setService(res.data);
            } catch (error) {
                showError('Failed to load service details. Please try again.');
            } finally {
                setServiceLoading(false);
            }
        };

        if (serviceId) {
            fetchService();
        }
    }, [serviceId]);

    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Please enter a valid email address"
        }

        if (!formData.name) {
            newErrors.name = 'Full name is required';
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        }

        if (!formData.address) {
            newErrors.address = 'Address is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            // Validate required fields
            if (!validateForm()) {
                return;
            }
            setErrors({});
            // Check if user exists by email
            const userResponse = await findUserByEmail(formData.email);
            if (userResponse.status) {
                // User exists, check if the current user is authenticated
                const isAuthenticated = localStorage.getItem('token');
                if (isAuthenticated) {
                    // User is authenticated, navigate to booking
                    navigate('/crew/booking/confirm-booking', { state: { serviceId, service } });
                } else {
                    // User is not authenticated, navigate to login
                    navigate('/login', {
                        state: {
                            from: '/service-checkout',
                            formData,
                            service,
                            type: 'service',
                            message: 'Please login to continue with your booking'
                        }
                    });
                }
            } else {
                // User doesn't exist, navigate to signup
                navigate('/crew/signup', { state: { from: '/service-checkout', formData, serviceId } });
            }
        } catch (error) {
            showError(error.message || 'An error occurred while processing your request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (serviceLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
                <LandingPageHeader isServiceCheckout={true} />

                <Container maxWidth="xl" sx={{
                    flex: 1,
                    mx: "auto",
                    p: { xs: 2, md: 3 },
                    mb: { xs: 2, md: 4 },
                    paddingTop: { xs: "80px", md: "120px" },
                    backgroundColor: '#f5f5f5',
                }}>
                    {/* Service Information Card Skeleton */}
                    <Card
                        sx={{
                            mb: { xs: 2, md: 4 },
                            borderRadius: 3,
                            boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}15`,
                            overflow: 'hidden',
                        }}
                    >
                        <Grid container>
                            {/* Service Image Skeleton */}
                            <Grid item xs={12} md={4}>
                                <Skeleton
                                    variant="rectangular"
                                    width="100%"
                                    height={{ xs: 250, md: 300 }}
                                    sx={{ bgcolor: 'grey.200' }}
                                />
                            </Grid>

                            {/* Service Details Skeleton */}
                            <Grid item xs={12} md={8}>
                                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Skeleton variant="text" sx={{ fontSize: '2rem', mb: 1, width: '80%' }} />
                                    <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 2, width: '90%' }} />
                                    <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 1, width: '70%' }} />

                                    <Box sx={{ mb: 2, mt: 2 }}>
                                        <Skeleton variant="text" sx={{ fontSize: '1.2rem', mb: 1, width: '60%' }} />
                                        <Skeleton variant="text" sx={{ fontSize: '0.9rem', mb: 0.5, width: '40%' }} />
                                        <Skeleton variant="text" sx={{ fontSize: '0.9rem', mb: 0.5, width: '50%' }} />
                                        <Skeleton variant="text" sx={{ fontSize: '0.9rem', mb: 0.5, width: '45%' }} />
                                        <Skeleton variant="text" sx={{ fontSize: '0.9rem', width: '55%' }} />
                                    </Box>

                                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Skeleton variant="text" sx={{ fontSize: '2.5rem', mb: 0.5, width: '100px' }} />
                                            <Skeleton variant="text" sx={{ fontSize: '0.9rem', width: '80px' }} />
                                        </Box>
                                        <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 2 }} />
                                    </Box>
                                </CardContent>
                            </Grid>
                        </Grid>
                    </Card>

                    {/* Booking Information Form Skeleton */}
                    <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                            <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '200px' }} />
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                            </Grid>

                            <Grid item xs={12}>
                                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                            </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                            <Skeleton variant="rectangular" width={160} height={48} sx={{ borderRadius: 2 }} />
                        </Box>
                    </Paper>
                </Container>

                <LandingPageFooter />
            </div>
        );
    }

    if (!service && !serviceLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <LandingPageHeader isServiceCheckout={true} />
                <Box sx={{
                    flex: 1,
                    p: { xs: 2, md: 3 },
                    paddingTop: { xs: "80px", md: "120px" },
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Card sx={{ maxWidth: 500, width: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', p: 4 }}>
                            <Typography variant="h5" color="error" gutterBottom>
                                Service Not Found
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 3 }}>
                                The service you're looking for could not be found or may no longer be available.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/')}
                                sx={{ backgroundColor: '#1976d2' }}
                            >
                                Return to Home
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
                <LandingPageFooter />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <LandingPageHeader isServiceCheckout={true} />

            <Box sx={{
                // flex: 1,
                mx: "auto",
                p: { xs: 2, md: 3 },
                paddingTop: { xs: "80px", md: "120px" },
                // backgroundColor: '#f5f5f5',
                // display: 'flex',
                // justifyContent: 'center',
                // alignItems: 'flex-start'
            }}>
                {/* Service Information Card */}
                <Card
                    sx={{
                        mb: { xs: 2, md: 4 },
                        borderRadius: 3,
                        boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}15`,
                        overflow: 'hidden',
                    }}
                >
                    <Grid container>
                        {/* Service Image */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{ position: 'relative', height: { xs: 250, md: '100%' } }}>
                                {imageLoading && (
                                    <Skeleton
                                        variant="rectangular"
                                        width="100%"
                                        height="100%"
                                        sx={{ position: 'absolute', top: 0, left: 0 }}
                                    />
                                )}
                                {!imageError && !imageLoading && (
                                    <CardMedia
                                        component="img"
                                        src={!!service?.image ? service.image : '/placeholder-service.jpg'}
                                        alt={service.name}
                                        onLoad={() => setImageLoading(false)}
                                        onError={() => setImageError(true)}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: imageLoading ? 'none' : 'block',
                                        }}
                                    />
                                )}
                                {imageError && (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            bgcolor: 'grey.200',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Business sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                                        <Typography variant="caption" color="text.secondary">
                                            Service Image
                                        </Typography>
                                    </Box>
                                )}
                                {service.category && (
                                    <Chip
                                        label={service.category}
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 16,
                                            left: 16,
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                        }}
                                    />
                                )}
                            </Box>
                        </Grid>

                        {/* Service Details */}
                        <Grid item xs={12} md={8}>
                            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                                    {service.name}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                                    Professional service provided by experienced crew members with expertise in {service.category}.
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                {/* Vendor Information */}
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Business sx={{ fontSize: 20, color: 'primary.main', mr: 1 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {service.vendor?.businessName || 'Service Provider'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Rating
                                            value={service.vendor?.customerSatisfaction?.averageScore || 0}
                                            size="small"
                                            readOnly
                                            precision={0.5}
                                        />
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                            ({service.vendor?.customerSatisfaction?.totalRatings || 0} reviews)
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <LocationOn sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {service.vendor?.address?.city || 'Location'}, {service.vendor?.address?.country || 'Country'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Phone sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {service.vendor?.phone || 'Contact available after booking'}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {/* Price and Booking Method */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                                            ${service.price}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            per service
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={service.vendor?.bookingMethod === 'instant booking' ? 'Instant Booking' : 'Booking Required'}
                                        color={service.vendor?.bookingMethod === 'instant booking' ? 'success' : 'default'}
                                        variant="outlined"
                                        sx={{ fontWeight: 500 }}
                                    />
                                </Box>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
                <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                        <Schedule sx={{ mr: 1, color: 'primary.main' }} />
                        Booking Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                            <TextField
                                fullWidth
                                label="Fullname *"
                                placeholder="Enter the your fullname"
                                value={formData.name}
                                onChange={handleInputChange('name')}
                                error={!!errors.name}
                                helperText={errors.name}
                                InputProps={{
                                    startAdornment: <User sx={{ color: 'action.active', mr: 1 }} />,
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

                        <Grid item xs={12} md={6}>
                            <Box>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'rgba(0, 0, 0, 0.87)' }}>
                                    Contact Phone *
                                </label>
                                <PhoneInput
                                    country={'us'}
                                    value={formData.phone}
                                    onChange={(phone) => {
                                        setFormData(prev => ({ ...prev, phone: phone }));
                                        // Clear error when user starts typing
                                        if (errors.phone) {
                                            setErrors(prev => ({ ...prev, phone: null }));
                                        }
                                    }}
                                    containerStyle={{
                                        width: '100%',
                                    }}
                                    inputStyle={{
                                        width: '100%',
                                        height: "55px",
                                        borderRadius: '10px',
                                        backgroundColor: '#F9FAFB',
                                        border: '2px solid #E5E7EB',
                                        fontSize: '16px',
                                        padding: '16.5px 14px 16.5px 58px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease-in-out',
                                    }}
                                    buttonStyle={{
                                        height: "55px",
                                        border: '2px solid #E5E7EB',
                                        borderRadius: '10px 0 0 10px',
                                        backgroundColor: '#F9FAFB',
                                    }}
                                    specialLabel=""
                                />
                                {errors.phone && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                        {errors.phone}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'rgba(0, 0, 0, 0.87)' }}>
                                Email *
                            </label>
                            <TextField
                                fullWidth
                                variant='outlined'
                                label="Email *"
                                type='email'
                                placeholder="Enter the your email address"
                                value={formData.email}
                                onChange={handleInputChange('email')}
                                error={!!errors.email}
                                helperText={errors.email}
                                InputProps={{
                                    startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />,
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
                            {errors.email && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                    {errors.email}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Service Location *"
                                type='text'
                                placeholder="Enter the service location address"
                                value={formData.address}
                                onChange={handleInputChange('address')}
                                error={!!errors.address}
                                helperText={errors.address}
                                InputProps={{
                                    startAdornment: <Place sx={{ color: 'action.active', mr: 1 }} />,
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
                            {errors.address && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                    {errors.address}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading}
                            startIcon={loading ? <div /> : <CheckCircle />}
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                background: loading ? 'grey.400' : 'linear-gradient(45deg, #1976d2, #42a5f5)',
                            }}
                        >
                            {loading ? 'Creating Booking...' : 'Confirm Booking'}
                        </Button>
                    </Box>
                </Paper>
            </Box>


            <LandingPageFooter />
        </div>
    )
}

export default ServiceCheckout

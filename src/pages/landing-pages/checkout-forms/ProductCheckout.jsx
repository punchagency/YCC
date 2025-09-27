import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
    Card, CardContent, Typography, TextField, Button, Box, Grid, Skeleton,
    CardMedia, Chip, Rating, Divider, Paper, Container
} from '@mui/material';
import {
    ShoppingCart,
    Phone,
    Business,
    Inventory,
    Place,
    Email,
    Person,
} from '@mui/icons-material';
import LandingPageFooter from "../../../components/landing-page-footer";
import LandingPageHeader from "../../../components/landing-page-header";
import { getProductById } from '../../../services/inventory/inventoryService';
import { findUserByEmail } from "../../../services/authService";
import { useToast } from '../../../components/Toast';

/* Product Checkout Form
    Users will provide their data such as name, email, phone, address
    on Submit I will check if the user already exists in the database using the email.
    if the User already exists, I will navigate the user to the product purchase page or cart.
    if the User does not exists, I will navigate the User to the crew/signup page with the provided data initialized in the signup form.
    after the User signs up, I will navigate the User to the product purchase page or cart.
*/
const ProductCheckout = () => {
    const { showError } = useToast();
    const { productId } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const [product, setProduct] = React.useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [productLoading, setProductLoading] = useState(true);

    React.useEffect(() => {
        if (product?.productImage) {
            const img = new Image();
            img.onload = () => setImageLoading(false);
            img.onerror = () => {
                setImageLoading(false);
                setImageError(true);
            };
            img.src = product.productImage;
        } else {
            setImageLoading(false);
        }
    }, [product?.productImage]);

    React.useEffect(() => {
        const fetchProduct = async () => {
            try {
                setProductLoading(true);
                const res = await getProductById(productId);
                setProduct(res.data);
            } catch (error) {
                showError('Failed to load product details. Please try again.');
            } finally {
                setProductLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

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
            newErrors.address = 'Delivery address is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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
                    // User is authenticated, navigate to cart
                    navigate('/cart', { state: { productId, product } });
                } else {
                    // User is not authenticated, navigate to login
                    navigate('/login', {
                        state: {
                            from: '/product-checkout',
                            formData,
                            service: product,
                            type: 'product',
                            message: 'Please login to continue with your purchase'
                        }
                    });
                }
            } else {
                // User doesn't exist, navigate to signup
                navigate('/crew/signup', { state: { from: '/product-checkout', formData, productId, service: product } });
            }
        } catch (error) {
            showError(error.message || 'An error occurred while processing your request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (productLoading) {
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
                    {/* Product Information Card Skeleton */}
                    <Card
                        sx={{
                            mb: { xs: 2, md: 4 },
                            borderRadius: 3,
                            boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}15`,
                            overflow: 'hidden',
                        }}
                    >
                        <Grid container>
                            {/* Product Image Skeleton */}
                            <Grid item xs={12} md={4}>
                                <Skeleton
                                    variant="rectangular"
                                    width="100%"
                                    height={{ xs: 250, md: 300 }}
                                    sx={{ bgcolor: 'grey.200' }}
                                />
                            </Grid>

                            {/* Product Details Skeleton */}
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

                    {/* Purchase Information Form Skeleton */}
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

    if (!product && !productLoading) {
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
                                Product Not Found
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 3 }}>
                                The product you're looking for could not be found or may no longer be available.
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
                mx: "auto",
                p: { xs: 2, md: 3 },
                paddingTop: { xs: "80px", md: "120px" },
            }}>
                {/* Product Information Card */}
                <Card
                    sx={{
                        mb: { xs: 2, md: 4 },
                        borderRadius: 3,
                        boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}15`,
                        overflow: 'hidden',
                    }}
                >
                    <Grid container>
                        {/* Product Image */}
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
                                        src={!!product?.productImage ? product.productImage : '/placeholder-product.jpg'}
                                        alt={product.name}
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
                                        <Inventory sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                                        <Typography variant="caption" color="text.secondary">
                                            Product Image
                                        </Typography>
                                    </Box>
                                )}
                                {product.category && product.category.length > 0 && (
                                    <Chip
                                        label={product.category[0]}
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
                                <Chip
                                    label={`SKU: ${product.sku || 'N/A'}`}
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        bgcolor: 'secondary.main',
                                        color: 'white',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                    }}
                                />
                            </Box>
                        </Grid>

                        {/* Product Details */}
                        <Grid item xs={12} md={8}>
                            <CardContent sx={{ p: { xs: 1, md: 2 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                                    {product.name}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, flexGrow: 1 }}>
                                    {product.description || 'High-quality product designed for maritime and offshore applications.'}
                                </Typography>

                                <Divider sx={{ my: 1 }} />

                                {/* Supplier Information */}
                                <Box sx={{ mb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Business sx={{ fontSize: 20, color: 'primary.main', mr: 1 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {product.supplier?.businessName || 'Supplier'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Rating
                                            value={product.supplier?.customerSatisfaction?.averageScore || 0}
                                            size="small"
                                            readOnly
                                            precision={0.5}
                                        />
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                            ({product.supplier?.customerSatisfaction?.totalRatings || 0} reviews)
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Place sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {product.supplier?.address ? `${product.supplier.address.city || 'City'}, ${product.supplier.address.country || 'Country'}` : 'Location not specified'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Phone sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {product.supplier?.phone || 'Contact available after purchase'}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 1 }} />

                                {/* Price and Purchase Button */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                                            ${product.price?.toLocaleString() || '0'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            per unit
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label="In Stock"
                                        color="success"
                                        variant="outlined"
                                        sx={{ fontWeight: 500 }}
                                    />
                                </Box>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>

                {/* Purchase Information Form */}
                <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                        <ShoppingCart sx={{ mr: 1, color: 'primary.main' }} />
                        Purchase Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                            <TextField
                                fullWidth
                                label="Full Name *"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleInputChange('name')}
                                error={!!errors.name}
                                helperText={errors.name}
                                InputProps={{
                                    startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />,
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
                                placeholder="Enter your email address"
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
                                label="Delivery Address *"
                                type='text'
                                placeholder="Enter your delivery address"
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
                            startIcon={loading ? <div /> : <ShoppingCart />}
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                background: loading ? 'grey.400' : 'linear-gradient(45deg, #1976d2, #42a5f5)',
                            }}
                        >
                            {loading ? 'Processing...' : 'Add to Cart'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
            <LandingPageFooter />
        </div>
    )
}

export default ProductCheckout

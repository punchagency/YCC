import React, { useState, useEffect } from 'react';
import { useUser } from "../../../context/userContext";
import { useOutletContext } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Chip,
    Alert,
    Snackbar,
    alpha,
    Autocomplete,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    useTheme as useMuiTheme,
} from "@mui/material";
import {
    LocationOn as LocationIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    CheckCircleOutline as CheckIcon,
} from "@mui/icons-material";
import countryList from "react-select-country-list";
import { updateServiceProviderSettings } from '../../../services/service/newServiceEndpoints';

const Settings = () => {
    const { user, refreshUser } = useUser();
    const { setPageTitle } = useOutletContext() || {};
    const muiTheme = useMuiTheme();
    
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (setPageTitle) setPageTitle("Settings");
    }, [setPageTitle]);

    // Initialize original data when user data loads
    useEffect(() => {
        if (user?.vendorProfile) {
            const userData = {
                businessName: user.vendorProfile.businessName || '',
                address: {
                    street: user.vendorProfile.address?.street || "",
                    street2: user.vendorProfile.address?.street2 || "",
                    city: user.vendorProfile.address?.city || "",
                    state: user.vendorProfile.address?.state || "",
                    zip: user.vendorProfile.address?.zip || "",
                    country: user.vendorProfile.address?.country || "",
                },
                departments: user.vendorProfile.departments || [],
                phone: user.vendorProfile.phone || '',
                businessWebsite: user.vendorProfile.businessWebsite || '',
                services: user.vendorProfile.services || [],
                availability: user.vendorProfile.availability || '',
                bookingMethod: user.vendorProfile.bookingMethod || '',
                serviceAreas: user.vendorProfile.serviceAreas || [],
                contactPerson: {
                    fullName: user.vendorProfile.contactPerson?.fullName || '',
                    role: user.vendorProfile.contactPerson?.role || '',
                }
            };
            setFormData(userData);
            setOriginalData(userData);
        }
    }, [user]);

    const [formData, setFormData] = useState({
        businessName: user?.vendorProfile?.businessName || '',
        address: {
            street: user?.vendorProfile?.address?.street || "",
            street2: user?.vendorProfile?.address?.street2 || "",
            city: user?.vendorProfile?.address?.city || "",
            state: user?.vendorProfile?.address?.state || "",
            zip: user?.vendorProfile?.address?.zip || "",
            country: user?.vendorProfile?.address?.country || "",
        },
        departments: user?.vendorProfile?.departments || [],
        phone: user?.vendorProfile?.phone || '',
        businessWebsite: user?.vendorProfile?.businessWebsite || '',
        services: user?.vendorProfile?.services || [],
        availability: user?.vendorProfile?.availability || '',
        bookingMethod: user?.vendorProfile?.bookingMethod || '',
        serviceAreas: user?.vendorProfile?.serviceAreas || [],
        contactPerson: {
            fullName: user?.vendorProfile?.contactPerson?.fullName || '',
            role: user?.vendorProfile?.contactPerson?.role || '',
        }
    });

    const [originalData, setOriginalData] = useState({});

    const departmentOptions = [
        'Captain', 'Crew', 'Exterior', 'Interior', 'Engineering', 'Galley'
    ];
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const serviceOptions = {
        captain: [
            'Vessel Management & Administration',
            'Maritime Legal & Compliance Assistance',
            'Crew Recruitment & Placement Services',
            'Customs & Immigration Assistance',
            'Insurance & Risk Management',
            'Security & Anti-Piracy Training',
            'Safety Equipment Inspections & Compliance',
            'IT & Cybersecurity Services for Yachts',
            'Charter & Itinerary Planning Assistance',
            'Satellite & Internet Connectivity Solutions'
        ],
        galley: [
            'Fresh Produce & Gourmet Food Provisioning',
            'Butcher & Seafood Supply Services',
            'Specialty Ingredient Sourcing',
            'Custom Catering & Onboard Chef Services',
            'Galley Equipment Maintenance & Repair',
            'Wine, Spirits & Specialty Beverages Supply',
            'Specialty Coffee & Tea Provisioning',
            'Dry & Frozen Goods Supply',
            'Galley Deep Cleaning & Sanitation Services',
            'Kitchenware & Culinary Equipment Supply'
        ],
        engineering: [
            'Marine Engine Servicing & Repairs',
            'Generator Installation & Maintenance',
            'HVAC & Refrigeration Services',
            'Watermaker Installation & Repairs',
            'Fuel System Cleaning & Maintenance',
            'Electrical System Troubleshooting',
            'Navigation & Communication System Setup',
            'Hydraulic System Servicing',
            'Welding & Metal Fabrication Services',
            'Spare Parts Sourcing & Logistics'
        ],
        interior: [
            'Yacht Interior Cleaning & Housekeeping',
            'Laundry & Dry Cleaning Services',
            'Custom Interior Design & Refurbishment',
            'Florist & Fresh Flower Arrangements',
            'Carpet & Upholstery Cleaning',
            'Event & Party Planning Services',
            'Provisioning for Guest Supplies',
            'Bar & Beverage Supply Services',
            'AV & Entertainment System Installation',
            'Crew Uniform Tailoring & Embroidery'
        ],
        exterior: [
            'Yacht Detailing & Washdowns',
            'Teak Deck Sanding & Restoration',
            'Varnishing & Paintwork Services',
            'Fiberglass & Gelcoat Repairs',
            'Docking & Line Handling Assistance',
            'Diving & Underwater Hull Cleaning',
            'Fender & Rope Supply & Maintenance',
            'Tender & Jet Ski Servicing',
            'Watersports Equipment Rental & Repairs',
            'Exterior Upholstery & Canvas Work'
        ],
        crew: [
            'Mental Health Support',
            'Confidential Therapy',
            'Career Guidance',
            'Legal Consultation',
            'Financial Advisory'
        ]
    };

    const bookingMethodOptions = [
        { label: 'Instant Booking', value: 'instant booking' },
        { label: 'Request to Book', value: 'request to book' },
        { label: 'Quote Request', value: 'quote request' }
    ];

    const serviceAreaOptions = [
        'United States',
        'Mediterranean',
        'Both'
    ];

    // Process country list with priority countries at the top
    const getCountryOptions = () => {
        const countries = countryList().getData();
        
        // Priority countries to show first
        const priorityCountries = [
            'US', // United States
            'IT', // Italy
            'FR', // France
            'ES', // Spain
            'DE', // Germany
            'GB', // United Kingdom
            'NL', // Netherlands
            'CH', // Switzerland
            'AT', // Austria
            'BE', // Belgium
            'PT', // Portugal
            'GR', // Greece
            'SE', // Sweden
            'NO', // Norway
            'DK', // Denmark
            'FI', // Finland
            'IE', // Ireland
        ];
        
        // Create priority and regular country lists
        const priorityList = priorityCountries
            .map(code => countries.find(c => c.value === code))
            .filter(Boolean);
        
        const regularList = countries.filter(c => !priorityCountries.includes(c.value));
        
        // Return combined list with priority countries first
        return [...priorityList, ...regularList];
    };

    const countryOptions = getCountryOptions();

    const getAvailableServices = () => {
        let availableServices = [];
        formData.departments.forEach(dept => {
            const deptKey = dept.toLowerCase();
            if (serviceOptions[deptKey]) {
                availableServices = [...availableServices, ...serviceOptions[deptKey]];
            }
        });
        return [...new Set(availableServices)];
    };

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleAddressChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [field]: value,
            },
        }));
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const response = await updateServiceProviderSettings(formData);
            if (response.status) {
                setSnackbar({ open: true, message: response.message, severity: 'success' });
                await refreshUser();
                setIsEditing(false);
                setOriginalData({ ...formData });
            } else {
                setSnackbar({ open: true, message: response.error || 'Failed to update settings', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Error updating settings', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({ ...originalData });
        setIsEditing(false);
    };

    

    return (
        <Box sx={{ p: { xs: 1, md: 3, lg: 4 }, paddingTop: '40px !important', mx: 'auto' }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, color: '#1a1a1a' }}>
                Service Provider Settings
            </Typography>

            {/* Settings Status Banner */}
            {!isEditing && (
                <Box 
                    sx={{ 
                        mb: 3, 
                        p: 2, 
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        bgcolor: alpha(muiTheme.palette.success.main, 0.1),
                        border: `1px solid ${alpha(muiTheme.palette.success.main, 0.3)}`,
                    }}
                >
                    <CheckIcon color="success" />
                    <Typography>
                        Your settings are up to date.
                    </Typography>
                    <Button 
                        variant="outlined" 
                        color="success" 
                        size="small" 
                        startIcon={<EditIcon />}
                        onClick={() => setIsEditing(true)}
                        sx={{ ml: 'auto' }}
                    >
                        Edit Settings
                    </Button>
                </Box>
            )}

            <Grid container spacing={4}>
                {/* Business Information */}
                <Grid item xs={12}>
                    <Card sx={{
                        borderRadius: 2,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #e0e0e0',
                        backgroundColor: '#fff'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333', fontSize: '1.25rem' }}>
                                Business Information
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Business Name"
                                        placeholder="Enter business name"
                                        value={formData.businessName}
                                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                                        disabled={!isEditing}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                backgroundColor: '#fafafa',
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#bdbdbd'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#1976d2'
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#666',
                                                fontWeight: 500
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        placeholder="Enter phone number"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        disabled={!isEditing}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                backgroundColor: '#fafafa',
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#bdbdbd'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#1976d2'
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#666',
                                                fontWeight: 500
                                            }
                                        }}
                                    />
                                </Grid>


                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Business Website"
                                        placeholder="Enter website URL"
                                        value={formData.businessWebsite}
                                        onChange={(e) => handleInputChange('businessWebsite', e.target.value)}
                                        disabled={!isEditing}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                backgroundColor: '#fafafa',
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#bdbdbd'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#1976d2'
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#666',
                                                fontWeight: 500
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ mb: 0, fontWeight: 600, color: '#333', fontSize: '1.25rem' }}>
                                        Address Information
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Street Address"
                                        placeholder="Enter street address"
                                        value={formData.address.street}
                                        onChange={(e) => handleAddressChange('street', e.target.value)}
                                        disabled={!isEditing}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <LocationIcon sx={{ mr: 1, color: "primary.main" }} />
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                backgroundColor: '#fafafa',
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#bdbdbd'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#1976d2'
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#666',
                                                fontWeight: 500
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Street Address 2"
                                        placeholder="Apt, Suite, Unit, etc."
                                        value={formData.address.street2}
                                        onChange={(e) => handleAddressChange('street2', e.target.value)}
                                        disabled={!isEditing}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                backgroundColor: '#fafafa',
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#bdbdbd'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#1976d2'
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#666',
                                                fontWeight: 500
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="City"
                                        placeholder="Enter city"
                                        value={formData.address.city}
                                        onChange={(e) => handleAddressChange('city', e.target.value)}
                                        disabled={!isEditing}
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                backgroundColor: '#fafafa',
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#bdbdbd'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#1976d2'
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#666',
                                                fontWeight: 500
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="State/Province"
                                        placeholder="Enter state or province"
                                        value={formData.address.state}
                                        onChange={(e) => handleAddressChange('state', e.target.value)}
                                        disabled={!isEditing}
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                backgroundColor: '#fafafa',
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#bdbdbd'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#1976d2'
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#666',
                                                fontWeight: 500
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="ZIP/Postal Code"
                                        placeholder="Enter ZIP or postal code"
                                        value={formData.address.zip}
                                        onChange={(e) => handleAddressChange('zip', e.target.value)}
                                        disabled={!isEditing}
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                backgroundColor: '#fafafa',
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#bdbdbd'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#1976d2'
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#666',
                                                fontWeight: 500
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ color: '#666', fontWeight: 500 }}>Country</InputLabel>
                                        <Select
                                            value={formData.address.country}
                                            onChange={(e) => handleAddressChange('country', e.target.value)}
                                            input={<OutlinedInput label="Country" />}
                                            disabled={!isEditing}
                                            displayEmpty
                                            sx={{
                                                borderRadius: 1.5,
                                                backgroundColor: '#fafafa',
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#bdbdbd'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#1976d2'
                                                }
                                            }}
                                        >
                                            <MenuItem value="" disabled>
                                                Select Country
                                            </MenuItem>
                                            {countryOptions.map((country, index) => (
                                                <MenuItem key={index} value={country.value}>{country.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333', fontSize: '1.25rem', mt: 4 }}>
                                Service Information
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Autocomplete
                                        multiple
                                        options={departmentOptions}
                                        value={formData.departments}
                                        onChange={(e, value) => handleInputChange('departments', value)}
                                        disabled={!isEditing}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip
                                                    variant="outlined"
                                                    label={option}
                                                    {...getTagProps({ index })}
                                                    sx={{
                                                        backgroundColor: alpha('#1976d2', 0.1),
                                                        borderColor: '#1976d2',
                                                        color: '#1976d2'
                                                    }}
                                                />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Departments Served"
                                                placeholder="Select departments"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1.5,
                                                        backgroundColor: '#fafafa',
                                                        '& fieldset': {
                                                            borderColor: '#e0e0e0'
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: '#bdbdbd'
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#1976d2'
                                                        }
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: '#666',
                                                        fontWeight: 500
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ color: '#666', fontWeight: 500 }}>Booking Method</InputLabel>
                                        <Select
                                            value={formData.bookingMethod}
                                            onChange={(e) => handleInputChange('bookingMethod', e.target.value)}
                                            input={<OutlinedInput label="Booking Method" />}
                                            disabled={!isEditing}
                                            displayEmpty
                                            sx={{
                                                borderRadius: 1.5,
                                                backgroundColor: '#fafafa',
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#bdbdbd'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#1976d2'
                                                }
                                            }}
                                        >
                                            {bookingMethodOptions.map((method, index) => (
                                                <MenuItem key={index} value={method.value}>{method.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <Autocomplete
                                        multiple
                                        options={getAvailableServices()}
                                        value={formData.services}
                                        onChange={(e, value) => handleInputChange('services', value)}
                                        disabled={!isEditing}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip
                                                    variant="outlined"
                                                    label={option}
                                                    {...getTagProps({ index })}
                                                    sx={{
                                                        backgroundColor: alpha('#1976d2', 0.1),
                                                        borderColor: '#1976d2',
                                                        color: '#1976d2',
                                                        fontSize: '0.75rem'
                                                    }}
                                                />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Services Offered"
                                                placeholder="Select services"
                                                helperText="Select departments first to see available services"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1.5,
                                                        backgroundColor: '#fafafa',
                                                        '& fieldset': {
                                                            borderColor: '#e0e0e0'
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: '#bdbdbd'
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#1976d2'
                                                        }
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: '#666',
                                                        fontWeight: 500
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Availability"
                                        value={formData.availability}
                                        onChange={(e) => handleInputChange('availability', e.target.value)}
                                        placeholder="e.g., Mon-Fri 9AM-5PM"
                                        disabled={!isEditing}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                backgroundColor: '#fafafa',
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#bdbdbd'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#1976d2'
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#666',
                                                fontWeight: 500
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Autocomplete
                                        multiple
                                        options={serviceAreaOptions}
                                        value={formData.serviceAreas}
                                        onChange={(e, value) => handleInputChange('serviceAreas', value)}
                                        disabled={!isEditing}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip
                                                    variant="outlined"
                                                    label={option}
                                                    {...getTagProps({ index })}
                                                    sx={{
                                                        backgroundColor: alpha('#1976d2', 0.1),
                                                        borderColor: '#1976d2',
                                                        color: '#1976d2'
                                                    }}
                                                />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Service Areas"
                                                placeholder="Select service areas"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1.5,
                                                        backgroundColor: '#fafafa',
                                                        '& fieldset': {
                                                            borderColor: '#e0e0e0'
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: '#bdbdbd'
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#1976d2'
                                                        }
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: '#666',
                                                        fontWeight: 500
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>


                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333', fontSize: '1.25rem', mt: 4 }}>
                                Contact Person
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        placeholder="Enter full name"
                                        value={formData.contactPerson.fullName}
                                        onChange={(e) => handleInputChange('contactPerson.fullName', e.target.value)}
                                        disabled={!isEditing}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                backgroundColor: '#fafafa',
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#bdbdbd'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#1976d2'
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#666',
                                                fontWeight: 500
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Role/Position"
                                        placeholder="Enter role or position"
                                        value={formData.contactPerson.role}
                                        onChange={(e) => handleInputChange('contactPerson.role', e.target.value)}
                                        disabled={!isEditing}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                backgroundColor: '#fafafa',
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#bdbdbd'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#1976d2'
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#666',
                                                fontWeight: 500
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Action Buttons - Only shown when editing */}
                {isEditing && (
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={handleCancel}
                                startIcon={<CancelIcon />}
                                sx={{
                                    borderRadius: 1.5,
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    borderColor: '#e0e0e0',
                                    color: '#666',
                                    '&:hover': {
                                        borderColor: '#bdbdbd',
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleUpdate}
                                disabled={loading}
                                startIcon={<SaveIcon />}
                                sx={{
                                    borderRadius: 1.5,
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    backgroundColor: '#1976d2',
                                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                                    '&:hover': {
                                        backgroundColor: '#1565c0',
                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)'
                                    },
                                    '&:disabled': {
                                        backgroundColor: '#ccc',
                                        boxShadow: 'none'
                                    }
                                }}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Box>
                    </Grid>
                )}
            </Grid>

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
};

export default Settings;

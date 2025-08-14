import React, { useState, useEffect } from 'react';
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
    Chip,
    Alert,
    Snackbar,
    useMediaQuery,
    useTheme as useMuiTheme,
    alpha,
    Autocomplete,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Divider,
} from "@mui/material";
import {
    Business as BusinessIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Language as WebsiteIcon,
    RoomService as ServiceIcon,
    Schedule as ScheduleIcon,
    BookOnline as BookingIcon,
    Map as MapIcon,
    Person as PersonIcon,
    Save as SaveIcon,
} from "@mui/icons-material";
import { updateServiceProviderSettings } from '../../../services/service/newServiceEndpoints';

const Settings = () => {
    const { user, setUser, refreshUser } = useUser();
    const { theme } = useTheme();
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
    const { setPageTitle } = useOutletContext() || {};

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (setPageTitle) setPageTitle("Settings");
    }, [setPageTitle]);

    const [formData, setFormData] = useState({
        businessName: user?.vendorProfile?.businessName || '',
        businessAddress: user?.vendorProfile?.businessAddress || '',
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

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const response = await updateServiceProviderSettings(formData);
            if (response.status) {
                setSnackbar({ open: true, message: response.message, severity: 'success' });
                await refreshUser();
            } else {
                setSnackbar({ open: true, message: response.error || 'Failed to update settings', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Error updating settings', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 1, md: 3, lg: 4 }, paddingTop: '70px !important', mx: 'auto' }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, color: '#1a1a1a' }}>
                Service Provider Settings
            </Typography>

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
                                        label="Business Address"
                                        placeholder="Enter business address"
                                        value={formData.businessAddress}
                                        onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                                        multiline
                                        rows={3}
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

                {/* Service Information */}
                <Grid item xs={12}>
                    <Card sx={{
                        borderRadius: 2,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #e0e0e0',
                        backgroundColor: '#fff'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333', fontSize: '1.25rem' }}>
                                Service Information
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Autocomplete
                                        multiple
                                        options={departmentOptions}
                                        value={formData.departments}
                                        onChange={(e, value) => handleInputChange('departments', value)}
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
                        </CardContent>
                    </Card>
                </Grid>

                {/* Contact Person */}
                <Grid item xs={12}>
                    <Card sx={{
                        borderRadius: 2,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #e0e0e0',
                        backgroundColor: '#fff'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333', fontSize: '1.25rem' }}>
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

                {/* Action Buttons */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                borderRadius: "8px",
                                px: 4,
                                py: 1,
                                fontSize: '1rem',
                                fontWeight: 500,
                                textTransform: 'none',
                                borderColor: '#e0e0e0',
                                backgroundColor: "#EF4444",
                                color: '#fff',
                                '&:hover': {
                                    opacity: 0.8
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
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </Box>
                </Grid>
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

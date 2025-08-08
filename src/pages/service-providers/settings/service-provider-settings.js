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
        <Box sx={{ p: { xs: 1, md: 2, lg: 3 }, paddingTop: '70px !important' }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 500, }}>
                Service Provider Settings
            </Typography>

            <Grid container spacing={3}>
                {/* Business Information */}
                <Grid item xs={12}>
                    <Card sx={{
                        borderRadius: 3,
                        // boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        // border: '1px solid rgba(3, 77, 146, 0.1)'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: '#123F66' }}>
                                <BusinessIcon /> Business Information
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Business Name"
                                        value={formData.businessName}
                                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                                        InputProps={{
                                            startAdornment: <BusinessIcon sx={{ mr: 1, color: '#123F66' }} />
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#123F66'
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    // borderColor: '#123F66'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        InputProps={{
                                            startAdornment: <PhoneIcon sx={{ mr: 1, color: '#123F66' }} />
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#123F66'
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    // borderColor: '#123F66'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Business Address"
                                        value={formData.businessAddress}
                                        onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                                        multiline
                                        rows={2}
                                        InputProps={{
                                            startAdornment: <LocationIcon sx={{ mr: 1, color: '#123F66', alignSelf: 'flex-start', mt: 1 }} />
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#123F66'
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    // borderColor: '#123F66'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Business Website"
                                        value={formData.businessWebsite}
                                        onChange={(e) => handleInputChange('businessWebsite', e.target.value)}
                                        InputProps={{
                                            startAdornment: <WebsiteIcon sx={{ mr: 1, color: '#123F66' }} />
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#123F66'
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    // borderColor: '#123F66'
                                                }
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
                        borderRadius: 3,
                        // boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        // border: '1px solid rgba(3, 77, 146, 0.1)'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: '#123F66' }}>
                                <ServiceIcon /> Service Information
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
                                                        backgroundColor: alpha('#123F66', 0.1),
                                                        borderColor: '#123F66',

                                                    }}
                                                />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Departments Served"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#123F66'
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            // borderColor: '#123F66'
                                                        }
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Booking Method</InputLabel>
                                        <Select
                                            value={formData.bookingMethod}
                                            onChange={(e) => handleInputChange('bookingMethod', e.target.value)}
                                            input={<OutlinedInput label="Booking Method" />}
                                            startAdornment={<BookingIcon sx={{ mr: 1, color: '#123F66' }} />}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#123F66'
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    // borderColor: '#123F66'
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
                                                        backgroundColor: alpha('#123F66', 0.1),
                                                        borderColor: '#123F66',
                                                        fontSize: '0.75rem'
                                                    }}
                                                />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Services Offered"
                                                helperText="Select departments first to see available services"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#123F66'
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            // borderColor: '#123F66'
                                                        }
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
                                        InputProps={{
                                            startAdornment: <ScheduleIcon sx={{ mr: 1, color: '#123F66' }} />
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#123F66'
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    // borderColor: '#123F66'
                                                }
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
                                                        backgroundColor: alpha('#123F66', 0.1),
                                                        borderColor: '#123F66',

                                                    }}
                                                />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Service Areas"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <>
                                                            <MapIcon sx={{ mr: 1, color: '#123F66' }} />
                                                            {params.InputProps.startAdornment}
                                                        </>
                                                    )
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#123F66'
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            // borderColor: '#123F66'
                                                        }
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
                        borderRadius: 3,
                        // boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        // border: '1px solid rgba(3, 77, 146, 0.1)'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: '#123F66' }}>
                                <PersonIcon /> Contact Person
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={formData.contactPerson.fullName}
                                        onChange={(e) => handleInputChange('contactPerson.fullName', e.target.value)}
                                        InputProps={{
                                            startAdornment: <PersonIcon sx={{ mr: 1, color: '#123F66' }} />
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#123F66'
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#123F66'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Role/Position"
                                        value={formData.contactPerson.role}
                                        onChange={(e) => handleInputChange('contactPerson.role', e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#123F66'
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    // borderColor: '#123F66'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Save Button */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleUpdate}
                            disabled={loading}
                            startIcon={<SaveIcon />}
                            sx={{
                                // background: 'linear-gradient(45deg, #123F66, #123F66)',
                                borderRadius: 3,
                                width: '100%',
                                px: 4,
                                py: 1,
                                fontSize: '1.1rem',
                                fontWeight: 500,
                                textTransform: 'none',
                                // boxShadow: '0 4px 15px rgba(3, 77, 146, 0.3)',
                                '&:hover': {
                                    // background: 'linear-gradient(45deg, #023a7a, #0366b3)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(3, 77, 146, 0.4)'
                                },
                                '&:disabled': {
                                    background: '#ccc'
                                }
                            }}
                        >
                            {loading ? 'Updating...' : 'Update Settings'}
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

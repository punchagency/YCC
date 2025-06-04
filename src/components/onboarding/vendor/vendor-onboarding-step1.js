import { InfoOutlined, CloudDownloadOutlined, CloudUploadOutlined, Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  styled,
  IconButton,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState, useEffect, useRef, useCallback } from "react";
import csvTemplate from '../../../assets/vendor-onboarding-template.csv';
import excelTemplate from '../../../assets/vendor-onboarding-template.xlsx';
import { Toast } from 'primereact/toast';
import { useUser } from '../../../context/userContext';
import * as XLSX from 'xlsx';
import { useParams, useLocation } from 'react-router-dom';
import { formatAmount, unformatAmount } from '../../../utils/formatAmount';

const VendorOnboardingStep1 = ({ handleNext }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dialogRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  const { id: userId } = useParams();
  const location = useLocation();
  const { uploadServicesData, verifyOnboardingStep1 } = useUser();
  const toast = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasRunRef = useRef(false);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    description: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Determine role based on URL path
  const role = location.pathname.includes('/vendor/onboarding/') ? 'service_provider' : 'supplier';

  const requiredHeaders = ["service name", "description", "price"];

  const validateFile = (file, type) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size should not exceed 5MB');
    }

    // File type validation
    const validTypes = {
      csv: ['text/csv', 'application/vnd.ms-excel'],
      excel: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    };

    // Get file extension
    const extension = file.name.split('.').pop().toLowerCase();
    const validExtensions = {
      csv: ['csv'],
      excel: ['xlsx', 'xls']
    };

    // Check both MIME type and file extension
    if (!validTypes[type].includes(file.type) && !validExtensions[type].includes(extension)) {
      throw new Error(`Invalid file type. Please upload a valid ${type.toUpperCase()} file (${validExtensions[type].join(', ')}).`);
    }
  };

  const downloadTemplate = (fileType) => {
    const templateUrl = fileType === "csv" ? csvTemplate : excelTemplate;
    const link = document.createElement("a");
    link.href = templateUrl;
    link.download = `vendor_onboarding_template.${fileType}`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const verifyInventoryUpload = async () => {
      try {
        if (!userId) {
          console.error('Missing userId:', { userId });
          return;
        }

        const data = await verifyOnboardingStep1(userId, role);
        console.log('Step 1 - Verification response:', data);
        
        if (data?.data?.length > 0) {
          handleNext();
        }
      } catch (error) {
        console.error('Step 1 - Verification error:', error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error verifying services",
        });
      }
    };

    verifyInventoryUpload();
  }, [handleNext, verifyOnboardingStep1, userId, role]);

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setDialogType(null);
    setSelectedFile(null);
    setServices([]);
    setNewService({ name: '', price: '', description: '' });
    setShowSuccess(false);
  };

  const validateHeaders = (headers) => {
    const missing = requiredHeaders.filter(req => !headers.includes(req.toLowerCase()));
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    return true;
  };

  const handleFileUpload = (e, dialogType) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      validateFile(file, dialogType);
    } catch (error) {
      setError(error.message);
      return;
    }

    if (dialogType === 'csv') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          const firstLine = text.split('\n')[0].trim();
          const headers = firstLine.split(',').map(h => h.trim().toLowerCase());
          validateHeaders(headers);
          setSelectedFile(file);
        } catch (error) {
          setError(error.message);
        }
      };
      reader.readAsText(file);
    } else if (dialogType === 'excel') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          
          if (jsonData.length === 0) {
            throw new Error('Excel file is empty');
          }

          const headers = jsonData[0].map(header => header.toLowerCase());
          validateHeaders(headers);
          setSelectedFile(file);
        } catch (error) {
          setError(error.message);
        }
      };
      reader.onerror = () => {
        setError('Error reading file');
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleAddService = () => {
    if (!newService.name || !newService.price) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Service name and price are required",
      });
      return;
    }

    // Unformat the price before adding to services array
    const unformattedPrice = unformatAmount(newService.price);
    setServices([...services, { ...newService, price: unformattedPrice }]);
    setNewService({ name: '', price: '', description: '' });
    setShowSuccess(true);
  };

  const handleSubmit = async () => {
    if (dialogType === 'manual' && services.length === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please add at least one service",
      });
      return;
    }

    if (dialogType !== 'manual' && !selectedFile) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please select a file to upload",
      });
      return;
    }

    // Show confirmation modal for both manual and file uploads
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setIsLoading(true);
    setShowConfirmation(false);
    try {
      if (dialogType === 'manual') {
        // Ensure all prices are unformatted before sending to backend
        const servicesWithUnformattedPrices = services.map(service => ({
          ...service,
          price: unformatAmount(service.price)
        }));

        const response = await fetch(`${process.env.REACT_APP_API_URL}/services/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            services: servicesWithUnformattedPrices
          })
        });
        const data = await response.json();
        
        if (!data.status) {
          throw new Error(data.message);
        }

        // Check if services were actually created
        if (!data.data?.services || data.data.services.length === 0) {
          throw new Error('No services were created');
        }
        
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: `Successfully added ${data.data.count} service(s)`,
        });
        
        handleNext();
        handleCloseDialog();
      } else if (selectedFile) {
        const status = await uploadServicesData(selectedFile, userId, role);
        if (status) {
          handleNext();
          handleCloseDialog();
        }
      }
    } catch (error) {
      setError(error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
      });
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  const renderManualUploadDialog = () => (
    <>
      <DialogTitle sx={{ 
        p: { xs: 1, sm: 2 },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        Add Services
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleCloseDialog}
          aria-label="close"
        >
        <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        p: { xs: 1, sm: 2 }
      }}>
        <TextField
          label="Service Name"
          value={newService.name}
          onChange={(e) => setNewService({...newService, name: e.target.value})}
          fullWidth
          required
        />
        <TextField
          label="Price"
          value={newService.price}
          onChange={(e) => {
            const formattedValue = formatAmount(e.target.value);
            setNewService({...newService, price: formattedValue});
          }}
          fullWidth
          required
          InputProps={{
            startAdornment: <span>$</span>
          }}
        />
        <TextField
          label="Description"
          value={newService.description}
          onChange={(e) => setNewService({...newService, description: e.target.value})}
          fullWidth
          multiline
          rows={2}
        />

        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          justifyContent: 'flex-end',
          mt: 2
        }}>
          <Button 
            onClick={handleAddService}
            variant="contained"
            color="primary"
          >
            {services.length > 0 ? 'Add Another Service' : 'Add Service'}
          </Button>
          
          {services.length > 0 && (
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="success"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Submit & Proceed'
              )}
            </Button>
          )}
        </Box>

        {services.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Added Services ({services.length})
            </Typography>
            {services.map((service, index) => (
              <Box 
                key={index}
                sx={{ 
                  p: 1, 
                  mb: 1, 
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  backgroundColor: '#f5f5f5'
                }}
              >
                <Typography variant="body1">
                  <strong>{service.name}</strong> - ${formatAmount(service.price)}
                </Typography>
                {service.description && (
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          Service added successfully!
        </Alert>
      </Snackbar>
    </>
  );

  // Add resize handler
  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    resizeTimeoutRef.current = setTimeout(() => {
      if (dialogRef.current) {
        dialogRef.current.style.height = 'auto';
      }
    }, 100);
  }, []);

  // Add resize listener
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [handleResize]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
      <Toast ref={toast} />
      <Typography variant="h6">Choose Upload Method</Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <StyledButton variant="contained" onClick={() => handleOpenDialog("csv")}>
          Upload from CSV
        </StyledButton>
        <StyledButton variant="contained" onClick={() => handleOpenDialog("excel")}>
          Upload from Excel
        </StyledButton>
        <StyledButton variant="contained" onClick={() => handleOpenDialog("manual")}>
          Enter manually
        </StyledButton>
      </Box>

      <Dialog 
        open={showDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        ref={dialogRef}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: { xs: '95%', sm: '600px', md: '800px' },
            margin: { xs: '10px', sm: '20px' },
            height: 'auto',
            maxHeight: isMobile ? '90vh' : '80vh',
            overflow: 'auto'
          }
        }}
      >
        <DialogContent 
          sx={{ 
            p: { xs: 2, sm: 3 },
            '&.MuiDialogContent-root': {
              paddingTop: { xs: 2, sm: 3 }
            },
            overflow: 'auto'
          }}
        >
          {dialogType === 'manual' ? (
            renderManualUploadDialog()
          ) : (
            <>
              <DialogTitle sx={{ 
                p: { xs: 1, sm: 2 },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                {dialogType === 'csv' ? 'CSV File Upload' : 'Excel File Upload'}
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleCloseDialog}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: 2, 
                alignItems: "flex-start", 
                backgroundColor: "#F5F5F5", 
                padding: { xs: "15px", sm: "20px" }, 
                borderRadius: "8px" 
              }}>
                <DescriptionText>
                  <InfoOutlined/> Please download the template below that shows how the file should be formatted before uploading
                </DescriptionText>
              </Box>

              <input
                type="file"
                accept={dialogType === "csv" ? ".csv" : ".xlsx,.xls"}
                onChange={(e) => handleFileUpload(e, dialogType)}
                style={{ display: "none" }}
                id={`${dialogType}-upload`}
              />

              <Box sx={{ 
                display: "flex", 
                flexDirection: { xs: "column", sm: "row" }, 
                gap: 2, 
                alignItems: { xs: "stretch", sm: "flex-start" }, 
                paddingY: "10px",
                width: '100%'
              }}>
                <StyledSecondaryButton
                  variant="outlined"
                  onClick={() => downloadTemplate(dialogType)}
                  fullWidth={true}
                  sx={{ 
                    width: { xs: '100%', sm: 'auto' },
                    minWidth: { xs: '100%', sm: '220px' },
                    whiteSpace: 'nowrap',
                    '& .MuiButton-label': {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    },
                    '& .MuiSvgIcon-root': {
                      marginRight: '8px'
                    }
                  }}
                >
                  <CloudDownloadOutlined/> Download Template
                </StyledSecondaryButton>

                <label htmlFor={`${dialogType}-upload`} style={{ width: '100%' }}>
                  <StyledButton
                    variant="contained"
                    component="span"
                    fullWidth={true}
                    sx={{ 
                      width: { xs: '100%', sm: 'auto' },
                      minWidth: { xs: '100%', sm: '220px' },
                      whiteSpace: 'nowrap',
                      '& .MuiButton-label': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      },
                      '& .MuiSvgIcon-root': {
                        marginRight: '8px'
                      }
                    }}
                  >
                    <CloudUploadOutlined/> Upload File
                  </StyledButton>
                </label>
              </Box>

              {selectedFile && (
                <Typography sx={{ 
                  mb: 2, 
                  fontSize: { xs: "13px", sm: "14px" }, 
                  fontWeight: "400", 
                  color: "#000000",
                  wordBreak: 'break-word'
                }}>
                  Selected file: {selectedFile.name}
                </Typography>
              )}

              {error && (
                <Typography sx={{ 
                  color: "error.main", 
                  mb: 2,
                  fontSize: { xs: "13px", sm: "14px" },
                  wordBreak: 'break-word'
                }}>
                  {error}
                </Typography>
              )}

              <Box sx={{ 
                display: "flex", 
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "flex-end", 
                gap: 2, 
                mt: 2,
                width: '100%'
              }}>
                <Button 
                  variant="outlined" 
                  onClick={handleCloseDialog} 
                  disabled={isLoading}
                  fullWidth={true}
                  sx={{ 
                    width: { xs: '100%', sm: 'auto' },
                    minWidth: { xs: '100%', sm: '120px' }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!selectedFile || isLoading}
                  fullWidth={true}
                  sx={{ 
                    width: { xs: '100%', sm: 'auto' },
                    minWidth: { xs: '100%', sm: '120px' }
                  }}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: { xs: '95%', sm: '400px' },
            margin: { xs: '10px', sm: '20px' },
            height: 'auto',
            maxHeight: isMobile ? '90vh' : '80vh',
            overflow: 'auto'
          }
        }}
      >
        <DialogContent 
          sx={{ 
            p: 3,
            overflow: 'auto'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Confirm Submission
          </Typography>
          
          <Typography sx={{ mb: 3, color: 'text.secondary' }}>
            Please confirm that you have added all your services. You will be taken to the next step after submission.
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            justifyContent: 'flex-end',
            flexWrap: 'wrap'
          }}>
            <Button
              onClick={() => setShowConfirmation(false)}
              variant="outlined"
              disabled={isLoading}
              fullWidth={isMobile}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              variant="contained"
              color="primary"
              disabled={isLoading}
              fullWidth={isMobile}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Submit'
              )}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

const StyledButton = styled(Button)({
  width: "100%",
  height: "48px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: "500",
});

const StyledSecondaryButton = styled(Button)({
  height: "48px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: "500",
});

const DescriptionText = styled(Typography)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  color: "#666",
});

export default VendorOnboardingStep1;

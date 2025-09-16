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
  AlertTitle,
  Snackbar,
  useMediaQuery,
  useTheme,
  LinearProgress,
  Stack,
  Chip,
} from "@mui/material";
import {
  PsychologyRounded,
} from "@mui/icons-material";
import { useState, useEffect, useRef, useCallback } from "react";
import csvTemplate from '../../../assets/vendor-onboarding-template.csv';
// import excelTemplate from '../../../assets/vendor-onboarding-template-old.xlsx';
import excelTemplate from '../../../assets/vendor_onboarding_template.xlsx';
import { Toast } from 'primereact/toast';
import { useUser } from '../../../context/userContext';
import * as XLSX from 'xlsx';
import { useParams, useLocation } from 'react-router-dom';
import { formatAmount, unformatAmount } from '../../../utils/formatAmount';

const aiGradient =
  "linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #06B6D4 100%)";
const aiGradientHover =
  "linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #0891B2 100%)";

const VendorOnboardingStep1 = ({ handleNext, userId, suppressAutoAdvance }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dialogRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  const { id: userIdFromParams } = useParams();
  const actualUserId = userId || userIdFromParams;
  const location = useLocation();
  const {
    uploadServicesData,
    verifyOnboardingStep1,
    parseServicesWithAI,
    importParsedServicesToNode
  } = useUser();
  const toast = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState(null); // string | { title?: string; bullets?: string[]; hint?: string; message?: string }
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
  const role = location.pathname.includes('/services/onboarding/') ? 'service_provider' : 'supplier';

  const requiredHeaders = ["service name", "service category", "description", "price"];

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

    // Set proper file extension and MIME type
    if (fileType === "excel") {
      link.download = "service-onboarding-template.xlsx";
      // Set the correct MIME type for modern Excel files
      link.type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    } else {
      link.download = "service-onboarding-template.csv";
      link.type = "text/csv";
    }

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
    if (suppressAutoAdvance) {
      return;
    }
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const verifyInventoryUpload = async () => {
      try {
        if (!actualUserId) {
          //console.error('Missing userId:', { actualUserId });
          return;
        }

        const data = await verifyOnboardingStep1(actualUserId, role);
        //console.log('Step 1 - Verification response:', data);

        if (data?.data?.length > 0) {
          handleNext();
        }
      } catch (error) {
        //console.error('Step 1 - Verification error:', error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error verifying services",
        });
      }
    };

    verifyInventoryUpload();
  }, [handleNext, verifyOnboardingStep1, actualUserId, role, suppressAutoAdvance]);

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
    setModalError(null);
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

    if (dialogType !== 'ai') {
      try {
        validateFile(file, dialogType);
      } catch (error) {
        setError(error.message);
        return;
      }
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
    } else if (dialogType === 'ai') {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit. Please choose a smaller file.");
        return;
      }
      setSelectedFile(file);
      setError(null);
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
            userId: actualUserId,
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
      } else if (selectedFile && dialogType === 'ai') {
        // AI flow: parse on Python, then import to Node
        const services = await parseServicesWithAI(selectedFile);
        const result = await importParsedServicesToNode({ userId: actualUserId, services });

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: result?.message || "Services parsed and imported successfully",
          life: 5000,
        });
        handleNext();
        handleCloseDialog();
      } else if (selectedFile) {
        const status = await uploadServicesData(selectedFile, actualUserId, role);
        if (status) {
          handleNext();
          handleCloseDialog();
        }
      }
    } catch (err) {
      // Enhanced error handling for AI responses (similar to supplier component)
      if (dialogType === 'ai') {
        // Prefer friendly AI errors if provided by backend
        const data = err?.response?.data || err?.data || err; // support various client libs
        const friendly = data?.friendly;
        if (
          friendly &&
          (friendly.title || friendly.message || friendly.bullets)
        ) {
          setModalError({
            title: friendly.title,
            message: friendly.message,
            bullets: friendly.bullets,
            hint: friendly.hint,
          });
        } else if (Array.isArray(data?.errors) && data.errors.length > 0) {
          // Fallback: build a compact human message from errors
          const missing = data.errors
            .filter((e) => e?.row == null && /required/i.test(String(e?.message)))
            .map((e) => String(e?.field || "field"));
          if (missing.length) {
            setModalError({
              title: "We couldn't find some required columns.",
              bullets: missing.map((f) => `- ${f}`),
              message: `Missing required columns: ${missing.join(", ")}`,
              hint: "Tip: Rename your headers to match our expected fields and re-upload.",
            });
          } else {
            setModalError(
              data?.message ||
              err?.message ||
              "An error occurred while uploading the file"
            );
          }
        } else {
          let errorMessage =
            err?.message || "An error occurred while uploading the file";
          if (
            typeof errorMessage === "string" &&
            errorMessage.includes("Row") &&
            errorMessage.includes(":")
          ) {
            errorMessage = `Validation Error: ${errorMessage}`;
          }
          setModalError(errorMessage);
        }
      } else {
        setError(err.message);
      }

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: typeof err === 'object' && err.message ? err.message : 'An error occurred',
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
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          fullWidth
          required
        />
        <TextField
          label="Price"
          value={newService.price}
          onChange={(e) => {
            const formattedValue = formatAmount(e.target.value);
            setNewService({ ...newService, price: formattedValue });
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
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
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

        <StyledButton
          variant="contained"
          onClick={() => handleOpenDialog("ai")}
        >
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 0.5,
            }}
          >
            <Typography variant="body2" sx={{ fontSize: "1.05rem", textShadow: "0 0 8px rgba(255,255,255,0.9), 0 0 14px rgba(99,102,241,0.5)" }} aria-label="sparkles">
              ✨
            </Typography>
            Upload with AI
          </Box>
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
            p: { xs: 0.8, sm: 1, md: 2, lg: 3 },
            '&.MuiDialogContent-root': {
              paddingTop: { xs: 0.8, sm: 1, md: 2, lg: 3 }
            },
            overflow: 'auto'
          }}
        >
          {dialogType === 'manual' ? (
            renderManualUploadDialog()
          ) : dialogType === 'ai' ? (
            <>
              {/* AI header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: { xs: 1.25, sm: 1.5 },
                  mb: 2,
                  borderRadius: 2,
                  background: aiGradient,
                  color: "#fff",
                  boxShadow: "0 10px 26px rgba(99,102,241,.35)",
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    bgcolor: "rgba(255,255,255,0.18)",
                  }}
                >
                  <PsychologyRounded fontSize="small" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      lineHeight: 1.15,
                      color: "#fff",
                      fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    }}
                  >
                    AI Service Parser
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.9, color: "rgba(255,255,255,0.92)" }}
                  >
                    <Box
                      component="span"
                      role="img"
                      aria-label="sparkles"
                      sx={{
                        mr: 0.75,
                        fontSize: "1.05rem",
                        textShadow:
                          "0 0 8px rgba(255,255,255,0.9), 0 0 14px rgba(99,102,241,0.5)",
                      }}
                    >
                      ✨
                    </Box>
                    Smart mapping, clean normalization
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  alignItems: "flex-start",
                  backgroundColor: "#F5F5F5",
                  padding: { xs: "15px", sm: "20px" },
                  borderRadius: "8px",
                }}
              >
                <DescriptionText>
                  <InfoOutlined /> Upload your service offerings spreadsheet and
                  let our intelligent AI system analyze, standardize and
                  seamlessly integrate your services into our platform.
                </DescriptionText>
              </Box>
              <input
                type="file"
                accept={".xlsx,.xls,.csv"}
                onChange={(e) => handleFileUpload(e, "ai")}
                style={{ display: "none" }}
                id={`ai-upload`}
              />
              <label htmlFor={`ai-upload`} style={{ width: "100%" }}>
                <Button
                  variant="contained"
                  component="span"
                  fullWidth={true}
                  startIcon={<CloudUploadOutlined />}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    minWidth: { xs: "100%", sm: "220px" },
                    textTransform: "none",
                    fontWeight: 700,
                    background: aiGradient,
                    boxShadow: "0 10px 26px rgba(99,102,241,.28)",
                    border: "1px solid rgba(255,255,255,.14)",
                    mt: 2,
                    "&:hover": {
                      background: aiGradientHover,
                      boxShadow: "0 8px 16px rgba(79,70,229,.24)",
                    },
                  }}
                >
                  Choose Excel File
                </Button>
              </label>
              {selectedFile && (
                <Typography sx={{ mt: 1 }}>
                  Selected: {selectedFile.name}
                </Typography>
              )}

              {isLoading && (
                <Box sx={{ mt: 3 }}>
                  <LinearProgress
                    sx={{
                      height: 8,
                      borderRadius: 8,
                      bgcolor: "rgba(99,102,241,.12)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 8,
                        background: aiGradient,
                      },
                    }}
                  />
                  <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
                    <Chip label="Understanding columns" size="small" />
                    <Chip label="Mapping schema" size="small" />
                  </Stack>
                </Box>
              )}

              {modalError &&
                (typeof modalError === "object" ? (
                  <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                    <AlertTitle>
                      {modalError.title || "We couldn't process that"}
                    </AlertTitle>
                    {/* If we have bullets, prefer showing only the list to avoid duplicating content contained in message */}
                    {!(
                      Array.isArray(modalError.bullets) &&
                      modalError.bullets.length > 0
                    ) &&
                      modalError.message && (
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "pre-wrap", mb: 1 }}
                        >
                          {modalError.message}
                        </Typography>
                      )}
                    {Array.isArray(modalError.bullets) &&
                      modalError.bullets.length > 0 && (
                        <Box
                          component="ul"
                          sx={{ pl: 2, mt: 0, mb: modalError.hint ? 1 : 0 }}
                        >
                          {modalError.bullets.map((b, i) => (
                            <li key={i}>
                              <Typography variant="body2">{b}</Typography>
                            </li>
                          ))}
                        </Box>
                      )}
                    {modalError.hint && (
                      <Typography variant="body2" color="text.secondary">
                        {modalError.hint}
                      </Typography>
                    )}
                  </Alert>
                ) : (
                  <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                    <AlertTitle>We couldn't process that</AlertTitle>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {modalError}
                    </Typography>
                  </Alert>
                ))}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 2,
                  width: "100%",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleCloseDialog}
                  disabled={isLoading}
                  fullWidth={true}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    minWidth: { xs: "100%", sm: "120px" },
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
                    width: { xs: "100%", sm: "auto" },
                    minWidth: { xs: "100%", sm: "120px" },
                    background: aiGradient,
                    boxShadow: "0 10px 26px rgba(99,102,241,.28)",
                    "&:hover": {
                      background: aiGradientHover,
                      boxShadow: "0 8px 16px rgba(79,70,229,.24)",
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Box>
            </>
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
                  <InfoOutlined /> It is important to download the template to see the required format. This ensures your data will be processed correctly.
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
                  <CloudDownloadOutlined /> Download Template
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
                    <CloudUploadOutlined /> Upload File
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

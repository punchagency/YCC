import { InfoOutlined, CloudDownloadOutlined, CloudUploadOutlined } from "@mui/icons-material";
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
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import csvTemplate from '../../../assets/vendor-onboarding-template.csv';
import excelTemplate from '../../../assets/vendor-onboarding-template.xlsx';
import { Toast } from 'primereact/toast';
import { useUser } from '../../../context/userContext';
import * as XLSX from 'xlsx';

const VendorOnboardingStep1 = ({ handleNext }) => {
  const { uploadServicesData, verifyOnboardingStep1, user } = useUser();
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
  
  const requiredHeaders = ["service name", "description", "price"];

  const validateFile = (file, type) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size should not exceed 5MB');
    }

    if (type === 'excel') {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload an Excel file (.xlsx or .xls)');
      }
    } else if (type === 'csv') {
      if (file.type !== 'text/csv') {
        throw new Error('Invalid file type. Please upload a CSV file');
      }
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
      const data = await verifyOnboardingStep1();
      if (data?.data?.length > 0) {
        handleNext();
      }
    };

    verifyInventoryUpload();
  }, [handleNext, verifyOnboardingStep1]);

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setDialogType(null);
    setSelectedFile(null);
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
    if (newService.name && newService.price) {
      setServices([...services, newService]);
      setNewService({ name: '', price: '', description: '' });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (selectedFile) {
        const status = await uploadServicesData(selectedFile, user.id);
        if (status) {
          handleNext();
          handleCloseDialog();
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: { xs: '95%', sm: '600px', md: '800px' },
            margin: { xs: '10px', sm: '20px' }
          }
        }}
      >
        <DialogContent sx={{ 
          p: { xs: 2, sm: 3 },
          '&.MuiDialogContent-root': {
            paddingTop: { xs: 2, sm: 3 }
          }
        }}>
          <DialogTitle sx={{ 
            p: { xs: 1, sm: 2 },
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}>
            {dialogType === "manual"
              ? "Enter manually"
              : `Upload ${dialogType?.toUpperCase()} File`}
          </DialogTitle>
          
          {(dialogType === "csv" || dialogType === "excel") && (
            <>
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

          {dialogType === "manual" && (
            <Box sx={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: 2,
              width: '100%'
            }}>
              <TextField
                fullWidth
                label="Service Name"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                margin="normal"
                required
                size="small"
              />
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                margin="normal"
                required
                size="small"
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                margin="normal"
                size="small"
              />
              <Button
                variant="contained"
                onClick={handleAddService}
                disabled={!newService.name || !newService.price}
                sx={{ 
                  alignSelf: 'flex-end',
                  minWidth: { xs: '100%', sm: '120px' }
                }}
              >
                Add Service
              </Button>
            </Box>
          )}
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

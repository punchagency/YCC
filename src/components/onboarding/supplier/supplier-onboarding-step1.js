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
import csvTemplate from '../../../assets/csv-template.csv';
import excelTemplate from '../../../assets/excel-template.xlsx';
import { Toast } from 'primereact/toast';
import { useUser } from '../../../context/userContext';
import * as XLSX from 'xlsx';

const SupplierOnboardingStep1 = ({ handleNext }) => {
  
  const { uploadInventoryData, verifyOnboardingStep1 } = useUser();
  const toast = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const hasRunRef = useRef(false);
  
  const requiredHeaders = ["product name"];

  const downloadTemplate = (fileType) => {
    const templateUrl = fileType === "csv" ? csvTemplate : excelTemplate;
  
    const link = document.createElement("a");
    link.href = templateUrl;
    link.download = `supplier_onboarding_template.${fileType}`;
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
    if (hasRunRef.current) return; // prevent second run
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
    setApiEndpoint("");
  };

  const validateExcelHeaders = (headers) => {
    const missing = requiredHeaders.filter(req => !headers.includes(req.toLowerCase()));
    if (missing.length > 0) {
      setError(`Missing required fields: ${missing.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleFileUpload = (e, dialogType) => {
    const file = e.target.files[0];
    if (!file) return;
  
    if (dialogType === 'csv') {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const text = event.target.result;
        const firstLine = text.split('\n')[0].trim();
        const headers = firstLine.split(',').map(h => h.trim().toLowerCase());
  
        const missing = requiredHeaders.filter(req => !headers.includes(req));
        if (missing.length > 0) {
          setError(`Missing required fields: ${missing.join(', ')}`);
          return;
        }
  
        setSelectedFile(file); // Valid file
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
            setError('Excel file is empty');
            return;
          }

          const headers = jsonData[0].map(header => header.toLowerCase());
          if (!validateExcelHeaders(headers)) {
            return;
          }

          setSelectedFile(file); // Valid file
        } catch (error) {
          setError('Error reading Excel file. Please ensure it is a valid Excel file.');
          console.error('Excel parsing error:', error);
        }
      };

      reader.onerror = () => {
        setError('Error reading file');
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (apiEndpoint) {
      console.log("Submitting API endpoint:", apiEndpoint);
    } else if (selectedFile) {
      console.log("Submitting file:", selectedFile);
      const status = await uploadInventoryData(selectedFile);
      if (status) {
        handleNext();
        handleCloseDialog();
      }
      setIsLoading(false);
      console.log("Upload status:", status);
    }
  };
  
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Toast ref={toast} />
      <Typography sx={{ fontWeight: "600", textAlign: "center" }} variant="h6">Choose Upload Method</Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <StyledButton variant="contained" onClick={() => handleOpenDialog("csv")}>
          Upload from CSV
        </StyledButton>
        <StyledButton variant="contained" onClick={() => handleOpenDialog("excel")}>
          Upload from Excel
        </StyledButton>
        <StyledButton variant="contained" disabled={true} onClick={() => handleOpenDialog("api")}>
          Enter API for bulk upload
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
            {dialogType === "api"
              ? "Enter API Endpoint"
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
                  onClick={() => downloadTemplate(dialogType === "csv" ? "csv" : "xlsx")}
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
            </>
          )}

          {dialogType === "api" && (
            <TextField
              fullWidth
              label="API Endpoint"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              margin="normal"
              placeholder="https://api.example.com/products"
              size="small"
            />
          )}

          <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
            {error && (
              <Typography sx={{ 
                color: "red",
                fontSize: { xs: "13px", sm: "14px" },
                wordBreak: 'break-word'
              }}>
                {error}
              </Typography>
            )}
          </Typography>

          <Box sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", sm: "row" },
            gap: 2, 
            justifyContent: "flex-end", 
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
              disabled={
                (dialogType === "api" && !apiEndpoint) ||
                (dialogType !== "api" && !selectedFile)
              }
              fullWidth={true}
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                minWidth: { xs: '100%', sm: '120px' }
              }}
            >
              {isLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : "Submit"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

const StyledButton = styled(Button)({
  backgroundColor: "#1976d2",
  color: "white",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
});

const StyledSecondaryButton = styled(Button)({
  borderColor: "#1976d2",
  color: "#1976d2",
  "&:hover": {
    borderColor: "#1565c0",
    backgroundColor: "rgba(25, 118, 210, 0.04)",
  },
});

const DescriptionText = styled(Typography)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  color: "#666",
});

export default SupplierOnboardingStep1;

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

const SupplierOnboardingStep1 = ({ handleNext }) => {
  
  const { uploadInventoryData, verifyOnboardingStep1 } = useUser();
  const toast = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMethod, setUploadMethod] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const hasRunRef = useRef(false);
  
  // Sample template structure - you can modify this based on your requirements
  const templateStructure = `
Required Fields:
- Product Name
- Product Description
- Product Price
- Product Image
- Product Stock
`;

  const requiredHeaders = ["product name"]//, "product description", "product price", "product image", "product stock"];

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
  }, []);


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
    } else {
      // Handle Excel separately
    }
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    if (uploadMethod === "api" && apiEndpoint) {
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
      <Typography variant="h6">Choose Upload Method</Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <StyledButton variant="contained" onClick={() => handleOpenDialog("csv")}>
          Upload from CSV
        </StyledButton>
        <StyledButton variant="contained" onClick={() => handleOpenDialog("excel")}>
          Upload from Excel
        </StyledButton>
        <StyledButton variant="contained" onClick={() => handleOpenDialog("api")}>
          Enter API for bulk upload
        </StyledButton>
      </Box>

      <Dialog open={showDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogType === "api"
            ? "Enter API Endpoint"
            : `Upload ${dialogType?.toUpperCase()} File`}
        </DialogTitle>
        <DialogContent>
          {(dialogType === "csv" || dialogType === "excel") && (
            <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-start", backgroundColor: "#F5F5F5", padding: "20px", borderRadius: "8px" }}>
              <DescriptionText><InfoOutlined/> Please download the template below that shows how the file should be formatted before uploading</DescriptionText>
            </Box>

                
              {/* Hidden File Input */}
              <input
                type="file"
                accept={dialogType === "csv" ? ".csv" : ".xlsx,.xls"}
                onChange={(e) => handleFileUpload(e, dialogType)}
                style={{ display: "none" }}
                id={`${dialogType}-upload`}
              />

              <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "flex-start", paddingY: "10px"}}>
            
              {/* Download Template */}
              <StyledSecondaryButton
                variant="outlined"
                onClick={() =>
                  downloadTemplate(dialogType === "csv" ? "csv" : "xlsx")
                }
              >
                <CloudDownloadOutlined/> &nbsp; Download Template
              </StyledSecondaryButton>
          

              {/* Button Labeling the Hidden Input */}
              <label htmlFor={`${dialogType}-upload`}>
                <StyledButton
                  variant="contained"
                  component="span"
                >
                  <CloudUploadOutlined/> &nbsp; Upload File
                </StyledButton>
              </label>

              </Box>
                   {/* Show Selected File */}
                   {selectedFile && (
                <Typography sx={{ mb: 2, fontSize: "14px", fontWeight: "400", color: "#000000" }}>
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
            />
          )}

          <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
            {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
          </Typography>

          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}
          >
            <Button variant="outlined" onClick={handleCloseDialog} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={
                (dialogType === "api" && !apiEndpoint) ||
                (dialogType !== "api" && !selectedFile)
              }
            >
              {isLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : "Submit"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};


const linearGradient = "linear-gradient(90deg, #034D92, #0487D9)";

const StyledButton = styled(Button)(() => ({
  position: "relative",
  border: "none",
  borderRadius: "8px",
  textTransform: "none",
  background: linearGradient, // Set gradient as background
  color: "white", // Ensure text is readable
  padding: "10px 20px",
  fontSize: "14px",
  fontWeight: "500",

  "&:hover": {
      opacity: 0.9, // Slight transparency effect on hover
  },
}));


const StyledSecondaryButton = styled(Button)(() => ({
  position: "relative",
  border: "none",
  borderRadius: "8px",
  textTransform: "none",
  background: "white",
  color: "#034D92",
  border: "1px solid #034D92",
  padding: "10px 20px",
  fontSize: "14px",
  fontWeight: "500",
  "&:hover": {
    background: "white",
    color: "#034D92",
  },
}));

const DescriptionText = styled(Typography)(() => ({
  fontSize: "14px",
  fontWeight: "400",
  color: "#000000",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "10px",
}));

export default SupplierOnboardingStep1;

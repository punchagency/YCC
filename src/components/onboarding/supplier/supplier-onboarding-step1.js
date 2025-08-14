import {
  InfoOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
} from "@mui/icons-material";
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
import csvTemplate from "../../../assets/csv-template.csv";
// import excelTemplate from '../../../assets/excel-template.xlsx';
import excelTemplate from "../../../assets/supplier_onboarding_template.xlsx";
import { Toast } from "primereact/toast";
import { useUser } from "../../../context/userContext";
import * as XLSX from "xlsx";
import { useParams, useLocation } from "react-router-dom";

const SupplierOnboardingStep1 = ({ handleNext, suppressAutoAdvance }) => {
  const { id: userId } = useParams();
  const location = useLocation();
  const { uploadInventoryData, verifyOnboardingStep1 } = useUser();
  const toast = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // const requiredHeaders = ["product name", "product category", "product description", "product price", "product stock level", "delivery region"];
  const requiredHeaders = ["product name"];

  // Determine role based on URL path - more explicit check
  const role = location.pathname.includes("/vendors/onboarding/")
    ? "supplier"
    : "service_provider";

  const downloadTemplate = (fileType) => {
    const templateUrl = fileType === "csv" ? csvTemplate : excelTemplate;

    const link = document.createElement("a");
    link.href = templateUrl;
    link.download = `vendor-onboarding-template.${fileType}`;
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
    const verifyInventoryUpload = async () => {
      if (!userId) {
        //console.log('Step 1 - No userId found in URL params');
        return;
      }

      // console.log('Step 1 - Verifying inventory for userId:', userId);
      // console.log('Step 1 - Current path:', location.pathname);

      try {
        const data = await verifyOnboardingStep1(userId, role);
        //console.log('Step 1 - Verification response:', data);

        if (data?.data?.length > 0) {
          //console.log('Step 1 - Inventory verified, moving to next step');
          handleNext();
        }
      } catch (error) {
        //console.error('Step 1 - Verification error:', error);
        setError("Error verifying inventory. Please try uploading again.");
      }
    };

    verifyInventoryUpload();
  }, [userId, location.pathname, handleNext, verifyOnboardingStep1, suppressAutoAdvance, role]);

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
    const missing = requiredHeaders.filter(
      (req) => !headers.includes(req.toLowerCase())
    );
    if (missing.length > 0) {
      setError(`Missing required fields: ${missing.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleFileUpload = (e, dialogType) => {
    const file = e.target.files[0];
    if (!file) return;

    // File size validation (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit. Please choose a smaller file.");
      return;
    }

    // File type validation
    const validTypes = {
      csv: ["text/csv", "application/vnd.ms-excel"],
      excel: [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ],
    };

    // Get file extension
    const extension = file.name.split(".").pop().toLowerCase();
    const validExtensions = {
      csv: ["csv"],
      excel: ["xlsx", "xls"],
    };

    // Check both MIME type and file extension
    if (
      !validTypes[dialogType].includes(file.type) &&
      !validExtensions[dialogType].includes(extension)
    ) {
      setError(
        `Invalid file type. Please upload a valid ${dialogType.toUpperCase()} file (${validExtensions[
          dialogType
        ].join(", ")}).`
      );
      return;
    }

    if (dialogType === "csv") {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const text = event.target.result;
          if (!text.trim()) {
            setError("The CSV file is empty.");
            return;
          }

          const lines = text.split("\n");
          if (lines.length < 2) {
            setError(
              "The CSV file must contain at least a header row and one data row."
            );
            return;
          }

          const firstLine = lines[0].trim();
          const headers = firstLine
            .split(",")
            .map((h) => h.trim().toLowerCase());

          const missing = requiredHeaders.filter(
            (req) => !headers.includes(req)
          );
          if (missing.length > 0) {
            setError(
              `Missing required fields: ${missing.join(
                ", "
              )}. Please ensure all required fields are present in the header row.`
            );
            return;
          }

          setSelectedFile(file);
          setError(null);
        } catch (error) {
          setError(
            "Error reading CSV file. Please ensure it is properly formatted."
          );
          //console.error('CSV parsing error:', error);
        }
      };

      reader.onerror = () => {
        setError("Error reading file. Please try again.");
      };

      reader.readAsText(file);
    } else if (dialogType === "excel") {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          if (!workbook.SheetNames.length) {
            setError("The Excel file contains no sheets.");
            return;
          }

          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

          if (jsonData.length === 0) {
            setError("The Excel file is empty.");
            return;
          }

          if (jsonData.length < 2) {
            setError(
              "The Excel file must contain at least a header row and one data row."
            );
            return;
          }

          const headers = jsonData[0].map((header) => header.toLowerCase());
          if (!validateExcelHeaders(headers)) {
            return;
          }

          setSelectedFile(file);
          setError(null);
        } catch (error) {
          setError(
            "Error reading Excel file. Please ensure it is properly formatted."
          );
          //console.error('Excel parsing error:', error);
        }
      };

      reader.onerror = () => {
        setError("Error reading file. Please try again.");
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (apiEndpoint) {
        //console.log("Submitting API endpoint:", apiEndpoint);
      } else if (selectedFile) {
        //console.log("Submitting file:", selectedFile);
        const result = await uploadInventoryData(selectedFile, userId);

        if (result.status) {
          // Show detailed success message with upload statistics
          let successMessage = "File uploaded successfully";

          if (result.data && result.data.inventoryDetails) {
            const details = result.data.inventoryDetails;
            successMessage = `Upload successful! ${details.totalProducts} products processed. ${details.newProductsCreated} new products created, ${details.existingProductsUpdated} existing products updated.`;
          }

          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: successMessage,
            life: 5000, // Show for 5 seconds to allow reading the details
          });
          handleNext();
          handleCloseDialog();
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail:
              result.message || "Failed to upload file. Please try again.",
          });
        }
      }
    } catch (err) {
      // Display detailed error messages from backend validation
      let errorMessage =
        err.message || "An error occurred while uploading the file";

      // Format validation errors to be more user-friendly
      if (errorMessage.includes("Row") && errorMessage.includes(":")) {
        // This is a validation error with row number
        errorMessage = `Validation Error: ${errorMessage}`;
      }

      toast.current.show({
        severity: "error",
        summary: "Upload Failed",
        detail: errorMessage,
        life: 8000, // Show longer for validation errors
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Toast ref={toast} />
      <Typography sx={{ fontWeight: "600", textAlign: "center" }} variant="h6">
        Choose Upload Method
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <StyledButton
          variant="contained"
          onClick={() => handleOpenDialog("csv")}
        >
          Upload from CSV
        </StyledButton>
        <StyledButton
          variant="contained"
          onClick={() => handleOpenDialog("excel")}
        >
          Upload from Excel
        </StyledButton>
        <StyledButton
          variant="contained"
          disabled={true}
          onClick={() => handleOpenDialog("api")}
        >
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
            width: "100%",
            maxWidth: { xs: "95%", sm: "600px", md: "800px" },
            margin: { xs: "10px", sm: "20px" },
          },
        }}
      >
        <DialogContent
          sx={{
            p: { xs: 2, sm: 3 },
            "&.MuiDialogContent-root": {
              paddingTop: { xs: 2, sm: 3 },
            },
          }}
        >
          <DialogTitle
            sx={{
              p: { xs: 1, sm: 2 },
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
          >
            {dialogType === "api"
              ? "Enter API Endpoint"
              : `Upload ${dialogType?.toUpperCase()} File`}
          </DialogTitle>

          {(dialogType === "csv" || dialogType === "excel") && (
            <>
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
                  <InfoOutlined /> It is important to download the template to
                  see the required format. This ensures your data will be
                  processed correctly.
                </DescriptionText>
              </Box>

              <input
                type="file"
                accept={dialogType === "csv" ? ".csv" : ".xlsx,.xls"}
                onChange={(e) => handleFileUpload(e, dialogType)}
                style={{ display: "none" }}
                id={`${dialogType}-upload`}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  alignItems: { xs: "stretch", sm: "flex-start" },
                  paddingY: "10px",
                  width: "100%",
                }}
              >
                <StyledSecondaryButton
                  variant="outlined"
                  onClick={() =>
                    downloadTemplate(dialogType === "csv" ? "csv" : "xlsx")
                  }
                  fullWidth={true}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    minWidth: { xs: "100%", sm: "220px" },
                    whiteSpace: "nowrap",
                    "& .MuiButton-label": {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    },
                    "& .MuiSvgIcon-root": {
                      marginRight: "8px",
                    },
                  }}
                >
                  <CloudDownloadOutlined /> Download Template
                </StyledSecondaryButton>

                <label
                  htmlFor={`${dialogType}-upload`}
                  style={{ width: "100%" }}
                >
                  <StyledButton
                    variant="contained"
                    component="span"
                    fullWidth={true}
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                      minWidth: { xs: "100%", sm: "220px" },
                      whiteSpace: "nowrap",
                      "& .MuiButton-label": {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      },
                      "& .MuiSvgIcon-root": {
                        marginRight: "8px",
                      },
                    }}
                  >
                    <CloudUploadOutlined /> Upload File
                  </StyledButton>
                </label>
              </Box>

              {selectedFile && (
                <Typography
                  sx={{
                    mb: 2,
                    fontSize: { xs: "13px", sm: "14px" },
                    fontWeight: "400",
                    color: "#000000",
                    wordBreak: "break-word",
                  }}
                >
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
              <Typography
                sx={{
                  color: "red",
                  fontSize: { xs: "13px", sm: "14px" },
                  wordBreak: "break-word",
                }}
              >
                {error}
              </Typography>
            )}
          </Typography>

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
              disabled={
                (dialogType === "api" && !apiEndpoint) ||
                (dialogType !== "api" && !selectedFile)
              }
              fullWidth={true}
              sx={{
                width: { xs: "100%", sm: "auto" },
                minWidth: { xs: "100%", sm: "120px" },
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Submit"
              )}
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

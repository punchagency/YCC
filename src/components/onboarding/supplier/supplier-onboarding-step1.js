import {
  InfoOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  AutoAwesomeRounded,
  PsychologyRounded,
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
  LinearProgress,
  Chip,
  Stack,
  Alert,
  AlertTitle,
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
  const {
    uploadInventoryData,
    verifyOnboardingStep1,
    parseInventoryWithAI,
    importParsedInventoryToNode,
  } = useUser();
  const toast = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState(null); // string | { title?: string; bullets?: string[]; hint?: string; message?: string }
  const [isLoading, setIsLoading] = useState(false);

  // Subtle AI gradient palette
  const aiGradient =
    "linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #06B6D4 100%)";
  const aiGradientHover =
    "linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #0891B2 100%)";

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
    setModalError(null);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setDialogType(null);
    setSelectedFile(null);
    setApiEndpoint("");
    setModalError(null);
  };

  const validateExcelHeaders = (headers) => {
    const missing = requiredHeaders.filter(
      (req) => !headers.includes(req.toLowerCase())
    );
    if (missing.length > 0) {
      setModalError(`Missing required fields: ${missing.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleFileUpload = (e, dialogType) => {
    const file = e.target.files[0];
    if (!file) return;

    // File size validation (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setModalError(
        "File size exceeds 5MB limit. Please choose a smaller file."
      );
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

    // Map AI flow to Excel validation rules
    const validationKey = dialogType === "ai" ? "excel" : dialogType;

    // Check both MIME type and file extension
    if (
      !validTypes[validationKey].includes(file.type) &&
      !validExtensions[validationKey].includes(extension)
    ) {
      setModalError(
        `Invalid file type. Please upload a valid ${validationKey.toUpperCase()} file (${validExtensions[
          validationKey
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
            setModalError("The CSV file is empty.");
            return;
          }

          const lines = text.split("\n");
          if (lines.length < 2) {
            setModalError(
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
            setModalError(
              `Missing required fields: ${missing.join(
                ", "
              )}. Please ensure all required fields are present in the header row.`
            );
            return;
          }

          setSelectedFile(file);
          setModalError(null);
        } catch (error) {
          setModalError(
            "Error reading CSV file. Please ensure it is properly formatted."
          );
          //console.error('CSV parsing error:', error);
        }
      };

      reader.onerror = () => {
        setModalError("Error reading file. Please try again.");
      };

      reader.readAsText(file);
    } else if (dialogType === "excel") {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          if (!workbook.SheetNames.length) {
            setModalError("The Excel file contains no sheets.");
            return;
          }

          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

          if (jsonData.length === 0) {
            setModalError("The Excel file is empty.");
            return;
          }

          if (jsonData.length < 2) {
            setModalError(
              "The Excel file must contain at least a header row and one data row."
            );
            return;
          }

          const headers = jsonData[0].map((header) => header.toLowerCase());
          if (!validateExcelHeaders(headers)) {
            return;
          }

          setSelectedFile(file);
          setModalError(null);
        } catch (error) {
          setModalError(
            "Error reading Excel file. Please ensure it is properly formatted."
          );
          //console.error('Excel parsing error:', error);
        }
      };

      reader.onerror = () => {
        setModalError("Error reading file. Please try again.");
      };

      reader.readAsArrayBuffer(file);
    } else if (dialogType === "ai") {
      // AI path: accept Excel file and let server perform all parsing/validation
      setSelectedFile(file);
      setModalError(null);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (apiEndpoint) {
        //console.log("Submitting API endpoint:", apiEndpoint);
      } else if (selectedFile && dialogType === "excel") {
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
          setModalError(
            result.message || "Failed to upload file. Please try again."
          );
        }
      } else if (selectedFile && dialogType === "csv") {
        // Submit CSV using the same backend endpoint as Excel
        const result = await uploadInventoryData(selectedFile, userId);

        if (result.status) {
          let successMessage = "File uploaded successfully";
          if (result.data && result.data.inventoryDetails) {
            const details = result.data.inventoryDetails;
            successMessage = `Upload successful! ${details.totalProducts} products processed. ${details.newProductsCreated} new products created, ${details.existingProductsUpdated} existing products updated.`;
          }

          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: successMessage,
            life: 5000,
          });
          handleNext();
          handleCloseDialog();
        } else {
          setModalError(
            result.message || "Failed to upload file. Please try again."
          );
        }
      } else if (selectedFile && dialogType === "ai") {
        // AI flow: parse on Python, then import to Node
        const products = await parseInventoryWithAI(selectedFile);
        const result = await importParsedInventoryToNode({ userId, products });

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail:
            result?.message || "Inventory parsed and imported successfully",
          life: 5000,
        });
        handleNext();
        handleCloseDialog();
      }
    } catch (err) {
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
            <AutoAwesomeRounded fontSize="small" />
            <span role="img" aria-label="sparkles">
              ✨
            </span>
            Upload with AI
          </Box>
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
            ...(dialogType === "ai"
              ? {
                  border: "1px solid rgba(99,102,241,.25)",
                  boxShadow: "0 20px 50px rgba(79,70,229,.18)",
                }
              : {}),
          },
        }}
      >
        <DialogContent
          sx={{
            p: { xs: 3, sm: 4 },
            pt: { xs: 3.5, sm: 5 },
            pb: { xs: 3.5, sm: 5 },
            "&.MuiDialogContent-root": {
              paddingTop: { xs: 3.5, sm: 6 },
              paddingBottom: { xs: 3.5, sm: 6 },
            },
          }}
        >
          {dialogType !== "ai" && (
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
          )}

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

          {dialogType === "ai" && (
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
                    AI Inventory Parser
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
                  <InfoOutlined /> Upload your product inventory spreadsheet and
                  let our intelligent AI system analyze, standardize and
                  seamlessly integrate your catalog into our platform.
                </DescriptionText>
              </Box>
              <input
                type="file"
                accept={".xlsx,.xls"}
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
            </>
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

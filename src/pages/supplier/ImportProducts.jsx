import React from 'react'
import { useOutletContext } from "react-router-dom";
import { InfoOutlined, CloudDownloadOutlined, CloudUploadOutlined, Close as CloseIcon } from "@mui/icons-material";
import {
    Box,
    Button,
    Typography,
    Dialog,
    DialogContent,
    DialogTitle,
    CircularProgress,
    styled,
    IconButton,
    Alert,
    AlertTitle,
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
import csvTemplate from '../../assets/csv-template.csv';
import excelTemplate from '../../assets/supplier_onboarding_template.xlsx';
import { Toast } from 'primereact/toast';
import { useUser } from '../../context/userContext';
import * as XLSX from 'xlsx';
import { useParams, useNavigate } from 'react-router-dom';

const aiGradient =
    "linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #06B6D4 100%)";
const aiGradientHover =
    "linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #0891B2 100%)";

const ImportProducts = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const dialogRef = useRef(null);
    const resizeTimeoutRef = useRef(null);
    const { id: userId } = useParams();
    const navigate = useNavigate();
    const {
        uploadInventoryData,
        parseInventoryWithAI,
        importParsedInventoryToNode
    } = useUser();
    const toast = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogType, setDialogType] = useState(null);
    const [error, setError] = useState(null);
    const [modalError, setModalError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { setPageTitle } = useOutletContext() || {};

    const requiredHeaders = ["product name"];

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
            link.download = "product-inventory-template.xlsx";
            // Set the correct MIME type for modern Excel files
            link.type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        } else {
            link.download = "product-inventory-template.csv";
            link.type = "text/csv";
        }

        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const validateHeaders = (headers) => {
        const missing = requiredHeaders.filter(req => !headers.includes(req.toLowerCase()));
        if (missing.length > 0) {
            throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }
        return true;
    };

    const handleOpenDialog = (type) => {
        setDialogType(type);
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setDialogType(null);
        setSelectedFile(null);
        setModalError(null);
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
                    if (!text.trim()) {
                        setError('The CSV file is empty.');
                        return;
                    }

                    const lines = text.split('\n');
                    if (lines.length < 2) {
                        setError('The CSV file must contain at least a header row and one data row.');
                        return;
                    }

                    const firstLine = lines[0].trim();
                    const headers = firstLine.split(',').map(h => h.trim().toLowerCase());
                    validateHeaders(headers);
                    setSelectedFile(file);
                    setError(null);
                } catch (error) {
                    setError(error.message);
                }
            };
            reader.onerror = () => {
                setError('Error reading file. Please try again.');
            };
            reader.readAsText(file);
        } else if (dialogType === 'excel') {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });

                    if (!workbook.SheetNames.length) {
                        setError('The Excel file contains no sheets.');
                        return;
                    }

                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                    if (jsonData.length === 0) {
                        setError('The Excel file is empty.');
                        return;
                    }

                    if (jsonData.length < 2) {
                        setError('The Excel file must contain at least a header row and one data row.');
                        return;
                    }

                    const headers = jsonData[0].map(header => header.toLowerCase());
                    validateHeaders(headers);
                    setSelectedFile(file);
                    setError(null);
                } catch (error) {
                    setError(error.message);
                }
            };
            reader.onerror = () => {
                setError('Error reading file. Please try again.');
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

    const handleSubmit = async () => {
        if (!selectedFile) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please select a file to upload",
            });
            return;
        }

        // Show confirmation modal for file uploads
        setShowConfirmation(true);
    };

    const handleConfirmSubmit = async () => {
        setIsLoading(true);
        setShowConfirmation(false);
        try {
            if (selectedFile && dialogType === 'ai') {
                // AI flow: parse on Python, then import to Node
                const products = await parseInventoryWithAI(selectedFile);
                const result = await importParsedInventoryToNode({ userId, products });

                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: result?.message || "Products parsed and imported successfully",
                    life: 5000,
                });

                // Navigate to supplier inventory page after success
                setTimeout(() => {
                    navigate('/supplier/inventory');
                }, 2000);

                handleCloseDialog();
            } else if (selectedFile) {
                const result = await uploadInventoryData(selectedFile, userId);
                if (result.status) {
                    // Show detailed success message with upload statistics
                    let successMessage = "Products uploaded successfully";

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

                    // Navigate to supplier inventory page after success
                    setTimeout(() => {
                        navigate('/supplier/inventory');
                    }, 2000);

                    handleCloseDialog();
                } else {
                    setModalError(result.message || 'Failed to upload file. Please try again.');
                }
            }
        } catch (err) {
            // Enhanced error handling for AI responses
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

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(null);
            }, 5000);
        }
    }, [error]);

    React.useEffect(() => {
        if (setPageTitle) setPageTitle("Import Products");
    }, [setPageTitle]);

    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            p: 3,
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <Toast ref={toast} />

            {/* Page Header */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Import Products
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Choose your preferred method to import your product inventory
                </Typography>
            </Box>

            {/* Upload Options */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <StyledButton variant="contained" onClick={() => handleOpenDialog("csv")}>
                    Upload from CSV
                </StyledButton>
                <StyledButton variant="contained" onClick={() => handleOpenDialog("excel")}>
                    Upload from Excel
                </StyledButton>

                <StyledButton
                    variant="contained"
                    onClick={() => handleOpenDialog("ai")}
                    sx={{
                        background: aiGradient,
                        boxShadow: "0 10px 26px rgba(99,102,241,.28)",
                        "&:hover": {
                            background: aiGradientHover,
                            boxShadow: "0 8px 16px rgba(79,70,229,.24)",
                        },
                    }}
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

            {/* Upload Dialog */}
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
                    {dialogType === 'ai' ? (
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
                                        AI Product Parser
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
                                <IconButton
                                    edge="end"
                                    color="inherit"
                                    onClick={handleCloseDialog}
                                    aria-label="close"
                                    sx={{ color: 'white' }}
                                >
                                    <CloseIcon />
                                </IconButton>
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
                                    Selected: <span style={{ fontWeight: "semibold" }}>{selectedFile.name}</span>
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
                                    onClick={() => downloadTemplate(dialogType === "csv" ? "csv" : "excel")}
                                    fullWidth={true}
                                    sx={{
                                        width: { xs: '100%', sm: 'auto' },
                                        minWidth: { xs: '100%', sm: '220px' },
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <CloudDownloadOutlined sx={{ mr: 1 }} /> Download Template
                                </StyledSecondaryButton>

                                <label htmlFor={`${dialogType}-upload`} style={{ width: '100%' }}>
                                    <StyledButton
                                        variant="contained"
                                        component="span"
                                        fullWidth={true}
                                        sx={{
                                            width: { xs: '100%', sm: 'auto' },
                                            minWidth: { xs: '100%', sm: '220px' },
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        <CloudUploadOutlined sx={{ mr: 1 }} /> Upload File
                                    </StyledButton>
                                </label>
                            </Box>

                            {selectedFile && (
                                <Typography sx={{
                                    mb: 2,
                                    fontSize: { xs: "13px", sm: "14px" },
                                    fontWeight: "500",
                                    color: "#000000",
                                    wordBreak: 'break-word'
                                }}>
                                    Selected file: <span style={{ fontWeight: "semibold" }}>{selectedFile.name}</span>
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
                        Please confirm that you want to import these products. You will be redirected to the inventory management page after successful import.
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
                                'Import Products'
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

export default ImportProducts;

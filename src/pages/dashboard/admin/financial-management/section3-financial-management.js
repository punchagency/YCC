import {
  Box,
  Typography,
  // styled,
  Button,
    // Checkbox,
    // CircularProgress,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import downloadIcon from "../../../../assets/images/icons/financial-management/download-icon.png";
import FilterListIcon from "@mui/icons-material/FilterList";
import Pagination from "./pagination";
import { useTheme } from "../../../../context/theme/themeContext";
import ReportIcon from '@mui/icons-material/Report';

// Mobile Transaction Card Component
const MobileTransactionCard = ({ row, theme }) => {
  return (
    <Box
      sx={{
        backgroundColor: theme === "light" ? "#FFFFFF" : "#7F7F7F",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "10px",
        boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "14px",
            color: theme === "light" ? "#212121" : "white",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {row.transaction}
          <FileCopyOutlinedIcon
            sx={{
              fontSize: "14px",
              color: "#6E7079",
              cursor: "pointer",
            }}
          />
        </Typography>
        <Box
          sx={{
            backgroundColor: getStatusColor(row.status).backgroundColor,
            color: getStatusColor(row.status).color,
            borderRadius: "6px",
            padding: "3px 8px",
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          {row.status}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <Typography
          sx={{
            fontSize: "13px",
            color: theme === "light" ? "#6E7079" : "white",
          }}
        >
          Amount:
        </Typography>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "13px",
            color: theme === "light" ? "#212121" : "white",
          }}
        >
          ${row.amount}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <Button
          sx={{
            borderRadius: "5px",
            padding: "4px 8px",
            backgroundColor: theme === "light" ? "#FFFFFF" : "#7F7F7F",
            color: theme === "light" ? "#495057" : "white",
            border: "0.87px solid #E5E7EB",
            textTransform: "none",
            fontSize: "12px",
            minWidth: "auto",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
          onClick={() => {
            const link = document.createElement('a');
            link.href = row.invoicePdfUrl;
            link.download = `invoice-${row.transaction}.pdf`; // Set desired filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          disabled={!row.invoicePdfUrl}
        >
         {row.invoicePdfUrl? (
          <img
            src={downloadIcon}
            alt="download"
            style={{ width: "14px", height: "14px" }}
          />
        ) : (
          <ReportIcon
            sx={{ fontSize: "14px", color: "#6E7079" }}
          />
        )}
        </Button>
        <Button
          sx={{
            borderRadius: "5px",
            padding: "4px 8px",
            backgroundColor: theme === "light" ? "#FFFFFF" : "#7F7F7F",
            color: theme === "light" ? "#495057" : "white",
            border: "0.87px solid #E5E7EB",
            textTransform: "none",
            fontSize: "12px",
          }}
          onClick={() => {
            window.open(row.invoiceUrl, "_blank");
          }}
          disabled={!row.invoiceUrl}
        >
          {row.invoiceUrl ? "Pay Now" : "No Invoice"}
        </Button>
      </Box>
    </Box>
  );
};

// Helper function to get status colors
const getStatusColor = (status) => {
  const statusColors = {
    completed: { backgroundColor: "#E2F9F0", color: "#1A9E6D" },
    failed: { backgroundColor: "#FFE2E2", color: "#D32F2F" },
    pending: { backgroundColor: "#FFF3E4", color: "#896942" },
  };
  return (
    statusColors[status.toLowerCase()] || {
      backgroundColor: "#E2F9F0",
      color: "#1A9E6D",
    }
  );
};

const Section3FinancialManagement = ({
  transactions,
  loading,
  page,
  limit,
  setPage,
  setLimit,
  totalPages,
  totalItems,
}) => {
  const { theme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("sm", "md"));

  function createData(transaction, status, amount, invoicePdfUrl, invoiceUrl) {
    return { transaction, status, amount, invoicePdfUrl, invoiceUrl };
  }

  const rows = useMemo(() => {
    return transactions.map((transaction) =>
      createData(
        transaction.transactionId,
        transaction.transactionStatus,
        transaction.transactionAmount,
        transaction.invoicePdfUrl || null,
        transaction.invoiceUrl || null
      )
    );
  }, [transactions]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "15px" : "20px",
          height: isMobile ? "300px" : "400px",
          width: "100%",
          padding: isMobile ? "10px" : isTablet ? "15px" : "20px",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 600,
            fontSize: isMobile ? "14px" : "16px",
            lineHeight: "111%",
            letterSpacing: "0%",
            color: theme === "light" ? "#212121" : "white",
          }}
        >
          Customer Orders
        </Typography>
        {/* Skeleton for loading table rows */}
        <Skeleton variant="rectangular" height={isMobile ? 35 : 45} />
        <Skeleton variant="rectangular" height={isMobile ? 35 : 45} />
        <Skeleton variant="rectangular" height={isMobile ? 35 : 45} />
        <Skeleton variant="rectangular" height={isMobile ? 35 : 45} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: isMobile ? "10px" : isTablet ? "15px" : "20px",
      }}
    >
      <Box>
        <Typography
          sx={{
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 600,
            fontSize: isMobile ? "14px" : "16px",
            lineHeight: "111%",
            letterSpacing: "0%",
            color: theme === "light" ? "#212121" : "white",
            marginBottom: isMobile ? "10px" : "0",
          }}
        >
          Customer Orders
        </Typography>

        {/* Mobile View */}
        {isMobile && (
          <Box sx={{ marginTop: "10px" }}>
            {rows.map((row, index) => (
              <MobileTransactionCard key={index} row={row} theme={theme} />
            ))}

            {/* Mobile Pagination */}
            <Box sx={{ marginTop: "15px" }}>
              <Pagination
                totalPages={totalPages}
                totalItems={totalItems}
                currentPage={page}
                itemsPerPage={limit}
                onPageChange={setPage}
                onItemsPerPageChange={setLimit}
                isMobile={isMobile}
              />
            </Box>
          </Box>
        )}

        {/* Desktop/Tablet View */}
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              height: "100%",
              width: "100%",
              alignItems: "center",
            }}
          >
            <TableContainer component={Paper}>
              <Table
                aria-label="customized table"
                size={isTablet ? "small" : "medium"}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor:
                          theme === "light" ? "#F9F9FA" : "#7F7F7F",
                        color: theme === "light" ? "#212121" : "white",
                        fontSize: isTablet ? "13px" : "14px",
                        padding: isTablet ? "8px 16px" : "10px 32px",
                        "&:first-of-type": {
                          width: "20px",
                          padding: "0px",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Plus Jakarta Sans",
                          fontWeight: 500,
                          fontSize: isTablet ? "13px" : "16px",
                          lineHeight: "24px",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          textAlign: "center",
                          color: theme === "light" ? "#212121" : "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "7px",
                        }}
                      >
                        {/* <Checkbox 
                          sx={{
                            color: theme === "light" ? "#6E7079" : "white",
                            borderRadius: "15px",
                            "&.Mui-checked": {
                              color: "#0387D9",
                            },
                          }}
                        /> */}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor:
                          theme === "light" ? "#F9F9FA" : "#7F7F7F",
                        color: theme === "light" ? "#212121" : "white",
                        fontSize: isTablet ? "13px" : "14px",
                        padding: isTablet ? "8px 16px" : "10px 32px",
                        "&:nth-of-type(2)": {
                          padding: "0px",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Plus Jakarta Sans",
                          fontWeight: 500,
                          fontSize: isTablet ? "13px" : "16px",
                          lineHeight: "24px",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          textAlign: "center",
                          color: theme === "light" ? "#212121" : "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "7px",
                        }}
                      >
                        Transaction{" "}
                        <FilterListIcon
                          sx={{
                            fontSize: isTablet ? "14px" : "17px",
                            color: theme === "light" ? "#6E7079" : "white",
                          }}
                        />
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor:
                          theme === "light" ? "#F9F9FA" : "#7F7F7F",
                        color: theme === "light" ? "#212121" : "white",
                        fontSize: isTablet ? "13px" : "14px",
                        padding: isTablet ? "8px 16px" : "10px 32px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Plus Jakarta Sans",
                          fontWeight: 500,
                          fontSize: isTablet ? "13px" : "16px",
                          lineHeight: "24px",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          textAlign: "center",
                          color: theme === "light" ? "#212121" : "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "7px",
                        }}
                      >
                        Status{" "}
                        <FilterListIcon
                          sx={{
                            fontSize: isTablet ? "14px" : "17px",
                            color: theme === "light" ? "#6E7079" : "white",
                          }}
                        />
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor:
                          theme === "light" ? "#F9F9FA" : "#7F7F7F",
                        color: theme === "light" ? "#212121" : "white",
                        fontSize: isTablet ? "13px" : "14px",
                        padding: isTablet ? "8px 16px" : "10px 32px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Plus Jakarta Sans",
                          fontWeight: 500,
                          fontSize: isTablet ? "13px" : "16px",
                          lineHeight: "24px",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          textAlign: "center",
                          color: theme === "light" ? "#212121" : "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "7px",
                        }}
                      >
                        Amount{" "}
                        <FilterListIcon
                          sx={{
                            fontSize: isTablet ? "14px" : "17px",
                            color: theme === "light" ? "#6E7079" : "white",
                          }}
                        />
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor:
                          theme === "light" ? "#F9F9FA" : "#7F7F7F",
                        color: theme === "light" ? "#212121" : "white",
                        fontSize: isTablet ? "13px" : "14px",
                        padding: isTablet ? "8px 16px" : "10px 32px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Plus Jakarta Sans",
                          fontWeight: 500,
                          fontSize: isTablet ? "13px" : "16px",
                          lineHeight: "24px",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          textAlign: "center",
                          color: theme === "light" ? "#212121" : "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "7px",
                        }}
                      >
                        Actions{" "}
                        <FilterListIcon
                          sx={{
                            fontSize: isTablet ? "14px" : "17px",
                            color: theme === "light" ? "#6E7079" : "white",
                          }}
                        />
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.transaction}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                        "&:nth-of-type(even)": {
                          backgroundColor: "#F9F9FA",
                        },
                      }}
                    >
                      <TableCell
                        align="right"
                        sx={{
                          backgroundColor:
                            theme === "light" ? "#FFFFFF" : "#7F7F7F",
                          fontSize: isTablet ? "13px" : "14px",
                          padding: "0px",
                          "&:first-child": {
                            width: "20px",
                            padding: "0px",
                            backgroundColor:
                              theme === "light" ? "#FFFFFF" : "#7F7F7F",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "Plus Jakarta Sans",
                            fontWeight: 400,
                            fontSize: isTablet ? "12px" : "14px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: theme === "light" ? "#6E7079" : "white",
                            padding: "10px 10px",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          {/* <Checkbox 
                            sx={{
                              color: theme === "light" ? "#6E7079" : "white",
                              borderRadius: "15px",
                              "&.Mui-checked": {
                                color: "#0387D9",
                              },
                            }}
                          /> */}
                        </Typography>
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          backgroundColor:
                            theme === "light" ? "#FFFFFF" : "#7F7F7F",
                          fontSize: isTablet ? "13px" : "14px",
                          padding: "0px",
                          "&:nth-child(2)": {
                            padding: "0px",
                            backgroundColor:
                              theme === "light" ? "#FFFFFF" : "#7F7F7F",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "Plus Jakarta Sans",
                            fontWeight: 400,
                            fontSize: isTablet ? "12px" : "14px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: theme === "light" ? "#6E7079" : "white",
                            padding: "10px 10px",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            paddingRight: "5px",
                          }}
                        >
                          {row.transaction}&nbsp;&nbsp;
                          <FileCopyOutlinedIcon
                            sx={{
                              fontSize: isTablet ? "14px" : "16px",
                              color: "#6E7079",
                              cursor: "pointer",
                            }}
                          />
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          backgroundColor:
                            theme === "light" ? "#FFFFFF" : "#7F7F7F",
                          fontSize: isTablet ? "13px" : "14px",
                          padding: "0px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "Plus Jakarta Sans",
                            fontWeight: 400,
                            fontSize: isTablet ? "12px" : "14px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: theme === "light" ? "#6E7079" : "white",
                            padding: "10px 10px",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              backgroundColor: getStatusColor(row.status)
                                .backgroundColor,
                              color: getStatusColor(row.status).color,
                              borderRadius: "6px",
                              padding: isTablet ? "3px 8px" : "4px 11px",
                              width: isTablet ? "80px" : "100px",
                              textAlign: "center",
                              fontSize: isTablet ? "11px" : "inherit",
                            }}
                          >
                            {row.status}
                          </Box>
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          backgroundColor:
                            theme === "light" ? "#FFFFFF" : "#7F7F7F",
                          fontSize: isTablet ? "13px" : "14px",
                          padding: "0px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "Plus Jakarta Sans",
                            fontWeight: 400,
                            fontSize: isTablet ? "12px" : "14px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: theme === "light" ? "#6E7079" : "white",
                            padding: "10px 10px",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          ${row.amount}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          backgroundColor:
                            theme === "light" ? "#FFFFFF" : "#7F7F7F",
                          fontSize: isTablet ? "13px" : "14px",
                          padding: "0px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "Plus Jakarta Sans",
                            fontWeight: 400,
                            fontSize: isTablet ? "12px" : "14px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: theme === "light" ? "#6E7079" : "white",
                            padding: "10px 10px",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              gap: isTablet ? "5px" : "9px",
                            }}
                          >
                            <Button
                              sx={{
                                borderRadius: "5.21px",
                                borderWidth: "0.87px",
                                paddingRight: isTablet ? "8px" : "10px",
                                paddingLeft: isTablet ? "8px" : "10px",
                                backgroundColor:
                                  theme === "light" ? "#FFFFFF" : "#7F7F7F",
                                color: theme === "light" ? "#495057" : "white",
                                padding: isTablet ? "4px" : "5px 5px",
                                border: "0.87px solid #E5E7EB",
                                textTransform: "none",
                                minWidth: "auto",
                              }}
                            >
                              {row.invoicePdfUrl? (
                                <img
                                  src={downloadIcon}
                                  alt="download"
                                style={{
                                  display: "block",
                                  width: isTablet ? "14px" : "auto",
                                }}
                                disabled={!row.invoicePdfUrl}
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = row.invoicePdfUrl;
                                  link.download = `invoice-${row.transaction}.pdf`; // Set desired filename
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                }}
                              />
                              ) : (
                                <ReportIcon
                                  sx={{
                                    fontSize: isTablet ? "14px" : "16px",
                                    color: "#6E7079",
                                  }}
                                />
                              )}
                            </Button>
                            <Button
                              onClick={() => {
                                window.open(row.invoiceUrl, "_blank");
                              }}
                              disabled={!row.invoiceUrl}
                              sx={{
                                borderRadius: "5.21px",
                                borderWidth: "0.87px",
                                paddingRight: isTablet ? "8px" : "10px",
                                paddingLeft: isTablet ? "8px" : "10px",
                                backgroundColor:
                                  theme === "light" ? "#FFFFFF" : "#7F7F7F",
                                color: theme === "light" ? "#495057" : "white",
                                padding: isTablet ? "4px" : "5px 5px",
                                border: "0.87px solid #E5E7EB",
                                textTransform: "none",
                                fontSize: isTablet ? "11px" : "inherit",
                                
                              }}
                              
                            >
                              {row.invoiceUrl? (
                                "Pay Now"
                              ) : (
                                "No Invoice"
                              )}
                            </Button>
                          </Box>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* pagination: this row should be the last row*/}
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="right"
                      sx={{
                        backgroundColor:
                          theme === "light" ? "#FFFFFF" : "#7F7F7F",
                      }}
                    >
                      <Pagination
                        totalPages={totalPages}
                        totalItems={totalItems}
                        currentPage={page}
                        itemsPerPage={limit}
                        onPageChange={setPage}
                        onItemsPerPageChange={setLimit}
                        isMobile={isMobile}
                        isTablet={isTablet}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Section3FinancialManagement;

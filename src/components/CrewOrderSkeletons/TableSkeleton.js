import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Skeleton } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme as useMuiTheme } from "@mui/material/styles";

const OrderTableSkeleton = () => {
  const muiTheme = useMuiTheme();
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("sm", "md"));

  // Table columns matching the actual table
  const columns = [
    { id: "orderId", label: "Order ID", minWidth: 120 },
    { id: "totalPrice", label: "Total Price", minWidth: 120 },
    { id: "overallStatus", label: "Overall Status", minWidth: 140 },
    { id: "orderDate", label: "Order Date", minWidth: 140 },
    { id: "actions", label: "Actions", minWidth: 100 },
  ];

  // Generate skeleton rows
  const skeletonRows = Array.from({ length: 5 }, (_, index) => index);

  return (
    <Box sx={{ width: "100%", bgcolor: "#F8FBFF", borderRadius: 2 }}>
      <Paper sx={{ width: "100%", overflow: "auto", borderRadius: 2, boxShadow: 1 }}>
        <TableContainer>
          <Table stickyHeader aria-label="orders table skeleton">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.id === "actions" ? "right" : "left"}
                    sx={{
                      minWidth: column.minWidth,
                      backgroundColor: "#F9FAFB",
                      color: "#344054",
                      fontWeight: 600,
                      fontSize: isTablet ? 12 : 14,
                      borderBottom: "1px solid #EAECF0",
                      padding: isTablet ? "10px 16px" : "12px 24px",
                      letterSpacing: 0.1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {column.label}
                      {["orderId", "totalPrice", "overallStatus", "orderDate"].includes(column.id) && (
                        <Skeleton 
                          variant="rectangular" 
                          width={16} 
                          height={16} 
                          sx={{ ml: 1, bgcolor: "#E5E7EB" }} 
                        />
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {skeletonRows.map((rowIndex) => (
                <TableRow key={rowIndex} sx={{ backgroundColor: "#fff" }}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.id === "actions" ? "right" : "left"}
                      sx={{
                        minWidth: column.minWidth,
                        color: "#344054",
                        fontWeight: 500,
                        fontSize: isTablet ? 13 : 15,
                        borderBottom: "1px solid #EAECF0",
                        padding: isTablet ? "10px 16px" : "12px 24px",
                        backgroundColor: '#fff',
                      }}
                    >
                      {column.id === "overallStatus" ? (
                        <Skeleton 
                          variant="rectangular" 
                          width={80} 
                          height={24} 
                          sx={{ borderRadius: "16px", bgcolor: "#E5E7EB" }} 
                        />
                      ) : column.id === "actions" ? (
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                          <Skeleton 
                            variant="rectangular" 
                            width={32} 
                            height={32} 
                            sx={{ borderRadius: "8px", bgcolor: "#E5E7EB" }} 
                          />
                        </Box>
                      ) : (
                        <Skeleton 
                          variant="text" 
                          width={column.id === "orderId" ? "80%" : "60%"} 
                          height={20} 
                          sx={{ bgcolor: "#E5E7EB" }} 
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default OrderTableSkeleton; 
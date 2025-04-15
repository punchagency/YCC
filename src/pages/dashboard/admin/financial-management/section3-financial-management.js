import { Box, Typography, styled, Button, Checkbox, CircularProgress, Skeleton } from "@mui/material";
import { useState, useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import downloadIcon from "../../../../assets/images/icons/financial-management/download-icon.png";
import FilterListIcon from "@mui/icons-material/FilterList";
import Pagination from "./pagination";
import { useTheme } from "../../../../context/theme/themeContext"


const StyledTableCell = styled(TableCell)(({ mode }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: mode === "light" ? "#F9F9FA" : "#7F7F7F",
    color: mode === "light" ? "#212121" : "white",
    fontSize: "14px",
    padding: "10px 32px",
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: mode === "light" ? "#FFFFFF" : "#7F7F7F",
    fontSize: "14px",
    padding: "0px",
    },
  [`&:first-child`]: {
    width: "20px",
    padding: "0px",
    backgroundColor: mode === "light" ? "#FFFFFF" : "#7F7F7F",
  },
  [`&:nth-child(2)`]: {
    padding: "0px",
    backgroundColor: mode === "light" ? "#FFFFFF" : "#7F7F7F",

  },
}));

const StyledTableRow = styled(TableRow)(({ mode }) => ({
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#F9F9FA",
  },
}));
const Section3FinancialManagement = ({ transactions, loading, page, limit, setPage, setLimit, totalPages, totalItems }) => {
    const { theme } = useTheme();

    
    function createData(transaction, status, amount) {
      return { transaction, status, amount };
    }
    
    const rows = useMemo(() => {
      return transactions.map((transaction) =>
        createData(
          transaction.transactionId,
          transaction.transactionStatus,
          transaction.transactionAmount
        )
      );
    }, [transactions]);

    if (loading) {
      return (

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              height: "400px",
              width: "100%",
              padding: "20px",
            }}
          >
             <CustomTypography mode={theme}>Customer Orders</CustomTypography>
            {/* Skeleton for loading table rows */}
            <Skeleton variant="rectangular" height={45} />
            <Skeleton variant="rectangular" height={45} />
            <Skeleton variant="rectangular" height={45} />
            <Skeleton variant="rectangular" height={45} />
            {/* Skeleton for other elements as needed */}
          </Box>
      );
    }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "20px",
      }}
    >
      <Box>
        <CustomTypography mode={theme}>Customer Orders</CustomTypography>
        <Box
          sx={{
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
          }}
        >
          <TableContainer component={Paper} mode={theme}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                <StyledTableCell mode={theme}>
                    <TableTitleText mode={theme}>
                      {/* <CustomCheckbox mode={theme} /> */}
                    </TableTitleText>
                  </StyledTableCell>
                  <StyledTableCell mode={theme}>
                    <TableTitleText mode={theme}>
                      Transaction <FilterListIcon sx={{ fontSize: "17px", color: theme === "light" ? "#6E7079" : "white" }} />
                    </TableTitleText>
                  </StyledTableCell>
                  <StyledTableCell align="right" mode={theme}>
                    <TableTitleText mode={theme}>
                      Status <FilterListIcon sx={{ fontSize: "17px", color: theme === "light" ? "#6E7079" : "white" }} />
                    </TableTitleText>
                  </StyledTableCell>
                  <StyledTableCell align="right" mode={theme}>
                    <TableTitleText mode={theme}>
                      Amount <FilterListIcon sx={{ fontSize: "17px", color: theme === "light" ? "#6E7079" : "white" }} />
                    </TableTitleText>
                  </StyledTableCell>
                  <StyledTableCell align="right" mode={theme}>
                    <TableTitleText mode={theme}>
                      Actions <FilterListIcon sx={{ fontSize: "17px", color: theme === "light" ? "#6E7079" : "white" }} />
                    </TableTitleText>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <StyledTableRow key={row.transaction}>
                    <StyledTableCell align="right" mode={theme}>
                      <TableBodyText mode={theme}>
                        {/* <CustomCheckbox mode={theme} /> */}
                      </TableBodyText>
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" mode={theme}>
                      <TableBodyText mode={theme} sx={{ paddingRight: "5px"}}>
                        {row.transaction}&nbsp;&nbsp;
                        <FileCopyOutlinedIcon
                          sx={{
                            fontSize: "16px",
                            color: "#6E7079",
                            cursor: "pointer",
                          }}
                        />
                      </TableBodyText>
                    </StyledTableCell>
                    <StyledTableCell align="right" mode={theme}>
                      <TableBodyText mode={theme}>
                        <StatusBox status={row.status.toLowerCase()}>{row.status}</StatusBox>
                      </TableBodyText>
                    </StyledTableCell>
                    <StyledTableCell align="right" mode={theme}>
                      <TableBodyText mode={theme}>${row.amount}</TableBodyText>
                    </StyledTableCell>
                    <StyledTableCell align="right" mode={theme}>
                      <TableBodyText mode={theme}>
                        <Box sx={{ display: "flex", gap: "9px" }}>
                          <ActionButton mode={theme} sx={{ padding: "5px 5px", margin: 0, minWidth: "auto" }}>
                            <img src={downloadIcon} alt="download" style={{ display: "block" }} />
                          </ActionButton>
                        <ActionButton mode={theme}>
                          Pay Now
                          </ActionButton>
                        </Box>
                      </TableBodyText>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                
                {/* pagination: this row should be the last row*/}
                <TableRow>
                    <StyledTableCell colSpan={5} align="right" mode={theme}>
                        <Pagination
                         totalPages={totalPages}
                         totalItems={totalItems}
                         currentPage={page}
                         itemsPerPage={limit}
                         onPageChange={setPage}
                         onItemsPerPageChange={setLimit}/>
                    </StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};
const statusColors = {
  //"in progress": { backgroundColor: "#E2F9F0", color: "#1A9E6D" },
  completed: { backgroundColor: "#E2F9F0", color: "#1A9E6D" },
  failed: {
  backgroundColor: "#FFE2E2",color: "#D32F2F"},
  pending: { backgroundColor: "#FFF3E4", color: "#896942" },
};
export const CustomTypography = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "111%",
  letterSpacing: "0%",
  color: mode === "light" ? "#212121" : "white",
}));

  const TableTitleText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0px",
  verticalAlign: "middle",
  textAlign: "center",
  color: mode === "light" ? "#212121" : "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
}));

const TableBodyText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "100%",
  letterSpacing: "0%",
  color: mode === "light" ? "#6E7079" : "white",
  padding: "10px 10px",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
}));

  const StatusBox = styled(Box)(({ mode, status }) => ({
  backgroundColor: statusColors[status].backgroundColor,
  color: statusColors[status].color,
  borderRadius: "6px",
  padding: "4px 11px",
  width: "100px",
  textAlign: "center",
}));

  const ActionButton = styled(Button)(({ mode }) => ({
  borderRadius: "5.21px",
  borderWidth: "0.87px",
  paddingRight: "10px",
  paddingLeft: "10px",
  backgroundColor: mode === "light" ? "#FFFFFF" : "#7F7F7F",
  color: mode === "light" ? "#495057" : "white",
  padding: "5px 5px",
  border: "0.87px solid #E5E7EB",
  textTransform: "none",
}));

  const CustomCheckbox = styled(Checkbox)(({ mode }) => ({
  color: mode === "light" ? "#6E7079" : "white",
  borderRadius: "15px",
  "&.Mui-checked": {
    color: "#0387D9",
  },
}));

export default Section3FinancialManagement;

import { Box, Typography, styled, Button, Checkbox } from "@mui/material";
import { useState } from "react";
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
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F9F9FA",
    color: "#212121",
    fontSize: "14px",
    padding: "10px 32px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "14px",
    padding: "0px",
    },
  [`&:first-child`]: {
    width: "20px",
    padding: "0px",
  },
  [`&:nth-child(2)`]: {
    padding: "0px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#F9F9FA",
  },
}));

function createData(transaction, status, amount) {
  return { transaction, status, amount };
}

const rows = [
  createData("#10234", "In Progress", 100.0),
  createData("#10235", "Completed", 100.0),
  createData("#10236", "Pending", 1200.0),
  createData("#10237", "In Progress", 180.0),
  createData("#10238", "In Progress", 12280.0),
  createData("#10239", "Pending", 12280.0),
];

const statusColors = {
  "In Progress": { backgroundColor: "#E2F9F0", color: "#1A9E6D" },
  Completed: { backgroundColor: "#5570F11A", color: "#3D56D8" },
  Pending: { backgroundColor: "#FFF3E4", color: "#896942" },
};

const Section3FinancialManagement = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
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
        <CustomTypography>Customer Orders</CustomTypography>
        <Box
          sx={{
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
          }}
        >
          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                <StyledTableCell>
                    <TableTitleText>
                      <CustomCheckbox />
                    </TableTitleText>
                  </StyledTableCell>
                  <StyledTableCell>
                    <TableTitleText>
                      Transaction <FilterListIcon sx={{ fontSize: "17px", color: "#6E7079" }} />
                    </TableTitleText>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <TableTitleText>
                      Status <FilterListIcon sx={{ fontSize: "17px", color: "#6E7079" }} />
                    </TableTitleText>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <TableTitleText>
                      Amount <FilterListIcon sx={{ fontSize: "17px", color: "#6E7079" }} />
                    </TableTitleText>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <TableTitleText>
                      Actions <FilterListIcon sx={{ fontSize: "17px", color: "#6E7079" }} />
                    </TableTitleText>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <StyledTableRow key={row.transaction}>
                    <StyledTableCell align="right">
                      <TableBodyText>
                        <CustomCheckbox />
                      </TableBodyText>
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      <TableBodyText sx={{ paddingRight: "5px" }}>
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
                    <StyledTableCell align="right">
                      <TableBodyText>
                        <StatusBox status={row.status}>{row.status}</StatusBox>
                      </TableBodyText>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <TableBodyText>${row.amount}</TableBodyText>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <TableBodyText>
                        <Box sx={{ display: "flex", gap: "9px" }}>
                          <ActionButton sx={{ padding: "5px 5px", margin: 0, minWidth: "auto" }}>
                            <img src={downloadIcon} alt="download" style={{ display: "block" }} />
                          </ActionButton>
                        <ActionButton>
                          Pay Now
                          </ActionButton>
                        </Box>
                      </TableBodyText>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                {/* pagination: this row should be the last row*/}
                <TableRow>
                    <StyledTableCell colSpan={5} align="right">
                        <Pagination 
                         currentPage={currentPage}
                         itemsPerPage={itemsPerPage}
                         onPageChange={setCurrentPage}
                         onItemsPerPageChange={setItemsPerPage}/>
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

export const CustomTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "111%",
  letterSpacing: "0%",
  color: "#212121",
}));

const TableTitleText = styled(Typography)({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0px",
  verticalAlign: "middle",
  textAlign: "center",
  color: "#212121",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
});

const TableBodyText = styled(Typography)({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "100%",
  letterSpacing: "0%",
  color: "#6E7079",
  padding: "10px 10px",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
});

const StatusBox = styled(Box)(({ theme, status }) => ({
  backgroundColor: statusColors[status].backgroundColor,
  color: statusColors[status].color,
  borderRadius: "6px",
  padding: "4px 11px",
  width: "100px",
  textAlign: "center",
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "5.21px",
  borderWidth: "0.87px",
  paddingRight: "10px",
  paddingLeft: "10px",
  backgroundColor: "#FFFFFF",
  color: "#495057",
  padding: "5px 5px",
  border: "0.87px solid #E5E7EB",
  textTransform: "none",
}));

const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  color: "#6E7079",
  borderRadius: "15px",
  "&.Mui-checked": {
    color: "#0387D9",
  },
}));

export default Section3FinancialManagement;

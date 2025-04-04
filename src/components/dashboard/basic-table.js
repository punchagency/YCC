import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import { useTheme } from "../../context/theme/themeContext";
const StyledTableCell = styled(TableCell)(({ mode }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: mode === "light" ? "white" : "#7A7A7A",
    color: mode === "light" ? "#212121" : "white",
    fontSize: "14px",
    padding: "4px 8px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "14px",
    padding: "4px 8px",
  },
}));

const StyledTableRow = styled(TableRow)(({ mode }) => ({
  backgroundColor: mode === "light" ? "white" : "#7A7A7A",
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(orderId, customer, status, amount, date) {
  return { orderId, customer, status, amount, date };
}

const rows = [
  createData('#10234', 'John Doe', 'In Progress', 100.00, '2021-01-01'),
  createData('#10235', 'John Doe', 'Completed', 100.00, '2021-01-01'),
  createData('#10236', 'John Doe', 'Pending', 1200.00, '2021-01-01'),
  createData('#10237', 'John Doe', 'In Progress', 180.00, '2021-01-01'),
  createData('#10238', 'John Doe', 'In Progress', 12280.00, '2021-01-01'),
  
];

const statusColors = {
  "In Progress": {backgroundColor: "#E2F9F0", color: "#1A9E6D"},
  "Completed": {backgroundColor: "#5570F11A", color: "#3D56D8"},
  "Pending": {backgroundColor: "#FFF3E4", color: "#896942"},
};

export default function BasicTable() {
  const { theme } = useTheme();
  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead sx={{backgroundColor: theme === "light" ? "white" : "#7A7A7A"}}>
          <TableRow>
            <StyledTableCell mode={theme}><TableTitleText mode={theme}>Order ID</TableTitleText></StyledTableCell>
            <StyledTableCell mode={theme} align="right"><TableTitleText mode={theme}>Customer</TableTitleText></StyledTableCell>
            <StyledTableCell mode={theme} align="right"><TableTitleText mode={theme}>Status</TableTitleText></StyledTableCell>
            <StyledTableCell mode={theme} align="right"><TableTitleText mode={theme}>Amount</TableTitleText></StyledTableCell>
            <StyledTableCell mode={theme} align="right"><TableTitleText mode={theme}>Date</TableTitleText></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{backgroundColor: theme === "light" ? "white" : "#7A7A7A"}}>
          {rows.map((row) => (
            <StyledTableRow key={row.orderId} mode={theme}>
              <StyledTableCell component="th" scope="row">
                <span style={{display: "flex", alignItems: "center", gap: "0px"}}>
                  <TableBodyText mode={theme} sx={{paddingRight: "5px"}}>{row.orderId}</TableBodyText>
                      <FileCopyOutlinedIcon sx={{ fontSize: "16px", color: theme === "light" ? "#6E7079" : "white" }}/>
                </span>
              </StyledTableCell>
              <StyledTableCell align="right"><TableBodyText mode={theme}>{row.customer}</TableBodyText></StyledTableCell>
              <StyledTableCell align="right"><TableBodyText mode={theme} padding="0px"><StatusBox mode={theme} status={row.status}>{row.status}</StatusBox></TableBodyText></StyledTableCell>
              <StyledTableCell align="right"><TableBodyText mode={theme}>${row.amount}</TableBodyText></StyledTableCell>
              <StyledTableCell align="right"><TableBodyText mode={theme}>{row.date}</TableBodyText></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const TableTitleText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0px",
  verticalAlign: "middle",
  textAlign: "center  ",
  color: mode === "light" ? "#212121" : "white",
}));

const TableBodyText = styled(Typography)(({mode, padding}) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "100%",
  letterSpacing: "0%",
  color: mode === "light" ? "#6E7079" : "white",
  padding: padding ? padding : "10px 10px",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center", 
  width: "100%",
}));

const StatusBox = styled(Box) (({mode, status}) => ({  
  backgroundColor: statusColors[status].backgroundColor,
  color: statusColors[status].color,
  borderRadius: "6px",
  padding: "4px 11px",
  width: "100px",
  textAlign: "center",

}));

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F9F9FA",
    color: "#212121",
    fontSize: 14,
    padding: "4px 8px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "4px 8px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({

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
  createData('#10237', 'John Doe', 'In Progress', 180.00, '2021-01-01')
];

const statusColors = {
  "In Progress": {backgroundColor: "#E2F9F0", color: "#1A9E6D"},
  "Completed": {backgroundColor: "#5570F11A", color: "#3D56D8"},
  "Pending": {backgroundColor: "#FFF3E4", color: "#896942"},
};

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell><TableTitleText>Order ID</TableTitleText></StyledTableCell>
            <StyledTableCell align="right"><TableTitleText>Customer</TableTitleText></StyledTableCell>
            <StyledTableCell align="right"><TableTitleText>Status</TableTitleText></StyledTableCell>
            <StyledTableCell align="right"><TableTitleText>Amount</TableTitleText></StyledTableCell>
            <StyledTableCell align="right"><TableTitleText>Date</TableTitleText></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.orderId}>
              <StyledTableCell component="th" scope="row">
                <span style={{display: "flex", alignItems: "center", gap: "0px"}}>
                  <TableBodyText sx={{paddingRight: "5px"}}>{row.orderId}</TableBodyText>
                  <FileCopyOutlinedIcon sx={{ fontSize: 16, color: "#6E7079" }}/>
                </span>
              </StyledTableCell>
              <StyledTableCell align="right"><TableBodyText>{row.customer}</TableBodyText></StyledTableCell>
              <StyledTableCell align="right"><StatusBox status={row.status}>{row.status}</StatusBox></StyledTableCell>
              <StyledTableCell align="right"><TableBodyText>${row.amount}</TableBodyText></StyledTableCell>
              <StyledTableCell align="right"><TableBodyText>{row.date}</TableBodyText></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const TableTitleText = styled(Typography)({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 500,
  fontSize: 16,
  lineHeight: "24px",
  letterSpacing: "0px",
  verticalAlign: "middle",
  textAlign: "center  ",
  color: "#212121",
});

const TableBodyText = styled(Typography)({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: 14,
  lineHeight: "100%",
  letterSpacing: "0%",
  color: "#6E7079",
  padding: "10px 20px",
});

const StatusBox = styled(Box) (({theme, status}) => ({  
  backgroundColor: statusColors[status].backgroundColor,
  color: statusColors[status].color,
  borderRadius: "6px",
  padding: "4px 11px",
  width: "100px",
  textAlign: "center",

}));

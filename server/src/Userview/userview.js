import React from "react";
import Navbarprofile from "../NavbarUser/navbarprofile";
import { Button } from "@mui/material";
import "./userview.css";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { useState } from "react";
import { usertimeentries } from "../services/usertimeentries";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableContainer = styled(TableContainer)({
  maxWidth: 800, // Set your desired maximum width here
  margin: "auto", // Center the table
  marginTop: "5%",
});

function Userview() {
  const [allTimeEntries, setAllTimeEntries] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");
  const [showReportTable, setShowReportTable] = useState(false);

  const dateOptions = { day: "2-digit", month: "2-digit", year: "numeric" };

  const username = sessionStorage.getItem("name") || "";

  const handleReports = async () => {
    if (startDate !== null && endDate !== null && username.length > 0) {
      try {
        const resp = await usertimeentries(startDate, endDate, username);
        if (resp) {
          setAllTimeEntries(resp.timeentries);
          setShowReportTable(true);
        } else {
          setAllTimeEntries([]);
          setShowReportTable(false);
          setShowError(true);
          setMessage("No Records Found");
          setTimeout(() => {
            setShowError(false);
          }, 3000);
        }
      } catch (error) {
        console.log("Error fetching all time entries:", error);
      }
    } else {
      setShowError(true);
      setMessage("Please Select Start Date & End Date");
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Navbarprofile />
      <div className="time-view-contents">
        <div className="time-view-container">
          <div style={{ display : 'flex', justifyContent : 'center', alignContent : 'center', marginTop : '10px'}}>
            {!showError && <h3 style={{ marginBottom : '19px' }}>User Report</h3>}
            {showError && (
              <Alert
                severity="error"
                style={{
                  marginTop : '4px',
                  width: "40%",
                  justifyContent: "center",
                }}
              >
                {message}
              </Alert>
            )}
          </div>
          <div className="time-view">
            <label style={{ fontSize: "18px", marginRight: "10px" }}>
              Start Date
            </label>
            <input
              className="time-option"
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
            ></input>
            <label
              style={{
                fontSize: "18px",
                marginRight: "10px",
                marginLeft: "10px",
              }}
            >
              End Date
            </label>
            <input
              className="time-option"
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
            ></input>
          </div>
          <div style={{ margin: "auto", marginTop: "20px", marginBottom : '10px' }}>
            <Button
              variant="outlined"
              color="info"
              onClick={handleReports}
              style={{
                borderRadius: "15px",
                width: "100px",
                marginBottom: "10px",
              }}
            >
              SUBMIT
            </Button>
          </div>
        </div>
        {showReportTable && (
          <div style={{ margin: "auto", marginTop: "10px" }}>
            <StyledTableContainer component={Paper}>
              <Table
                sx={{ minWidth: 500, width: "800px" }}
                aria-label="customized table"
              >
                <TableHead>
                  <TableRow>
                  <StyledTableCell align="center">Date</StyledTableCell>
                    <StyledTableCell align="center">User Name</StyledTableCell>
                    <StyledTableCell align="center">
                      Project Name
                    </StyledTableCell>
                    <StyledTableCell align="center">Activity</StyledTableCell>
                    <StyledTableCell align="center">Description</StyledTableCell>
                    <StyledTableCell align="center">Work Mode</StyledTableCell>
                    <StyledTableCell align="center">
                      Working Hours
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? allTimeEntries.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : allTimeEntries
                  ).map((timeentries) => (
                    <StyledTableRow
                      key={timeentries.EntryID}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <StyledTableCell align="center">
                        {new Date(timeentries.Date).toLocaleDateString(
                          "en-GB",
                          dateOptions
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {timeentries.UserName}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {timeentries.ProjectName}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {timeentries.Activity}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {timeentries.Description}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {timeentries.WorkMode}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {timeentries.HoursWorked}
                      </StyledTableCell>
                      {/* <StyledTableCell align="center">
                    <IconButton aria-label="delete" size="large">
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </StyledTableCell> */}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10,15,20]}
                component="div"
                count={allTimeEntries.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </StyledTableContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default Userview;

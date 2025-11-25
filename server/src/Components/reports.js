import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import { Box, Button } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import SummarizeIcon from "@mui/icons-material/Summarize";
import Weekselector from "./weekselector";
import UseDatecontext from "./context/useDate";
import { alltimeentries } from "../services/alltimeentries";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Navbarrep from "../NavbarUser/navbarrep";
import Alert from "@mui/material/Alert";
import { deleterecord } from "../services/deleterecord";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

function Reports() {
  const [allTimeEntries, setAllTimeEntries] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [uName, setUname] = useState("");
  const [showReportTable, setShowReportTable] = useState(false);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const leaderId = sessionStorage.getItem('userID')

  const dateOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
  const { data } = UseDatecontext();

  useEffect(() => {
    if (data !== null && data.fromdate && data.todate) {
      const start = new Date(
        data.fromdate.year,
        data.fromdate.month - 1,
        data.fromdate.day + 1
      )
        .toISOString()
        .split("T")[0];
      const end = new Date(
        data.todate.year,
        data.todate.month - 1,
        data.todate.day + 1
      )
        .toISOString()
        .split("T")[0];
      setStartDate(start);
      setEndDate(end);
    } else {
      setStartDate(new Date());
      setEndDate(new Date());
    }
  }, [data]);

  useEffect(() => {
    if (allTimeEntries.length > 0) {
      setShowReportTable(true);
    } else {
      setShowReportTable(false);
    }
  }, [allTimeEntries]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const handleReports = async () => {
    if (startDate && endDate && uName && leaderId) {
      try {
        const resp = await alltimeentries(startDate, endDate, leaderId, uName);
        if (resp) {
          setAllTimeEntries(resp.timeentries);
        } else {
          setAllTimeEntries([]);
          setShowError(true);
          setMessage("No Records Found");
          setTimeout(() => {
            setShowError(false);
          }, 3000);
        }
      } catch (error) {
        console.error("Error fetching all time entries:", error);
      }
    } else {
      setShowError(true);
      setMessage("Please Select All Fields");
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  const handleExportToExcel = () => {
    try {
      const exportData = allTimeEntries.map((entry) => ({
        "User Name": entry.UserName,
        "Project Name": entry.ProjectName,
        Date: new Date(entry.Date).toLocaleDateString("en-GB", dateOptions),
        "Working Hours": entry.HoursWorked,
        Description: entry.Description,
        "Work Mode": entry.WorkMode,
        Activity : entry.Activity
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const excelFileName = "reports.xlsx";
      XLSX.writeFile(wb, excelFileName);
      saveAs(
        new Blob([s2ab(XLSX.write(wb, { bookType: "xlsx", type: "blob" }))], {
          type: "application/octet-stream",
        }),
        "reports.xlsx"
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  const handleDeleteRecord = async (e) => {
    const id = e.currentTarget.id;
    console.log(id, "in home");
    if (id !== null) {
      try {
        const resp = await deleterecord(id);
        if (resp) {
          // Filter out the deleted entry from allTimeEntries
          const updatedEntries = allTimeEntries.filter(entry => entry.EntryID !== id);
          setAllTimeEntries(updatedEntries);
          
          setShowSuccess(true);
          setMessage("Record Deleted with entry id : " + id);
          setShowError(false);
          setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
        } else {
          setShowError(true);
          setMessage("Invalid record with entry id : " + id);
          setShowSuccess(false);
          setTimeout(() => {
            setShowError(false);
          }, 3000);
        }
      } catch (error) {
        console.error("Error deleting record:", error);
        setShowError(true);
        setMessage("Error deleting record with entry id : " + id);
        setShowSuccess(false);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      }
    } else {
      setShowError(true);
      setMessage("Please select record");
      setShowSuccess(false);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  return (
    <div>
      <Navbarrep />
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "baseline",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            marginTop: "40px",
            marginLeft: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {showSuccess && (
            <Alert severity="success" style={{ marginBottom : '20px'}}>
              {message}
            </Alert>
          )}
          {showError && <Alert severity="error" style={{ marginBottom : '20px'}}>{message}</Alert>}
          <Weekselector />
          <div style={{ marginTop: "15px" }}>
            <input
              type="text"
              className="option"
              style={{ width: "300px" }}
              onChange={(e) => setUname(e.target.value)}
              placeholder="Enter User Name"
            />
          </div>
          <Button
            variant="outlined"
            color="info"
            style={{
              marginTop: "15px",
              borderRadius: "10px",
              background : 'black',

            }}
            onClick={handleReports}
          >
            SUBMIT
          </Button>
        </div>
        {showReportTable && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              flexDirection: "column",
              marginTop: "50px",
            }}
          >
            <StyledTableContainer component={Paper}>
              <Table
                sx={{ minWidth: 500, width: "800px" }}
                aria-label="customized table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <SummarizeIcon />
                        <span style={{ marginLeft: "8px" }}></span>
                        <h3 style={{ textAlign: "center", margin: 0 }}>
                          Reports
                        </h3>
                      </Box>
                    </TableCell>
                  </TableRow>
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
                    <StyledTableCell align="center">Delete</StyledTableCell>
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
                      <StyledTableCell align="center">
                        <IconButton
                          aria-label="delete"
                          size="small"
                          id={timeentries.EntryID}
                          onClick={handleDeleteRecord}
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </StyledTableCell>
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
            <Button
              variant="contained"
              color="success"
              style={{
                width: "200px",
                height: "30px",
                marginTop: "10px",
                borderRadius: "10px",
              }}
              onClick={handleExportToExcel}
            >
              Export To Excel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;

import React, { useState, useEffect } from "react";
import "./timesheet.css";
import Sample from "../Components/sample";
import { timeentries } from "../services/timeentries";
import Alert from "@mui/material/Alert";
import Navbaruser from "../NavbarUser/navbaruser";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Button } from "@mui/material";
import Monday from "../Components/monday";
import Tuesday from "../Components/tuesday";
import Wednesday from "../Components/wednesday";
import Thursday from "../Components/thursday";
import Friday from "../Components/friday";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

function Timesheet() {
  const [weekdata, setweekdata] = useState([]);
  const [totaldata, settotaldata] = useState([]);
  const [currentWeek, setCurrentWeek] = useState("");
  const userID = sessionStorage.getItem("userID");
  const username = sessionStorage.getItem("username");
  const datauser = { userID, username };
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handletotalsubmit = (obj) => {
    settotaldata([...totaldata, obj]);
  };

  const handlesubmit = (dailyData) => {
    setweekdata([...weekdata, dailyData]);
    handletotalsubmit(dailyData);
  };

  const handlesubmitdata = async () => {
    if (totaldata.length > 0) {
      const resp = await timeentries(totaldata);

      if (resp) {
        setShowSuccess(true);
        setSubmissionSuccess(true);
        setShowError(false);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
        settotaldata([]);
        setweekdata([]);
      } else {
        setShowError(true);
        setShowSuccess(false);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      }
    } else {
      setShowError(true);
      setShowSuccess(false);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  useEffect(() => {
    const getCurrentWeek = () => {
      const today = new Date();
      const currentDay = today.getDay();
      const startDate = new Date(today);
      startDate.setDate(
        today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)
      );
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 5);
      const formattedStartDate = `${startDate.getDate()}/${
        startDate.getMonth() + 1
      }/${startDate.getFullYear()}`;
      const formattedEndDate = `${endDate.getDate()}/${
        endDate.getMonth() + 1
      }/${endDate.getFullYear()}`;
      return `${formattedStartDate} - ${formattedEndDate}`;
    };
    setCurrentWeek(getCurrentWeek());
  }, []);

  return (
    <div className="timesheet-container">
      <Navbaruser />
      {!(showSuccess || showError) && (
        <div
          style={{
            width: "250px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <div
            className="option"
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            {/* <CalendarTodayIcon style={{ marginRight: "15px" }} /> */}
            <p>{currentWeek}</p>
          </div>
        </div>
      )}
      {showSuccess && (
        <Alert severity="success" style={{ marginTop: "5px" }}>
          Project working hours submitted successfully
        </Alert>
      )}

      {showError && (
        <Alert severity="error" style={{ marginTop: "5px" }}>
          Project working hours submission failed
        </Alert>
      )}
      <div className="horizontal-box-opt" style={{ marginTop: "20px" }}>
        <div className="opt" style={{ marginLeft: "30px" }}>
          DATE
        </div>
        <div
          className="opt"
          style={{ marginLeft: "30px", marginRight: "60px" }}
        >
          MODE
        </div>
        <div className="opt" style={{ marginRight: "10px" }}>
          DEPARTMENT
        </div>
        <div className="opt" style={{ marginRight: "0px" }}>
          PROJECT
        </div>
        <div className="opt" style={{ marginRight: "10px" }}>
          ACTIVITY
        </div>
        <div className="opt" style={{ marginRight: "50px" }}>
          WORK
        </div>
        <div className="opt" style={{ marginRight: "80px" }}>
          DESCRIPTION
        </div>
      </div>
      <div className="timesheet-content">
        <Monday
          dataU={datauser}
          handlesubmitweek={handlesubmit}
          handletotalweek={handletotalsubmit}
        ></Monday>
        <Tuesday
          dataU={datauser}
          handlesubmitweek={handlesubmit}
          handletotalweek={handletotalsubmit}
        ></Tuesday>
        <Wednesday
          dataU={datauser}
          handlesubmitweek={handlesubmit}
          handletotalweek={handletotalsubmit}
        ></Wednesday>
        <Thursday
          dataU={datauser}
          handlesubmitweek={handlesubmit}
          handletotalweek={handletotalsubmit}
        ></Thursday>
        <Friday
          dataU={datauser}
          handlesubmitweek={handlesubmit}
          handletotalweek={handletotalsubmit}
        ></Friday>
        <Button
          style={{
            borderRadius: "10px",
            marginTop: "10px",
            background: "black",
          }}
          size="large"
          variant="contained"
          onClick={handlesubmitdata}
        >
          SUBMIT
        </Button>
      </div>
    </div>
  );
}

export default Timesheet;

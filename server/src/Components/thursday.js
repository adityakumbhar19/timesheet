import React, { useState } from "react";
import { useEffect } from "react";
import "../Timesheet/timebox.css";
import { depts } from "../services/depts";
import { projects } from "../services/projects";
import Alert from "@mui/material/Alert";
import { Fab, Button, Box, Modal, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ModalCompOne from "./modalcompone";
import ModalCompTwo from "./modalcomptwo";
import ModalCompThree from "./modalcompthree";
import styled from "@emotion/styled";
import { activities } from "../services/activities";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const Thursday = ({ dataU, handlesubmitweek, handletotalweek }) => {
  const [selectedWorkModes, setSelectedWorkModes] = useState("");
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [projectOptions, setProjectOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [description, setDescription] = useState("");
  const [userID, setUserID] = useState(null);
  const [showError, setShowError] = useState(false);
  const [dailyData, setDailyData] = useState([]);
  const [activityOptions, setActivityOptions] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState();
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // const today = new Date();
  // const startOfWeek = new Date(today);
  // startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  // const endOfWeek = new Date(startOfWeek);
  // endOfWeek.setDate(startOfWeek.getDate() + 5);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
  };

  const fetchDepts = async () => {
    try {
      const resp = await depts();
      if (resp) {
        setDepartmentOptions(resp.departments);
      } else {
        setDepartmentOptions([]);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setSelectedProject("");
  };

  const fetchProjects = async () => {
    if (selectedDepartment && userID) {
      try {
        const resp = await projects(selectedDepartment, userID);
        if (resp) {
          setProjectOptions(resp.projects);
        } else {
          setProjectOptions([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedDepartment, dataU]);

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
  };

  const handleWorkModeChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedWorkModes(selectedValue);
  };

  const handleHoursWorked = (event) => {
    setHoursWorked(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmitDailyData = (obj) => {
    setDailyData([...dailyData, obj]);
  };

  const handlesubmitday = () => {
    handletotalweek(dailyData);
    setOpen(false);
  };

  useEffect(() => {
    setUserID(dataU.userID);
  }, [dataU]);

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (selectedWorkModes.includes("LEAVE")) {
      return;
    }
    setOpen(true);
  };

  const [open, setOpen] = React.useState(false);
  //const handleOpen = () => setOpen(true);
  const handleClose = () => {};
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleSubmitLeave = () => {
    if (selectedWorkModes.includes("LEAVE") && selectedDate) {
      const obj = {
        userid: userID,
        projectid: "42",
        date: selectedDate,
        workdone: "0",
        mode: ["LEAVE"], // always "LEAVE" mode
        desc: "NA",
        activityid: "9", // Always Activity ID for Leaving the Office
      };
      handlesubmitweek([obj]);
      setSubmissionSuccess(true);
    } else if (
      !selectedDate ||
      !selectedDepartment ||
      !selectedProject ||
      !hoursWorked ||
      !description ||
      selectedWorkModes.length === 0 ||
      !selectedActivity
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    } else {
      const obj = {
        userid: userID,
        projectid: selectedProject,
        date: selectedDate,
        workdone: hoursWorked,
        mode: selectedWorkModes,
        desc: description,
        activityid: selectedActivity,
      };
      handlesubmitweek([obj]);
      setSubmissionSuccess(true);
    }
  };

  const fetchActivities = async () => {
    try {
      const resp = await activities();
      if (resp) {
        setActivityOptions(resp.activities);
      } else {
        setActivityOptions([]);
      }
    } catch (error) {
      console.log("handleActities error : ", error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleActivityChange = (e) => {
    setSelectedActivity(e.target.value);
  };

  return (
    <div className="horizontal-box">
      {showError && (
        <Alert severity="error">
          Please make sure all fields are filled out correctly
        </Alert>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          marginLeft: "5px",
        }}
      >
        <Button
          className="option"
          style={{ borderRadius: "40px" }}
          color="primary"
          variant="outlined"
          size="small"
          onClick={handleOpen}
        >
          <AddIcon />
        </Button>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            {showError && (
              <Alert severity="error">
                Please make sure all fields are filled out correctly
              </Alert>
            )}
            <ModalCompOne
              dataU={dataU}
              handlesubmitweek={handleSubmitDailyData}
              date={selectedDate}
            />
            <ModalCompTwo
              dataU={dataU}
              handlesubmitweek={handleSubmitDailyData}
              date={selectedDate}
            />
            <ModalCompThree
              dataU={dataU}
              handlesubmitweek={handleSubmitDailyData}
              date={selectedDate}
            />
            <div style={{ display : 'flex',justifyContent : 'center ', margin : 'auto', marginTop : '10px'}}>
              <Button
                variant="contained"
                color="info"
                style={{ borderRadius: "10px" }}
                onClick={handlesubmitday}
              >
                ADD ENTRIES
              </Button>
              <Button
                variant="contained"
                color="error"
                style={{ borderRadius: "10px" , marginLeft : '10px'}}
                onClick={(e) => setOpen(false)}
              >
                Close
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
      <div className="option">
        <input
          type="date"
          className="option-date"
          onChange={handleDateChange}
          // min={startOfWeek.toISOString().split("T")[0]}
          // max={endOfWeek.toISOString().split("T")[0]}
        />
      </div>
      <div
        className="option"
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <label style={{ marginRight: "10px" }}>
          <input
            type="radio"
            name="workMode"
            value="WFH"
            checked={selectedWorkModes === "WFH"}
            onChange={handleWorkModeChange}
          />
          WFH
        </label>
        <label style={{ marginRight: "10px" }}>
          <input
            type="radio"
            name="workModeTh"
            value="WFO"
            checked={selectedWorkModes === "WFO"}
            onChange={handleWorkModeChange}
          />
          WFO
        </label>
        <label>
          <input
            type="radio"
            name="workModeTh"
            value="PARTIAL"
            checked={selectedWorkModes === "PARTIAL"}
            onChange={handleWorkModeChange}
          />
          PARTIAL
        </label>
        <label style={{ marginLeft: "10px" }}>
          <input
            type="radio"
            name="workModeTh"
            value="LEAVE"
            checked={selectedWorkModes === "LEAVE"}
            onChange={handleWorkModeChange}
          />
          LEAVE
        </label>
      </div>
      <select
        id="department"
        value={selectedDepartment}
        onTouchMoveCapture={handleDepartmentChange}
        onChange={handleDepartmentChange}
        className="option"
        style={{ width: "70%" }}
      >
        <option>Department</option>

        {departmentOptions.map((departments) => (
          <option
            key={departments.departmentid}
            value={departments.departmentid}
          >
            {departments.departmentname}
          </option>
        ))}
      </select>
      <select
        id="project"
        value={selectedProject}
        onChange={handleProjectChange}
        className="option"
        style={{ width: "70%" }}
      >
        <option>Project</option>
        {projectOptions.map((project) => (
          <option key={project.projectid} value={project.projectid}>
            {project.projectname}
          </option>
        ))}
      </select>
      <select
        id="activity"
        value={selectedActivity}
        onChange={handleActivityChange}
        className="option"
        style={{ width: "70%" }}
      >
        <option>Activity</option>
        {activityOptions.map((activity) => (
          <option key={activity.activityid} value={activity.activityid}>
            {activity.activityname}
          </option>
        ))}
      </select>
      <input
        type="number"
        step={"0.5"}
        placeholder="Hours Worked"
        onChange={handleHoursWorked}
        className="option"
      />
      <input
        type="text"
        placeholder="Description"
        onChange={handleDescriptionChange}
        className="option"
        maxLength="100"
      />
      <div>
        {!submissionSuccess && (
          <Button
            style={{
              borderRadius: "10px",
              marginTop: "10px",
              color: "white",
              marginRight: "5px",
            }}
            variant="outlined"
            color="primary"
            onClick={handleSubmitLeave}
          >
            Save
          </Button>
        )}
        {submissionSuccess && (
          <Button
            style={{
              color: "#00e676",
              width: "60px",
              height: "40px",
              justifyContent: "center",
              alignContent: "center",
              marginRight: "5px",
              marginTop: "10px",
            }}
            size="large"
            disabled
          >
            <CheckBoxIcon style={{ width: "34px" }} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Thursday;

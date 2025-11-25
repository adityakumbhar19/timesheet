import React, { useState } from "react";
import { useEffect } from "react";
import "../Timesheet/timebox.css";
import { depts } from "../services/depts";
import { projects } from "../services/projects";
import Alert from "@mui/material/Alert";
import { activities } from "../services/activities";
import { Fab, Button, Box, Modal, Typography,IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const ModalCompOne = ({ dataU, handlesubmitweek,date }) => {
  const [selectedWorkModes, setSelectedWorkModes] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [projectOptions, setProjectOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [description, setDescription] = useState("");
  const [userID, setUserID] = useState(null);
  const [showError, setShowError] = useState(false);
  const [activityOptions, setActivityOptions] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState();
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // Get the previous Monday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 5); // End of the week is 5 days after the start (Saturday)

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

  const handlesubmitday = () => {
    if (
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
    }
    const obj = {
      userid: userID,
      projectid: selectedProject,
      date: selectedDate,
      workdone: hoursWorked,
      mode: selectedWorkModes,
      desc: description,
      activityid: selectedActivity,
    };
    handlesubmitweek(obj);
    setSubmissionSuccess(true);
  };

  useEffect(() => {
    setUserID(dataU.userID);
  }, [dataU]);

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
      <input
        type="date"
        className="option-date"
        onChange={handleDateChange}
        // min={startOfWeek.toISOString().split("T")[0]}
        // max={endOfWeek.toISOString().split("T")[0]}
      />
      <div className="option" style={{ display : 'flex', justifyContent : 'center', alignContent : 'center'}}>
        <label>
          <input
            type="radio"
            name="workModeOne"
            value="WFH"
            checked={selectedWorkModes === "WFH"}
            onChange={handleWorkModeChange}
          />
          WFH
        </label>
        <label>
          <input
            type="radio"
            name="workModeOne"
            value="WFO"
            checked={selectedWorkModes === "WFO"}
            onChange={handleWorkModeChange}
          />
          WFO
        </label>
        <label>
          <input
            type="radio"
            name="workModeOne"
            value="PARTIAL"
            checked={selectedWorkModes === "PARTIAL"}
            onChange={handleWorkModeChange}
          />
          PARTIAL
        </label>
      </div>
      <select
        id="department"
        value={selectedDepartment}
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
      <div style={{ margin : 'auto'}}>
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
            onClick={handlesubmitday}
          >
            Save
          </Button>
        )}
        {submissionSuccess && (
          <Button
          style={{
            color: "#00e676",
            width : '60px',
            height : '40px',
            justifyContent: "center",
            alignContent: "center",
            marginRight: "5px",
            marginTop : "5px",
          }}
          size="large"
          disabled
        >
          <CheckBoxIcon style={{ width : '34px'}}/>
        </Button>
        )}
      </div>
    </div>
  );
};

export default ModalCompOne;

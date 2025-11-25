import React, { useState } from 'react';
import { useEffect  } from 'react';
import './timebox.css';
import { depts } from '../services/depts'
import { projects } from '../services/projects'

const Timebox = ({dataU,handlesubmitweek}) => {

  const [selectedWorkModes, setSelectedWorkModes] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [projectOptions, setProjectOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedWeekday, setSelectedWeekday] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [description, setDescription] = useState('');
  const[singledaydata,setsingledaydata]=useState({});
  const [userID,setUserID]=useState(null);
  const [weekdata,setweekdata]=useState([]);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const selectedDateObj = new Date(date);
    const dayOfWeek = days[selectedDateObj.getDay()];

    setSelectedWeekday(dayOfWeek);
  };

  const fetchDepts = async () => {
    try 
    {
      const resp = await depts();  
      if(resp)
      { 
        setDepartmentOptions(resp.departments);
      }
      else 
      {
        setDepartmentOptions([]);
      }
    } 
    catch (error) 
    {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setSelectedProject('')
  };

  const fetchProjects = async () => {
    if (selectedDepartment) {
      try {
        const resp = await projects(selectedDepartment);
        if (resp) {
          setProjectOptions(resp.projects);
        } else {
          setProjectOptions([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
    
  }, [selectedDepartment,dataU]);

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
  }

  const handleWorkModeChange = (event) => {
   setSelectedWorkModes(event.target.value);
  };

  const handleHoursWorked = (event) => {
     setHoursWorked(event.target.value);
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  }

const handlesubmitday=()=>{
  const obj={
    userid : userID,
    projectid : selectedProject,
    date : selectedDate,
    workdone : hoursWorked,
    mode : selectedWorkModes,
    desc : description
  }
  setsingledaydata(obj)
  setweekdata((prevWeekData) => [...prevWeekData, obj]);
  handlesubmitweek([...weekdata,obj])
}

useEffect(()=>{
  setUserID(dataU.ID)
},[dataU])
  return (
     <div className="horizontal-box">
       <input type="date" className="option" onChange={handleDateChange} />
       <input type="text" placeholder="Weekday" className="option" readOnly value={selectedWeekday} />
       <select id="department" value={selectedDepartment} onChange={handleDepartmentChange}>
         <option>Department</option>
    
         {departmentOptions.map((departments) => (
          
           <option key={departments.departmentid} value={departments.departmentid}>
             {departments.departmentname}
           </option>
         ))}
       </select>

       <select id="project" value={selectedProject} onChange={handleProjectChange} className="option">
         <option>Project</option>
         {projectOptions.map((project) => (
           <option key={project.projectid} value={project.projectid}>
             {project.projectname}
           </option>
         ))}
       </select>

       <input type="number" placeholder="Hours Worked" onChange={handleHoursWorked} className="option" />
       <input type='text' placeholder="Description" onChange={handleDescriptionChange} className="option" maxLength="100"/>
       <div className="radio-options">
         <label>
           <input type="checkbox" value="WFH" checked={selectedWorkModes.includes('WFH')} onChange={handleWorkModeChange} />
           WFH
         </label>
         <label>
           <input type="checkbox" value="WFO" checked={selectedWorkModes.includes('WFO')} onChange={handleWorkModeChange} />
         WFO
         </label>
         <label>
           <input type="checkbox" value="PARTIAL" checked={selectedWorkModes.includes('PARTIAL')} onChange={handleWorkModeChange} />
           PARTIAL
         </label>
       </div>
       <div>
        <button className='btn btn-dark' onClick={handlesubmitday}>Save</button>
       </div>
     </div>
   /*{ <div>
      {[...Array(7)].map((_, index) => (
        <WorkEntryForm
          key={index}
          // Pass your state and handlers as props
          handleDateChange={handleDateChange}
          selectedWeekday={selectedWeekday}
          handleDepartmentChange={handleDepartmentChange}
          departmentOptions={departmentOptions}
          selectedDepartment={selectedDepartment}
          handleProjectChange={handleProjectChange}
          projectOptions={projectOptions}
          selectedProject={selectedProject}
          handleHoursWorked={handleHoursWorked}
          handleDescriptionChange={handleDescriptionChange}
          selectedDescription={description}
          selectedWorkModes={selectedWorkModes}
          handleWorkModeChange={handleWorkModeChange}
          handlesubmit={handlesubmitday}
        />
      ))}
      <div>
      <button className='btn btn-dark' onClick={handlesubmitweek}>Submit</button>
      </div> 
    </div> */
  );
};

export default Timebox;

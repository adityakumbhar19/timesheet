const express = require("express");
const router = express.Router();
const con = require("../DL/databaseCon");

router.get("/depts", (req, res) => {
  const query = "SELECT departmentid,departmentname FROM departments WHERE departmentid != 10";
  con.query(query, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      return res.status(200).json({ departments: results });
    } else {
      return res.status(404).json({ error: "No departments found" });
    }
  });
});

router.get("/activity",(req,res) => {
  const query = "SELECT  activityid,activityname FROM activity WHERE activityid != 9 ORDER BY activityid;";
  con.query(query,(err,results) => {
    if (err) 
    {
      console.error("Error executing MySQL query : ",err);
      return res.status(500).json({ error : 'Internal Server Error'});
    }

    if (results.length > 0) 
    {
      return res.status(200).json({ activities : results});  
    } else 
    {
      return res.status(404).json({ error : 'No activites found'});  
    }
  })
});

router.get("/projects/:departmentId/:userId", (req, res) => {
  const departmentId = req.params.departmentId;
  const userId = req.params.userId;
  const query =
    "SELECT projects.projectid, projects.projectname FROM projects JOIN projectdepartments ON projects.projectid = projectdepartments.projectid JOIN projectusers ON projects.projectid = projectusers.projectid WHERE projectdepartments.departmentid = ? && projectusers.userid = ?";

  con.query(query, [departmentId,userId], (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      return res.status(200).json({ projects: results });
    } else {
      return res
        .status(404)
        .json({ error: "No projects found for the selected department" });
    }
  });
});

router.delete('/delete/:entryid', (req, res) => {
  const entryid = req.params.entryid;
  const query = 'DELETE FROM timeentries t WHERE t.Entryid = ?';
  con.query(query,[entryid], (err,results) => {
    console.log(results)
    if (err) {
      console.error("Error executing MySQL query", err);
      return res.status(500).json({ error : "Internal Server Error" });
      
    }

    if (results.affectedRows > 0) {
      return res.status(200).json({ message : 'Deleted record with id : '+entryid });
    }
    else
    {
      return res.status(404).json({ message : 'Invalid Entryid : '+entryid });
    }
  })
});

router.post("/submitHours", async (req, res) => {
  const data = req.body;
  const timesheetArray = data.timeEntry;
 
  for (let i = 0; i < timesheetArray.length; i++) {
    const records = timesheetArray[i];
    
    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ error: "Invalid data structure" });
    }

      for (let j = 0; j < records.length; j++) {
        const { userid, projectid, date, workdone, mode, desc, activityid } = records[j];
        let wdmode = String(mode).replace(/,/g, " ");
        if (!userid || !projectid || !date || !workdone || !wdmode || !desc || !activityid) {
          
          return res.status(400).json({ error: "unstructure"});
        }
        
        const query = `INSERT INTO timeEntries (UserID, ProjectID, Date, HoursWorked, WorkMode, Description, ActivityID) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await new Promise((resolve, reject) => {
          con.query(
            query,
            [userid, projectid, date, workdone, wdmode, desc, activityid],
            (error, results) => {
              if (error) {
                console.error("Error executing MySQL query:", error);
                reject(error);
              } else {
                resolve();
              }
            }
          );
        });
      }
  }
  return res
    .status(201)
    .json({ message: "Project working hours submitted successfully" });
});

router.get("/total-weekly-hours/:userId", (req, res) => {
  const userId = req.params.userId;
  const currentDate = new Date();
  const currentDayOfWeek = currentDate.getDay();
  const daysUntilFriday = currentDayOfWeek <= 5 ? 5 - currentDayOfWeek : 6;
  const startOfWeek = new Date(currentDate);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - currentDayOfWeek + 1);
  const endOfWeek = new Date(currentDate);
  endOfWeek.setHours(23, 59, 59, 999);
  endOfWeek.setDate(endOfWeek.getDate() + daysUntilFriday);

  const query = `
      SELECT SUM(HoursWorked) AS totalWeeklyHours
      FROM timeEntries
      WHERE UserID = ? AND Date >= ? AND Date <= ?
    `;
  console.log(startOfWeek,endOfWeek)
  con.query(query, [userId, startOfWeek, endOfWeek], (error, results) => {
    if (error) {
      console.error("Error executing MySQL query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    const totalWeeklyHours = results[0].totalWeeklyHours || 0;
    return res.status(200).json({ totalWeeklyHours });
  });
});

router.post('/allTimeEntries', (req, res) => {
  const { startDate, endDate, uName, leaderId} = req.body; 
  const query = `
    SELECT
      DISTINCT
      e.EntryID,
      u.Fullname AS UserName,
      p.ProjectName AS ProjectName,
      e.Date,
      e.HoursWorked,
      e.WorkMode,
      e.Description,
      a.ActivityName AS Activity
    FROM
      timeentries e
    JOIN
      Users u ON e.UserID = u.UserID
    JOIN
      Activity a ON e.ActivityID = a.ActivityID
    JOIN
      Projects p ON e.ProjectID = p.ProjectID
    JOIN
      usersleaders l ON l.PlayerID = u.UserID
    WHERE
      e.Date >= ? AND e.Date <= ? AND u.Fullname = ? AND l.LeaderID = ?
    ORDER BY
      e.Date
  `;

  con.query(query, [startDate, endDate, uName, leaderId], (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      return res.status(200).json({ timeentries: results });
    } else {
      return res.status(404).json({ error: "No timeentries found" });
    }
  });
});

router.post('/userTimeEntries', (req, res) => {
  const { startDate, endDate, uName } = req.body; 
  const query = `
    SELECT
      e.EntryID,
      u.Fullname AS UserName,
      p.ProjectName AS ProjectName,
      e.Date,
      e.HoursWorked,
      e.WorkMode,
      e.Description,
      a.ActivityName AS Activity
    FROM
      timeentries e
    JOIN
      Users u ON e.UserID = u.UserID
    JOIN
      Activity a ON e.ActivityID = a.ActivityID
    JOIN
      Projects p ON e.ProjectID = p.ProjectID
    WHERE
      e.Date >= ? AND e.Date <= ? AND u.Fullname = ?
    ORDER BY
      e.Date
  `;

  con.query(query, [startDate, endDate, uName], (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      return res.status(200).json({ timeentries: results });
    } else {
      return res.status(404).json({ error: "No timeentries found" });
    }
  });
});

module.exports = router;

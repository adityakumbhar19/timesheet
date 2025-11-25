import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Timesheet from "./Timesheet/timesheet";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginMDM from "./Login/loginmdm";
import Reports from "./Components/reports";
import { DateProvider } from "./Components/context/dateProvider";
import Register from "./Register/register";
import Userview from "./Userview/userview";

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(""); 
  

  // Check if user is logged in
  const checkLoggedIn = () => {
    const userID = sessionStorage.getItem("userID");
    const username = sessionStorage.getItem("username");
    const userRole = sessionStorage.getItem("role");

    if (userID && username) {
      setLoggedIn(true);
      setUserRole(userRole);

      // Set a timeout to clear sessionStorage after 1 hour
      setTimeout(() => {
        sessionStorage.clear();
        setLoggedIn(false);
        setUserRole("");
        window.location.href = "/login";
      }, 7200000); // 2 hour in milliseconds
    } else {
      setLoggedIn(false);
      setUserRole("");
    }
  };

  // Call checkLoggedIn on component mount
  useEffect(() => {
    checkLoggedIn();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route
            path="/login"
            element={<LoginMDM checkLoggedIn={checkLoggedIn} />}
          />
          {isLoggedIn && (
            <>
              {userRole === "ADMIN" && (
                <Route path="/reports" element={<DateProvider><Reports/></DateProvider>} />
              )}
              {userRole === "ADMIN" && (
                <Route path="/home" element={<Timesheet />} />
              )}
              {userRole === "ADMIN" && (
                <Route path="/profile" element={<Userview />} />
              )}
              {userRole === "Team Leader" && (
                <Route path="/reports" element={<DateProvider><Reports/></DateProvider>} />
              )}
              {userRole === "Team Leader" && (
                <Route path="/home" element={<Timesheet />} />
              )}
              {userRole === "Team Leader" && (
                <Route path="/profile" element={<Userview />} />
              )}
              {userRole === "Team Player" && (
                <Route path="/home" element={<Timesheet />} />
              )}
              {userRole === "Team Player" && (
                <Route path="/profile" element={<Userview />} />
              )}
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

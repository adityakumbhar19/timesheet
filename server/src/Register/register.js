import React from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBRadio,
  MDBValidationItem,
} from "mdb-react-ui-kit";
import "../Login/loginMDM.css";
import { Button } from "@mui/material";
import { registeruser } from "../services/registeruser";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

function Register() {
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [device, setDevice] = useState("");
  const [gpu_status, setGpuStatus] = useState("");
  const [role, setRole] = useState("");
  const [showError, setShowError] = useState(false);
  const [message,setMessage] = useState('');
  const navigate = useNavigate();

  const handleValidation = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (password.length < 8) {
      setShowError(true);
      setMessage('Password must contain 8 characters')
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return false; 
    }
  
    if (!emailRegex.test(email)) {
      setShowError(true);
      setMessage("Enter Valid Email")
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return false; 
    }
  
    if (mobile.length !== 10) {
      setShowError(true);
      setMessage('Mobile No Should Be Of 10 Digits');
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return false; 
    }

    if (
      !fullname ||
      !password ||
      !email ||
      !mobile ||
      !device ||
      !gpu_status ||
      !role
    ) {
      setShowError(true);
      setMessage('All Fields Are Required')
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return false; 
    }
    return true; 
  };
  

  const handleRegister = async () => {
    if (handleValidation()) {
      const resp = await registeruser(
        fullname,
        password,
        role,
        email,
        mobile,
        device,
        gpu_status
      );
      if (resp) {
        navigate("/login");
      } else {
        navigate("/register");
      }
    } else {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }
  };

  return (
    <div style={{display : 'flex', justifyContent : 'center', alignContent : 'center', height : '100vh'}}>
      <MDBContainer fluid>
        <MDBRow className="d-flex justify-content-center align-items-center h-100">
          <MDBCol col="12">
            <MDBCard
              className="bg-dark text-white my-5 mx-auto"
              style={{ borderRadius: "1rem", maxWidth: "800px" }}
            >
              {showError && (
                <Alert severity="error" style={{ justifyContent : 'center'}}>{message}</Alert>
              )}
              <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
                <h2 className="fw-bold mb-2 text-uppercase">Register</h2>
                <p className="text-white-50 mb-5">Please Fill Your Details</p>
                <div style={{ display: "flex", justifyContent: "center"  }}>
                  <label>USERNAME</label>
                  <MDBInput
                    wrapperClass="mb-4 mx-5 w-100"
                    labelClass="text-white"
                    id="formControlLg"
                    type="email"
                    size="lg"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                  <label>EMAIL</label>
                  <MDBInput
                    wrapperClass="mb-4 mx-5 w-100"
                    labelClass="text-white"
                    id="formControlLg"
                    type="email"
                    size="lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <label>PASSWORD</label>
                  <MDBInput
                    wrapperClass="mb-4 mx-5 w-100"
                    labelClass="text-white"
                    id="formControlLg"
                    type="password"
                    size="lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label>MOBILE</label>
                  <MDBInput
                    wrapperClass="mb-4 mx-5 w-100"
                    labelClass="text-white"
                    id="formControlLg"
                    type="number"
                    maxLength={10}
                    size="lg"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      flexDirection: "row",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <label>DEVICE</label>
                    <MDBRadio
                      id="1"
                      name="device"
                      label="DESKTOP"
                      value={"DESKTOP"}
                      onChange={(e) => setDevice(e.target.value)}
                    />
                    <MDBRadio
                      id="2"
                      name="device"
                      label="LAPTOP"
                      value={"LAPTOP"}
                      onChange={(e) => setDevice(e.target.value)}
                    />
                  </div>
                  <div
                    style={{
                      flexDirection: "row",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <label>GPU</label>
                    <MDBRadio
                      id="3"
                      name="gpu"
                      label="YES"
                      value={"YES"}
                      onChange={(e) => setGpuStatus(e.target.value)}
                    />
                    <MDBRadio
                      id="4"
                      name="gpu"
                      label="NO"
                      value={"NO"}
                      onChange={(e) => setGpuStatus(e.target.value)}
                    />
                  </div>
                </div>
                <div
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    gap: "10px",
                    margin: "15px",
                  }}
                >
                  <label>Role</label>
                  <MDBRadio
                    id="5"
                    name="role"
                    label="Team Leader"
                    value={"Team Leader"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <MDBRadio
                    id="6"
                    name="role"
                    label="Team Player"
                    value={"Team Player"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={handleRegister}
                  style={{ margin: "12px", borderRadius : '10px' }}
                >
                  Register
                </Button>
                <div style={{ margin: "10px" }}>
                  <p className="mb-0">
                    Existing user?{" "}
                    <a href="/login" class="text-white-50 fw-bold">
                      Login
                    </a>
                  </p>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Register;

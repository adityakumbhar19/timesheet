import React from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import "./loginMDM.css";
import { Button } from "@mui/material";
import { login } from "../services/login";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

const LoginMDM = ({ checkLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setShowError(true);
      setMessage("Please enter both email and password!");
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }

    const resp = await login(email, password);

    if (resp) {
  
      sessionStorage.setItem("userID", resp.ID);
      sessionStorage.setItem("username", email);
      sessionStorage.setItem("role", resp.role);
      sessionStorage.setItem("name", resp.name);
      checkLoggedIn();
      navigate("/home");
      
    } else {
      setShowError(true);
      setMessage("Invalid Email or Password! Please try again.");
      setTimeout(() => {
        setShowError(false);
        navigate("/login");
      }, 3000);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        height: "100vh",
      }}
    >
      <MDBContainer fluid>
        <MDBRow className="d-flex justify-content-center align-items-center h-100">
          <MDBCol col="12">
            <MDBCard
              className="bg-dark text-white my-5 mx-auto"
              style={{ borderRadius: "1rem", maxWidth: "400px" }}
            >
              {showError && (
                <Alert severity="error" style={{ justifyContent: "center" }}>
                  {message}
                </Alert>
              )}
              <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
                <h2 className="fw-bold mb-2 text-uppercase">Login</h2>

                <p className="text-white-50 mb-5">
                  Please enter your login and password!
                </p>
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
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleLogin}
                  style={{ borderRadius: "10px" }}
                >
                  Login
                </Button>
                <div style={{ margin: "10px" }}>
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <a href="/register" class="text-white-50 fw-bold">
                      Sign Up
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
};

export default LoginMDM;

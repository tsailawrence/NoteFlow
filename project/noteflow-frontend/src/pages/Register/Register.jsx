import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import instance from "../../API/api";
import { SHA256 } from "crypto-js";
import { useParams } from "../../hooks/useParams";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Register.scss";

const Register = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState({}); // user 是 google 回傳的 object, 可以拿去 render profile 頁面
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [alarms, setAlarms] = useState("");
  const navigateTo = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordHashed = SHA256(password).toString();
    const checkPasswordHashed = SHA256(checkPassword).toString();
    const request = {
      user: {
        name: name,
        email: email,
        password: passwordHashed,
      },
    };
    if (passwordHashed !== checkPasswordHashed) {
      alert("Wrong password");
    }
    instance
      .post("/user/register", request)
      .then((res) => {
        navigateTo("/");
      })
      .catch((e) => {
        switch (e.response.status) {
          case 400:
            return setAlarms("Some forms are left unfilled.")
          case 401:
            return setAlarms("This email has already taken.")
          default:
            return setAlarms("Internal server error.")
        }
      });

    //
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="logo">
          <img src="assets/logo.png" alt="" width="190" height="190" />
          <h1>NoteFlow</h1>
        </div>
        <div className="info">
          <h2>Register</h2>
          <div className="infoContainer">
            {Object.keys(user).length === 0 && (
              <>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  style={{ margin: "10px 15px" }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label={t("Name")}
                    name="name"
                    autoComplete="name"
                    autoFocus
                    size="small"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label={t("Email Address")}
                    name="email"
                    autoComplete="email"
                    size="small"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={t("Password")}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    size="small"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={t("Check Password")}
                    type="password"
                    id="check-password"
                    autoComplete="current-password"
                    size="small"
                    onChange={(e) => {
                      setCheckPassword(e.target.value);
                    }}
                  />
                   <div style={{
                    color: 'red',
                    height: '18px',
                    // border: '1px solid black',
                    textAlign: 'left',
                    padding: '0 10px 0 10px',
                  }}>{alarms}</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                      width: "100%",
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{ mt: 2, mb: 2, width: "45%" }}
                      style={{ backgroundColor: "white", color: "black" }}
                      onClick={() => navigateTo("/")}
                    >
                      {t("Cancel")}
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 2, mb: 2, width: "45%" }}
                      style={{ backgroundColor: "#0e1111", color: "white" }}
                    >
                      {t("Register")}
                    </Button>
                  </div>
                  </Box>
                  </>)}


          </div>
        </div>
    </div>
    </div>
  );
};

export { Register };

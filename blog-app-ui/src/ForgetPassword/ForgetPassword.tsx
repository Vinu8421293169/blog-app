import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router";
import { postData } from "../api";
import { FormControl, FormHelperText, Theme } from "@material-ui/core";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textCenter: { textAlign: "center" },
}));

export default function ForgetPassword() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!isResetPassword) {
      if (!email) {
        return setEmailError("email is required");
      }

      if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email
        )
      ) {
        return setEmailError("Invalid email");
      }

      postData("/forgetPassword", {
        email,
      })
        .then((_data) => {
          if (_data.status === "success") {
            return setIsResetPassword(true);
          }

          switch (_data.errorType) {
            case "email":
              setEmailError(_data.message);
              break;
            default:
              setError(_data.message);
          }
        })
        .catch((error) => {
          switch (error.errorType) {
            case "email":
              setEmailError(error.message);
              break;
            default:
              setError(error.message);
          }
        });
    } else {
      const password = e.target.password.value;
      const otp = e.target.otp.value;
      if (!otp) {
        return setOtpError("OTP is required");
      }

      if (password !== e.target.newPassword.value) {
        return setNewPasswordError("New password is not correct");
      }
      postData("/resetPassword", {
        otp,
        email,
        password,
      })
        .then((_data) => {
          if (_data.status === "success") {
            return history.push("/");
          }
          if (_data.errorType === "otp") {
            return setOtpError(_data.message);
          }
          setError(_data.message);
        })
        .catch((error) => {
          if (error.errorType === "otp") {
            setOtpError(error.message);
          }
          console.log(error);
          setError(error.message);
        });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          {(isResetPassword && (
            <>
              <Typography
                component="h1"
                variant="h5"
                className={classes.textCenter}
              >
                Password Reset
              </Typography>
              <FormHelperText className={classes.textCenter}>
                Enter new password and then repeat it
              </FormHelperText>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="otp"
                label="OTP"
                name="otp"
                type="number"
                autoComplete="otp"
                autoFocus
                error={!!otpError}
                helperText={otpError}
                onChange={() => setOtpError("")}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                name="password"
                type="password"
                autoComplete="password"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="newPassword"
                label="New password"
                name="newPassword"
                autoComplete="password"
                autoFocus
                type="password"
                error={!!newPasswordError}
                helperText={newPasswordError}
                onChange={() => setNewPasswordError("")}
              />
              <FormControl component="fieldset" error={!!error}>
                <FormHelperText>{error}</FormHelperText>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Save
              </Button>
            </>
          )) || (
            <>
              <Typography
                component="h1"
                variant="h5"
                className={classes.textCenter}
              >
                Forget your password?
              </Typography>
              <FormHelperText className={classes.textCenter}>
                Enter your email address you use in sign in
              </FormHelperText>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                error={!!emailError}
                helperText={emailError}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
              />
              <FormControl component="fieldset" error={!!error}>
                <FormHelperText>{error}</FormHelperText>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Send OTP
              </Button>
            </>
          )}
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

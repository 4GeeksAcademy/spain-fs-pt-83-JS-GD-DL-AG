import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Google } from "@mui/icons-material";
import "../../styles/Home/loginsignup.css";
import { Context } from "../store/appContext";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../Firebase/Firebase";

export const LoginSignUp = () => {
  const [isActive, setIsActive] = useState(false);

  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorMessage("All fields are required.");
      return;
    }

    const success = await actions.login(formData.email, formData.password);

    if (!success) {
      setErrorMessage(store.errorMessage || "Error logging in.");
      return;
    }

    navigate("/dashboard");
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      console.log("Usuario de Google:", result.user);

      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      setErrorMessage("Error logging in with Google");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const { success, msg } = await actions.signup(formData.username, formData.email, formData.password);

    if (!success) {
      setErrorMessage(msg);
      return;
    }

    setErrorMessage("");
    setSuccessMessage("Registration successful! You can now log in.");
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    navigate("/login");
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  return (
    <Box className="new-login">
      <div className={`container ${isActive ? "active" : ""}`} id="container">
        <div className="form-container sign-up">
          <form onSubmit={handleSubmit}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                background: 'linear-gradient(45deg, #ff9a8b, #ff6a88, #ff99ac)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '500',
                margin: 0,
              }}
            >
              Join LearnVault
            </Typography>
            <Box
              className="social-icons"
              sx={{ display: "flex", gap: 1, marginBottom: 0 }}
            >
              <Button
                variant="outlined"
                startIcon={<Google />}
                onClick={handleGoogleLogin}
              >
                SignUp with Google
              </Button>
            </Box>
            <Typography variant="body2" gutterBottom>
              or use your email for registration
            </Typography>
            <TextField
              fullWidth
              placeholder="Name"
              margin="normal"
              name="username"
              sx={{
                background: 'transparent',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              placeholder="Email"
              margin="normal"
              name="email"
              sx={{
                background: 'transparent',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              type="password"
              placeholder="Password"
              margin="normal"
              name="password"
              sx={{
                background: 'transparent',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              type="password"
              placeholder="Confirm Password"
              margin="normal"
              name="confirmPassword"
              sx={{
                background: 'transparent',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errorMessage && (
              <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
                {errorMessage}
              </Typography>
            )}
            {successMessage && (
              <Typography color="success" variant="body2" sx={{ marginTop: 1 }}>
                {successMessage}
              </Typography>
            )}
            <Button type="submit" variant="contained" fullWidth sx={{ marginTop: 2 }}>
              Sign Up
            </Button>
          </form>
        </div>

        <div className="form-container sign-in">
          <form onSubmit={handleLogin}>
            <Typography variant="h4" component="h1" gutterBottom 
            sx={{
              background: 'linear-gradient(45deg, #ff9a8b, #ff6a88, #ff99ac)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '500',
              margin: 0,
            }}
          >
              Login
            </Typography>
            <Box
              className="social-icons"
              sx={{ display: "flex", marginBottom: 1 }}
            >
              <Button
                variant="outlined"
                startIcon={<Google />}
                onClick={handleGoogleLogin}
                fullWidth
                sx={{ marginTop: "15px" }}
              >
                Sign in with Google
              </Button>
            </Box>
            <Typography variant="body2" gutterBottom>
              or use your email and password
            </Typography>
            <TextField
              fullWidth
              placeholder="Email"
              margin="normal"
              name="email"
              sx={{
                background: 'transparent',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              type="password"
              placeholder="Password"
              margin="normal"
              name="password"
              sx={{
                background: 'transparent',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
              value={formData.password}
              onChange={handleChange}
            />
            <Button variant="contained" fullWidth sx={{ marginTop: 2 }} type="submit">
              Sign In
            </Button>
          </form>
          {errorMessage && (
            <Typography color="error" sx={{ marginTop: 2 }}>
              {errorMessage}
            </Typography>
          )}
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <Typography variant="h5" gutterBottom>
                Welcome Back!
              </Typography>
              <Typography variant="body2" gutterBottom>
                Enter your personal details to use all of the site features
              </Typography>
              <Button
                className="hidden"
                onClick={handleLoginClick}
                variant="contained"
                sx={{background: 'transparent !important'}}
              >
                Sign In
              </Button>
            </div>
            <div className="toggle-panel toggle-right">
              <Typography variant="h5" gutterBottom>
                Hello, Friend!
              </Typography>
              <Typography variant="body2" gutterBottom>
                Register with your personal details to use all of the site features
              </Typography>
              <Button
                className="hidden"
                onClick={handleRegisterClick}
                variant="contained"
                sx={{background: 'transparent !important'}}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};
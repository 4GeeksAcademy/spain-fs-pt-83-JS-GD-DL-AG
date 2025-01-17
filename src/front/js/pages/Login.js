import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Checkbox, FormControlLabel, Grid, Avatar, Link } from '@mui/material';
import "../../styles/login.css"

export const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // To handle error or validation messages
  const [errorMessage, setErrorMessage] = useState('');
  // Update state as the user types in the inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Basic validations and form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple client-side validation
    if (!formData.email || !formData.password) {
      setErrorMessage('All fields are required.');
      return;
    }

    // TODO: Implement API call for user login
    // Example:
    // try {
    //   const response = await fetch('YOUR_LOGIN_API_ENDPOINT', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       email: formData.email,
    //       password: formData.password,
    //     }),
    //   });
    //
    //   const data = await response.json();
    //
    //   if (!response.ok) {
    //     setErrorMessage(data.message || 'Error logging in.');
    //     return;
    //   }
    //
    //   // Save token and redirect
    //   localStorage.setItem('token', data.token);
    //   navigate('/dashboard');
    // } catch (error) {
    //   console.error('Error connecting to the server:', error);
    //   setErrorMessage('Could not connect to the server.');
    // }

    // Placeholder for future implementation
    console.log('Login form submitted:', formData);
    // You can remove the above line when implementing the API call
  };

  return (
    <Grid
      container
      className="login-container"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #c9c9f5, #ffc3a0, #ffe6e6)",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <Grid item>
        <Box
          className="login-card"
          sx={{
            width: "100%",
            maxWidth: "400px",
            padding: "2.5rem",
            borderRadius: "8px",
            backgroundColor: "white",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.4)",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <Typography variant="h5" className="login-card-title">
            Sign in
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="login-input"
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
              sx={{ marginBottom: "20px" }}
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Remember me"
              sx={{ marginBottom: "20px" }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="login-button"
              sx={{
                padding: "10px",
                fontSize: "16px",
                marginBottom: "15px",
              }}
            >
              Sign in
            </Button>
            <Typography variant="body2" className="login-footer">
              Don’t have an account?{" "}
              <Link onClick={() => navigate("/register")} className="login-link">
                Sign up
              </Link>
            </Typography>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
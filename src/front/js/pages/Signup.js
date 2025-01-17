import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Grid, Link } from "@mui/material";
import { CheckCircleOutline, People, School, GroupWork } from "@mui/icons-material"
import "../../styles/Home/signup.css";


export const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // To handle error or validation messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('https://miniature-space-telegram-g45vgq5r75jw3wj94-3001.app.github.dev/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.msg || 'Error registering user.');
        return;
      }

      setErrorMessage('');
      setSuccessMessage('Registration successful! You can now log in.');

      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error connecting to the server:', error);
      setErrorMessage('Could not connect to the server.');
    }
  };

   

  return (
    <Grid container className="signup-container">
      <Grid item xs={12} md={6} className="signup-left">
        <Typography variant="h3" className="signup-title" style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 900,
          fontSize: "2.5rem",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        }}>
          Join LearnVault
        </Typography>
        <Box className="signup-info">
          <Box className="signup-item">
            <CheckCircleOutline className="signup-icon" />
            <Typography className="signup-text">
              <strong>Why join?</strong>
              <br />
              Gain access to cutting-edge features, personalized content, and tools to boost your learning experience.
            </Typography>
          </Box>
          <Box className="signup-item">
            <People className="signup-icon" />
            <Typography className="signup-text">
              <strong>Collaborate effortlessly</strong>
              <br />
              Connect with like-minded learners and share knowledge across a global community.
            </Typography>
          </Box>
          <Box className="signup-item">
            <School className="signup-icon" />
            <Typography className="signup-text">
              <strong>Learn smarter</strong>
              <br />
              Unlock new opportunities with resources tailored to your needs.
            </Typography>
          </Box>
          <Box className="signup-item">
            <GroupWork className="signup-icon" />
            <Typography className="signup-text">
              <strong>Work together</strong>
              <br />
              Build stronger connections with powerful collaboration tools.
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} md={6} className="signup-right">
        <Box className="signup-card">
          <Typography variant="h5" className="signup-card-title" sx={{ marginBottom: "20px" }}>
            Create an Account
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="signup-input"
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="signup-input"
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
              className="signup-input"
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="signup-input"
              sx={{ marginBottom: "20px" }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="signup-button"
              sx={{ marginBottom: "20px" }}
            >
              Sign up
            </Button>
            {errorMessage && (
              <Typography className="signup-error">
                {errorMessage}
              </Typography>
            )}
            <Typography variant="body2" className="signup-footer">
              Already have an account?{" "}
              <Link onClick={() => navigate("/login")} className="signup-link">
                Sign in
              </Link>
            </Typography>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}
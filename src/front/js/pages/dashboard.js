// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { OrganizationPlanning } from "../component/dashboard/OrganizationPlanning";
import { Gamification } from "../component/dashboard/Gamification";
import "../../styles/Dashboard/dashboard.css";
import axios from "axios";


export const Dashboard = () => {
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [user, setUser] = useState(null); // Store user information
  const [dashboardMessage, setDashboardMessage] = useState(""); // Store dashboard data
  const [searchMessage, setSearchMessage] = useState(""); // Store search data

  const handleOpenProfile = () => setOpenProfileModal(true);
  const handleCloseProfile = () => setOpenProfileModal(false);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(process.env.BACKEND_URL + "/api/login", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDashboardMessage(response.data.message);
    } catch (error) {
      console.error("Error fetching dashboard data:", error.response?.data || error);
    }
  };

  // Fetch search data
  const fetchSearchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(process.env.BACKEND_URL + "/api/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchMessage(response.data.message);
    } catch (error) {
      console.error("Error fetching search data:", error.response?.data || error);
    }
  };

  useEffect(() => {
    // Authenticate and fetch data on component mount
    fetchDashboardData();
    fetchSearchData();
  }, []);

  return (
    <Box className="dashboard-container">
      <header className="dashboard-header">
        <h1>LearnVault</h1>
        <nav className="navbar-links">
          <a href="#features">FEATURES</a>
          <a href="#experiences">EXPERIENCES</a>
          <Button variant="contained" onClick={handleOpenProfile}>
            PERFIL
          </Button>
        </nav>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-section">
          <h2>Organización y Planificación</h2>
          <OrganizationPlanning />
        </section>

        <section className="dashboard-section">
          <h2>Gamificación y Logros</h2>
          <Gamification />
        </section>

        <section className="dashboard-section">
          <h2>Favoritos</h2>
          <div className="favorites-container">
            <p>Aquí estarán tus recursos favoritos.</p>
          </div>
        </section>
      </main>

      <Modal open={openProfileModal} onClose={handleCloseProfile}>
        <Box className="modal-profile">
          <Typography variant="h6">Perfil de Usuario</Typography>
          <Typography variant="body1">Nombre: Usuario</Typography>
          <Typography variant="body1">Email: usuario@learnvault.com</Typography>
          <Button variant="outlined" onClick={handleCloseProfile}>
            Cerrar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

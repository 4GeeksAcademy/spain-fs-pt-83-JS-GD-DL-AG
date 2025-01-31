import React, { useState, useContext, useEffect } from "react";
import {
  Box, Typography, Avatar, Button, Modal, TextField,
  IconButton, CircularProgress, Divider
} from "@mui/material";
import { motion } from "framer-motion";
import { Context } from "../store/appContext";
import { useNavigate, Routes, Route } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import UploadIcon from "@mui/icons-material/Upload";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EditIcon from "@mui/icons-material/Edit";
import { Search } from "../pages/Search";
import { FavoritesList } from "../component/dashboard/FavoritesList";
import { GamificationHub } from "../component/dashboard/GamificationHub";
import { UploadFile } from "../component/dashboard/UploadFile"

export const Dashboard = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!store.token || !store.user?.id) {
      console.error("No token or user ID found, redirecting to login.");
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/user/${store.user.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${store.token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [store.token, store.user?.id, navigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!userData?.username || !userData?.email) {
      console.error("🚨 Username or email is missing.");
      return;
    }

    const updatedData = {
      username: String(userData.username).trim(),
      email: String(userData.email).trim(),
    };

    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/user/${store.user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${store.token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        console.error("❌ Failed to update user data:", result);
        return;
      }

      setUserData(result);
      handleCloseModal();
    } catch (error) {
      console.error("🔥 Error updating user data:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", background: "linear-gradient(45deg, #ff9a8b, #ff6a88, #ff99ac)" }}>
      {/* Botón para abrir/cerrar Sidebar */}
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: "fixed",
          top: 20,
          left: isSidebarOpen ? 260 : 20,
          zIndex: 10,
          backgroundColor: "#1e1e2e",
          color: "white",
          borderRadius: "50%",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          transition: "left 0.3s ease-in-out",
          "&:hover": { backgroundColor: "#333" },
        }}
      >
        {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: isSidebarOpen ? 0 : -260 }}
        transition={{ duration: 0.3 }}
        style={{
          width: "250px",
          height: "100%",
          background: "#1e1e2e",
          color: "white",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          boxShadow: "3px 0 10px rgba(0, 0, 0, 0.2)",
          position: "fixed",
          left: isSidebarOpen ? 0 : -250,
          top: 0,
          transition: "left 0.3s ease-in-out",
        }}
      >
        {/* Perfil del Usuario */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
          <Avatar src={userData?.avatar || "https://randomuser.me/api/portraits/men/45.jpg"} sx={{ width: 80, height: 80, mb: 2 }} />
          <Typography variant="h6">{userData?.username || "No Name"}</Typography>
          <Typography variant="body2">{userData?.email || "No Email"}</Typography>

          {/* Botón para Editar Perfil */}
          <Button
            startIcon={<EditIcon />}
            onClick={handleOpenModal}
            sx={{ color: "white", mt: 2, background: "#ff6a88", ":hover": { background: "#e85c7b" } }}
          >
            Edit Profile
          </Button>
        </Box>

        <Divider sx={{ backgroundColor: "#444", my: 3 }} />

        {/* Botón Back to Dashboard */}
        <Button startIcon={<DashboardIcon />} onClick={() => navigate("/dashboard")} sx={{ color: "white", justifyContent: "flex-start", mt: 1 }}>
          Back to Dashboard
        </Button>

        {/* Botones de Navegación */}
        <Button startIcon={<SearchIcon />} onClick={() => navigate("/dashboard/search")} sx={{ color: "white", justifyContent: "flex-start", mt: 1 }}>
          Search Resources
        </Button>
        <Button startIcon={<UploadIcon />} onClick={() => navigate("/dashboard/upload")} sx={{ color: "white", justifyContent: "flex-start", mt: 1 }}>
          Upload Resources
        </Button>
        <Button startIcon={<FavoriteIcon />} onClick={() => navigate("/dashboard/favorites")} sx={{ color: "white", justifyContent: "flex-start", mt: 1 }}>
          Favorites
        </Button>
      </motion.div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ width: 400, bgcolor: "white", p: 4, borderRadius: "10px", mx: "auto", mt: "10%" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Edit Profile</Typography>
          <TextField fullWidth label="Username" name="username" value={userData?.username || ""} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Email" name="email" value={userData?.email || ""} onChange={handleChange} sx={{ mb: 2 }} />
          <Button fullWidth variant="contained" onClick={handleUpdate} sx={{ background: "#ff6a88" }}>
            Save Changes
          </Button>
        </Box>
      </Modal>

      {/* Contenido Principal */}
      <Box sx={{
        flex: 1,
        padding: "30px",
        overflowY: "auto",
        marginLeft: isSidebarOpen ? "250px" : "0px",
        transition: "margin-left 0.3s ease-in-out"
      }}>
        {loading ? <CircularProgress /> : (
          <>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#fff" }}>
              Welcome, {userData?.username || "Loading..."}!
            </Typography>

            {/* Aquí se definen las rutas dentro del Dashboard */}
            <Routes>
              {/* Vista por defecto: Gamificación y Favoritos */}
              <Route path="/" element={
                <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                  <Box sx={{ background: "#fff", padding: "20px", borderRadius: "12px", flex: 1 }}>
                  <GamificationHub userId={userId} />
                  </Box>
                  <Box sx={{ background: "#fff", padding: "20px", borderRadius: "12px", flex: 1 }}>
                    <FavoritesList />
                  </Box>
                </Box>
              } />

              {/* Nueva vista de búsqueda dentro del Dashboard */}
              <Route path="/search" element={<Search />} />
              <Route path="/upload" element={<UploadFile />} />
              <Route path="/Favorites" element={<FavoritesList />} />
            </Routes>
          </>
        )}
      </Box>
    </Box>
  );
};

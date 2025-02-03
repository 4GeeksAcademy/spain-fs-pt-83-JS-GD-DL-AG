import React, { useState, useContext, useEffect } from "react";
import {
  Box, Typography, Avatar, Button, Modal, TextField,
  IconButton, CircularProgress, Divider
} from "@mui/material";
import { motion } from "framer-motion";
import { Context } from "../store/appContext";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import UploadIcon from "@mui/icons-material/Upload";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";

export const Dashboard = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false); // ✅ Estado del modal
  const userId = localStorage.getItem("userId");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

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
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [store.token, store.user?.id, navigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleOpenModal = () => {
    if (userData) setOpenModal(true); // ✅ Solo abrir modal si `userData` está disponible
  };
  const handleCloseModal = () => setOpenModal(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!userData?.username || !userData?.email) {
      console.error("🚨 Username or email is missing.");
      return;
    }

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/user/${store.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.token}`,
        },
        body: JSON.stringify({
          username: userData.username.trim(),
          email: userData.email.trim(),
        }),
      });

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

  // Simulación de documentos en el dashboard (Reemplazar con datos reales si los tienes)
  const documents = [
    { id: 1, title: "React Basics", type: "Article" },
    { id: 2, title: "Advanced JavaScript", type: "Video" },
    { id: 3, title: "CSS Tricks", type: "Blog Post" },
  ];

  // Verifica si un documento ya está en favoritos
  const isFavorite = (id) => store.favorites.some((fav) => fav.id === id);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        position: "relative",
        width: "100%",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",

        "::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(45deg, #ff9a8b, #ff6a88, #ff99ac, #ffb199, #ffc3a0)",
          backgroundSize: "400% 400%",
          animation: "gradientAnimation 10s ease infinite",
          zIndex: -1,
        },

        "@keyframes gradientAnimation": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        }
      }}
    >
{/* Botón para abrir el Sidebar cuando está cerrado */}
{!isSidebarOpen && (
  <IconButton
    onClick={toggleSidebar}
    sx={{
      position: "fixed",
      top: 20,
      left: 20,
      zIndex: 1100,
      backgroundColor: "#1e1e2e",
      color: "white",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
      transition: "background 0.3s",
      "&:hover": { backgroundColor: "#333" },
    }}
  >
    <MenuIcon />
  </IconButton>
)}

<motion.div
  initial={{ x: -250 }}
  animate={{ x: isSidebarOpen ? 0 : "-100%" }}
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
    left: isSidebarOpen ? 0 : "-100%",
    top: 0,
    transition: "left 0.2s ease-in-out",
    zIndex: 1000,
  }}
>
  {/* 🔵 Botón de Cerrar dentro del Sidebar */}
  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
    <IconButton
      onClick={toggleSidebar}
      sx={{
        backgroundColor: "transparent",
        color: "white",
        borderRadius: "50%",
        transition: "background 0.2s",
        "&:hover": { backgroundColor: "#333" },
      }}
    >
      <CloseIcon />
    </IconButton>
  </Box>

  {/* Perfil del Usuario */}
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
    <Avatar src={userData?.avatar || "https://images.squarespace-cdn.com/content/v1/54b7b93ce4b0a3e130d5d232/1519986430884-H1GYNRLHN0VFRF6W5TAN/icon.png?format=750w"} sx={{ width: 80, height: 80, mb: 2 }} />
    <Typography variant="h6">{userData?.username || "No Name"}</Typography>
    <Typography variant="body2">{userData?.email || "No Email"}</Typography>
    {/* Botón para Editar Perfil */}
    <Button
      onClick={handleOpenModal}
      sx={{
        color: "white",
        mt: 2,
        background: "#ff6a88",
        ":hover": { background: "#e85c7b" },
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        minWidth: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
    >
      <EditIcon fontSize="small" />
    </Button>
  </Box>

  <Divider sx={{ my: 3 }} />

  {/* Botones de Navegación */}
  <Button startIcon={<DashboardIcon />} onClick={() => navigate("/dashboard")} sx={{ color: "white", justifyContent: "flex-start", mt: 1 }}>
    Dashboard
  </Button>
  <Button startIcon={<SearchIcon />} onClick={() => navigate("/dashboard/search")} sx={{ color: "white", justifyContent: "flex-start", mt: 1 }}>
    Search Resources
  </Button>
  <Button startIcon={<UploadIcon />} onClick={() => navigate("/dashboard/upload")} sx={{ color: "white", justifyContent: "flex-start", mt: 1 }}>
    Upload Resources
  </Button>
  <Button startIcon={<FavoriteIcon />} onClick={() => navigate("/dashboard/favorites")} sx={{ color: "white", justifyContent: "flex-start", mt: 1 }}>
    Favorites
  </Button>

  <Divider sx={{ my: 3 }} />

  {/* Botón de Logout */}
  <Button
    startIcon={<LogoutIcon />}
    onClick={() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      actions.logout?.();
      navigate("/login");
    }}
    sx={{
      color: "white",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      fontWeight: "bold",
      display: "flex",
      mt: "auto",
      background: "#ff6a88",
      ":hover": { background: "#e85c7b" },
      position: "absolute",
      bottom: 20,
      left: 20,
      width: "calc(100% - 40px)",
    }}
  >
    Logout
  </Button>
</motion.div>

      {/* ✅ Modal Restaurado y Funcional */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          width: 400,
          bgcolor: "white",
          p: 4,
          borderRadius: "10px",
          mx: "auto",
          mt: "10%",
          boxShadow: 24
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Edit Profile</Typography>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={userData?.username || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={userData?.email || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <Button fullWidth variant="contained" onClick={handleUpdate} sx={{ background: "#ff6a88" }}>
            Save Changes
          </Button>
        </Box>
      </Modal>

      {/* Contenido Principal */}
      <Box
        sx={{
          flex: 1,
          padding: "30px",
          overflowY: "auto",
          marginLeft: isSidebarOpen ? "250px" : "0px",
          transition: "margin-left 0.3s ease-in-out"
        }}
      >
        {location.pathname === "/dashboard" && (
      <Typography
        sx={{
          marginLeft: 5,
          fontFamily: "'Poppins', sans-serif",
          fontSize: "2em",
          fontWeight: 900,
          color: "white",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        Welcome {user?.username || localUser?.username || "User"}
      </Typography>
    )}
        <Outlet />
      </Box>
    </Box>
  );
};


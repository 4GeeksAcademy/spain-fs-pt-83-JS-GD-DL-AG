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
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EditIcon from "@mui/icons-material/Edit";
import { Search } from "../pages/Search";
import { FavoritesList } from "../component/dashboard/FavoritesList";
import { GamificationHub } from "../component/dashboard/GamificationHub";
import { UploadFile } from "../component/dashboard/UploadFile";

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

  // Simulación de documentos en el dashboard (Reemplazar con datos reales si los tienes)
  const documents = [
    { id: 1, title: "React Basics", type: "Article" },
    { id: 2, title: "Advanced JavaScript", type: "Video" },
    { id: 3, title: "CSS Tricks", type: "Blog Post" },
  ];

  // Verifica si un documento ya está en favoritos
  const isFavorite = (id) => store.favorites.some((fav) => fav.id === id);

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

      {/* Contenido Principal */}
      <Box sx={{ flex: 1, padding: "30px", overflowY: "auto", marginLeft: isSidebarOpen ? "250px" : "0px", transition: "margin-left 0.3s ease-in-out" }}>
        {loading ? <CircularProgress /> : (
          <>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#fff" }}>
              Welcome, {userData?.username || "Loading..."}!
            </Typography>

            {/* Sección de Documentos en el Dashboard */}
            <Box sx={{ display: "flex", gap: 2, flexDirection: "column", marginTop: 4 }}>
              {documents.map((doc) => (
                <Box key={doc.id} sx={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: 3 }}>
                  <Typography variant="h6">{doc.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Type: {doc.type}
                  </Typography>

                  {/* Botón de Favoritos */}
                  <Button
                    variant="contained"
                    color={isFavorite(doc.id) ? "error" : "primary"}
                    onClick={() => {
                      isFavorite(doc.id) ? actions.removeFavorite(doc.id) : actions.addFavorite(doc);
                    }}
                    startIcon={isFavorite(doc.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    sx={{ marginTop: 1 }}
                  >
                    {isFavorite(doc.id) ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                </Box>
              ))}
            </Box>

            {/* Rutas dentro del Dashboard */}
            <Routes>
              <Route path="/search" element={<Search />} />
              <Route path="/upload" element={<UploadFile />} />
              <Route path="/favorites" element={<FavoritesList />} />
            </Routes>
          </>
        )}
      </Box>
    </Box>
  );
};


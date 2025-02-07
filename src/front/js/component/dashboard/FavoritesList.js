import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  TableContainer,
  ListItemText,
  Avatar,
  CircularProgress,
  Alert,
  Button,
  Paper,
  IconButton,
  Typography,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { OpenInNew, Delete, Favorite } from "@mui/icons-material"
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  marginTop: theme.spacing(2),
  background: "transparent",
  boxShadow: "none",
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "none",
  background: "transparent",
}));

export const FavoritesList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 1200px)");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token en localStorage.");
        const response = await fetch(`${process.env.BACKEND_URL}/api/favorites`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
        const data = await response.json();
        setFavorites(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleDeleteFavorite = async (favoriteId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.BACKEND_URL}/api/favorites/${favoriteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error eliminando favorito");
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== favoriteId));
    } catch (error) {
      console.error("Error eliminando favorito:", error);
    }
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Box sx={{ position: "relative" }}>
        {!isMobile && (
          <Favorite
            sx={{
              position: "absolute",
              top: -25,
              left: -0,
              fontSize: 100,
              color: "#ff6a88",
              transform: "rotate(-20deg)",
              zIndex: 1000,
              transition: "all 0.3s ease-in-out",
              pointerEvents: "auto",
              "&:hover": {
                transform: "rotate(0deg) scale(1.1)",
                color: "#ff99ac",
              },
            }}
          />
        )}
      </Box>
      <StyledCard>
        <Box sx={{ flex: 1, textAlign: "center", overflow: "hidden", }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#ff6a88", paddingTop: "24px" }}>
            Favorite Resources
          </Typography>
        </Box>
        <CardContent
          sx={{  mb: 0, pb: 0,
            maxHeight: 400,
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255, 106, 136, 0.5)",
              borderRadius: 3,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&:hover::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255, 106, 136, 0.8)",
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : favorites.length === 0 ? (
            <Alert severity="info">You don't have any favorites yet.</Alert>
          ) : (
            <List sx={{ width: "100%", bgcolor: "background.paper", borderRadius: 2, }}>
              {favorites.map((fav, index) => (
                <React.Fragment key={fav.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => navigate("/dashboard/favorites")}
                      >
                        <ArrowForwardIosIcon />
                      </IconButton>
                    }
                    sx={{
                      borderRadius: 3,
                      mb: 1,
                      p: 1,
                      boxShadow: 3,
                      "&:hover": {
                        backgroundColor: "#f8f8f8",
                        transform: "scale(1.02)",
                      },
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={fav.image_url || "https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2021/12/22/16401922123443.jpg"}
                        sx={{ width: 48, height: 48, borderRadius: 1 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {fav.document_title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {fav.document_type}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < favorites.length - 1 && <Divider sx={{ color: "transparent"}} />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>

      </StyledCard>
    </Box>
  );
};

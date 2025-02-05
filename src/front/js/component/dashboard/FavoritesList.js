import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import { OpenInNew, Delete, Favorite } from "@mui/icons-material"
import { styled } from "@mui/material/styles";

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
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token en localStorage.");
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorites`, {
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
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorites/${favoriteId}`, {
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
              top: -5,
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
        <Box sx={{ flex: 1, textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#ff6a88", paddingTop: "24px" }}>
            Favorite Resources
          </Typography>
        </Box>
        <CardContent>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : favorites.length === 0 ? (
            <Alert severity="info">You don't have any favorites yet.</Alert>
          ) : (
            <StyledTableContainer component={Paper} elevation={0} sx={{ backgroundColor: "transparent" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1" sx={{ color: "#ff6a88" }}>
                        <strong>Title</strong>
                      </Typography>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Typography variant="subtitle1" sx={{ color: "#ff6a88" }}>
                          <strong>Type</strong>
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell align="center">
                      <Typography variant="subtitle1" sx={{ color: "#ff6a88" }}>
                        <strong>Actions</strong>
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {favorites.map((fav) => (
                    <TableRow key={fav.id}>
                      <TableCell>{fav.document_title}</TableCell>
                      {!isMobile && <TableCell>{fav.document_type}</TableCell>}
                      <TableCell align="center">
                        <Tooltip title="Open document">
                          <Button
                            variant="contained"
                            size="small"
                            href={`/document/${fav.document_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<OpenInNew />}
                            sx={{ marginRight: "8px", backgroundColor: "#ff6a88", color: "white", "&:hover": { backgroundColor: "#ff99ac" } }}
                          >
                            Open
                          </Button>
                        </Tooltip>
                        <Tooltip title="Remove from favorites">
                          <IconButton color="error" onClick={() => handleDeleteFavorite(fav.id)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          )}
        </CardContent>
      </StyledCard>
    </Box>
  );
};

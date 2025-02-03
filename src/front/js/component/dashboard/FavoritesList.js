import React, { useEffect, useState } from "react";
import { 
  Card, CardContent, CardHeader, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, CircularProgress, Alert, 
  Button, Paper, IconButton 
} from "@mui/material";
import { OpenInNew, Delete } from "@mui/icons-material";

export const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 📌 Cargar favoritos desde la API
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) throw new Error("No hay token en localStorage.");

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorites`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(`Error en la API: ${response.status} ${response.statusText}`);

        const data = await response.json();
        console.log("Respuesta API:", data);

        setFavorites(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error obteniendo favoritos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // 🗑️ Eliminar favorito
  const handleDeleteFavorite = async (favoriteId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorites/${favoriteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error eliminando favorito");

      // ❌ Filtrar el favorito eliminado
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== favoriteId));
    } catch (error) {
      console.error("Error eliminando favorito:", error);
    }
  };

  return (
    <Card sx={{ width: "100%", p: 2, borderRadius: 4, marginTop: 2, boxShadow: 3 }}>
      <CardHeader title="Favorite Resources" sx={{ textAlign: "center", fontWeight: "bold" }} />
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <CircularProgress />
          </div>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : favorites.length === 0 ? (
          <Alert severity="info">You don't have any favorites yet.</Alert>
        ) : (
          <TableContainer component={Paper}>
            {console.log("Datos recibidos en favorites:", favorites)}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Type</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {favorites.map((fav) => (
                  <TableRow key={fav.id}>
                    <TableCell>{fav.document_title}</TableCell>
                    <TableCell>{fav.document_type}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        href={`/document/${fav.document_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<OpenInNew />}
                        sx={{ marginRight: "8px" }}
                      >
                        Open document
                      </Button>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteFavorite(fav.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Button, Paper } from "@mui/material";
import { OpenInNew } from "@mui/icons-material";

export const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
  
        if (!token) {
          throw new Error("No hay token en localStorage.");
        }
  
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/favorites`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
  
        if (!response.ok) {
          throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log("Respuesta API:", data); // 🔍 LOG IMPORTANTE
        setFavorites(Array.isArray(data) ? data : []); // 🔹 Evita que se rompa el código si data no es un array
      } catch (err) {
        console.error("Error obteniendo favoritos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFavorites();
  }, []);

  return (
    <Card sx={{ width: "100%", p: 2, boxShadow: 3, borderRadius: 4, marginTop: 2, }}>
      <CardHeader title="Favorite Resources" sx={{ textAlign: "center", fontWeight: "bold" }} />
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <CircularProgress />
          </div>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : favorites.length === 0 ? (
          <Alert severity="info">You dont have any favorites yet.</Alert>
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
                      >
                        Open document
                      </Button>
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
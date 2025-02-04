import React, { useContext, useEffect } from "react";
import { Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Button, Paper, IconButton } from "@mui/material";
import { OpenInNew, Delete } from "@mui/icons-material";
import { Context } from "../../store/appContext"; // Importamos el contexto global

export const FavoritesList = () => {
  const { store, actions } = useContext(Context);

  // 🔹 Llamamos a `getFavorites` al cargar el componente
  useEffect(() => {
    actions.getFavorites();
  }, []);

  // ✅ Siempre aseguramos que `favorites` es un array antes de usar `.length`
  const favorites = Array.isArray(store.favorites) ? store.favorites : [];

  console.log("📌 Favoritos desde el contexto:", favorites);

  return (
    <Card sx={{ width: "100%", p: 2, boxShadow: 3, borderRadius: 4, marginTop: 2 }}>
      <CardHeader title="Favorite Resources" sx={{ textAlign: "center", fontWeight: "bold" }} />
      <CardContent>
        {store.errorMessage ? (
          <Alert severity="error">{store.errorMessage}</Alert>
        ) : favorites.length === 0 ? (
          <Alert severity="info">You don't have any favorites yet.</Alert>
        ) : (
          <TableContainer component={Paper}>
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
                      <IconButton
                        color="error"
                        onClick={() => actions.removeFavorite(fav.id)}
                        sx={{ marginLeft: 1 }}
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




import React, { useContext } from "react";
import { Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Button, Paper, IconButton } from "@mui/material";
import { OpenInNew, Delete } from "@mui/icons-material";
import { Context } from "../../store/appContext"; // Importar el contexto global

export const FavoritesList = () => {
  // Acceder al estado global usando Context
  const { store, actions } = useContext(Context);

  const { favorites } = store; // Extraer los favoritos del store

  return (
    <Card sx={{ width: "100%", p: 2, boxShadow: 3, borderRadius: 4, marginTop: 2 }}>
      <CardHeader title="Favorite Resources" sx={{ textAlign: "center", fontWeight: "bold" }} />
      <CardContent>
        {store.loading ? (
          <div className="flex justify-center items-center py-4">
            <CircularProgress />
          </div>
        ) : store.errorMessage ? (
          <Alert severity="error">{store.errorMessage}</Alert>
        ) : favorites.length === 0 ? (
          <Alert severity="info">You don't have any favorites yet.</Alert>
        ) : (
          <TableContainer component={Paper}>
            {console.log("Datos recibidos en favorites desde store:", favorites)}
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

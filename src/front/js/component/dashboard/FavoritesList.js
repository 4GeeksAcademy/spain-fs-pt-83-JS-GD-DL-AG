import React, { useEffect, useContext } from "react";
import { 
  Card, CardContent, CardHeader, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, CircularProgress, Alert, 
  Button, Paper, IconButton 
} from "@mui/material";
import { OpenInNew, Delete } from "@mui/icons-material";
import { Context } from "../../store/appContext"; // Importar el contexto global

export const FavoritesList = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getFavorites(); // ✅ Llamamos a la función para cargar los favoritos
    }, []);

    // 🗑️ Función para eliminar un favorito
    const handleDeleteFavorite = (favoriteId) => {
        actions.removeFavorite(favoriteId);
    };

    return (
        <Card sx={{ width: "100%", p: 2, borderRadius: 4, marginTop: 2, boxShadow: 3 }}>
            <CardHeader title="Favorite Resources" sx={{ textAlign: "center", fontWeight: "bold" }} />
            <CardContent>
                {store.errorMessage ? (
                    <Alert severity="error">{store.errorMessage}</Alert>
                ) : store.favorites.length === 0 ? (
                    <Alert severity="info">You don't have any favorites yet.</Alert>
                ) : (
                    <TableContainer component={Paper}>
                        {console.log("Datos recibidos en favorites:", store.favorites)}
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Title</strong></TableCell>
                                    <TableCell><strong>Type</strong></TableCell>
                                    <TableCell align="center"><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {store.favorites.map((fav) => (
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


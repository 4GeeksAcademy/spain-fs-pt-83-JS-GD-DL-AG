import React, { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    Modal,
    IconButton,
    TextField,
    Select,
    MenuItem,
    Pagination,
    Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { TypingEffect } from "../component/dashboard/TypingEffect";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/documents`;
const FAVORITES_API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/favorites`;

export const FavoritesSearch = () => {
    const [favorites, setFavorites] = useState([]);
    const [filteredFavorites, setFilteredFavorites] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [subject, setSubject] = useState("All");
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await fetch(FAVORITES_API_URL, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch favorites");

                const favoritesData = await response.json();
                if (!Array.isArray(favoritesData)) return;

                const documentsResponse = await fetch(API_URL, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!documentsResponse.ok) throw new Error("Failed to fetch documents");

                const allDocuments = await documentsResponse.json();
                const completeFavorites = allDocuments.filter((doc) =>
                    favoritesData.some((fav) => fav.document_id === doc.id)
                );

                setFavorites(completeFavorites);
                setFilteredFavorites(completeFavorites);
            } catch (error) {
                console.error("Error fetching favorites:", error);
                setFavorites([]);
            }
        };

        fetchFavorites();
    }, []);

    useEffect(() => {
        const filtered = favorites.filter((doc) =>
            doc.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredFavorites(filtered);
    }, [searchQuery, favorites]);

    const handleRemoveFavorite = async (doc) => {
        if (!doc || !doc.id) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(FAVORITES_API_URL, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to fetch favorites");

            const favoritesData = await response.json();
            if (!Array.isArray(favoritesData)) return;

            const favoriteToDelete = favoritesData.find((fav) => fav.document_id === doc.id);

            if (!favoriteToDelete) {
                console.error("❌ Favorite not found for document:", doc.id);
                return;
            }

            const deleteResponse = await fetch(`${FAVORITES_API_URL}/${favoriteToDelete.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!deleteResponse.ok) throw new Error("Failed to remove favorite");

            console.log(`✅ Removed favorite ${favoriteToDelete.id} from API`);

            setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteToDelete.document_id));
            setFilteredFavorites((prev) => prev.filter((fav) => fav.id !== favoriteToDelete.document_id));

        } catch (error) {
            console.error("🔥 Error removing favorite:", error);
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleOpenModal = (doc) => {
        console.log("Opening modal with document:", doc);
        if (!doc) return;

        setSelectedDocument(doc);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedDocument(null);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFavorites.slice(indexOfFirstItem, indexOfLastItem);


    return (
        <Box
            sx={{
                borderRadius: 4,
                padding: 3,
                backgroundColor: "#ffffff",
                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2), 0px -5px 15px rgba(0, 0, 0, 0.1)",
                overflow: "visible",
                margin: "20px auto",
                maxWidth: "90%",
            }}
        >
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "center", }}>
                    <TypingEffect text="My Favourite Resources" speed={80} />
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Search by title"
                        variant="outlined"
                        fullWidth
                        sx={{
                            backgroundColor: "white",
                            borderRadius: 6,
                            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease-in-out",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 6,
                                height: "55px",
                                padding: "0px",
                                fontSize: "14px",
                                "& input": {
                                    padding: "8px 12px",
                                    fontSize: "14px",
                                },
                                "& fieldset": {
                                    borderColor: "#ff6a88",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#ff6a88",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#ff6a88",
                                    boxShadow: "0px 0px 12px rgba(255, 106, 136, 0.3)",
                                },
                            },
                        }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Box>
                {filteredFavorites.length === 0 && (
                    <Typography variant="h6" sx={{ textAlign: "center", color: "#ff6a88", mt: 4 }}>
                        No favorites found. Start adding some!
                    </Typography>
                )}
                <Grid container spacing={3}>
                    {filteredFavorites.slice(indexOfFirstItem, indexOfLastItem).map((doc) => (
                        <Grid item key={`${doc.id}-${favorites.length}`} xs={12} sm={6} md={4}>
                            <Card sx={{ cursor: "pointer", boxShadow: 3, borderRadius: 2, position: "relative" }}>
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveFavorite(doc);
                                    }}
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        backgroundColor: "white",
                                        borderRadius: "50%",
                                        boxShadow: 2,
                                        transition: "0.3s ease-in-out",
                                        "&:hover": {
                                            backgroundColor: "white",
                                            boxShadow: "0px 0px 10px rgba(255, 0, 0, 0.5)",
                                            transform: "scale(1.1)",
                                            opacity: 1,
                                        },
                                    }}
                                >
                                    <FavoriteIcon color="error" />
                                </IconButton>

                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={doc.image_url || "https://via.placeholder.com/150"}
                                    alt={doc.title}
                                    onClick={() => handleOpenModal(doc)}
                                />

                                <CardContent onClick={() => handleOpenModal(doc)}>
                                    <Typography variant="h6" sx={{ fontWeight: "bold", fontFamily: "'Poppins', sans-serif" }}>
                                        {doc.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                                        {doc.description}
                                    </Typography>
                                    <Typography variant="subtitle2" color="primary" sx={{ mt: 1, fontFamily: "'Poppins', sans-serif" }}>
                                        📁 {doc.subject}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}

                </Grid>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Pagination
                        count={Math.ceil(filteredFavorites.length / itemsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        sx={{
                            "& .MuiPaginationItem-root": {
                                color: "#ff6a88",
                            },
                            "& .MuiPaginationItem-page.Mui-selected": {
                                backgroundColor: "#ff6a88",
                                color: "white",
                                "&:hover": {
                                    backgroundColor: "#ff9a8b",
                                },
                            },
                            "& .MuiPaginationItem-page:hover": {
                                backgroundColor: "#ff99ac",
                            },
                        }}
                    />
                </Box>
                <Modal open={openModal} onClose={handleCloseModal}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "80%",
                            maxWidth: "800px",
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            borderRadius: 3,
                            p: 3,
                        }}
                    >
                        <IconButton
                            onClick={handleCloseModal}
                            sx={{ position: "absolute", top: 10, right: 10 }}
                        >
                            <CloseIcon />
                        </IconButton>
                        {selectedDocument && (
                            <>
                                <Typography variant="h5" sx={{ mb: 2 }}>
                                    {selectedDocument.title}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {selectedDocument.description}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ color: "gray", mb: 2 }}>
                                    📁 {selectedDocument.subject} | 📄 {selectedDocument.type}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ color: "gray", mb: 2 }}>
                                    👤 Uploaded by: {selectedDocument.uploaded_by || "Unknown"}
                                </Typography>
                                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                    <iframe
                                        src={selectedDocument.src_url}
                                        title={selectedDocument.title}
                                        width="100%"
                                        height="400px"
                                        style={{ border: "none" }}
                                        allowFullScreen
                                    ></iframe>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                    {selectedDocument && (
                                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                            {(() => {
                                                const isFavorite = favorites.some((fav) => fav.document_id === selectedDocument.id);
                                                console.log("Checking favorite status in Modal:", selectedDocument, "isFavorite:", isFavorite);

                                                return (
                                                    <Button
                                                        variant="contained"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveFavorite(selectedDocument);
                                                            handleCloseModal();
                                                        }}
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            gap: "8px",
                                                            backgroundColor: isFavorite ? "#e85c7b" : "#ff6a88",
                                                            color: "white",
                                                            fontWeight: "bold",
                                                            borderRadius: "8px",
                                                            padding: "8px 16px",
                                                            textTransform: "none",
                                                            "&:hover": { backgroundColor: isFavorite ? "#d34b5f" : "#e85c7b" },
                                                        }}
                                                    >
                                                        <FavoriteIcon sx={{ fontSize: 20 }} />
                                                    </Button>
                                                );
                                            })()}
                                        </Box>
                                    )}
                                </Box>
                            </>
                        )}
                    </Box>
                </Modal>
            </Box >
        </Box>
    );
};
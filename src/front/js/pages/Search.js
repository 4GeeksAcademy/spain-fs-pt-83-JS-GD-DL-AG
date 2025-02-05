import React, { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Modal,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { TypingEffect } from "../component/dashboard/TypingEffect";

// API Flask URL
const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/documents`;
const FAVORITES_API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/favorites`;

export const Search = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [subject, setSubject] = useState("All");
  const [subjects, setSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const favoritesData = await response.json();
          setFavorites(Array.isArray(favoritesData) ? favoritesData : []);
        } else {
          console.error("Error fetching favorites:", response.statusText);
          setFavorites([]);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setFavorites([]);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorites`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const favorites = await response.json();
        const isFav = favorites.some((fav) => fav.document_id === selectedDocument.id);
        setIsFavorite(isFav);
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };
    if (selectedDocument) {
      checkIfFavorite();
    }
  }, [selectedDocument]);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setDocuments(data);
        setFilteredDocuments(data);

        // Extraer materias únicas
        const uniqueSubjects = [...new Set(data.map((doc) => doc.subject))];
        setSubjects(uniqueSubjects);
      })
      .catch((error) => console.error("Error loading documents:", error));
  }, []);

  useEffect(() => {
    let filtered = documents;

    if (searchQuery) {
      filtered = filtered.filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((doc) => doc.type === category);
    }

    if (subject !== "All") {
      filtered = filtered.filter((doc) => doc.subject === subject);
    }

    setFilteredDocuments(filtered);
    setCurrentPage(1);
  }, [searchQuery, category, subject, documents]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, filteredDocuments.length);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);


  const handleToggleFavorite = async (doc) => {
    if (!doc || !doc.id) {
      console.error("❌ Error: No document provided for favorite action.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const isAlreadyFavorite = favorites.some((fav) => fav.document_id === doc.id);

      if (!isAlreadyFavorite) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorites`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ documents_id: doc.id }),
        });

        if (!response.ok) throw new Error("Failed to add favorite");

        setFavorites((prev) => [...prev, { document_id: doc.id }]);
      } else {
        const favoriteResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorites`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!favoriteResponse.ok) throw new Error("Failed to fetch favorites");

        const favoritesData = await favoriteResponse.json();
        const favoriteToDelete = favoritesData.find((fav) => fav.document_id === doc.id);

        if (!favoriteToDelete) {
          console.error("❌ Favorite not found for document:", doc.id);
          return;
        }
        const deleteResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorites/${favoriteToDelete.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!deleteResponse.ok) throw new Error("Failed to remove favorite");

        setFavorites((prev) => prev.filter((fav) => fav.document_id !== doc.id)); // 🔥 Asegurar que la UI se actualiza correctamente
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handlePageChange = (event, value) => {
    if (value >= 1 && value <= totalPages) {
      setCurrentPage(value);
    }
  };

  const handleOpenModal = (doc) => {
    console.log("Opening modal with document:", doc);
    if (!doc) return;
    setSelectedDocument(doc);
    checkIfFavorite(document.id);
    setOpenModal(true);
    checkIfFavorite(document.id); // Comprobar si es favorito
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDocument(null);
  };

  // ✅ Función para añadir a favoritos
  const handleAddFavorite = async () => {
    if (!selectedDocument) return;

    console.log("🛠️ Adding to favorites:", selectedDocument.id);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No authentication token found.");
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ documents_id: selectedDocument.id }),
      });

      const data = await response.json();
      console.log("🔍 Response from API:", data);

      if (response.ok) {
        console.log("✅ Favorite added successfully:", data);
      } else {
        console.error("❌ Failed to add favorite:", data.msg);
      }
    } catch (error) {
      console.error("🔥 Error adding favorite:", error);
    }
  };
  const checkIfFavorite = async (documentId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(FAVORITES_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error checking favorites");
      }

      const favorites = await response.json();
      const isAlreadyFavorite = favorites.some((fav) => fav.document_id === documentId);
      setIsFavorite(isAlreadyFavorite);
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

  return (
    <Box
      sx={{
        borderRadius: 4,
        padding: 3,
        backgroundColor: "#ffffff",
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2), 0px -5px 15px rgba(0, 0, 0, 0.1)", // 🔥 Sombra en todos los lados
        overflow: "visible",
        margin: "20px auto",
        maxWidth: "90%",
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "center", }}>
          <TypingEffect text="LearnVault Resources" speed={80} />
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
          <Select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            displayEmpty
            sx={{
              minWidth: 220,
              backgroundColor: "white",
              borderRadius: 6,
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease-in-out",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ff6a88",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ff6a88",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ff6a88",
                boxShadow: "0px 0px 12px rgba(255, 106, 136, 0.3)",
              },
            }}
          >
            <MenuItem value="All">All Subjects</MenuItem>
            {subjects.map((subj, index) => (
              <MenuItem key={index} value={subj}>
                {subj}
              </MenuItem>
            ))}
          </Select>
        </Box>


        <Grid container spacing={3}>
          {currentItems.map((doc) => {
            const isFavorite = favorites.some((fav) => fav.document_id === doc.id);

            return (
              <Grid item key={doc.id} xs={12} sm={6} md={4}>
                <Card sx={{ cursor: "pointer", boxShadow: 3, borderRadius: 2, position: "relative" }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(doc);
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
                        transform: "rotate(15deg)",
                        transform: "scale(1.1)",
                        opacity: 1,
                      },
                    }}
                  >
                    {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
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
            );
          })}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(filteredDocuments.length / itemsPerPage)}
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
        {/* Modal for Preview */}
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
                              handleToggleFavorite(selectedDocument);
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
                            {isFavorite ? <FavoriteIcon sx={{ fontSize: 20 }} /> : <FavoriteBorderIcon sx={{ fontSize: 20 }} />}
                            {isFavorite ? "Remove Favorite" : "Add to Favorites"}
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
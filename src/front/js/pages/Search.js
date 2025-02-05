import React, { useState, useEffect } from "react";
import {
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

  // Estado para favoritos
  const [isFavorite, setIsFavorite] = useState(false);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

  const handleToggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!isFavorite) {
        // ✅ Añadir a favoritos
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorites`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ documents_id: selectedDocument.id }),
        });

        if (!response.ok) throw new Error("Failed to add favorite");

        setIsFavorite(true);
      } else {
        // ✅ Obtener el ID del favorito antes de eliminarlo
        const favoriteResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorites`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!favoriteResponse.ok) throw new Error("Failed to fetch favorites");

        const favorites = await favoriteResponse.json();
        const favoriteToDelete = favorites.find((fav) => fav.document_id === selectedDocument.id);

        if (!favoriteToDelete) throw new Error("Favorite not found");

        // ✅ Eliminar el favorito usando su ID
        const deleteResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorites/${favoriteToDelete.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!deleteResponse.ok) throw new Error("Failed to remove favorite");

        setIsFavorite(false);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpenModal = (document) => {
    setSelectedDocument(document);
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

    console.log("🛠️ Adding to favorites:", selectedDocument.id); // <-- Debug

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
      console.log("🔍 Response from API:", data); // <-- Debug

      if (response.ok) {
        console.log("✅ Favorite added successfully:", data);
      } else {
        console.error("❌ Failed to add favorite:", data.msg);
      }
    } catch (error) {
      console.error("🔥 Error adding favorite:", error);
    }
  };


  // ✅ Verificar si el documento ya está en favoritos
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
    <Box sx={{ p: 4, backgroundColor: "#e0e0e0", borderRadius: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
        LEARNVAULT RESOURCES
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          sx={{ backgroundColor: "white", borderRadius: 2 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ backgroundColor: "white", borderRadius: 2, minWidth: 150 }}
        >
          <MenuItem value="All">All Types</MenuItem>
          <MenuItem value="Document">Documents</MenuItem>
          <MenuItem value="Video">Videos</MenuItem>
        </Select>
        <Select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          sx={{ backgroundColor: "white", borderRadius: 2, minWidth: 150 }}
        >
          <MenuItem value="All">All Subjects</MenuItem>
          {subjects.map((subj, index) => (
            <MenuItem key={index} value={subj}>
              {subj}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Grid container spacing={3} sx={{ justifyContent: "center" }}>
        {filteredDocuments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((doc) => (
          <Grid item key={doc.id} xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, backgroundColor: "white" }}>
              <CardMedia
                component="img"
                height="150"
                image={doc.image_url || "https://via.placeholder.com/150"}
                sx={{ objectFit: "cover", borderRadius: "8px 8px 0 0", cursor: "pointer" }}
                alt={doc.title}
                onClick={() => handleOpenModal(doc)}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {doc.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {doc.description}
                </Typography>
                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Favorite toggle");
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    backgroundColor: "#ff6a88",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#e85c7b" },
                  }}
                >
                  <FavoriteBorderIcon sx={{ fontSize: 20 }} /> Add to Favorites
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={Math.ceil(filteredDocuments.length / itemsPerPage)}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
          color="primary"
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
                <Button
                  variant="contained"
                  onClick={handleToggleFavorite}
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
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};
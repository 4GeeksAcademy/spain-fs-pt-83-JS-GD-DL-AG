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
  InputLabel,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// API Flask URL
const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/documents`;

export const Search = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [subject, setSubject] = useState("All");
  const [subjects, setSubjects] = useState([]); // Unique subjects from API
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 3 per row, 2 rows

  // Fetch documents from API
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log("Documents received:", data);
        setDocuments(data);
        setFilteredDocuments(data);

        // Extract unique subjects
        const uniqueSubjects = [...new Set(data.map((doc) => doc.subject))];
        setSubjects(uniqueSubjects);
      })
      .catch((error) => console.error("Error loading documents:", error));
  }, []);

  // Handle search and filters in real-time
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
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchQuery, category, subject, documents]);

  // Pagination: Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Open modal with selected document
  const handleOpenModal = (document) => {
    setSelectedDocument(document);
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDocument(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        📚 Available Resources
      </Typography>

      {/* Search Bar & Filters */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, gap: 2 }}>
        {/* Search Bar */}
        <TextField
          label="Search by title"
          variant="outlined"
          fullWidth
          sx={{ backgroundColor: "white", borderRadius: 1 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Filter by Type (without label) */}
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          displayEmpty
          sx={{ minWidth: 200, backgroundColor: "white", borderRadius: 1 }}
        >
          <MenuItem value="All">All Types</MenuItem>
          <MenuItem value="Document">Documents</MenuItem>
          <MenuItem value="Video">Videos</MenuItem>
        </Select>

        {/* Filter by Subject (without label) */}
        <Select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          displayEmpty
          sx={{ minWidth: 200, backgroundColor: "white", borderRadius: 1 }}
        >
          <MenuItem value="All">All Subjects</MenuItem>
          {subjects.map((subj, index) => (
            <MenuItem key={index} value={subj}>
              {subj}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Grid of Cards */}
      <Grid container spacing={3}>
        {currentItems.map((doc) => (
          <Grid item key={doc.id} xs={12} sm={6} md={4}>
            <Card sx={{ cursor: "pointer", boxShadow: 3, borderRadius: 2 }} onClick={() => handleOpenModal(doc)}>
              <CardMedia
                component="img"
                height="140"
                image={doc.image_url || "https://via.placeholder.com/150"}
                alt={doc.title}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {doc.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {doc.description}
                </Typography>
                <Typography variant="subtitle2" color="primary" sx={{ mt: 1 }}>
                  📁 {doc.subject}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: "gray", mt: 1 }}>
                  👤 Uploaded by: {doc.uploaded_by || "Unknown"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={Math.ceil(filteredDocuments.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
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
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <iframe
                  src={selectedDocument.src_url}
                  title={selectedDocument.title}
                  width="100%"
                  height="400px"
                  style={{ border: "none" }}
                  allowFullScreen
                ></iframe>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

import React, { useState, useEffect } from "react";
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Modal, Box, Pagination, Tabs, Tab, TextField, Select, MenuItem, InputLabel, FormControl, styled } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PropTypes from "prop-types";
import "../../styles/Dashboard/search.css"
import { YouTubeSearch } from "../component/youtubeAPI";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export const Search = () => {
  useEffect(() => {
    document.body.style.background = "linear-gradient(45deg, #ff9a8b, #ff6a88, #ff99ac)";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    return () => {
      document.body.style.background = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundAttachment = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
    };
  }, []);
  const [resources] = useState([
    {
      id: 1,
      title: "Introducción a React",
      description: "Una guía básica para aprender los fundamentos de React.",
      category: "Programación",
      date: "2025-01-15",
      imageUrl: "https://cdn.prod.website-files.com/5dbb30f00775d4350591a4e5/6335d12aa8bba4d2c450c8d7_react%20js%20introduction%20microverse%20(2).webp",
      pdfUrl: "https://web.stanford.edu/class/cs142/lectures/ReactJS.pdf",
    },
    {
      id: 2,
      title: "Diseño UX/UI para principiantes",
      description: "Explora los conceptos clave de diseño centrado en el usuario.",
      category: "Diseño",
      date: "2025-01-12",
      imageUrl: "https://www.uxdesigninstitute.com/blog/wp-content/uploads/2024/11/101_UX_vs_UI_illustration_blog-1.png",
      pdfUrl: "https://course.ccs.neu.edu/cs5500sp17/09-UX.pdf",
    },
    {
      id: 3,
      title: "Estrategias de Marketing Digital",
      description: "Consejos para mejorar tu presencia en redes sociales.",
      category: "Marketing",
      date: "2025-01-10",
      imageUrl: "https://www.hostingplus.com.es/wp-content/uploads/2020/04/marketing-digital-hm.jpg",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      id: 4,
      title: "JavaScript Avanzado",
      description: "Profundiza en los conceptos avanzados de JavaScript.",
      category: "Programación",
      date: "2025-01-08",
      imageUrl: "https://quickops.pt/wp-content/uploads/2023/08/MicrosoftTeams-image-127.png",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      id: 5,
      title: "Guía de Fotografía",
      description: "Aprende los fundamentos de la fotografía con esta guía.",
      category: "Fotografía",
      date: "2025-01-05",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6EiTgkH2hlVu40Tb8Cn_V0KYnCCBr-zbasA&s",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      id: 6,
      title: "Curso de SEO Avanzado",
      description: "Mejora el posicionamiento de tu sitio web en motores de búsqueda.",
      category: "Marketing",
      date: "2025-01-03",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCG7h_AyLfJEPIby9QafLej8JA-l1qZEjFzg&s",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      id: 7,
      title: "Cómo Crear Apps Móviles",
      description: "Una introducción al desarrollo de aplicaciones móviles.",
      category: "Programación",
      date: "2024-12-30",
      imageUrl: "https://www.techmango.net/wp-content/uploads/2022/04/mobile-app-development.png",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      id: 8,
      title: "Gestión de Proyectos Ágiles",
      description: "Aprende a gestionar proyectos utilizando metodologías ágiles.",
      category: "Gestión",
      date: "2024-12-28",
      imageUrl: "https://soldevelo.com/wp-content/uploads/2020/12/Agile-software-dev-1.jpeg",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      id: 9,
      title: "Fundamentos de la IA",
      description: "Descubre los conceptos básicos de la inteligencia artificial.",
      category: "Tecnología",
      date: "2024-12-25",
      imageUrl: "https://whitestack.com/wp-content/uploads/2023/11/AI-1.webp",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      id: 10,
      title: "Psicología del Usuario",
      description: "Comportamiento del usuario para diseñar mejores productos.",
      category: "Psicología",
      date: "2024-12-20",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRt38ckpYLYbRuEUiqjHv1ioXvsDEmehGZ3w&s",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
  ]);
  const [filteredResources, setFilteredResources] = useState(resources);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [page, setPage] = useState(1);
  const resourcesPerPage = 6;

  const categories = ["", "Programación", "Diseño", "Marketing", "Fotografía", "Gestión", "Psicología", "Tecnología"];

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    filterResources(event.target.value, searchQuery);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    filterResources(selectedCategory, event.target.value);
  };

  const filterResources = (category, query) => {
    const filtered = resources.filter((resource) => {
      const matchesCategory = category ? resource.category === category : true;
      const matchesQuery = resource.title.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
    setFilteredResources(filtered);
    setPage(1);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenModal = (resource) => {
    setSelectedResource(resource);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedResource(null);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const indexOfLastResource = page * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '70vh',
    overflow: 'hidden',
  };

  return (
    <Container sx={{ marginTop: "0px" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", fontFamily: "'Poppins', sans-serif", color:"white", display: "flex", justifyContent: "center", alignItems: "center", }}
        gutterBottom
      >
        Resource and Video Search
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="Search Tabs"
        sx={{
          borderRadius: 2,
          backgroundColor: "#FFD9CF",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "8px",
        }}
      >
        <Tab
          label="Resources"
          sx={{
            color: "black",
            "&.Mui-selected": {
              color: "white",
              backgroundColor: "#81B1CC",
              borderRadius: 2,
            },
          }}
        />
        <Tab
          label="YouTube Videos"
          sx={{
            color: "black",
            "&.Mui-selected": {
              color: "white",
              backgroundColor: "#81B1CC",
              borderRadius: 2,
            },
          }}
        />
      </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search by title"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ background: "white", borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Filter by Category"
                sx={{ background: "white", borderRadius: 2 }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category || "All Categories"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          {currentResources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <Card sx={{ borderRadius: "16px" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={resource.imageUrl}
                  alt={resource.title}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", cursor: "pointer" }}
                    onClick={() => handleOpenModal(resource)}
                  >
                    {resource.title}
                  </Typography>
                  <Typography>{resource.description}</Typography>
                  <Typography>Category: {resource.category}</Typography>
                  <Typography>Date: {new Date(resource.date).toLocaleDateString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(filteredResources.length / resourcesPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <YouTubeSearch />
      </TabPanel>

      {selectedResource && (
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box sx={{ ...modalStyle }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", display: "flex", justifyContent: "center", }}>
              {selectedResource.title}
            </Typography>
            <iframe
              src={selectedResource.pdfUrl}
              style={{ width: "100%", height: "60vh", border: "none" }}
              title="PDF Viewer"
            ></iframe>
          </Box>
        </Modal>
      )}
    </Container>
  );
};
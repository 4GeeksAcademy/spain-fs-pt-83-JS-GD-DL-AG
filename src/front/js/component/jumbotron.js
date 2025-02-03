import React from "react";
import { Box, Typography } from "@mui/material";
import Jumbo from "../../img/Jumbo.webp";

export const Jumbotron = () => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh", // 🔹 Reduce el tamaño en pantallas pequeñas
        height: { xs: "auto", md: "100vh" }, // 🔹 Ajusta automáticamente en móviles
        overflow: "hidden",
        color: "white",
        textAlign: "center",
        px: { xs: 2, sm: 4 }, // 🔹 Padding adaptable
      }}
    >
      {/* Fondo con animación de zoom */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${Jumbo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "zoomEffect 20s infinite linear",
        }}
      />

      {/* Sombra superpuesta */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      />

      {/* Contenido del Jumbotron */}
      <Box sx={{ zIndex: 2, textAlign: "center", maxWidth: "90vw" }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            fontFamily: "'Poppins', sans-serif",
            textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
            fontSize: { xs: "2rem", sm: "3rem", md: "4rem" }, // 🔹 Tamaño adaptable
          }}
        >
          LearnVault
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            mt: 2,
            maxWidth: "600px",
            mx: "auto",
            fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.3rem" }, // 🔹 Ajusta en móviles
            textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
          }}
        >
          Discover, share, and collaborate on a world of educational resources.
          From videos to books, tutorials to tools, build your knowledge while
          engaging with a thriving community.
        </Typography>
      </Box>

      {/* Definición de la animación con keyframes */}
      <style>
        {`
          @keyframes zoomEffect {
            0% { transform: scale(1); }
            50% { transform: scale(1.15); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </Box>
  );
};

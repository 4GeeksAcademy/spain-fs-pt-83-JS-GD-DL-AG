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
        height: "100vh",
        overflow: "hidden",
        color: "white",
        textAlign: "center",
      }}
    >
      {/* Fondo con animación de zoom */}
      <Box
        sx={{
          position: "absolute",
          width: "120%",
          height: "120%",
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
      <Box sx={{ zIndex: 2, textAlign: "center", px: 2 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            fontFamily: "'Poppins', sans-serif",
            textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
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
            fontSize: { xs: "1rem", sm: "1.2rem" },
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
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </Box>
  );
};

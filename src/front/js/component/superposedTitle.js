import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

export const SuperposedTitle = ({
  text = "This is a Parallax Text",
  offset = 0.3, // Controla la intensidad del efecto parallax
  fontSize = "3rem",
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY); // Captura la posición actual del scroll
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        overflow: "hidden",
        color: "white",
        textAlign: "center",
        background: "linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)", // Fondo degradado
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: fontSize,
          fontWeight: "bold",
          textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
          transform: `translateY(${scrollY * offset}px)`, // Mueve el texto en función del scroll
          transition: "transform 0.1s ease-out", // Suaviza el movimiento
          zIndex: 2,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import FeaturesResource from "../../img/Features/FeaturesResource.webp";
import FeaturesClass from "../../img/Features/FeaturesClass.webp";
import PomodoroClock from "../../img/Features/PomodoroClock.webp";
import Kanban from "../../img/Features/Kanban.webp";
import FeaturesTalent from "../../img/Features/FeaturesTalent.webp";

const features = [
  {
    title: "LearnVault Documents",
    description:
      "You can easily upload files, share them with others, and organize your most important ones into favorites for quick access.",
    image: FeaturesResource,
    gradient: "linear-gradient(to right, #ff9a8b, #ff6a88)",
  },
  {
    title: "Pomodoro Timer",
    description:
      "Take control of your work time with the Pomodoro technique. This tool lets you track your focus time and breaks, both short and long, adapting to your needs. Boost your efficiency!",
    image: PomodoroClock,
    gradient: "linear-gradient(to right, #ff6a88, #ff9a8b)",
  },
  {
    title: "Community Collaboration",
    description:
      "Connect with peers, share insights, and build together in a thriving community.",
    image: FeaturesClass,
    gradient: "linear-gradient(to right, #ff9a8b, #ff6a88)",
  },
  {
    title: "Kanban Board",
    description:
      "Organize your tasks visually and practically with our Kanbanboard. Add tasks and schedule them for specific moments throughout the week. Keep everything under control and ensure you meet your deadlines with ease.",
    image: Kanban,
    gradient: "linear-gradient(to right, #ff6a88, #ff9a8b)",
  },
];

export const FeaturesCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw", // ✅ Se asegura de ocupar todo el ancho del viewport
        maxWidth: "100%", // ✅ Evita márgenes blancos en tamaños intermedios
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #ff9a8b, #ff6a88)", // Ajusta si es necesario
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100%",
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: "transform 0.5s ease",
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                flex: "0 0 100%",
                height: "100%",
                position: "relative",
                display: "flex",
                alignItems: "center",
                flexDirection: { xs: "column", md: "row" }, // 📌 Apila en móviles
                justifyContent: "center",
                background: feature.gradient,
                padding: { xs: "8%", md: "5%" }, // 📌 Ajuste de padding en móviles
                boxSizing: "border-box",
                textAlign: "center",
              }}
            >
              {/* Título flotante */}
              <Typography
                variant="h1"
                sx={{
                  position: "absolute",
                  top: "10%",
                  left: "30%",
                  transform: "translateX(-50%)",
                  fontSize: { xs: "2.5rem", md: "4rem", lg: "5rem", xl: "6rem" }, // 📌 Ajustado a móviles
                  fontWeight: "bold",
                  fontFamily: "'Poppins', sans-serif",
                  color: "rgba(255, 255, 255, 0)",
                  textTransform: "uppercase",
                  letterSpacing: "5px",
                  whiteSpace: "nowrap",
                  WebkitTextStroke: "1px rgba(255, 255, 255, 0.65)",
                  mixBlendMode: "overlay",
                  pointerEvents: "none",
                  animation: "breathEffect 4s ease-in-out infinite",

                  display: { xs: "none", md: "block" }, // 📌 Oculto en pantallas pequeñas
                }}
              >
                Our Features
              </Typography>
              {/* Estilos de animación */}
              <style>
                {`
                  @keyframes breathEffect {
                    0% { opacity: 0.5; transform: translateX(-50%) scale(1); }
                    50% { opacity: 1; transform: translateX(-50%) scale(1.05); }
                    100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
                  }
                `}
              </style>

              {/* Texto y descripción */}
              <Box
                sx={{
                  flex: "1",
                  maxWidth: { xs: "100%", md: "40%" }, // 📌 Texto se expande en móviles
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "20px",
                  color: "#fff",
                  textShadow: "2px 2px 6px rgba(0, 0, 0, 0.7)",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "'Poppins', sans-serif",
                    mb: 2,
                    fontSize: { xs: "1.5rem", md: "2.5rem" }, // 📌 Tamaño adaptable
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: { xs: "1rem", md: "1.2rem" }, // 📌 Ajuste de fuente
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>

              {/* Imagen */}
              <Box
                sx={{
                  flex: "1",
                  maxWidth: { xs: "80%", md: "50%" }, // 📌 Ajuste de imagen en móviles
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: { xs: 3, md: 0 }, // 📌 Espaciado en móviles
                }}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Botones de navegación */}
      <Button
        onClick={handlePrev}
        sx={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 5,
          minWidth: "30px",
          minHeight: "30px",
          color: "#fff",
          "&:hover": { color: "#f1f1f1" },
          fontSize: { xs: "1rem", md: "1.5rem" }, // 📌 Tamaño adaptable
        }}
      >
        <ArrowBackIosIcon />
      </Button>
      <Button
        onClick={handleNext}
        sx={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 5,
          minWidth: "30px",
          minHeight: "30px",
          color: "#fff",
          "&:hover": { color: "#f1f1f1" },
          fontSize: { xs: "1rem", md: "1.5rem" }, // 📌 Tamaño adaptable
        }}
      >
        <ArrowForwardIosIcon />
      </Button>
    </Box>
  );
};

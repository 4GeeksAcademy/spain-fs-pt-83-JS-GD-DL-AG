import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import FeaturesResource from "../../img/Features/FeaturesResource.webp";
import FeaturesClass from "../../img/Features/FeaturesClass.webp";
import FeaturesDegree from "../../img/Features/FeaturesDegree.webp";
import FeaturesGamification from "../../img/Features/FeaturesGamification.webp";
import FeaturesTalent from "../../img/Features/FeaturesTalent.webp";

const features = [
  {
    title: "Interactive Learning",
    description:
      "Experience engaging tutorials, videos, and hands-on projects to elevate your skills.",
    image: FeaturesResource,
    gradient: "linear-gradient(to right, #ff9a8b, #ff6a88)",
  },
  {
    title: "Personalized Resources",
    description:
      "Tailor your learning journey with resources that match your goals and preferences.",
    image: FeaturesClass,
    gradient: "linear-gradient(to right, #ff6a88, #ff99ac)",
  },
  {
    title: "Community Collaboration",
    description:
      "Connect with peers, share insights, and build together in a thriving community.",
    image: FeaturesDegree,
    gradient: "linear-gradient(to right, #ff99ac, #ff9a8b)",
  },
  {
    title: "Gamification",
    description:
      "Learn and have fun with badges, leaderboards, and rewards for your progress.",
    image: FeaturesGamification,
    gradient: "linear-gradient(to right, #ff9a8b, #ff99ac)",
  },
  {
    title: "Advanced Planning Tools",
    description:
      "Stay on track with calendars, progress tracking, and goal-setting features.",
    image: FeaturesTalent,
    gradient: "linear-gradient(to right, #ff99ac, #ff6a88)",
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
                  fontSize: { xs: "2.5rem", md: "6rem" }, // 📌 Ajustado a móviles
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

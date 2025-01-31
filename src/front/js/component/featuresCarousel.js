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
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
                justifyContent: "space-between",
                background: feature.gradient,
                padding: "5%",
                boxSizing: "border-box",
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  position: "absolute",
                  top: "15%",
                  left: "45%",
                  transform: "translate(-50%, -50%)",
                  fontSize: { xs: "4rem", md: "12rem" },
                  fontWeight: "bold",
                  fontFamily: "'Poppins', sans-serif",
                  color: "rgba(255, 255, 255, 0)",
                  textTransform: "uppercase",
                  letterSpacing: "10px",
                  whiteSpace: "nowrap",
                  WebkitTextStroke: "2px rgba(255, 255, 255, 0.65)",
                  mixBlendMode: "overlay",
                  pointerEvents: "none",
                  animation: "breathEffect 4s ease-in-out infinite",
                }}
              >
                Our Features
              </Typography>

              <style>
                {`
    @keyframes breathEffect {
      0% {
        opacity: 0.5;
        transform: translate(-50%, -50%) scale(1);
        WebkitTextStroke: 2px rgba(255, 255, 255, 0.4);
      }
      50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.05); /* Pequeño crecimiento */
        WebkitTextStroke: 2px rgba(255, 255, 255, 0.8);
      }
      100% {
        opacity: 0.5;
        transform: translate(-50%, -50%) scale(1);
        WebkitTextStroke: 2px rgba(255, 255, 255, 0.4);
      }
    }
  `}
              </style>
              <Box
                sx={{
                  flex: "1",
                  maxWidth: "40%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "left",
                  padding: "20px",
                  color: "#fff",
                  textShadow: "2px 2px 6px rgba(0, 0, 0, 0.7)",
                  zIndex: 3,
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "'Poppins', sans-serif",
                    mb: 2,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {feature.description}
                </Typography>
              </Box>

              <Box
                sx={{
                  position: "relative",
                  flex: "1",
                  maxWidth: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 4,
                }}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  style={{
                    width: "80%",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Button
        onClick={handlePrev}
        sx={{
          position: "absolute",
          left: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 5,
          minWidth: "40px",
          minHeight: "40px",
          color: "#fff",
          "&:hover": { color: "#f1f1f1" },
        }}
      >
        <ArrowBackIosIcon fontSize="large" />
      </Button>
      <Button
        onClick={handleNext}
        sx={{
          position: "absolute",
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 5,
          minWidth: "40px",
          minHeight: "40px",
          color: "#fff",
          "&:hover": { color: "#f1f1f1" },
        }}
      >
        <ArrowForwardIosIcon fontSize="large" />
      </Button>
    </Box>
  );
};
import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import FeaturesResource from "../../img/Features/FeaturesResource.png";
import FeaturesClass from "../../img/Features/FeaturesClass.png";
import FeaturesDegree from "../../img/Features/FeaturesDegree.png";
import FeaturesGamification from "../../img/Features/FeaturesGamification.png";
import FeaturesTalent from "../../img/Features/FeaturesTalent.png";

const features = [
  {
    title: "Interactive Learning",
    description: "Experience engaging tutorials, videos, and hands-on projects to elevate your skills.",
    image: FeaturesResource,
    gradient: "linear-gradient(to right, #FFC3A0, #FFECB3)",
  },
  {
    title: "Personalized Resources",
    description: "Tailor your learning journey with resources that match your goals and preferences.",
    image: FeaturesClass,
    gradient: "linear-gradient(to right, #FFECB3, #B5EAD7)",
  },
  {
    title: "Community Collaboration",
    description: "Connect with peers, share insights, and build together in a thriving community.",
    image: FeaturesDegree,
    gradient: "linear-gradient(to right, #B5EAD7, #C9C9F5)",
  },
  {
    title: "Gamification",
    description: "Learn and have fun with badges, leaderboards, and rewards for your progress.",
    image: FeaturesGamification,
    gradient: "linear-gradient(to right, #C9C9F5, #FFCCF9)",
  },
  {
    title: "Advanced Planning Tools",
    description: "Stay on track with calendars, progress tracking, and goal-setting features.",
    image: FeaturesTalent,
    gradient: "linear-gradient(to right, #FFCCF9, #FFC3A0)",
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
        width: "100vw",
        height: "60vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: `${features.length * 100}vw`,
          height: "100%",
          transform: `translateX(-${currentSlide * 100}vw)`,
          transition: "transform 0.5s ease",
        }}
      >
        {features.map((feature, index) => (
          <Box
            key={index}
            sx={{
              flex: "0 0 100vw",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              padding: "20px",
              background: feature.gradient,
              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                flex: "1",
                maxWidth: "40%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "left",
                padding: "20px",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold", fontFamily: "'Poppins', sans-serif",
                  mb: 2,
                  fontWeight: "bold",
                  color: "#fff",
                  textShadow: "2px 2px 6px rgba(0, 0, 0, 0.7)",
                }}
              >
                {feature.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold", fontFamily: "'Poppins', sans-serif",
                  color: "#fff",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
                }}
              >
                {feature.description}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: "1",
                maxWidth: "40%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={feature.image}
                alt={feature.title}
                style={{
                  maxWidth: "300px",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>

      <Button
        onClick={handlePrev}
        sx={{
          position: "absolute",
          left: "30px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "white",
          borderRadius: "50%",
          p: 1,
          minWidth: "40px",
          minHeight: "40px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
          "&:hover": { bgcolor: "gray.200" },
        }}
      >
        <ArrowBackIosIcon />
      </Button>
      <Button
        onClick={handleNext}
        sx={{
          position: "absolute",
          right: "30px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "white",
          borderRadius: "50%",
          p: 1,
          minWidth: "40px",
          minHeight: "40px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
          "&:hover": { bgcolor: "gray.200" },
        }}
      >
        <ArrowForwardIosIcon />
      </Button>
    </Box>
  );
};


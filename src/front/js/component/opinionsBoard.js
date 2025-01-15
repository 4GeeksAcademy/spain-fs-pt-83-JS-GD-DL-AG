import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, Grid, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const testimonials = [
  {
    name: "Anthony",
    role: "Data Analyst",
    message:
      "The training program is going well, I wake up with a smile on my face. My mentor is such a great listener and I really love the community spirit among students.",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    bgColor: "#70AE98",
  },
  {
    name: "Sophia",
    role: "Software Engineer",
    message:
      "LearnVault has been a game-changer for my career. The resources are top-notch, and I love how personalized the experience feels.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    bgColor: "#FFA07A",
  },
  {
    name: "John",
    role: "UX Designer",
    message:
      "The collaboration and learning opportunities here are incredible.",
    image: "https://randomuser.me/api/portraits/men/39.jpg",
    bgColor: "#87CEFA",
  },
];

export const OpinionsBoard = ({ onBackgroundChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (onBackgroundChange) {
      onBackgroundChange(testimonials[currentIndex].bgColor);
    }
  }, [currentIndex, onBackgroundChange]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const { bgColor, name, role, message, image } = testimonials[currentIndex];

  return (
    <Box
      sx={{
        backgroundColor: bgColor,
        py: 5,
        overflow: "hidden",
        transition: "background-color 1s ease",
        position: "relative",
      }}
    >
      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="center"
        sx={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            pr: { xs: 0, md: 4 },
          }}
        >
          <Avatar
            src={image}
            alt={name}
            sx={{
              width: 180,
              height: 180,
              border: "6px solid white",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "white",
              fontWeight: "bold",
              fontFamily: "'Poppins', sans-serif",
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
              mb: 1,
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "white",
              fontFamily: "'Poppins', sans-serif",
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
              mb: 2,
            }}
          >
            {role}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "white",
              fontFamily: "'Poppins', sans-serif",
              lineHeight: 1.6,
              fontStyle: "italic",
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
            }}
          >
            “{message}”
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <IconButton
          onClick={handlePrev}
          disableRipple
          sx={{
            color: "white",
            "&:hover": {
              color: "lightgray",
            },
          }}
        >
          <ArrowBackIos />
        </IconButton>
        <IconButton
          onClick={handleNext}
          disableRipple
          sx={{
            color: "white",
            "&:hover": {
              color: "lightgray",
            },
          }}
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>
    </Box>
  );
};


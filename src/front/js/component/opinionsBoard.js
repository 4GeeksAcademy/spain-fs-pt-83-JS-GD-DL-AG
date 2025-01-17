import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, Grid, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import QuoteImage from "../../img/quote.png";

const testimonials = [
  {
    name: "Anthony",
    role: "Data Analyst",
    message:
      "The training program is going well, I wake up with a smile on my face. My mentor is such a great listener and I really love the community spirit among students.",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    gradient: "linear-gradient(to right, #FFC3A0, #FFECB3)",
  },
  {
    name: "Sophia",
    role: "Software Engineer",
    message:
      "LearnVault has been a game-changer for my career. The resources are top-notch, and I love how personalized the experience feels.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    gradient: "linear-gradient(to right, #FFECB3, #B5EAD7)",
  },
  {
    name: "John",
    role: "UX Designer",
    message:
      "The collaboration and learning opportunities here are incredible.",
    image: "https://randomuser.me/api/portraits/men/39.jpg",
    gradient: "linear-gradient(to right, #B5EAD7, #C9C9F5)",
  },
];

export const OpinionsBoard = ({ onBackgroundChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (onBackgroundChange) {
      onBackgroundChange(testimonials[currentIndex].gradient);
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

  const { gradient, name, role, message, image } = testimonials[currentIndex];

  return (
    <Box
      sx={{
        background: gradient,
        py: 5,
        px: 3,
        position: "relative",
        overflow: "hidden",
        transition: "background 0.5s ease",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: "transform 0.5s ease",
        }}
      >
        {testimonials.map((testimonial, index) => (
          <Box
            key={index}
            sx={{
              minWidth: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              px: 3,
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative", // Asegura que sea relativo
                }}
              >
                <Avatar
                  src={testimonial.image}
                  alt={testimonial.name}
                  sx={{
                    width: 200,
                    height: 200,
                    border: "6px solid white",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                    marginLeft: "250px",
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  position: "relative",
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                <img
                  src={QuoteImage}
                  alt="Quote"
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "-50px",
                    width: "60px",
                    height: "60px",
                    opacity: 0.8,
                    filter: "drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.5))",
                  }}
                />
                <img
                  src={QuoteImage}
                  alt="Quote"
                  style={{
                    position: "absolute",
                    top: "200px",
                    left: "900px",
                    width: "60px",
                    height: "60px",
                    opacity: 0.8,
                    transform: "rotate(180deg)",
                    filter: "drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.5))",
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontFamily: "'Poppins', sans-serif",
                    textShadow: "2px 2px 6px rgba(0, 0, 0, 0.7)",
                    mb: 1,
                    fontSize: "3rem",
                  }}
                >
                  {testimonial.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "white",
                    fontFamily: "'Poppins', sans-serif",
                    textShadow: "2px 2px 6px rgba(0, 0, 0, 0.7)",
                    mb: 2,
                    fontSize: "1.35rem",
                  }}
                >
                  {testimonial.role}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "white",
                    fontFamily: "'Poppins', sans-serif",
                    fontStyle: "italic",
                    lineHeight: 1.6,
                    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
                    fontSize: "1.3rem",
                  }}
                >
                  “{testimonial.message}”
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          textAlign: "center",
          mt: 4,
          position: "relative",
          zIndex: 3,
        }}
      >
        <IconButton
          onClick={handlePrev}
          disableRipple
          sx={{
            color: "white",
            "& svg": {
              fontSize: "2rem",
            },
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
            "& svg": {
              fontSize: "2rem",
            },
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
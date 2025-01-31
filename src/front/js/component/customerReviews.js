import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

const reviews = [
  {
    id: 1,
    name: "Samantha Richards",
    role: "University Student",
    message: "LearnVault helped me find the best notes and study materials. It's a game-changer for students!",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: 2,
    name: "Daniel Thompson",
    role: "High School Teacher",
    message: "A great platform for sharing and organizing educational resources. My students love it!",
    avatar: "https://randomuser.me/api/portraits/men/50.jpg",
  },
  {
    id: 3,
    name: "Emily Carter",
    role: "Self-Taught Developer",
    message: "I store all my learning materials in one place and discover new courses daily. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/women/42.jpg",
  },
];

export const CustomerReviews = () => {
  const [isVisible, setIsVisible] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
    };
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "4rem 2rem",
        overflow: "hidden",
        "::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(45deg, #FFC3A0, #FFCFDF, #D5AAFF, #A0E7E5)",
          backgroundSize: "400% 400%",
          animation: "gradientAnimation 10s ease infinite",
          zIndex: -1,
        },
      }}
    >
      <style>
        {`
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes scaleIn {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}
      </style>

      {/* Animated Section Titles */}
      <Typography
        variant="h6"
        ref={titleRef}
        sx={{
          fontSize: "1.5rem",
          fontWeight: "900",
          fontFamily: "'Poppins', sans-serif",
          color: "#149e9e",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
        }}
      >
        Testimonials
      </Typography>
      <Typography
        variant="h4"
        sx={{
          position: "relative",
          marginBottom: "3rem",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "2.5rem",
          fontWeight: "900",
          color: "#0f172a",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1)" : "scale(0.8)",
          transition: "opacity 1s ease-out, transform 1s ease-out",
          "&::after": {
            position: "absolute",
            content: '""',
            left: "50%",
            bottom: "-5px",
            transform: "translateX(-50%)",
            height: "2px",
            width: "5rem",
            backgroundColor: "#149e9e",
          },
        }}
      >
        What our customers say
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: "5rem",
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        {reviews.map((review) => (
          <Box
            key={review.id}
            sx={{
              position: "relative",
              isolation: "isolate",
              overflow: "hidden",
              padding: "5rem 2rem 2rem",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.15)",
              transition: "0.3s",
              "&::before": {
                position: "absolute",
                content: '""',
                top: "0",
                left: "0",
                transform: "translate(-50%, -50%)",
                width: "75%",
                aspectRatio: "1",
                borderRadius: "100%",
                backgroundColor: "#149e9e",
                zIndex: "-1",
                transition: "0.5s",
              },
              "&:hover::before": {
                width: "400%",
              },
              "&:hover h4, &:hover h5": {
                color: "#ffffff",
              },
              "&:hover p, &:hover h6": {
                color: "#e8e8e8",
              },
              "&:hover img": {
                borderColor: "#ffffff",
              },
            }}
          >
            <FormatQuoteIcon
              sx={{
                position: "absolute",
                top: "0",
                left: "0",
                padding: "1rem",
                fontSize: "5rem",
                color: "#ffffff",
              }}
            />

            <Typography variant="h5" sx={{ marginTop: "4rem", marginBottom: "1rem", fontSize: "1.5rem", fontWeight: "600", color: "#149e9e" }}>
              {review.message}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
              <Avatar src={review.avatar} sx={{ width: "100px", height: "100px", borderRadius: "100%", border: "2px solid #149e9e" }} />
            </Box>
            <Typography variant="h6" sx={{ fontSize: "1.25rem", fontWeight: "600", color: "#149e9e", marginTop: "0.5rem" }}>
              {review.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontSize: "1rem", fontWeight: "400", color: "#94a3b8" }}>
              {review.role}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
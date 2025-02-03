import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export const Footer = () => {
  return (
    <Box
      sx={{
        background: "#1e1e2e",
        borderTop: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0px -4px 20px rgba(0, 0, 0, 0.7)",
        py: 3,
        px: 3,
        textAlign: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#e0e0e0",
          mb: 1,
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
        LearnVault
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
        <IconButton
          href="https://facebook.com"
          target="_blank"
          sx={{
            color: "#e0e0e0",
            "&:hover": {
              color: "#4267B2",
              transform: "scale(1.2)",
              transition: "transform 0.3s ease, color 0.3s ease",
            },
          }}
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          href="https://twitter.com"
          target="_blank"
          sx={{
            color: "#e0e0e0",
            "&:hover": {
              color: "#1DA1F2",
              transform: "scale(1.2)",
              transition: "transform 0.3s ease, color 0.3s ease",
            },
          }}
        >
          <TwitterIcon />
        </IconButton>
        <IconButton
          href="https://instagram.com"
          target="_blank"
          sx={{
            color: "#e0e0e0",
            "&:hover": {
              color: "#C13584",
              transform: "scale(1.2)",
              transition: "transform 0.3s ease, color 0.3s ease",
            },
          }}
        >
          <InstagramIcon />
        </IconButton>
        <IconButton
          href="https://linkedin.com"
          target="_blank"
          sx={{
            color: "#e0e0e0",
            "&:hover": {
              color: "#2867B2",
              transform: "scale(1.2)",
              transition: "transform 0.3s ease, color 0.3s ease",
            },
          }}
        >
          <LinkedInIcon />
        </IconButton>
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: "#ccc",
          textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
        }}
      >
        © {new Date().getFullYear()} LearnVault. All Rights Reserved.
      </Typography>
    </Box>
  );
};

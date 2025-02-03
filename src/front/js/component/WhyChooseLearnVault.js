import React from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import chooseBg from "../../img/chooseBg.webp";

const cardsData = [
  {
    title: "Comprehensive Resources",
    description:
      "Access a wide variety of educational materials like videos, books, and tools tailored for your success.",
    gradient: "linear-gradient(135deg, #ff9a8b, #ff6a88)",
    icon: <SchoolIcon sx={{ fontSize: { xs: 50, sm: 65, md: 75 }, filter: "drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.3))" }} />,
  },
  {
    title: "Collaborative Community",
    description:
      "Connect with a thriving community to share knowledge, collaborate, and grow together.",
    gradient: "linear-gradient(135deg, #ff9a8b, #ff6a88)",
    icon: <PeopleIcon sx={{ fontSize: { xs: 50, sm: 65, md: 75 }, filter: "drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.3))" }} />,
  },
  {
    title: "Gamified Learning",
    description:
      "Earn badges, climb leaderboards, and enjoy a fun, interactive learning experience.",
    gradient: "linear-gradient(135deg, #ff9a8b, #ff6a88)",
    icon: <EmojiEventsIcon sx={{ fontSize: { xs: 50, sm: 65, md: 75 }, filter: "drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.3))" }} />,
  },
];

export const WhyChooseLearnVault = () => {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: "bold",
        backgroundImage: `url(${chooseBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 6, sm: 8, md: 10 },
      }}
    >
      <Grid
        container
        spacing={{ xs: 5, sm: 6, md: 8 }} // 📌 MÁS separación en móviles
        justifyContent="center"
        alignItems="center"
        sx={{ maxWidth: "1200px", width: "100%" }}
      >
        {cardsData.map((card, index) => (
          <Grid item xs={12} sm={12} md={4} key={index}> {/* 📌 1 tarjeta por fila en xs y sm */}
            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease",
                minHeight: { xs: "280px", sm: "320px", md: "350px" }, // 📌 Se ajusta según el tamaño
                background: card.gradient,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: { xs: "20px", sm: "30px" }, // 📌 Padding más grande en tablets
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "transparent",
                    width: { xs: 60, sm: 75, md: 80 },
                    height: { xs: 60, sm: 75, md: 80 },
                    mb: 3,
                    "& svg": {
                      background: card.gradient,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
                    },
                  }}
                >
                  {card.icon}
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, // 📌 Se adapta el tamaño del título
                    color: "#fff",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                    color: "#fff",
                    textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)",
                    lineHeight: "1.6",
                  }}
                >
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

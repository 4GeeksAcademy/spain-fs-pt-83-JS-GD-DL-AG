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
    gradient: "linear-gradient(135deg, #FFC3A0, #FFECB3)",
    icon: <SchoolIcon sx={{ fontSize: 75, filter: "drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.3))", }} />,
  },
  {
    title: "Collaborative Community",
    description:
      "Connect with a thriving community to share knowledge, collaborate, and grow together.",
    gradient: "linear-gradient(135deg, #A1C4FD, #C2E9FB)",
    icon: <PeopleIcon sx={{ fontSize: 75, filter: "drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.3))", }} />,
  },
  {
    title: "Gamified Learning",
    description:
      "Earn badges, climb leaderboards, and enjoy a fun, interactive learning experience.",
    gradient: "linear-gradient(135deg, #C5E1A5, #DCE775)",
    icon: <EmojiEventsIcon sx={{ fontSize: 75, filter: "drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.3))", }} />,
  },
];

export const WhyChooseLearnVault = () => {
  return (
    <Box
      sx={{
        minHeight: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: "bold",
        backgroundImage: `url(${chooseBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        px: 4,
      }}
    >
      <Grid
        container
        spacing={10}
        justifyContent="center"
        alignItems="center"
        sx={{ maxWidth: "1200px", width: "100%" }}
      >
        {cardsData.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease",
                minHeight: "320px",
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
                  padding: "30px",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "transparent",
                    width: 80,
                    height: 80,
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
                    color: "#fff",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)",
                    lineHeight: "1.8",
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
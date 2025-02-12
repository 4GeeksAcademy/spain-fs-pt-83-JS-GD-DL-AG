import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";

export const MainTitle = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  // Efecto para hacer parpadear el cursor "|"
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: "var(--typing-effect-min-width, 100%)",
        minHeight: { xs: "40px", sm: "50px" },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        padding: { xs: "10px", sm: "20px" },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: { xs: 1, sm: 2 },
          fontFamily: "'Poppins', sans-serif",
          letterSpacing: { xs: "0px", sm: "2px" },
          whiteSpace: "nowrap",
          overflow: "hidden",
          background: "white",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          display: "flex",
          alignItems: "center",
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
        }}
      >
        {displayedText}
        <Box
          component="span"
          sx={{
            display: "inline-block",
            width: { xs: "2px", sm: "4px" },
            height: "1em",
            backgroundColor: "white",
            marginLeft: { xs: "3px", sm: "5px" },
            animation: "blink 1s infinite",
            opacity: showCursor ? 1 : 0.2,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
      </Typography>
    </Box>
  )
}

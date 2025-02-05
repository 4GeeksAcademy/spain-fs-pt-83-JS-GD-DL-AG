import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";

export const TypingEffect = ({ text, speed = 100 }) => {
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
        minWidth: `${text.length * 12}px`,
        minHeight: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 2,
          fontFamily: "'Poppins', sans-serif",
          letterSpacing: "2px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          background: "linear-gradient(45deg, #ff6a88, #ff99ac)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0px 3px 10px rgba(255, 106, 136, 0.4)",
          display: "flex",
          alignItems: "center",
        }}
      >
        {displayedText}
        <Box
          component="span"
          sx={{
            display: "inline-block",
            width: "4px",
            height: "1em",
            backgroundColor: "#ff6a88",
            marginLeft: "5px",
            animation: "blink 1s infinite",
            opacity: showCursor ? 1 : 0.2,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
      </Typography>
    </Box>
  );
};

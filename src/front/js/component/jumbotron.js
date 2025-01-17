import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Jumbo from "../../img/Jumbo.webp";

export const Jumbotron = () => {
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const posX = (clientX / innerWidth) * 100;
        const posY = (clientY / innerHeight) * 100;

        setMousePosition({ x: posX, y: posY });
    };

    return (
        <Box
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                overflow: "hidden",
                color: "white",
                textAlign: "center",
                cursor: "pointer",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    width: "120%",
                    height: "120%",
                    backgroundImage: `url(${Jumbo})`,
                    backgroundSize: "cover",
                    backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                    transition: "transform 0.5s ease, filter 0.5s ease, background-position 0.1s ease",
                    filter: isHovering ? "blur(0px)" : "blur(5px)",
                    transform: isHovering ? "scale(1.3)" : "scale(1)",
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    background: "rgba(0, 0, 0, 0.4)",
                    zIndex: 1,
                }}
            />

            <Box sx={{ zIndex: 2 }}>
                <Typography
                    variant="h2"
                    sx={{ fontWeight: "bold", fontFamily: "'Poppins', sans-serif"}}>
                    LearnVault
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: "'Poppins', sans-serif", mt: 2, maxWidth: "600px", mx: "auto", fontSize: { xs: "1rem", sm: "1.2rem"}, }}>
                Discover, share, and collaborate on a world of educational resources. From videos to books, tutorials to tools, build your knowledge while engaging with a thriving community.
                </Typography>
            </Box>
            
        </Box>
    );
};
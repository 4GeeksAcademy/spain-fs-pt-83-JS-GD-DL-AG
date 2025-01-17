import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const navigate = useNavigate();

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLoginToggle = () => {
		setIsLoggedIn(!isLoggedIn);
	};

	const handleScrollTo = (id) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	return (
		<Box
			sx={{
				position: "absolute",
				top: 0,
				left: "50%",
				transform: "translateX(-50%)",
				width: "90%",
				background: "rgba(255, 255, 255, 0.4)",
				backdropFilter: "blur(10px)",
				borderRadius: "16px",
				boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
				zIndex: 1000,
				padding: "5px",
				marginTop: "16px",
			}}
		>
			<AppBar
				position="static"
				sx={{
					background: "transparent",
					boxShadow: "none",
				}}
			>
				<Toolbar
					sx={{
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<Typography
						variant="h6"
						component={Link}
						to="/"
						sx={{
							fontWeight: "bold",
							fontFamily: "'Poppins', sans-serif",
							color: "white",
							cursor: "pointer",
							textDecoration: "none",
							textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
							"&:hover": {
								textDecoration: "none",
								color: "white",
							},
						}}
					>
						LearnVault
					</Typography>

					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 3,
						}}
					>
						<Button
							sx={{ color: "white", fontWeight: "bold", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)", }}
							onClick={() => handleScrollTo("features")}
						>
							Features
						</Button>
						<Button
							sx={{ color: "white", fontWeight: "bold", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)", }}
							onClick={() => handleScrollTo("experiencies")}
						>
							Experiences
						</Button>
						{!isLoggedIn ? (
							<>
								<Button
									sx={{
										color: "white",
										fontWeight: "bold",
										textTransform: "none",
										textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
									}}
									onClick={() => navigate("/login")}
								>
									Login
								</Button>
								<Button
									sx={{
										color: "white",
										fontWeight: "bold",
										textTransform: "none",
										textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
									}}
									onClick={() => navigate("/register")}
								>
									Sign Up
								</Button>
							</>
						) : (
							<>
								<Button
									sx={{
										color: "white",
										fontWeight: "bold",
										textTransform: "none",
									}}
									onClick={handleLoginToggle}
								>
									Logout
								</Button>
								<IconButton onClick={handleMenuOpen}>
									<Avatar
										sx={{
											bgcolor: "#FFC3A0",
											color: "#333",
										}}
									>
										U
									</Avatar>
								</IconButton>
								<Menu
									anchorEl={anchorEl}
									open={Boolean(anchorEl)}
									onClose={handleMenuClose}
								>
									<MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
									<MenuItem onClick={handleLoginToggle}>Logout</MenuItem>
								</Menu>
							</>
						)}
					</Box>
					<IconButton
						edge="end"
						sx={{
							display: { xs: "block", md: "none" },
							color: "#333",
						}}
					>
						<MenuIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
		</Box>
	);
};
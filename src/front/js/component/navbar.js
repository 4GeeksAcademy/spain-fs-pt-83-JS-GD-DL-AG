import React, { useState } from "react";
import "../../styles/navbar.css";

export const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<nav className="navbar">
			<div className="navbar-logo">
				<a href="#">LearnVault</a>
			</div>
			<div className="navbar-search">
				<input type="text" placeholder="What are you studying today?" />
			</div>
			<button className="navbar-toggle" onClick={toggleMenu}>
				☰
			</button>
			<ul className={`navbar-links ${isOpen ? "open" : ""}`}>
				<li><a href="#">Prepare for your exams</a></li>
				<li><a href="#">Earn points</a></li>
				<li><a href="#">University Guidance</a></li>
				<li><a href="#">Sell on LearnVault</a></li>
			</ul>
			<div className="navbar-auth">
				<a href="#" className="login">Login</a>
				<a href="#" className="register">SignUp</a>
			</div>
		</nav>
	);
};
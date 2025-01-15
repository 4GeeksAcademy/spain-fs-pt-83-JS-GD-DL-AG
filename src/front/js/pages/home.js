import React, { useState } from "react";
import "../../styles/home.css";
import { FeaturesCarousel } from "../component/featuresCarousel";
import { OpinionsBoard } from "../component/opinionsBoard";
import { SuperposedTitle } from "../component/superposedTitle";
import { Jumbotron } from "../component/jumbotron";
import { SuperposedJumbo } from "../component/superposedJumbo";
import { WhyChooseLearnVault } from "../component/WhyChooseLearnVault";

export const Home = () => {
  const [currentBackground, setCurrentBackground] = useState("#FFD700");

  const handleBackgroundChange = (newColor) => {
    setCurrentBackground(newColor);
  };

  return (
    <div className="home">
      <Jumbotron />
      <SuperposedJumbo />
      <FeaturesCarousel />
      <WhyChooseLearnVault />
      <SuperposedTitle text="OUR STUDENTS SHARE THEIR EXPERIENCES" dynamicColor={currentBackground} />
      <OpinionsBoard onBackgroundChange={handleBackgroundChange} />
    </div>
  );
};

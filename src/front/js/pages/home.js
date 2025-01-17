import React, { useState } from "react";
import "../../styles/home.css";
import { FeaturesCarousel } from "../component/featuresCarousel.js";
import { OpinionsBoard } from "../component/opinionsBoard";
import { SuperposedTitle } from "../component/superposedTitle";
import { Jumbotron } from "../component/jumbotron";
import { WhyChooseLearnVault } from "../component/WhyChooseLearnVault";

export const Home = () => {
  const [currentBackground, setCurrentBackground] = useState("#FFD700");

  const handleBackgroundChange = (newColor) => {
    setCurrentBackground(newColor);
  };

  return (
    <div className="home">
      <div id="jumbotron">
        <Jumbotron />
      </div>
      <SuperposedTitle
        text={["LearnVault", "Our Features"]}
        position={{ top: "100%", left: "50%" }}
        rotation={0}
      />
      <div id="features">
        <FeaturesCarousel />
      </div>
      <div id="services">
        <WhyChooseLearnVault />
      </div>
      <SuperposedTitle
        text={["Users", "Experiences"]}
        position={{ top: "210%", left: "50%" }}
        rotation={0}
      />
      <div id="experiences">
        <OpinionsBoard onBackgroundChange={handleBackgroundChange} />
      </div>
    </div>
  );
};

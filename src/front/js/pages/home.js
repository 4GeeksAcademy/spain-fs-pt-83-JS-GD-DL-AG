import React, { useState } from "react";
import "../../styles/Home/home.css";
import { FeaturesCarousel } from "../component/featuresCarousel.js";
import { CustomerReviews } from "../component/customerReviews.js";
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
      <div id="features">
        <FeaturesCarousel />
      </div>
      <div id="services">
        <WhyChooseLearnVault />
      </div>
      
      <div id="experiences">
      <CustomerReviews />
      </div>
    </div>
  );
};

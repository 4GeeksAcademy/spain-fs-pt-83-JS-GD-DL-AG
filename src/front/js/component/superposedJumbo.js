import React from "react";
import "../../styles/SuperposedJumbo.css";

export const SuperposedJumbo = ({ text }) => {
  return (
    <div className="superposed-jumbo-container">
      <h1 className="superposed-jumbo-title">
        <span className="superposed-jumbo-solid">{text}</span>
        <span className="superposed-jumbo-outline">{text}</span>
      </h1>
    </div>
  );
};


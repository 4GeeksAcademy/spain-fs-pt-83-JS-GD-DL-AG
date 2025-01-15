import React, { useEffect, useState } from "react";
import "../../styles/SuperposedTitle.css";

export const SuperposedTitle = ({ text, dynamicColor }) => {
  const [currentColor, setCurrentColor] = useState(dynamicColor);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentColor(dynamicColor);
    }, 100);

    return () => clearTimeout(timeout);
  }, [dynamicColor]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--dynamic-color", currentColor);
  }, [currentColor]);

  return (
    <div className="superposed-title-container">
      <h1 className="superposed-title">{text}</h1>
    </div>
  );
};


import React, { useEffect, useRef, useState } from "react";
import "../../styles/SuperposedTitle.css";

export const SuperposedTitle = ({
  text = ["Default", "Title"],
  position = { top: "50%", left: "50%" },
  rotation = 0,
}) => {
  const containerRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(true);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasScrolled) {
          setTimeout(() => {
            setHasBeenVisible(true);
          }, 500);
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasScrolled]);

  return (
    <div
      className={`words-container ${hasBeenVisible ? "visible" : ""}`}
      ref={containerRef}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        zIndex: 999,
        textShadow: "2px 2px 6px rgba(0, 0, 0, 0.7)",
      }}
    >
      <ul className="Words">
        {text.map((line, index) => (
          <li
            className={`Words-line ${
              index % 2 === 0 ? "line-from-top" : "line-from-bottom"
            }`}
            key={index}
          >
            <p>{line}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};


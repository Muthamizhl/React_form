
import React from "react";
import "../styles/HeroSection.css";

const HeroSection = ({ navigate }) => {
  return (
    <section className="hero">
      <h1 className="hero-title">
        Dynamic Form <span className="gradient-text">Generator</span>
      </h1>
      <p className="hero-subtitle">
        Build and publish forms with JSON.<br />
        Professional validation, real-time preview, and instant export.
      </p>
      <div className="hero-buttons">
        <button onClick={() => navigate("/demo")} className="btn primary">Try Demo</button>
        <button onClick={() => navigate("/build")} className="btn secondary">Build Your Own</button>
      </div>
    </section>
  );
};

export default HeroSection;
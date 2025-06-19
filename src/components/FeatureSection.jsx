// src/components/FeatureSection.jsx
import React from "react";
import "../styles/FeatureSection.css";

const FeatureSection = () => {
  return (
    <section className="features">
      <h2>Everything you need to build forms</h2>
      <p>Professional-grade form building with modern UI/UX</p>
      <div className="feature-cards">
        <div className="card">⚡ <strong>JSON-Powered Forms</strong><br />Configure complex forms with simple JSON. Export and import configurations instantly.</div>
        <div className="card">✅ <strong>Real-Time Validation</strong><br />Advanced validation with custom rules, error handling, and user-friendly feedback.</div>
        <div className="card">📊 <strong>Export Responses</strong><br />View, copy, and export form responses in JSON format with syntax highlighting.</div>
      </div>
    </section>
  );
};

export default FeatureSection;
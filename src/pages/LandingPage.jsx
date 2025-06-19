import React from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import Footer from "../components/common/Footer";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <HeroSection navigate={navigate} />
      <FeatureSection />
      <Footer />
    </div>
  );
};

export default LandingPage;

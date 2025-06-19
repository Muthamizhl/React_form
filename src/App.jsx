// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DemoFormPage from "./pages/DemoFormPage";
import FormBuilderPage from "./pages/FormBuilderPage";
import BuiltFormDisplayPage from "./pages/BuiltFormDisplayPage";

const App = () => {
  return (
    <Router basename="/Json_Form"> {/* ✅ No trailing slash */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo" element={<DemoFormPage />} />
        <Route path="/build" element={<FormBuilderPage />} />
        <Route path="/built-form" element={<BuiltFormDisplayPage />} />
      </Routes>
    </Router>
  );
};

export default App;

// index.jsx or main.jsx
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ import
import './index.css';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <BrowserRouter basename="/Json_Form">  {/* Add basename for GitHub Pages */}
      <App />
    </BrowserRouter>
  </StrictMode>
);

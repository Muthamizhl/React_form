// src/App.jsx
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import DemoFormPage from "./pages/DemoFormPage";
import FormBuilderPage from "./pages/FormBuilderPage";
import BuiltFormDisplayPage from "./pages/BuiltFormDisplayPage";

// Simple layout that renders child routes
const AppLayout = () => {
  return (
    <div>
      {/* You can add a header/nav here if needed */}
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <LandingPage /> }, // This is for "/"
        { path: "demo", element: <DemoFormPage /> },
        { path: "build", element: <FormBuilderPage /> },
        { path: "built-form", element: <BuiltFormDisplayPage /> },
      ],
    },
  ],
  {
    basename: "/React_form", // ✅ very important for GitHub Pages
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

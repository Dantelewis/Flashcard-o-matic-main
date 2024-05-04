import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout/index";
import NotFound from "./Layout/NotFound";

function App() {
  return (
    <div className="app-routes">
      <Routes>
        {/* Route for Home view */}
        <Route path="/" element={<Layout />} />
        {/* Route for unknown URLs */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

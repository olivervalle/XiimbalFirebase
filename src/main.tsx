import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { seedDatabase, checkIfDataExists } from "./lib/seedData";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// Check if we need to seed the database
checkIfDataExists().then((exists) => {
  if (!exists) {
    seedDatabase().catch(console.error);
  }
});

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

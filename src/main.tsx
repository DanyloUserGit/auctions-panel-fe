import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./app/routes.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);

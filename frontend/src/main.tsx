import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ListingApp } from "./components/ListingApp";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ListingApp />
  </StrictMode>,
);
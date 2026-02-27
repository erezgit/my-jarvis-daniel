import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { DirectionProvider } from "@/components/ui/direction";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DirectionProvider direction="rtl">
      <App />
    </DirectionProvider>
  </StrictMode>,
);

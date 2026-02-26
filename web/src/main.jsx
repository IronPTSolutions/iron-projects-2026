import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./contexts/auth-context.jsx";

/**
 * Entry point de la aplicación.
 *
 * Estructura de providers (de fuera hacia dentro):
 * 1. StrictMode      → Activa comprobaciones adicionales en desarrollo.
 * 2. BrowserRouter   → Habilita el enrutamiento con React Router (history API).
 * 3. AuthContextProvider → Gestiona el estado de autenticación global
 *                          y protege las rutas que requieren sesión.
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
);

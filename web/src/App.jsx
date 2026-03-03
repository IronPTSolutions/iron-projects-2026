import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import HomePage from "./pages/home-page";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import ProfilePage from "./pages/profile-page";
import ProjectPage from "./pages/project-page";
import UserPage from "./pages/user-page";
import ChatPage from "./pages/chat-page";

/**
 * Layout para las páginas que requieren autenticación.
 * Incluye el Navbar y un <main> centrado con ancho máximo.
 * El fondo usa un gradiente oscuro slate consistente con el diseño.
 */
function AuthenticatedLayout({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

/**
 * Componente principal de la aplicación.
 *
 * Define dos grupos de rutas:
 * - /login  → Layout propio centrado vertical y horizontalmente (sin navbar).
 * - /*      → Todas las demás rutas usan AuthenticatedLayout (con navbar).
 *
 * La protección de rutas la gestiona AuthContextProvider, que redirige
 * al login si no hay sesión activa.
 */
function App() {
  return (
    <Routes>
      {/* Ruta pública: login con layout centrado a pantalla completa */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas protegidas: layout con navbar + contenido */}
      <Route
        path="/*"
        element={
          <AuthenticatedLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects/:id" element={<ProjectPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/users/:id" element={<UserPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/chat/:userId" element={<ChatPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AuthenticatedLayout>
        }
      />
    </Routes>
  );
}

export default App;

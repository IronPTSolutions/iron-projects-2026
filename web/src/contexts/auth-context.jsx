import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProfile, login } from "../services/api-service";

// Contexto de autenticación con valor por defecto vacío
const AuthContext = createContext({});

/**
 * Provider que gestiona el estado de autenticación de la aplicación.
 *
 * Responsabilidades:
 * - Al montar, intenta recuperar la sesión activa (GET /api/users/me).
 * - Si no hay sesión válida, redirige automáticamente a /login.
 * - Expone `user` (datos del usuario autenticado) y `userLogin` (función de login).
 * - Mientras se verifica la sesión, no renderiza nada (evita flash de contenido).
 */
export function AuthContextProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Al montar el componente, verifica si hay una sesión activa
  useEffect(() => {
    async function fetch() {
      try {
        const user = await getProfile();
        setUser(user);
      } catch (err) {
        // No hay sesión válida → redirige al login
        navigate("/login");
      }
    }

    fetch();
  }, []);

  /**
   * Autentica al usuario contra la API y guarda sus datos en el estado.
   * Si las credenciales son incorrectas, la promesa se rechaza
   * y el componente que llame a esta función debe manejar el error.
   */
  async function userLogin(email, password) {
    const user = await login(email, password);
    setUser(user);
  }

  // Mientras user es null y NO estamos en /login, no renderizamos nada.
  // Esto evita que se muestre brevemente contenido protegido antes de redirigir.
  if (user === null && location.pathname !== "/login") {
    return <></>;
  }

  return (
    <AuthContext.Provider value={{ user, userLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook para acceder al contexto de autenticación (user, userLogin). */
export function useAuth() {
  return useContext(AuthContext);
}

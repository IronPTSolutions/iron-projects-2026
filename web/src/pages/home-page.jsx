import { useAuth } from "../contexts/auth-context";

/** Página principal — se muestra tras autenticarse correctamente. */
export default function HomePage() {
  // Obtiene los datos del usuario autenticado desde el contexto
  const { user } = useAuth();
  return <div className="w-full max-w-md">Hola {user.name}</div>;
}

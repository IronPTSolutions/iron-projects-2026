import { useEffect, useState } from "react";
import { getUser } from "../services/api-service";
import { useParams } from "react-router-dom";

/**
 * Custom hook para obtener un usuario por su ID desde la URL.
 *
 * - Extrae el `id` de los params de la URL con `useParams()`.
 * - Hace `GET /api/users/:id` vía `getUser(id)`.
 * - Devuelve `{ user, loading }`:
 *   - user: datos del usuario (null mientras carga).
 *   - loading: true mientras la petición no ha terminado.
 */
export default function useUser() {
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetch() {
      const project = await getUser(id);
      setUser(project);
    }

    fetch();
  }, [id]);

  return { user, loading: user === null };
}

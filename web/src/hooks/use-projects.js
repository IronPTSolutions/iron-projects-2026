import { useEffect, useState } from "react";
import { listProjects } from "../services/api-service";

/**
 * Custom hook para obtener la lista de proyectos desde la API.
 *
 * - Al montar el componente, hace un GET /api/projects.
 * - Devuelve { projects, loading }:
 *   - projects: array de proyectos (null mientras carga).
 *   - loading: true mientras la petición no ha terminado.
 */
export default function useProjects(filters) {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    const timer = filters.author ? 500 : 0;

    const timeout = window.setTimeout(async () => {
      setProjects(null);

      const projects = await listProjects(filters);

      setProjects(projects);
    }, timer);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [filters]);

  return { projects, loading: projects === null };
}

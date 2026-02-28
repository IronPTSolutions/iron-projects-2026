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
export default function useProjects() {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    async function fetch() {
      const projects = await listProjects();
      setProjects(projects);
    }

    fetch();
  }, []);

  return { projects, loading: projects === null };
}

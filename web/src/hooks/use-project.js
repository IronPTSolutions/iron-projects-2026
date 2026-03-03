import { useCallback, useEffect, useState } from "react";
import { getProject } from "../services/api-service";
import { useParams } from "react-router-dom";

/**
 * Custom hook para obtener un proyecto individual por su ID.
 *
 * - Extrae el `id` de los params de la URL con `useParams()`.
 * - Hace `GET /api/projects/:id` vía `getProject(id)`.
 * - Devuelve `{ project, loading, reloadProject }`:
 *   - project: datos del proyecto (null mientras carga).
 *   - loading: true mientras la petición no ha terminado.
 *   - reloadProject: función para refrescar los datos (útil tras crear/eliminar reviews).
 *
 * `reloadProject` se memoriza con `useCallback` para evitar renders innecesarios
 * cuando se pasa como dependencia a useEffect en componentes hijos.
 */
export default function useProject() {
  const [project, setProject] = useState(null);
  const { id } = useParams();

  const reloadProject = useCallback(() => {
    async function fetch() {
      const project = await getProject(id);
      setProject(project);
    }

    fetch();
  }, [id]);

  useEffect(() => {
    reloadProject();
  }, [reloadProject]);

  return { project, loading: project === null, reloadProject };
}

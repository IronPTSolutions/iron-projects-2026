import { useEffect, useState } from "react";
import { getProject } from "../services/api-service";
import { useParams } from "react-router-dom";

export default function useProject() {
  const [project, setProject] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetch() {
      const project = await getProject(id);
      setProject(project);
    }

    fetch();
  }, [id]);

  return { project, loading: project === null };
}

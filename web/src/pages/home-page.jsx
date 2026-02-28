import ProjectCard from "../components/project-card";
import { useAuth } from "../contexts/auth-context";
import useProjects from "../hooks/use-projects";

/** Página principal — se muestra tras autenticarse correctamente. */
export default function HomePage() {
  // Obtiene los datos del usuario autenticado desde el contexto
  const { user } = useAuth();

  const { projects, loading } = useProjects();

  if (loading) {
    return <></>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {projects.map((project) => (
        <ProjectCard project={project} key={project.id} />
      ))}
    </div>
  );
}

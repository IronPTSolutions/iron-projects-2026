import { useState } from "react";
import ProjectCard from "../components/project-card";
import ProjectCardSkeleton from "../components/project-card-skeleton";
import useProjects from "../hooks/use-projects";
import { ProjectsFilters } from "../components/projects-filters";

/** Página principal — se muestra tras autenticarse correctamente. */
export default function HomePage() {
  const [filters, setFilters] = useState({
    module: "",
    promotion: "",
    author: "",
  });

  const { projects, loading } = useProjects(filters);

  return (
    <div>
      {/* Filters */}
      <ProjectsFilters filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))
          : projects.map((project) => (
              <ProjectCard project={project} key={project.id} />
            ))}
      </div>
    </div>
  );
}

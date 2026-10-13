import ProjectPlanner from "@/components/tools/ProjectPlanner";
import SEO from "@/components/SEO";

const ProjectPlannerPage = () => {
  return (
    <div>
      <SEO
        title="Project Planner | PassionWorld Designs"
        description="Plan your website, branding, graphic design, software, or digital marketing project with PassionWorld Designs."
        canonical="/tools/project-planner"
      />
      <ProjectPlanner />
    </div>
  );
};

export default ProjectPlannerPage;

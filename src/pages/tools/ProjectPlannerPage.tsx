import ProjectPlanner from "@/components/tools/ProjectPlanner";
import SEO from "@/components/SEO";

const ProjectPlannerPage = () => {
  return (
    <div>
      <SEO
        title="Interactive Project Planner & Cost Calculator | PassionWorld Designs"
        description="Plan your custom website, app, or branding project step-by-step. Select your features and calculate an instant realistic cost estimate online."
        canonical="/tools/project-planner"
      />
      <ProjectPlanner />
    </div>
  );
};

export default ProjectPlannerPage;

import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceLandingPage from "./pages/ServiceLandingPage";
import Portfolio from "./pages/Portfolio";
import Testimonials from "./pages/Testimonials";
import Vacancies from "./pages/Vacancies";
import LearningCenter from "./pages/LearningCenter";
import ArticlePage from "./pages/ArticlePage";
import Contact from "./pages/Contact";
import StartProject from "./pages/StartProject";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import PassionChatbot from "@/components/PassionChatbot";
import ProjectPlannerPage from "./pages/tools/ProjectPlannerPage";
import NewsPage from "./pages/News";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/graphic-design" element={<ServiceLandingPage service="graphic-design" />} />
            <Route path="/app-development" element={<ServiceLandingPage service="app-development" />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/vacancies" element={<Vacancies />} />
            <Route path="/learning-center" element={<LearningCenter />} />
            <Route path="/blog" element={<LearningCenter />} />
            <Route path="/learning-center/:id" element={<ArticlePage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/start-project" element={<StartProject />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/tools/project-planner" element={<ProjectPlannerPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <PassionChatbot />
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

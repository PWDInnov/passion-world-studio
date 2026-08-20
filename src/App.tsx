import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import Index from "./pages/Index";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Testimonials from "./pages/Testimonials";
import Vacancies from "./pages/Vacancies";
import LearningCenter from "./pages/LearningCenter";
import ArticlePage from "./pages/ArticlePage";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import LoadingScreen from "@/components/LoadingScreen";
import PassionChatbot from "@/components/PassionChatbot";
import ProjectPlannerPage from "./pages/tools/ProjectPlannerPage";
import NewsPage from "./pages/News";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000); // Simulate loading for 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {loading ? (
          <LoadingScreen />
        ) : (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/vacancies" element={<Vacancies />} />
              <Route path="/learning-center" element={<LearningCenter />} />
              <Route path="/learning-center/:id" element={<ArticlePage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/tools/project-planner" element={<ProjectPlannerPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <PassionChatbot />
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

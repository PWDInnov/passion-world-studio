import { lazy, Suspense } from "react";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import PassionChatbot from "@/components/PassionChatbot";
import RouteSEO from "@/components/RouteSEO";

// Code-split routes with React.lazy for high performance
const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const ServiceLandingPage = lazy(() => import("./pages/ServiceLandingPage"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Vacancies = lazy(() => import("./pages/Vacancies"));
const LearningCenter = lazy(() => import("./pages/LearningCenter"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const Contact = lazy(() => import("./pages/Contact"));
const StartProject = lazy(() => import("./pages/StartProject"));
const Admin = lazy(() => import("./pages/Admin"));
const ProjectPlannerPage = lazy(() => import("./pages/tools/ProjectPlannerPage"));
const NewsPage = lazy(() => import("./pages/News"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
    <div className="w-10 h-10 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
    <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground animate-pulse">
      Loading page...
    </span>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <RouteSEO />
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
          <PassionChatbot />
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

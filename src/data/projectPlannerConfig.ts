export interface ProjectPlannerConfig {
  websiteType: Record<string, { name: string; price: number; description?: string }>;
  pages: { price_per_page: number };
  features: Record<string, { name: string; price: number; description?: string }>;
  design: Record<string, { name: string; price: number; description?: string }>;
}

export const projectPlannerConfig: ProjectPlannerConfig = {
  websiteType: {
    landing: { name: "Landing Page", price: 350, description: "High-conversion single-page website" },
    business: { name: "Business Website", price: 650, description: "Multi-page corporate website" },
    ecommerce: { name: "E-Commerce Store", price: 1200, description: "Online store with payment gateway" },
    webapp: { name: "Custom Web Application", price: 1800, description: "Database-backed custom portal" },
  },
  pages: {
    price_per_page: 50,
  },
  features: {
    cms: { name: "Content Management (CMS)", price: 200, description: "Easily edit your content and blog" },
    auth: { name: "User Accounts & Login", price: 250, description: "Secure customer authentication" },
    seo: { name: "Advanced SEO Package", price: 150, description: "Schema, sitemaps, and search optimization" },
    analytics: { name: "Custom Analytics & Tracking", price: 100, description: "Conversion and visitor tracking" },
    multilingual: { name: "Multi-Language Support", price: 200, description: "Support for multiple languages" },
    chat: { name: "Live Chat Integration", price: 100, description: "Direct customer messaging support" },
  },
  design: {
    standard: { name: "Modern Template Customization", price: 0, description: "Clean, responsive standard styling" },
    custom: { name: "Bespoke Custom UI/UX", price: 350, description: "Unique custom Figma wireframes & layouts" },
    premium: { name: "Premium Interactive & 3D", price: 700, description: "Micro-animations, 3D assets & custom sound" },
  },
};

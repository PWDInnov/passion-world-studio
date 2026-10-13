
export interface ProjectPlannerConfig {
  websiteType: {
    [key: string]: {
      name: string;
      price: number;
    };
  };
  pages: {
    price_per_page: number;
  };
  features: {
    [key: string]: {
      name: string;
      price: number;
      description: string;
    };
  };
  design: {
    [key: string]: {
      name: string;
      price: number;
    };
  };
}

export const projectPlannerConfig: ProjectPlannerConfig = {
  websiteType: {
    business: { name: "Business Website", price: 500 },
    ecommerce: { name: "E-commerce Store", price: 1500 },
    portfolio: { name: "Portfolio Showcase", price: 300 },
    landing_page: { name: "Landing Page", price: 200 },
  },
  pages: {
    price_per_page: 50,
  },
  features: {
    seo: { 
      name: "SEO Optimization",
      price: 250, 
      description: "Helps your website rank higher on Google so more customers can find you."
    },
    cms: { 
      name: "Content Management System (CMS)",
      price: 400, 
      description: "Allows you to easily update your website's text and images yourself, without needing a developer."
    },
    booking: { 
      name: "Booking & Reservations",
      price: 600, 
      description: "Integrates a booking or reservation system for appointments, services, or events."
    },
    social_media: { 
      name: "Social Media Integration",
      price: 150, 
      description: "Links your website to your social media profiles and displays your latest posts."
    },
  },
  design: {
    template: { name: "Template-based Design", price: 0 },
    custom: { name: "Fully Custom Design", price: 1000 },
  },
};


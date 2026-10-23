export interface RouteSEOData {
  title: string;
  description: string;
  canonical: string;
  type?: "website" | "article";
  image?: string;
  imageAlt?: string;
  robots?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

const siteUrl = "https://www.passionworlddesigns.com";

export const routeSEOMap: Record<string, RouteSEOData> = {
  "/": {
    title: "Graphic Design, Logo Design & App Development | PassionWorld Designs",
    description: "Elevate your business with custom graphic design, brand identities, mobile apps, and responsive websites. Partner with PassionWorld Designs today.",
    canonical: "/",
    type: "website",
    image: `${siteUrl}/hero-background.jpg`,
    imageAlt: "PassionWorld Designs creative agency",
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "PassionWorld Designs",
        url: `${siteUrl}/`,
        logo: `${siteUrl}/lion-favicon.svg`,
        description: "PassionWorld Designs provides graphic design, logo branding, mobile app development, and responsive website solutions.",
        sameAs: [
          "https://facebook.com/passionworlddesigns",
          "https://instagram.com/passionworlddesigns",
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "PassionWorld Designs",
        url: `${siteUrl}/`,
      },
    ],
  },
  "/services": {
    title: "Design, Branding & Software Services | PassionWorld Designs",
    description: "Explore comprehensive creative services including graphic design, logo branding, iOS & Android app development, custom web solutions, and digital marketing.",
    canonical: "/services",
    type: "website",
    image: `${siteUrl}/services-catalog.png`,
    imageAlt: "PassionWorld Designs services overview",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Graphic Design & App Development Services",
      provider: {
        "@type": "Organization",
        name: "PassionWorld Designs",
        url: `${siteUrl}/`,
      },
      serviceType: "Digital Design and Software Engineering",
      areaServed: "Worldwide",
    },
  },
  "/graphic-design": {
    title: "Graphic Design & Logo Branding Services | PassionWorld Designs",
    description: "Custom logo design, corporate branding, marketing collateral, flyers, brochures, packaging, and digital graphics tailored to grow your business.",
    canonical: "/graphic-design",
    type: "website",
    image: `${siteUrl}/services-catalog.png`,
    imageAlt: "Graphic design and branding services",
  },
  "/app-development": {
    title: "Mobile & Web App Development Services | PassionWorld Designs",
    description: "Custom mobile and web application development. We build scalable iOS, Android, CRM, booking, and e-commerce solutions that drive real results.",
    canonical: "/app-development",
    type: "website",
    image: `${siteUrl}/services-catalog.png`,
    imageAlt: "Custom app and software development",
  },
  "/portfolio": {
    title: "Our Work & Design Portfolio Showcase | PassionWorld Designs",
    description: "Browse our creative portfolio featuring recent branding, graphic design, mobile app development, and bespoke website projects crafted with passion.",
    canonical: "/portfolio",
    type: "website",
    image: `${siteUrl}/portfolio-state.png`,
    imageAlt: "PassionWorld Designs project portfolio",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Creative Design & Development Portfolio",
      description: "A showcase of branding, design, web development, and mobile application projects.",
      url: `${siteUrl}/portfolio`,
    },
  },
  "/contact": {
    title: "Contact Us – Request a Free Consultation | PassionWorld Designs",
    description: "Ready to start your next creative project? Contact PassionWorld Designs for custom graphic design, app development, and branding inquiries.",
    canonical: "/contact",
    type: "website",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact PassionWorld Designs",
      url: `${siteUrl}/contact`,
    },
  },
  "/start-project": {
    title: "Start Your Project – Request a Quote | PassionWorld Designs",
    description: "Tell us about your project vision, features, and timeline to receive a clear scope, roadmap, and starting cost estimate from our creative team.",
    canonical: "/start-project",
    type: "website",
  },
  "/testimonials": {
    title: "Client Reviews & Testimonials | PassionWorld Designs",
    description: "Read verified client reviews and feedback about PassionWorld Designs graphic design, logo branding, web development, and digital marketing services.",
    canonical: "/testimonials",
    type: "website",
  },
  "/vacancies": {
    title: "Careers & Creative Job Openings | PassionWorld Designs",
    description: "Join our dynamic creative team. Explore current career openings in graphic design, mobile app engineering, web development, and digital marketing.",
    canonical: "/vacancies",
    type: "website",
  },
  "/learning-center": {
    title: "Learning Center & Growth Insights | PassionWorld Designs",
    description: "Expert guides and tutorials on graphic design principles, logo branding strategies, modern web design, and digital marketing tactics for businesses.",
    canonical: "/learning-center",
    type: "website",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "PassionWorld Designs Learning Center",
      url: `${siteUrl}/learning-center`,
    },
  },
  "/blog": {
    title: "Design & Development Blog | PassionWorld Designs",
    description: "Read the latest articles on branding trends, UI/UX best practices, software development tips, and digital marketing insights from our team.",
    canonical: "/blog",
    type: "website",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "PassionWorld Designs Blog",
      url: `${siteUrl}/blog`,
    },
  },
  "/tools/project-planner": {
    title: "Interactive Project Planner & Cost Calculator | PassionWorld Designs",
    description: "Plan your custom website, app, or branding project step-by-step. Select your features and calculate an instant realistic cost estimate online.",
    canonical: "/tools/project-planner",
    type: "website",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "PassionWorld Designs Project Planner",
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      url: `${siteUrl}/tools/project-planner`,
    },
  },
  "/news": {
    title: "Latest Studio News & Announcements | PassionWorld Designs",
    description: "Stay updated with recent product launches, feature updates, studio announcements, client achievements, and creative milestones from our team.",
    canonical: "/news",
    type: "website",
  },
  "/admin": {
    title: "Admin Portal | PassionWorld Designs",
    description: "Secure administrative content management portal for PassionWorld Designs.",
    canonical: "/admin",
    robots: "noindex, nofollow",
  },
};

export const notFoundSEO: RouteSEOData = {
  title: "Page Not Found (404) | PassionWorld Designs",
  description: "The page you are looking for does not exist or may have been moved. Return to the homepage or explore our design and development services.",
  canonical: "/404",
  robots: "noindex, follow",
};

export const getSEOForRoute = (pathname: string): RouteSEOData => {
  // Normalize path by stripping trailing slash unless it's root
  const cleanPath = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  if (routeSEOMap[cleanPath]) {
    return routeSEOMap[cleanPath];
  }

  // Handle dynamic article route fallback (/learning-center/:id)
  if (cleanPath.startsWith("/learning-center/")) {
    const slug = cleanPath.replace("/learning-center/", "");
    const formattedTitle = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      title: `${formattedTitle || "Article"} | PassionWorld Designs`,
      description: "Read design, branding, website, and digital growth insights from PassionWorld Designs.",
      canonical: cleanPath,
      type: "article",
    };
  }

  return notFoundSEO;
};

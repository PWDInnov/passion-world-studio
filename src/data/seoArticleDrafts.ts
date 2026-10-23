import type { BlogPost } from "@/types";

export interface SeoTopicIdea {
  title: string;
  category: string;
  intent: string;
}

export const seoTopicIdeas: SeoTopicIdea[] = [
  {
    title: "How to Build a High-Converting Brand Identity in 2026",
    category: "Branding",
    intent: "Commercial / Informational",
  },
  {
    title: "Mobile App vs. Responsive Web App: What Does Your Business Need?",
    category: "Software Development",
    intent: "Decision Support",
  },
  {
    title: "Essential SEO Tactics for Local Businesses and Startups",
    category: "Digital Marketing",
    intent: "Growth / Search",
  },
];

export const seoArticleDrafts: Omit<BlogPost, "id">[] = [
  {
    title: "How to Build a High-Converting Brand Identity in 2026",
    slug: "build-high-converting-brand-identity",
    excerpt: "Discover the core visual and psychological elements behind memorable branding that turns first-time visitors into loyal brand advocates.",
    content: `
      <h2>The Anatomy of a Modern Brand Identity</h2>
      <p>In today's crowded digital marketplace, a brand is far more than just a logo. It is the emotional and functional promise your business makes to every customer who encounters your products.</p>
      <h3>1. Typography with Intent</h3>
      <p>Carefully chosen typography establishes hierarchy, tone, and credibility in less than a second.</p>
      <h3>2. Color Psychology & Contrast</h3>
      <p>High-contrast palettes enhance accessibility while evoking distinct emotional states—from confidence and luxury to energy and innovation.</p>
      <h3>3. Consistent Design Systems</h3>
      <p>Ensuring your website, mobile app, and print packaging share unified design tokens eliminates friction and builds consumer trust.</p>
    `,
    author: "PassionWorld Team",
    date: new Date().toISOString(),
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    imageAlt: "Brand design sketches and color swatches",
    tags: ["Branding", "Design", "Identity", "Conversion"],
    status: "published",
    metaTitle: "How to Build a High-Converting Brand Identity in 2026",
    metaDescription: "Learn key strategies to build a cohesive, memorable visual brand that commands attention and drives client conversion.",
    publishedAt: new Date().toISOString(),
  },
  {
    title: "Mobile App vs. Responsive Web App: Which Path Is Right for You?",
    slug: "mobile-app-vs-responsive-web-app",
    excerpt: "Comparing performance, development costs, offline capabilities, and audience reach to help you choose the best technology stack.",
    content: `
      <h2>Choosing the Right Platform for Your Vision</h2>
      <p>Deciding whether to build a native mobile app or an accessible web application is one of the most critical product decisions for early-stage and growing ventures.</p>
      <h3>When to Choose a Web App</h3>
      <p>Web applications deliver frictionless discovery via search engines, instant updates without app store reviews, and rapid cross-device availability.</p>
      <h3>When to Invest in a Native Mobile App</h3>
      <p>If your product requires deep device hardware access (biometrics, Bluetooth, camera processing), rich push notifications, or reliable offline execution, native or Flutter/React Native apps are unmatched.</p>
    `,
    author: "PassionWorld Engineering",
    date: new Date().toISOString(),
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
    imageAlt: "Mobile application interface on smartphone",
    tags: ["Mobile Apps", "Web Development", "Technology", "UI/UX"],
    status: "published",
    metaTitle: "Mobile App vs. Responsive Web App: Complete Business Guide",
    metaDescription: "Understand the ROI, development timelines, and performance tradeoffs between mobile applications and custom web solutions.",
    publishedAt: new Date().toISOString(),
  },
];

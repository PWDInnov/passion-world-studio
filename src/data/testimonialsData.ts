export interface OutcomeMetric {
  value: string;
  label: string;
  description?: string;
  trend?: "up" | "down";
}

export interface CaseStudyData {
  title: string;
  subtitle: string;
  timeline: string;
  industry: string;
  deliverables: string[];
  challenge: string;
  solution: string;
  impactSummary: string;
  metrics: {
    value: string;
    label: string;
    subtext: string;
  }[];
  quote: {
    text: string;
    author: string;
    role: string;
  };
  keyTakeaway: string;
  relatedServiceId: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  rating: number;
  serviceCategory: string;
  quote: string;
  verified: boolean;
  outcomeMetric: OutcomeMetric;
  caseStudy: CaseStudyData;
}

export const initialTestimonials: TestimonialItem[] = [
  {
    id: "techstart-platform",
    name: "Sarah Johnson",
    role: "Chief Executive Officer",
    company: "TechStart Innovations",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    rating: 5,
    serviceCategory: "App & Web Platform",
    quote: "Working with PassionWorld Designs was a transformative leap for our startup. Their architectural clarity and UI precision doubled our product adoption within weeks.",
    verified: true,
    outcomeMetric: {
      value: "+140%",
      label: "Conversion Rate",
      description: "Sign-to-paid conversion jump in Q2",
      trend: "up"
    },
    caseStudy: {
      title: "TechStart SaaS Platform & Mobile Companion App",
      subtitle: "Re-engineering a clunky prototype into an investor-ready, high-converting digital product.",
      timeline: "8 Weeks",
      industry: "Enterprise SaaS & B2B Productivity",
      deliverables: ["Full UX/UI System", "Responsive Web App", "iOS & Android App Prototype", "Brand Guidelines"],
      challenge: "TechStart had built an initial beta that suffered from a 70% drop-off during user onboarding. The UI was visually disjointed, and users struggled to discover core features without extensive training.",
      solution: "We performed a full UX audit, redesigned the user onboarding flow to reduce cognitive load from 9 steps to 3, and engineered a modern, dark/light responsive interface using Tailwind and micro-interactions.",
      impactSummary: "Delivered a unified design language and rock-solid platform that enabled TechStart to close their $1.8M seed round and achieve rapid organic customer acquisition.",
      metrics: [
        { value: "+140%", label: "Conversion Rate", subtext: "Free trial to paid subscription" },
        { value: "3.5x", label: "Monthly Active Users", subtext: "Grew from 12k to 42k in 90 days" },
        { value: "4.9 ★", label: "App Store Rating", subtext: "Over 800+ 5-star customer reviews" }
      ],
      quote: {
        text: "PassionWorld didn't just design screens—they reshaped how our customers experience our value proposition.",
        author: "Sarah Johnson",
        role: "CEO, TechStart Inc."
      },
      keyTakeaway: "Streamlined 3-step onboarding coupled with instant value previews reduced trial churn by more than half.",
      relatedServiceId: "app-development"
    }
  },
  {
    id: "apex-logistics",
    name: "Marcus Vance",
    role: "Managing Director",
    company: "Apex Freight & Logistics",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    rating: 5,
    serviceCategory: "Enterprise Portal & Branding",
    quote: "They streamlined our legacy booking dashboard into an ultra-fast, intuitive web portal. What used to take our dispatchers 15 minutes now takes less than 3 minutes.",
    verified: true,
    outcomeMetric: {
      value: "2.8x",
      label: "Booking Velocity",
      description: "Average dispatch creation time reduced by 68%",
      trend: "up"
    },
    caseStudy: {
      title: "Apex Logistics Global Dispatch & Client Fleet Portal",
      subtitle: "Digitizing multi-carrier freight scheduling and real-time shipment monitoring.",
      timeline: "10 Weeks",
      industry: "Supply Chain & Logistics",
      deliverables: ["Fleet Tracking Portal", "B2B Client Dashboard", "Brand Visual Identity", "Design System"],
      challenge: "Apex was managing over $40M in annual freight movement across fractured spreadsheets and outdated desktop software, resulting in frequent customer service tickets and delayed quotes.",
      solution: "PassionWorld designed and architected a single glass-cockpit dashboard with interactive freight tracking, automated price quoting, and instant shipment verification.",
      impactSummary: "The new portal eliminated paperwork bottlenecks and helped Apex onboard 34 enterprise cargo carriers within the first quarter of deployment.",
      metrics: [
        { value: "2.8x", label: "Booking Velocity", subtext: "Average shipment scheduling speed" },
        { value: "-55%", label: "Support Tickets", subtext: "Immediate drop in client status inquiries" },
        { value: "100%", label: "Real-Time Tracking", subtext: "Driver GPS updates synchronized live" }
      ],
      quote: {
        text: "Our clients rave about how effortless it is to book and track shipments now. It is easily our company's best digital investment.",
        author: "Marcus Vance",
        role: "Managing Director, Apex Logistics"
      },
      keyTakeaway: "Clear data hierarchy and proactive automated notifications dramatically reduce customer inquiry volume.",
      relatedServiceId: "software"
    }
  },
  {
    id: "lumina-apparel",
    name: "Elena Rostova",
    role: "Creative Director",
    company: "Lumina London Fashion",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    rating: 5,
    serviceCategory: "E-Commerce & Brand Identity",
    quote: "Our bespoke e-commerce store designed by PassionWorld Designs completely redefined our brand identity. Our mobile revenue grew by 210% in the first quarter post-launch.",
    verified: true,
    outcomeMetric: {
      value: "+210%",
      label: "Online Revenue",
      description: "Q1 mobile commerce revenue growth",
      trend: "up"
    },
    caseStudy: {
      title: "Lumina Haute Couture: Digital Flagship & Visual Rebrand",
      subtitle: "Elevating a sustainable luxury apparel label into a high-performing global boutique.",
      timeline: "6 Weeks",
      industry: "Luxury Fashion & Retail",
      deliverables: ["E-Commerce Architecture", "Editorial Photography System", "Checkout Flow Optimization", "Lookbook UI"],
      challenge: "Lumina possessed stunning collections, but their existing storefront had high checkout drop-offs on mobile devices and failed to communicate their premium sustainable craftsmanship.",
      solution: "We crafted an editorial, high-fashion aesthetic featuring smooth collection transitions, full-screen product views, Apple Pay one-tap checkout, and immersive video lookbooks.",
      impactSummary: "Created an online storefront that rivals global luxury fashion houses, driving substantial increase in average order value and repeat customer retention.",
      metrics: [
        { value: "+210%", label: "Mobile Revenue", subtext: "Direct-to-consumer store growth" },
        { value: "-38%", label: "Cart Abandonment", subtext: "Streamlined one-step mobile checkout" },
        { value: "+64%", label: "Average Order Value", subtext: "Driven by curated style bundles" }
      ],
      quote: {
        text: "The look, feel, and seamless mobile performance exceeded every expectation. Our customers constantly compliment the design.",
        author: "Elena Rostova",
        role: "Creative Director, Lumina"
      },
      keyTakeaway: "Micro-interactions and frictionless one-tap mobile checkout make all the difference in luxury conversion rates.",
      relatedServiceId: "ecommerce"
    }
  },
  {
    id: "finpulse-core",
    name: "David Chen",
    role: "Head of Product",
    company: "FinPulse Banking",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    rating: 5,
    serviceCategory: "Fintech Mobile Application",
    quote: "PassionWorld's ability to simplify complex financial instruments into intuitive, accessible mobile interfaces is world-class. Our compliance and design teams were equally thrilled.",
    verified: true,
    outcomeMetric: {
      value: "450k+",
      label: "App Downloads",
      description: "Surpassed 450,000 downloads in 6 months",
      trend: "up"
    },
    caseStudy: {
      title: "FinPulse Wealth & Cross-Border Payments App",
      subtitle: "Architecting a secure, ultra-responsive consumer financial app with biometric verification.",
      timeline: "12 Weeks",
      industry: "Fintech & Digital Banking",
      deliverables: ["iOS & Android Design", "Interactive Financial Charts", "Security Flow UX", "Design Tokens"],
      challenge: "Financial apps are notorious for overwhelming users with dense tables and intimidating terminology. FinPulse needed a clean, secure experience that instilled trust without confusion.",
      solution: "Built a human-first design system featuring real-time visual spending analytics, biometric quick-transfers, and instant international settlement status trackers.",
      impactSummary: "FinPulse reached #3 on the Finance charts within its launch month, enjoying industry-leading daily retention metrics.",
      metrics: [
        { value: "450k+", label: "Total Downloads", subtext: "Achieved within the first half-year" },
        { value: "99.8%", label: "CSAT Score", subtext: "Customer satisfaction with transfer speed" },
        { value: "4.8 ★", label: "Store Average", subtext: "Rated across 3,200+ consumer reviews" }
      ],
      quote: {
        text: "PassionWorld delivered an interface that made banking feel effortless, transparent, and enjoyable.",
        author: "David Chen",
        role: "Head of Product, FinPulse"
      },
      keyTakeaway: "Clear visual charting and immediate transaction feedback give users emotional confidence in financial apps.",
      relatedServiceId: "mobile"
    }
  },
  {
    id: "horizon-health",
    name: "Dr. Amina Diallo",
    role: "Managing Director",
    company: "Horizon Health Group",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    rating: 5,
    serviceCategory: "Healthcare UI/UX & Portal",
    quote: "Patient feedback has been overwhelmingly positive. The accessibility and clarity of our booking and results portal set a new benchmark for private clinics in our region.",
    verified: true,
    outcomeMetric: {
      value: "+185%",
      label: "Self-Scheduling",
      description: "Patients booking appointments online without phone calls",
      trend: "up"
    },
    caseStudy: {
      title: "Horizon Health Patient Portal & Brand System",
      subtitle: "Designing an accessible, HIPAA/GDPR-compliant telehealth and clinic appointment portal.",
      timeline: "7 Weeks",
      industry: "Healthcare & Life Sciences",
      deliverables: ["Accessible Web Portal", "Physician Directory", "Appointment Scheduler", "Patient Notification System"],
      challenge: "Clinic receptionists were inundated with over 400 phone calls daily for routine appointments and lab report inquiries, leading to long hold times and patient frustration.",
      solution: "Engineered an accessible, high-contrast, multi-language self-service portal enabling patients to find specialists, schedule visits, and access encrypted lab results in under 90 seconds.",
      impactSummary: "Reduced front-desk phone congestion by 60%, drastically improving patient satisfaction scores across all regional clinics.",
      metrics: [
        { value: "+185%", label: "Online Bookings", subtext: "Self-scheduled visits via web portal" },
        { value: "-42%", label: "Administrative Overhead", subtext: "Reduction in front-desk call load" },
        { value: "100%", label: "WCAG AAA Compliant", subtext: "High-contrast accessible readability" }
      ],
      quote: {
        text: "Our physicians and patients both love the interface. It has made clinical appointments remarkably smooth.",
        author: "Dr. Amina Diallo",
        role: "Managing Director, Horizon Health"
      },
      keyTakeaway: "Accessibility-first typography and high-contrast cues ensure elderly and mobile users can navigate with zero friction.",
      relatedServiceId: "website"
    }
  },
  {
    id: "urban-roast",
    name: "Oliver Thorne",
    role: "Co-Founder",
    company: "Urban Roast Artisanal Coffee",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    rating: 5,
    serviceCategory: "Packaging & Brand Identity",
    quote: "The visual identity, logo, and physical packaging design created by PassionWorld secured our products shelf placement in over 120 boutique supermarkets nationwide.",
    verified: true,
    outcomeMetric: {
      value: "4.6x",
      label: "Retail Distribution",
      description: "Expanded retail shelf footprint in year one",
      trend: "up"
    },
    caseStudy: {
      title: "Urban Roast Specialty Coffee Packaging & Brand Identity",
      subtitle: "Crafting iconic sustainable packaging and packaging print assets for artisanal roasters.",
      timeline: "5 Weeks",
      industry: "Consumer Goods & Specialty Beverage",
      deliverables: ["Logo & Brand Guidelines", "Biodegradable Bag Packaging", "Merchandise Design", "Retail Point-of-Sale Collateral"],
      challenge: "Urban Roast was expanding from local specialty cafes to nationwide retail, but their packaging lacked the premium shelf presence needed to compete with established legacy brands.",
      solution: "Developed an artisanal packaging suite using bespoke foil stamps, color-coded roast profiles, clear origin storytelling, and bold typography.",
      impactSummary: "The rebrand won widespread social acclaim, catching the attention of national buyers and driving a 4.6x surge in retail distribution contracts.",
      metrics: [
        { value: "4.6x", label: "Retail Footprint", subtext: "Stocked in 120+ premium outlets" },
        { value: "+92%", label: "Social Engagement", subtext: "Unboxing posts and brand tags" },
        { value: "3.4x", label: "Wholesale Reorders", subtext: "Accelerated B2B wholesale demand" }
      ],
      quote: {
        text: "People buy coffee with their eyes first. The packaging PassionWorld delivered made us impossible to ignore.",
        author: "Oliver Thorne",
        role: "Co-Founder, Urban Roast"
      },
      keyTakeaway: "Tactile, distinct packaging geometry and clear flavor signposts drive immediate retail shelf conversion.",
      relatedServiceId: "branding"
    }
  }
];

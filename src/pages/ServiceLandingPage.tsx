import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Sparkles, Layers, ShieldCheck, Zap } from "lucide-react";
import { serviceCatalog } from "@/data/serviceCatalog";

interface ServiceLandingPageProps {
  service: "graphic-design" | "app-development" | string;
}

const ServiceLandingPage = ({ service }: ServiceLandingPageProps) => {
  const isGraphicDesign = service === "graphic-design";

  const config = isGraphicDesign
    ? {
        title: "Graphic Design & Brand Identity Solutions",
        subtitle: "Distinctive, high-impact graphic design, bespoke logo branding, and visual marketing assets tailored to elevate your business.",
        categoryTitle: "Graphic Design",
        serviceId: "branding",
        highlights: [
          "Bespoke Logo & Brand Identity Systems",
          "Marketing Collateral & Print Media",
          "Social Media Content & Ad Creatives",
          "Packaging & Merchandise Design",
          "3D Mockups & Product Visuals",
          "Vector Illustrations & Iconography",
        ],
        benefits: [
          { title: "Tailored to Your Identity", desc: "Every design is crafted from scratch to resonate with your target demographics." },
          { title: "Vector & Print Ready", desc: "High-resolution deliverables across SVG, PNG, PDF, and CMYK print formats." },
          { title: "Fast Turnaround", desc: "Rapid concept delivery with iterative client revisions until 100% satisfied." },
        ],
      }
    : {
        title: "Mobile App & Web Software Development",
        subtitle: "Native iOS, Android, and cross-platform mobile apps engineered for speed, offline reliability, and delightful user experiences.",
        categoryTitle: "Software Development",
        serviceId: "mobile",
        highlights: [
          "Native iOS & Android Mobile Apps",
          "Cross-Platform React Native & Flutter Apps",
          "Custom Web Applications & Portals",
          "Interactive Booking & Reservation Engines",
          "Secure Biometric Auth & Payments",
          "Real-time Cloud Database Integration",
        ],
        benefits: [
          { title: "Production Architecture", desc: "Built with scalable cloud backends, secure APIs, and responsive UI components." },
          { title: "Offline & High Performance", desc: "Optimized for lightning-fast launch times and smooth 60fps animations." },
          { title: "End-to-End Delivery", desc: "From concept wireframes to App Store and Google Play deployment." },
        ],
      };

  const matchedCatalog = serviceCatalog.find(
    (c) => c.title.toLowerCase().includes(isGraphicDesign ? "graphic" : "software") ||
           c.title.toLowerCase().includes(isGraphicDesign ? "design" : "website")
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={`${config.title} | PassionWorld Designs`}
        description={config.subtitle}
        canonical={`/${service}`}
      />
      <Header />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-background via-muted/30 to-background border-b border-border/50">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dedicated Service Expertise</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              {config.title}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              {config.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 shadow-md"
              >
                <Link to={`/start-project?service=${config.serviceId}`} className="flex items-center gap-2">
                  Start Your Project <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link to="/portfolio">Explore Our Portfolio</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Strip */}
        <section className="py-16 bg-muted/20 border-b border-border/40">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {config.benefits.map((b, i) => (
                <div key={i} className="p-6 rounded-xl bg-card border border-border space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                    {i === 0 ? <Layers className="w-5 h-5" /> : i === 1 ? <ShieldCheck className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                  </div>
                  <h3 className="font-bold text-lg text-foreground">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Deliverables Checklist */}
        <section className="py-20 container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">What We Deliver</h2>
            <p className="text-muted-foreground mt-2">Comprehensive solutions tailored to your unique brand specifications.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {config.highlights.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card/60">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="font-medium text-foreground">{item}</span>
              </div>
            ))}
          </div>

          {matchedCatalog && matchedCatalog.items && (
            <div className="mt-12 p-6 rounded-2xl bg-muted/30 border border-border/60">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Available Capabilities &amp; Formats
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchedCatalog.items.map((subItem) => (
                  <Badge key={subItem} variant="secondary" className="px-3 py-1 text-xs">
                    {subItem}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* CTA Strip */}
        <section className="py-20 bg-muted/40 border-t border-border">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Ready to Bring Your Vision to Life?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8">
              Get in touch with our creative and engineering team today to receive a personalized scope and timeline.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 shadow-md"
            >
              <Link to={`/start-project?service=${config.serviceId}`}>
                Request Free Consultation &amp; Quote
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceLandingPage;

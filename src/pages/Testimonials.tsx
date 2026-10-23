import { useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Sparkles, Award, Users, Star } from "lucide-react";
import useFirestore from "@/hooks/use-firestore";
import SEO from "@/components/SEO";
import { TestimonialsCarousel } from "@/components/testimonials/TestimonialsCarousel";
import { TestimonialItem, initialTestimonials } from "@/data/testimonialsData";

const TestimonialsSkeleton = () => (
  <div className="w-full space-y-6">
    <div className="flex justify-between items-end mb-8">
      <div className="space-y-3">
        <Skeleton className="h-4 w-36 rounded-full" />
        <Skeleton className="h-9 w-64 md:w-96" />
        <Skeleton className="h-5 w-80" />
      </div>
      <Skeleton className="h-9 w-32 hidden md:block" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 rounded-2xl border bg-card space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full" />
          <div className="pt-4 border-t flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

const Testimonials = () => {
  const { docs: firestoreDocs, loading } = useFirestore("testimonials");

  const testimonialsList: TestimonialItem[] = useMemo(() => {
    if (!firestoreDocs || firestoreDocs.length === 0) {
      return initialTestimonials;
    }

    const firestoreMapped: TestimonialItem[] = firestoreDocs.map((doc, idx) => {
      const fallback = initialTestimonials[idx % initialTestimonials.length];
      return {
        id: doc.id,
        name: doc.name || fallback.name,
        role: doc.role || fallback.role,
        company: doc.company || fallback.company,
        avatarUrl: doc.imageUrl || doc.avatarUrl || fallback.avatarUrl,
        rating: doc.rating ?? 5,
        serviceCategory: doc.serviceCategory || fallback.serviceCategory,
        quote: doc.quote || fallback.quote,
        verified: doc.verified ?? true,
        outcomeMetric: doc.outcomeMetric || fallback.outcomeMetric,
        caseStudy: doc.caseStudy || fallback.caseStudy,
      };
    });

    // Merge unique initial testimonials so user has full catalog
    const existingNames = new Set(firestoreMapped.map((item) => item.name.toLowerCase()));
    const additional = initialTestimonials.filter(
      (item) => !existingNames.has(item.name.toLowerCase())
    );

    return [...firestoreMapped, ...additional];
  }, [firestoreDocs]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Client Reviews, ROI Case Studies & Testimonials | PassionWorld Designs"
        description="Explore verified client feedback, quantifiable project outcome metrics (+140% conversions), and in-depth design and app development case studies."
        canonical="/testimonials"
      />
      <Header />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-24 bg-gradient-to-br from-background via-muted/30 to-background border-b border-border/50">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Measurable Impact &amp; Proven Craftsmanship</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              Client <span className="text-primary">Reviews</span> &amp; Case Studies
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              Discover how our bespoke branding, high-performing websites, and custom mobile apps deliver tangible growth for ambitious businesses.
            </p>

            {/* Social Proof Stats Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-border/60">
              <div className="p-4 rounded-xl bg-card/60 border border-border/60">
                <div className="text-2xl md:text-3xl font-extrabold text-primary">99.4%</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">Client Satisfaction</div>
              </div>
              <div className="p-4 rounded-xl bg-card/60 border border-border/60">
                <div className="text-2xl md:text-3xl font-extrabold text-primary">150+</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">Delivered Projects</div>
              </div>
              <div className="p-4 rounded-xl bg-card/60 border border-border/60">
                <div className="text-2xl md:text-3xl font-extrabold text-primary">4.9 ★</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">Average Star Rating</div>
              </div>
              <div className="p-4 rounded-xl bg-card/60 border border-border/60">
                <div className="text-2xl md:text-3xl font-extrabold text-primary">100%</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">On-Time Delivery</div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Embla Carousel & Case Study Section */}
        <section className="py-16 md:py-24 container mx-auto px-4">
          {loading ? (
            <TestimonialsSkeleton />
          ) : (
            <TestimonialsCarousel
              items={testimonialsList}
              title="Verified Reviews & Impact Metrics"
              subtitle="Swipe or toggle through our latest customer testimonials and click any card to inspect full problem-solution case studies."
              showViewToggle={true}
            />
          )}
        </section>

        {/* High-Converting CTA Section */}
        <section className="py-20 bg-muted/40 border-t border-border">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Ready to Accelerate Your Brand?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8">
              Join forward-thinking companies that trust PassionWorld Designs to build digital experiences that drive genuine revenue.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 shadow-md"
              >
                <Link to="/start-project" className="flex items-center gap-2">
                  Start Your Project Today <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link to="/tools/project-planner">
                  Calculate Instant Estimate
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Testimonials;

import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Quote,
  TrendingUp,
  FileText,
  CheckCircle,
  LayoutGrid,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { TestimonialItem, initialTestimonials } from "@/data/testimonialsData";
import { CaseStudyModal } from "./CaseStudyModal";

interface TestimonialsCarouselProps {
  items?: TestimonialItem[];
  title?: string;
  subtitle?: string;
  showViewToggle?: boolean;
}

export const TestimonialsCarousel = ({
  items = initialTestimonials,
  title = "Client Success Stories",
  subtitle = "Real results, measurable ROI, and verified testimonials from our partners worldwide",
  showViewToggle = true,
}: TestimonialsCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<TestimonialItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleOpenCaseStudy = useCallback((item: TestimonialItem) => {
    setSelectedCaseStudy(item);
    setIsModalOpen(true);
  }, []);

  return (
    <div className="w-full">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Verified Client Outcomes</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-base text-muted-foreground mt-2 max-w-2xl">
            {subtitle}
          </p>
        </div>

        {showViewToggle && (
          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className="flex items-center p-1 rounded-lg bg-muted/60 border border-border text-xs">
              <button
                onClick={() => setViewMode("carousel")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                  viewMode === "carousel"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Carousel View"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Carousel</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">All Stories ({items.length})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {viewMode === "carousel" ? (
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {items.map((testimonial) => (
                <CarouselItem
                  key={testimonial.id}
                  className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="h-full flex flex-col justify-between border-border bg-card/80 backdrop-blur hover:shadow-lg transition-all duration-300 group hover:border-primary/40 relative overflow-hidden">
                    <CardContent className="p-6 md:p-7 flex flex-col h-full justify-between">
                      {/* Top Metric & Rating */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full text-xs font-semibold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{testimonial.rating}.0</span>
                          </div>

                          <span className="text-xs font-medium text-muted-foreground">
                            {testimonial.serviceCategory}
                          </span>
                        </div>

                        {/* Project Outcome Metric Highlight */}
                        <div className="mb-5 p-3.5 rounded-xl bg-primary/5 border border-primary/15 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-2xl font-black text-primary tracking-tight">
                              {testimonial.outcomeMetric.value}
                            </div>
                            <div className="text-xs font-semibold text-foreground/90 uppercase tracking-wider">
                              {testimonial.outcomeMetric.label}
                            </div>
                          </div>
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Quote */}
                        <blockquote className="text-sm md:text-base leading-relaxed text-foreground/80 italic mb-6 relative">
                          <Quote className="w-5 h-5 text-primary/20 inline-block mr-1 -mt-1" />
                          "{testimonial.quote}"
                        </blockquote>
                      </div>

                      {/* Author & Action */}
                      <div className="pt-4 border-t border-border/60">
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-11 w-11 border-2 border-background shadow-md">
                              <AvatarImage
                                src={testimonial.avatarUrl}
                                alt={testimonial.name}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                                {testimonial.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-bold text-foreground">
                                {testimonial.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {testimonial.role}, {testimonial.company}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Case Study Trigger Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenCaseStudy(testimonial)}
                          className="w-full text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Read Full Case Study
                          <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Custom Carousel Controls */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      current === index
                        ? "w-8 bg-primary"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <CarouselPrevious className="static translate-y-0 h-9 w-9 rounded-lg border-border hover:border-primary" />
                <CarouselNext className="static translate-y-0 h-9 w-9 rounded-lg border-border hover:border-primary" />
              </div>
            </div>
          </Carousel>
        </div>
      ) : (
        /* Grid View Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {items.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="flex flex-col justify-between border-border bg-card/80 backdrop-blur hover:shadow-lg transition-all duration-300 group hover:border-primary/40"
            >
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{testimonial.rating}.0</span>
                    </div>

                    <span className="text-xs font-medium text-muted-foreground">
                      {testimonial.serviceCategory}
                    </span>
                  </div>

                  {/* Project Outcome Metric Highlight */}
                  <div className="mb-5 p-3.5 rounded-xl bg-primary/5 border border-primary/15 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-2xl font-black text-primary tracking-tight">
                        {testimonial.outcomeMetric.value}
                      </div>
                      <div className="text-xs font-semibold text-foreground/90 uppercase tracking-wider">
                        {testimonial.outcomeMetric.label}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-sm leading-relaxed text-foreground/80 italic mb-6">
                    <Quote className="w-4 h-4 text-primary/20 inline-block mr-1 -mt-1" />
                    "{testimonial.quote}"
                  </blockquote>
                </div>

                <div className="pt-4 border-t border-border/60">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10 border border-background shadow-md">
                      <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {testimonial.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-bold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenCaseStudy(testimonial)}
                    className="w-full text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Read Full Case Study
                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Case Study Modal */}
      <CaseStudyModal
        item={selectedCaseStudy}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};

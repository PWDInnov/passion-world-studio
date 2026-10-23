import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TestimonialItem } from "@/data/testimonialsData";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Building2,
  Quote,
} from "lucide-react";

interface CaseStudyModalProps {
  item: TestimonialItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CaseStudyModal = ({ item, open, onOpenChange }: CaseStudyModalProps) => {
  if (!item) return null;

  const { caseStudy } = item;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-2xl border-border bg-card">
        {/* Header Metadata */}
        <DialogHeader className="space-y-3 text-left pb-4 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {caseStudy.industry}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>Project Duration: {caseStudy.timeline}</span>
            </div>
          </div>

          <DialogTitle className="text-2xl md:text-3xl font-bold tracking-tight text-foreground text-balance">
            {caseStudy.title}
          </DialogTitle>

          <DialogDescription className="text-base text-muted-foreground">
            {caseStudy.subtitle}
          </DialogDescription>
        </DialogHeader>

        {/* Outcome Metrics Strip */}
        <div className="my-6 p-4 md:p-6 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Verified Project Outcomes &amp; ROI
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {caseStudy.metrics.map((metric, idx) => (
              <div key={idx} className="bg-background/80 p-4 rounded-lg border border-border/50">
                <div className="text-2xl md:text-3xl font-extrabold text-primary mb-1">
                  {metric.value}
                </div>
                <div className="text-sm font-semibold text-foreground">{metric.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{metric.subtext}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenge & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" /> The Challenge
            </h4>
            <p className="text-sm leading-relaxed text-foreground/90 bg-muted/40 p-4 rounded-xl border border-border/50">
              {caseStudy.challenge}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" /> The Solution
            </h4>
            <p className="text-sm leading-relaxed text-foreground/90 bg-muted/40 p-4 rounded-xl border border-border/50">
              {caseStudy.solution}
            </p>
          </div>
        </div>

        {/* Deliverables */}
        <div className="my-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Core Deliverables Provided
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {caseStudy.deliverables.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-foreground bg-muted/30 px-3 py-2 rounded-lg border border-border/40"
              >
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Quote Card */}
        <div className="my-6 p-5 rounded-xl border border-border bg-muted/20 relative">
          <Quote className="w-8 h-8 text-primary/20 absolute right-4 top-4" />
          <p className="text-sm md:text-base italic text-foreground/90 leading-relaxed mb-4">
            "{caseStudy.quote.text}"
          </p>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-primary/20">
              <AvatarImage src={item.avatarUrl} alt={item.name} />
              <AvatarFallback>{item.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-bold text-foreground">{caseStudy.quote.author}</div>
              <div className="text-xs text-muted-foreground">{caseStudy.quote.role}</div>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground text-center sm:text-left">
            Need similar results for your business?
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            <Button
              asChild
              size="sm"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
            >
              <Link
                to={`/start-project?service=${caseStudy.relatedServiceId}`}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-1.5"
              >
                Start Similar Project <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { Star, TrendingUp, FileText, Sparkles } from 'lucide-react';
import { TestimonialItem } from '@/data/testimonialsData';

interface TestimonialFormProps {
  item: (Partial<TestimonialItem> & Record<string, unknown>) | null;
  onSave: (savedItem: Record<string, unknown>) => void;
  onCancel: () => void;
}

const TestimonialForm = ({ item, onSave, onCancel }: TestimonialFormProps) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [quote, setQuote] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState(5);
  const [serviceCategory, setServiceCategory] = useState('');

  // Outcome Metric fields
  const [metricValue, setMetricValue] = useState('');
  const [metricLabel, setMetricLabel] = useState('');

  // Case Study fields
  const [timeline, setTimeline] = useState('');
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [deliverables, setDeliverables] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setRole(item.role || '');
      setCompany(item.company || '');
      setQuote(item.quote || '');
      setImageUrl(item.imageUrl || item.avatarUrl || '');
      setRating(item.rating || 5);
      setServiceCategory(item.serviceCategory || '');

      if (item.outcomeMetric) {
        setMetricValue(item.outcomeMetric.value || '');
        setMetricLabel(item.outcomeMetric.label || '');
      } else {
        setMetricValue('+140%');
        setMetricLabel('Conversion Rate');
      }

      if (item.caseStudy) {
        setTimeline(item.caseStudy.timeline || '');
        setChallenge(item.caseStudy.challenge || '');
        setSolution(item.caseStudy.solution || '');
        setDeliverables(
          Array.isArray(item.caseStudy.deliverables)
            ? item.caseStudy.deliverables.join(', ')
            : item.caseStudy.deliverables || ''
        );
      } else {
        setTimeline('6 Weeks');
        setChallenge('');
        setSolution('');
        setDeliverables('UI/UX System, Web Platform, Brand Identity');
      }
    } else {
      setName('');
      setRole('');
      setCompany('');
      setQuote('');
      setImageUrl('');
      setRating(5);
      setServiceCategory('Design & Development');
      setMetricValue('+140%');
      setMetricLabel('Conversion Rate');
      setTimeline('6 Weeks');
      setChallenge('');
      setSolution('');
      setDeliverables('UI/UX System, Web Platform, Brand Identity');
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedDeliverables = deliverables
        ? deliverables.split(',').map((d) => d.trim()).filter(Boolean)
        : ['UI/UX Design', 'Custom Development', 'Brand Assets'];

      const testimonialData = {
        name,
        role,
        company,
        quote,
        imageUrl,
        rating: Number(rating),
        serviceCategory: serviceCategory || 'Design & Development',
        outcomeMetric: {
          value: metricValue || '+100%',
          label: metricLabel || 'Growth Impact',
          trend: 'up',
        },
        caseStudy: {
          title: item?.caseStudy?.title || `${name} & ${company || 'PassionWorld Designs'} Showcase`,
          subtitle: item?.caseStudy?.subtitle || `Comprehensive digital transformation for ${company || name}.`,
          timeline: timeline || '6 Weeks',
          industry: serviceCategory || 'Technology & Innovation',
          challenge: challenge || quote,
          solution: solution || 'Engineered bespoke UI/UX and modern responsive codebase with PassionWorld Designs.',
          deliverables: parsedDeliverables,
          metrics: [
            {
              value: metricValue || '+100%',
              label: metricLabel || 'Verified ROI',
              subtext: 'Quantified client result',
            },
            {
              value: `${rating}.0 ★`,
              label: 'Client Satisfaction',
              subtext: '5-star delivery standard',
            },
            {
              value: '100%',
              label: 'On-Time Delivery',
              subtext: 'Completed on schedule',
            },
          ],
          quote: {
            text: quote,
            author: name,
            role: role + (company ? `, ${company}` : ''),
          },
          keyTakeaway: item?.caseStudy?.keyTakeaway || 'Strategic design and smooth user onboarding drive exceptional customer adoption.',
          relatedServiceId: item?.caseStudy?.relatedServiceId || 'website',
        },
      };

      if (item && item.id) {
        const testimonialDoc = doc(db, 'testimonials', item.id);
        await updateDoc(testimonialDoc, testimonialData);
        toast({ title: 'Testimonial & Case Study updated!' });
        onSave({ ...item, ...testimonialData });
      } else {
        const docRef = await addDoc(collection(db, 'testimonials'), {
          ...testimonialData,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Testimonial & Case Study created!' });
        onSave({ ...testimonialData, id: docRef.id });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save testimonial";
      toast({
        title: 'An error occurred',
        description: message,
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 border border-border rounded-xl bg-card">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="text-xl font-bold text-foreground">
            {item ? 'Edit Testimonial & Case Study' : 'Add New Testimonial & Case Study'}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage client reviews, outcome metrics, and detailed case studies displayed on /testimonials.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-xs font-semibold">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{rating}.0 Rating</span>
        </div>
      </div>

      {/* Section 1: Client Overview */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">
          1. Client Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Client Full Name *</label>
            <Input
              placeholder="e.g. Sarah Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Job Role *</label>
            <Input
              placeholder="e.g. CEO or Founder"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Company / Brand Name</label>
            <Input
              placeholder="e.g. TechStart Innovations"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Service Category Tag</label>
            <Input
              placeholder="e.g. App & Web Platform, E-Commerce, Branding"
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Client Quote / Review *</label>
          <Textarea
            placeholder="What the client said about PassionWorld Designs..."
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="testimonial-image-url" className="text-xs font-medium text-muted-foreground block mb-1">
              Profile Photo URL
            </label>
            <Input
              id="testimonial-image-url"
              type="url"
              placeholder="https://images.unsplash.com/... or direct image link"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            {imageUrl && (
              <div className="flex items-center gap-3 mt-2 rounded-lg border border-border bg-muted/30 p-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={imageUrl} alt="Profile preview" className="object-cover" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                    {name ? name.slice(0, 2).toUpperCase() : '?'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">Avatar preview</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Rating (1 to 5 Stars) *</label>
            <Input
              type="number"
              placeholder="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              min="1"
              max="5"
              required
            />
          </div>
        </div>
      </div>

      {/* Section 2: Outcome Metrics */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">
            2. Verified Outcome Metric (Displayed on Carousel Card)
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-lg border border-border/60">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Metric Value (e.g. +140%, 2.8x, 450k+) *
            </label>
            <Input
              placeholder="+140%"
              value={metricValue}
              onChange={(e) => setMetricValue(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Metric Label (e.g. Conversion Rate, Booking Velocity) *
            </label>
            <Input
              placeholder="Conversion Rate"
              value={metricLabel}
              onChange={(e) => setMetricLabel(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Section 3: Case Study Details */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">
            3. Case Study Drawer Details (When user clicks "Read Full Case Study")
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Project Timeline</label>
            <Input
              placeholder="e.g. 8 Weeks"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Deliverables (Comma-separated)
            </label>
            <Input
              placeholder="Full UX/UI System, Web App, iOS & Android App"
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">The Challenge</label>
            <Textarea
              placeholder="Explain the initial problem or bottleneck the client was facing..."
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">The Solution</label>
            <Textarea
              placeholder="Explain the strategy, architecture, and design PassionWorld delivered..."
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6">
          Save Testimonial &amp; Case Study
        </Button>
      </div>
    </form>
  );
};

export default TestimonialForm;

import { FormEvent, useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ArrowRight, CheckCircle2, Clock3, DollarSign, Loader2, Send, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/firebase";

const contactEmail = "pwdinnovate@hotmail.com";

const serviceOptions = [
  { id: "website", label: "Website development", startingAt: 500 },
  { id: "software", label: "Software development", startingAt: 1500 },
  { id: "marketing", label: "Digital marketing", startingAt: 350 },
  { id: "branding", label: "Branding and design", startingAt: 300 },
  { id: "content", label: "Creative content", startingAt: 250 },
  { id: "it", label: "IT services", startingAt: 200 },
  { id: "printing", label: "Printing and media", startingAt: 150 },
  { id: "mobile", label: "Mobile app development", startingAt: 2000 },
  { id: "ecommerce", label: "E-commerce", startingAt: 1500 },
  { id: "logo", label: "Logo design", startingAt: 200 },
];

const budgetOptions = [
  { value: "under-500", label: "Under $500" },
  { value: "500-1500", label: "$500 – $1,500" },
  { value: "1500-5000", label: "$1,500 – $5,000" },
  { value: "over-5000", label: "$5,000+" },
  { value: "not-sure", label: "I’m not sure yet" },
];

const timelineOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-2-months", label: "1–2 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "flexible", label: "I’m flexible" },
];

const StartProject = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const estimate = useMemo(
    () => serviceOptions
      .filter((service) => selectedServices.includes(service.id))
      .reduce((total, service) => total + service.startingAt, 0),
    [selectedServices],
  );

  const toggleService = (serviceId: string) => {
    setSelectedServices((current) => current.includes(serviceId)
      ? current.filter((id) => id !== serviceId)
      : [...current, serviceId]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitted(false);

    if (selectedServices.length === 0) {
      setError("Please choose at least one service so we can understand your project.");
      return;
    }

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const value = (name: string) => String(form.get(name) || "").trim();
    const selectedServiceNames = serviceOptions
      .filter((service) => selectedServices.includes(service.id))
      .map((service) => service.label);

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "messages"), {
        name: value("name"),
        email: value("email"),
        phone: value("phone"),
        company: value("company"),
        message: [
          "Project brief",
          `Services: ${selectedServiceNames.join(", ")}`,
          `Budget: ${budgetOptions.find((option) => option.value === budget)?.label || "Not specified"}`,
          `Timeline: ${timelineOptions.find((option) => option.value === timeline)?.label || "Not specified"}`,
          `Estimated starting point: $${estimate.toLocaleString()}+`,
          `Project details: ${value("details")}`,
        ].join("\n"),
        type: "project-brief",
        timestamp: serverTimestamp(),
      });
      setSubmitted(true);
      formElement.reset();
      setSelectedServices([]);
      setBudget("");
      setTimeline("");
    } catch {
      setError(`We couldn't send your project brief. Please email ${contactEmail} instead.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <SEO
        title="Start a Project | PassionWorld Designs"
        description="Tell PassionWorld Designs about your project and receive a tailored starting estimate."
        canonical="/start-project"
      />
      <Header />
      <main id="main-content" className="flex-1">
        <section className="bg-gradient-to-br from-background via-primary/5 to-background py-20">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <Badge variant="outline" className="mb-5 border-primary/40 px-4 py-1 text-primary">Start a project</Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Bring your next idea into focus.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              Share a few details and we will turn your goals into a clear scope, realistic starting estimate, and next step.
            </p>
          </div>
        </section>

        <section className="container mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Tell us about your project</CardTitle>
              <CardDescription>This takes about two minutes. You are not committing to anything.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium">What can we help you with?</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {serviceOptions.map((service) => (
                      <Label
                        key={service.id}
                        htmlFor={`service-${service.id}`}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${selectedServices.includes(service.id) ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}
                      >
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => toggleService(service.id)}
                        />
                        <span>{service.label}</span>
                      </Label>
                    ))}
                  </div>
                </fieldset>

                <div className="space-y-2">
                  <Label htmlFor="details">What are you hoping to achieve?</Label>
                  <Textarea id="details" name="details" required rows={6} placeholder="Tell us about your goals, audience, key features, or the problem you want to solve..." />
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <fieldset className="space-y-3">
                    <legend className="text-sm font-medium">What is your budget?</legend>
                    <RadioGroup value={budget} onValueChange={setBudget} className="space-y-2">
                      {budgetOptions.map((option) => (
                        <Label key={option.value} htmlFor={`budget-${option.value}`} className="flex cursor-pointer items-center gap-3 text-sm font-normal">
                          <RadioGroupItem id={`budget-${option.value}`} value={option.value} />
                          {option.label}
                        </Label>
                      ))}
                    </RadioGroup>
                  </fieldset>

                  <fieldset className="space-y-3">
                    <legend className="text-sm font-medium">When would you like to start?</legend>
                    <RadioGroup value={timeline} onValueChange={setTimeline} className="space-y-2">
                      {timelineOptions.map((option) => (
                        <Label key={option.value} htmlFor={`timeline-${option.value}`} className="flex cursor-pointer items-center gap-3 text-sm font-normal">
                          <RadioGroupItem id={`timeline-${option.value}`} value={option.value} />
                          {option.label}
                        </Label>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your name</Label>
                    <Input id="name" name="name" required placeholder="Full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" name="email" type="email" required placeholder="you@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company or organization <span className="font-normal text-muted-foreground">(optional)</span></Label>
                    <Input id="company" name="company" placeholder="Company name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone or WhatsApp <span className="font-normal text-muted-foreground">(optional)</span></Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+264 ..." />
                  </div>
                </div>

                {error && <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
                {submitted && <p role="status" className="flex items-start gap-2 rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />Thanks. Your project brief has been sent and our team will be in touch.</p>}

                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {isSubmitting ? "Sending brief..." : "Send project brief"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />Your starting estimate</CardTitle>
                <CardDescription>Based on the services you select. Final pricing follows a proper discovery call.</CardDescription>
              </CardHeader>
              <CardContent>
                {estimate > 0 ? (
                  <>
                    <p className="text-4xl font-bold text-primary">${estimate.toLocaleString()}+</p>
                    <p className="mt-2 text-sm text-muted-foreground">Indicative starting point</p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Choose one or more services to see a starting estimate.</p>
                )}
                {selectedServices.length > 0 && (
                  <ul className="mt-5 space-y-2 border-t pt-5 text-sm">
                    {serviceOptions.filter((service) => selectedServices.includes(service.id)).map((service) => (
                      <li key={service.id} className="flex justify-between gap-4"><span>{service.label}</span><span className="text-muted-foreground">from ${service.startingAt.toLocaleString()}</span></li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-5 p-6">
                <div className="flex gap-3"><DollarSign className="h-5 w-5 shrink-0 text-primary" /><div><p className="font-medium">Clear expectations</p><p className="text-sm text-muted-foreground">We use your brief to recommend the right scope, not pressure you into a package.</p></div></div>
                <div className="flex gap-3"><Clock3 className="h-5 w-5 shrink-0 text-primary" /><div><p className="font-medium">A quick response</p><p className="text-sm text-muted-foreground">We will review your details and follow up with questions or next steps.</p></div></div>
                <div className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-primary" /><div><p className="font-medium">No obligation</p><p className="text-sm text-muted-foreground">This is an initial conversation, not a contract or payment request.</p></div></div>
              </CardContent>
            </Card>

            <p className="text-center text-sm text-muted-foreground">Prefer email? Contact us at <a className="font-medium text-primary underline" href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
          </aside>
        </section>

        <section className="border-t bg-background py-12">
          <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:text-left">
            <div><p className="font-semibold">Still exploring your options?</p><p className="text-sm text-muted-foreground">Browse our services before you send your brief.</p></div>
            <Button asChild variant="outline"><Link to="/services">Explore services <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StartProject;

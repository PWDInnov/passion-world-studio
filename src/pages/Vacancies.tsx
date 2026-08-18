import { FormEvent, useState } from "react";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Clock3, MapPin, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const applicationEmail = "info.passionworlddesigns@gmail.com";

const vacancies = [
  {
    title: "Frontend Developer",
    type: "Full-time",
    location: "Remote",
    summary: "Build polished, accessible web experiences for brands that want to stand out.",
    responsibilities: ["Create responsive interfaces with React and TypeScript", "Collaborate with designers and clients", "Write maintainable, tested frontend code"],
    skills: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Graphic Designer",
    type: "Full-time",
    location: "Remote",
    summary: "Shape memorable visual identities and creative campaigns for growing businesses.",
    responsibilities: ["Develop brand identities and marketing materials", "Present concepts and incorporate feedback", "Prepare production-ready digital and print assets"],
    skills: ["Branding", "Adobe Creative Suite", "Typography"],
  },
  {
    title: "Digital Marketing Specialist",
    type: "Contract",
    location: "Remote",
    summary: "Turn creative ideas into measurable campaigns that help our clients reach the right audience.",
    responsibilities: ["Plan and manage multi-channel campaigns", "Create content calendars and performance reports", "Use insights to improve campaign results"],
    skills: ["Content Strategy", "SEO", "Analytics"],
  },
];

const Vacancies = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectRole = (role: string) => {
    setSelectedRole(role);
    setSubmitted(false);
    document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = `Application: ${form.get("role")}`;
    const body = [
      `Name: ${form.get("name")}`,
      `Email: ${form.get("email")}`,
      `Phone: ${form.get("phone") || "Not provided"}`,
      `Portfolio or CV link: ${form.get("portfolio") || "Not provided"}`,
      "",
      "Cover letter:",
      form.get("message"),
    ].join("\n");

    window.location.href = `mailto:${applicationEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-5 border-primary/40 px-4 py-1 text-primary">Join the team</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              Build the <span className="text-primary">future</span> with us
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up">
              We are always looking for thoughtful, curious people who care about meaningful design and excellent digital experiences.
            </p>
          </div>
        </section>

        <section className="py-20 container mx-auto px-4" aria-labelledby="open-roles-heading">
          <div className="max-w-3xl mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Open opportunities</p>
            <h2 id="open-roles-heading" className="text-3xl md:text-4xl font-bold mb-4">Find your next opportunity</h2>
            <p className="text-muted-foreground">Explore our current openings and tell us how your perspective can help PassionWorld Designs grow.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {vacancies.map((vacancy) => (
              <Card key={vacancy.title} className="flex h-full flex-col border-primary/20 hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary">
                      <BriefcaseBusiness className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <Badge variant="secondary">Open</Badge>
                  </div>
                  <CardTitle className="text-2xl">{vacancy.title}</CardTitle>
                  <div className="flex flex-wrap gap-4 pt-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />{vacancy.type}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" aria-hidden="true" />{vacancy.location}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground mb-6">{vacancy.summary}</p>
                  <ul className="space-y-3 mb-6">
                    {vacancy.responsibilities.map((responsibility) => (
                      <li key={responsibility} className="flex gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {vacancy.skills.map((skill) => <Badge key={skill} variant="outline">{skill}</Badge>)}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="button" className="w-full" onClick={() => selectRole(vacancy.title)}>
                    Apply for this role
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section id="application-form" className="scroll-mt-28 py-20 bg-background" aria-labelledby="application-heading">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 max-w-6xl mx-auto items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Make an impression</p>
                <h2 id="application-heading" className="text-3xl md:text-4xl font-bold mb-4">Ready to apply?</h2>
                <p className="text-muted-foreground mb-6">Share a little about yourself and the work you would love to do with us. Your email app will open with the application details ready to send.</p>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">No perfect fit yet?</p>
                  <p>We welcome great people. Choose “General Application” and tell us where you can make an impact.</p>
                </div>
              </div>

              <Card>
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full name</Label>
                        <Input id="name" name="name" placeholder="Your full name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone number <span className="text-muted-foreground font-normal">(optional)</span></Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+264 ..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role you are applying for</Label>
                        <select id="role" name="role" value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                          <option value="" disabled>Select a role</option>
                          {vacancies.map((vacancy) => <option key={vacancy.title} value={vacancy.title}>{vacancy.title}</option>)}
                          <option value="General Application">General Application</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portfolio">Portfolio or CV link <span className="text-muted-foreground font-normal">(optional)</span></Label>
                      <Input id="portfolio" name="portfolio" type="url" placeholder="https://yourportfolio.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Cover letter</Label>
                      <Textarea id="message" name="message" placeholder="Tell us about your experience and why you would be a great fit..." rows={6} required />
                    </div>
                    <Button type="submit" size="lg" className="w-full sm:w-auto">
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Prepare application email
                    </Button>
                    {submitted && <p role="status" className="text-sm text-muted-foreground">Your email app should open shortly. If it does not, send your application to <a className="text-primary underline" href={`mailto:${applicationEmail}`}>{applicationEmail}</a>.</p>}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Vacancies;

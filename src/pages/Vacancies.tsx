import { FormEvent, useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Clock3, Loader2, MapPin, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/firebase";
import type { VacancyRecord } from "@/data/vacancies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const applicationEmail = "info.passionworlddesigns@gmail.com";

const Vacancies = () => {
  const [vacancies, setVacancies] = useState<VacancyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const vacanciesQuery = query(collection(db, "vacancies"), where("isOpen", "==", true));
    return onSnapshot(
      vacanciesQuery,
      (snapshot) => {
        const records = snapshot.docs
          .map((item) => ({ id: item.id, ...item.data() }) as VacancyRecord)
          .sort((first, second) => first.title.localeCompare(second.title));
        setVacancies(records);
        setLoading(false);
      },
      () => {
        setError("We could not load open positions right now. Please try again later.");
        setLoading(false);
      },
    );
  }, []);

  const selectRole = (role: string) => {
    setSelectedRole(role);
    setSubmitted(false);
    document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitted(false);
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) || "").trim();

    try {
      await addDoc(collection(db, "applications"), {
        name: value("name"),
        email: value("email"),
        phone: value("phone"),
        role: value("role"),
        portfolio: value("portfolio"),
        message: value("message"),
        status: "new",
        createdAt: serverTimestamp(),
      });
      event.currentTarget.reset();
      setSelectedRole("");
      setSubmitted(true);
    } catch {
      setError(`We could not submit your application. Please email ${applicationEmail} instead.`);
    } finally {
      setSubmitting(false);
    }
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

          {error && <p role="alert" className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : vacancies.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center"><h3 className="text-xl font-semibold mb-2">No open roles right now</h3><p className="text-muted-foreground">We are always interested in meeting talented people. Check back soon or send us a general application.</p></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {vacancies.map((vacancy) => (
              <Card key={vacancy.id} className="flex h-full flex-col border-primary/20 hover-lift">
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
          )}
        </section>

        <section id="application-form" className="scroll-mt-28 py-20 bg-background" aria-labelledby="application-heading">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 max-w-6xl mx-auto items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Make an impression</p>
                <h2 id="application-heading" className="text-3xl md:text-4xl font-bold mb-4">Ready to apply?</h2>
                <p className="text-muted-foreground mb-6">Share a little about yourself and the work you would love to do with us. Your application will be sent securely to our hiring team for review.</p>
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
                    <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                      {submitting ? "Submitting application..." : "Submit application"}
                    </Button>
                    {submitted && <p role="status" className="text-sm text-green-600">Thanks for applying. Our hiring team will review your application and get back to you.</p>}
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

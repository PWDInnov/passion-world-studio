import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, X, MessageCircle } from "lucide-react";

const PHONE = "+264858037211";

interface Option {
  label: string;
  next: string;
}

interface Step {
  bot: string;
  options?: Option[];
  recommend?: { title: string; services: string[]; blurb: string };
}

const flow: Record<string, Step> = {
  start: {
    bot: "Hi! I'm PassionWorld's design assistant. What are you looking to build today?",
    options: [
      { label: "A website", next: "website" },
      { label: "Custom software / system", next: "software" },
      { label: "Branding & logo", next: "branding" },
      { label: "Grow on social media", next: "marketing" },
      { label: "Printing & promo materials", next: "printing" },
    ],
  },
  website: {
    bot: "Great choice! What kind of website fits you best?",
    options: [
      { label: "Business / company site", next: "rec_web_business" },
      { label: "Online store (e-commerce)", next: "rec_web_ecom" },
      { label: "Just a landing page", next: "rec_web_landing" },
    ],
  },
  rec_web_business: {
    bot: "Perfect.",
    recommend: {
      title: "Business Website Package",
      services: ["Corporate Website", "SEO Optimization", "Hosting & Domain Setup", "Logo touch-up (optional)"],
      blurb: "A professional, responsive website that builds trust and brings in customers.",
    },
  },
  rec_web_ecom: {
    bot: "Excellent.",
    recommend: {
      title: "E-commerce Package",
      services: ["E-commerce Website", "Product Catalog Setup", "Payment Integration", "Digital Marketing kickstart"],
      blurb: "A complete online store ready to sell, plus marketing to drive your first sales.",
    },
  },
  rec_web_landing: {
    bot: "Smart and focused.",
    recommend: {
      title: "Landing Page Package",
      services: ["High-converting Landing Page", "Copywriting", "Basic SEO"],
      blurb: "A single, powerful page designed to convert visitors into leads.",
    },
  },
  software: {
    bot: "We love building systems. Which is closest to your need?",
    options: [
      { label: "School management", next: "rec_soft" },
      { label: "POS / inventory", next: "rec_soft" },
      { label: "Booking / reservations", next: "rec_soft" },
      { label: "Something custom", next: "rec_soft" },
    ],
  },
  rec_soft: {
    bot: "Got it.",
    recommend: {
      title: "Custom Software Solution",
      services: ["Requirements & Discovery", "Custom System Development", "Database Setup", "Training & Support"],
      blurb: "A tailored system built around your exact workflow, with ongoing support.",
    },
  },
  branding: {
    bot: "A strong brand changes everything.",
    recommend: {
      title: "Complete Branding Package",
      services: ["Logo Design", "Brand Identity & Guidelines", "Business Cards", "Social Media Kit"],
      blurb: "A cohesive, memorable identity that makes you look established and premium.",
    },
  },
  marketing: {
    bot: "Let's get you seen.",
    recommend: {
      title: "Digital Marketing Package",
      services: ["Social Media Management", "Paid Ad Campaigns", "Content Creation", "Monthly Reporting"],
      blurb: "Consistent, eye-catching content and ads that grow your audience and sales.",
    },
  },
  printing: {
    bot: "We'll make you stand out in the real world too.",
    recommend: {
      title: "Printing & Media Package",
      services: ["Banner Printing", "Branded T-shirts", "Stickers & Signage", "Promo Material Design"],
      blurb: "High-quality printed materials and branded merchandise to promote your business.",
    },
  },
};

interface ChatMsg {
  from: "bot" | "user";
  text: string;
}

const DesignAssistant = () => {
  const [open, setOpen] = useState(false);
  const [stepKey, setStepKey] = useState("start");
  const [messages, setMessages] = useState<ChatMsg[]>([{ from: "bot", text: flow.start.bot }]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const step = flow[stepKey];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const choose = (opt: Option) => {
    const nextStep = flow[opt.next];
    setMessages((m) => [
      ...m,
      { from: "user", text: opt.label },
      { from: "bot", text: nextStep.bot },
    ]);
    setStepKey(opt.next);
  };

  const restart = () => {
    setStepKey("start");
    setMessages([{ from: "bot", text: flow.start.bot }]);
  };

  const sendToWhatsApp = (rec: NonNullable<Step["recommend"]>) => {
    const list = rec.services.map((s) => `• ${s}`).join("\n");
    const msg = `Hi PassionWorld Designs! Your assistant recommended the "${rec.title}" for me:\n${list}\n\nI'd like to get started.`;
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open design assistant"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 transition-transform duration-300 hover:scale-110 animate-gold-pulse"
      >
        {open ? <X size={26} /> : <Bot size={26} />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[30rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-gold px-4 py-3 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Bot size={20} />
            </div>
            <div className="leading-tight">
              <p className="font-bold">Design Assistant</p>
              <p className="text-xs text-white/80">Finds your perfect package</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    m.from === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Recommendation card */}
            {step.recommend && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 gold-border-glow">
                <p className="font-bold text-primary mb-1">{step.recommend.title}</p>
                <p className="text-xs text-muted-foreground mb-3">{step.recommend.blurb}</p>
                <ul className="mb-4 space-y-1">
                  {step.recommend.services.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {s}
                    </li>
                  ))}
                </ul>
                <Button size="sm" className="w-full btn-gold-shine" onClick={() => sendToWhatsApp(step.recommend!)}>
                  <MessageCircle size={15} className="mr-1.5" /> Get this on WhatsApp
                </Button>
                <button onClick={restart} className="mt-2 w-full text-xs text-muted-foreground hover:text-primary">
                  Start over
                </button>
              </div>
            )}
          </div>

          {/* Options */}
          {step.options && (
            <div className="border-t border-border p-3">
              <div className="flex flex-wrap gap-2">
                {step.options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => choose(opt)}
                    className="rounded-full border border-primary/40 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DesignAssistant;

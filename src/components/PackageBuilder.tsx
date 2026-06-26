import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, MessageCircle, Sparkles } from "lucide-react";

const PHONE = "26481310204"; // +264 81 310 204

interface PackageOption {
  id: string;
  label: string;
  desc: string;
  from: number;
}

const options: PackageOption[] = [
  { id: "website", label: "Website Development", desc: "Responsive business or e-commerce site", from: 3500 },
  { id: "software", label: "Custom Software / System", desc: "POS, school, inventory, booking systems", from: 8000 },
  { id: "branding", label: "Branding & Logo", desc: "Logo, brand identity, guidelines", from: 1500 },
  { id: "graphics", label: "Graphic Design Pack", desc: "Flyers, banners, business cards", from: 800 },
  { id: "marketing", label: "Digital Marketing", desc: "Social media & ad campaign management", from: 2000 },
  { id: "content", label: "Creative Content", desc: "Video editing, reels, copywriting", from: 1200 },
  { id: "it", label: "IT & Technical Support", desc: "Setup, maintenance, consulting", from: 1000 },
  { id: "printing", label: "Printing & Media", desc: "Banners, stickers, t-shirt branding", from: 600 },
];

const formatN = (n: number) => "N$" + n.toLocaleString();

const PackageBuilder = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const { low, high, chosen } = useMemo(() => {
    const chosen = options.filter((o) => selected.includes(o.id));
    const low = chosen.reduce((sum, o) => sum + o.from, 0);
    const high = Math.round(low * 1.6);
    return { low, high, chosen };
  }, [selected]);

  const handleWhatsApp = () => {
    const lines = chosen.map((o) => `• ${o.label}`).join("\n");
    const msg =
      `Hi PassionWorld Designs! I'd like a quote for:\n${lines}\n\n` +
      `Estimated range: ${formatN(low)} - ${formatN(high)}`;
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section className="py-20 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10 border-0">
            <Sparkles className="mr-1" size={14} /> Instant Estimate
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-balance">
            Build Your Custom Package
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Select the services you need and get a live estimate. Send it straight to us on WhatsApp to start your project.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Options */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {options.map((o) => {
              const active = selected.includes(o.id);
              return (
                <div
                  key={o.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggle(o.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(o.id);
                    }
                  }}
                  className={`text-left cursor-pointer rounded-xl border p-4 transition-all duration-300 ${
                    active
                      ? "border-primary bg-primary/5 gold-border-glow shadow-md"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/40 bg-transparent"
                      }`}
                    >
                      {active && <Check size={14} />}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{o.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{o.desc}</p>
                      <p className="text-sm font-medium text-primary mt-2">
                        from {formatN(o.from)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 card-premium">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Your Package</h3>

                {chosen.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-8 text-center">
                    Select services to see your estimate.
                  </p>
                ) : (
                  <ul className="space-y-2 mb-6">
                    {chosen.map((o) => (
                      <li key={o.id} className="flex items-center gap-2 text-sm">
                        <Check className="text-primary flex-shrink-0" size={16} />
                        <span>{o.label}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="border-t border-border pt-4 mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Estimated range</p>
                  <p className="text-2xl font-bold gold-text-gradient">
                    {chosen.length ? `${formatN(low)} – ${formatN(high)}` : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Final quote depends on project scope. This is a guide only.
                  </p>
                </div>

                <Button
                  onClick={handleWhatsApp}
                  disabled={chosen.length === 0}
                  className="w-full btn-gold-shine"
                  size="lg"
                >
                  <MessageCircle className="mr-2" size={18} />
                  Send via WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackageBuilder;

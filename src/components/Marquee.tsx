import {
  Code2,
  Globe,
  Megaphone,
  Palette,
  Clapperboard,
  ServerCog,
  Printer,
  Smartphone,
  ShoppingCart,
  PenTool,
} from "lucide-react";

const items = [
  { icon: Code2, label: "Software Development" },
  { icon: Globe, label: "Web Development" },
  { icon: Megaphone, label: "Digital Marketing" },
  { icon: Palette, label: "Branding & Design" },
  { icon: Clapperboard, label: "Creative Content" },
  { icon: ServerCog, label: "IT Services" },
  { icon: Printer, label: "Printing & Media" },
  { icon: Smartphone, label: "Mobile Apps" },
  { icon: ShoppingCart, label: "E-commerce" },
  { icon: PenTool, label: "Logo Design" },
];

const Marquee = () => {
  const loop = [...items, ...items];

  return (
    <section className="py-12 bg-background border-y border-border overflow-hidden">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Everything Your Brand Needs, Under One Roof
        </p>
      </div>
      <div className="relative">
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {loop.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 whitespace-nowrap rounded-full border border-border bg-card px-6 py-3 shadow-sm"
              >
                <Icon className="text-primary" size={20} />
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
};

export default Marquee;

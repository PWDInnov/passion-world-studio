import { useCallback, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

interface CompareItem {
  before: string;
  after: string;
  title: string;
  alt: string;
}

const items: CompareItem[] = [
  {
    title: "Brand Logo Redesign",
    before: "/showcase/logo-before.png",
    after: "/showcase/logo-after.png",
    alt: "Logo design transformation",
  },
  {
    title: "Website Redesign",
    before: "/showcase/web-before.png",
    after: "/showcase/web-after.png",
    alt: "Website design transformation",
  },
];

const Slider = ({ item }: { item: CompareItem }) => {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging.current) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    updateFromClientX(clientX);
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-xl gold-border-glow bg-card">
      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full cursor-ew-resize select-none touch-none"
        onMouseDown={(e) => {
          dragging.current = true;
          updateFromClientX(e.clientX);
        }}
        onMouseUp={() => (dragging.current = false)}
        onMouseLeave={() => (dragging.current = false)}
        onMouseMove={onMove}
        onTouchStart={(e) => {
          dragging.current = true;
          updateFromClientX(e.touches[0].clientX);
        }}
        onTouchEnd={() => (dragging.current = false)}
        onTouchMove={onMove}
      >
        {/* After (full background) */}
        <img
          src={item.after || "/placeholder.svg"}
          alt={`${item.alt} - after`}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          draggable={false}
        />
        <span className="absolute top-3 right-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          After
        </span>

        {/* Before (clipped via clip-path so it stays full-size) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <img
            src={item.before || "/placeholder.svg"}
            alt={`${item.alt} - before`}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <span className="absolute top-3 left-3 rounded-full bg-foreground/80 px-3 py-1 text-xs font-semibold text-background">
            Before
          </span>
        </div>

        {/* Handle */}
        <div
          className="absolute top-0 bottom-0 z-20 flex items-center justify-center"
          style={{ left: `calc(${pos}% - 1px)` }}
        >
          <div className="h-full w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)]" />
          <div className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
            <MoveHorizontal className="text-primary" size={20} />
          </div>
        </div>
      </div>
      <div className="p-4 text-center">
        <h3 className="font-bold">{item.title}</h3>
      </div>
    </div>
  );
};

const BeforeAfter = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-balance">
            See the <span className="gold-text-gradient">Transformation</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Drag the slider to reveal how we turn dated designs into premium brand experiences.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {items.map((item) => (
            <Slider key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;

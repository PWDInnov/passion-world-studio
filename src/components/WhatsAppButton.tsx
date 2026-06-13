import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

const PHONE = "+264858037211".replace(/\s/g, ""); // +264 85 8037 211
const DEFAULT_MSG = "Hi PassionWorld Designs! I'd like to discuss a project.";

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(DEFAULT_MSG)}`;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40 transition-transform duration-300 hover:scale-110"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" />
        <MessageCircle className="relative z-10 text-white" size={28} />
      </a>

      {showTooltip && (
        <div className="hidden items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium shadow-lg gold-border-glow sm:flex animate-fade-in-up">
          <span>Chat with us</span>
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Dismiss"
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default WhatsAppButton;

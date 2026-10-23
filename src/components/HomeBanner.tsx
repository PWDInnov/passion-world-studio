import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Megaphone, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Clock, 
  ExternalLink, 
  ArrowRight, 
  Sparkles,
  Tag,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import useFirestore from '@/hooks/use-firestore';
import { defaultAdvertPosts } from '@/data/advertPostsData';
import { AdvertPost, getAdvertRemainingTime, filterActivePromotions } from '@/types/advert';

export interface HomeBannerProps {
  /**
   * Firestore collection to fetch promotional data from. Defaults to 'homepageAds'.
   */
  collectionName?: string;
  /**
   * Duration in milliseconds each slide stays visible before auto-advancing. Defaults to 7000ms.
   */
  autoPlayDuration?: number;
  /**
   * Custom CSS classes for outer container.
   */
  className?: string;
  /**
   * Whether to allow visitors to dismiss/minimize the banner. Defaults to true.
   */
  allowDismiss?: boolean;
  /**
   * Storage key for remembering dismissal in this browser session.
   */
  storageKey?: string;
}

/**
 * Reusable HomeBanner component
 * Positioned in the foreground on the right side of the hero video.
 * Renders as a glassy square/portrait advert card with smooth fade transitions,
 * start/end date validation, auto-play with pause-on-hover, and expandable "View More" details.
 * Supports once-off posts with NO links as well as promotional posts with optional CTAs.
 */
export const HomeBanner: React.FC<HomeBannerProps> = ({
  collectionName = 'homepageAds',
  autoPlayDuration = 7000,
  className = '',
  allowDismiss = true,
  storageKey = 'pwd_home_banner_dismissed',
}) => {
  const { docs, loading } = useFirestore(collectionName);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (!allowDismiss) return false;
    try {
      return sessionStorage.getItem(storageKey) === 'true';
    } catch {
      return false;
    }
  });
  const [isMinimizedOnMobile, setIsMinimizedOnMobile] = useState(true);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fallback to default sample adverts if database collection is empty or initial load
  const rawItems = useMemo<AdvertPost[]>(() => {
    if (docs && docs.length > 0) {
      return docs as unknown as AdvertPost[];
    }
    return defaultAdvertPosts;
  }, [docs]);

  // Apply start/end date and active status filtering
  const activePromotions = useMemo(() => {
    const filtered = filterActivePromotions(rawItems);
    return filtered.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }, [rawItems]);

  const totalSlides = activePromotions.length;

  const triggerSlideChange = useCallback((newIndex: number) => {
    setIsFading(true);
    setProgress(0);
    setIsExpanded(false); // Reset expanded state on slide change
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    
    fadeTimeoutRef.current = setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsFading(false);
    }, 280); // 280ms fade out then fade in
  }, []);

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    triggerSlideChange((currentIndex + 1) % totalSlides);
  }, [totalSlides, currentIndex, triggerSlideChange]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    triggerSlideChange((currentIndex - 1 + totalSlides) % totalSlides);
  }, [totalSlides, currentIndex, triggerSlideChange]);

  // Setup auto-play rotation and micro-progress bar (paused while user expands details or hovers)
  useEffect(() => {
    if (totalSlides <= 1 || isPaused || isDismissed || isExpanded) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    setProgress(0);
    const stepMs = 50;
    const increment = (stepMs / autoPlayDuration) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + increment;
      });
    }, stepMs);

    timerRef.current = setTimeout(() => {
      nextSlide();
    }, autoPlayDuration);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [currentIndex, isPaused, totalSlides, isDismissed, isExpanded, autoPlayDuration, nextSlide]);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (allowDismiss) {
      try {
        sessionStorage.setItem(storageKey, 'true');
      } catch {
        // ignore storage error
      }
    }
  };

  const handleReopen = () => {
    setIsDismissed(false);
    setIsMinimizedOnMobile(false);
    if (allowDismiss) {
      try {
        sessionStorage.removeItem(storageKey);
      } catch {
        // ignore storage error
      }
    }
  };

  // If loading without data, render nothing to avoid layout shift
  if (loading && docs.length === 0) {
    return null;
  }

  // If no active promotional items within date range, do not render
  if (totalSlides === 0) {
    return null;
  }

  // Floating restore badge if user dismissed the banner
  if (isDismissed) {
    return (
      <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
        <button
          onClick={handleReopen}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-zinc-950/90 hover:bg-black text-amber-400 border border-amber-500/40 shadow-2xl backdrop-blur-md text-xs font-semibold tracking-wide transition-all hover:scale-105 group"
          aria-label="Re-open promotional advert"
        >
          <Sparkles size={14} className="text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>Featured Ad ({totalSlides})</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>
    );
  }

  const currentItem = activePromotions[currentIndex] || activePromotions[0];
  const timeInfo = getAdvertRemainingTime(currentItem.endDate);

  const getBadgeStyle = (color?: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'crimson':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'indigo':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'purple':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'gold':
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  // Check if advert actually has a valid primary link (some once-off ads have NO links)
  const hasPrimaryCta = Boolean(currentItem.ctaText?.trim() && currentItem.ctaLink?.trim());
  const isExternalPrimary = hasPrimaryCta && currentItem.ctaLink?.startsWith('http');

  // Check if advert has a secondary link
  const hasSecondaryCta = Boolean(currentItem.secondaryCtaText?.trim() && currentItem.secondaryCtaLink?.trim());
  const isExternalSecondary = hasSecondaryCta && currentItem.secondaryCtaLink?.startsWith('http');

  const startDateStr = currentItem.startDate ? new Date(currentItem.startDate).toLocaleDateString() : 'Active Now';
  const endDateStr = currentItem.endDate ? new Date(currentItem.endDate).toLocaleDateString() : 'Ongoing';

  return (
    <>
      {/* Mobile Collapsed Floating Pill (< lg screens when minimized) */}
      <div className="lg:hidden fixed bottom-6 right-4 z-40">
        {isMinimizedOnMobile ? (
          <button
            onClick={() => setIsMinimizedOnMobile(false)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-black/85 text-amber-400 border border-amber-500/40 shadow-2xl backdrop-blur-md text-xs font-semibold transition-transform active:scale-95 animate-gold-pulse"
          >
            <Megaphone size={14} className="text-amber-400" />
            <span>Special Ad ({currentIndex + 1}/{totalSlides})</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        ) : null}
      </div>

      {/* Main Glassy Floating Advert Card (On right side of Hero Video) */}
      <aside
        aria-label="Featured Hero Advert"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className={`
          z-30 transition-all duration-300
          /* Explicit auto-height: strictly hugs its content, never stretches to hero bottom */
          h-auto max-h-[85vh] overflow-y-auto
          /* Desktop placement: Far Right of the hero video, strictly auto height and bottom-auto */
          lg:absolute lg:top-6 xl:top-8 lg:right-6 xl:right-10 lg:bottom-auto lg:left-auto
          lg:w-76 xl:w-82 lg:max-w-xs
          /* Mobile placement: compact floating card only when manually expanded */
          ${isMinimizedOnMobile ? 'hidden lg:block' : 'fixed bottom-6 right-4 left-4 sm:left-auto sm:w-80 z-50'}
          rounded-2xl border border-amber-500/35 bg-black/85 backdrop-blur-xl
          shadow-[0_20px_45px_rgba(0,0,0,0.85)] hover:border-amber-500/50 hover:shadow-amber-500/10
          text-white
          ${className}
        `}
      >
        {/* Top Micro Progress Bar for Auto-Play (hidden while expanded to let user read) */}
        {totalSlides > 1 && !isExpanded && (
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 z-20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-200 transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Top Header Controls (Advert label & Close/Minimize) */}
        <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5 relative z-20">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-zinc-300 border border-white/15">
              <Megaphone size={10} className="text-amber-400" />
              Advert
            </span>

            {totalSlides > 1 && (
              <span className="text-[10px] text-zinc-400 font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10">
                {currentIndex + 1} / {totalSlides}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Mobile minimize button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full"
              onClick={() => setIsMinimizedOnMobile(true)}
              aria-label="Minimize ad"
            >
              <Minimize2 size={13} />
            </Button>

            {/* Dismiss button */}
            {allowDismiss && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full"
                onClick={handleDismiss}
                aria-label="Close advert"
                title="Dismiss ad"
              >
                <X size={13} />
              </Button>
            )}
          </div>
        </div>

        {/* Fade Container for Content & Image */}
        <div
          className={`transition-opacity duration-300 ease-in-out ${
            isFading ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
          }`}
        >
          {/* Ad Image / Media Flyer */}
          {currentItem.imageUrl && (
            <div className="relative mx-3 rounded-lg overflow-hidden aspect-[16/9] max-h-34 bg-black/60 border border-white/10 group">
              <img
                src={currentItem.imageUrl}
                alt={currentItem.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              {/* Badges overlaid on top of image */}
              <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between gap-1.5">
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide border uppercase backdrop-blur-md shadow-md ${getBadgeStyle(currentItem.badgeColor)}`}>
                  <Tag size={8} />
                  {currentItem.badgeText}
                </span>

                {!timeInfo.isPermanent && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-black/85 text-amber-200 border border-amber-500/30 backdrop-blur-md shadow-md">
                    <Clock size={9} className="text-amber-400" />
                    <span>{timeInfo.label}</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Card Body: Title, Pitch, Expand Details, CTAs */}
          <div className="p-3 space-y-2">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug">
                {currentItem.title}
              </h3>
              
              {/* Pitch copy: truncated when collapsed, full when expanded */}
              <p className={`text-[11px] text-zinc-300 mt-1 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                {currentItem.subtitle}
              </p>
            </div>

            {/* EXPANDED VIEW: Shows extended full details, dates, and campaign terms */}
            {isExpanded && (
              <div className="pt-1 space-y-2 animate-fade-in border-t border-white/10 mt-2">
                {currentItem.details && (
                  <div className="p-2.5 rounded-lg bg-black/60 border border-amber-500/20 text-[11px] text-zinc-200 leading-relaxed max-h-40 overflow-y-auto space-y-1">
                    <div className="font-semibold text-amber-400 flex items-center gap-1 text-[10px] uppercase tracking-wider mb-1">
                      <Info size={11} />
                      Full Information:
                    </div>
                    <p className="whitespace-pre-line">{currentItem.details}</p>
                  </div>
                )}

                {/* Schedule details */}
                <div className="p-2 rounded-md bg-white/5 border border-white/10 text-[10px] text-zinc-300 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Calendar size={11} className="text-amber-400" />
                    <span>Period: {startDateStr} → {endDateStr}</span>
                  </div>
                  <span className="text-amber-300 font-medium">{timeInfo.label}</span>
                </div>
              </div>
            )}

            {/* View More / Show Less Toggle Button */}
            <div className="flex items-center justify-between pt-0.5">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 transition-colors group"
                aria-expanded={isExpanded}
              >
                <span>{isExpanded ? 'Show Less' : 'View More Details'}</span>
                {isExpanded ? (
                  <ChevronUp size={12} className="group-hover:-translate-y-0.5 transition-transform" />
                ) : (
                  <ChevronDown size={12} className="group-hover:translate-y-0.5 transition-transform" />
                )}
              </button>

              {/* Optional Secondary link if specified */}
              {hasSecondaryCta && (
                isExternalSecondary ? (
                  <a
                    href={currentItem.secondaryCtaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-zinc-300 hover:text-white underline underline-offset-2 transition-colors"
                  >
                    {currentItem.secondaryCtaText}
                  </a>
                ) : (
                  <Link
                    to={currentItem.secondaryCtaLink!}
                    className="text-[10px] text-zinc-300 hover:text-white underline underline-offset-2 transition-colors"
                  >
                    {currentItem.secondaryCtaText}
                  </Link>
                )
              )}
            </div>

            {/* Primary Action Button (ONLY rendered if ad has a configured CTA link) */}
            {hasPrimaryCta && (
              <div className="pt-1">
                {isExternalPrimary ? (
                  <a
                    href={currentItem.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button
                      size="sm"
                      className="w-full h-7.5 px-3 text-xs font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-500 hover:to-yellow-600 text-zinc-950 shadow-md hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5 rounded-lg btn-gold-shine"
                    >
                      <span>{currentItem.ctaText}</span>
                      <ExternalLink size={11} />
                    </Button>
                  </a>
                ) : (
                  <Link to={currentItem.ctaLink!} className="block w-full">
                    <Button
                      size="sm"
                      className="w-full h-7.5 px-3 text-xs font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-500 hover:to-yellow-600 text-zinc-950 shadow-md hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5 rounded-lg btn-gold-shine"
                    >
                      <span>{currentItem.ctaText}</span>
                      <ArrowRight size={11} />
                    </Button>
                  </Link>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Bottom Carousel Navigation Controls (Only if >1 ad) */}
        {totalSlides > 1 && (
          <div className="px-3 py-1.5 flex items-center justify-between border-t border-white/10 bg-black/40">
            {/* Prev button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full"
              onClick={prevSlide}
              aria-label="Previous ad"
            >
              <ChevronLeft size={13} />
            </Button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {activePromotions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => triggerSlideChange(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx 
                      ? 'w-3.5 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' 
                      : 'w-1.5 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Next button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full"
              onClick={nextSlide}
              aria-label="Next ad"
            >
              <ChevronRight size={13} />
            </Button>
          </div>
        )}
      </aside>
    </>
  );
};

export default HomeBanner;

export type AdvertBadgeColor = 'gold' | 'emerald' | 'crimson' | 'indigo' | 'purple';

export interface AdvertPost {
  id: string;
  title: string;
  subtitle: string;
  details?: string; // Extended full description shown when "View More" is clicked
  badgeText: string;
  badgeColor?: AdvertBadgeColor;
  imageUrl?: string;
  ctaText?: string; // Optional: Some ads are purely once-off notices with no links
  ctaLink?: string; // Optional
  secondaryCtaText?: string; // Optional
  secondaryCtaLink?: string; // Optional
  startDate: string; // ISO string
  endDate?: string;  // ISO string (optional if permanent)
  durationPreset?: '1w' | '2w' | '3w' | '4w' | 'custom' | 'permanent';
  isActive: boolean;
  priority?: number; // Higher number = shown first
  createdAt: string;
  updatedAt?: string;
}

/**
 * Checks whether an advert is currently active and within its scheduled period.
 */
export const isAdvertActive = (ad: AdvertPost): boolean => {
  if (!ad.isActive) return false;
  const now = new Date().getTime();

  if (ad.startDate) {
    const start = new Date(ad.startDate).getTime();
    if (!isNaN(start) && now < start) {
      return false; // Scheduled for future
    }
  }

  if (ad.endDate) {
    const end = new Date(ad.endDate).getTime();
    if (!isNaN(end) && now > end) {
      return false; // Expired
    }
  }

  return true;
};

/**
 * Filter promotional items based on active status, start date, and end date.
 */
export const filterActivePromotions = (items: AdvertPost[]): AdvertPost[] => {
  return items.filter(isAdvertActive);
};

/**
 * Calculates remaining time details for an advert.
 */
export const getAdvertRemainingTime = (endDate?: string): {
  days: number;
  hours: number;
  label: string;
  isExpired: boolean;
  isPermanent: boolean;
} => {
  if (!endDate) {
    return { days: 999, hours: 0, label: 'Ongoing Ad', isExpired: false, isPermanent: true };
  }

  const end = new Date(endDate).getTime();
  if (isNaN(end)) {
    return { days: 999, hours: 0, label: 'Ongoing Ad', isExpired: false, isPermanent: true };
  }

  const now = Date.now();
  const diffMs = end - now;

  if (diffMs <= 0) {
    return { days: 0, hours: 0, label: 'Expired', isExpired: true, isPermanent: false };
  }

  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;

  let label = '';
  if (days >= 14) {
    const weeks = Math.round(days / 7);
    label = `${weeks} weeks left`;
  } else if (days > 1) {
    label = `${days} days left`;
  } else if (days === 1) {
    label = `1 day, ${remainingHours}h left`;
  } else if (totalHours > 0) {
    label = `${totalHours}h left`;
  } else {
    const minutes = Math.floor(diffMs / (1000 * 60));
    label = `${Math.max(1, minutes)}m left`;
  }

  return { days, hours: remainingHours, label, isExpired: false, isPermanent: false };
};

/**
 * Helper to calculate end date from a preset duration
 */
export const calculatePresetEndDate = (
  preset: '1w' | '2w' | '3w' | '4w',
  baseDate: Date = new Date()
): string => {
  const target = new Date(baseDate);
  const daysToAdd = {
    '1w': 7,
    '2w': 14,
    '3w': 21,
    '4w': 28,
  }[preset];

  target.setDate(target.getDate() + daysToAdd);
  return target.toISOString();
};

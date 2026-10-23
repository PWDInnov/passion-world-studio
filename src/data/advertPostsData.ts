import { AdvertPost, calculatePresetEndDate } from '../types/advert';

const now = new Date();

export const defaultAdvertPosts: AdvertPost[] = [
  {
    id: 'ad-q4-bundle',
    title: 'Q4 Brand & Mobile App Launch Bundle — 25% Off',
    subtitle: 'Scale your venture with a unified presence: custom iOS/Android development bundled with our complete brand identity design system.',
    details: 'This limited promotional bundle includes full native iOS and Android application engineering, UI/UX design kits, brand style guides, logo variations, typography hierarchy, and 30 days of post-launch stabilization support. Valid for new project kickoff deposits placed before the offer window expires.',
    badgeText: 'FEATURED AD · 25% OFF',
    badgeColor: 'gold',
    imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=80',
    ctaText: 'Claim 25% Off Bundle',
    ctaLink: '/contact?ad=q4-bundle',
    // No forced secondary links to case studies/portfolio!
    startDate: now.toISOString(),
    endDate: calculatePresetEndDate('2w', now), // 2 weeks active
    durationPreset: '2w',
    isActive: true,
    priority: 10,
    createdAt: now.toISOString(),
  },
  {
    id: 'ad-studio-notice',
    title: 'Studio Expansion Notice: New Extended Client Creative Hours',
    subtitle: 'We are expanding our studio operational capacity to provide direct evening Slack/WhatsApp sprint consultations for international clients across all time zones.',
    details: 'To better serve our expanding roster of startup partners across Europe, North America, and Africa, our design and development squads have implemented dedicated extended sprint windows. Direct consultation hours are now active Monday through Friday from 08:00 to 22:00 GMT. Reach out directly via our official communication channels.',
    badgeText: 'ONCE-OFF NOTICE · 3 WEEKS',
    badgeColor: 'emerald',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    // Pure once-off announcement flyer: NO CTA buttons and NO links!
    startDate: now.toISOString(),
    endDate: calculatePresetEndDate('3w', now), // 3 weeks active
    durationPreset: '3w',
    isActive: true,
    priority: 9,
    createdAt: now.toISOString(),
  },
  {
    id: 'ad-fast-track',
    title: 'Fast-Track 21-Day Product Sprint Reservations',
    subtitle: 'Guaranteed milestone product MVP deployment in 21 days for select high-growth brands and funded startups.',
    details: 'Reserve dedicated senior full-stack and design sprints with guaranteed milestone delivery in 21 business days. Sprint capacity is capped at 3 teams per cohort to ensure white-glove engineering rigor and daily video standup synchronization.',
    badgeText: 'LIMITED SPRINT · 1 WEEK ONLY',
    badgeColor: 'indigo',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    ctaText: 'Reserve Sprint Slot',
    ctaLink: '/contact?ad=fast-track',
    startDate: now.toISOString(),
    endDate: calculatePresetEndDate('1w', now), // 1 week active
    durationPreset: '1w',
    isActive: true,
    priority: 8,
    createdAt: now.toISOString(),
  },
];

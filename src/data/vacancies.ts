export interface VacancyRecord {
  id: string;
  title: string;
  type: string;
  location: string;
  summary: string;
  responsibilities: string[];
  skills: string[];
  isOpen: boolean;
  createdAt?: { toMillis?: () => number };
}

export type VacancySeed = Omit<VacancyRecord, "id" | "createdAt">;

export const vacancySeedData: VacancySeed[] = [
  {
    title: "Frontend Developer",
    type: "Full-time",
    location: "Remote",
    summary: "Build polished, accessible web experiences for brands that want to stand out.",
    responsibilities: [
      "Create responsive interfaces with React and TypeScript",
      "Collaborate with designers and clients",
      "Write maintainable, tested frontend code",
    ],
    skills: ["React", "TypeScript", "Tailwind CSS"],
    isOpen: true,
  },
  {
    title: "Graphic Designer",
    type: "Full-time",
    location: "Remote",
    summary: "Shape memorable visual identities and creative campaigns for growing businesses.",
    responsibilities: [
      "Develop brand identities and marketing materials",
      "Present concepts and incorporate feedback",
      "Prepare production-ready digital and print assets",
    ],
    skills: ["Branding", "Adobe Creative Suite", "Typography"],
    isOpen: true,
  },
  {
    title: "Digital Marketing Specialist",
    type: "Contract",
    location: "Remote",
    summary: "Turn creative ideas into measurable campaigns that help our clients reach the right audience.",
    responsibilities: [
      "Plan and manage multi-channel campaigns",
      "Create content calendars and performance reports",
      "Use insights to improve campaign results",
    ],
    skills: ["Content Strategy", "SEO", "Analytics"],
    isOpen: true,
  },
];

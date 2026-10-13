export interface Service {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
}

export type BlogPostStatus = "draft" | "review" | "published";

export interface BlogPost {
  id: string;
  imageUrl: string;
  imageAlt?: string;
  title: string;
  slug?: string;
  date: string;
  readTime: string;
  excerpt: string;
  content?: string;
  tags: string[];
  author: string;
  status?: BlogPostStatus;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string | null;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  quote: string;
  rating: number;
}

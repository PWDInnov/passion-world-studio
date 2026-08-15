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

export interface BlogPost {
  id: string;
  imageUrl: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  tags: string[];
  author: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  quote: string;
  rating: number;
}

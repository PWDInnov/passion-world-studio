import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "10 Web Design Trends for 2025",
      excerpt: "Discover the latest design trends that will shape the digital landscape in the coming year.",
      image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop",
      author: "Sarah Johnson",
      date: "2025-01-15",
      readTime: "5 min read",
      tags: ["Design", "Trends", "Web"],
    },
    {
      id: 2,
      title: "The Importance of Brand Identity",
      excerpt: "Learn why a strong brand identity is crucial for business success and how to build one.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop",
      author: "Michael Chen",
      date: "2025-01-12",
      readTime: "7 min read",
      tags: ["Branding", "Business", "Strategy"],
    },
    {
      id: 3,
      title: "Responsive Design Best Practices",
      excerpt: "Essential tips and techniques for creating websites that look great on all devices.",
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=500&fit=crop",
      author: "Emily Rodriguez",
      date: "2025-01-10",
      readTime: "6 min read",
      tags: ["Development", "Mobile", "UX"],
    },
    {
      id: 4,
      title: "Color Psychology in Design",
      excerpt: "How to use colors strategically to evoke emotions and influence user behavior.",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=500&fit=crop",
      author: "David Kim",
      date: "2025-01-08",
      readTime: "4 min read",
      tags: ["Design", "Psychology", "Theory"],
    },
    {
      id: 5,
      title: "Building a Design System",
      excerpt: "A comprehensive guide to creating and maintaining a scalable design system.",
      image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=500&fit=crop",
      author: "Jessica Taylor",
      date: "2025-01-05",
      readTime: "8 min read",
      tags: ["Design Systems", "UI", "Workflow"],
    },
    {
      id: 6,
      title: "SEO Essentials for Modern Websites",
      excerpt: "Key SEO strategies to improve your website's visibility and search rankings.",
      image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=500&fit=crop",
      author: "Robert Anderson",
      date: "2025-01-03",
      readTime: "6 min read",
      tags: ["SEO", "Marketing", "Web"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              Design <span className="text-primary">Insights</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
              Tips, trends, and inspiration from the world of design
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {posts.map((post, index) => (
              <Link key={post.id} to={`/blog/${post.id}`}>
                <Card 
                  className="overflow-hidden hover-lift h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">By {post.author}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;

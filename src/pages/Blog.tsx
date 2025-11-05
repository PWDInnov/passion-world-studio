
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const postsCollection = collection(db, 'blog');
        const postsSnapshot = await getDocs(postsCollection);
        const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsList);
      } catch (error) {
        console.error("Error fetching blog posts: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" size={36} /></div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {posts.map((post, index) => (
              <Link key={post.id} to={`/blog/${post.id}`}>
                <Card 
                  className="overflow-hidden hover-lift h-full animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {post.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{post.date ? new Date(post.date).toLocaleDateString() : '-'}</span>
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
                    {post.tags && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                     <p className="text-sm text-muted-foreground">By {post.author}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No blog posts have been published yet. Check back soon!</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;

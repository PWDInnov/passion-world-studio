import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import SEO from "@/components/SEO";
import type { BlogPost } from "@/types";

const LearningCenter = () => {
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'blog'));
        const articlesData = querySnapshot.docs
          .map((articleDoc) => ({ id: articleDoc.id, ...articleDoc.data() } as BlogPost))
          .filter((article) => !article.status || article.status === "published")
          .sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());
        setArticles(articlesData);
      } catch (err) {
        setError('Failed to fetch articles.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Design & Digital Growth Learning Center | PassionWorld Designs"
        description="Practical advice about graphic design, branding, website design, web development, digital marketing, and creative content for growing businesses."
        canonical="/learning-center"
      />
      <Header />
      <main id="main-content" className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-2">Learning Center</h1>
          <p className="text-center text-lg text-muted-foreground mb-12">
            Welcome to our collection of articles and resources.
          </p>

          {loading && <p className="text-center">Loading articles...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map(article => (
                <Link to={`/learning-center/${article.id}`} key={article.id} className="block group">
                  <div className="border rounded-lg overflow-hidden shadow-lg h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                    {article.imageUrl && (
                      <img src={article.imageUrl} alt={article.imageAlt || article.title} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <CalendarIcon className="h-4 w-4 mr-1.5" />
                        <span>{new Date(article.date).toLocaleDateString()}</span>
                        <ClockIcon className="h-4 w-4 mr-1.5 ml-4" />
                        <span>{article.readTime}</span>
                      </div>
                      <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">{article.title}</h2>
                      <p className="text-muted-foreground text-sm mb-4 flex-grow">{article.excerpt}</p>
                      <div className="mb-4">
                        {article.tags && article.tags.map((tag: string) => (
                          <span key={tag} className="inline-block bg-gray-100 text-gray-800 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">{tag}</span>
                        ))}
                      </div>
                      <p className="text-sm font-medium text-gray-900">By {article.author}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LearningCenter;

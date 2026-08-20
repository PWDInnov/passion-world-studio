
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'; // Assuming you have heroicons

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const docRef = doc(db, 'blog', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Article not found.');
        }
      } catch (err) {
        setError('Failed to fetch article.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}
          {article && (
            <article className="prose lg:prose-xl max-w-none mx-auto">
              {article.imageUrl && <img src={article.imageUrl} alt={article.title} className="w-full h-auto rounded-lg mb-8" />}              <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">{article.title}</h1>
              <div className="flex items-center text-lg text-muted-foreground mb-4">
                <p className="font-medium text-gray-900">By {article.author}</p>
                <span className="mx-3">|</span>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-1.5" />
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                </div>
                <span className="mx-3">|</span>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-1.5" />
                  <span>{article.readTime}</span>
                </div>
              </div>
              <div className="mb-8">
                {article.tags && article.tags.map((tag: string) => (
                  <span key={tag} className="inline-block bg-gray-100 text-gray-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full dark:bg-gray-700 dark:text-gray-300">{tag}</span>
                ))}
              </div>
              <div className="text-lg" dangerouslySetInnerHTML={{ __html: article.content }} />
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;

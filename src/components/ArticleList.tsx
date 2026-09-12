
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming you have a firebase.ts file that exports your db instance
import { Link } from 'react-router-dom';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesCollection = collection(db, 'blog');
        const articlesSnapshot = await getDocs(articlesCollection);
        const articlesData = articlesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArticles(articlesData);
      } catch (error) {
        console.error("Error fetching articles: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <p>Loading articles...</p>;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {articles.map(article => (
        <Link to={`/learning-center/${article.id}`} key={article.id} className="block p-6 bg-card rounded-lg border border-border hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
          <p className="text-muted-foreground">{article.summary}</p>
        </Link>
      ))}
    </div>
  );
};

export default ArticleList;

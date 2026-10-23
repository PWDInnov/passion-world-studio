import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Clock, User, Share2, Sparkles } from "lucide-react";
import type { BlogPost } from "@/types";

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const docRef = doc(db, "blog", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() } as BlogPost);
        } else {
          setError("The requested article could not be found.");
        }

        // Fetch up to 3 related articles
        const relatedSnap = await getDocs(query(collection(db, "blog"), limit(3)));
        const others = relatedSnap.docs
          .map((d) => ({ id: d.id, ...d.data() } as BlogPost))
          .filter((a) => a.id !== id);
        setRelatedArticles(others);
      } catch (err: unknown) {
        console.error("Error fetching article:", err);
        setError("Failed to load article content.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="space-y-4 pt-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SEO title="Article Not Found | PassionWorld Designs" canonical="/learning-center" />
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            {error || "The article you are looking for does not exist or may have been moved."}
          </p>
          <Button asChild>
            <Link to="/learning-center" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Learning Center
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={`${article.title} | PassionWorld Designs`}
        description={article.excerpt || `Read ${article.title} on PassionWorld Designs.`}
        canonical={`/learning-center/${article.id}`}
        ogImage={article.imageUrl}
      />
      <Header />

      <main id="main-content" className="flex-1">
        <article className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
          {/* Back Link */}
          <Link
            to="/learning-center"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Learning Center
          </Link>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-6 py-4 border-y border-border/60 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>{article.author || "PassionWorld Team"}</span>
            </div>
            {article.date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.date).toLocaleDateString()}</span>
              </div>
            )}
            {article.readTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
            )}
          </div>

          {/* Hero Image */}
          {article.imageUrl && (
            <div className="mb-10 rounded-2xl overflow-hidden border border-border shadow-lg">
              <img
                src={article.imageUrl}
                alt={article.imageAlt || article.title}
                className="w-full h-auto max-h-[450px] object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: article.content || `<p>${article.excerpt}</p>` }}
          />

          {/* Author CTA Card */}
          <div className="mt-16 p-6 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-lg text-foreground">Have a Project in Mind?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Let's discuss how our design and engineering team can help achieve your goals.
              </p>
            </div>
            <Button asChild className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              <Link to="/start-project">Start a Project</Link>
            </Button>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-16 bg-muted/20 border-t border-border">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((item) => (
                  <Link
                    key={item.id}
                    to={`/learning-center/${item.id}`}
                    className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-base text-foreground mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {item.excerpt}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-primary">Read Article →</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ArticlePage;

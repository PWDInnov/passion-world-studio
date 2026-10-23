import { useState, useEffect } from "react";
import { collection, getDocs, limit, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
}

const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "news"), orderBy("date", "desc"), limit(3));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as NewsItem));
        setNews(list);
      } catch (err: unknown) {
        console.error("Error fetching latest news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  if (!loading && news.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/20 border-t border-border/50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Studio News &amp; Updates</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Latest From PassionWorld
            </h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/news" className="flex items-center gap-1.5">
              View All News <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden border bg-card hover:shadow-lg transition-shadow">
              {item.mediaUrl && (
                <div className="aspect-video bg-muted overflow-hidden">
                  <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{item.content}</p>
                <Link to="/news" className="text-xs font-semibold text-primary inline-flex items-center gap-1">
                  Read More <ArrowRight className="w-3 h-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

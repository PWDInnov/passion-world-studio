
import { Link } from "react-router-dom";
import useFirestore from "../hooks/use-firestore";
import { Loader2, Newspaper } from "lucide-react";

const NewsSection = () => {
  const { docs: newsDocs, loading } = useFirestore("news");

  // Sort news by date in descending order and take the latest 6
  const sortedNews = newsDocs.sort((a, b) => b.date - a.date).slice(0, 6);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">Latest News</h2>
          <Link to="/blog" className="text-primary hover:underline">
            See all
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : sortedNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedNews.map((news) => (
              <div key={news.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <Link to={`/blog/${news.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <video
                      src={news.videoUrl}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                      loop
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">{new Date(news.date?.seconds * 1000).toLocaleDateString()}</p>
                    <h3 className="text-xl font-bold mb-2">{news.title}</h3>
                    <p className="text-muted-foreground">{news.excerpt}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-muted/30 rounded-lg">
                <Newspaper size={48} className="text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No news at the moment. Please check back later.</p>
            </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;

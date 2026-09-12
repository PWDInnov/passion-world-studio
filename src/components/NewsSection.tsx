import { useState } from "react";
import { Link } from "react-router-dom";
import useFirestore from "../hooks/use-firestore";
import { Loader2, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const NewsSection = () => {
  const { docs: newsDocs, loading } = useFirestore("news");
  const [selectedNews, setSelectedNews] = useState(null);

  const sortedNews = [...newsDocs]
    .sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0))
    .slice(0, 3);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">Latest News</h2>
          <Link to="/news" className="text-primary hover:underline font-semibold">
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
              <div key={news.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                <div className="relative h-48 bg-muted overflow-hidden flex items-center justify-center">
                  {news.mediaUrl ? (
                    news.mediaType === 'image' ? (
                      <img src={news.mediaUrl} alt={news.title} className="w-full h-full object-cover" />
                    ) : (
                      <video src={news.mediaUrl} className="w-full h-full object-cover" playsInline muted loop controls={false} />
                    )
                  ) : (
                    <Newspaper className="text-gray-400" size={40}/>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <p className="text-sm text-muted-foreground mb-2">
                    {news.date?.seconds ? new Date(news.date.seconds * 1000).toLocaleDateString() : 'Recent'}
                  </p>
                  <h3 className="text-xl font-bold mb-2 flex-grow">{news.title}</h3>
                  <p className="text-muted-foreground line-clamp-3">{news.excerpt}</p>
                  <Button
                    variant="link"
                    className="mt-4 h-auto self-start p-0 font-semibold"
                    onClick={() => setSelectedNews(news)}
                  >
                    See more
                    <span className="sr-only"> about {news.title}</span>
                  </Button>
                </div>
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

      <Dialog open={Boolean(selectedNews)} onOpenChange={(open) => !open && setSelectedNews(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">
          {selectedNews && (
            <>
              {selectedNews.mediaUrl && (
                <div className="aspect-video bg-muted">
                  {selectedNews.mediaType === "image" ? (
                    <img src={selectedNews.mediaUrl} alt={selectedNews.title} className="h-full w-full object-cover" />
                  ) : (
                    <video src={selectedNews.mediaUrl} className="h-full w-full object-cover" playsInline controls />
                  )}
                </div>
              )}
              <DialogHeader className="space-y-3 p-6">
                <p className="text-sm text-muted-foreground">
                  {selectedNews.date?.seconds
                    ? new Date(selectedNews.date.seconds * 1000).toLocaleDateString()
                    : "Recent"}
                </p>
                <DialogTitle className="pr-8 text-2xl leading-tight">{selectedNews.title}</DialogTitle>
                <DialogDescription className="whitespace-pre-wrap text-base leading-7">
                  {selectedNews.content || selectedNews.excerpt}
                </DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default NewsSection;

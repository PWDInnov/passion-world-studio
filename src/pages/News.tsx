import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db as firestore } from '../firebase';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const NewsPage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            const newsCollection = collection(firestore, 'news');
            const q = query(newsCollection, orderBy("date", "desc"));
            const newsSnapshot = await getDocs(q);
            const newsList = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNews(newsList);
            setLoading(false);
        };

        fetchNews();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <SEO
                title="News and Updates | PassionWorld Designs"
                description="News, project updates, design insights, and announcements from PassionWorld Designs."
                canonical="/news"
            />
            <Header />
            <main id="main-content" className="flex-1">
        <section className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Latest News & Updates</h2>
                
                {loading ? (
                    <div className="flex justify-center p-10">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : news.length === 0 ? (
                    <div className="text-center py-16">
                        <Newspaper size={48} className="mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold">No News Yet</h3>
                        <p className="text-muted-foreground mt-2">Check back soon for the latest updates.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map(item => (
                            <Card key={item.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardContent className="p-0">
                                    {item.mediaUrl && (
                                        <div className="aspect-video bg-muted flex items-center justify-center">
                                            {item.mediaType === 'image' ? (
                                                <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <video src={item.mediaUrl} className="w-full h-full object-cover" playsInline controls />
                                            )}
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-4">{item.excerpt}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.date?.seconds ? new Date(item.date.seconds * 1000).toLocaleDateString() : ''}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
            </main>
            <Footer />
        </div>
    );
};

export default NewsPage;

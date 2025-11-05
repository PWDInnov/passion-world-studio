
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';

const Portfolio = () => {
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolioItems = async () => {
            setLoading(true);
            try {
                const portfolioCollection = collection(db, 'portfolio');
                const portfolioSnapshot = await getDocs(portfolioCollection);
                const portfolioList = portfolioSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPortfolioItems(portfolioList);
            } catch (error) {
                console.error("Error fetching portfolio items: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolioItems();
    }, []);

  const filterOptions = ["all", "web", "branding", "mobile"];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              Our <span className="text-primary">Work</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
              A selection of projects that showcase our passion for design
            </p>
          </div>
        </section>

        <section className="py-20 container mx-auto px-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 max-w-md mx-auto mb-10">
              {filterOptions.map((filter) => (
                <TabsTrigger key={filter} value={filter} className="capitalize">{filter} Design</TabsTrigger>
              ))}
            </TabsList>
            
            {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" size={36} /></div>
            ) : (
                filterOptions.map((filter) => (
                <TabsContent key={filter} value={filter}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolioItems
                      .filter((item) => filter === 'all' || item.category === filter)
                      .map((item, index) => (
                        <Card 
                            key={item.id} 
                            className="overflow-hidden hover-lift h-full animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <CardContent className="p-0">
                            <div className="aspect-[4/3] overflow-hidden">
                                <img 
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-muted-foreground mb-4">{item.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {item.tags && item.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
                ))
            )}
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;

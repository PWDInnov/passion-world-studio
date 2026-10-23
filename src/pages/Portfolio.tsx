import useFirestore from "@/hooks/use-firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BeforeAfter from "@/components/BeforeAfter";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "@/components/SEO";

const PortfolioSkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="rounded-xl border bg-card overflow-hidden shadow-sm">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="p-6 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Portfolio = () => {
  const { docs: portfolioItems, loading } = useFirestore('portfolio');

  const filterOptions = ["all", "web", "branding", "mobile"];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Our Work & Design Portfolio Showcase | PassionWorld Designs"
        description="Browse our creative portfolio featuring recent branding, graphic design, mobile app development, and bespoke website projects crafted with passion."
        canonical="/portfolio"
      />
      <Header />
      <main id="main-content" className="flex-1">
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
              <PortfolioSkeletonGrid />
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

        <BeforeAfter />
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;

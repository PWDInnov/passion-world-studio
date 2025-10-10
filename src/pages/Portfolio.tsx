import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Portfolio = () => {
  const [filter, setFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null);

  const portfolioItems = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "web",
      tags: ["React", "E-Commerce", "UI/UX"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      description: "A modern e-commerce platform with seamless checkout experience and inventory management.",
    },
    {
      id: 2,
      title: "Brand Identity Design",
      category: "branding",
      tags: ["Logo", "Branding", "Print"],
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop",
      description: "Complete brand identity system including logo, color palette, and brand guidelines.",
    },
    {
      id: 3,
      title: "Mobile App UI",
      category: "mobile",
      tags: ["Mobile", "UI/UX", "iOS"],
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
      description: "Intuitive mobile app interface designed for seamless user experience.",
    },
    {
      id: 4,
      title: "Corporate Website",
      category: "web",
      tags: ["Web Design", "Corporate", "Responsive"],
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
      description: "Professional corporate website with modern design and smooth animations.",
    },
    {
      id: 5,
      title: "Product Packaging",
      category: "branding",
      tags: ["Packaging", "Print", "Product"],
      image: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=600&fit=crop",
      description: "Eye-catching product packaging design that stands out on shelves.",
    },
    {
      id: 6,
      title: "SaaS Dashboard",
      category: "web",
      tags: ["Dashboard", "SaaS", "Analytics"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      description: "Comprehensive SaaS dashboard with data visualization and analytics.",
    },
  ];

  const categories = [
    { value: "all", label: "All Projects" },
    { value: "web", label: "Web Design" },
    { value: "branding", label: "Branding" },
    { value: "mobile", label: "Mobile Apps" },
  ];

  const filteredItems = filter === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              Our <span className="text-primary">Portfolio</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
              Showcasing our finest work and creative achievements
            </p>
          </div>
        </section>

        {/* Filter */}
        <section className="py-8 container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setFilter(category.value)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === category.value
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="pb-20 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredItems.map((item, index) => (
              <Card 
                key={item.id}
                className="overflow-hidden hover-lift cursor-pointer group"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedItem(item)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl">
          {selectedItem && (
            <div>
              <img 
                src={selectedItem.image} 
                alt={selectedItem.title}
                className="w-full rounded-lg mb-6"
              />
              <h2 className="text-3xl font-bold mb-3">{selectedItem.title}</h2>
              <p className="text-muted-foreground mb-4">{selectedItem.description}</p>
              <div className="flex flex-wrap gap-2">
                {selectedItem.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Portfolio;

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CEO, TechStart Inc",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      quote: "PassionWorld Designs transformed our brand identity completely. Their creativity and attention to detail exceeded our expectations. Highly recommended!",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Founder, CreativeSpace",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      quote: "Working with PassionWorld was a game-changer for our business. They delivered a stunning website that perfectly captures our vision and values.",
      rating: 5,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Marketing Director, BrightFuture",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      quote: "The team's professionalism and creativity are unmatched. They took our rough ideas and turned them into a beautiful, functional product.",
      rating: 5,
    },
    {
      id: 4,
      name: "David Kim",
      role: "Owner, Urban Café",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      quote: "Amazing work on our branding and website! The designs are modern, clean, and exactly what we were looking for. Couldn't be happier!",
      rating: 5,
    },
    {
      id: 5,
      name: "Jessica Taylor",
      role: "Product Manager, InnovateLabs",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      quote: "PassionWorld Designs brought our app to life with an intuitive and beautiful UI. Their expertise in UX design is truly impressive.",
      rating: 5,
    },
    {
      id: 6,
      name: "Robert Anderson",
      role: "Entrepreneur",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      quote: "From concept to launch, the team was professional, responsive, and creative. They made the entire process smooth and enjoyable.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              Client <span className="text-primary">Testimonials</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
              Hear what our satisfied clients have to say about working with us
            </p>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-20 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.id}
                className="hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our growing list of satisfied clients and let's create something amazing together.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Testimonials;

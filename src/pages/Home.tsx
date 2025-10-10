import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Lightbulb, DollarSign, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Home = () => {
  const services = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Cutting-edge design solutions that push creative boundaries and set new standards.",
    },
    {
      icon: DollarSign,
      title: "Affordability",
      description: "Premium quality designs at prices that respect your budget without compromise.",
    },
    {
      icon: Sparkles,
      title: "Uniqueness",
      description: "One-of-a-kind creations tailored specifically to your brand's identity.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-gold shadow-2xl mb-8 animate-scale-in">
                <span className="text-white font-bold text-3xl">PW</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up text-shadow-gold">
                Crafting Digital Experiences <span className="text-primary">with Passion</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-fade-in-up max-w-2xl mx-auto" style={{ animationDelay: "0.1s" }}>
                We transform your vision into stunning reality through innovative, affordable, and unique design solutions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <Link to="/portfolio">
                  <Button size="lg" className="gradient-gold border-0 shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto">
                    View Portfolio
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-20 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine innovation, affordability, and uniqueness to deliver exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <Card 
                key={service.title} 
                className="hover-lift border-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <service.icon className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services">
              <Button variant="outline" size="lg">
                Explore All Services
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Bring Your Vision to Life?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's collaborate and create something extraordinary together.
            </p>
            <Link to="/contact">
              <Button size="lg" className="gradient-gold border-0 shadow-lg">
                Start Your Project
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;

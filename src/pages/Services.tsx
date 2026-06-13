
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCatalog from "@/components/ServiceCatalog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PhotoGrid from '@/components/Photo';

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1">

        {/* Hero Section */}
        <section className="relative py-20 text-center bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="absolute inset-0 z-0">
            <PhotoGrid />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up text-white">Our Services</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto animate-fade-in-up">
              We provide a comprehensive suite of digital services designed to elevate your brand and engage your audience.
            </p>
          </div>
        </section>

        {/* Full Service Catalog */}
        <ServiceCatalog />

        {/* Our Process Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">Our Working Process</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { title: "Discover", description: "We start by understanding your business, goals, and audience." },
                { title: "Design", description: "We create wireframes, mockups, and prototypes for your approval." },
                { title: "Develop", description: "Our team brings the designs to life with clean, efficient code." },
                { title: "Deploy", description: "We launch your project and provide support to ensure its success." },
              ].map((step, index) => (
                 <div key={index} className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: `${index * 0.15}s`}}>
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">{index + 1}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-gold">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-md">Ready to start a project?</h2>
                <p className="text-white max-w-2xl mx-auto mb-8 font-medium drop-shadow-sm">Let&apos;s collaborate to create something amazing. We&apos;re here to help you achieve your digital goals.</p>
                <Link to="/contact"><Button variant="secondary" size="lg" className="shadow-lg">Get in Touch</Button></Link>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;

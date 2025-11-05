
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard"; // Import the ServiceCard component
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesCollection = collection(db, 'services');
        const servicesSnapshot = await getDocs(servicesCollection);
        const servicesList = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(servicesList);
      } catch (error) {
        console.error("Error fetching services: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1">

        {/* Hero Section */}
        <section className="py-20 text-center bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">Our Services</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up">
              We provide a comprehensive suite of digital services designed to elevate your brand and engage your audience.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[225px] w-full rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))
              ) : (
                services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))
              )}
            </div>
          </div>
        </section>

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
                <h2 className="text-3xl font-bold text-white mb-4">Ready to start a project?</h2>
                <p className="text-white/80 max-w-2xl mx-auto mb-8">Let's collaborate to create something amazing. We're here to help you achieve your digital goals.</p>
                <Link to="/contact"><Button variant="secondary" size="lg">Get in Touch</Button></Link>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;

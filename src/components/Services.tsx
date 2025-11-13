
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from 'react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '@/firebase';
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const servicesCollection = collection(db, 'services');
        const q = query(servicesCollection, limit(3));
        const servicesSnapshot = await getDocs(q);
        const servicesData = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Comprehensive design and development solutions tailored to your needs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))
          ) : (
            services.map((service) => (
              <Card 
                key={service.id} 
                className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/60 transition-colors duration-300 hover-lift shadow-lg"
              >
                <CardHeader className="items-center">
                  <CardTitle className="text-2xl font-semibold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <div className="text-center mt-12">
          <Link to="/services">
            <Button variant="outline">View All Services</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;

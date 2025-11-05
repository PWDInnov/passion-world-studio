import { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Skeleton } from './ui/skeleton';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const servicesCollection = await getDocs(collection(db, 'services'));
      setServices(servicesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchServices();
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Our <span className="text-primary">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive design and development solutions tailored to your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))
          ) : (
            services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;

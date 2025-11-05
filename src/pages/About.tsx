
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

const About = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
        const testimonialsCollection = collection(db, 'testimonials');
        const testimonialsSnapshot = await getDocs(testimonialsCollection);
        const testimonialsList = testimonialsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTestimonials(testimonialsList);
    };
    fetchTestimonials();
  }, []);


  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Creative Director",
      imageUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop",
    },
    {
      name: "Maria Garcia",
      role: "Lead Developer",
      imageUrl: "https://images.unsplash.com/photo-1544725176-7c40e5a71c3e?w=400&h=400&fit=crop",
    },
    {
      name: "David Chen",
      role: "UX/UI Specialist",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(<Star key={i} className={`${i < rating ? 'text-yellow-400' : 'text-muted-foreground/30'} fill-current`} />);
    }
    return stars;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              We are <span className="text-primary">Passion</span> World
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up">
              A small, creative team dedicated to crafting beautiful, functional, and user-centric digital experiences. We turn complex problems into elegant solutions.
            </p>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-left">
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground mb-4">
                  Our mission is to empower businesses by creating impactful digital presences. We believe that good design is good business, and we strive to create work that is not only aesthetically pleasing but also drives results.
                </p>
                <p className="text-muted-foreground">
                  We are committed to a collaborative process, working closely with our clients to understand their vision and bring it to life. Innovation, quality, and passion are the core values that guide everything we do.
                </p>
              </div>
              <div className="animate-fade-in-right">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                  alt="Team working together"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <img 
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
                    />
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-primary font-semibold">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={testimonial.id} className="flex flex-col justify-between hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {renderStars(testimonial.rating)}
                    </div>
                    <blockquote className="italic text-muted-foreground mb-6">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center">
                      <img 
                        src={testimonial.imageUrl}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <p className="font-bold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default About;

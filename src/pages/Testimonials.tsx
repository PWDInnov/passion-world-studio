import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star, Loader2 } from "lucide-react";
import useFirestore from "@/hooks/use-firestore";
import './Testimonials.css'; // Import the new CSS file

const Testimonials = () => {
  const { docs: testimonials, loading } = useFirestore('testimonials');

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
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" size={36} /></div>
          ) : (
            <div className="testimonials-grid">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="testimonial-card group">
                  <CardContent className="relative flex h-full flex-col p-7 sm:p-8">
                    <div className="testimonial-card__glow" aria-hidden="true" />
                    <div className="relative flex items-start justify-between gap-4">
                      <Avatar className="h-16 w-16 border-4 border-background shadow-lg ring-2 ring-primary/30 transition-transform duration-300 group-hover:scale-105">
                        <AvatarImage src={testimonial.imageUrl} alt={`${testimonial.name} profile`} className="bg-white object-contain" />
                        <AvatarFallback className="bg-gradient-gold font-semibold text-white">
                          {testimonial.name.split(' ').map((namePart) => namePart[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-2xl bg-primary/10 p-3 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Quote className="h-5 w-5" aria-hidden="true" />
                      </div>
                    </div>

                    <div className="relative mt-6 flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight">{testimonial.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                      <div className="flex gap-1" aria-label={`${testimonial.rating ?? 5} out of 5 stars`}>
                        {Array.from({ length: testimonial.rating ?? 5 }).map((_, index) => (
                          <Star key={index} className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                        ))}
                      </div>
                    </div>

                    <blockquote className="relative mt-6 flex-1 text-base leading-7 text-foreground/80">
                      “{testimonial.quote}”
                    </blockquote>

                    <div className="relative mt-7 flex items-center justify-between border-t border-border/70 pt-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      <span>Client feedback</span>
                      <span className="text-primary">{testimonial.rating ?? 5}.0 / 5</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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

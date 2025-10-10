import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Lightbulb, DollarSign, Sparkles, Palette, Code, Megaphone } from "lucide-react";

const Services = () => {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  const services = [
    {
      icon: Lightbulb,
      title: "Innovation",
      subtitle: "Cutting-edge design solutions",
      description: "We push creative boundaries with innovative design approaches that set new industry standards. Our team stays ahead of trends to deliver forward-thinking solutions.",
      details: "Our innovation process includes thorough market research, competitor analysis, and creative brainstorming sessions. We leverage the latest design tools and methodologies to ensure your project stands out in the digital landscape.",
    },
    {
      icon: DollarSign,
      title: "Affordability",
      subtitle: "Premium quality, competitive pricing",
      description: "Get exceptional design quality without breaking the bank. We believe great design should be accessible to businesses of all sizes.",
      details: "We offer flexible pricing packages tailored to your budget and needs. Our transparent pricing model ensures no hidden costs, and we work with you to find solutions that maximize value while staying within your budget constraints.",
    },
    {
      icon: Sparkles,
      title: "Uniqueness",
      subtitle: "One-of-a-kind creations",
      description: "Every project is custom-crafted to reflect your brand's unique identity and vision. No templates, no cookie-cutter solutions.",
      details: "We take time to understand your brand values, target audience, and business goals. Each design element is carefully crafted to tell your story and create a memorable experience that sets you apart from competitors.",
    },
    {
      icon: Palette,
      title: "Branding & Identity",
      subtitle: "Build a memorable brand",
      description: "From logo design to complete brand identity systems, we create cohesive visual identities that resonate with your audience.",
      details: "Our branding services include logo design, color palette development, typography selection, brand guidelines, and collateral design. We ensure consistency across all touchpoints to build strong brand recognition.",
    },
    {
      icon: Code,
      title: "Web Development",
      subtitle: "Responsive, modern websites",
      description: "Beautiful, fast, and functional websites built with the latest technologies. Optimized for all devices and search engines.",
      details: "We specialize in creating responsive websites using React, Next.js, and modern frameworks. Our development process includes performance optimization, SEO best practices, accessibility compliance, and thorough testing.",
    },
    {
      icon: Megaphone,
      title: "Digital Marketing",
      subtitle: "Amplify your reach",
      description: "Strategic digital marketing campaigns that drive results. From social media to content marketing, we help you connect with your audience.",
      details: "Our marketing services include social media management, content strategy, email campaigns, SEO optimization, and analytics tracking. We create data-driven campaigns that increase engagement and conversions.",
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
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
              Comprehensive design and development solutions tailored to your needs
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card 
                key={service.title}
                className="hover-lift cursor-pointer border-2"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedService(service)}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="text-primary" size={28} />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{service.subtitle}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                  <button className="text-primary font-medium mt-4 hover:underline">
                    Learn more →
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* Service Detail Modal */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              {selectedService && (
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <selectedService.icon className="text-primary" size={28} />
                </div>
              )}
              <div>
                <DialogTitle className="text-2xl">{selectedService?.title}</DialogTitle>
                <p className="text-muted-foreground">{selectedService?.subtitle}</p>
              </div>
            </div>
          </DialogHeader>
          <DialogDescription className="text-base leading-relaxed">
            {selectedService?.details}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;

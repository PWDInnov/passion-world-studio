
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import StatsCounter from "@/components/StatsCounter";
import Marquee from "@/components/Marquee";
import useFirestore from '@/hooks/use-firestore';
import { useInView } from 'react-intersection-observer';
import { useState } from "react";

const AnimatedSection = ({ children, effect }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  let initialClass = 'scroll-animate';
  if (effect === 'fade-up') initialClass += ' fade-up-initial';
  if (effect === 'fade-down') initialClass += ' fade-down-initial';
  if (effect === 'zoom') initialClass += ' reveal-zoom-initial';
  if (effect === 'left') initialClass += ' reveal-left-initial';
  if (effect === 'right') initialClass += ' reveal-right-initial';

  const visibleClass = inView
    ? effect === 'fade-up'
      ? 'scroll-animate-fade-up'
      : effect === 'fade-down'
      ? 'scroll-animate-fade-down'
      : effect === 'zoom' || effect === 'left' || effect === 'right'
      ? 'scroll-animate-reveal'
      : 'scroll-animate-fade-in'
    : '';

  return (
    <div ref={ref} className={`${initialClass} ${visibleClass}`}>
      {children}
    </div>
  );
};

const Home = () => {
  const { docs: homePageDocs, loading } = useFirestore('siteContent');
  const homePageData = homePageDocs.find(doc => doc.id === 'homePage');
  const [videoError, setVideoError] = useState(false);

  const defaultData = {
      heroTitle: "Innovative, Affordable, Unique Design Solutions",
      heroSubtitle: "We transform your vision into stunning reality. From web design to branding, we do it all with passion.",
      heroCtaText: "Our Services",
      heroVideoUrl: "/hero-video.mp4",
  };

  const data = homePageData || defaultData;
  const heroVideoUrl = videoError ? defaultData.heroVideoUrl : data.heroVideoUrl || defaultData.heroVideoUrl;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            key={heroVideoUrl}
            onError={() => setVideoError(true)}
          >
            <source src={heroVideoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <div className="container mx-auto px-4 relative z-20">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : (
              <AnimatedSection effect="fade-up">
                <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary shadow-2xl mb-8 animate-float-slow animate-gold-pulse">
                    <span className="font-bold text-4xl text-primary-foreground">
                        <span style={{ animation: 'anim_P 3s infinite', opacity: 0 }}>P</span>
                        <span style={{ animation: 'anim_W 3s infinite', opacity: 0 }}>W</span>
                        <span style={{ animation: 'anim_D 3s infinite', opacity: 0 }}>D</span>
                    </span>
                </div>
                  
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 shimmer-heading text-balance">
                    {data.heroTitle}
                  </h1>
                  
                  <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto text-pretty">
                    {data.heroSubtitle}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/portfolio">
                      <Button size="lg" className="border-0 shadow-lg transition-shadow w-full sm:w-auto btn-gold-shine">
                        {data.heroCtaText}
                        <ArrowRight className="ml-2" size={18} />
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white hover:bg-white hover:text-primary backdrop-blur-sm">
                        Get in Touch
                      </Button>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
        </section>

        <Marquee />

        <AnimatedSection effect="fade-in">
          <Services />
        </AnimatedSection>

        <AnimatedSection effect="zoom">
          <StatsCounter />
        </AnimatedSection>

        <AnimatedSection effect="fade-down">
          <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Bring Your Vision to Life?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's collaborate and create something extraordinary together.
              </p>
              <Link to="/contact">
                <Button size="lg" className="border-0 shadow-lg btn-gold-shine">
                  Start Your Project
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
            </div>
          </section>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
};

export default Home;


import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Home = () => {
  const [homePageData, setHomePageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch homepage content
        const homePageDocRef = doc(db, 'siteContent', 'homePage');
        const homePageDocSnap = await getDoc(homePageDocRef);
        if (homePageDocSnap.exists()) {
          setHomePageData(homePageDocSnap.data());
        } else {
          setHomePageData({
              heroTitle: "Crafting Digital Experiences with Passion",
              heroSubtitle: "We transform your vision into stunning reality through innovative, affordable, and unique design solutions.",
              heroCtaText: "View Portfolio",
          });
        }

      } catch (error) {
        console.error("Error fetching data: ", error);
        // Set default data on error as well
        setHomePageData({
            heroTitle: "Crafting Digital Experiences with Passion",
            heroSubtitle: "We transform your vision into stunning reality through innovative, affordable, and unique design solutions.",
            heroCtaText: "View Portfolio",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background py-20 md:py-32">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : homePageData && (
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-gold shadow-2xl mb-8 animate-scale-in">
                  <span className="text-white font-bold text-3xl">PW</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up text-shadow-gold">
                  {homePageData.heroTitle}
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-fade-in-up max-w-2xl mx-auto" style={{ animationDelay: "0.1s" }}>
                  {homePageData.heroSubtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  <Link to="/portfolio">
                    <Button size="lg" className="gradient-gold border-0 shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto">
                      {homePageData.heroCtaText}
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
            )}
          </div>
        </section>

        <Services />

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

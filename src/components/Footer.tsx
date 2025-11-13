
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      const docRef = doc(db, 'siteContent', 'footer');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFooterData(docSnap.data());
      } else {
        // Fallback to default data if nothing is in the database
        setFooterData({
          email: "info@passionworld.com",
          phone: "+1 (555) 123-4567",
          address: "123 Design Street, Creative City, CC 12345",
        });
      }
      setLoading(false);
    };

    fetchFooterData();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-muted/50 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <span className="font-bold text-lg text-primary-foreground">
                        <span style={{ animation: 'anim_P 3s infinite', opacity: 0 }}>P</span>
                        <span style={{ animation: 'anim_W 3s infinite', opacity: 0 }}>W</span>
                        <span style={{ animation: 'anim_D 3s infinite', opacity: 0 }}>D</span>
                    </span>
                </div>
              <h3 className="text-lg font-bold">PassionWorld Designs</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Crafting innovative, affordable, and unique design solutions that bring your vision to life.
            </p>
            <div className="flex gap-3">
              <Link to="#" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></Link>
              <Link to="#" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></Link>
              <Link to="#" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></Link>
              <Link to="#" className="text-muted-foreground hover:text-primary"><Linkedin size={20} /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-muted-foreground hover:text-primary text-sm">Services</Link></li>
              <li><Link to="/portfolio" className="text-muted-foreground hover:text-primary text-sm">Portfolio</Link></li>
              <li><Link to="/testimonials" className="text-muted-foreground hover:text-primary text-sm">Testimonials</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary text-sm">Blog</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-primary" />
              </div>
            ) : footerData && (
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Mail size={16} className="mt-0.5 flex-shrink-0" />
                  <a href={`mailto:${footerData.email}`} className="hover:text-primary transition-colors">
                    {footerData.email}
                  </a>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Phone size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{footerData.phone}</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{footerData.address}</span>
                </li>
              </ul>
            )}
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold mb-4">Newsletter</h3>
            <p className="text-muted-foreground text-sm mb-4">Subscribe to get updates on our latest projects and design tips.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="flex-grow" 
                value={newsletterEmail} 
                onChange={(e) => setNewsletterEmail(e.target.value)} 
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PassionWorld Designs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

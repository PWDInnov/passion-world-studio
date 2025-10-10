import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    }
  };

  return (
    <footer className="bg-muted/50 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                <span className="text-white font-bold">PW</span>
              </div>
              <h3 className="text-lg font-bold">PassionWorld Designs</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Crafting innovative, affordable, and unique design solutions that bring your vision to life.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                <Facebook size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                <Twitter size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                <Instagram size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors text-sm">Services</Link></li>
              <li><Link to="/portfolio" className="text-muted-foreground hover:text-primary transition-colors text-sm">Portfolio</Link></li>
              <li><Link to="/testimonials" className="text-muted-foreground hover:text-primary transition-colors text-sm">Testimonials</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm">Blog</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <a href="mailto:info@passionworld.com" className="hover:text-primary transition-colors">
                  info@passionworld.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>123 Design Street, Creative City, CC 12345</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get updates on our latest projects and design tips.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" size="sm">Subscribe</Button>
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

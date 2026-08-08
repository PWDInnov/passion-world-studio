import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/testimonials", label: "Testimonials" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src="https://www.dropbox.com/scl/fi/qm9h1nfzpni5qzs2wydqu/ChatGPT_Image_May_21__2026__10_08_26_AM-removebg-preview.png?rlkey=k9e8ak4q6xwbrltxi3dr0x5l5&st=pbitobzy&raw=1" 
                alt="PassionWorld Designs"
                className="w-20 h-20 logo-3d-spin"
              />
            </Link>
            <img 
              src="https://www.dropbox.com/scl/fi/0mbfgf0ys4y2ptd4mtzcc/Copilot_20260204_172642-removebg-preview.png?rlkey=u031udnxp41g5re4dsyiu1cyd&st=ky1ger2s&raw=1"
              alt="360 Designs"
              className="w-16 h-16 ml-20"
            />
            <img 
              src="https://www.dropbox.com/scl/fi/lyzm23qnyjklnqmnpni6s/Creative_Suite_3D_Product_Box-removebg-preview.png?rlkey=u329kwycs3snyr7ken6f56rac&st=n7zdgwic&raw=1"
              alt="Creative Suite Logo"
              className="w-16 h-16 ml-8"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors hover:text-primary relative ${
                  isActive(link.path) ? "text-primary" : "text-foreground"
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 animate-fade-in-up">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

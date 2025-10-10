import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

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
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-xl">PW</span>
            </div>
            <span className="text-xl font-bold hidden sm:block">
              PassionWorld <span className="text-primary">Designs</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
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
            <Link to="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
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
            <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full mt-2">Admin</Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

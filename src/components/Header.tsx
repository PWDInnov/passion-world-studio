import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/testimonials", label: "Testimonials" },
    { path: "/vacancies", label: "Vacancies" },
    { path: "/learning-center", label: "Learning Center" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        Skip to main content
      </a>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo Group */}
          <div className="flex items-center gap-3 md:gap-6">
            <Link to="/" className="flex items-center gap-2 group" aria-label="PassionWorld Designs home">
              <img
                src="https://www.dropbox.com/scl/fi/qm9h1nfzpni5qzs2wydqu/ChatGPT_Image_May_21__2026__10_08_26_AM-removebg-preview.png?rlkey=k9e8ak4q6xwbrltxi3dr0x5l5&st=pbitobzy&raw=1"
                alt="PassionWorld Designs logo"
                className="w-14 h-14 md:w-16 md:h-16 object-contain logo-3d-spin"
              />
            </Link>
            <img
              src="https://www.dropbox.com/scl/fi/0mbfgf0ys4y2ptd4mtzcc/Copilot_20260204_172642-removebg-preview.png?rlkey=u031udnxp41g5re4dsyiu1cyd&st=ky1ger2s&raw=1"
              alt="360 Designs logo"
              className="hidden xl:block w-12 h-12 object-contain opacity-80"
            />
            <img
              src="https://www.dropbox.com/scl/fi/lyzm23qnyjklnqmnpni6s/Creative_Suite_3D_Product_Box-removebg-preview.png?rlkey=u329kwycs3snyr7ken6f56rac&st=n7zdgwic&raw=1"
              alt="Creative Suite product logo"
              className="hidden 2xl:block w-12 h-12 object-contain opacity-80"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary relative py-1 ${
                  isActive(link.path) ? "text-primary" : "text-foreground"
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Action Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 shadow-sm"
            >
              <Link to="/start-project" className="flex items-center gap-1.5">
                Start Project <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-muted focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-6 pt-2 border-t border-border/50 animate-fade-in-up space-y-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2.5 px-4 rounded-lg font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-muted"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 px-4">
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                <Link to="/start-project" onClick={() => setIsMenuOpen(false)}>
                  Start a Project
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

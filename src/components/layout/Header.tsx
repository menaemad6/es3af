
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        isScrolled || isMenuOpen
          ? "py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-sm"
          : "py-4 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-xl md:text-2xl"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
            E
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500 dark:from-primary-400 dark:to-primary-600">
            Es3af
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-all duration-300 relative hover:text-primary",
                location.pathname === link.path
                  ? "text-primary"
                  : "text-foreground/80",
                "after:absolute after:w-full after:transform after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left",
                location.pathname === link.path ? "after:scale-x-100" : ""
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Link to="/login">
            <Button 
              variant="outline" 
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:border-primary/50"
            >
              Login
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button 
              className="rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-r from-primary to-primary-600 hover:opacity-90"
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="rounded-full relative z-50"
          >
            {isMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu with animations */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-40 pt-20 px-4 md:hidden">
          <nav className="flex flex-col items-center gap-6 py-6 animate-fade-up">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary relative",
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-foreground/80",
                  "after:absolute after:w-full after:transform after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left",
                  location.pathname === link.path ? "after:scale-x-100" : ""
                )}
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${0.05 * (index + 1)}s` }}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col w-full gap-4 mt-4">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant="outline" 
                  className="w-full rounded-full animate-fade-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  Login
                </Button>
              </Link>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  className="w-full rounded-full animate-fade-up bg-gradient-to-r from-primary to-primary-600"
                  style={{ animationDelay: "0.25s" }}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

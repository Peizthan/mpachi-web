import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Inicio" },
    { path: "/sobre-mi", label: "Sobre Mí" },
    { path: "/servicios", label: "Servicios" },
    { path: "/galeria", label: "Galería" },
    { path: "/contacto", label: "Contacto" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border shadow-soft">
      <div className="container mx-auto px-4 bg-white/95 backdrop-blur-sm">
      {/* Rainbow bar with brand colors below header */}
      <div className="flex w-full h-6">
        <div className="flex-1 bg-[hsl(45,98%,68%)]" /> {/* Amarillo */}
        <div className="flex-1 bg-[hsl(16,82%,58%)]" /> {/* Naranja */}
        <div className="flex-1 bg-[hsl(25,86%,63%)]" /> {/* Coral */}
        <div className="flex-1 bg-[hsl(143,21%,52%)]" /> {/* Verde suave */}
        <div className="flex-1 bg-[hsl(179,100%,34%)]" /> {/* Teal */}
        <div className="flex-1 bg-[hsl(189,52%,73%)]" /> {/* Azul verdoso */}
        <div className="flex-1 bg-[hsl(203,56%,25%)]" /> {/* Azul oscuro */}
      </div>
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/brand-logo.png" alt="Brand Logo" width={40} height={40} className="drop-shadow-lg" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-heading text-lg font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? "text-primary" : "text-foreground/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Button size="sm" className="font-heading">
              Registrarse
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-heading text-xl font-medium py-2 transition-colors hover:text-primary ${
                    isActive(item.path) ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Button className="font-heading mt-2">Registrarse</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Secciones de navegación con enlace a anchors para scroll suave
  const navItems = [
    { anchor: "#inicio", label: "Inicio" },
    { anchor: "#productos", label: "Productos" },
    { anchor: "#sobre-mi", label: "Sobre Mí" },
    { anchor: "#consultas", label: "Consultas" },
    { anchor: "#blog", label: "Blog" },
  ];

  // Manejo de click en anchor para scroll suave
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    const element = document.querySelector(anchor);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border shadow-soft bg-background/80 backdrop-blur-lg transition-colors">
      <div className="container mx-auto px-4">
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
          <a href="#inicio" onClick={(e) => handleAnchorClick(e, "#inicio")} className="flex items-center gap-2 cursor-pointer">
            <img src="/assets/brand-logo.png" alt="Brand Logo" width={40} height={40} className="drop-shadow-lg" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.anchor}
                href={item.anchor}
                onClick={(e) => handleAnchorClick(e, item.anchor)}
                className="font-heading text-base font-medium transition-colors hover:text-primary text-foreground/80 hover:text-primary"
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
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
                <a
                  key={item.anchor}
                  href={item.anchor}
                  onClick={(e) => handleAnchorClick(e, item.anchor)}
                  className="font-heading text-base font-medium py-2 transition-colors hover:text-primary text-foreground/80"
                >
                  {item.label}
                </a>
              ))}
              <div className="flex items-center justify-between gap-3">
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

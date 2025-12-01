import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-6">
      <div className="container mx-auto px-4">
        <div className="space-y-6 mb-6">
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-accent text-center md:text-left">Contacto</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 font-decorative">
              <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-3">
                <div className="w-12 h-12 flex items-center justify-center text-muted flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div className="flex-1">
                  <a href="mailto:mariapazj@gmail.com" className="hover:text-accent transition-colors break-words leading-relaxed">
                    mariapazjpsicologia@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-3">
                <div className="w-12 h-12 flex items-center justify-center text-muted flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div className="flex-1">
                  <a
                    href="https://wa.me/595983448991"
                    className="hover:text-accent transition-colors break-words leading-relaxed"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +595 983 448991
                  </a>
                </div>
              </div>
              <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-3">
                <div className="w-12 h-12 flex items-center justify-center text-muted flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="flex-1">
                  <span>Asunción, Paraguay</span>
                </div>
              </div>
              <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-3">
                <div className="w-12 h-12 flex items-center justify-center text-muted flex-shrink-0">
                  <Instagram size={20} />
                </div>
                <div className="flex-1">
                  <a
                    href="https://www.instagram.com/psi.mariapazjimenez/"
                    className="hover:text-accent transition-colors break-words leading-relaxed"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @psi.mariapazjimenez
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-background/20">
            <h3 className="font-heading text-xl font-bold text-accent text-center">Navegación</h3>
            <nav className="flex flex-wrap justify-center items-center gap-y-3 font-decorative divide-x divide-background/20">
              <Link to="/" className="hover:text-accent transition-colors px-2 text-sm md:text-base">
                Inicio
              </Link>
              <Link to="/sobre-mi" className="hover:text-accent transition-colors px-2 text-sm md:text-base">
                Sobre Mí
              </Link>
              <Link to="/servicios" className="hover:text-accent transition-colors px-2 text-sm md:text-base">
                Servicios
              </Link>
              <Link to="/galeria" className="hover:text-accent transition-colors px-2 text-sm md:text-base">
                Galería
              </Link>
              <Link to="/contacto" className="hover:text-accent transition-colors px-2 text-sm md:text-base">
                Contacto
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-background/20 pt-4 font-decorative text-center">
          <div className="flex flex-col items-center gap-1">
            <p className="text-base">© {new Date().getFullYear()} María Paz Jiménez. Todos los derechos reservados.</p>
            <p className="text-sm text-background/60">Psicología Clínica • Educación Emocional • BEING</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

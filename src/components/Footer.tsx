import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Contact Info */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4 text-accent">Contacto</h3>
            <div className="space-y-3 font-sans">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-muted" />
                <a href="mailto:mariapazj@gmail.com" className="hover:text-accent transition-colors">
                  mariapazjpsicologia@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-muted" />
                <a href="https://wa.me/595983448991" className="hover:text-accent transition-colors" target="_blank" rel="noopener noreferrer">
                  +595 983 448991
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-muted" />
                <span>Asunción, Paraguay</span>
              </div>
              <div className="flex items-center gap-2">
                <Instagram size={18} className="text-muted" />
                <a href="https://www.instagram.com/psi.mariapazjimenez/" className="hover:text-accent transition-colors" target="_blank" rel="noopener noreferrer">
                  @psi.mariapazjimenez
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4 text-accent">Navegación</h3>
            <nav className="space-y-2 font-sans">
              <Link to="/" className="block hover:text-accent transition-colors">
                Inicio
              </Link>
              <Link to="/sobre-mi" className="block hover:text-accent transition-colors">
                Sobre Mí
              </Link>
              <Link to="/servicios" className="block hover:text-accent transition-colors">
                Servicios
              </Link>
              <Link to="/galeria" className="block hover:text-accent transition-colors">
                Galería
              </Link>
              <Link to="/contacto" className="block hover:text-accent transition-colors">
                Contacto
              </Link>
            </nav>
          </div>

          {/* About */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4 text-accent">María Paz Jiménez</h3>
            <p className="font-sans text-sm leading-relaxed mb-4">
              Psicóloga clínica dedicada a acompañar procesos de crecimiento personal y bienestar emocional
              a través de la Terapia de Aceptación y Compromiso.
            </p>
          </div>
        </div>

  <div className="border-t border-background/20 pt-6 text-center font-sans text-sm">
          <p>© {new Date().getFullYear()} María Paz Jiménez. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs text-background/60">
            Psicología Clínica • Educación Emocional • BEING
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Instagram, Linkedin, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-6">
      <div className="container mx-auto px-4">
        <div className="space-y-6 mb-6">
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-accent text-center">Sígueme en redes</h3>
            <div className="grid grid-cols-3 gap-6 font-decorative max-w-md mx-auto">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center text-accent flex-shrink-0">
                  <Instagram size={24} />
                </div>
                <div>
                  <a
                    href="https://www.instagram.com/psi.mariapazjimenez/"
                    className="hover:text-accent transition-colors break-words leading-relaxed"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center text-accent flex-shrink-0">
                  <Linkedin size={24} />
                </div>
                <div>
                  <a
                    href="https://www.linkedin.com/in/mar%C3%ADa-paz-jim%C3%A9nez-frontanilla-78747996/"
                    className="hover:text-accent transition-colors break-words leading-relaxed"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center text-accent flex-shrink-0">
                  <Facebook size={24} />
                </div>
                <div>
                  <a
                    href="https://www.facebook.com/psi.mariapazjimenez/"
                    className="hover:text-accent transition-colors break-words leading-relaxed"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-background/20">
            <h3 className="font-heading text-xl font-bold text-accent text-center">¡Conocé más sobre mí!</h3>
            <nav className="flex flex-wrap justify-center items-center gap-y-3 font-decorative divide-x divide-background/20">
              <a href="#inicio" className="hover:text-accent transition-colors px-2 text-sm md:text-base">
                Inicio
              </a>
              <a href="#productos" className="hover:text-accent transition-colors px-2 text-sm md:text-base">
                Productos
              </a>
              <a href="#sobre-mi" className="hover:text-accent transition-colors px-2 text-sm md:text-base">
                Sobre Mí
              </a>
              <a href="#consultas" className="hover:text-accent transition-colors px-2 text-sm md:text-base">
                Consultas
              </a>
              <a href="#blog" className="hover:text-accent transition-colors px-2 text-sm md:text-base">
                Blog
              </a>
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

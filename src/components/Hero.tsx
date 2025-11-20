import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


const Hero = () => {
  return (
  <section className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden pt-32 transition-colors">
      {/* Brand logo decoration - only show top right logo on desktop */}
  <div className="hidden lg:block absolute top-40 right-10 animate-float opacity-80">
        <img src="/assets/brand-logo.png" alt="Brand Logo" width={80} height={80} className="drop-shadow-lg" />
      </div>
      {/* Centered logo below hero text on mobile and desktop */}
      <div className="flex justify-center w-full absolute left-0 right-0" style={{ bottom: 15 }}>
        <img src="/assets/brand-logo.png" alt="Brand Logo" width={60} height={60} className="drop-shadow-lg" />
      </div>

      <div className="container mx-auto px-4 py-20">
  <div className="max-w-4xl mx-auto text-center animate-fade-in relative z-10">
          <h1 className="font-heading text-5xl font-bold mb-6 text-foreground uppercase tracking-wider">
            María Paz Jiménez
          </h1>
          <p className="font-decorative text-3xl md:text-4xl mb-8 text-secondary-orange">
            Psicología Clínica
          </p>
          <p className="font-decorative text-lg md:text-xl mb-12 text-foreground/90 leading-relaxed max-w-3xl mx-auto">
            Acompañamiento profesional en tu proceso de crecimiento personal. Especializada en{" "}
            <span className="font-semibold text-primary">Terapia de Aceptación y Compromiso (ACT)</span>{" "}
            y educación emocional, te invito a construir juntos un espacio de bienestar y transformación.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild size="lg" className="font-heading text-base min-w-[200px] shadow-medium hover:shadow-hover transition-all">
              <Link to="/servicios">Conocer Servicios</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-heading text-base min-w-[200px] shadow-medium hover:shadow-hover transition-all">
              <Link to="/contacto">Agendar Consulta</Link>
            </Button>
          </div>

          <div className="mt-16 pt-8 border-t border-foreground/20">
            <p className="font-decorative text-lg mb-4 text-foreground/80">
              Descubrí herramientas para aprender sobre bienestar emocional y crecimiento personal a través de 
            </p>
            <a
              href="https://www.instagram.com/being.educacionemocional/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-white border border-teal px-6 py-3 shadow-soft hover:shadow-hover transition-all mb-2"
              aria-label="Ir a Instagram BEING Educación Emocional"
            >
              <img src="/assets/being-logo.png" alt="BEING Educación Emocional" className="h-10 w-auto" />
            </a>
            <p className="font-decorative text-base mt-3 text-foreground/70 max-w-2xl mx-auto">
              con libros de juegos y recursos educativos para todas las edades.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

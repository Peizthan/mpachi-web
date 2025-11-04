import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-hero relative overflow-hidden">
      {/* Floating leaf decoration */}
      <div className="absolute top-20 right-10 animate-float opacity-20">
        <Leaf size={80} className="text-soft-green" />
      </div>
      <div className="absolute bottom-20 left-10 animate-float opacity-20" style={{ animationDelay: "1s" }}>
        <Leaf size={60} className="text-soft-green" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 text-foreground uppercase tracking-wider">
            María Paz Jiménez
          </h1>
          <p className="font-decorative text-3xl md:text-4xl mb-8 text-secondary-orange">
            Psicología Clínica
          </p>
          <p className="font-body text-xl md:text-2xl mb-12 text-foreground/90 leading-relaxed max-w-3xl mx-auto">
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
            <p className="font-body text-lg mb-4 text-foreground/80">
              Parte de la iniciativa
            </p>
            <h2 className="font-heading text-3xl font-bold text-teal tracking-wide">
              BEING Educación Emocional
            </h2>
            <p className="font-body text-base mt-3 text-foreground/70 max-w-2xl mx-auto">
              Un proyecto dedicado a promover el bienestar emocional a través de talleres, charlas y recursos educativos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

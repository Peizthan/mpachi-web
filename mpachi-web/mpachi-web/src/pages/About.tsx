import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Award, Heart, BookOpen, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Empatía",
      description: "Cada persona es única y merece ser escuchada con respeto y comprensión.",
      color: "text-secondary-orange"
    },
    {
      icon: BookOpen,
      title: "Crecimiento",
      description: "El cambio es posible cuando te comprometes con tu bienestar emocional.",
      color: "text-soft-green"
    },
    {
      icon: Users,
      title: "Conexión",
      description: "Las relaciones saludables son fundamentales para nuestro desarrollo.",
      color: "text-teal"
    },
    {
      icon: Award,
      title: "Profesionalismo",
      description: "Compromiso ético y formación continua en las mejores prácticas terapéuticas.",
      color: "text-primary"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-calm py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 text-background uppercase tracking-wider">
                Sobre Mí
              </h1>
              <p className="font-body text-xl text-background/90 leading-relaxed">
                Conoce mi trayectoria y enfoque terapéutico
              </p>
            </div>
          </div>
        </section>

        {/* Bio Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="mb-16">
                <h2 className="font-heading text-4xl font-bold mb-8 text-foreground">
                  Mi Historia
                </h2>
                <div className="font-body text-lg leading-relaxed space-y-6 text-foreground/90">
                  <p>
                    Soy <span className="font-semibold text-primary">María Paz Jiménez</span>, psicóloga clínica 
                    especializada en Terapia de Aceptación y Compromiso (ACT) y educación emocional. Mi camino 
                    profesional ha estado guiado por la convicción de que todas las personas tienen la capacidad 
                    de transformar su vida cuando encuentran el apoyo y las herramientas adecuadas.
                  </p>
                  <p>
                    Desde el inicio de mi carrera, me he dedicado a crear espacios seguros donde las personas 
                    puedan explorar sus emociones, comprender sus patrones de pensamiento y desarrollar 
                    estrategias efectivas para alcanzar una vida más plena y significativa.
                  </p>
                  <p>
                    Mi enfoque terapéutico se basa en la <span className="font-semibold text-secondary">aceptación 
                    psicológica</span> y el <span className="font-semibold text-secondary">compromiso con los valores 
                    personales</span>. Trabajo desde la comprensión de que el sufrimiento es parte de la experiencia 
                    humana, pero podemos aprender a relacionarnos con él de manera más flexible y constructiva.
                  </p>
                </div>
              </div>

              {/* Formation */}
              <div className="mb-16 bg-muted/30 p-8 rounded-2xl">
                <h3 className="font-heading text-3xl font-bold mb-6 text-foreground">
                  Formación Profesional
                </h3>
                <ul className="font-body text-lg space-y-4 text-foreground/90">
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-2xl">•</span>
                    <span>Psicóloga, Universidad Católica</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-2xl">•</span>
                    <span>Especialización en Terapia de Aceptación y Compromiso (ACT)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-2xl">•</span>
                    <span>Diplomado en Educación Emocional Infantil</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-2xl">•</span>
                    <span>Formación continua en Mindfulness y Regulación Emocional</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-heading text-4xl font-bold mb-12 text-center text-foreground">
                Mis Valores
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <Card 
                    key={index}
                    className="p-8 hover:shadow-hover transition-all duration-300 bg-background border-border"
                  >
                    <value.icon className={`${value.color} mb-4`} size={40} />
                    <h3 className="font-heading text-2xl font-bold mb-3 text-foreground">
                      {value.title}
                    </h3>
                    <p className="font-body text-base text-foreground/80 leading-relaxed">
                      {value.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BEING Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-heading text-4xl font-bold mb-6 text-foreground">
                BEING Educación Emocional
              </h2>
              <p className="font-body text-lg leading-relaxed text-foreground/90 mb-8">
                Fundé <span className="font-semibold text-teal">BEING</span> con la misión de llevar 
                la educación emocional más allá del consultorio. A través de talleres, charlas y recursos 
                educativos, buscamos promover el bienestar emocional en familias, escuelas y organizaciones.
              </p>
              <p className="font-body text-lg leading-relaxed text-foreground/90">
                Creo firmemente que cuando aprendemos a comprender y gestionar nuestras emociones, 
                creamos un <span className="font-semibold text-accent-coral">mundo más empático, 
                consciente y saludable</span>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;

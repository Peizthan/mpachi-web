import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const Gallery = () => {
  // Placeholder for future gallery images
  const galleryItems = [
    {
      title: "Taller de Educación Emocional",
      description: "Sesión grupal sobre gestión de emociones",
      category: "Talleres"
    },
    {
      title: "Charla en Colegio",
      description: "Educación emocional para padres",
      category: "Charlas"
    },
    {
      title: "Webinar BEING",
      description: "Mindfulness y bienestar emocional",
      category: "Eventos Online"
    },
    {
      title: "Taller Corporativo",
      description: "Manejo del estrés en el trabajo",
      category: "Empresas"
    },
    {
      title: "Actividad Mindfulness",
      description: "Práctica de atención plena",
      category: "Talleres"
    },
    {
      title: "Encuentro de Padres",
      description: "Crianza consciente y respetuosa",
      category: "Orientación Parental"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navigation />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 animate-fade-in">
                <div className="flex-shrink-0">
                  <img 
                    src="/images/7.png" 
                    alt="María Paz Jiménez" 
                    className="w-64 h-64 md:w-80 md:h-80 object-contain shadow-lg"
                    style={{ objectPosition: '35% 50%' }}
                  />
                </div>
                <div className="flex-1 text-center md:text-right">
                  <h1 className="font-heading text-5xl font-bold mb-6 text-foreground uppercase tracking-wider">
                    Galería
                  </h1>
                  <p className="font-decorative text-xl text-foreground/90 leading-relaxed">
                    Momentos de talleres, charlas y encuentros
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instagram Feed Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              
              <div className="w-full max-w-md mx-auto">
                <iframe 
                  src="https://www.instagram.com/psi.mariapazjimenez/embed/" 
                  width="100%" 
                  height="400" 
                  frameBorder="0" 
                  scrolling="no" 
                  allowTransparency="true"
                  className="rounded-lg shadow-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <p className="font-sans text-lg text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
                Aquí encontrarás imágenes de los talleres, charlas y actividades que realizamos 
                durante el trabajo terapéutico.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.map((item, index) => (
                  <Card 
                    key={index}
                    className="group overflow-hidden hover:shadow-hover transition-all duration-300"
                  >
                    {/* Placeholder image area */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-accent/20 to-muted/20 relative overflow-hidden">
                      <img 
                        src="/assets/brand-logo.png" 
                        alt="Brand Logo" 
                        className="absolute inset-0 w-full h-full object-contain opacity-30"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                    </div>
                    
                    <div className="p-6">
                      <span className="font-heading text-xs font-medium text-primary uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="font-heading text-xl font-bold mt-2 mb-2 text-foreground">
                        {item.title}
                      </h3>
                      <p className="font-sans text-sm text-foreground/70">
                        {item.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-16 text-center">
                <Card className="p-8 bg-muted/30 border-border inline-block">
                  <p className="font-decorative text-xl text-foreground/80">
                    ¿Te gustaría organizar un taller o charla?{" "}
                    <a href="/contacto" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                      Contáctame
                    </a>
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const Index = () => {
  // Función para scroll suave a una sección
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navigation />
      
      {/* ============================================================
          SECCIÓN HERO - id="inicio"
          El punto de entrada principal con título, subtítulo y CTA
          ============================================================ */}
      <section 
        id="inicio" 
        className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden pt-32 transition-colors"
      >
        {/* Decoración - logo en top right (solo desktop) */}
        <div className="hidden lg:block absolute top-40 right-10 animate-float opacity-80">
          <img src="/assets/brand-logo.png" alt="Brand Logo" width={80} height={80} className="drop-shadow-lg" />
        </div>

        {/* Logo centrado en la parte inferior */}
        <div className="flex justify-center w-full absolute left-0 right-0" style={{ bottom: 15 }}>
          <img src="/assets/brand-logo.png" alt="Brand Logo" width={60} height={60} className="drop-shadow-lg" />
        </div>

        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center animate-fade-in relative z-10">
            <h1 className="font-heading text-5xl font-bold mb-6 text-foreground uppercase tracking-wider">
              Qué hacer cuando mi hijo/a explota
            </h1>
            <p className="font-decorative text-2xl md:text-3xl mb-8 text-secondary-orange tracking-wide">
              Guías prácticas para manejar crisis emocionales en la primera infancia
            </p>
            <p className="font-decorative text-lg md:text-xl mb-12 text-foreground/90 leading-relaxed max-w-3xl mx-auto">
              Organizadas por edad, diseñadas para padres que quieren entender y apoyar mejor a sus hijos
            </p>

            {/* Botón CTA que desplaza a la sección de productos */}
            <Button 
              size="lg" 
              className="font-heading text-base min-w-[200px] shadow-medium hover:shadow-hover transition-all"
              onClick={() => scrollToSection("#productos")}
            >
              Ver Guías
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECCIÓN PRODUCTOS - id="productos"
          Grid de cuatro tarjetas para las guías por edad
          ============================================================ */}
      <section id="productos" className="py-20 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-heading text-4xl font-bold text-center mb-4 text-foreground">
              Nuestras Guías
            </h2>
            <p className="font-decorative text-lg text-center text-foreground/80 mb-12">
              Herramientas prácticas adaptadas a cada edad
            </p>

            {/* Grid de 4 tarjetas de productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Tarjeta 1: 0-1 años */}
              <div className="bg-card border border-border rounded-lg shadow-soft hover:shadow-hover transition-all p-6">
                <h3 className="font-heading text-xl font-bold mb-3 text-foreground">
                  Guía 0-1 años
                </h3>
                <p className="font-decorative text-sm text-foreground/80 mb-6 leading-relaxed">
                  Entendiendo los primeros berrinches. Estrategias para los primeros meses de vida.
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // TODO: Implementar modal o página de compra
                    alert("Próximamente: Modal de compra para Guía 0-1 años");
                  }}
                >
                  Ver Guía
                </Button>
              </div>

              {/* Tarjeta 2: 1-3 años */}
              <div className="bg-card border border-border rounded-lg shadow-soft hover:shadow-hover transition-all p-6">
                <h3 className="font-heading text-xl font-bold mb-3 text-foreground">
                  Guía 1-3 años
                </h3>
                <p className="font-decorative text-sm text-foreground/80 mb-6 leading-relaxed">
                  La etapa de los "no". Herramientas para navegar hace crisis emocionales intensas.
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // TODO: Implementar modal o página de compra
                    alert("Próximamente: Modal de compra para Guía 1-3 años");
                  }}
                >
                  Ver Guía
                </Button>
              </div>

              {/* Tarjeta 3: 3-5 años */}
              <div className="bg-card border border-border rounded-lg shadow-soft hover:shadow-hover transition-all p-6">
                <h3 className="font-heading text-xl font-bold mb-3 text-foreground">
                  Guía 3-5 años
                </h3>
                <p className="font-decorative text-sm text-foreground/80 mb-6 leading-relaxed">
                  Preescolar y la importancia de la comunicación. Construyendo inteligencia emocional.
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // TODO: Implementar modal o página de compra
                    alert("Próximamente: Modal de compra para Guía 3-5 años");
                  }}
                >
                  Ver Guía
                </Button>
              </div>

              {/* Tarjeta 4: Pack 0-5 */}
              <div className="bg-card border border-border rounded-lg shadow-soft hover:shadow-hover transition-all p-6 ring-2 ring-primary">
                <h3 className="font-heading text-xl font-bold mb-3 text-primary">
                  Pack Completo 0-5
                </h3>
                <p className="font-decorative text-sm text-foreground/80 mb-6 leading-relaxed">
                  Todas las guías en un pack especial. Ahorá 25% comparado con compras individuales.
                </p>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    // TODO: Implementar modal o página de compra (integración con Stripe/Hotmart)
                    alert("Próximamente: Modal de compra para Pack Completo");
                  }}
                >
                  Comprar Pack
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECCIÓN SOBRE MÍ - id="sobre-mi"
          Biografia en dos columnas con imagen
          ============================================================ */}
      <section id="sobre-mi" className="py-20 bg-card/50 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-heading text-4xl font-bold text-center mb-12 text-foreground">
              Sobre Mí
            </h2>

            {/* Grid de dos columnas: biografía + imagen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Columna izquierda: Texto biográfico */}
              <div className="space-y-6">
                <p className="font-decorative text-lg text-foreground/90 leading-relaxed">
                  Soy María Paz Jiménez, psicóloga clínica especializada en trabajar con niños, 
                  adolescentes y familias desde un enfoque basado en evidencia. Mi práctica se 
                  centra en la <span className="font-semibold text-primary">Terapia de Aceptación y 
                  Compromiso (ACT)</span> y en recursos prácticos de educación emocional.
                </p>
                <p className="font-decorative text-lg text-foreground/90 leading-relaxed">
                  Con más de 8 años de experiencia, he trabajado en contextos variados: clínica privada, 
                  instituciones educativas y espacios comunitarios. Mi pasión es acompañar a familias a 
                  entender las emociones de sus hijos y desarrollar herramientas concretas para la vida.
                </p>
                <p className="font-decorative text-lg text-foreground/90 leading-relaxed">
                  Creo que la educación emocional es fundamental. Por eso, además de mi trabajo en 
                  consultoría, co-fundé <span className="font-semibold">BEING: Educación Emocional</span>, 
                  un proyecto que lleva recursos lúdicos y prácticos a familias con niños de 3 a 12 años.
                </p>
              </div>

              {/* Columna derecha: Imagen */}
              <div className="flex justify-center">
                <img 
                  src="/images/1.png" 
                  alt="María Paz Jiménez" 
                  className="w-80 h-80 md:w-96 md:h-96 object-contain rounded-lg shadow-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECCIÓN CONSULTAS - id="consultas"
          Información sobre consultas 1:1 y cómo reservar
          ============================================================ */}
      <section id="consultas" className="py-20 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-4xl font-bold mb-4 text-foreground">
              Consultas 
            </h2>
            <p className="font-decorative text-lg text-foreground/80 mb-12">
              Acompañamiento personalizado para tu familia
            </p>

            {/* Card de información */}
            <div className="bg-card border border-border rounded-lg shadow-soft p-8 mb-8">
              <h3 className="font-heading text-2xl font-bold mb-4 text-foreground">
                Detalles de la Sesión
              </h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-background font-bold">
                    ✓
                  </div>
                  <p className="font-decorative text-lg text-foreground/90">
                    <span className="font-semibold">45 minutos</span> de sesión personalizada
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-background font-bold">
                    💰
                  </div>
                  <p className="font-decorative text-lg text-foreground/90">
                    <span className="font-semibold">Precio: 80 U$S (dólares americanos)</span>
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-background font-bold">
                    ⏰
                  </div>
                  <p className="font-decorative text-lg text-foreground/90">
                    <span className="font-semibold">Pago anticipado</span> requerido para confirmar
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-background font-bold">
                    📅
                  </div>
                  <p className="font-decorative text-lg text-foreground/90">
                    <span className="font-semibold">Turnos limitados los viernes</span> (sujeto a disponibilidad)
                  </p>
                </div>
              </div>

              {/* TODO: Implementar integración con calendario (Calendly, Cal.com, etc.) */}
              <Button 
                size="lg"
                className="font-heading text-base"
                onClick={() => {
                  // TODO: Integrar con sistema de reservas (NextAuth + base de datos)
                  window.open("https://wa.me/595983448991", "_blank");
                }}
              >
                Reservar Consulta
              </Button>
              <p className="font-decorative text-sm text-foreground/60 mt-4">
                Contáctame vía WhatsApp para coordinar disponibilidad
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECCIÓN BLOG / INFORMACIÓN ÚTIL - id="blog"
          Grid de tres tarjetas de artículos
          ============================================================ */}
      <section id="blog" className="py-20 bg-card/50 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-heading text-4xl font-bold text-center mb-4 text-foreground">
              Blog
            </h2>
            <p className="font-decorative text-lg text-center text-foreground/80 mb-12">
              Artículos y recursos para el bienestar emocional de tu familia
            </p>

            {/* Grid de 3 artículos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Artículo 1 */}
              <a 
                href="#" 
                className="bg-background border border-border rounded-lg shadow-soft hover:shadow-hover transition-all overflow-hidden group cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Navegar a la entrada de blog completa
                  alert("Próximamente: Artículo completo");
                }}
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary-orange/20 flex items-center justify-center">
                  {/* Ícono favicon en color primary */}
                  <BookOpen size={64} className="text-primary" strokeWidth={1.5} />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    Entendiendo los berrinches
                  </h3>
                  <p className="font-decorative text-sm text-foreground/80">
                    Qué son realmente y por qué tu hijo/a los necesita para crecer emocionalmente.
                  </p>
                </div>
              </a>

              {/* Artículo 2 */}
              <a 
                href="#" 
                className="bg-background border border-border rounded-lg shadow-soft hover:shadow-hover transition-all overflow-hidden group cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Navegar a la entrada de blog completa
                  alert("Próximamente: Artículo completo");
                }}
              >
                <div className="aspect-video bg-gradient-to-br from-secondary-orange/20 to-accent-coral/20 flex items-center justify-center">
                  {/* Ícono favicon en color secondary-orange */}
                  <BookOpen size={64} className="text-secondary-orange" strokeWidth={1.5} />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    La validación emocional
                  </h3>
                  <p className="font-decorative text-sm text-foreground/80">
                    Una herramienta poderosa para conectar con tu hijo sin necesidad de controlar sus emociones.
                  </p>
                </div>
              </a>

              {/* Artículo 3 */}
              <a 
                href="#" 
                className="bg-background border border-border rounded-lg shadow-soft hover:shadow-hover transition-all overflow-hidden group cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Navegar a la entrada de blog completa
                  alert("Próximamente: Artículo completo");
                }}
              >
                <div className="aspect-video bg-gradient-to-br from-teal/20 to-muted-blue-green/20 flex items-center justify-center">
                  {/* Ícono favicon en color accent */}
                  <BookOpen size={64} className="text-accent" strokeWidth={1.5} />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    Autocuidado para padres
                  </h3>
                  <p className="font-decorative text-sm text-foreground/80">
                    Por qué cuidar tu bienestar emocional es esencial para acompañar a tus hijos.
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;


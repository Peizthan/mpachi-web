import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Users, Presentation, Clock, DollarSign, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: User,
      title: "Terapia Individual",
      description: "Espacio confidencial para trabajar en tus desafíos emocionales, ansiedad, estrés, depresión y procesos de cambio personal.",
      features: [
        "Sesiones de 60 minutos",
        "Enfoque en ACT (Terapia de Aceptación y Compromiso)",
        "Plan terapéutico personalizado",
        "Herramientas prácticas y ejercicios"
      ],
      bgColor: "bg-primary/5 hover:bg-primary/10",
      borderColor: "border-primary/20",
      iconColor: "text-primary"
    },
    {
      icon: Users,
      title: "Orientación Parental",
      description: "Apoyo para padres y madres en la crianza consciente, desarrollo emocional infantil y manejo de conductas desafiantes.",
      features: [
        "Estrategias de crianza positiva",
        "Educación emocional familiar",
        "Comunicación efectiva con hijos",
        "Límites saludables y disciplina"
      ],
      bgColor: "bg-secondary/5 hover:bg-secondary/10",
      borderColor: "border-secondary/20",
      iconColor: "text-secondary"
    },
    {
      icon: Presentation,
      title: "Talleres y Charlas",
      description: "Actividades grupales sobre educación emocional, manejo del estrés, mindfulness y bienestar psicológico para equipos y comunidades.",
      features: [
        "Talleres vivenciales y prácticos",
        "Charlas motivacionales",
        "Programas para empresas y colegios",
        "Webinars y recursos online"
      ],
      bgColor: "bg-teal/5 hover:bg-teal/10",
      borderColor: "border-teal/20",
      iconColor: "text-teal"
    }
  ];

  const faqs = [
    {
      question: "¿Cuánto dura una sesión?",
      answer: "Las sesiones de terapia individual tienen una duración de 60 minutos. Las sesiones de orientación parental pueden extenderse a 90 minutos según necesidad."
    },
    {
      question: "¿Cuál es el valor de las sesiones?",
      answer: "El valor varía según el tipo de servicio. Te invito a contactarme para conversar sobre tus necesidades y conocer las opciones disponibles."
    },
    {
      question: "¿Cuántas sesiones necesitaré?",
      answer: "Cada proceso es único. En nuestra primera sesión evaluaremos juntos tus objetivos y estableceremos un plan terapéutico estimado. Algunos procesos breves pueden ser de 8-12 sesiones, mientras que otros pueden ser más extensos."
    },
    {
      question: "¿Qué es la Terapia ACT?",
      answer: "La Terapia de Aceptación y Compromiso (ACT) es un enfoque científicamente validado que te ayuda a desarrollar flexibilidad psicológica, aceptar lo que no puedes cambiar y comprometerte con acciones que te acerquen a una vida valiosa."
    },
    {
      question: "¿Realizas atención online?",
      answer: "Sí, ofrezco sesiones tanto presenciales como online, para adaptarme a tus necesidades y facilitar el acceso a terapia de calidad desde donde estés."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-warm py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 text-background uppercase tracking-wider">
                Servicios
              </h1>
              <p className="font-body text-xl text-background/90 leading-relaxed">
                Acompañamiento profesional adaptado a tus necesidades
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {services.map((service, index) => (
                  <Card 
                    key={index}
                    className={`p-8 ${service.bgColor} border-2 ${service.borderColor} transition-all duration-300 hover:shadow-hover`}
                  >
                    <service.icon className={`${service.iconColor} mb-6`} size={48} />
                    <h3 className="font-heading text-2xl font-bold mb-4 text-foreground">
                      {service.title}
                    </h3>
                    <p className="font-body text-base text-foreground/80 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 font-body text-sm text-foreground/70">
                          <span className={`${service.iconColor} mt-1`}>•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button asChild size="lg" className="font-heading text-base shadow-medium hover:shadow-hover transition-all">
                  <Link to="/contacto">Solicitar Información</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-4xl font-bold mb-12 text-center text-foreground">
                ¿Cómo Funciona el Proceso Terapéutico?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="text-primary" size={32} />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-3 text-foreground">1. Primer Contacto</h3>
                  <p className="font-body text-sm text-foreground/80">
                    Completa el formulario o contáctame directamente para agendar una primera conversación.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                    <Clock className="text-secondary" size={32} />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-3 text-foreground">2. Primera Sesión</h3>
                  <p className="font-body text-sm text-foreground/80">
                    Conoceremos tus necesidades, estableceremos objetivos y diseñaremos tu plan terapéutico.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-teal/20 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="text-teal" size={32} />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-3 text-foreground">3. Acompañamiento</h3>
                  <p className="font-body text-sm text-foreground/80">
                    Trabajaremos juntos en sesiones regulares hacia tus metas de bienestar y crecimiento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-4xl font-bold mb-12 text-center text-foreground">
                Preguntas Frecuentes
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <Card key={index} className="p-6 hover:shadow-medium transition-all">
                    <h3 className="font-heading text-lg font-bold mb-3 text-foreground">
                      {faq.question}
                    </h3>
                    <p className="font-body text-base text-foreground/80 leading-relaxed">
                      {faq.answer}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;

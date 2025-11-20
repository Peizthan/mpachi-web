import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Instagram } from "lucide-react";

const Contact = () => {


  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "mariapazjpsicologia@gmail.com",
      link: "mailto:mariapazjpsicologia@gmail.com"
    },
    {
      icon: Phone,
      title: "WhatsApp",
      content: "+595 983 448991",
      link: "https://wa.me/595983448991"
    },
    {
      icon: null,
      title: "Instagram",
      content: "@psi.mariapazjimenez",
      link: "https://www.instagram.com/psi.mariapazjimenez/"
    },
    {
      icon: MapPin,
      title: "Ubicación",
      content: "Asunción, Paraguay",
      link: "https://www.google.com/maps?q=Asunción,+Paraguay"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navigation />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-calm py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 text-background uppercase tracking-wider">
                Contacto
              </h1>
              <p className="font-decorative text-base text-background/90 leading-relaxed">
                Estoy aquí para acompañarte en tu proceso
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Google Forms Button */}
                <div className="flex flex-col items-start justify-center">
                  <h2 className="font-heading text-3xl font-bold mb-6 text-foreground">
                    Envíame un Mensaje
                  </h2>
                  <p className="font-decorative text-base text-foreground/80 mb-8 leading-relaxed">
                    Para contactarme, por favor utiliza el siguiente formulario:
                  </p>
                  <a
                    href="https://docs.google.com/forms/d/1ZZYMcfBn9vVCPbB9QMwTs5TrZ1A7sIdtVy350QO9huA/viewform?fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnWolZyeDgzg_LqwDYHdCm0to7SkX_OA3JvXSz-0d2I6sEjCzI-sWK-uSZsPA_aem_37avlEPYo9eWJNpjw9Huag&edit_requested=true"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="lg" className="font-heading text-base shadow-medium hover:shadow-hover transition-all">
                      Ir al Formulario de Contacto
                    </Button>
                  </a>
                </div>

                {/* Contact Info */}
                <div>
                  <h2 className="font-heading text-3xl font-bold mb-6 text-foreground">
                    Información de Contacto
                  </h2>
                  
                  <div className="space-y-4 mb-8">
                    {contactInfo.map((info, index) => (
                      <Card key={index} className="p-6 hover:shadow-medium transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {info.icon === null
                              ? <Instagram className="text-primary" size={24} />
                              : info.icon && <info.icon className="text-primary" size={24} />}
                          </div>
                          <div>
                            <h3 className="font-heading text-lg font-bold mb-1 text-foreground">
                              {info.title}
                            </h3>
                            {info.link ? (
                              <a 
                                href={info.link} 
                                className="font-decorative text-base text-foreground/80 hover:text-primary transition-colors"
                                target="_blank" rel="noopener noreferrer"
                              >
                                {info.content}
                              </a>
                            ) : (
                              <p className="font-decorative text-base text-foreground/80">
                                {info.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Card className="p-6 bg-accent/10 border-accent/20">
                    <h3 className="font-heading text-xl font-bold mb-3 text-foreground">
                      Nota Importante
                    </h3>
                    <p className="font-decorative text-sm text-foreground/80 leading-relaxed">
                      Los turnos se agendan según el orden en que se completó el formulario y la disponibilidad de horarios. ¡Gracias por tu paciencia!
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;

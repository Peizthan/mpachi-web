import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive"
      });
      return;
    }

    // Show success message
    toast({
      title: "Mensaje enviado",
      description: "Gracias por contactarme. Te responderé a la brevedad.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "mariapazj@gmail.com",
      link: "mailto:mariapazj@gmail.com"
    },
    {
      icon: Phone,
      title: "Teléfono",
      content: "+595 983 448991",
      link: "tel:+595983448991"
    },
    {
      icon: MapPin,
      title: "Ubicación",
      content: "Asunción, Paraguay",
      link: "https://www.google.com/maps?q=Asunción,+Paraguay"
    },
    {
      icon: Clock,
      title: "Horario",
      content: "Lunes a Viernes: 9:00 - 19:00",
      link: null
    }
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
                Contacto
              </h1>
              <p className="font-body text-xl text-background/90 leading-relaxed">
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
                {/* Contact Form */}
                <div>
                  <h2 className="font-heading text-3xl font-bold mb-6 text-foreground">
                    Envíame un Mensaje
                  </h2>
                  <p className="font-body text-base text-foreground/80 mb-8 leading-relaxed">
                    Completa el formulario y me pondré en contacto contigo lo antes posible. 
                    Si prefieres, también puedes escribirme directamente al email o llamar por teléfono.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="font-heading text-sm font-medium text-foreground mb-2 block">
                        Nombre completo *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        required
                        className="font-body"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="font-heading text-sm font-medium text-foreground mb-2 block">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        required
                        className="font-body"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="font-heading text-sm font-medium text-foreground mb-2 block">
                        Teléfono
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+56 9 1234 5678"
                        className="font-body"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="font-heading text-sm font-medium text-foreground mb-2 block">
                        Mensaje *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Cuéntame brevemente qué te trae por aquí..."
                        required
                        rows={6}
                        className="font-body resize-none"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full font-heading text-base shadow-medium hover:shadow-hover transition-all">
                      Enviar Mensaje
                    </Button>

                    <p className="font-body text-xs text-foreground/60 leading-relaxed">
                      * Al enviar este formulario aceptas que tus datos sean utilizados para responder 
                      a tu consulta. Tus datos personales están protegidos según la Ley de Protección 
                      de Datos Personales.
                    </p>
                  </form>
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
                            <info.icon className="text-primary" size={24} />
                          </div>
                          <div>
                            <h3 className="font-heading text-lg font-bold mb-1 text-foreground">
                              {info.title}
                            </h3>
                            {info.link ? (
                              <a 
                                href={info.link} 
                                className="font-body text-base text-foreground/80 hover:text-primary transition-colors"
                              >
                                {info.content}
                              </a>
                            ) : (
                              <p className="font-body text-base text-foreground/80">
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
                    <p className="font-body text-sm text-foreground/80 leading-relaxed">
                      Debido a la alta demanda, las respuestas pueden tomar entre 24-48 horas. 
                      Si tu situación requiere atención inmediata, por favor indica "urgente" en tu mensaje.
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

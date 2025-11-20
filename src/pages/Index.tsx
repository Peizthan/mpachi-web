import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navigation />
      <Hero />
      <Footer />
    </div>
  );
};

export default Index;

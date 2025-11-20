import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground transition-colors">
      <div className="text-center space-y-4">
    <h1 className="text-5xl font-heading font-bold tracking-widest text-primary">404</h1>
  <p className="text-base font-decorative text-foreground/80">Oops! Page not found</p>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 font-heading text-base font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;

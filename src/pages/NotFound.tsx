import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(
      `404 - Page not found. Current path: ${location.pathname}`
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="font-serif text-[clamp(2rem,5vw,4rem)] mb-4 text-foreground leading-none tracking-tight">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Página não encontrada</p>
        <Link 
          to="/" 
          className="text-primary hover:text-primary/80 underline font-medium"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

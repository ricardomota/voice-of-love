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
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
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

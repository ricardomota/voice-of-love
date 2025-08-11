import { LandingPage } from '@/components/landing/LandingPage';

interface LandingProps {
  onTryFree: () => void;
  onSignIn: () => void;
}

export const Landing = ({ onTryFree, onSignIn }: LandingProps) => {
  return <LandingPage onTryFree={onTryFree} onSignIn={onSignIn} />;
};
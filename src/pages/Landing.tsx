import { SimpleLandingPage } from '@/components/landing/SimpleLandingPage';

interface LandingProps {
  onTryFree: () => void;
  onSignIn: () => void;
  onLearnMore: () => void;
}

export const Landing = ({ onTryFree, onSignIn, onLearnMore }: LandingProps) => {
  return <SimpleLandingPage onTryFree={onTryFree} onSignIn={onSignIn} onLearnMore={onLearnMore} />;
};
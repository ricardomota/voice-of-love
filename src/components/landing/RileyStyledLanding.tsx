import React from 'react';

interface RileyStyledLandingProps {
  onTryFree: () => void;
  onSignIn: () => void;
  onLearnMore: () => void;
}

export const RileyStyledLanding: React.FC<RileyStyledLandingProps> = ({ onTryFree, onSignIn, onLearnMore }) => {
  const handleTryFree: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    onTryFree();
  };

  const handleLearnMore: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    // allow anchor to scroll and also trigger optional callback
    onLearnMore?.();
  };

  return (
    <div>
      <header className="header" role="banner">
        <nav className="nav container" aria-label="Primary">
          <a href="#" className="logo" aria-label="Eterna Home">❤️ Eterna</a>
          <ul className="nav-links" role="menubar">
            <li role="none"><a role="menuitem" href="#features" className="nav-link">How it Works</a></li>
            <li role="none"><a role="menuitem" href="#pricing" className="nav-link">Preços</a></li>
            <li role="none"><a role="menuitem" href="#mission" className="nav-link">Nossa Missão</a></li>
          </ul>
          <a href="#" onClick={handleTryFree} className="btn btn-primary" aria-label="Try Eterna Free">Try Eterna Free</a>
        </nav>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero-content">
            <div className="alzheimer-badge">❤️ Made for Alzheimer's families</div>
            <h1 id="hero-title" className="hero-title">Keep Their Voice Forever</h1>
            <h2 className="hero-subtitle">AI-Powered Memory Preservation</h2>
            <p className="hero-description">
              Eterna turns cherished memories into living conversations. Preserve your loved one's voice and personality with AI that understands what matters most to families facing memory loss.
            </p>
            <div className="flex-center gap-md mt-xl">
              <a href="#" onClick={handleTryFree} className="btn btn-primary btn-large">Try Eterna Free</a>
              <a href="#features" onClick={handleLearnMore} className="btn btn-secondary btn-large">See How It Works</a>
            </div>
            <p className="text-small mt-md">No credit card required • 5 messages to start</p>
          </div>
        </section>

        <section className="section" id="features" aria-labelledby="features-title">
          <div className="container">
            <h2 id="features-title" className="text-center mb-md">Everything You Need</h2>
            <p className="text-center hero-subtitle mb-xl">Preserve Memories, Connect Hearts</p>

            <div className="features-grid">
              <article className="card feature-card card-voice-cloning hover-lift" aria-label="Voice Cloning">
                <div className="feature-icon">🎤</div>
                <h3>Voice Cloning</h3>
                <p>Advanced AI captures unique speech patterns and personality</p>
              </article>

              <article className="card feature-card card-family-profiles hover-lift" aria-label="Family Profiles">
                <div className="feature-icon">👨‍👩‍👧‍👦</div>
                <h3>Family Profiles</h3>
                <p>Create detailed profiles for each loved one with photos and memories</p>
              </article>

              <article className="card feature-card card-conversations hover-lift" aria-label="Natural Conversations">
                <div className="feature-icon">💬</div>
                <h3>Natural Conversations</h3>
                <p>Chat naturally with AI that responds like your loved one</p>
              </article>

              <article className="card feature-card card-privacy hover-lift" aria-label="Privacy First">
                <div className="feature-icon">🔒</div>
                <h3>Privacy First</h3>
                <p>Your family's data is encrypted and never shared with third parties</p>
              </article>

              <article className="card feature-card card-memory hover-lift" aria-label="Memory Preservation">
                <div className="feature-icon">🧠</div>
                <h3>Memory Preservation</h3>
                <p>Specially designed for families facing Alzheimer's and dementia</p>
              </article>

              <article className="card feature-card card-love hover-lift" aria-label="Built with Love">
                <div className="feature-icon">❤️</div>
                <h3>Built with Love</h3>
                <p>Created by someone who understands the pain of memory loss</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="mission" aria-labelledby="mission-title">
          <div className="container">
            <div className="mission-section">
              <h2 id="mission-title" className="text-center mb-lg">Why I Created Eterna</h2>
              <p className="text-center text-large mb-xl">
                I built this tool with love using Lovable, motivated by the need to keep my mother present, even with Alzheimer's. I want to help other families preserve the memories and personalities of their loved ones.
              </p>

              <div className="features-grid-3">
                <div className="card hover-lift">
                  <div className="feature-icon">❤️</div>
                  <h4>Built with Love</h4>
                  <p>Created by someone who understands the pain of watching memories slip away.</p>
                </div>

                <div className="card hover-lift">
                  <div className="feature-icon">🔐</div>
                  <h4>Privacy First</h4>
                  <p>Your family's voices and memories are sacred. We protect them with the highest security.</p>
                </div>

                <div className="card hover-lift">
                  <div className="feature-icon">🧠</div>
                  <h4>Alzheimer's Aware</h4>
                  <p>Specifically designed for families navigating memory loss and cognitive challenges.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="pricing" aria-labelledby="pricing-title">
          <div className="container">
            <h2 id="pricing-title" className="text-center mb-md">Simple, Family-Friendly Pricing</h2>
            <p className="text-center hero-subtitle mb-xl">Start free, upgrade when you're ready to preserve more voices and memories</p>

            <div className="features-grid-2">
              <div className="pricing-card hover-lift" aria-label="Free Plan">
                <h3>Free</h3>
                <p className="text-small mb-md">Perfect for trying Eterna</p>
                <div className="text-4xl font-bold mb-md">R$0<span className="text-base font-normal">/month</span></div>
                <ul className="mb-xl">
                  <li>✅ 5 messages per month</li>
                  <li>✅ 1 minute voice generation</li>
                  <li>✅ Last 3 memories stored</li>
                  <li>✅ Base voices available</li>
                  <li>✅ All languages (EN, PT-BR, ES)</li>
                </ul>
                <a href="#" onClick={handleTryFree} className="btn btn-secondary w-full">Start Free</a>
              </div>

              <div className="pricing-card popular hover-lift" aria-label="Family Plan">
                <h3>Family Plan</h3>
                <p className="text-small mb-md">Everything you need to preserve family voices</p>
                <div className="text-4xl font-bold mb-md">R$29<span className="text-base font-normal">/month</span></div>
                <p className="text-small mb-md">(~US$5.99)</p>
                <ul className="mb-xl">
                  <li>✅ 300 messages per month</li>
                  <li>✅ 15 minutes voice generation</li>
                  <li>✅ Unlimited memories stored</li>
                  <li>✅ Personal voice clone*</li>
                  <li>✅ Priority support</li>
                  <li>✅ All languages (EN, PT-BR, ES)</li>
                  <li>✅ Advanced personality settings</li>
                </ul>
                <a href="#" onClick={handleTryFree} className="btn btn-primary w-full">Upgrade Now</a>
              </div>
            </div>

            <p className="text-center text-small mt-md">*Personal voice clone available when capacity allows</p>
          </div>
        </section>

        <section className="section" aria-labelledby="cta-title">
          <div className="container text-center">
            <h2 id="cta-title" className="mb-md">Ready to hear a memory come alive?</h2>
            <p className="hero-subtitle mb-xl">Join families worldwide who are preserving the voices they love most.</p>
            <a href="#" onClick={handleTryFree} className="btn btn-primary btn-large hover-glow">Try Eterna Free</a>
            <div className="mt-md">
              <p className="text-small">No credit card required</p>
              <p className="text-small">5 messages to start</p>
              <p className="text-small">1 minute of voice generation</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RileyStyledLanding;

import { HeroSection } from '@/components/home/hero-section';
import { FeatureCards } from '@/components/home/feature-cards';
import { TrustSection } from '@/components/home/trust-section';

export const metadata = {
  title: 'Kinevir - Votre santé, accompagnée en ligne',
  description: 'Plateforme complète de physiothérapie digitale : consultez des pathologies, prenez rendez-vous, accédez à des téléconsultations et découvrez des exercices thérapeutiques personnalisés.',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeatureCards />
      <TrustSection />
    </main>
  );
}
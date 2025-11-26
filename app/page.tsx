import { HeroSection } from '@/components/home/hero-section';
import { FeatureCards } from '@/components/home/feature-cards';
import { TrustSection } from '@/components/home/trust-section';
import { AuthCallback } from '@/components/auth/auth-callback';
import { Suspense } from 'react';

export const metadata = {
  title: 'Kinevir - Votre santé, accompagnée en ligne',
  description: 'Plateforme complète de physiothérapie digitale : consultez des pathologies, prenez rendez-vous, accédez à des téléconsultations et découvrez des exercices thérapeutiques personnalisés.',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={null}>
        <AuthCallback />
      </Suspense>
      <HeroSection />
      <FeatureCards />
      <TrustSection />
    </main>
  );
}
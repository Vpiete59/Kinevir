import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Calendar, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-kinevir-light-gray/20 to-kinevir-medium-blue/10 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-kinevir-medium-blue mb-6 leading-tight">
            Votre santé, accompagnée en ligne
          </h1>
          <p className="text-lg sm:text-xl text-kinevir-dark-blue/80 mb-8 leading-relaxed max-w-2xl mx-auto">
            Accédez à une plateforme complète de physiothérapie : consultez des
            fiches pathologies, prenez rendez-vous ou rejoignez une téléconsultation
            en toute sécurité.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/appointment">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-kinevir-orange to-kinevir-bright-yellow hover:from-kinevir-orange/90 hover:to-kinevir-bright-yellow/90 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Prendre rendez-vous
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/pathologies">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-kinevir-medium-blue text-kinevir-medium-blue hover:bg-kinevir-medium-blue hover:text-white transition-all"
              >
                <Search className="w-5 h-5 mr-2" />
                Explorer les pathologies
              </Button>
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-kinevir-light-gray/50">
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-kinevir-orange">500+</div>
                <div className="text-sm text-kinevir-dark-blue/70">Patients accompagnés</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-kinevir-orange">50+</div>
                <div className="text-sm text-kinevir-dark-blue/70">Pathologies référencées</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-kinevir-orange">24/7</div>
                <div className="text-sm text-kinevir-dark-blue/70">Accès aux ressources</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 -z-10 opacity-10">
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
          <circle cx="250" cy="250" r="200" stroke="#fb8500" strokeWidth="2" />
          <circle cx="250" cy="250" r="150" stroke="#ffb703" strokeWidth="2" />
          <circle cx="250" cy="250" r="100" stroke="#219ebc" strokeWidth="2" />
        </svg>
      </div>
    </section>
  );
}

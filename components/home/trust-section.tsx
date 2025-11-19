import { Shield, Award, Users, Clock } from 'lucide-react';

const trustFeatures = [
  {
    icon: Shield,
    title: 'Sécurité garantie',
    description: 'Vos données de santé sont protégées selon les normes RGPD et hébergées en France.',
  },
  {
    icon: Award,
    title: 'Expertise médicale',
    description: 'Tous nos contenus sont validés par des kinésithérapeutes diplômés d\'État.',
  },
  {
    icon: Users,
    title: 'Accessible à tous',
    description: 'Interface conçue pour être utilisable par tous, quel que soit votre niveau technique.',
  },
  {
    icon: Clock,
    title: 'Disponible 24/7',
    description: 'Accédez à vos ressources et informations à tout moment, où que vous soyez.',
  },
];

export function TrustSection() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-kinevir-medium-blue/5 via-white to-kinevir-light-gray/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-kinevir-medium-blue mb-4">
            Pourquoi choisir Kinevir ?
          </h2>
          <p className="text-lg text-kinevir-dark-blue/70">
            Une plateforme pensée pour vous offrir le meilleur accompagnement
            dans votre parcours de santé.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {trustFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-kinevir-medium-blue to-kinevir-light-blue flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-kinevir-medium-blue mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-kinevir-dark-blue/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-kinevir-light-gray">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-kinevir-medium-blue mb-4">
                Une approche moderne de la physiothérapie
              </h3>
              <p className="text-kinevir-dark-blue/80 leading-relaxed mb-4">
                Kinevir combine l'expertise clinique traditionnelle avec les
                technologies numériques pour vous offrir un suivi personnalisé
                et accessible.
              </p>
              <p className="text-kinevir-dark-blue/80 leading-relaxed">
                Notre mission : démocratiser l'accès aux soins de qualité et
                accompagner chaque patient dans son parcours de rééducation.
              </p>
            </div>
            <div className="bg-gradient-to-br from-kinevir-medium-blue/10 to-kinevir-light-blue/10 rounded-xl p-8 text-center">
              <div className="text-5xl font-bold text-kinevir-medium-blue mb-2">98%</div>
              <p className="text-kinevir-dark-blue/70 font-medium">
                de nos patients recommandent notre plateforme
              </p>
              <div className="mt-6 flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 text-kinevir-light-blue fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

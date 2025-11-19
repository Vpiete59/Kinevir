import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Calendar, Video, Dumbbell, Heart, ArrowRight, AlertCircle } from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Pathologies',
    description: 'Explorez notre base de données interactive pour comprendre votre condition et les traitements disponibles.',
    href: '/pathologies',
    color: 'text-kinevir-orange',
    bgColor: 'bg-kinevir-orange/10',
  },
  {
    icon: Calendar,
    title: 'Rendez-vous',
    description: 'Réservez une consultation classique ou urgente avec un physiothérapeute qualifié.',
    href: '/appointment',
    color: 'text-kinevir-medium-blue',
    bgColor: 'bg-kinevir-medium-blue/10',
  },
  {
    icon: Video,
    title: 'Téléconsultation',
    description: 'Consultez votre praticien à distance en toute sécurité via notre plateforme intégrée.',
    href: '/teleconsultation',
    color: 'text-kinevir-dark-blue',
    bgColor: 'bg-kinevir-dark-blue/10',
  },
  {
    icon: Dumbbell,
    title: 'Exercices thérapeutiques',
    description: 'Accédez à une bibliothèque d\'exercices personnalisés pour votre rééducation.',
    href: '/program',
    color: 'text-kinevir-light-blue',
    bgColor: 'bg-kinevir-light-blue/10',
  },
  {
    icon: Heart,
    title: 'Santé & bien-être',
    description: 'Découvrez nos guides sur le sommeil, la nutrition et la gestion du stress.',
    href: '/wellness',
    color: 'text-kinevir-medium-blue',
    bgColor: 'bg-kinevir-medium-blue/10',
  },
];

export function FeatureCards() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-kinevir-medium-blue mb-4">
            Une plateforme complète pour votre santé
          </h2>
          <p className="text-lg text-kinevir-dark-blue/70">
            Tous les outils dont vous avez besoin pour prendre soin de vous,
            accessibles en quelques clics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="border-kinevir-light-gray hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-kinevir-medium-blue">{feature.title}</CardTitle>
                  <CardDescription className="text-kinevir-dark-blue/70">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={feature.href}>
                    <Button
                      variant="ghost"
                      className="w-full text-kinevir-medium-blue hover:bg-kinevir-medium-blue/10 group"
                    >
                      Découvrir
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="border-kinevir-orange/30 bg-gradient-to-r from-kinevir-orange/5 to-kinevir-light-blue/5">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-kinevir-orange/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-kinevir-orange" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-kinevir-medium-blue mb-1">
                  Besoin d'une consultation urgente ?
                </h3>
                <p className="text-sm text-kinevir-dark-blue/70">
                  Nous proposons des créneaux d'urgence pour les cas nécessitant une prise en charge rapide.
                </p>
              </div>
              <Link href="/appointment?type=emergency">
                <Button className="bg-kinevir-orange hover:bg-kinevir-orange/90 text-white">
                  Urgence
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

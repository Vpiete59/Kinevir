import Link from 'next/link';
import { Heart } from 'lucide-react';

const footerLinks = {
  legal: [
    { name: 'Mentions légales', href: '/legal' },
    { name: 'Politique de confidentialité', href: '/privacy' },
    { name: 'Conditions générales', href: '/terms' },
  ],
  resources: [
    { name: 'Accessibilité', href: '/accessibility' },
    { name: 'Plan du site', href: '/sitemap' },
    { name: 'Contact', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="w-full border-t border-kinevir-light-gray bg-white" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-kinevir-medium-blue to-kinevir-light-blue flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-kinevir-medium-blue">Kinevir</span>
            </div>
            <p className="text-sm text-kinevir-dark-blue/70 leading-relaxed">
              Votre santé, accompagnée en ligne. Plateforme de physiothérapie digitale
              alliant expertise clinique et innovation technologique.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-kinevir-medium-blue mb-4">Informations légales</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-kinevir-dark-blue/70 hover:text-kinevir-medium-blue transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-kinevir-medium-blue mb-4">Ressources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-kinevir-dark-blue/70 hover:text-kinevir-medium-blue transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-kinevir-light-gray">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-kinevir-dark-blue/70">
              © {new Date().getFullYear()} Kinevir. Tous droits réservés.
            </p>
            <p className="text-sm text-kinevir-dark-blue/70 flex items-center gap-2">
              Conçu avec <Heart className="w-4 h-4 text-kinevir-light-blue fill-current" /> pour votre bien-être
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

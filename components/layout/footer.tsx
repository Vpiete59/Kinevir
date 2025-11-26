import Link from 'next/link';
import Image from 'next/image';
import { Heart, Instagram } from 'lucide-react';

const footerLinks = {
  kinevir: [
    { name: 'À propos', href: '/about' },
    { name: 'L\'équipe', href: '/team' },
  ],
  informations: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Mentions légales', href: '/legal' },
    { name: 'Politique de confidentialité', href: '/privacy' },
  ],
};

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/logo-k.webp"
                  alt="Kinevir"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative h-8 w-24 flex-shrink-0">
                <Image
                  src="/logo-titre.webp"
                  alt="Kinevir"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Votre santé, accompagnée en ligne. Plateforme de physiothérapie digitale
              alliant expertise clinique et innovation technologique.
            </p>
          </div>

          {/* Kinevir */}
          <div>
            <h3 className="font-semibold text-[#4A9BA5] mb-4">Kinevir</h3>
            <ul className="space-y-2">
              {footerLinks.kinevir.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#4A9BA5] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="font-semibold text-[#4A9BA5] mb-4">Informations</h3>
            <ul className="space-y-2">
              {footerLinks.informations.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#4A9BA5] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="font-semibold text-[#4A9BA5] mb-4">Légal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#4A9BA5] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-gray-700">Suivez-nous</p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/kinevir.c0m/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                aria-label="Suivez-nous sur Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Kinevir. Tous droits réservés.
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              Conçu avec <Heart className="w-4 h-4 text-[#4A9BA5] fill-current" /> pour votre bien-être
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
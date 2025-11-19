'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogIn, User, Menu, X, Stethoscope, UserRound } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const navigation = [
  { name: 'Pathologies', href: '/pathologies' },
  { name: 'Rendez-vous', href: '/appointment' },
  { name: 'Exercices', href: '/program' },
  { name: 'Bien-être', href: '/wellness' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, isPractitioner } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPractitionerView = pathname?.startsWith('/practitioner');

  const toggleView = () => {
    if (isPractitionerView) {
      router.push('/');
    } else {
      router.push('/practitioner');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-kinevir-light-gray bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navigation principale">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-kinevir-medium-blue to-kinevir-light-blue flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-kinevir-medium-blue hidden sm:inline">
                Kinevir
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-kinevir-medium-blue/10 text-kinevir-medium-blue'
                      : 'text-kinevir-dark-blue/70 hover:bg-kinevir-light-gray/50 hover:text-kinevir-medium-blue'
                  }`}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                {isPractitioner && (
                  <Button
                    onClick={toggleView}
                    variant="outline"
                    size="sm"
                    className="border-kinevir-medium-blue text-kinevir-medium-blue hover:bg-kinevir-medium-blue hover:text-white transition-all"
                  >
                    {isPractitionerView ? (
                      <>
                        <UserRound className="w-4 h-4 mr-2" />
                        Mode Patient
                      </>
                    ) : (
                      <>
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Espace Praticien
                      </>
                    )}
                  </Button>
                )}
                <span className="text-sm text-kinevir-dark-blue/70">
                  {user.email}
                </span>
                <Link href="/account">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-kinevir-medium-blue hover:bg-kinevir-medium-blue/10"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mon compte
                  </Button>
                </Link>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  size="sm"
                  className="border-kinevir-medium-blue text-kinevir-medium-blue hover:bg-kinevir-medium-blue hover:text-white"
                >
                  Déconnexion
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-kinevir-medium-blue hover:bg-kinevir-medium-blue/90 text-white"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Connexion
                </Button>
              </Link>
            )}

            <button
              type="button"
              className="md:hidden p-2 rounded-md text-kinevir-medium-blue hover:bg-kinevir-medium-blue/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Ouvrir le menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-kinevir-light-gray">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-kinevir-medium-blue/10 text-kinevir-medium-blue'
                      : 'text-kinevir-dark-blue/70 hover:bg-kinevir-light-gray/50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <>
                  {isPractitioner && (
                    <button
                      onClick={() => {
                        toggleView();
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 rounded-md text-sm font-medium text-left text-kinevir-medium-blue hover:bg-kinevir-medium-blue/10 flex items-center gap-2"
                    >
                      {isPractitionerView ? (
                        <>
                          <UserRound className="w-4 h-4" />
                          Mode Patient
                        </>
                      ) : (
                        <>
                          <Stethoscope className="w-4 h-4" />
                          Espace Praticien
                        </>
                      )}
                    </button>
                  )}
                  <Link
                    href="/account"
                    className="px-4 py-2 rounded-md text-sm font-medium text-kinevir-dark-blue/70 hover:bg-kinevir-light-gray/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mon compte
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded-md text-sm font-medium text-left text-kinevir-dark-blue/70 hover:bg-kinevir-light-gray/50"
                  >
                    Déconnexion
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/layout/footer';
import { OrganizationSchema } from '@/components/seo/schema';
import Navbar from '@/components/layout/navbar'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kinevir.com'),
  title: {
    default: 'Kinevir - Plateforme de physiothérapie en ligne',
    template: '%s | Kinevir',
  },
  description: 'Plateforme complète de physiothérapie digitale : consultez des pathologies, prenez rendez-vous, accédez à des téléconsultations et découvrez des exercices thérapeutiques personnalisés.',
  keywords: [
    'physiothérapie',
    'kinésithérapie',
    'téléconsultation',
    'santé',
    'bien-être',
    'rééducation',
    'exercices thérapeutiques',
    'pathologies musculosquelettiques',
  ],
  authors: [{ name: 'Kinevir' }],
  creator: 'Kinevir',
  publisher: 'Kinevir',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kinevir.com',
    siteName: 'Kinevir',
    title: 'Kinevir - Plateforme de physiothérapie en ligne',
    description: 'Plateforme complète de physiothérapie digitale : consultez des pathologies, prenez rendez-vous, accédez à des téléconsultations.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kinevir - Physiothérapie en ligne',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kinevir - Plateforme de physiothérapie en ligne',
    description: 'Plateforme complète de physiothérapie digitale : consultez des pathologies, prenez rendez-vous, accédez à des téléconsultations.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // À remplacer
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <OrganizationSchema />
      </head>
      <body className={inter.className}>
        <AuthProvider>
  <Navbar />
  {children}
</AuthProvider>
      </body>
    </html>
  );
}

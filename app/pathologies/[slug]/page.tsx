import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageLayout } from '@/components/page-layout';
import { PathologyDetail } from '@/components/pathologies/pathology-detail';
import { PathologySchema } from '@/components/seo/schema';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface PathologyPageProps {
  params: {
    slug: string;
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getPathology(slug: string) {
  try {
    const { data, error } = await supabase
      .from('pathologies')
      .select('*, body_regions(*)')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch (error) {
    console.error('Failed to fetch pathology:', error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const { data } = await supabase
      .from('pathologies')
      .select('slug')
      .eq('published', true);

    return data?.map((p) => ({ slug: p.slug })) || [];
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PathologyPageProps): Promise<Metadata> {
  const pathology = await getPathology(params.slug);

  if (!pathology) {
    return {
      title: 'Pathologie non trouvée - Kinevir',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kinevir.com';
  const pathologyUrl = `${baseUrl}/pathologies/${pathology.slug}`;
  const description = pathology.short_description || pathology.detailed_description || `Informations complètes sur ${pathology.name} : symptômes, causes, traitements et exercices thérapeutiques recommandés.`;

  return {
    title: `${pathology.name} - Pathologies`,
    description,
    keywords: [
      pathology.name,
      'physiothérapie',
      'kinésithérapie',
      'pathologie',
      'traitement',
      'exercices',
      pathology.body_regions?.display_name,
      'téléconsultation',
    ].filter(Boolean),
    alternates: {
      canonical: pathologyUrl,
    },
    openGraph: {
      title: `${pathology.name} | Kinevir`,
      description,
      url: pathologyUrl,
      type: 'article',
      locale: 'fr_FR',
      siteName: 'Kinevir',
      images: pathology.image_url
        ? [
            {
              url: pathology.image_url,
              width: 1200,
              height: 630,
              alt: pathology.name,
            },
          ]
        : [
            {
              url: '/og-image.jpg',
              width: 1200,
              height: 630,
              alt: pathology.name,
            },
          ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pathology.name} | Kinevir`,
      description,
      images: pathology.image_url ? [pathology.image_url] : ['/og-image.jpg'],
    },
  };
}

export default async function PathologyPage({ params }: PathologyPageProps) {
  const pathology = await getPathology(params.slug);

  if (!pathology) {
    notFound();
  }

  return (
    <>
      <PathologySchema pathology={pathology} />
      <PageLayout
        title={pathology.name}
        description={pathology.body_regions?.display_name || 'Détails de la pathologie'}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/pathologies">
              <Button
                variant="ghost"
                className="text-kinevir-medium-blue hover:bg-kinevir-medium-blue/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux pathologies
              </Button>
            </Link>
          </div>

          <PathologyDetail pathology={pathology} />
        </div>
      </PageLayout>
    </>
  );
}

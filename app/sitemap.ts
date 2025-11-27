import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

interface Pathology {
  slug: string;
  updated_at: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kinevir.com';
  
  // Créer un client pour le serveur
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  // Récupérer toutes les pathologies publiées
  const { data: pathologies } = await supabase
    .from('pathologies')
    .select('slug, updated_at')
    .eq('published', true);

  const pathologyUrls = (pathologies as Pathology[] | null)?.map((pathology: Pathology) => ({
    url: `${baseUrl}/pathologies/${pathology.slug}`,
    lastModified: new Date(pathology.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || [];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/pathologies`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/appointment`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    ...pathologyUrls,
  ];
}

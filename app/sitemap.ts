import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kinevir.com';
  
  // Récupérer toutes les pathologies publiées
  const { data: pathologies } = await supabase
    .from('pathologies')
    .select('slug, updated_at')
    .eq('published', true);

  const pathologyUrls = pathologies?.map((pathology) => ({
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

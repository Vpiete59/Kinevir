export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: 'Kinevir',
    description: 'Plateforme complète de physiothérapie digitale pour consultations en ligne et suivi personnalisé',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kinevir.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kinevir.com'}/logo.png`,
    sameAs: [
      // Ajoute ici tes réseaux sociaux quand tu les auras
      // 'https://www.facebook.com/kinevir',
      // 'https://www.linkedin.com/company/kinevir',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['French'],
    },
    medicalSpecialty: 'Physiotherapy',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface PathologySchemaProps {
  pathology: {
    name: string;
    slug: string;
    short_description?: string | null;
    detailed_description?: string | null;
    symptoms?: any;
    treatments?: any;
    image_url?: string | null;
  };
}

export function PathologySchema({ pathology }: PathologySchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kinevir.com';
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: pathology.name,
    description: pathology.short_description || pathology.detailed_description || '',
    url: `${baseUrl}/pathologies/${pathology.slug}`,
    image: pathology.image_url || `${baseUrl}/og-image.jpg`,
    mainEntity: {
      '@type': 'MedicalCondition',
      name: pathology.name,
      description: pathology.detailed_description || pathology.short_description || '',
      ...(pathology.symptoms && {
        signOrSymptom: Array.isArray(pathology.symptoms) 
          ? pathology.symptoms.map((s: any) => ({
              '@type': 'MedicalSymptom',
              name: typeof s === 'string' ? s : s.name || '',
            }))
          : [],
      }),
    },
    specialty: 'Physiotherapy',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

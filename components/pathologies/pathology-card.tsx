import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface Pathology {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  severity: string;
  body_regions?: {
    display_name: string;
  } | null;
}

interface PathologyCardProps {
  pathology: Pathology;
}

const severityConfig = {
  mild: { label: 'Légère', color: 'bg-green-100 text-green-800 border-green-300' },
  moderate: { label: 'Modérée', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  severe: { label: 'Sévère', color: 'bg-red-100 text-red-800 border-red-300' },
};

export function PathologyCard({ pathology }: PathologyCardProps) {
  const severity = severityConfig[pathology.severity as keyof typeof severityConfig] || severityConfig.moderate;

  return (
    <Card className="hover:shadow-lg transition-shadow border-kinevir-light-gray">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl text-kinevir-medium-blue">{pathology.name}</CardTitle>
            {pathology.body_regions && (
              <CardDescription className="text-kinevir-dark-blue/70 mt-1">
                {pathology.body_regions.display_name}
              </CardDescription>
            )}
          </div>
          <Badge variant="outline" className={severity.color}>
            {severity.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-kinevir-dark-blue/80 mb-4 line-clamp-3">
          {pathology.short_description || 'Aucune description disponible.'}
        </p>
        <Link href={`/pathologies/${pathology.slug}`}>
          <Button
            variant="outline"
            className="w-full border-kinevir-medium-blue text-kinevir-medium-blue hover:bg-kinevir-medium-blue/10"
          >
            En savoir plus
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

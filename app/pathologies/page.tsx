'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/page-layout';
import { InteractiveSkeletonPatient } from '@/components/pathologies/interactive-skeleton-patient';
import { PathologyCard } from '@/components/pathologies/pathology-card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

interface BodyRegion {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
}

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

export default function PathologiesPage() {
  const [regions, setRegions] = useState<BodyRegion[]>([]);
  const [pathologies, setPathologies] = useState<Pathology[]>([]);
  const [filteredPathologies, setFilteredPathologies] = useState<Pathology[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/pathologies?all_regions=true').then((r) => r.json()),
      fetch('/api/pathologies').then((r) => r.json()),
    ])
      .then(([regionsData, pathologiesData]) => {
        const uniqueRegions: BodyRegion[] = [];
        const regionMap = new Map<string, BodyRegion>();

        pathologiesData.forEach((p: any) => {
          if (p.body_regions && !regionMap.has(p.body_regions.id)) {
            regionMap.set(p.body_regions.id, {
              id: p.body_regions.id,
              name: p.body_regions.name,
              display_name: p.body_regions.display_name,
              description: p.body_regions.description,
            });
          }
        });

        setRegions(Array.from(regionMap.values()));
        setPathologies(pathologiesData);
        setFilteredPathologies(pathologiesData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = pathologies;

    if (selectedRegion) {
      filtered = filtered.filter(
        (p) => p.body_regions && p.body_regions.display_name === regions.find((r) => r.id === selectedRegion)?.display_name
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.short_description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPathologies(filtered);
  }, [selectedRegion, searchQuery, pathologies, regions]);

  const handleRegionClick = (region: BodyRegion) => {
    setSelectedRegion(selectedRegion === region.id ? null : region.id);
  };

  return (
    <PageLayout
      title="Pathologies"
      description="Découvrez les pathologies par région anatomique"
    >
      <div className="space-y-8">
        <InteractiveSkeletonPatient />

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-kinevir-dark-blue/50 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher une pathologie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-kinevir-light-gray focus:ring-kinevir-medium-blue"
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-kinevir-medium-blue mb-6">
            {selectedRegion
              ? `Pathologies - ${regions.find((r) => r.id === selectedRegion)?.display_name}`
              : 'Toutes les pathologies'}
            {filteredPathologies.length > 0 && (
              <span className="text-kinevir-dark-blue/70 text-lg ml-2">
                ({filteredPathologies.length})
              </span>
            )}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-kinevir-dark-blue/70">Chargement...</p>
            </div>
          ) : filteredPathologies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPathologies.map((pathology) => (
                <PathologyCard key={pathology.id} pathology={pathology} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-kinevir-dark-blue/70">
                Aucune pathologie trouvée.
                {searchQuery && ' Essayez une autre recherche.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

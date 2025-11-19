'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BodyRegion {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
}

interface InteractiveSkeletonProps {
  regions: BodyRegion[];
  onRegionClick: (region: BodyRegion) => void;
  selectedRegion?: string | null;
}

const bodyParts = [
  { name: 'shoulder', displayName: 'Épaule', x: 120, y: 140, side: 'left' },
  { name: 'shoulder', displayName: 'Épaule', x: 280, y: 140, side: 'right' },
  { name: 'elbow', displayName: 'Coude', x: 80, y: 240, side: 'left' },
  { name: 'elbow', displayName: 'Coude', x: 320, y: 240, side: 'right' },
  { name: 'wrist', displayName: 'Poignet', x: 60, y: 320, side: 'left' },
  { name: 'wrist', displayName: 'Poignet', x: 340, y: 320, side: 'right' },
  { name: 'spine_cervical', displayName: 'Cervicales', x: 200, y: 120 },
  { name: 'spine_thoracic', displayName: 'Thoraciques', x: 200, y: 200 },
  { name: 'spine_lumbar', displayName: 'Lombaires', x: 200, y: 280 },
  { name: 'hip', displayName: 'Hanche', x: 160, y: 340, side: 'left' },
  { name: 'hip', displayName: 'Hanche', x: 240, y: 340, side: 'right' },
  { name: 'knee', displayName: 'Genou', x: 160, y: 460, side: 'left' },
  { name: 'knee', displayName: 'Genou', x: 240, y: 460, side: 'right' },
  { name: 'ankle', displayName: 'Cheville', x: 160, y: 580, side: 'left' },
  { name: 'ankle', displayName: 'Cheville', x: 240, y: 580, side: 'right' },
];

export function InteractiveSkeleton({
  regions,
  onRegionClick,
  selectedRegion,
}: InteractiveSkeletonProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const getRegionByName = (name: string) => {
    return regions.find((r) => r.name === name);
  };

  const isRegionActive = (name: string) => {
    const region = getRegionByName(name);
    return region && selectedRegion === region.id;
  };

  const handlePartClick = (name: string) => {
    const region = getRegionByName(name);
    if (region) {
      onRegionClick(region);
    }
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-kinevir-light-gray/10 to-white">
      <div className="flex flex-col items-center">
        <h3 className="text-2xl font-semibold text-kinevir-medium-blue mb-2">
          Anatomie interactive
        </h3>
        <p className="text-kinevir-dark-blue/70 mb-6 text-center">
          Cliquez sur une partie du corps pour découvrir les pathologies associées
        </p>

        <div className="relative w-full max-w-md mx-auto">
          <svg
            viewBox="0 0 400 650"
            className="w-full h-auto"
            style={{ maxHeight: '650px' }}
          >
            <circle cx="200" cy="80" r="35" fill="#457484" opacity="0.2" />

            <line x1="200" y1="115" x2="200" y2="300" stroke="#457484" strokeWidth="3" />

            <line x1="200" y1="140" x2="120" y2="180" stroke="#457484" strokeWidth="3" />
            <line x1="120" y1="180" x2="80" y2="260" stroke="#457484" strokeWidth="3" />
            <line x1="80" y1="260" x2="60" y2="320" stroke="#457484" strokeWidth="3" />

            <line x1="200" y1="140" x2="280" y2="180" stroke="#457484" strokeWidth="3" />
            <line x1="280" y1="180" x2="320" y2="260" stroke="#457484" strokeWidth="3" />
            <line x1="320" y1="260" x2="340" y2="320" stroke="#457484" strokeWidth="3" />

            <line x1="200" y1="300" x2="160" y2="380" stroke="#457484" strokeWidth="3" />
            <line x1="160" y1="380" x2="160" y2="500" stroke="#457484" strokeWidth="3" />
            <line x1="160" y1="500" x2="160" y2="580" stroke="#457484" strokeWidth="3" />

            <line x1="200" y1="300" x2="240" y2="380" stroke="#457484" strokeWidth="3" />
            <line x1="240" y1="380" x2="240" y2="500" stroke="#457484" strokeWidth="3" />
            <line x1="240" y1="500" x2="240" y2="580" stroke="#457484" strokeWidth="3" />

            {bodyParts.map((part, index) => {
              const region = getRegionByName(part.name);
              const isActive = isRegionActive(part.name);
              const isHovered = hoveredPart === `${part.name}-${part.side || 'center'}`;
              const hasRegion = !!region;

              return (
                <g key={`${part.name}-${part.side || 'center'}-${index}`}>
                  <circle
                    cx={part.x}
                    cy={part.y}
                    r="20"
                    fill={
                      isActive
                        ? '#c44c24'
                        : isHovered
                        ? '#f39d61'
                        : hasRegion
                        ? '#457484'
                        : '#cccccc'
                    }
                    opacity={isActive ? 0.9 : isHovered ? 0.8 : 0.6}
                    className={hasRegion ? 'cursor-pointer transition-all' : 'cursor-default'}
                    onClick={() => hasRegion && handlePartClick(part.name)}
                    onMouseEnter={() =>
                      hasRegion && setHoveredPart(`${part.name}-${part.side || 'center'}`)
                    }
                    onMouseLeave={() => setHoveredPart(null)}
                  />
                  {(isHovered || isActive) && (
                    <text
                      x={part.x}
                      y={part.y - 30}
                      textAnchor="middle"
                      fill="#457484"
                      fontSize="14"
                      fontWeight="600"
                    >
                      {part.displayName}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {regions.map((region) => (
            <Badge
              key={region.id}
              variant={selectedRegion === region.id ? 'default' : 'outline'}
              className={`cursor-pointer transition-all ${
                selectedRegion === region.id
                  ? 'bg-kinevir-orange hover:bg-kinevir-orange/90'
                  : 'border-kinevir-medium-blue text-kinevir-medium-blue hover:bg-kinevir-medium-blue/10'
              }`}
              onClick={() => onRegionClick(region)}
            >
              {region.display_name}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}

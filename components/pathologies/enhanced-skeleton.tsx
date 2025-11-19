'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, RotateCcw, ArrowRight, Users } from 'lucide-react';

interface BodyPart {
  id: string;
  name: string;
  x: number;
  y: number;
  radius: number;
  pathologies: string[];
}

const NEUTRAL_COLOR = '#94a3b8';
const HOVER_COLOR = '#64748b';
const SELECTED_COLOR = '#475569';

const bodyParts: BodyPart[] = [
  { id: 'cervicales', name: 'Cervicales', x: 125, y: 33, radius: 5, pathologies: ['Cervicalgie', 'Torticolis', 'Arthrose cervicale'] },
  { id: 'epaule-gauche', name: 'Épaule', x: 87, y: 63, radius: 5.5, pathologies: ['Tendinite coiffe rotateurs', 'Capsulite', 'Bursite'] },
  { id: 'epaule-droite', name: 'Épaule', x: 163, y: 63, radius: 5.5, pathologies: ['Tendinite coiffe rotateurs', 'Capsulite', 'Bursite'] },
  { id: 'coude-gauche', name: 'Coude', x: 65, y: 110, radius: 5, pathologies: ['Épicondylite', 'Épitrochléite', 'Bursite'] },
  { id: 'coude-droit', name: 'Coude', x: 185, y: 110, radius: 5, pathologies: ['Épicondylite', 'Épitrochléite', 'Bursite'] },
  { id: 'poignet-gauche', name: 'Poignet', x: 53, y: 155, radius: 4.5, pathologies: ['Canal carpien', 'Tendinite De Quervain', 'Entorse'] },
  { id: 'poignet-droit', name: 'Poignet', x: 197, y: 155, radius: 4.5, pathologies: ['Canal carpien', 'Tendinite De Quervain', 'Entorse'] },
  { id: 'main-gauche', name: 'Main', x: 45, y: 183, radius: 4.5, pathologies: ['Arthrose des doigts', 'Doigt à ressaut'] },
  { id: 'main-droite', name: 'Main', x: 205, y: 183, radius: 4.5, pathologies: ['Arthrose des doigts', 'Doigt à ressaut'] },
  { id: 'dos', name: 'Dos & Lombaires', x: 125, y: 115, radius: 6.5, pathologies: ['Lombalgie chronique', 'Hernie discale', 'Scoliose', 'Lumbago'] },
  { id: 'hanche-gauche', name: 'Hanche', x: 107, y: 175, radius: 5.5, pathologies: ['Arthrose de hanche', 'Bursite trochantérienne', 'Tendinite'] },
  { id: 'hanche-droite', name: 'Hanche', x: 143, y: 175, radius: 5.5, pathologies: ['Arthrose de hanche', 'Bursite trochantérienne', 'Tendinite'] },
  { id: 'genou-gauche', name: 'Genou', x: 107, y: 265, radius: 6, pathologies: ['Entorse', 'Arthrose', 'Tendinite rotulienne'] },
  { id: 'genou-droit', name: 'Genou', x: 143, y: 265, radius: 6, pathologies: ['Entorse', 'Arthrose', 'Tendinite rotulienne'] },
  { id: 'cheville-gauche', name: 'Cheville', x: 107, y: 355, radius: 5, pathologies: ['Entorse', 'Tendinite achilléenne', 'Instabilité'] },
  { id: 'cheville-droite', name: 'Cheville', x: 143, y: 355, radius: 5, pathologies: ['Entorse', 'Tendinite achilléenne', 'Instabilité'] },
  { id: 'pied-gauche', name: 'Pied', x: 107, y: 385, radius: 5, pathologies: ['Fasciite plantaire', 'Hallux valgus', 'Métatarsalgie'] },
  { id: 'pied-droit', name: 'Pied', x: 143, y: 385, radius: 5, pathologies: ['Fasciite plantaire', 'Hallux valgus', 'Métatarsalgie'] },
];

export function EnhancedSkeleton() {
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const handlePartClick = (part: BodyPart) => {
    setSelectedPart(part);
  };

  const handleReset = () => {
    setSelectedPart(null);
    setHoveredPart(null);
  };

  return (
    <Card className="border-2 border-kinevir-light-blue/30 shadow-xl bg-gradient-to-br from-white to-kinevir-light-gray/30 overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-kinevir-dark-blue mb-2 flex items-center gap-2">
                  <span className="w-1 h-8 bg-gradient-to-b from-kinevir-medium-blue to-kinevir-light-blue rounded-full"></span>
                  Anatomie interactive
                </h3>
                <p className="text-sm text-kinevir-dark-blue/70">
                  Cliquez sur une articulation pour voir les pathologies associées
                </p>
              </div>
              {selectedPart && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="border-kinevir-medium-blue text-kinevir-medium-blue hover:bg-kinevir-medium-blue hover:text-white transition-all"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              )}
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-inner overflow-hidden">
                <div className="relative w-full" style={{ aspectRatio: '1/2.2' }}>
                  <img
                    src="/wmremove-transformed copy.jpeg"
                    alt="Squelette anatomique"
                    className="w-full h-full object-contain"
                  />
                  <svg
                    viewBox="0 0 250 425"
                    className="absolute inset-0 w-full h-full"
                    style={{ pointerEvents: 'none' }}
                  >

                    {bodyParts.map((part) => {
                    const isHovered = hoveredPart === part.id;
                    const isSelected = selectedPart?.id === part.id;
                    const scale = isHovered || isSelected ? 1.3 : 1;
                    const opacity = selectedPart && !isSelected ? 0.3 : 1;
                    const color = isSelected ? SELECTED_COLOR : isHovered ? HOVER_COLOR : NEUTRAL_COLOR;

                    return (
                      <g
                        key={part.id}
                        onMouseEnter={() => setHoveredPart(part.id)}
                        onMouseLeave={() => setHoveredPart(null)}
                        onClick={() => handlePartClick(part)}
                        style={{ cursor: 'pointer', transition: 'all 0.3s ease', pointerEvents: 'auto' }}
                        opacity={opacity}
                      >
                        {(isHovered || isSelected) && (
                          <circle
                            cx={part.x}
                            cy={part.y}
                            r={part.radius * scale + 8}
                            fill={color}
                            opacity="0.2"
                            style={{ filter: 'blur(6px)' }}
                          />
                        )}
                        <circle
                          cx={part.x}
                          cy={part.y}
                          r={part.radius * scale}
                          fill={color}
                          stroke="white"
                          strokeWidth="2.5"
                          opacity={isHovered || isSelected ? 1 : 0.9}
                          style={{
                            transition: 'all 0.3s ease',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                          }}
                        />
                        {isSelected && (
                          <circle
                            cx={part.x}
                            cy={part.y}
                            r={part.radius * scale + 6}
                            fill="none"
                            stroke={SELECTED_COLOR}
                            strokeWidth="2"
                            opacity="0.5"
                          >
                            <animate
                              attributeName="r"
                              from={part.radius * scale + 4}
                              to={part.radius * scale + 12}
                              dur="1.5s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              from="0.5"
                              to="0"
                              dur="1.5s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}
                        {(isHovered || isSelected) && (
                          <text
                            x={part.x}
                            y={part.y - part.radius - 8}
                            textAnchor="middle"
                            fill="#1e293b"
                            fontSize="12"
                            fontWeight="600"
                            style={{ pointerEvents: 'none' }}
                          >
                            {part.name}
                          </text>
                        )}
                      </g>
                    );
                    })}
                  </svg>
                </div>
              </div>

              <Card className="absolute bottom-4 right-4 w-56 border-2 border-slate-300 bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-slate-600" />
                    <h4 className="font-semibold text-slate-700 text-sm">
                      Pathologies par âge
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Consultez les pathologies selon les tranches d'âge
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Voir les pathologies
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:w-96">
            <Card className="sticky top-24 border-2 border-kinevir-medium-blue/20 bg-gradient-to-br from-white via-white to-kinevir-light-blue/10 shadow-lg">
              <CardContent className="p-6">
                {selectedPart ? (
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                        <Info className="w-7 h-7 text-white relative z-10" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-kinevir-dark-blue mb-2">
                          {selectedPart.name}
                        </h4>
                        <Badge className="bg-slate-100 text-slate-700 border border-slate-300">
                          {selectedPart.pathologies.length} pathologies courantes
                        </Badge>
                      </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-kinevir-medium-blue/30 to-transparent" />
                    <div>
                      <h5 className="text-xs font-semibold text-kinevir-dark-blue/60 mb-3 uppercase tracking-wider">
                        Pathologies fréquentes
                      </h5>
                      <div className="space-y-2">
                        {selectedPart.pathologies.map((pathology, index) => (
                          <div
                            key={index}
                            className="group flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-kinevir-light-gray hover:border-kinevir-medium-blue/50 hover:shadow-md transition-all duration-200 cursor-pointer"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-2 h-2 rounded-full flex-shrink-0 bg-slate-400 shadow-sm" />
                              <span className="text-sm font-medium text-kinevir-dark-blue group-hover:text-kinevir-medium-blue transition-colors">
                                {pathology}
                              </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-kinevir-dark-blue/30 group-hover:text-kinevir-medium-blue group-hover:translate-x-1 transition-all" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-kinevir-orange to-kinevir-bright-yellow hover:from-kinevir-orange/90 hover:to-kinevir-bright-yellow/90 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                      <span>Voir les programmes de rééducation</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-kinevir-light-blue to-kinevir-medium-blue flex items-center justify-center shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                      <Info className="w-10 h-10 text-white relative z-10" />
                    </div>
                    <h4 className="text-lg font-semibold text-kinevir-dark-blue mb-2">
                      Sélectionnez une articulation
                    </h4>
                    <p className="text-sm text-kinevir-dark-blue/70 leading-relaxed">
                      Cliquez sur une zone du corps pour découvrir les pathologies courantes et les programmes de rééducation disponibles.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

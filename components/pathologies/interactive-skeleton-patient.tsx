'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, RotateCcw, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Joint {
  id: string;
  name: string;
  slug: string;
  position_x: number;
  position_y: number;
  radius: number;
  is_active: boolean;
}

interface Pathology {
  id: string;
  title: string;
  slug: string;
  description: string;
  affected_areas: string[];
}

interface JointWithPathologies extends Joint {
  pathologies: Pathology[];
}

const NEUTRAL_COLOR = '#94a3b8';
const HOVER_COLOR = '#64748b';
const SELECTED_COLOR = '#475569';

export function InteractiveSkeletonPatient() {
  const [joints, setJoints] = useState<JointWithPathologies[]>([]);
  const [selectedJoint, setSelectedJoint] = useState<JointWithPathologies | null>(null);
  const [hoveredJoint, setHoveredJoint] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJoints();
  }, []);

  const loadJoints = async () => {
    try {
      const { data: jointsData, error: jointsError } = await supabase
        .from('joints')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (jointsError) throw jointsError;

      const jointsWithPathologies = await Promise.all(
        (jointsData || []).map(async (joint) => {
          const { data: pathologiesData } = await supabase
            .from('joint_pathologies')
            .select(`
              pathology_id,
              display_order,
              pathologies (
                id,
                title,
                slug,
                description,
                affected_areas
              )
            `)
            .eq('joint_id', joint.id)
            .order('display_order');

          const pathologies = (pathologiesData || [])
            .map((jp: any) => jp.pathologies)
            .filter(Boolean);

          return {
            ...joint,
            pathologies,
          };
        })
      );

      setJoints(jointsWithPathologies);
    } catch (error) {
      console.error('Error loading joints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJointClick = (joint: JointWithPathologies) => {
    setSelectedJoint(joint);
  };

  const handleReset = () => {
    setSelectedJoint(null);
    setHoveredJoint(null);
  };

  if (loading) {
    return (
      <Card className="border-2 border-kinevir-light-blue/30 shadow-xl">
        <CardContent className="p-6 md:p-8">
          <div className="text-center py-12">
            <p className="text-kinevir-dark-blue/70">Chargement du squelette interactif...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-kinevir-light-blue/30 shadow-xl bg-gradient-to-br from-white to-kinevir-light-gray/30 overflow-hidden">
      <CardContent className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-kinevir-dark-blue mb-2 flex items-center gap-2">
                  <span className="w-1 h-6 md:h-8 bg-gradient-to-b from-kinevir-medium-blue to-kinevir-light-blue rounded-full"></span>
                  Anatomie interactive
                </h3>
                <p className="text-xs md:text-sm text-kinevir-dark-blue/70">
                  Cliquez sur une articulation pour voir les pathologies associées
                </p>
              </div>
              {selectedJoint && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="border-kinevir-medium-blue text-kinevir-medium-blue hover:bg-kinevir-medium-blue hover:text-white transition-all"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Réinitialiser</span>
                </Button>
              )}
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-4 md:p-6 border-2 border-slate-200 shadow-inner overflow-hidden">
                <div className="relative w-full mx-auto max-w-sm md:max-w-md lg:max-w-lg">
                  <img
                    src="/skeleton.jpeg"
                    alt="Squelette anatomique"
                    className="w-full h-auto"
                  />
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="none"
                  >
                    {joints.map((joint) => {
                      const isHovered = hoveredJoint === joint.id;
                      const isSelected = selectedJoint?.id === joint.id;
                      const scale = isHovered || isSelected ? 1.4 : 1;
                      const opacity = selectedJoint && !isSelected ? 0.3 : 1;
                      const color = isSelected ? SELECTED_COLOR : isHovered ? HOVER_COLOR : NEUTRAL_COLOR;

                      return (
                        <g
                          key={joint.id}
                          onMouseEnter={() => setHoveredJoint(joint.id)}
                          onMouseLeave={() => setHoveredJoint(null)}
                          onClick={() => handleJointClick(joint)}
                          style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                          opacity={opacity}
                        >
                          {(isHovered || isSelected) && (
                            <circle
                              cx={joint.position_x}
                              cy={joint.position_y}
                              r={joint.radius * scale + 2}
                              fill={color}
                              opacity="0.2"
                              style={{ filter: 'blur(8px)' }}
                            />
                          )}
                          <circle
                            cx={joint.position_x}
                            cy={joint.position_y}
                            r={joint.radius * scale}
                            fill={color}
                            stroke="white"
                            strokeWidth="0.5"
                            opacity={isHovered || isSelected ? 1 : 0.85}
                            style={{
                              transition: 'all 0.3s ease',
                              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))',
                            }}
                          />
                          {isSelected && (
                            <circle
                              cx={joint.position_x}
                              cy={joint.position_y}
                              r={joint.radius * scale + 2}
                              fill="none"
                              stroke={SELECTED_COLOR}
                              strokeWidth="0.4"
                              opacity="0.6"
                            >
                              <animate
                                attributeName="r"
                                from={joint.radius * scale + 1}
                                to={joint.radius * scale + 4}
                                dur="1.5s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                from="0.6"
                                to="0"
                                dur="1.5s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-96">
            <Card className="sticky top-24 border-2 border-kinevir-medium-blue/20 bg-gradient-to-br from-white via-white to-kinevir-light-blue/10 shadow-lg">
              <CardContent className="p-4 md:p-6">
                {selectedJoint ? (
                  <div className="space-y-4 md:space-y-5">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                        <Info className="w-6 h-6 md:w-7 md:h-7 text-white relative z-10" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg md:text-xl font-bold text-kinevir-dark-blue mb-2">
                          {selectedJoint.name}
                        </h4>
                        <Badge className="bg-slate-100 text-slate-700 border border-slate-300 text-xs">
                          {selectedJoint.pathologies.length} pathologie{selectedJoint.pathologies.length > 1 ? 's' : ''} courante{selectedJoint.pathologies.length > 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-kinevir-medium-blue/30 to-transparent" />
                    {selectedJoint.pathologies.length > 0 ? (
                      <div>
                        <h5 className="text-xs font-semibold text-kinevir-dark-blue/60 mb-3 uppercase tracking-wider">
                          Pathologies fréquentes
                        </h5>
                        <div className="space-y-2 md:space-y-3">
                          {selectedJoint.pathologies.map((pathology) => (
                            <div
                              key={pathology.id}
                              className="group p-3 md:p-4 bg-white rounded-xl border border-kinevir-light-gray hover:border-kinevir-medium-blue/50 hover:shadow-md transition-all duration-200"
                            >
                              <div className="mb-2">
                                <h6 className="text-sm md:text-base font-semibold text-kinevir-dark-blue group-hover:text-kinevir-medium-blue transition-colors">
                                  {pathology.title}
                                </h6>
                              </div>
                              <p className="text-xs md:text-sm text-kinevir-dark-blue/70 mb-3 line-clamp-2">
                                {pathology.description}
                              </p>
                              <Link href={`/pathologies/${pathology.slug}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-between text-kinevir-medium-blue hover:bg-kinevir-light-blue/10 text-xs md:text-sm"
                                >
                                  En savoir plus
                                  <ArrowRight className="w-4 h-4" />
                                </Button>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-kinevir-dark-blue/70">
                          Aucune pathologie associée à cette articulation pour le moment.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 md:py-12">
                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-kinevir-light-blue to-kinevir-medium-blue flex items-center justify-center shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                      <Info className="w-8 h-8 md:w-10 md:h-10 text-white relative z-10" />
                    </div>
                    <h4 className="text-base md:text-lg font-semibold text-kinevir-dark-blue mb-2">
                      Sélectionnez une articulation
                    </h4>
                    <p className="text-xs md:text-sm text-kinevir-dark-blue/70 leading-relaxed">
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

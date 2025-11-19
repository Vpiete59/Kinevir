'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, Trash2, Move, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Joint {
  id: string;
  name: string;
  slug: string;
  position_x: number;
  position_y: number;
  radius: number;
  is_active: boolean;
}

export function JointsManager() {
  const [joints, setJoints] = useState<Joint[]>([]);
  const [selectedJoint, setSelectedJoint] = useState<Joint | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [newJointName, setNewJointName] = useState('');
  const [newJointRadius, setNewJointRadius] = useState(5);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadJoints();
  }, []);

  const loadJoints = async () => {
    try {
      const { data, error } = await supabase
        .from('joints')
        .select('*')
        .order('name');

      if (error) throw error;
      setJoints(data || []);
    } catch (error) {
      console.error('Error loading joints:', error);
      toast.error('Erreur lors du chargement des articulations');
    }
  };

  const handleImageClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAdding || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (!newJointName.trim()) {
      toast.error('Veuillez entrer un nom pour l\'articulation');
      return;
    }

    const slug = newJointName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    try {
      const { data, error } = await supabase
        .from('joints')
        .insert({
          name: newJointName,
          slug,
          position_x: x,
          position_y: y,
          radius: newJointRadius,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      setJoints([...joints, data]);
      setNewJointName('');
      setIsAdding(false);
      toast.success('Articulation ajoutée avec succès');
    } catch (error: any) {
      console.error('Error adding joint:', error);
      if (error.code === '23505') {
        toast.error('Une articulation avec ce nom existe déjà');
      } else {
        toast.error('Erreur lors de l\'ajout de l\'articulation');
      }
    }
  };

  const handleJointDrag = (joint: Joint, e: React.MouseEvent) => {
    if (!imageRef.current || !isDragging) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setJoints(
      joints.map((j) =>
        j.id === joint.id
          ? { ...j, position_x: Math.max(0, Math.min(100, x)), position_y: Math.max(0, Math.min(100, y)) }
          : j
      )
    );
  };

  const saveJointPosition = async (joint: Joint) => {
    try {
      const { error } = await supabase
        .from('joints')
        .update({
          position_x: joint.position_x,
          position_y: joint.position_y,
        })
        .eq('id', joint.id);

      if (error) throw error;
      toast.success('Position enregistrée');
    } catch (error) {
      console.error('Error saving position:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const toggleJointActive = async (joint: Joint) => {
    try {
      const { error } = await supabase
        .from('joints')
        .update({ is_active: !joint.is_active })
        .eq('id', joint.id);

      if (error) throw error;

      setJoints(joints.map((j) => (j.id === joint.id ? { ...j, is_active: !j.is_active } : j)));
      toast.success(joint.is_active ? 'Articulation masquée' : 'Articulation activée');
    } catch (error) {
      console.error('Error toggling joint:', error);
      toast.error('Erreur lors de la modification');
    }
  };

  const deleteJoint = async (joint: Joint) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${joint.name}" ?`)) return;

    try {
      const { error } = await supabase.from('joints').delete().eq('id', joint.id);

      if (error) throw error;

      setJoints(joints.filter((j) => j.id !== joint.id));
      if (selectedJoint?.id === joint.id) setSelectedJoint(null);
      toast.success('Articulation supprimée');
    } catch (error) {
      console.error('Error deleting joint:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gestion des articulations</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isDragging ? 'default' : 'outline'}
              onClick={() => setIsDragging(!isDragging)}
              className={isDragging ? 'bg-kinevir-medium-blue' : ''}
            >
              <Move className="w-4 h-4 mr-2" />
              {isDragging ? 'Mode déplacement activé' : 'Déplacer'}
            </Button>
            <Button
              size="sm"
              onClick={() => setIsAdding(!isAdding)}
              className="bg-kinevir-medium-blue hover:bg-kinevir-medium-blue/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {isAdding && (
              <Card className="border-2 border-kinevir-medium-blue bg-kinevir-light-blue/10">
                <CardContent className="p-4 space-y-3">
                  <div>
                    <Label htmlFor="jointName">Nom de l'articulation</Label>
                    <Input
                      id="jointName"
                      value={newJointName}
                      onChange={(e) => setNewJointName(e.target.value)}
                      placeholder="Ex: Genou droit"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="jointRadius">Rayon du point (px)</Label>
                    <Input
                      id="jointRadius"
                      type="number"
                      min="3"
                      max="10"
                      value={newJointRadius}
                      onChange={(e) => setNewJointRadius(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <p className="text-sm text-kinevir-dark-blue/70">
                    Cliquez sur l'image pour placer l'articulation
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAdding(false)}
                    className="w-full"
                  >
                    Annuler
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <h3 className="font-semibold text-kinevir-dark-blue">
                Liste des articulations ({joints.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {joints.map((joint) => (
                  <div
                    key={joint.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedJoint?.id === joint.id
                        ? 'border-kinevir-medium-blue bg-kinevir-light-blue/20'
                        : 'border-slate-200 hover:border-kinevir-light-blue'
                    } ${!joint.is_active ? 'opacity-50' : ''}`}
                    onClick={() => setSelectedJoint(joint)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-kinevir-dark-blue">
                          {joint.name}
                        </h4>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            X: {joint.position_x.toFixed(1)}%
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Y: {joint.position_y.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleJointActive(joint);
                          }}
                        >
                          {joint.is_active ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteJoint(joint);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg border-2 border-slate-200 p-4">
              <div
                ref={imageRef}
                className="relative w-full cursor-crosshair"
                onClick={handleImageClick}
                onMouseMove={(e) => {
                  if (isDragging && selectedJoint) {
                    handleJointDrag(selectedJoint, e);
                  }
                }}
                onMouseUp={() => {
                  if (isDragging && selectedJoint) {
                    saveJointPosition(selectedJoint);
                  }
                }}
              >
                <img
                  src="/wmremove-transformed copy copy.jpeg"
                  alt="Squelette anatomique"
                  className="w-full h-auto"
                  draggable={false}
                />
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="none"
                >
                  {joints.map((joint) => {
                    const isSelected = selectedJoint?.id === joint.id;
                    return (
                      <g key={joint.id} opacity={joint.is_active ? 1 : 0.3}>
                        <circle
                          cx={joint.position_x}
                          cy={joint.position_y}
                          r={joint.radius}
                          fill={isSelected ? '#475569' : '#94a3b8'}
                          stroke="white"
                          strokeWidth="0.5"
                          className="pointer-events-auto cursor-move"
                          onMouseDown={(e) => {
                            if (isDragging) {
                              e.stopPropagation();
                              setSelectedJoint(joint);
                            }
                          }}
                        />
                        <text
                          x={joint.position_x}
                          y={joint.position_y - joint.radius - 1}
                          textAnchor="middle"
                          fill="#1e293b"
                          fontSize="2.5"
                          fontWeight="600"
                          className="pointer-events-none"
                        >
                          {joint.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              {isDragging && (
                <p className="text-xs text-center mt-2 text-kinevir-dark-blue/70">
                  Sélectionnez et glissez une articulation pour la déplacer
                </p>
              )}
              {isAdding && (
                <p className="text-xs text-center mt-2 text-kinevir-medium-blue font-medium">
                  Mode ajout activé - Cliquez pour placer "{newJointName}"
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

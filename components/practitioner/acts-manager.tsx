'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit, FileText, Euro, Clock, Save } from 'lucide-react';
import { AppointmentAct } from '@/lib/types';
import { toast } from 'sonner';

const defaultColors = [
  '#219ebc',
  '#8ecae6',
  '#023047',
  '#ffb703',
  '#fb8500',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
];

export function ActsManager() {
  const [acts, setActs] = useState<AppointmentAct[]>([
    {
      id: '1',
      practitioner_id: 'prac1',
      title: 'Première consultation / Bilan',
      description: 'Évaluation complète de votre condition avec élaboration d\'un plan de traitement personnalisé.',
      duration_minutes: 60,
      price_euros: 70,
      color: '#219ebc',
      is_first_consultation: true,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      practitioner_id: 'prac1',
      title: 'Séance de rééducation',
      description: 'Séance de physiothérapie classique pour suivi thérapeutique.',
      duration_minutes: 40,
      price_euros: 50,
      color: '#8ecae6',
      is_first_consultation: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAct, setEditingAct] = useState<AppointmentAct | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_minutes: 40,
    price_euros: 50,
    color: '#219ebc',
    is_first_consultation: false,
  });

  const handleOpenDialog = (act?: AppointmentAct) => {
    if (act) {
      setEditingAct(act);
      setFormData({
        title: act.title,
        description: act.description || '',
        duration_minutes: act.duration_minutes,
        price_euros: act.price_euros,
        color: act.color,
        is_first_consultation: act.is_first_consultation,
      });
    } else {
      setEditingAct(null);
      setFormData({
        title: '',
        description: '',
        duration_minutes: 40,
        price_euros: 50,
        color: '#219ebc',
        is_first_consultation: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveAct = () => {
    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
      return;
    }

    if (editingAct) {
      setActs(
        acts.map((act) =>
          act.id === editingAct.id
            ? { ...act, ...formData, updated_at: new Date().toISOString() }
            : act
        )
      );
      toast.success('Acte modifié avec succès');
    } else {
      const newAct: AppointmentAct = {
        id: Math.random().toString(),
        practitioner_id: 'prac1',
        ...formData,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setActs([...acts, newAct]);
      toast.success('Acte créé avec succès');
    }

    setIsDialogOpen(false);
  };

  const handleDeleteAct = (id: string) => {
    setActs(acts.filter((act) => act.id !== id));
    toast.success('Acte supprimé');
  };

  return (
    <Card className="border-2 border-kinevir-light-blue/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-kinevir-light-blue/5 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-kinevir-medium-blue flex items-center gap-2 text-2xl">
              <FileText className="w-6 h-6" />
              Gestion des actes
            </CardTitle>
            <CardDescription className="mt-2">
              Configurez les types de consultations que vous proposez
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-gradient-to-r from-kinevir-orange to-kinevir-bright-yellow hover:from-kinevir-orange/90 hover:to-kinevir-bright-yellow/90 text-white shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvel acte
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-kinevir-medium-blue text-xl">
                  {editingAct ? 'Modifier l\'acte' : 'Créer un nouvel acte'}
                </DialogTitle>
                <DialogDescription>
                  Définissez les informations de la consultation
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Titre *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Première consultation / Bilan"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez brièvement cette consultation"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Durée (minutes)</Label>
                    <Input
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) =>
                        setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })
                      }
                      min="10"
                      step="5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Prix (€)</Label>
                    <Input
                      type="number"
                      value={formData.price_euros}
                      onChange={(e) =>
                        setFormData({ ...formData, price_euros: parseFloat(e.target.value) || 0 })
                      }
                      min="0"
                      step="5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Couleur</Label>
                  <div className="flex items-center gap-2">
                    {defaultColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-10 h-10 rounded-md border-2 transition-all ${
                          formData.color === color ? 'border-kinevir-medium-blue scale-110 ring-2 ring-kinevir-medium-blue/30' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Couleur ${color}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-kinevir-light-gray/30 rounded-lg border border-kinevir-light-gray">
                  <div>
                    <Label>Première consultation / Bilan</Label>
                    <p className="text-sm text-kinevir-dark-blue/70">
                      Marquer cet acte comme une première consultation
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_first_consultation}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_first_consultation: checked })
                    }
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSaveAct}
                    className="flex-1 bg-kinevir-orange hover:bg-kinevir-orange/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingAct ? 'Modifier' : 'Créer'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {acts.map((act) => (
            <Card key={act.id} className="border-2 border-kinevir-light-gray hover:border-kinevir-medium-blue/40 transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: act.color }}
                    />
                    <div>
                      <h3 className="font-semibold text-kinevir-medium-blue">{act.title}</h3>
                      {act.is_first_consultation && (
                        <Badge variant="secondary" className="text-xs mt-1 bg-kinevir-bright-yellow/20 text-kinevir-dark-blue">
                          1ère consultation
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(act)}
                      className="text-kinevir-medium-blue hover:bg-kinevir-medium-blue/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAct(act.id)}
                      className="text-kinevir-error hover:bg-kinevir-error/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {act.description && (
                  <p className="text-sm text-kinevir-dark-blue/70 mb-3 line-clamp-2">
                    {act.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-kinevir-dark-blue/70">
                    <Clock className="w-4 h-4" />
                    <span>{act.duration_minutes} min</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-kinevir-orange">
                    <Euro className="w-4 h-4" />
                    <span>{act.price_euros.toFixed(2)} €</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {acts.length === 0 && (
          <div className="text-center py-12 text-kinevir-dark-blue/70">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun acte défini. Créez votre premier acte pour commencer.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

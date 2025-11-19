'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit, Users, Mail, Briefcase } from 'lucide-react';
import { Practitioner } from '@/lib/types';
import { toast } from 'sonner';

export function PractitionersManager() {
  const [practitioners, setPractitioners] = useState<Practitioner[]>([
    {
      id: '1',
      user_id: null,
      full_name: 'Dr. Sophie Martin',
      specialty: 'Kinésithérapeute spécialisée en rééducation sportive',
      description: 'Plus de 10 ans d\'expérience dans la prise en charge des sportifs de haut niveau. Spécialisée dans les pathologies du genou et de l\'épaule.',
      photo_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      user_id: null,
      full_name: 'Jean Dupont',
      specialty: 'Kinésithérapeute généraliste',
      description: 'Prise en charge de toutes pathologies musculo-squelettiques. Approche globale et personnalisée.',
      photo_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPractitioner, setEditingPractitioner] = useState<Practitioner | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    specialty: '',
    description: '',
    photo_url: '',
  });

  const handleOpenDialog = (practitioner?: Practitioner) => {
    if (practitioner) {
      setEditingPractitioner(practitioner);
      setFormData({
        full_name: practitioner.full_name,
        specialty: practitioner.specialty,
        description: practitioner.description || '',
        photo_url: practitioner.photo_url || '',
      });
    } else {
      setEditingPractitioner(null);
      setFormData({
        full_name: '',
        specialty: '',
        description: '',
        photo_url: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSavePractitioner = () => {
    if (!formData.full_name.trim() || !formData.specialty.trim()) {
      toast.error('Le nom et la spécialité sont requis');
      return;
    }

    if (editingPractitioner) {
      setPractitioners(
        practitioners.map((p) =>
          p.id === editingPractitioner.id
            ? { ...p, ...formData, updated_at: new Date().toISOString() }
            : p
        )
      );
      toast.success('Praticien modifié avec succès');
    } else {
      const newPractitioner: Practitioner = {
        id: Math.random().toString(),
        user_id: null,
        ...formData,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setPractitioners([...practitioners, newPractitioner]);
      toast.success('Praticien créé avec succès');
    }

    setIsDialogOpen(false);
  };

  const handleDeletePractitioner = (id: string) => {
    setPractitioners(practitioners.filter((p) => p.id !== id));
    toast.success('Praticien supprimé');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-kinevir-medium-blue flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gestion des praticiens
            </CardTitle>
            <CardDescription>
              Gérez les praticiens disponibles pour la prise de rendez-vous
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-kinevir-medium-blue hover:bg-kinevir-medium-blue/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau praticien
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-kinevir-medium-blue">
                  {editingPractitioner ? 'Modifier le praticien' : 'Ajouter un praticien'}
                </DialogTitle>
                <DialogDescription>
                  Renseignez les informations du praticien
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom complet *</Label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Ex: Dr. Sophie Martin"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Spécialité *</Label>
                  <Input
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="Ex: Kinésithérapeute spécialisé en rééducation sportive"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez l'expérience et les domaines d'expertise du praticien"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Photo (URL)</Label>
                  <Input
                    value={formData.photo_url}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
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
                    onClick={handleSavePractitioner}
                    className="flex-1 bg-kinevir-medium-blue hover:bg-kinevir-medium-blue/90"
                  >
                    {editingPractitioner ? 'Modifier' : 'Ajouter'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {practitioners.map((practitioner) => (
            <Card key={practitioner.id} className="border-kinevir-light-gray">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={practitioner.photo_url || undefined} />
                    <AvatarFallback className="bg-kinevir-medium-blue text-white text-lg">
                      {practitioner.full_name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-kinevir-medium-blue mb-1">
                          {practitioner.full_name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-kinevir-dark-blue/70 mb-2">
                          <Briefcase className="w-4 h-4" />
                          <span>{practitioner.specialty}</span>
                        </div>
                        {practitioner.is_active && (
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            Actif
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(practitioner)}
                          className="text-kinevir-medium-blue hover:bg-kinevir-medium-blue/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePractitioner(practitioner.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {practitioner.description && (
                      <p className="text-sm text-kinevir-dark-blue/80 leading-relaxed">
                        {practitioner.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {practitioners.length === 0 && (
          <div className="text-center py-12 text-kinevir-dark-blue/70">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun praticien enregistré. Ajoutez votre premier praticien pour commencer.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

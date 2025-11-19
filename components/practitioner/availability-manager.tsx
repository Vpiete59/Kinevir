'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Calendar, Clock } from 'lucide-react';
import { RecurringAvailability, AvailabilityException } from '@/lib/types';
import { getDayName } from '@/lib/utils/availability';
import { toast } from 'sonner';

export function AvailabilityManager() {
  const [recurringAvailability, setRecurringAvailability] = useState<RecurringAvailability[]>([
    {
      id: '1',
      practitioner_id: 'prac1',
      day_of_week: 1,
      start_time: '09:00',
      end_time: '12:00',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      practitioner_id: 'prac1',
      day_of_week: 1,
      start_time: '14:00',
      end_time: '18:00',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const [exceptions, setExceptions] = useState<AvailabilityException[]>([
    {
      id: '1',
      practitioner_id: 'prac1',
      exception_date: '2025-11-12',
      exception_type: 'unavailable',
      start_time: null,
      end_time: null,
      reason: 'Congés',
      created_at: new Date().toISOString(),
    },
  ]);

  const [newSlot, setNewSlot] = useState({
    day_of_week: 1,
    start_time: '09:00',
    end_time: '12:00',
  });

  const [newException, setNewException] = useState({
    exception_date: '',
    exception_type: 'unavailable' as 'unavailable' | 'custom_hours',
    start_time: '',
    end_time: '',
    reason: '',
  });

  const handleAddRecurringSlot = () => {
    const newAvailability: RecurringAvailability = {
      id: Math.random().toString(),
      practitioner_id: 'prac1',
      ...newSlot,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setRecurringAvailability([...recurringAvailability, newAvailability]);
    toast.success('Créneau ajouté avec succès');
  };

  const handleDeleteRecurring = (id: string) => {
    setRecurringAvailability(recurringAvailability.filter((slot) => slot.id !== id));
    toast.success('Créneau supprimé');
  };

  const handleAddException = () => {
    if (!newException.exception_date) {
      toast.error('Veuillez sélectionner une date');
      return;
    }

    const exception: AvailabilityException = {
      id: Math.random().toString(),
      practitioner_id: 'prac1',
      ...newException,
      created_at: new Date().toISOString(),
    };
    setExceptions([...exceptions, exception]);
    setNewException({
      exception_date: '',
      exception_type: 'unavailable',
      start_time: '',
      end_time: '',
      reason: '',
    });
    toast.success('Exception ajoutée avec succès');
  };

  const handleDeleteException = (id: string) => {
    setExceptions(exceptions.filter((ex) => ex.id !== id));
    toast.success('Exception supprimée');
  };

  const groupedByDay = recurringAvailability.reduce((acc, slot) => {
    if (!acc[slot.day_of_week]) {
      acc[slot.day_of_week] = [];
    }
    acc[slot.day_of_week].push(slot);
    return acc;
  }, {} as Record<number, RecurringAvailability[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-kinevir-medium-blue flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Créneaux récurrents
          </CardTitle>
          <CardDescription>
            Définissez vos horaires de disponibilité hebdomadaires
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-kinevir-light-gray/20 rounded-lg">
            <div className="space-y-2">
              <Label>Jour</Label>
              <Select
                value={newSlot.day_of_week.toString()}
                onValueChange={(value) => setNewSlot({ ...newSlot, day_of_week: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {getDayName(day)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Début</Label>
              <Select
                value={newSlot.start_time}
                onValueChange={(value) => setNewSlot({ ...newSlot, start_time: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`).map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fin</Label>
              <Select
                value={newSlot.end_time}
                onValueChange={(value) => setNewSlot({ ...newSlot, end_time: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`).map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleAddRecurringSlot}
                className="w-full bg-kinevir-medium-blue hover:bg-kinevir-medium-blue/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 0].map((day) => {
              const slots = groupedByDay[day] || [];
              if (slots.length === 0) return null;

              return (
                <div key={day} className="space-y-2">
                  <h4 className="font-semibold text-kinevir-medium-blue">{getDayName(day)}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 bg-white border border-kinevir-light-gray rounded-lg"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-kinevir-medium-blue" />
                          <span className="font-medium">
                            {slot.start_time} - {slot.end_time}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRecurring(slot.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-kinevir-medium-blue flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Exceptions ponctuelles
          </CardTitle>
          <CardDescription>
            Gérez vos absences ou horaires spéciaux pour des dates précises
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-kinevir-light-gray/20 rounded-lg">
            <div className="space-y-2">
              <Label>Date</Label>
              <input
                type="date"
                value={newException.exception_date}
                onChange={(e) => setNewException({ ...newException, exception_date: e.target.value })}
                className="w-full px-3 py-2 border border-kinevir-light-gray rounded-md"
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={newException.exception_type}
                onValueChange={(value: 'unavailable' | 'custom_hours') =>
                  setNewException({ ...newException, exception_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unavailable">Indisponible</SelectItem>
                  <SelectItem value="custom_hours">Horaires personnalisés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Raison</Label>
              <input
                type="text"
                value={newException.reason}
                onChange={(e) => setNewException({ ...newException, reason: e.target.value })}
                placeholder="Ex: Congés, Formation..."
                className="w-full px-3 py-2 border border-kinevir-light-gray rounded-md"
              />
            </div>

            <div className="md:col-span-2">
              <Button
                onClick={handleAddException}
                className="w-full bg-kinevir-medium-blue hover:bg-kinevir-medium-blue/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une exception
              </Button>
            </div>
          </div>

          {exceptions.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                {exceptions.map((exception) => (
                  <div
                    key={exception.id}
                    className="flex items-center justify-between p-4 bg-white border border-kinevir-light-gray rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={exception.exception_type === 'unavailable' ? 'destructive' : 'secondary'}>
                          {exception.exception_type === 'unavailable' ? 'Indisponible' : 'Horaires modifiés'}
                        </Badge>
                        <span className="font-medium text-kinevir-medium-blue">
                          {new Date(exception.exception_date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {exception.reason && (
                        <p className="text-sm text-kinevir-dark-blue/70">{exception.reason}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteException(exception.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

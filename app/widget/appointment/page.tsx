'use client';

import { useState } from 'react';
import { Practitioner, AppointmentAct } from '@/lib/types';
import { PractitionerSelector } from '@/components/appointments/practitioner-selector';
import { ActSelector } from '@/components/appointments/act-selector';
import { TimeSlotPicker } from '@/components/appointments/time-slot-picker';
import { generateTimeSlots } from '@/lib/utils/availability';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function WidgetAppointmentPage() {
  const [practitioners, setPractitioners] = useState<Practitioner[]>([
    {
      id: '1',
      user_id: null,
      full_name: 'Dr. Sophie Martin',
      specialty: 'Kinésithérapeute spécialisée en rééducation sportive',
      description: 'Plus de 10 ans d\'expérience dans la prise en charge des sportifs de haut niveau.',
      photo_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const [acts, setActs] = useState<AppointmentAct[]>([
    {
      id: '1',
      practitioner_id: '1',
      title: 'Première consultation / Bilan',
      description: 'Évaluation complète avec plan de traitement personnalisé.',
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
      practitioner_id: '1',
      title: 'Séance de rééducation',
      description: 'Séance de physiothérapie classique.',
      duration_minutes: 40,
      price_euros: 50,
      color: '#8ecae6',
      is_first_consultation: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const [selectedPractitioner, setSelectedPractitioner] = useState<string | null>(null);
  const [selectedAct, setSelectedAct] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const filteredActs = selectedPractitioner
    ? acts.filter(act => act.practitioner_id === selectedPractitioner)
    : [];

  const timeSlots = generateTimeSlots('09:00', '18:00', 20);

  const handleBooking = () => {
    if (!selectedPractitioner || !selectedAct || !selectedTime) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    window.parent.postMessage(
      {
        type: 'KINEVIR_APPOINTMENT_SELECTED',
        data: {
          practitioner: practitioners.find(p => p.id === selectedPractitioner),
          act: acts.find(a => a.id === selectedAct),
          date: selectedDate.toISOString(),
          time: selectedTime,
        },
      },
      '*'
    );

    toast.success('Redirection vers la page de confirmation...');
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <Card className="shadow-none border-0">
        <CardHeader>
          <CardTitle className="text-kinevir-medium-blue">Prendre rendez-vous</CardTitle>
          <CardDescription>
            Réservez votre consultation en quelques clics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PractitionerSelector
            practitioners={practitioners}
            selectedId={selectedPractitioner}
            onSelect={setSelectedPractitioner}
          />

          {selectedPractitioner && (
            <>
              <Separator className="bg-kinevir-light-gray" />
              <ActSelector
                acts={filteredActs}
                selectedId={selectedAct}
                onSelect={setSelectedAct}
              />
            </>
          )}

          {selectedPractitioner && selectedAct && (
            <>
              <Separator className="bg-kinevir-light-gray" />
              <TimeSlotPicker
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                timeSlots={timeSlots}
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
              />
            </>
          )}

          {selectedPractitioner && selectedAct && selectedTime && (
            <button
              onClick={handleBooking}
              className="w-full bg-kinevir-medium-blue hover:bg-kinevir-medium-blue/90 text-white py-3 px-4 rounded-md font-medium transition-colors"
            >
              Confirmer le rendez-vous
            </button>
          )}
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}

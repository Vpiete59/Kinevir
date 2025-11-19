'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { Practitioner, AppointmentAct } from '@/lib/types';
import { PractitionerSelector } from '@/components/appointments/practitioner-selector';
import { ActSelector } from '@/components/appointments/act-selector';
import { TimeSlotPicker } from '@/components/appointments/time-slot-picker';
import { EmergencyBooking } from '@/components/appointments/emergency-booking';
import { BookingConfirmation } from '@/components/appointments/booking-confirmation';
import { generateTimeSlots } from '@/lib/utils/availability';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AppointmentPage() {
  const { user } = useAuth();
  const router = useRouter();

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

  const [acts, setActs] = useState<AppointmentAct[]>([
    {
      id: '1',
      practitioner_id: '1',
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
      practitioner_id: '1',
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

  const [selectedPractitioner, setSelectedPractitioner] = useState<string | null>(null);
  const [selectedAct, setSelectedAct] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);

  const filteredActs = selectedPractitioner
    ? acts.filter(act => act.practitioner_id === selectedPractitioner)
    : [];

  const timeSlots = generateTimeSlots('09:00', '18:00', 20);

  const handleEmergencyBooking = () => {
    if (!user) {
      toast.error('Vous devez être connecté pour prendre rendez-vous');
      router.push('/login');
      return;
    }
    setIsEmergency(true);
    setShowConfirmation(true);
  };

  const handleStandardBooking = () => {
    if (!user) {
      toast.error('Vous devez être connecté pour prendre rendez-vous');
      router.push('/login');
      return;
    }

    if (!selectedPractitioner || !selectedAct || !selectedTime) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsEmergency(false);
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    toast.success('Rendez-vous confirmé !');
    setShowConfirmation(false);
    router.push('/account');
  };

  const selectedPractitionerData = practitioners.find(p => p.id === selectedPractitioner);
  const selectedActData = acts.find(a => a.id === selectedAct);

  if (showConfirmation && selectedPractitionerData && selectedActData && selectedTime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-kinevir-light-gray/10 to-kinevir-medium-blue/5 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <BookingConfirmation
            practitioner={selectedPractitionerData}
            act={selectedActData}
            date={selectedDate}
            time={selectedTime}
            isEmergency={isEmergency}
            emergencySurcharge={isEmergency ? 10 : 0}
            onConfirm={handleConfirmBooking}
            onCancel={() => setShowConfirmation(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-kinevir-light-gray/10 to-kinevir-medium-blue/5 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-kinevir-medium-blue mb-2">
            Prendre rendez-vous
          </h1>
          <p className="text-kinevir-dark-blue/70">
            Réservez une consultation avec un de nos praticiens qualifiés
          </p>
        </div>

        <Tabs defaultValue="standard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="standard" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Rendez-vous standard
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Urgence
            </TabsTrigger>
          </TabsList>

          <TabsContent value="standard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-kinevir-medium-blue">Réserver un créneau</CardTitle>
                <CardDescription>
                  Choisissez votre praticien, le type de consultation et un créneau horaire
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
                    onClick={handleStandardBooking}
                    className="w-full bg-kinevir-medium-blue hover:bg-kinevir-medium-blue/90 text-white py-3 px-4 rounded-md font-medium transition-colors"
                  >
                    Confirmer le rendez-vous
                  </button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency">
            <EmergencyBooking onEmergencyBook={handleEmergencyBooking} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, FileText, Users, Target } from 'lucide-react';
import { WeeklyCalendar } from '@/components/practitioner/weekly-calendar';
import { AvailabilityManager } from '@/components/practitioner/availability-manager';
import { ActsManager } from '@/components/practitioner/acts-manager';
import { PractitionersManager } from '@/components/practitioner/practitioners-manager';
import { JointsManager } from '@/components/practitioner/joints-manager';

export default function PractitionerDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-kinevir-light-gray/10 to-kinevir-medium-blue/5 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-kinevir-medium-blue mb-2">
            Espace Praticien
          </h1>
          <p className="text-kinevir-dark-blue/70">
            Gérez vos rendez-vous, disponibilités et consultations
          </p>
        </div>

        <Tabs defaultValue="planning" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-4xl">
            <TabsTrigger value="planning" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Mon planning</span>
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Disponibilités</span>
            </TabsTrigger>
            <TabsTrigger value="acts" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Mes actes</span>
            </TabsTrigger>
            <TabsTrigger value="practitioners" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Praticiens</span>
            </TabsTrigger>
            <TabsTrigger value="joints" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Articulations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="planning">
            <WeeklyCalendar />
          </TabsContent>

          <TabsContent value="availability">
            <AvailabilityManager />
          </TabsContent>

          <TabsContent value="acts">
            <ActsManager />
          </TabsContent>

          <TabsContent value="practitioners">
            <PractitionersManager />
          </TabsContent>

          <TabsContent value="joints">
            <JointsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

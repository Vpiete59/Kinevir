'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, FileText, Users, Stethoscope } from 'lucide-react';
import { WeeklyCalendar } from '@/components/practitioner/weekly-calendar';
import { AvailabilityManager } from '@/components/practitioner/availability-manager';
import { ActsManager } from '@/components/practitioner/acts-manager';
import { MyPatientsManager } from '@/components/practitioner/my-patients-manager';

export default function PractitionerDashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (profile && profile.role !== 'practitioner' && profile.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || (profile?.role !== 'practitioner' && profile?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Stethoscope className="w-16 h-16 text-[#4A9BA5] mx-auto mb-4" />
          <p className="text-gray-600">Accès réservé aux praticiens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#4A9BA5]/5 to-[#4A9BA5]/10 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#4A9BA5]/10 rounded-lg">
              <Stethoscope className="w-6 h-6 text-[#4A9BA5]" />
            </div>
            <h1 className="text-3xl font-bold text-[#4A9BA5]">
              Espace Praticien
            </h1>
          </div>
          <p className="text-gray-600 ml-14">
            Gérez vos rendez-vous, disponibilités et patients
          </p>
        </div>

        <Tabs defaultValue="planning" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="planning" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Planning</span>
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Disponibilités</span>
            </TabsTrigger>
            <TabsTrigger value="acts" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Mes actes</span>
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Mes patients</span>
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

          <TabsContent value="patients">
            <MyPatientsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

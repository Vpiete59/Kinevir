'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Target, UserCog, Shield } from 'lucide-react';
import { PractitionersManager } from '@/components/practitioner/practitioners-manager';
import { JointsManager } from '@/components/practitioner/joints-manager';
import { AccountsManager } from '@/components/admin/accounts-manager';

export default function AdminDashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (profile && profile.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Accès réservé aux administrateurs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/20 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-orange-600">
              Espace Administration
            </h1>
          </div>
          <p className="text-gray-600 ml-14">
            Gérez les comptes utilisateurs, les praticiens et les articulations
          </p>
        </div>

        <Tabs defaultValue="accounts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-xl">
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <UserCog className="w-4 h-4" />
              <span className="hidden sm:inline">Comptes</span>
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

          <TabsContent value="accounts">
            <AccountsManager />
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

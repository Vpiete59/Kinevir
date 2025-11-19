import { PageLayout } from '@/components/page-layout';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';

export default function AccountPage() {
  return (
    <PageLayout
      title="Mon compte"
      description="Gérez votre profil et vos informations personnelles"
    >
      <Card className="p-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="w-20 h-20 rounded-full bg-kinevir-light-gray/50 flex items-center justify-center">
            <User className="w-10 h-10 text-kinevir-dark-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-kinevir-medium-blue mb-2">
              Gestion du compte
            </h2>
            <p className="text-kinevir-dark-blue/70">
              Gérez vos informations personnelles, préférences et historique.
            </p>
          </div>
        </div>
      </Card>
    </PageLayout>
  );
}

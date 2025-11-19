import { PageLayout } from '@/components/page-layout';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function ProgramPage() {
  return (
    <PageLayout
      title="Mon programme"
      description="Accédez à votre programme de physiothérapie personnalisé"
    >
      <Card className="p-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="w-20 h-20 rounded-full bg-kinevir-light-blue/10 flex items-center justify-center">
            <FileText className="w-10 h-10 text-kinevir-light-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-kinevir-medium-blue mb-2">
              Programme personnalisé
            </h2>
            <p className="text-kinevir-dark-blue/70">
              Votre programme d'exercices et de rééducation sera disponible ici.
            </p>
          </div>
        </div>
      </Card>
    </PageLayout>
  );
}

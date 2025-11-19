import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Activity, Stethoscope, Dumbbell, Shield } from 'lucide-react';

interface PathologyDetailProps {
  pathology: {
    name: string;
    short_description: string | null;
    detailed_description: string | null;
    symptoms: any;
    causes: any;
    treatments: any;
    exercises: any;
    prevention_tips: any;
    severity: string;
    body_regions?: {
      display_name: string;
    } | null;
  };
}

const severityConfig = {
  mild: { label: 'Légère', color: 'bg-green-100 text-green-800 border-green-300' },
  moderate: { label: 'Modérée', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  severe: { label: 'Sévère', color: 'bg-red-100 text-red-800 border-red-300' },
};

export function PathologyDetail({ pathology }: PathologyDetailProps) {
  const severity = severityConfig[pathology.severity as keyof typeof severityConfig] || severityConfig.moderate;

  const symptoms = Array.isArray(pathology.symptoms) ? pathology.symptoms : [];
  const causes = Array.isArray(pathology.causes) ? pathology.causes : [];
  const treatments = Array.isArray(pathology.treatments) ? pathology.treatments : [];
  const exercises = Array.isArray(pathology.exercises) ? pathology.exercises : [];
  const preventionTips = Array.isArray(pathology.prevention_tips) ? pathology.prevention_tips : [];

  return (
    <div className="space-y-6">
      <Card className="border-kinevir-light-gray">
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="text-3xl text-kinevir-medium-blue mb-2">
                {pathology.name}
              </CardTitle>
              {pathology.body_regions && (
                <p className="text-kinevir-dark-blue/70">
                  Région: {pathology.body_regions.display_name}
                </p>
              )}
            </div>
            <Badge variant="outline" className={severity.color}>
              {severity.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-kinevir-dark-blue/90">
            {pathology.short_description || pathology.detailed_description}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-kinevir-light-gray/20">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="symptoms">Symptômes</TabsTrigger>
          <TabsTrigger value="causes">Causes</TabsTrigger>
          <TabsTrigger value="treatments">Traitements</TabsTrigger>
          <TabsTrigger value="prevention">Prévention</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          <Card className="border-kinevir-light-gray">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-kinevir-medium-blue">
                <Activity className="w-5 h-5" />
                Description détaillée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-kinevir-dark-blue/90 whitespace-pre-wrap">
                {pathology.detailed_description || pathology.short_description || 'Aucune description détaillée disponible.'}
              </p>
            </CardContent>
          </Card>

          {exercises.length > 0 && (
            <Card className="border-kinevir-light-gray">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-kinevir-medium-blue">
                  <Dumbbell className="w-5 h-5" />
                  Exercices recommandés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {exercises.map((exercise: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-kinevir-light-blue mt-1">•</span>
                      <span className="text-kinevir-dark-blue/90">{exercise}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="symptoms">
          <Card className="border-kinevir-light-gray">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-kinevir-medium-blue">
                <AlertCircle className="w-5 h-5" />
                Symptômes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {symptoms.length > 0 ? (
                <ul className="space-y-2">
                  {symptoms.map((symptom: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-kinevir-orange mt-1">•</span>
                      <span className="text-kinevir-dark-blue/90">{symptom}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-kinevir-dark-blue/70">Aucun symptôme répertorié.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="causes">
          <Card className="border-kinevir-light-gray">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-kinevir-medium-blue">
                <Activity className="w-5 h-5" />
                Causes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {causes.length > 0 ? (
                <ul className="space-y-2">
                  {causes.map((cause: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-kinevir-light-blue mt-1">•</span>
                      <span className="text-kinevir-dark-blue/90">{cause}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-kinevir-dark-blue/70">Aucune cause répertoriée.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatments">
          <Card className="border-kinevir-light-gray">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-kinevir-medium-blue">
                <Stethoscope className="w-5 h-5" />
                Traitements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {treatments.length > 0 ? (
                <ul className="space-y-2">
                  {treatments.map((treatment: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-kinevir-medium-blue mt-1">•</span>
                      <span className="text-kinevir-dark-blue/90">{treatment}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-kinevir-dark-blue/70">Aucun traitement répertorié.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prevention">
          <Card className="border-kinevir-light-gray">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-kinevir-medium-blue">
                <Shield className="w-5 h-5" />
                Conseils de prévention
              </CardTitle>
            </CardHeader>
            <CardContent>
              {preventionTips.length > 0 ? (
                <ul className="space-y-2">
                  {preventionTips.map((tip: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-kinevir-light-blue mt-1">•</span>
                      <span className="text-kinevir-dark-blue/90">{tip}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-kinevir-dark-blue/70">Aucun conseil de prévention répertorié.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

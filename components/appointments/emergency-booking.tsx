'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Clock, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { estimateEmergencyWaitTime } from '@/lib/utils/availability';

interface EmergencyBookingProps {
  onEmergencyBook: () => void;
  isLoading?: boolean;
}

export function EmergencyBooking({ onEmergencyBook, isLoading }: EmergencyBookingProps) {
  const [waitTime] = useState(estimateEmergencyWaitTime());

  return (
    <Card className="border-kinevir-orange/30 bg-gradient-to-br from-kinevir-orange/5 to-kinevir-light-blue/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-kinevir-orange/10 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-kinevir-orange" />
          </div>
          <div>
            <CardTitle className="text-kinevir-medium-blue">Rendez-vous en urgence</CardTitle>
            <CardDescription>Prise en charge rapide pour les cas urgents</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-kinevir-medium-blue" />
          <span className="text-kinevir-dark-blue/70">
            Délai d'attente estimé : <span className="font-semibold text-kinevir-medium-blue">{waitTime}</span>
          </span>
        </div>

        <Alert className="border-kinevir-orange/30 bg-kinevir-orange/5">
          <AlertTriangle className="h-4 w-4 text-kinevir-orange" />
          <AlertDescription className="text-sm text-kinevir-dark-blue/80">
            <strong>Information importante :</strong> Une surfacturation de{' '}
            <span className="font-semibold text-kinevir-orange">10 €</span> sera appliquée
            pour les rendez-vous en urgence.
          </AlertDescription>
        </Alert>

        <div className="bg-white rounded-lg p-4 border border-kinevir-light-gray space-y-2">
          <h4 className="text-sm font-semibold text-kinevir-medium-blue">
            Les rendez-vous d'urgence sont destinés à :
          </h4>
          <ul className="text-sm text-kinevir-dark-blue/70 space-y-1 ml-4 list-disc">
            <li>Douleurs aiguës nécessitant une prise en charge rapide</li>
            <li>Traumatismes récents (moins de 48h)</li>
            <li>Impossibilité d'attendre un créneau standard</li>
          </ul>
        </div>

        <Button
          onClick={onEmergencyBook}
          disabled={isLoading}
          className="w-full bg-kinevir-orange hover:bg-kinevir-orange/90 text-white"
          size="lg"
        >
          <AlertCircle className="w-5 h-5 mr-2" />
          {isLoading ? 'Réservation en cours...' : 'Réserver en urgence'}
        </Button>
      </CardContent>
    </Card>
  );
}

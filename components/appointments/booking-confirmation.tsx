'use client';

import { Practitioner, AppointmentAct } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Euro, User, FileText, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BookingConfirmationProps {
  practitioner: Practitioner;
  act: AppointmentAct;
  date: Date;
  time: string;
  isEmergency?: boolean;
  emergencySurcharge?: number;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BookingConfirmation({
  practitioner,
  act,
  date,
  time,
  isEmergency = false,
  emergencySurcharge = 0,
  onConfirm,
  onCancel,
  isLoading,
}: BookingConfirmationProps) {
  const totalPrice = act.price_euros + emergencySurcharge;

  return (
    <Card className="border-kinevir-medium-blue shadow-lg">
      <CardHeader className="bg-gradient-to-r from-kinevir-medium-blue/10 to-kinevir-light-blue/10">
        <CardTitle className="flex items-center gap-2 text-kinevir-medium-blue">
          <CheckCircle className="w-5 h-5" />
          Confirmation de votre rendez-vous
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-kinevir-light-gray/20 rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarImage src={practitioner.photo_url || undefined} />
              <AvatarFallback className="bg-kinevir-medium-blue text-white">
                {practitioner.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-kinevir-medium-blue" />
                <span className="font-semibold text-kinevir-medium-blue">Praticien</span>
              </div>
              <p className="font-medium">{practitioner.full_name}</p>
              <p className="text-sm text-kinevir-dark-blue/70">{practitioner.specialty}</p>
            </div>
          </div>

          <div className="p-4 bg-kinevir-light-gray/20 rounded-lg space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-kinevir-medium-blue" />
              <span className="font-semibold text-kinevir-medium-blue">Type de consultation</span>
            </div>
            <p className="font-medium">{act.title}</p>
            {act.description && (
              <p className="text-sm text-kinevir-dark-blue/70">{act.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-kinevir-light-gray/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-kinevir-medium-blue" />
                <span className="text-sm font-semibold text-kinevir-medium-blue">Date</span>
              </div>
              <p className="font-medium capitalize">
                {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
              </p>
            </div>

            <div className="p-4 bg-kinevir-light-gray/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-kinevir-medium-blue" />
                <span className="text-sm font-semibold text-kinevir-medium-blue">Heure</span>
              </div>
              <p className="font-medium">{time}</p>
              <p className="text-xs text-kinevir-dark-blue/70">{act.duration_minutes} minutes</p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-kinevir-medium-blue/10 to-kinevir-light-blue/10 rounded-lg border-2 border-kinevir-medium-blue/20">
            <div className="flex items-center gap-2 mb-3">
              <Euro className="w-4 h-4 text-kinevir-medium-blue" />
              <span className="text-sm font-semibold text-kinevir-medium-blue">Tarif</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-kinevir-dark-blue/70">Consultation</span>
                <span className="font-medium">{act.price_euros.toFixed(2)} €</span>
              </div>
              {isEmergency && emergencySurcharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-kinevir-orange">Urgence</span>
                  <span className="font-medium text-kinevir-orange">
                    +{emergencySurcharge.toFixed(2)} €
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-kinevir-light-gray text-lg font-bold text-kinevir-medium-blue">
                <span>Total</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 border-kinevir-light-gray"
          >
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-kinevir-medium-blue hover:bg-kinevir-medium-blue/90 text-white"
          >
            {isLoading ? 'Confirmation...' : 'Confirmer le rendez-vous'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

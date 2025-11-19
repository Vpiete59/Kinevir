'use client';

import { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { TimeSlot } from '@/lib/utils/availability';

interface TimeSlotPickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  timeSlots: TimeSlot[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export function TimeSlotPicker({
  selectedDate,
  onDateChange,
  timeSlots,
  selectedTime,
  onTimeSelect,
}: TimeSlotPickerProps) {
  const goToPreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const goToNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-kinevir-medium-blue">
          Choisir un créneau
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousDay}
            className="h-8 w-8 border-kinevir-light-gray"
            aria-label="Jour précédent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="px-4 py-2 bg-kinevir-light-gray/30 rounded-md flex items-center gap-2 min-w-[200px] justify-center">
            <CalendarIcon className="w-4 h-4 text-kinevir-medium-blue" />
            <span className="text-sm font-medium text-kinevir-medium-blue capitalize">
              {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextDay}
            className="h-8 w-8 border-kinevir-light-gray"
            aria-label="Jour suivant"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {timeSlots.length === 0 ? (
        <Card className="p-8 text-center border-kinevir-light-gray">
          <p className="text-kinevir-dark-blue/70">
            Aucun créneau disponible pour cette date.
          </p>
          <p className="text-sm text-kinevir-dark-blue/50 mt-2">
            Essayez un autre jour.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {timeSlots.map((slot) => (
            <Button
              key={slot.time}
              variant={selectedTime === slot.time ? 'default' : 'outline'}
              size="sm"
              disabled={!slot.available}
              onClick={() => onTimeSelect(slot.time)}
              className={
                selectedTime === slot.time
                  ? 'bg-kinevir-medium-blue hover:bg-kinevir-medium-blue/90 text-white'
                  : slot.available
                  ? 'border-kinevir-light-gray hover:bg-kinevir-medium-blue/10 hover:border-kinevir-medium-blue'
                  : 'opacity-50 cursor-not-allowed'
              }
            >
              {slot.time}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

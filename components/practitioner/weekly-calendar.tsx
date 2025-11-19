'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Appointment } from '@/lib/types';

const mockAppointments: Appointment[] = [
  {
    id: '1',
    user_id: 'user1',
    practitioner_id: 'prac1',
    act_id: 'act1',
    appointment_date: new Date(2025, 9, 29, 9, 0).toISOString(),
    duration_minutes: 60,
    status: 'confirmed',
    appointment_type: 'standard',
    is_emergency: false,
    emergency_surcharge: 0,
    total_price: 70,
    notes: null,
    cancellation_reason: null,
    reminder_sent: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'user2',
    practitioner_id: 'prac1',
    act_id: 'act2',
    appointment_date: new Date(2025, 9, 29, 14, 0).toISOString(),
    duration_minutes: 40,
    status: 'pending',
    appointment_type: 'standard',
    is_emergency: false,
    emergency_surcharge: 0,
    total_price: 50,
    notes: null,
    cancellation_reason: null,
    reminder_sent: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function WeeklyCalendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 11 }, (_, i) => i + 8);

  const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const goToToday = () => setCurrentWeek(new Date());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-kinevir-medium-blue/20 border-kinevir-medium-blue text-kinevir-medium-blue';
      case 'pending':
        return 'bg-kinevir-light-blue/20 border-kinevir-light-blue text-kinevir-orange';
      case 'cancelled':
        return 'bg-gray-200 border-gray-400 text-gray-600';
      case 'completed':
        return 'bg-green-100 border-green-600 text-green-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  const getAppointmentsForDay = (day: Date) => {
    return mockAppointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      return aptDate.toDateString() === day.toDateString();
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-kinevir-medium-blue">Mon planning hebdomadaire</CardTitle>
            <CardDescription>
              {format(weekStart, 'd MMMM', { locale: fr })} - {format(weekEnd, 'd MMMM yyyy', { locale: fr })}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousWeek}
              className="border-kinevir-light-gray"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="border-kinevir-light-gray"
            >
              Aujourd'hui
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextWeek}
              className="border-kinevir-light-gray"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 border border-kinevir-light-gray rounded-lg overflow-hidden">
              <div className="bg-kinevir-light-gray/20 p-2 border-r border-kinevir-light-gray">
                <div className="text-sm font-medium text-kinevir-medium-blue text-center">Heure</div>
              </div>
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  className={`p-2 border-r border-kinevir-light-gray ${
                    day.toDateString() === new Date().toDateString()
                      ? 'bg-kinevir-medium-blue/10'
                      : 'bg-kinevir-light-gray/20'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xs text-kinevir-dark-blue/70 capitalize">
                      {format(day, 'EEE', { locale: fr })}
                    </div>
                    <div className="text-sm font-semibold text-kinevir-medium-blue">
                      {format(day, 'd MMM', { locale: fr })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-x border-b border-kinevir-light-gray rounded-b-lg">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-t border-kinevir-light-gray/50">
                  <div className="p-2 text-xs text-kinevir-dark-blue/70 text-center border-r border-kinevir-light-gray/50">
                    {hour}:00
                  </div>
                  {days.map((day) => {
                    const dayAppointments = getAppointmentsForDay(day).filter(apt => {
                      const aptHour = new Date(apt.appointment_date).getHours();
                      return aptHour === hour;
                    });

                    return (
                      <div
                        key={`${day.toISOString()}-${hour}`}
                        className="p-1 border-r border-kinevir-light-gray/50 min-h-[60px]"
                      >
                        {dayAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            className={`text-xs p-2 rounded border mb-1 cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(
                              apt.status
                            )}`}
                          >
                            <div className="font-medium truncate">
                              {format(new Date(apt.appointment_date), 'HH:mm')}
                            </div>
                            <div className="text-xs opacity-75 truncate">Patient #{apt.user_id.slice(0, 6)}</div>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {apt.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-kinevir-medium-blue/20 border border-kinevir-medium-blue"></div>
            <span className="text-kinevir-dark-blue/70">Confirmé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-kinevir-light-blue/20 border border-kinevir-light-blue"></div>
            <span className="text-kinevir-dark-blue/70">En attente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 border border-gray-400"></div>
            <span className="text-kinevir-dark-blue/70">Annulé</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

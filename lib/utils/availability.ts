import { RecurringAvailability, AvailabilityException, Appointment } from '@/lib/types';
import { format, addDays, startOfWeek, endOfWeek, parse, isWithinInterval, isSameDay, addMinutes, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  slotDuration: number = 20,
  existingAppointments: Appointment[] = []
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startDate = new Date();
  startDate.setHours(startHour, startMinute, 0, 0);

  const endDate = new Date();
  endDate.setHours(endHour, endMinute, 0, 0);

  let currentSlot = new Date(startDate);

  while (currentSlot < endDate) {
    const timeString = format(currentSlot, 'HH:mm');

    const isBooked = existingAppointments.some(apt => {
      const aptTime = format(parseISO(apt.appointment_date), 'HH:mm');
      return aptTime === timeString;
    });

    slots.push({
      time: timeString,
      available: !isBooked,
      appointmentId: isBooked
        ? existingAppointments.find(apt => format(parseISO(apt.appointment_date), 'HH:mm') === timeString)?.id
        : undefined,
    });

    currentSlot = addMinutes(currentSlot, slotDuration);
  }

  return slots;
}

export function getAvailabilityForDate(
  date: Date,
  recurringAvailability: RecurringAvailability[],
  exceptions: AvailabilityException[]
): { available: boolean; slots?: { start: string; end: string }[] } {
  const dayOfWeek = date.getDay();
  const dateString = format(date, 'yyyy-MM-dd');

  const exception = exceptions.find(ex => ex.exception_date === dateString);

  if (exception) {
    if (exception.exception_type === 'unavailable') {
      return { available: false };
    }

    if (exception.exception_type === 'custom_hours' && exception.start_time && exception.end_time) {
      return {
        available: true,
        slots: [{ start: exception.start_time, end: exception.end_time }],
      };
    }
  }

  const dayAvailability = recurringAvailability.filter(
    av => av.day_of_week === dayOfWeek && av.is_active
  );

  if (dayAvailability.length === 0) {
    return { available: false };
  }

  return {
    available: true,
    slots: dayAvailability.map(av => ({
      start: av.start_time,
      end: av.end_time,
    })),
  };
}

export function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(startDate, i));
  }
  return days;
}

export function formatDateForDisplay(date: Date): string {
  return format(date, 'EEEE d MMMM', { locale: fr });
}

export function getDayName(dayOfWeek: number): string {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[dayOfWeek];
}

export function estimateEmergencyWaitTime(): string {
  const randomMinutes = Math.floor(Math.random() * 30) + 15;
  return `${randomMinutes} minutes`;
}

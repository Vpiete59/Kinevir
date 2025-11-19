'use client';

import { Practitioner } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PractitionerSelectorProps {
  practitioners: Practitioner[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PractitionerSelector({ practitioners, selectedId, onSelect }: PractitionerSelectorProps) {
  const selectedPractitioner = practitioners.find(p => p.id === selectedId);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-kinevir-medium-blue mb-2 block">
          Choisir un praticien
        </label>
        <Select value={selectedId || ''} onValueChange={onSelect}>
          <SelectTrigger className="w-full border-kinevir-light-gray">
            <SelectValue placeholder="Sélectionnez un thérapeute" />
          </SelectTrigger>
          <SelectContent>
            {practitioners.map((practitioner) => (
              <SelectItem key={practitioner.id} value={practitioner.id}>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={practitioner.photo_url || undefined} />
                    <AvatarFallback className="bg-kinevir-medium-blue/10 text-kinevir-medium-blue text-xs">
                      {practitioner.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{practitioner.full_name}</div>
                    <div className="text-xs text-muted-foreground">{practitioner.specialty}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedPractitioner && (
        <div className="rounded-lg border border-kinevir-light-gray bg-kinevir-light-gray/20 p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={selectedPractitioner.photo_url || undefined} />
              <AvatarFallback className="bg-kinevir-medium-blue text-white text-lg">
                {selectedPractitioner.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-kinevir-medium-blue mb-1">
                {selectedPractitioner.full_name}
              </h3>
              <p className="text-sm text-kinevir-dark-blue/70 mb-2">
                {selectedPractitioner.specialty}
              </p>
              {selectedPractitioner.description && (
                <p className="text-sm text-kinevir-dark-blue/80 leading-relaxed">
                  {selectedPractitioner.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

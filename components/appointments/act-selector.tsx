'use client';

import { AppointmentAct } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Euro } from 'lucide-react';

interface ActSelectorProps {
  acts: AppointmentAct[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ActSelector({ acts, selectedId, onSelect }: ActSelectorProps) {
  const selectedAct = acts.find(a => a.id === selectedId);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-kinevir-medium-blue mb-2 block">
          Type de consultation
        </label>
        <Select value={selectedId || ''} onValueChange={onSelect}>
          <SelectTrigger className="w-full border-kinevir-light-gray">
            <SelectValue placeholder="Sélectionnez le type de consultation" />
          </SelectTrigger>
          <SelectContent>
            {acts.map((act) => (
              <SelectItem key={act.id} value={act.id}>
                <div className="flex items-center justify-between gap-4 w-full">
                  <div>
                    <div className="font-medium">{act.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {act.duration_minutes} min • {act.price_euros} €
                    </div>
                  </div>
                  {act.is_first_consultation && (
                    <Badge variant="secondary" className="text-xs">1ère consultation</Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedAct && (
        <div className="rounded-lg border border-kinevir-light-gray bg-kinevir-light-gray/20 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-kinevir-medium-blue mb-1">
                {selectedAct.title}
              </h3>
              {selectedAct.is_first_consultation && (
                <Badge variant="secondary" className="text-xs mb-2">
                  Première consultation / Bilan
                </Badge>
              )}
            </div>
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: selectedAct.color }}
              aria-label={`Couleur: ${selectedAct.color}`}
            />
          </div>

          {selectedAct.description && (
            <p className="text-sm text-kinevir-dark-blue/80 leading-relaxed">
              {selectedAct.description}
            </p>
          )}

          <div className="flex items-center gap-4 pt-2 border-t border-kinevir-light-gray">
            <div className="flex items-center gap-2 text-sm text-kinevir-dark-blue/70">
              <Clock className="w-4 h-4" />
              <span>{selectedAct.duration_minutes} minutes</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-kinevir-medium-blue">
              <Euro className="w-4 h-4" />
              <span>{selectedAct.price_euros.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

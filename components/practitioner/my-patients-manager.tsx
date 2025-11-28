'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Search, 
  Users, 
  User,
  Calendar,
  Mail,
  Phone,
  FileText,
  Clock,
  Eye,
  Save,
  ExternalLink,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Patient {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  last_visit?: string | null;
  appointments_count?: number;
  last_pathology?: string | null;
  practitioner_notes?: string | null;
  top_pages?: string[];
}

interface Appointment {
  id: string;
  date: string;
  status: string;
  act_name?: string;
  notes?: string;
}

export function MyPatientsManager() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadPatients();
    }
  }, [user]);

  useEffect(() => {
    filterPatients();
  }, [searchQuery, patients]);

  const loadPatients = async () => {
    try {
      const supabase = createClient()
      // Récupérer les patients qui ont pris RDV avec ce praticien
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          patient_id,
          date,
          status,
          created_at,
          profiles!appointments_patient_id_fkey (
            id,
            email,
            first_name,
            last_name,
            phone,
            created_at
          )
        `)
        .eq('practitioner_id', user?.id)
        .order('date', { ascending: false });

      if (appointmentsError) throw appointmentsError;

      // Grouper par patient et compter les RDV
      const patientsMap = new Map<string, Patient>();
      
      appointmentsData?.forEach((apt: any) => {
        if (apt.profiles) {
          const patientId = apt.profiles.id;
          const existing = patientsMap.get(patientId);
          
          if (existing) {
            existing.appointments_count = (existing.appointments_count || 0) + 1;
            if (!existing.last_visit || new Date(apt.date) > new Date(existing.last_visit)) {
              existing.last_visit = apt.date;
            }
          } else {
            patientsMap.set(patientId, {
              id: apt.profiles.id,
              email: apt.profiles.email,
              first_name: apt.profiles.first_name,
              last_name: apt.profiles.last_name,
              phone: apt.profiles.phone,
              created_at: apt.profiles.created_at,
              last_visit: apt.date,
              appointments_count: 1,
            });
          }
        }
      });

      // Récupérer les notes praticien pour chaque patient
      const patientIds = Array.from(patientsMap.keys());
      if (patientIds.length > 0) {
        const { data: notesData } = await supabase
          .from('practitioner_patient_notes')
          .select('patient_id, notes')
          .eq('practitioner_id', user?.id)
          .in('patient_id', patientIds);

        notesData?.forEach((note: any) => {
          const patient = patientsMap.get(note.patient_id);
          if (patient) {
            patient.practitioner_notes = note.notes;
          }
        });
      }

      setPatients(Array.from(patientsMap.values()));
    } catch (error) {
      console.error('Erreur chargement patients:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger vos patients',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    if (!searchQuery) {
      setFilteredPatients(patients);
      return;
    }

    const query = searchQuery.toLowerCase();
    setFilteredPatients(patients.filter(p => 
      p.email?.toLowerCase().includes(query) ||
      p.first_name?.toLowerCase().includes(query) ||
      p.last_name?.toLowerCase().includes(query) ||
      p.phone?.includes(query)
    ));
  };

  const openPatientDetails = async (patient: Patient) => {
    setSelectedPatient(patient);
    setNotes(patient.practitioner_notes || '');
    setDetailsOpen(true);

    // Charger les RDV de ce patient
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          date,
          status,
          notes,
          acts (name)
        `)
        .eq('patient_id', patient.id)
        .eq('practitioner_id', user?.id)
        .order('date', { ascending: false })
        .limit(10);

      if (!error && data) {
        setPatientAppointments(data.map((apt: any) => ({
          id: apt.id,
          date: apt.date,
          status: apt.status,
          act_name: apt.acts?.name,
          notes: apt.notes,
        })));
      }
    } catch (error) {
      console.error('Erreur chargement RDV patient:', error);
    }
  };

  const saveNotes = async () => {
    if (!selectedPatient || !user) return;

    setSavingNotes(true);
    try {
      const supabase = createClient()
      // Upsert les notes
      const { error } = await supabase
        .from('practitioner_patient_notes')
        .upsert({
          practitioner_id: user.id,
          patient_id: selectedPatient.id,
          notes: notes,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'practitioner_id,patient_id'
        });

      if (error) throw error;

      // Mettre à jour localement
      setPatients(patients.map(p => 
        p.id === selectedPatient.id ? { ...p, practitioner_notes: notes } : p
      ));

      toast({
        title: 'Notes sauvegardées',
        description: 'Vos notes ont été enregistrées',
      });
    } catch (error) {
      console.error('Erreur sauvegarde notes:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les notes',
        variant: 'destructive',
      });
    } finally {
      setSavingNotes(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-700">Confirmé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">En attente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700">Annulé</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700">Terminé</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de vos patients...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#4A9BA5]/10 rounded-lg">
                <Users className="w-5 h-5 text-[#4A9BA5]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                <p className="text-xs text-gray-500">Patients suivis</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {patients.reduce((acc, p) => acc + (p.appointments_count || 0), 0)}
                </p>
                <p className="text-xs text-gray-500">RDV total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {patients.filter(p => p.practitioner_notes).length}
                </p>
                <p className="text-xs text-gray-500">Avec notes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des patients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#4A9BA5]" />
            Mes patients
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Recherche */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Liste */}
          <div className="space-y-3">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {patients.length === 0 
                  ? "Vous n'avez pas encore de patients"
                  : "Aucun patient trouvé"
                }
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-[#4A9BA5]" />
                      <span className="font-medium text-gray-900">
                        {patient.first_name || patient.last_name 
                          ? `${patient.first_name || ''} ${patient.last_name || ''}`.trim()
                          : 'Patient sans nom'}
                      </span>
                      {patient.practitioner_notes && (
                        <Badge className="bg-purple-100 text-purple-700 text-xs">
                          <FileText className="w-3 h-3 mr-1" />
                          Notes
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {patient.email}
                      </span>
                      {patient.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {patient.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {patient.appointments_count} RDV
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Dernier : {formatDate(patient.last_visit)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPatientDetails(patient)}
                      className="text-[#4A9BA5] border-[#4A9BA5]/30 hover:bg-[#4A9BA5]/5"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Détails
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('https://wibbi.com/login', '_blank')}
                      className="text-green-600 border-green-300 hover:bg-green-50"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Wibbi
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog détails patient */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#4A9BA5]" />
              {selectedPatient?.first_name} {selectedPatient?.last_name}
            </DialogTitle>
            <DialogDescription>
              {selectedPatient?.email}
              {selectedPatient?.phone && ` • ${selectedPatient.phone}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Notes privées */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                Notes privées (visibles uniquement par vous)
              </h4>
              <Textarea
                placeholder="Ajoutez vos notes sur ce patient..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="mb-2"
              />
              <Button 
                onClick={saveNotes} 
                disabled={savingNotes}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="w-4 h-4 mr-1" />
                {savingNotes ? 'Sauvegarde...' : 'Sauvegarder les notes'}
              </Button>
            </div>

            {/* Historique des RDV */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#4A9BA5]" />
                Historique des rendez-vous
              </h4>
              {patientAppointments.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun rendez-vous</p>
              ) : (
                <div className="space-y-2">
                  {patientAppointments.map((apt) => (
                    <div key={apt.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {formatDate(apt.date)}
                        </span>
                        {getStatusBadge(apt.status)}
                      </div>
                      {apt.act_name && (
                        <p className="text-sm text-gray-600">{apt.act_name}</p>
                      )}
                      {apt.notes && (
                        <p className="text-xs text-gray-500 mt-1 italic">{apt.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lien Wibbi */}
            <div className="pt-4 border-t">
              <Button
                onClick={() => window.open('https://wibbi.com/login', '_blank')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Créer un programme sur Wibbi
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Ouvre Wibbi dans un nouvel onglet pour créer un programme d'exercices personnalisé
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

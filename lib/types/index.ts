export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  created_at: string;
  updated_at: string;
}

export interface BodyRegion {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Pathology {
  id: string;
  region_id: string | null;
  name: string;
  slug: string;
  short_description: string | null;
  detailed_description: string | null;
  symptoms: string[];
  causes: string[];
  treatments: string[];
  exercises: string[];
  prevention_tips: string[];
  severity: 'mild' | 'moderate' | 'severe';
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  body_regions?: BodyRegion | null;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface Practitioner {
  id: string;
  user_id: string | null;
  full_name: string;
  specialty: string;
  description: string | null;
  photo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AppointmentAct {
  id: string;
  practitioner_id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  price_euros: number;
  color: string;
  is_first_consultation: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  practitioner_id: string | null;
  act_id: string | null;
  appointment_date: string;
  duration_minutes: number;
  status: AppointmentStatus;
  appointment_type: 'standard' | 'emergency' | 'teleconsultation';
  is_emergency: boolean;
  emergency_surcharge: number;
  total_price: number;
  notes: string | null;
  cancellation_reason: string | null;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
  practitioner?: Practitioner;
  appointment_act?: AppointmentAct;
}

export interface RecurringAvailability {
  id: string;
  practitioner_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AvailabilityException {
  id: string;
  practitioner_id: string;
  exception_date: string;
  exception_type: 'unavailable' | 'custom_hours';
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
  created_at: string;
}

export interface TeleconsultationRoom {
  id: string;
  appointment_id: string;
  room_id: string;
  jwt_token: string;
  expires_at: string;
  patient_joined_at: string | null;
  practitioner_joined_at: string | null;
  ended_at: string | null;
  created_at: string;
}

export interface Exercise {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructions: string[];
  duration_minutes: number | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  video_url: string | null;
  image_url: string | null;
  equipment_needed: string[];
  target_areas: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface WellnessArticle {
  id: string;
  title: string;
  slug: string;
  category: 'sleep' | 'nutrition' | 'stress' | 'general';
  content: string;
  excerpt: string | null;
  image_url: string | null;
  author: string | null;
  reading_time_minutes: number | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface WidgetConfig {
  moduleType: 'appointments' | 'teleconsultation' | 'exercises' | 'pathologies';
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
  };
  labels?: Record<string, string>;
  showHeader?: boolean;
  showFooter?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

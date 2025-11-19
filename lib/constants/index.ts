export const APPOINTMENT_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show',
} as const;

export const APPOINTMENT_TYPES = {
  STANDARD: 'standard',
  EMERGENCY: 'emergency',
  TELECONSULTATION: 'teleconsultation',
} as const;

export const SEVERITY_LEVELS = {
  MILD: 'mild',
  MODERATE: 'moderate',
  SEVERE: 'severe',
} as const;

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

export const WELLNESS_CATEGORIES = {
  SLEEP: 'sleep',
  NUTRITION: 'nutrition',
  STRESS: 'stress',
  GENERAL: 'general',
} as const;

export const DEFAULT_APPOINTMENT_DURATION = 60;
export const TELECONSULTATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000;

export const KINEVIR_COLORS = {
  teal: '#457484',
  peach: '#f39d61',
  beige: '#f2cdbb',
  orange: '#c44c24',
  brown: '#6d250a',
} as const;

export const MODULE_TYPES = {
  APPOINTMENTS: 'appointments',
  TELECONSULTATION: 'teleconsultation',
  EXERCISES: 'exercises',
  PATHOLOGIES: 'pathologies',
  WELLNESS: 'wellness',
} as const;

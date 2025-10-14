export const CONSULTATION_STATUS_OPTIONS = [
  'new',
  'in_review',
  'contacted',
  'completed',
  'cancelled',
] as const;

export type ConsultationStatusOption = (typeof CONSULTATION_STATUS_OPTIONS)[number];

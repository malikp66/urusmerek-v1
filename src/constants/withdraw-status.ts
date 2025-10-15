export const WITHDRAW_STATUS_OPTIONS = [
  'pending',
  'approved',
  'processing',
  'paid',
  'rejected',
] as const;

export type WithdrawStatusOption = (typeof WITHDRAW_STATUS_OPTIONS)[number];

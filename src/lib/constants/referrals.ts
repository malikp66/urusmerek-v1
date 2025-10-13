export const REFERRAL_STATUSES = ["pending", "approved", "rejected", "paid"] as const;

export type ReferralStatusValue = (typeof REFERRAL_STATUSES)[number];

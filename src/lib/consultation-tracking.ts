import { createHmac, timingSafeEqual } from 'crypto';

import { env } from '@/lib/env';

export const CONSULTATION_TRACKING_COOKIE = 'um_consultations';
export const MAX_TRACKED_CONSULTATIONS = 6;

type TrackingEntry = {
  id: string;
  signature: string;
};

const ENCODE = 'base64url';

function sign(id: string) {
  return createHmac('sha256', env.JWT_SECRET).update(id).digest('hex');
}

function createEntry(id: string): TrackingEntry {
  return {
    id,
    signature: sign(id),
  };
}

function encodeEntries(entries: TrackingEntry[]) {
  const payload = JSON.stringify(entries);
  return Buffer.from(payload, 'utf8').toString(ENCODE);
}

function decodeEntries(cookieValue: string | undefined): TrackingEntry[] {
  if (!cookieValue) return [];

  try {
    const json = Buffer.from(cookieValue, ENCODE).toString('utf8');
    const parsed = JSON.parse(json);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (entry): entry is TrackingEntry =>
          entry &&
          typeof entry === 'object' &&
          typeof entry.id === 'string' &&
          typeof entry.signature === 'string',
      )
      .slice(0, MAX_TRACKED_CONSULTATIONS);
  } catch (error) {
    console.error('Failed to decode consultation tracking cookie', error);
    return [];
  }
}

export function appendConsultationToCookie(
  currentValue: string | undefined,
  newId: string,
) {
  const existingEntries = decodeEntries(currentValue).filter((entry) => entry.id !== newId);
  const updatedEntries = [createEntry(newId), ...existingEntries].slice(
    0,
    MAX_TRACKED_CONSULTATIONS,
  );

  return {
    value: encodeEntries(updatedEntries),
    count: updatedEntries.length,
  };
}

export function extractValidConsultationIds(cookieValue: string | undefined) {
  const entries = decodeEntries(cookieValue);

  return entries
    .filter((entry) => {
      const expected = sign(entry.id);
      const actual = entry.signature;

      if (expected.length !== actual.length) return false;

      try {
        return timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
      } catch {
        return false;
      }
    })
    .map((entry) => entry.id);
}


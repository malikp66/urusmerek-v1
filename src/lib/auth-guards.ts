import 'server-only';

import { getCurrentUser } from './auth';

export async function requireAdmin() {
  const session = await getCurrentUser();
  if (!session || session.role !== 'admin') {
    throw Object.assign(new Error('Unauthorized'), { statusCode: 401 });
  }
  return session;
}

export async function requireMitra() {
  const session = await getCurrentUser();
  if (!session || session.role !== 'mitra') {
    throw Object.assign(new Error('Unauthorized'), { statusCode: 401 });
  }
  return session;
}

export async function requireAnyRole<T extends Array<'admin' | 'mitra'>>(...roles: T) {
  const session = await getCurrentUser();
  if (!session || !roles.includes(session.role)) {
    throw Object.assign(new Error('Unauthorized'), { statusCode: 401 });
  }
  return session;
}

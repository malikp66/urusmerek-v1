import 'server-only';

import { randomBytes, timingSafeEqual } from 'node:crypto';

import { argon2idAsync } from '@noble/hashes/argon2';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

import { env } from './env';

export type UserRole = 'mitra';

const SESSION_COOKIE_NAME = 'session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);
const JWT_ALGORITHM = 'HS256';

const ARGON2_PARAMETERS = {
  t: 2,
  m: 65_536,
  p: 1,
  dkLen: 32,
};

type CookieOptions = {
  name: string;
  value: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  maxAge?: number;
  path?: string;
};

interface ResponseLike {
  cookies: {
    set: (options: CookieOptions) => void;
  };
}

export interface JwtSession {
  sub: string;
  role: UserRole;
  exp: number;
}

export interface SignJwtOptions {
  sub: string;
  role: UserRole;
  expiresInSeconds: number;
}

export async function signJwt({ sub, role, expiresInSeconds }: SignJwtOptions): Promise<string> {
  const jwt = await new SignJWT({ role })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(JWT_SECRET);

  return jwt;
}

export async function verifyJwt(token: string): Promise<JwtSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] });
    const { sub, role, exp } = payload;

    if (typeof sub !== 'string' || typeof role !== 'string' || typeof exp !== 'number') {
      return null;
    }

    if (role !== 'mitra') {
      return null;
    }

    return { sub, role, exp };
  } catch {
    return null;
  }
}

export function setAuthCookie<T extends ResponseLike>(response: T, token: string): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
  });
}

export function clearAuthCookie<T extends ResponseLike>(response: T): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export async function getCurrentUser(req?: Request): Promise<JwtSession | null> {
  const token = req ? extractCookieFromHeader(req.headers.get('cookie')) : await getTokenFromStore();

  if (!token) {
    return null;
  }

  return verifyJwt(token);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derivedKey = await argon2idAsync(password, salt, ARGON2_PARAMETERS);

  const parts = [
    'argon2id',
    ARGON2_PARAMETERS.t.toString(10),
    ARGON2_PARAMETERS.m.toString(10),
    ARGON2_PARAMETERS.p.toString(10),
    Buffer.from(salt).toString('base64'),
    Buffer.from(derivedKey).toString('base64'),
  ];

  return parts.join('$');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const segments = hash.split('$');

  if (segments.length !== 6 || segments[0] !== 'argon2id') {
    return false;
  }

  const [, tStr, mStr, pStr, saltBase64, hashBase64] = segments;

  const t = Number.parseInt(tStr, 10);
  const m = Number.parseInt(mStr, 10);
  const p = Number.parseInt(pStr, 10);

  if (!Number.isFinite(t) || !Number.isFinite(m) || !Number.isFinite(p)) {
    return false;
  }

  const salt = Buffer.from(saltBase64, 'base64');
  const expected = Buffer.from(hashBase64, 'base64');
  const dkLen = expected.length || ARGON2_PARAMETERS.dkLen;

  const derived = await argon2idAsync(password, salt, { t, m, p, dkLen });
  const actual = Buffer.from(derived);

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

function extractCookieFromHeader(header: string | null): string | undefined {
  if (!header) return undefined;

  const entries = header.split(';');

  for (const entry of entries) {
    const [rawName, ...rest] = entry.trim().split('=');

    if (!rawName || rawName !== SESSION_COOKIE_NAME) continue;

    return rest.length ? decodeURIComponent(rest.join('=')) : '';
  }

  return undefined;
}

async function getTokenFromStore(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE_NAME)?.value;
  } catch {
    return undefined;
  }
}

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS };

import 'server-only';

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { env } from '@/lib/env';

export const runtime = 'nodejs';

export async function GET() {
  const version = process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_APP_VERSION ?? 'dev';
  const requestHeaders = headers();
  const region = requestHeaders.get('x-vercel-ip-country') ?? requestHeaders.get('x-region') ?? 'unknown';

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version,
    env: {
      appUrl: env.APP_URL,
      nodeEnv: env.NODE_ENV,
    },
    region,
  });
}

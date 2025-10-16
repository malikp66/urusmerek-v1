import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

import {
  appendConsultationToCookie,
  CONSULTATION_TRACKING_COOKIE,
} from '@/lib/consultation-tracking';
import {
  consultationBelongsToEmail,
  getConsultationIdsForEmail,
  getConsultationsByIds,
} from '@/lib/services/public/consultations-dashboard';

const RequestSchema = z.object({
  email: z.string().email(),
  consultationId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);

  const parsed = RequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Format data tidak valid. Pastikan email dan ID konsultasi sudah benar.',
      },
      { status: 400 },
    );
  }

  const { email, consultationId } = parsed.data;

  const isValid = await consultationBelongsToEmail({ email, consultationId });
  if (!isValid) {
    return NextResponse.json(
      {
        ok: false,
        message:
          'Kami tidak menemukan kombinasi email dan ID konsultasi tersebut. Mohon periksa kembali.',
      },
      { status: 404 },
    );
  }

  const consultationIds = await getConsultationIdsForEmail(email);

  const cookieStore = cookies();
  let cookieValue = cookieStore.get(CONSULTATION_TRACKING_COOKIE)?.value;

  for (const id of consultationIds) {
    cookieValue = appendConsultationToCookie(cookieValue, id).value;
  }

  const dashboardData = await getConsultationsByIds(consultationIds);

  const response = NextResponse.json({
    ok: true,
    data: dashboardData,
    trackedIds: consultationIds,
  });

  if (cookieValue) {
    response.cookies.set({
      name: CONSULTATION_TRACKING_COOKIE,
      value: cookieValue,
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 180, // 6 months
    });
  }

  return response;
}


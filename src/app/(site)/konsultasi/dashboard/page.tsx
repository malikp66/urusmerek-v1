import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import {
  CONSULTATION_TRACKING_COOKIE,
  extractValidConsultationIds,
} from '@/lib/consultation-tracking';
import { getConsultationsByIds } from '@/lib/services/public/consultations-dashboard';

import { ConsultationDashboardClient } from './_components/consultation-dashboard-client';

const PAGE_TITLE = 'Dashboard Konsultasi Urus Merek';
const PAGE_DESCRIPTION =
  'Pantau progres konsultasi merek Anda tanpa perlu login. Lihat status terbaru, catatan konsultan, dan riwayat tindak lanjut dalam satu dashboard yang elegan.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default async function ConsultationDashboardPage() {
  const cookieStore = cookies();
  const trackedCookie = cookieStore.get(CONSULTATION_TRACKING_COOKIE)?.value;
  const trackedIds = extractValidConsultationIds(trackedCookie);

  const dashboardData = await getConsultationsByIds(trackedIds);

  return (
    <ConsultationDashboardClient
      initialData={dashboardData}
      trackedIds={trackedIds}
      hasTrackingCookie={Boolean(trackedCookie)}
    />
  );
}


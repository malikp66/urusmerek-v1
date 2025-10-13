import { Metadata } from 'next';

import { requireAdmin } from '@/lib/auth-guards';
import { getAdminDashboardStats } from '@/lib/services/admin/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getLocaleFromRequest, getTranslations } from '@/lib/i18n/server';

export const metadata: Metadata = {
  title: 'Dashboard Admin',
};

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getAdminDashboardStats();
  const locale = await getLocaleFromRequest();
  const intlLocale = locale === 'en' ? 'en-US' : 'id-ID';
  const t = await getTranslations('panels.admin.dashboard', locale);
  const cards = t<{
    totalPartners: string;
    activeLinks: string;
    pendingConsultations: string;
    pendingWithdraw: string;
  }>('cards');
  const commission = t<{
    title: string;
    approvedLabel: string;
    approvedCaption: string;
    paidLabel: string;
    paidCaption: string;
  }>('commission');
  const todoTitle = t('todo.title');
  const todoItems = t<string[]>('todo.items');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{cards.totalPartners}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.totalPartners.toLocaleString(intlLocale)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{cards.activeLinks}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.activeLinks.toLocaleString(intlLocale)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{cards.pendingConsultations}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {stats.pendingConsultations.toLocaleString(intlLocale)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{cards.pendingWithdraw}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {stats.pendingWithdrawRequests.toLocaleString(intlLocale)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-base font-semibold">{commission.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{commission.approvedLabel}</p>
                <p className="text-xs text-muted-foreground">{commission.approvedCaption}</p>
              </div>
              <p className="text-right text-xl font-semibold">
                Rp {stats.commissionApproved.toLocaleString(intlLocale)}
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{commission.paidLabel}</p>
                <p className="text-xs text-muted-foreground">{commission.paidCaption}</p>
              </div>
              <p className="text-right text-xl font-semibold">
                Rp {stats.commissionPaid.toLocaleString(intlLocale)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-base font-semibold">{todoTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="space-y-2 list-disc pl-4">
              {todoItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

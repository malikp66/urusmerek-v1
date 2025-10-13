import { requireAdmin } from '@/lib/auth-guards';
import { getDefaultCommissionSetting } from '@/lib/services/admin/commission';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLocaleFromRequest, getTranslations } from '@/lib/i18n/server';
import { DefaultCommissionForm } from './_components/DefaultCommissionForm';

export default async function AdminCommissionSettingsPage() {
  await requireAdmin();
  const setting = await getDefaultCommissionSetting();
  const locale = await getLocaleFromRequest();
  const t = await getTranslations('panels.admin.commissionSettings', locale);
  const notes = t<string[]>('notes');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">{t('cardTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <DefaultCommissionForm defaultRate={setting?.defaultRate ?? 0.1} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">{t('notesTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ul className="list-disc space-y-2 pl-4">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

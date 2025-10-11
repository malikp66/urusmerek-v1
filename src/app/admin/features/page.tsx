import { requireAdmin } from '@/lib/auth-guards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLocaleFromRequest, getTranslations } from '@/lib/i18n/server';

export default async function AdminFeaturesPlaceholderPage() {
  await requireAdmin();
  const locale = getLocaleFromRequest();
  const t = getTranslations('panels.admin.features', locale);
  const items = t<string[]>('items');

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
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ul className="list-disc space-y-2 pl-4">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

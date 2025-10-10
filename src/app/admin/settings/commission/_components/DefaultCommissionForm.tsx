'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/lib/i18n/context';

type Props = {
  defaultRate: number;
};

export function DefaultCommissionForm({ defaultRate }: Props) {
  const t = useTranslations('panels.admin.forms.defaultCommission');
  const [percent, setPercent] = useState(() => Math.round(defaultRate * 1000) / 10);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const numeric = Number(percent);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      toast.error(t('invalid'));
      return;
    }

    startTransition(async () => {
      const response = await fetch('/api/admin/settings/commission', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ defaultRate: numeric / 100 }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        toast.error(data?.message ?? t('error'));
        return;
      }

      toast.success(t('success'));
      router.refresh();
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="defaultRate">{t('label')}</Label>
        <Input
          id="defaultRate"
          type="number"
          min={0}
          step={0.1}
          value={percent}
          onChange={(event) => setPercent(Number(event.target.value))}
          disabled={isPending}
          className="max-w-xs"
        />
        <p className="text-xs text-muted-foreground">
          {t('help')}
        </p>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? t('saving') : t('save')}
      </Button>
    </form>
  );
}

'use client';

import { useTransition } from 'react';

import { createAffiliateLink } from '@/app/mitra/affiliates/actions';
import { useGlobalAlert } from '@/components/global-alert/GlobalAlertProvider';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/i18n/context';

export function CreateLinkDialog() {
  const t = useTranslations('panels.partner.createLink');
  const { showAlert } = useGlobalAlert();
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      try {
        const result = await createAffiliateLink();
        showAlert({
          tone: 'success',
          title: t('success').replace('{code}', result.code),
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : undefined;
        showAlert({
          tone: 'error',
          title: t('error'),
          description: message && message !== t('error') ? message : undefined,
        });
        console.error(error);
      }
    });
  };

  return (
    <Button variant="outline" onClick={handleCreate} disabled={isPending}>
      {isPending ? t('submitting') : t('trigger')}
    </Button>
  );
}

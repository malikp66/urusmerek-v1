'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';

import { createAffiliateLink } from '@/app/mitra/affiliates/actions';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/i18n/context';

export function CreateLinkDialog() {
  const t = useTranslations('panels.partner.createLink');
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      try {
        const result = await createAffiliateLink();
        toast.success(t('success').replace('{code}', result.code));
      } catch (error) {
        toast.error(t('error'));
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

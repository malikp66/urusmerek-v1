'use client';

import { useState, useTransition } from 'react';

import { createWithdrawRequest } from '@/app/mitra/withdraw/actions';
import { useGlobalAlert } from '@/components/global-alert/GlobalAlertProvider';
import { INDONESIAN_BANKS } from '@/lib/constants/banks';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslations, useLocale } from '@/lib/i18n/context';

type Props = {
  availableAmount: number;
  locale: 'id' | 'en';
};

export function RequestWithdrawDialog({ availableAmount, locale }: Props) {
  const t = useTranslations('panels.partner.withdrawDialog');
  const { locale: contextLocale } = useLocale();
  const effectiveLocale = locale ?? contextLocale;
  const intlLocale = effectiveLocale === 'en' ? 'en-US' : 'id-ID';
  const { showAlert } = useGlobalAlert();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [bankCode, setBankCode] = useState('BCA');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      try {
        await createWithdrawRequest(formData);
        showAlert({
          tone: 'success',
          title: t('success'),
        });
        setOpen(false);
        form.reset();
        setBankCode('BCA');
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
    <Dialog open={open} onOpenChange={(value) => !isPending && setOpen(value)}>
      <DialogTrigger asChild>
        <Button disabled={availableAmount <= 0}>{t('trigger')}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('description').replace(
              '{amount}',
              availableAmount.toLocaleString(intlLocale)
            )}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">{t('amountLabel')}</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min={100000}
              step={50000}
              placeholder={t('amountPlaceholder')}
              required
              disabled={isPending}
              aria-describedby="amount-help"
            />
            <p id="amount-help" className="text-xs text-muted-foreground">
              {t('amountHelp')}
            </p>
          </div>

          <div className="space-y-2">
            <Label>{t('bankLabel')}</Label>
            <input type="hidden" name="bankCode" value={bankCode} />
            <Select value={bankCode} onValueChange={setBankCode} disabled={isPending}>
              <SelectTrigger>
                <SelectValue placeholder={t('bankPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {INDONESIAN_BANKS.map((bank) => (
                  <SelectItem key={bank.code} value={bank.code}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountName">{t('accountNameLabel')}</Label>
            <Input
              id="accountName"
              name="accountName"
              placeholder={t('accountNamePlaceholder')}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">{t('accountNumberLabel')}</Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              placeholder={t('accountNumberPlaceholder')}
              required
              disabled={isPending}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="setDefault" name="setDefault" disabled={isPending} />
            <Label htmlFor="setDefault" className="text-sm">
              {t('setDefault')}
            </Label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? t('submitting') : t('submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

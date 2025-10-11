'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { createAffiliateLink } from '@/app/mitra/affiliates/actions';
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
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from '@/lib/i18n/context';

export function CreateLinkDialog() {
  const t = useTranslations('panels.partner.createLink');
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [targetUrl, setTargetUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        const result = await createAffiliateLink({
          targetUrl,
          description: description.trim() ? description.trim() : undefined,
        });
        toast.success(t('success').replace('{code}', result.code));
        setOpen(false);
        setTargetUrl('');
        setDescription('');
      } catch (error) {
        toast.error(t('error'));
        console.error(error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !isPending && setOpen(value)}>
      <DialogTrigger asChild>
        <Button variant="outline">{t('trigger')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target-url">{t('targetLabel')}</Label>
            <Input
              id="target-url"
              type="url"
              placeholder={t('targetPlaceholder')}
              required
              value={targetUrl}
              onChange={(event) => setTargetUrl(event.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('notesLabel')}</Label>
            <Textarea
              id="description"
              placeholder={t('notesPlaceholder')}
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              {t('notesHelp')}
            </p>
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

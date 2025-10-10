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

export function CreateLinkDialog() {
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
        toast.success(`Link baru berhasil dibuat (${result.code})`);
        setOpen(false);
        setTargetUrl('');
        setDescription('');
      } catch (error) {
        toast.error('Gagal membuat link baru. Pastikan URL valid.');
        console.error(error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !isPending && setOpen(value)}>
      <DialogTrigger asChild>
        <Button variant="outline">Buat Link Baru</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Link Referral Baru</DialogTitle>
          <DialogDescription>
            Atur tujuan URL dan keterangan singkat agar mudah dibedakan.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target-url">URL Tujuan</Label>
            <Input
              id="target-url"
              type="url"
              placeholder="https://contoh.com/produk"
              required
              value={targetUrl}
              onChange={(event) => setTargetUrl(event.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Keterangan (opsional)</Label>
            <Textarea
              id="description"
              placeholder="Contoh: Promo paket konsultasi 2024"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              Batas 160 karakter untuk keterangan internal agar mudah dikenali.
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Membuat...' : 'Simpan Link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

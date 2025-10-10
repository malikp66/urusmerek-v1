'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  defaultRate: number;
};

export function DefaultCommissionForm({ defaultRate }: Props) {
  const [percent, setPercent] = useState(() => Math.round(defaultRate * 1000) / 10);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const numeric = Number(percent);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      toast.error('Persentase komisi harus lebih dari 0');
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
        toast.error(data?.message ?? 'Gagal menyimpan komisi default');
        return;
      }

      toast.success('Komisi default diperbarui');
      router.refresh();
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="defaultRate">Komisi Default (%)</Label>
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
          Komisi ini akan menjadi dasar untuk setiap mitra baru. Contoh: isi 12 untuk 12%.
        </p>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Menyimpan...' : 'Simpan'}
      </Button>
    </form>
  );
}

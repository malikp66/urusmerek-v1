'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  partnerId: number;
  defaultRate: number;
  customRates: Record<string, unknown> | null;
};

export function CommissionSettingForm({ partnerId, defaultRate, customRates }: Props) {
  const [percent, setPercent] = useState(() => Math.round(defaultRate * 1000) / 10);
  const [customRatesText, setCustomRatesText] = useState(
    customRates ? JSON.stringify(customRates, null, 2) : '',
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const asNumber = Number(percent);
    if (!Number.isFinite(asNumber) || asNumber <= 0) {
      toast.error('Persentase komisi harus lebih dari 0');
      return;
    }

    let parsedCustomRates: Record<string, unknown> | null = null;
    if (customRatesText.trim().length > 0) {
      try {
        parsedCustomRates = JSON.parse(customRatesText);
      } catch (error) {
        toast.error('Format JSON custom rates tidak valid');
        console.error(error);
        return;
      }
    }

    const payload = {
      defaultRate: asNumber / 100,
      customRates: parsedCustomRates,
    };

    startTransition(async () => {
      const response = await fetch(`/api/admin/mitra/${partnerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        toast.error(data?.message ?? 'Gagal menyimpan pengaturan komisi');
        return;
      }

      toast.success('Pengaturan komisi berhasil disimpan');
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="commissionRate">Komisi Dasar (%)</Label>
        <Input
          id="commissionRate"
          type="number"
          min={0}
          step={0.1}
          value={percent}
          onChange={(event) => setPercent(Number(event.target.value))}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Masukkan persentase komisi dasar untuk mitra ini. Contoh: 10 untuk 10%.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customRates">Custom Rates (opsional)</Label>
        <Textarea
          id="customRates"
          placeholder='contoh: { "produk_a": 0.15, "produk_b": 0.2 }'
          rows={6}
          value={customRatesText}
          onChange={(event) => setCustomRatesText(event.target.value)}
          disabled={isPending}
          className="font-mono text-xs"
        />
        <p className="text-xs text-muted-foreground">
          Gunakan format JSON untuk mengatur komisi spesifik per produk atau layanan. Biarkan kosong
          jika tidak diperlukan.
        </p>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}
      </Button>
    </form>
  );
}

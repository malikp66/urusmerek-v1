'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { referralStatusEnum } from '@/db/schema';
import { useGlobalAlert } from '@/components/global-alert/GlobalAlertProvider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const STATUS_OPTIONS = referralStatusEnum.enumValues;

type Props = {
  referralId: number;
  currentStatus: (typeof STATUS_OPTIONS)[number];
};

export function ReferralStatusForm({ referralId, currentStatus }: Props) {
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { showAlert } = useGlobalAlert();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/referrals/${referralId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          showAlert({
            tone: 'error',
            title: 'Gagal memperbarui status referral',
            description: data?.message ?? 'Silakan coba lagi.',
          });
          return;
        }

        showAlert({
          tone: 'success',
          title: 'Status referral diperbarui',
        });
        router.refresh();
      } catch (error) {
        console.error(error);
        showAlert({
          tone: 'error',
          title: 'Terjadi kesalahan',
          description: 'Silakan coba lagi nanti.',
        });
      }
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label>Status Referral</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger disabled={isPending}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
      </Button>
    </form>
  );
}

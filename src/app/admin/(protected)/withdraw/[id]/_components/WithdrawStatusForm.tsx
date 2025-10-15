'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { WITHDRAW_STATUS_OPTIONS } from '@/constants/withdraw-status';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useGlobalAlert } from '@/components/global-alert/GlobalAlertProvider';

const STATUS_OPTIONS = WITHDRAW_STATUS_OPTIONS;

type Props = {
  withdrawId: number;
  currentStatus: (typeof STATUS_OPTIONS)[number];
  currentNotes: string;
};

export function WithdrawStatusForm({ withdrawId, currentStatus, currentNotes }: Props) {
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { showAlert } = useGlobalAlert();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/withdraw/${withdrawId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status,
            notes: notes.trim().length > 0 ? notes.trim() : null,
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          showAlert({
            tone: 'error',
            title: 'Gagal memperbarui status withdraw',
            description: data?.message ?? 'Silakan coba lagi.',
          });
          return;
        }

        showAlert({
          tone: 'success',
          title: 'Status withdraw diperbarui',
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
        <Label>Status Withdraw</Label>
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

      <div className="space-y-2">
        <Label htmlFor="withdraw-notes">Catatan (opsional)</Label>
        <Textarea
          id="withdraw-notes"
          rows={4}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Berikan catatan untuk tim finance atau mitra"
          disabled={isPending}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
      </Button>
    </form>
  );
}

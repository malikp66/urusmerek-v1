'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { consultationStatusEnum } from '@/db/schema';
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

const STATUS_OPTIONS = consultationStatusEnum.enumValues;

type Props = {
  consultationId: string;
  currentStatus: (typeof STATUS_OPTIONS)[number];
  currentNotes: string;
};

export function ConsultationStatusForm({ consultationId, currentStatus, currentNotes }: Props) {
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch(`/api/admin/konsultasi/${consultationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes: notes.trim().length ? notes.trim() : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        toast.error(data?.message ?? 'Gagal memperbarui konsultasi');
        return;
      }

      toast.success('Status konsultasi disimpan');
      router.refresh();
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label>Status Konsultasi</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger disabled={isPending}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option
                  .split('_')
                  .map((word) => word[0].toUpperCase() + word.slice(1))
                  .join(' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="consultation-notes">Catatan</Label>
        <Textarea
          id="consultation-notes"
          rows={4}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Ringkas diskusi atau tindak lanjut yang sudah dilakukan"
          disabled={isPending}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
      </Button>
    </form>
  );
}

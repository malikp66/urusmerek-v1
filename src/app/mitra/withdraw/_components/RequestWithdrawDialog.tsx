'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { createWithdrawRequest } from '@/app/mitra/withdraw/actions';
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

type Props = {
  availableAmount: number;
};

export function RequestWithdrawDialog({ availableAmount }: Props) {
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
        toast.success('Permintaan withdraw berhasil diajukan');
        setOpen(false);
        form.reset();
        setBankCode('BCA');
      } catch (error) {
        toast.error((error as Error).message || 'Gagal mengajukan withdraw');
        console.error(error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !isPending && setOpen(value)}>
      <DialogTrigger asChild>
        <Button disabled={availableAmount <= 0}>Request Withdraw</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajukan Withdraw</DialogTitle>
          <DialogDescription>
            Saldo yang dapat dicairkan saat ini: <strong>Rp {availableAmount.toLocaleString('id-ID')}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Nominal</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min={100000}
              step={50000}
              placeholder="Contoh: 250000"
              required
              disabled={isPending}
              aria-describedby="amount-help"
            />
            <p id="amount-help" className="text-xs text-muted-foreground">
              Minimal 100.000 dan kelipatan 50.000.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Bank Tujuan</Label>
            <input type="hidden" name="bankCode" value={bankCode} />
            <Select value={bankCode} onValueChange={setBankCode} disabled={isPending}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih bank" />
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
            <Label htmlFor="accountName">Nama Pemilik Rekening</Label>
            <Input
              id="accountName"
              name="accountName"
              placeholder="Nama sesuai buku tabungan"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Nomor Rekening</Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              placeholder="Contoh: 1234567890"
              required
              disabled={isPending}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="setDefault" name="setDefault" disabled={isPending} />
            <Label htmlFor="setDefault" className="text-sm">
              Jadikan bank default untuk pencairan berikutnya
            </Label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Mengirim...' : 'Ajukan Withdraw'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

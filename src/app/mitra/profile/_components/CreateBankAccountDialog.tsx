'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { createBankAccount } from '@/app/mitra/profile/actions';
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

export function CreateBankAccountDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [bankCode, setBankCode] = useState('BCA');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      try {
        await createBankAccount(formData);
        toast.success('Rekening berhasil disimpan');
        router.refresh();
        form.reset();
        setBankCode('BCA');
        setOpen(false);
      } catch (error) {
        toast.error((error as Error).message || 'Gagal menyimpan rekening');
        console.error(error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !isPending && setOpen(value)}>
      <DialogTrigger asChild>
        <Button variant="outline">Buat Rekening Baru</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Rekening Mitra</DialogTitle>
          <DialogDescription>
            Simpan informasi rekening baru untuk pencairan komisi.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Pilih Bank</Label>
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

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Simpan Rekening'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

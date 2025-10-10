import Link from 'next/link';

import { withdrawStatusEnum } from '@/db/schema';
import { requireAdmin } from '@/lib/auth-guards';
import { getAdminWithdrawRequests } from '@/lib/services/admin/withdraw';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type SearchParams = Record<string, string | string[] | undefined>;

function toStringValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value ?? '';
}

function toNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
}

const STATUS_OPTIONS = ['all', ...withdrawStatusEnum.enumValues];

function formatCurrency(value: number) {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export default async function AdminWithdrawPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const resolved = await searchParams;

  const search = toStringValue(resolved.search);
  const status = toStringValue(resolved.status) || 'all';
  const page = toNumber(toStringValue(resolved.page) || '1', 1);

  const result = await getAdminWithdrawRequests({
    search: search || undefined,
    status: (STATUS_OPTIONS.includes(status) ? status : 'all') as any,
    page,
    perPage: 20,
  });

  const createQueryString = (nextPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    params.set('page', String(nextPage));
    return `?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Permintaan Withdraw</h2>
        <p className="text-sm text-muted-foreground">
          Approve dan pantau status pencairan komisi mitra.
        </p>
      </div>

      <Card>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-4">
          <form className="grid gap-3 md:col-span-3 md:grid-cols-3" action="/admin/withdraw">
            <Input
              name="search"
              placeholder="Cari nama/email mitra"
              defaultValue={search}
              className="md:col-span-2"
            />
            <div>
              <label htmlFor="status" className="sr-only">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={status}
                className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs transition-[color,box-shadow]"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option === 'all'
                      ? 'Semua Status'
                      : option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 md:col-span-3">
              <Button type="submit">Terapkan</Button>
              <Button variant="ghost" asChild>
                <Link href="/admin/withdraw">Reset</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Mitra</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Diajukan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Belum ada permintaan withdraw dengan filter saat ini.
                </TableCell>
              </TableRow>
            ) : (
              result.data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>#{item.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.userName}</span>
                      <span className="text-xs text-muted-foreground">{item.userEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(item.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleString('id-ID', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/withdraw/${item.id}`}>Kelola</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan {result.data.length} dari {result.totalItems} permintaan
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={result.page > 1 ? createQueryString(result.page - 1) : undefined}
                aria-disabled={result.page === 1}
                className={result.page === 1 ? 'pointer-events-none opacity-50' : undefined}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-2 text-sm text-muted-foreground">
                Halaman {result.page} dari {result.pageCount}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={
                  result.page < result.pageCount
                    ? createQueryString(result.page + 1)
                    : undefined
                }
                aria-disabled={result.page === result.pageCount}
                className={
                  result.page === result.pageCount ? 'pointer-events-none opacity-50' : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

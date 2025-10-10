import Link from 'next/link';

import { requireAdmin } from '@/lib/auth-guards';
import { getAdminPartnersList } from '@/lib/services/admin/partners';
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

export const revalidate = 0;

export default async function AdminMitraPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const resolved = await searchParams;

  const search = toStringValue(resolved.search);
  const page = toNumber(toStringValue(resolved.page) || '1', 1);

  const result = await getAdminPartnersList({
    search: search || undefined,
    page,
    perPage: 20,
  });

  const createQueryString = (nextPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('page', String(nextPage));
    return `?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Daftar Mitra</h2>
        <p className="text-sm text-muted-foreground">
          Pantau performa setiap mitra dan kelola detail komisi mereka.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form className="flex flex-col gap-3 md:flex-row md:items-center" action="/admin/mitra">
            <Input
              name="search"
              placeholder="Cari nama atau email mitra"
              defaultValue={search}
              className="md:max-w-xs"
            />
            <Button type="submit">Cari</Button>
            <Button variant="ghost" type="reset" asChild>
              <Link href="/admin/mitra">Reset</Link>
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mitra</TableHead>
              <TableHead>Total Link</TableHead>
              <TableHead>Komisi Approved</TableHead>
              <TableHead>Komisi Dibayar</TableHead>
              <TableHead>Withdraw Pending</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Tidak ada mitra ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              result.data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.activeLinks}</span>
                      <span className="text-xs text-muted-foreground">
                        Total {item.totalLinks.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    Rp {item.approvedCommission.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell>Rp {item.paidCommission.toLocaleString('id-ID')}</TableCell>
                  <TableCell>Rp {item.pendingWithdraw.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/mitra/${item.id}`}>Detail</Link>
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
          Menampilkan {result.data.length} dari {result.totalItems} mitra
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

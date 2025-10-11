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
import { getLocaleFromRequest, getTranslations } from '@/lib/i18n/server';

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
  const locale = await getLocaleFromRequest();
  const intlLocale = locale === 'en' ? 'en-US' : 'id-ID';
  const t = await getTranslations('panels.admin.partners', locale);
  const headers = t<{
    partner: string;
    links: string;
    approved: string;
    paid: string;
    pending: string;
    actions: string;
  }>('tableHeaders');

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
        <h2 className="text-2xl font-semibold tracking-tight">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form className="flex flex-col gap-3 md:flex-row md:items-center" action="/admin/mitra">
            <Input
              name="search"
              placeholder={t('searchPlaceholder')}
              defaultValue={search}
              className="md:max-w-xs"
            />
            <Button type="submit">{t('searchButton')}</Button>
            <Button variant="ghost" type="reset" asChild>
              <Link href="/admin/mitra">{t('reset')}</Link>
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{headers.partner}</TableHead>
              <TableHead>{headers.links}</TableHead>
              <TableHead>{headers.approved}</TableHead>
              <TableHead>{headers.paid}</TableHead>
              <TableHead>{headers.pending}</TableHead>
              <TableHead className="text-right">{headers.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  {t('empty')}
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
                        {t('totalLinks').replace(
                          '{count}',
                          item.totalLinks.toLocaleString(intlLocale)
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>Rp {item.approvedCommission.toLocaleString(intlLocale)}</TableCell>
                  <TableCell>Rp {item.paidCommission.toLocaleString(intlLocale)}</TableCell>
                  <TableCell>Rp {item.pendingWithdraw.toLocaleString(intlLocale)}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/mitra/${item.id}`}>{t('detail')}</Link>
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
          {t('summary')
            .replace('{displayed}', result.data.length.toLocaleString(intlLocale))
            .replace('{total}', result.totalItems.toLocaleString(intlLocale))}
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
                {t('pagination')
                  .replace('{page}', result.page.toLocaleString(intlLocale))
                  .replace('{total}', result.pageCount.toLocaleString(intlLocale))}
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

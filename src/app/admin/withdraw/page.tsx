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

const STATUS_OPTIONS = ['all', ...withdrawStatusEnum.enumValues];

export default async function AdminWithdrawPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const resolved = await searchParams;
  const locale = getLocaleFromRequest();
  const intlLocale = locale === 'en' ? 'en-US' : 'id-ID';
  const t = getTranslations('panels.admin.withdraw', locale);
  const headers = t<{
    id: string;
    partner: string;
    amount: string;
    status: string;
    created: string;
    actions: string;
  }>('tableHeaders');
  const statusOptionsLabels = t<
    Record<'all' | 'pending' | 'approved' | 'processing' | 'paid' | 'rejected', string>
  >('statusOptions');
  const statusBadgeLabels = t<
    Record<'pending' | 'approved' | 'processing' | 'paid' | 'rejected', string>
  >('statusBadge');

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
        <h2 className="text-2xl font-semibold tracking-tight">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <Card>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-4">
          <form className="grid gap-3 md:col-span-3 md:grid-cols-3" action="/admin/withdraw">
            <Input
              name="search"
              placeholder={t('searchPlaceholder')}
              defaultValue={search}
              className="md:col-span-2"
            />
            <div>
              <label htmlFor="status" className="sr-only">
                {t('statusLabel')}
              </label>
              <select
                id="status"
                name="status"
                defaultValue={status}
                className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs transition-[color,box-shadow]"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {statusOptionsLabels[option as keyof typeof statusOptionsLabels] ?? option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 md:col-span-3">
              <Button type="submit">{t('apply')}</Button>
              <Button variant="ghost" asChild>
                <Link href="/admin/withdraw">{t('reset')}</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{headers.id}</TableHead>
              <TableHead>{headers.partner}</TableHead>
              <TableHead>{headers.amount}</TableHead>
              <TableHead>{headers.status}</TableHead>
              <TableHead>{headers.created}</TableHead>
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
                  <TableCell>#{item.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.userName}</span>
                      <span className="text-xs text-muted-foreground">{item.userEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>Rp {item.amount.toLocaleString(intlLocale)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {statusBadgeLabels[item.status as keyof typeof statusBadgeLabels] ?? item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleString(intlLocale, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/withdraw/${item.id}`}>{t('manage')}</Link>
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

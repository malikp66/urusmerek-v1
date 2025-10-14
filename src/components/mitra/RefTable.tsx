"use client";

import { useMemo } from "react";

import { PaginatedResult, ReferralRow } from "@/app/mitra/affiliates/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "@/lib/i18n/context";

function createQueryString(
  base: Record<string, string | undefined>,
  key: string,
  value: string
) {
  const params = new URLSearchParams();
  Object.entries(base).forEach(([k, v]) => {
    if (!v || k === key) return;
    params.set(k, v);
  });
  params.set(key, value);
  return `?${params.toString()}`;
}

type Props = {
  result: PaginatedResult<ReferralRow>;
  query: Record<string, string | undefined>;
};

export function RefTable({ result, query }: Props) {
  const { locale } = useLocale();
  const intlLocale = locale === "en" ? "en-US" : "id-ID";
  const t = useTranslations("panels.partner.refTable");
  const headers = t<{
    order: string;
    code: string;
    amount: string;
    commission: string;
    status: string;
    withdraw: string;
    date: string;
  }>("tableHeaders");
  const statusLabels = t<Record<string, string>>("status");
  const paginationMessage = useMemo(() => {
    if (result.totalItems === 0) {
      return t("noData");
    }
    const start = (result.page - 1) * result.perPage + 1;
    const end = Math.min(result.totalItems, start + result.perPage - 1);
    return t("pagination")
      .replace("{start}", start.toLocaleString(intlLocale))
      .replace("{end}", end.toLocaleString(intlLocale))
      .replace("{total}", result.totalItems.toLocaleString(intlLocale));
  }, [intlLocale, result.page, result.perPage, result.totalItems, t]);

  const baseQuery = useMemo(() => ({ ...query }), [query]);

  return (
    <div className="space-y-4">
      <Table containerClassName="rounded-xl border" className="min-w-[880px]">
          <TableHeader>
            <TableRow>
              <TableHead>{headers.order}</TableHead>
              <TableHead>{headers.code}</TableHead>
              <TableHead className="text-right">{headers.amount}</TableHead>
              <TableHead className="text-right">{headers.commission}</TableHead>
              <TableHead>{headers.status}</TableHead>
              <TableHead>{headers.withdraw}</TableHead>
              <TableHead>{headers.date}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  {t("empty")}
                </TableCell>
              </TableRow>
            ) : (
              result.data.map((item) => {
                const createdAt = new Date(item.createdAt);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-normal">
                      <div className="flex flex-col">
                        <span className="font-medium">{item.orderId}</span>
                        <span className="text-xs text-muted-foreground">
                          {t("idLabel").replace("{id}", String(item.id))}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-normal">{item.code}</TableCell>
                    <TableCell className="text-right font-medium">
                      {`Rp ${item.amount.toLocaleString(intlLocale)}`}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {`Rp ${item.commission.toLocaleString(intlLocale)}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {statusLabels[item.status] ?? item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.payoutRequestId ? (
                        <Badge variant="secondary">
                          {t("withdrawBadge").replace(
                            "{id}",
                            String(item.payoutRequestId)
                          )}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">{t("withdrawEmpty")}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {createdAt.toLocaleString(intlLocale, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{paginationMessage}</p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  result.page > 1
                    ? createQueryString(baseQuery, "refPage", String(result.page - 1))
                    : undefined
                }
                aria-disabled={result.page === 1}
                className={
                  result.page === 1 ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-2 text-sm text-muted-foreground">
                {t("pageIndicator")
                  .replace("{page}", result.page.toLocaleString(intlLocale))
                  .replace("{total}", result.pageCount.toLocaleString(intlLocale))}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={
                  result.page < result.pageCount
                    ? createQueryString(baseQuery, "refPage", String(result.page + 1))
                    : undefined
                }
                aria-disabled={result.page === result.pageCount}
                className={
                  result.page === result.pageCount
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

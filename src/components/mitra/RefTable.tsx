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

function formatCurrency(value: number) {
  return `Rp ${value.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

type Props = {
  result: PaginatedResult<ReferralRow>;
  query: Record<string, string | undefined>;
};

export function RefTable({ result, query }: Props) {
  const paginationMessage = useMemo(() => {
    const start = (result.page - 1) * result.perPage + 1;
    const end = Math.min(result.totalItems, start + result.perPage - 1);
    if (result.totalItems === 0) {
      return "Tidak ada data";
    }
    return `Menampilkan ${start}-${end} dari ${result.totalItems} referral`;
  }, [result.page, result.perPage, result.totalItems]);

  const baseQuery = useMemo(() => ({ ...query }), [query]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Kode</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Komisi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Withdraw</TableHead>
              <TableHead>Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Tidak ada referral ditemukan
                </TableCell>
              </TableRow>
            ) : (
              result.data.map((item) => {
                const createdAt = new Date(item.createdAt);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.orderId}</span>
                        <span className="text-xs text-muted-foreground">
                          ID #{item.id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{item.code}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.amount)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.commission)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.payoutRequestId ? (
                        <Badge variant="secondary">Withdraw #{item.payoutRequestId}</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Belum diajukan</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {createdAt.toLocaleString("id-ID", {
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
      </div>
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
                Halaman {result.page} dari {result.pageCount}
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

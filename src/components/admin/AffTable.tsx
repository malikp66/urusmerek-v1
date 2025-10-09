"use client";

import { useMemo, useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { toggleAffiliateLink } from "@/app/admin/affiliates/actions";
import { AffiliateLinkRow, PaginatedResult } from "@/app/admin/affiliates/queries";
import { Switch } from "@/components/ui/switch";
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

function getPaginationMessage(page: number, perPage: number, total: number) {
  const start = (page - 1) * perPage + 1;
  const end = Math.min(total, start + perPage - 1);
  if (total === 0) {
    return "Tidak ada data";
  }
  return `Menampilkan ${start}-${end} dari ${total} link`;
}

type Props = {
  result: PaginatedResult<AffiliateLinkRow>;
  query: Record<string, string | undefined>;
};

export function AffTable({ result, query }: Props) {
  const [optimisticLinks, setOptimisticLinks] = useOptimistic(
    result.data,
    (state, update: { id: number; isActive: boolean }) =>
      state.map((item) =>
        item.id === update.id ? { ...item, isActive: update.isActive } : item
      )
  );
  const [isPending, startTransition] = useTransition();

  const paginationMessage = useMemo(
    () =>
      getPaginationMessage(result.page, result.perPage, result.totalItems),
    [result.page, result.perPage, result.totalItems]
  );

  const baseQuery = useMemo(() => ({ ...query }), [query]);

  const handleToggle = (id: number, isActive: boolean) => {
    setOptimisticLinks({ id, isActive });
    startTransition(async () => {
      try {
        await toggleAffiliateLink({ linkId: id, isActive });
        toast.success("Status link diperbarui");
      } catch (error) {
        toast.error("Gagal mengubah status link");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Mitra</TableHead>
              <TableHead className="text-right">Klik (7h)</TableHead>
              <TableHead className="text-right">Referral (7h)</TableHead>
              <TableHead className="text-right">Komisi Lifetime</TableHead>
              <TableHead className="text-center">Aktif</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {optimisticLinks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Tidak ada link ditemukan
                </TableCell>
              </TableRow>
            ) : (
              optimisticLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{link.code}</span>
                      <span className="text-xs text-muted-foreground">
                        ID #{link.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{link.partnerName}</span>
                      <span className="text-xs text-muted-foreground">
                        {link.partnerEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {link.clicks7d.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {link.referrals7d.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    Rp {link.lifetimeCommission.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={link.isActive}
                      onCheckedChange={(checked) =>
                        handleToggle(link.id, Boolean(checked))
                      }
                      disabled={isPending}
                      aria-label={`Toggle link ${link.code}`}
                    />
                  </TableCell>
                </TableRow>
              ))
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
                    ? createQueryString(baseQuery, "linkPage", String(result.page - 1))
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
                    ? createQueryString(baseQuery, "linkPage", String(result.page + 1))
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

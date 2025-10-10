"use client";

import { useMemo, useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { updateReferralStatus } from "@/app/mitra/affiliates/actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_OPTIONS: Array<{
  value: ReferralRow["status"];
  label: string;
}> = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "paid", label: "Paid" },
];

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
  const [optimisticData, setOptimisticData] = useOptimistic(
    result.data,
    (state, update: { id: number; status: ReferralRow["status"] }) =>
      state.map((item) =>
        item.id === update.id ? { ...item, status: update.status } : item
      )
  );
  const [isPending, startTransition] = useTransition();

  const paginationMessage = useMemo(() => {
    const start = (result.page - 1) * result.perPage + 1;
    const end = Math.min(result.totalItems, start + result.perPage - 1);
    if (result.totalItems === 0) {
      return "Tidak ada data";
    }
    return `Menampilkan ${start}-${end} dari ${result.totalItems} referral`;
  }, [result.page, result.perPage, result.totalItems]);

  const baseQuery = useMemo(() => ({ ...query }), [query]);

  const handleStatusChange = (id: number, status: ReferralRow["status"]) => {
    setOptimisticData({ id, status });
    startTransition(async () => {
      try {
        await updateReferralStatus({ referralId: id, status });
        toast.success("Status referral diperbarui");
      } catch (error) {
        toast.error("Gagal memperbarui status referral");
      }
    });
  };

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
              <TableHead>Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {optimisticData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Tidak ada referral ditemukan
                </TableCell>
              </TableRow>
            ) : (
              optimisticData.map((item) => {
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
                      <Select
                        value={item.status}
                        onValueChange={(value) =>
                          handleStatusChange(item.id, value as ReferralRow["status"])
                        }
                        disabled={isPending}
                      >
                        <SelectTrigger size="sm" className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

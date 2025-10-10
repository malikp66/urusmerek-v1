import { MitraWithdrawRow, PaginatedResult } from "@/app/mitra/affiliates/queries";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  result: PaginatedResult<MitraWithdrawRow>;
  query: Record<string, string | undefined>;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  approved: "Disetujui",
  processing: "Diproses",
  paid: "Selesai",
  rejected: "Ditolak",
};

const TIMELINE_STEPS: Array<{ value: string; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "processing", label: "Processing" },
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
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function WithdrawTimeline({ status }: { status: string }) {
  const activeIndex = TIMELINE_STEPS.findIndex((step) => step.value === status);
  return (
    <div className="flex items-center gap-2">
      {TIMELINE_STEPS.map((step, index) => {
        const isReached = activeIndex >= index && activeIndex !== -1;
        const isActive = index === activeIndex;
        return (
          <div key={step.value} className="flex items-center gap-2">
            <Badge
              variant={isActive ? "default" : isReached ? "secondary" : "outline"}
              className="text-[11px] uppercase"
            >
              {step.label}
            </Badge>
            {index < TIMELINE_STEPS.length - 1 ? (
              <Separator orientation="vertical" className="h-4" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function WithdrawTable({ result, query }: Props) {
  const paginationMessage = (() => {
    const start = (result.page - 1) * result.perPage + 1;
    const end = Math.min(result.totalItems, start + result.perPage - 1);
    if (result.totalItems === 0) {
      return "Belum ada riwayat withdraw";
    }
    return `Menampilkan ${start}-${end} dari ${result.totalItems} permintaan`;
  })();

  const baseQuery = { ...query };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Bank</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Diperbarui</TableHead>
              <TableHead>Catatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Belum ada riwayat withdraw.
                </TableCell>
              </TableRow>
            ) : (
              result.data.map((item) => {
                const bank = item.bankSnapshot as {
                  bankName?: string;
                  accountNumber?: string;
                };
                const statusLabel = STATUS_LABEL[item.status] ?? item.status;
                const updated = item.updatedAt.toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <TableRow key={item.id} className="align-top">
                    <TableCell>#{item.id}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(item.amount)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{bank.bankName ?? "-"}</span>
                        <span className="text-xs text-muted-foreground">
                          {bank.accountNumber ? `••••${String(bank.accountNumber).slice(-4)}` : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={item.status === "paid" ? "default" : item.status === "rejected" ? "destructive" : "outline"}
                        className="capitalize"
                      >
                        {statusLabel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.status === "rejected" ? (
                        <Badge variant="destructive" className="text-[11px] uppercase">
                          Ditolak
                        </Badge>
                      ) : (
                        <WithdrawTimeline status={item.status} />
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{updated}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs">
                      {item.notes ? item.notes : "-"}
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
                    ? createQueryString(baseQuery, "page", String(result.page - 1))
                    : undefined
                }
                aria-disabled={result.page === 1}
                className={result.page === 1 ? "pointer-events-none opacity-50" : undefined}
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
                    ? createQueryString(baseQuery, "page", String(result.page + 1))
                    : undefined
                }
                aria-disabled={result.page === result.pageCount}
                className={
                  result.page === result.pageCount ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

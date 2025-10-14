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
import { getTranslations } from "@/lib/i18n/server";

type Props = {
  result: PaginatedResult<MitraWithdrawRow>;
  query: Record<string, string | undefined>;
  locale: "id" | "en";
};

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

function WithdrawTimeline({
  status,
  steps,
}: {
  status: string;
  steps: Array<{ value: string; label: string }>;
}) {
  const activeIndex = steps.findIndex((step) => step.value === status);
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
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
            {index < steps.length - 1 ? (
              <Separator orientation="vertical" className="h-4" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export async function WithdrawTable({ result, query, locale }: Props) {
  const intlLocale = locale === "en" ? "en-US" : "id-ID";
  const t = await getTranslations("panels.partner.withdrawTable", locale);
  const headers = t<{
    id: string;
    amount: string;
    bank: string;
    status: string;
    timeline: string;
    updated: string;
    notes: string;
  }>("tableHeaders");
  const statusLabels = t<Record<string, string>>("status");
  const timelineLabels = t<Record<string, string>>("timeline");
  const timelineSteps = ("pending approved processing paid".split(" ") as Array<
    "pending" | "approved" | "processing" | "paid"
  >).map((value) => ({ value, label: timelineLabels[value] ?? value }));
  const pageIndicatorTemplate = t("pageIndicator");
  const paginationMessage = (() => {
    if (result.totalItems === 0) {
      return t("empty");
    }
    const start = (result.page - 1) * result.perPage + 1;
    const end = Math.min(result.totalItems, start + result.perPage - 1);
    return t("pagination")
      .replace("{start}", start.toLocaleString(intlLocale))
      .replace("{end}", end.toLocaleString(intlLocale))
      .replace("{total}", result.totalItems.toLocaleString(intlLocale));
  })();

  const baseQuery = { ...query };

  return (
    <div className="space-y-4">
      <Table containerClassName="rounded-xl border" className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead>{headers.id}</TableHead>
              <TableHead>{headers.amount}</TableHead>
              <TableHead>{headers.bank}</TableHead>
              <TableHead>{headers.status}</TableHead>
              <TableHead>{headers.timeline}</TableHead>
              <TableHead>{headers.updated}</TableHead>
              <TableHead>{headers.notes}</TableHead>
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
                const bank = item.bankSnapshot as {
                  bankName?: string;
                  accountNumber?: string;
                };
                const statusLabel = statusLabels[item.status] ?? item.status;
                const updated = item.updatedAt.toLocaleString(intlLocale, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <TableRow key={item.id} className="align-top">
                    <TableCell>#{item.id}</TableCell>
                    <TableCell className="font-medium">
                      Rp {item.amount.toLocaleString(intlLocale)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{bank.bankName ?? "-"}</span>
                        <span className="text-xs text-muted-foreground">
                          {bank.accountNumber ? `••••${String(bank.accountNumber).slice(-4)}` : "-"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "paid"
                            ? "default"
                            : item.status === "rejected"
                              ? "destructive"
                              : "outline"
                        }
                        className="capitalize"
                      >
                        {statusLabel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.status === "rejected" ? (
                        <Badge variant="destructive" className="text-[11px] uppercase">
                          {statusLabels.rejected ?? statusLabel}
                        </Badge>
                      ) : (
                        <WithdrawTimeline status={item.status} steps={timelineSteps} />
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{updated}</TableCell>
                    <TableCell className="max-w-xs text-xs text-muted-foreground">
                      {item.notes ? item.notes : "-"}
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
                    ? createQueryString(baseQuery, "page", String(result.page - 1))
                    : undefined
                }
                aria-disabled={result.page === 1}
                className={result.page === 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-2 text-sm text-muted-foreground">
                {pageIndicatorTemplate
                  .replace("{page}", result.page.toLocaleString(intlLocale))
                  .replace("{total}", result.pageCount.toLocaleString(intlLocale))}
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

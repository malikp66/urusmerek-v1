"use client";

import { useEffect, useMemo, useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Trash2 } from "lucide-react";

import {
  deleteAffiliateLink,
  toggleAffiliateLink,
} from "@/app/mitra/affiliates/actions";
import { MitraLinkRow, PaginatedResult } from "@/app/mitra/affiliates/queries";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGlobalAlert } from "@/components/global-alert/GlobalAlertProvider";
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
  result: PaginatedResult<MitraLinkRow>;
  query: Record<string, string | undefined>;
};

type OptimisticAction =
  | { type: "toggle"; id: number; isActive: boolean }
  | { type: "delete"; id: number }
  | { type: "reset"; data: MitraLinkRow[] };

export function AffTable({ result, query }: Props) {
  const router = useRouter();
  const { locale } = useLocale();
  const intlLocale = locale === "en" ? "en-US" : "id-ID";
  const t = useTranslations("panels.partner.affTable");
  const { showAlert } = useGlobalAlert();
  const headers = t<{
    link: string;
    target: string;
    clicks: string;
    referrals: string;
    commission: string;
    active: string;
    actions: string;
  }>("tableHeaders");
  const [optimisticLinks, setOptimisticLinks] = useOptimistic(
    result.data,
    (state, action: OptimisticAction): MitraLinkRow[] => {
      switch (action.type) {
        case "toggle":
          return state.map((item) =>
            item.id === action.id ? { ...item, isActive: action.isActive } : item
          );
        case "delete":
          return state.filter((item) => item.id !== action.id);
        case "reset":
          return action.data;
        default:
          return state;
      }
    }
  );
  const [isPendingToggle, startToggleTransition] = useTransition();

  useEffect(() => {
    setOptimisticLinks({ type: "reset", data: result.data });
  }, [result.data, setOptimisticLinks]);

  const paginationMessage = useMemo(
    () => {
      if (result.totalItems === 0) {
        return t("noData");
      }
      const start = (result.page - 1) * result.perPage + 1;
      const end = Math.min(result.totalItems, start + result.perPage - 1);
      return t("pagination")
        .replace("{start}", start.toLocaleString(intlLocale))
        .replace("{end}", end.toLocaleString(intlLocale))
        .replace("{total}", result.totalItems.toLocaleString(intlLocale));
    },
    [intlLocale, result.page, result.perPage, result.totalItems, t]
  );

  const baseQuery = useMemo(() => ({ ...query }), [query]);

  const handleToggle = (id: number, isActive: boolean) => {
    setOptimisticLinks({ type: "toggle", id, isActive });
    startToggleTransition(async () => {
      try {
        await toggleAffiliateLink({ linkId: id, isActive });
        showAlert({
          tone: "success",
          title: t("toggleSuccess"),
        });
        router.refresh();
      } catch (error) {
        const message = error instanceof Error ? error.message : undefined;
        showAlert({
          tone: "error",
          title: t("toggleError"),
          description: message && message !== t("toggleError") ? message : undefined,
        });
        setOptimisticLinks({ type: "reset", data: result.data });
        console.error(error);
      }
    });
  };

  const handleDelete = async (id: number) => {
    setOptimisticLinks({ type: "delete", id });

    try {
      await deleteAffiliateLink({ linkId: id });
      showAlert({
        tone: "success",
        title: t("deleteSuccess"),
      });
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined;
      showAlert({
        tone: "error",
        title: t("deleteError"),
        description: message && message !== t("deleteError") ? message : undefined,
      });
      setOptimisticLinks({ type: "reset", data: result.data });
      console.error(error);
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      <Table containerClassName="rounded-xl border" className="min-w-[960px]">
          <TableHeader>
            <TableRow>
              <TableHead>{headers.link}</TableHead>
              <TableHead>{headers.target}</TableHead>
              <TableHead className="text-right">{headers.clicks}</TableHead>
              <TableHead className="text-right">{headers.referrals}</TableHead>
              <TableHead className="text-right">{headers.commission}</TableHead>
              <TableHead className="text-center">{headers.active}</TableHead>
              <TableHead className="text-right">{headers.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {optimisticLinks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  {t("empty")}
                </TableCell>
              </TableRow>
            ) : (
              optimisticLinks.map((link) => (
                  <AffiliateLinkRow
                  key={link.id}
                  link={link}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  isPendingToggle={isPendingToggle}
                />
              ))
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
                    ? createQueryString(baseQuery, "linkPage", String(result.page - 1))
                    : undefined
                }
                aria-disabled={result.page === 1}
                className={result.page === 1 ? "pointer-events-none opacity-50" : undefined}
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
                    ? createQueryString(baseQuery, "linkPage", String(result.page + 1))
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

type AffiliateLinkRowProps = {
  link: MitraLinkRow;
  isPendingToggle: boolean;
  onToggle: (id: number, isActive: boolean) => void;
  onDelete: (id: number) => Promise<void>;
};

function AffiliateLinkRow({
  link,
  isPendingToggle,
  onToggle,
  onDelete,
}: AffiliateLinkRowProps) {
  const { locale } = useLocale();
  const intlLocale = locale === "en" ? "en-US" : "id-ID";
  const t = useTranslations("panels.partner.affTable");
  const { showAlert } = useGlobalAlert();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link.shareUrl);
      showAlert({
        tone: "success",
        title: t("copySuccess"),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined;
      showAlert({
        tone: "error",
        title: t("copyError"),
        description: message && message !== t("copyError") ? message : undefined,
      });
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(link.id);
      setIsDeleteOpen(false);
    } catch {
      // Notifikasi kegagalan sudah ditangani di level atas
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">{link.code}</span>
              <span className="text-xs text-muted-foreground">
                {t("idLabel").replace("{id}", String(link.id))}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <span className="break-all font-medium text-foreground/90">{link.shareUrl}</span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleCopy}
                className="h-7 w-7"
              >
                <Copy className="h-3.5 w-3.5" />
                <span className="sr-only">{t("copyLabel")}</span>
              </Button>
            </div>
            {link.description ? (
              <p className="text-xs text-muted-foreground line-clamp-2">{link.description}</p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              {t("createdAt")} {link.createdAt.toLocaleDateString(intlLocale, {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </TableCell>
        <TableCell>
          <span className="text-sm text-muted-foreground break-all">{link.targetUrl}</span>
        </TableCell>
        <TableCell className="text-right font-medium">
          {link.clicks7d.toLocaleString(intlLocale)}
        </TableCell>
        <TableCell className="text-right font-medium">
          {link.referrals7d.toLocaleString(intlLocale)}
        </TableCell>
        <TableCell className="text-right font-medium">
          Rp {link.lifetimeCommission.toLocaleString(intlLocale)}
        </TableCell>
        <TableCell className="text-center">
          <Switch
            checked={link.isActive}
            onCheckedChange={(checked) => onToggle(link.id, Boolean(checked))}
            disabled={isPendingToggle}
            aria-label={t("toggleAria").replace("{code}", link.code)}
          />
          {!link.isActive ? (
            <Badge variant="outline" className="mt-2 text-[10px] uppercase tracking-wide">
              {t("nonActive")}
            </Badge>
          ) : null}
        </TableCell>
        <TableCell className="text-right">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">{t("delete")}</span>
          </Button>
        </TableCell>
      </TableRow>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDescription").replace("{code}", link.code)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t("deleting") : t("confirmDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

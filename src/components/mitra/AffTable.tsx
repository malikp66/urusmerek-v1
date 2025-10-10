"use client";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  deleteAffiliateLink,
  toggleAffiliateLink,
  updateAffiliateLink,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";

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
  result: PaginatedResult<MitraLinkRow>;
  query: Record<string, string | undefined>;
};

type OptimisticAction =
  | { type: "toggle"; id: number; isActive: boolean }
  | { type: "update"; id: number; targetUrl: string; description: string | null }
  | { type: "delete"; id: number }
  | { type: "reset"; data: MitraLinkRow[] };

export function AffTable({ result, query }: Props) {
  const router = useRouter();
  const [optimisticLinks, setOptimisticLinks] = useOptimistic(
    result.data,
    (state, action: OptimisticAction): MitraLinkRow[] => {
      switch (action.type) {
        case "toggle":
          return state.map((item) =>
            item.id === action.id ? { ...item, isActive: action.isActive } : item
          );
        case "update":
          return state.map((item) =>
            item.id === action.id
              ? {
                  ...item,
                  targetUrl: action.targetUrl,
                  description: action.description,
                }
              : item
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
    () => getPaginationMessage(result.page, result.perPage, result.totalItems),
    [result.page, result.perPage, result.totalItems]
  );

  const baseQuery = useMemo(() => ({ ...query }), [query]);

  const handleToggle = (id: number, isActive: boolean) => {
    setOptimisticLinks({ type: "toggle", id, isActive });
    startToggleTransition(async () => {
      try {
        await toggleAffiliateLink({ linkId: id, isActive });
        toast.success("Status link diperbarui");
        router.refresh();
      } catch (error) {
        toast.error("Gagal mengubah status link");
        setOptimisticLinks({ type: "reset", data: result.data });
      }
    });
  };

  const handleUpdate = async (
    id: number,
    payload: { targetUrl: string; description: string }
  ) => {
    const targetUrl = payload.targetUrl.trim();
    const descriptionRaw = payload.description.trim();
    const description = descriptionRaw ? descriptionRaw : null;

    setOptimisticLinks({ type: "update", id, targetUrl, description });

    try {
      await updateAffiliateLink({
        linkId: id,
        targetUrl,
        description: description ?? undefined,
      });
      toast.success("Link referral diperbarui");
      router.refresh();
    } catch (error) {
      toast.error("Gagal memperbarui link");
      setOptimisticLinks({ type: "reset", data: result.data });
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    setOptimisticLinks({ type: "delete", id });

    try {
      await deleteAffiliateLink({ linkId: id });
      toast.success("Link referral dihapus");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menghapus link");
      setOptimisticLinks({ type: "reset", data: result.data });
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Link Referral</TableHead>
              <TableHead>URL Tujuan</TableHead>
              <TableHead className="text-right">Klik (7h)</TableHead>
              <TableHead className="text-right">Referral (7h)</TableHead>
              <TableHead className="text-right">Komisi Lifetime</TableHead>
              <TableHead className="text-center">Aktif</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {optimisticLinks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Tidak ada link ditemukan
                </TableCell>
              </TableRow>
            ) : (
              optimisticLinks.map((link) => (
                <AffiliateLinkRow
                  key={link.id}
                  link={link}
                  onToggle={handleToggle}
                  onEdit={handleUpdate}
                  onDelete={handleDelete}
                  isPendingToggle={isPendingToggle}
                />
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
  onEdit: (id: number, payload: { targetUrl: string; description: string }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

function AffiliateLinkRow({
  link,
  isPendingToggle,
  onToggle,
  onEdit,
  onDelete,
}: AffiliateLinkRowProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetUrl, setTargetUrl] = useState(link.targetUrl);
  const [description, setDescription] = useState(link.description ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setTargetUrl(link.targetUrl);
    setDescription(link.description ?? "");
  }, [link.targetUrl, link.description]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link.shareUrl);
      toast.success("URL referral disalin");
    } catch {
      toast.error("Tidak dapat menyalin otomatis. Silakan salin manual.");
    }
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onEdit(link.id, { targetUrl, description });
      setIsEditOpen(false);
    } catch {
      // Notifikasi kegagalan sudah ditangani di level atas
    } finally {
      setIsSubmitting(false);
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
              <span className="text-xs text-muted-foreground">ID #{link.id}</span>
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
                <span className="sr-only">Salin URL referral</span>
              </Button>
            </div>
            {link.description ? (
              <p className="text-xs text-muted-foreground line-clamp-2">{link.description}</p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              Dibuat{" "}
              {link.createdAt.toLocaleDateString("id-ID", {
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
            onCheckedChange={(checked) => onToggle(link.id, Boolean(checked))}
            disabled={isPendingToggle}
            aria-label={`Toggle link ${link.code}`}
          />
          {!link.isActive ? (
            <Badge variant="outline" className="mt-2 text-[10px] uppercase tracking-wide">
              Nonaktif
            </Badge>
          ) : null}
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Buka menu tindakan</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setIsEditOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setIsDeleteOpen(true);
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link Referral</DialogTitle>
            <DialogDescription>
              Perbarui URL tujuan atau keterangan internal untuk link ini.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`target-url-${link.id}`}>URL Tujuan</Label>
              <Input
                id={`target-url-${link.id}`}
                type="url"
                required
                value={targetUrl}
                onChange={(event) => setTargetUrl(event.target.value)}
                placeholder="https://contoh.com/tawaran"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`description-${link.id}`}>Keterangan</Label>
              <Textarea
                id={`description-${link.id}`}
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Informasi singkat untuk membedakan link"
              />
              <p className="text-xs text-muted-foreground">
                Keterangan tidak ditampilkan ke publik dan maksimal 160 karakter.
              </p>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus link referral?</AlertDialogTitle>
            <AlertDialogDescription>
              Link <span className="font-medium">{link.code}</span> tidak dapat digunakan lagi setelah
              dihapus. Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

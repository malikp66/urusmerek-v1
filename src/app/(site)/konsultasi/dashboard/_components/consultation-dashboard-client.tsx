"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ClipboardCopy,
  Filter,
  LineChart,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts";

import { CONSULTATION_STATUS_OPTIONS } from "@/constants/consultation-status";
import { useGlobalAlert } from "@/components/global-alert/GlobalAlertProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type {
  ConsultationDashboardData,
  ConsultationStatus,
} from "@/lib/services/public/consultations-dashboard";

type Props = {
  initialData: ConsultationDashboardData;
  trackedIds: string[];
  hasTrackingCookie: boolean;
};

const STATUS_META: Record<
  ConsultationStatus,
  {
    label: string;
    description: string;
    barColor: string;
    badgeClass: string;
    indicatorClass: string;
  }
> = {
  new: {
    label: "Permintaan Baru",
    description: "Menunggu penjadwalan konsultasi",
    barColor: "#fb923c",
    badgeClass: "border-orange-200 bg-orange-50 text-orange-700",
    indicatorClass: "bg-orange-500",
  },
  in_review: {
    label: "Sedang Ditinjau",
    description: "Tim konsultan menyiapkan analisis",
    barColor: "#3b82f6",
    badgeClass: "border-blue-200 bg-blue-50 text-blue-700",
    indicatorClass: "bg-blue-500",
  },
  contacted: {
    label: "Sudah Dihubungi",
    description: "Menunggu respon atau tindak lanjut",
    barColor: "#a855f7",
    badgeClass: "border-purple-200 bg-purple-50 text-purple-700",
    indicatorClass: "bg-purple-500",
  },
  completed: {
    label: "Selesai",
    description: "Konsultasi tuntas dengan rekomendasi",
    barColor: "#22c55e",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    indicatorClass: "bg-emerald-500",
  },
  cancelled: {
    label: "Dibatalkan",
    description: "Konsultasi dihentikan atau duplikat",
    barColor: "#94a3b8",
    badgeClass: "border-slate-200 bg-slate-100 text-slate-700",
    indicatorClass: "bg-slate-500",
  },
};

function formatDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return format(date, "d MMMM yyyy, HH.mm", { locale: localeId });
}

export function ConsultationDashboardClient({
  initialData,
  trackedIds,
  hasTrackingCookie,
}: Props) {
  const { showAlert } = useGlobalAlert();
  const [data, setData] = useState<ConsultationDashboardData>(initialData);
  const [trackedConsultationIds, setTrackedConsultationIds] =
    useState<string[]>(trackedIds);
  const [selectedStatuses, setSelectedStatuses] = useState<
    ConsultationStatus[]
  >([...CONSULTATION_STATUS_OPTIONS]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupId, setLookupId] = useState("");
  const [isLookupLoading, setIsLookupLoading] = useState(false);

  const totalTracked = data.summary.total;

  const statusChartData = useMemo(
    () =>
      CONSULTATION_STATUS_OPTIONS.map((status) => ({
        status,
        label: STATUS_META[status].label,
        value: data.summary.statusCounts[status],
      })),
    [data.summary.statusCounts],
  );

  const filteredConsultations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return data.consultations.filter((consultation) => {
      const statusMatch = selectedStatuses.includes(consultation.status);
      const termMatch =
        term.length === 0 ||
        consultation.brandName.toLowerCase().includes(term) ||
        consultation.service.toLowerCase().includes(term) ||
        consultation.notes?.toLowerCase().includes(term) ||
        consultation.email.toLowerCase().includes(term);

      return statusMatch && termMatch;
    });
  }, [data.consultations, searchTerm, selectedStatuses]);

  const topServices = useMemo(() => data.summary.serviceCounts.slice(0, 5), [
    data.summary.serviceCounts,
  ]);

  async function handleLookupSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const email = lookupEmail.trim().toLowerCase();
    const id = lookupId.trim();

    if (!email || !id) {
      showAlert({
        tone: "warning",
        title: "Lengkapi form pencarian",
        description: "Masukkan email dan ID konsultasi yang valid.",
      });
      return;
    }

    setIsLookupLoading(true);

    try {
      const response = await fetch("/api/konsultasi/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consultationId: id }),
      });

      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        throw new Error(
          payload?.message ??
            "Data konsultasi tidak ditemukan. Periksa kembali email dan ID.",
        );
      }

      setData(payload.data as ConsultationDashboardData);
      setTrackedConsultationIds(payload.trackedIds as string[]);
      setSelectedStatuses([...CONSULTATION_STATUS_OPTIONS]);

      showAlert({
        tone: "success",
        title: "Dashboard diperbarui",
        description:
          "Kami menambahkan konsultasi yang cocok ke dashboard Anda. Simpan halaman ini untuk akses cepat.",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data.";

      showAlert({
        tone: "error",
        title: "Gagal memuat data",
        description: message,
      });
    } finally {
      setIsLookupLoading(false);
    }
  }

  function toggleStatusFilter(status: ConsultationStatus) {
    setSelectedStatuses((prev) => {
      if (prev.includes(status)) {
        const next = prev.filter((item) => item !== status);
        return next.length > 0 ? next : [...CONSULTATION_STATUS_OPTIONS];
      }
      return [...prev, status];
    });
  }

  async function copyId(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      showAlert({
        tone: "success",
        title: "ID disalin",
        description: "Tempelkan ID ini saat ingin membuka dashboard di perangkat lain.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Clipboard tidak tersedia.";

      showAlert({
        tone: "error",
        title: "Gagal menyalin",
        description: message,
      });
    }
  }

  const noTrackedConsultations = totalTracked === 0;

  return (
    <div className="relative bg-slate-950 pb-20">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.18),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_60%)]" />
      </div>

      <section className="relative z-[1] py-24">
        <div className="container mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm text-white/80 backdrop-blur">
              <Sparkles className="size-4 text-[#FACC15]" />
              Dashboard Monitoring Konsultasi
            </div>
            <h1 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">
              Lacak progres konsultasi merek Anda secara real-time
            </h1>
            <p className="mt-4 text-base text-white/70">
              Dashboard ini menampilkan status setiap konsultasi, catatan tindak lanjut, dan
              rangkuman layanan yang dibutuhkan. Tidak perlu login — cukup masukkan email dan ID konsultasi.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {trackedConsultationIds.length > 0 ? (
                trackedConsultationIds.map((id) => (
                  <button
                    key={id}
                    onClick={() => copyId(id)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/40 hover:bg-white/20"
                    type="button"
                  >
                    <ShieldCheck className="size-4 text-[#F87171]" />
                    <span className="font-mono text-xs sm:text-sm">{id}</span>
                    <ClipboardCopy className="size-4 opacity-80" />
                  </button>
                ))
              ) : (
                <span className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/70">
                  Belum ada ID konsultasi yang tersimpan
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-[2] -mt-16 rounded-t-[48px] bg-white pb-24">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Card className="border-transparent bg-white shadow-xl shadow-rose-100/40">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-900">
                    Temukan konsultasi Anda
                  </CardTitle>
                  <p className="text-sm text-slate-600">
                    Masukkan email dan ID konsultasi (tersedia di email konfirmasi) untuk menambahkan data ke dashboard ini.
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleLookupSubmit}
                  className="grid gap-4 md:grid-cols-[1.2fr_1fr_auto]"
                >
                  <div className="space-y-1.5">
                    <label htmlFor="lookup-email" className="text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <Input
                      id="lookup-email"
                      type="email"
                      autoComplete="email"
                      placeholder="nama@perusahaan.com"
                      value={lookupEmail}
                      onChange={(event) => setLookupEmail(event.target.value)}
                      className="rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="lookup-id" className="text-sm font-medium text-slate-700">
                      ID Konsultasi
                    </label>
                    <Input
                      id="lookup-id"
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      value={lookupId}
                      onChange={(event) => setLookupId(event.target.value)}
                      className="font-mono text-sm"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="submit"
                      variant="brand"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl"
                      disabled={isLookupLoading}
                    >
                      {isLookupLoading ? (
                        <>
                          <RefreshCw className="size-4 animate-spin" />
                          Memuat...
                        </>
                      ) : (
                        <>
                          Tambahkan ke dashboard
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 bg-slate-50">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">
                  Cara akses cepat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p>
                  Setelah pengisian form konsultasi, sistem otomatis menyimpan ID di perangkat Anda selama 6 bulan.
                </p>
                <p>
                  Simpan halaman ini atau bagikan ID ke tim Anda. Anda dapat memasukkan beberapa ID sekaligus untuk kolaborasi.
                </p>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 size-4 text-[#DC2626]" />
                    <div>
                      <p className="font-medium text-slate-800">
                        Tidak menemukan ID Anda?
                      </p>
                      <p>
                        Cek folder inbox/promosi dengan subjek &ldquo;Konsultasi Merek Baru&rdquo;
                        atau hubungi kami di <a href="mailto:hello@urusmerek.id" className="text-[#DC2626] underline">
                          hello@urusmerek.id
                        </a>.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <SummaryCard
                icon={LineChart}
                label="Total Konsultasi"
                value={totalTracked}
                highlight
              />
              <SummaryCard
                icon={Timer}
                label="Terakhir diperbarui"
                value={
                  data.summary.lastUpdatedAt
                    ? formatDate(data.summary.lastUpdatedAt)
                    : "Belum ada pembaruan"
                }
              />
              <SummaryCard
                icon={Filter}
                label="Filter status aktif"
                value={`${selectedStatuses.length} dari ${CONSULTATION_STATUS_OPTIONS.length}`}
              />
            </div>

            <Card className="border-slate-200/80">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">
                  Komposisi layanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topServices.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Data layanan akan muncul setelah konsultasi pertama tersimpan.
                  </p>
                ) : (
                  topServices.map((service) => (
                    <div key={service.service} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-sm font-medium text-slate-700">
                        <span>{service.service}</span>
                        <span className="font-semibold text-slate-900">
                          {service.count} konsultasi
                        </span>
                      </div>
                      <Progress
                        value={
                          totalTracked === 0
                            ? 0
                            : Math.min(100, (service.count / totalTracked) * 100)
                        }
                        className="h-2 overflow-hidden rounded-full bg-slate-100"
                      />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {CONSULTATION_STATUS_OPTIONS.map((status) => {
                const meta = STATUS_META[status];
                const isActive = selectedStatuses.includes(status);

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => toggleStatusFilter(status)}
                    className={cn(
                      "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                      meta.badgeClass,
                      isActive
                        ? "shadow-[0_12px_30px_-22px_rgba(220,38,38,0.8)]"
                        : "opacity-60 grayscale",
                    )}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full transition",
                        meta.indicatorClass,
                        isActive ? "opacity-100" : "opacity-40",
                      )}
                    />
                    {meta.label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Cari merek, layanan, atau catatan..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-full border-slate-200 pl-9"
              />
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
            <Card className="border-slate-200/80">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Distribusi status konsultasi
                  </CardTitle>
                  <p className="text-sm text-slate-600">
                    Klik status di atas untuk memfokuskan daftar konsultasi.
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Jumlah konsultasi",
                      color: "hsl(0 72% 51%)",
                    },
                  }}
                  className="h-[320px] w-full"
                >
                  <BarChart data={statusChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#475569", fontSize: 12 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                      {statusChartData.map((item) => (
                        <Cell
                          key={item.status}
                          fill={STATUS_META[item.status].barColor}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">
                  Pembaruan terbaru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {data.summary.recentUpdates.length === 0 ? (
                    <li className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                      Riwayat perubahan status akan muncul setelah konsultasi diproses oleh tim.
                    </li>
                  ) : (
                    data.summary.recentUpdates.map((update) => {
                      const meta = STATUS_META[update.status];

                      return (
                        <li
                          key={`${update.id}-${update.updatedAt}`}
                          className="rounded-xl border border-slate-200/80 bg-white p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {update.brandName}
                              </p>
                              <span
                                className={cn(
                                  "mt-1 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                                  meta.badgeClass,
                                )}
                              >
                                <span
                                  className={cn("h-2 w-2 rounded-full", meta.indicatorClass)}
                                />
                                {meta.label}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-slate-500">
                              {formatDate(update.updatedAt)}
                            </span>
                          </div>
                          {update.notes ? (
                            <p className="mt-2 text-sm text-slate-600">{update.notes}</p>
                          ) : null}
                        </li>
                      );
                    })
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-10 border-slate-200/80">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">
                Detail setiap konsultasi
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {noTrackedConsultations ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                  <ShieldCheck className="size-12 text-[#DC2626]" />
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-slate-900">
                      Belum ada data konsultasi
                    </p>
                    <p className="text-sm text-slate-600">
                      Isi form konsultasi terlebih dahulu atau masukkan kombinasi email dan ID pada formulir di atas.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-full border-slate-300">
                      <a href="/konsultasi" className="inline-flex items-center gap-2">
                        Mulai konsultasi baru
                        <ArrowRight className="size-4" />
                      </a>
                    </Button>
                    <Button variant="brand" className="rounded-full">
                      <a href="mailto:hello@urusmerek.id" className="inline-flex items-center gap-2">
                        Hubungi tim konsultan
                        <Mail className="size-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200">
                  <Table>
                    <TableHeader className="bg-slate-50/70">
                      <TableRow>
                        <TableHead className="min-w-[220px] text-slate-600">
                          Konsultasi
                        </TableHead>
                        <TableHead className="min-w-[200px] text-slate-600">
                          Layanan
                        </TableHead>
                        <TableHead className="min-w-[150px] text-slate-600">
                          Status
                        </TableHead>
                        <TableHead className="min-w-[180px] text-slate-600">
                          Dibuat
                        </TableHead>
                        <TableHead className="min-w-[180px] text-slate-600">
                          Diperbarui
                        </TableHead>
                        <TableHead className="min-w-[260px] text-slate-600">
                          Catatan
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence initial={false}>
                        {filteredConsultations.map((consultation) => {
                          const meta = STATUS_META[consultation.status];

                          return (
                            <motion.tr
                              key={consultation.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-slate-100 text-sm"
                            >
                              <TableCell className="align-top font-medium text-slate-900">
                                <div className="space-y-1.5">
                                  <span>{consultation.brandName}</span>
                                  <p className="text-xs font-mono text-slate-500">
                                    {consultation.id}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {consultation.email}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="align-top text-slate-600">
                                {consultation.applicantName}
                                <p className="mt-1 text-xs text-slate-500">
                                  {consultation.service}
                                </p>
                              </TableCell>
                              <TableCell className="align-top">
                                <Badge className={cn("text-xs", meta.badgeClass)}>
                                  {meta.label}
                                </Badge>
                                <p className="mt-2 text-xs text-slate-500">
                                  {STATUS_META[consultation.status].description}
                                </p>
                              </TableCell>
                              <TableCell className="align-top text-xs text-slate-600">
                                {formatDate(consultation.createdAt)}
                              </TableCell>
                              <TableCell className="align-top text-xs text-slate-600">
                                {formatDate(consultation.updatedAt)}
                              </TableCell>
                              <TableCell className="align-top text-xs text-slate-600">
                                {consultation.notes ?? (
                                  <span className="text-slate-400">
                                    Belum ada catatan dari konsultan.
                                  </span>
                                )}
                              </TableCell>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </TableBody>
                  </Table>

                  {filteredConsultations.length === 0 ? (
                    <div className="border-t border-slate-100 p-6 text-center text-sm text-slate-500">
                      Tidak ada konsultasi yang cocok dengan filter saat ini.
                    </div>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

type SummaryCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  highlight?: boolean;
};

function SummaryCard({ icon: Icon, label, value, highlight }: SummaryCardProps) {
  return (
    <Card
      className={cn(
        "border-slate-200/80 bg-white",
        highlight ? "shadow-lg shadow-rose-100/60" : "shadow-sm",
      )}
    >
      <CardContent className="flex items-center gap-4 py-6">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-full border text-[#DC2626]",
            highlight
              ? "border-[#DC2626]/40 bg-[#DC2626]/10"
              : "border-slate-200 bg-slate-50",
          )}
        >
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-xl font-semibold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type TrademarkItem = {
  markName?: string;
  applicant?: string;
  classes?: string;
  status?: string;
  applicationNumber?: string;
  filingDate?: string;
  priorityDate?: string;
  raw: Record<string, unknown>;
};

type ApiResponse = {
  data: unknown;
  meta?: {
    keyword?: string;
    page?: number;
    record?: number;
  };
  error?: string;
  details?: string;
  status?: number;
};

const PLACEHOLDER_KEYWORDS = [
  "kopi susu",
  "gojek",
  "batik nusantara",
  "kuliner nusantara",
  "digital kreatif",
  "aroma spa",
];

function normaliseItem(item: Record<string, unknown>): TrademarkItem {
  const lowerCaseMap = Object.keys(item).reduce<Record<string, string>>(
    (acc, key) => {
      acc[key.toLowerCase()] = key;
      return acc;
    },
    {},
  );

  const pick = (...candidates: string[]) => {
    for (const candidate of candidates) {
      const actualKey = lowerCaseMap[candidate.toLowerCase()];
      if (!actualKey) continue;

      const value = item[actualKey];
      if (typeof value === "string") return value;
      if (Array.isArray(value)) {
        return value
          .filter((entry) => typeof entry === "string")
          .join(", ");
      }
    }
    return undefined;
  };

  return {
    markName: pick(
      "nama",
      "nama_merek",
      "markName",
      "brand_name",
      "trademark_name",
    ),
    applicant: pick("pemilik", "owner_name", "applicant", "holder"),
    classes:
      pick("kelas", "class", "classes", "nice_class", "classification") ?? "",
    status: pick("status", "mark_status", "registration_status"),
    applicationNumber: pick(
      "nomor_permohonan",
      "application_number",
      "registration_number",
      "serial_number",
    ),
    filingDate: pick(
      "tanggal_permohonan",
      "filing_date",
      "submission_date",
    ),
    priorityDate: pick("priority_date", "tanggal_prioritas"),
    raw: item,
  };
}

function extractItems(data: unknown): TrademarkItem[] {
  if (!data) return [];

  const candidateArrays: unknown[] = [];

  if (Array.isArray(data)) candidateArrays.push(data);
  if (typeof data === "object") {
    Object.values(data as Record<string, unknown>).forEach((value) => {
      if (Array.isArray(value)) candidateArrays.push(value);
    });
  }

  for (const candidate of candidateArrays) {
    const list = (candidate as unknown[]).filter(
      (entry) => entry && typeof entry === "object" && !Array.isArray(entry),
    ) as Record<string, unknown>[];
    if (list.length) return list.map(normaliseItem);
  }

  return [];
}

const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent";

export function TrademarkSearchClient() {
  const [keyword, setKeyword] = useState(PLACEHOLDER_KEYWORDS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TrademarkItem[]>([]);
  const [meta, setMeta] = useState<{ keyword?: string; page?: number }>({});
  const [history, setHistory] = useState<string[]>([]);
  const [placeholder, setPlaceholder] = useState(PLACEHOLDER_KEYWORDS[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((prev) => {
        const currentIndex = PLACEHOLDER_KEYWORDS.indexOf(prev);
        const nextIndex = (currentIndex + 1) % PLACEHOLDER_KEYWORDS.length;
        return PLACEHOLDER_KEYWORDS[nextIndex];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    if (!data.length) return null;

    const uniqueApplicants = new Set(
      data.map((item) => item.applicant).filter(Boolean),
    );

    const statusCounter = data.reduce<Record<string, number>>(
      (acc, item) => {
        if (!item.status) return acc;
        const slug = item.status.toLowerCase();
        acc[slug] = (acc[slug] ?? 0) + 1;
        return acc;
      },
      {},
    );

    const [topStatus] =
      Object.entries(statusCounter).sort((a, b) => b[1] - a[1])[0] ?? [];

    return {
      total: data.length,
      distinctApplicants: uniqueApplicants.size,
      dominantStatus: topStatus
        ? topStatus.replace(/\b\w/g, (char) => char.toUpperCase())
        : "Tidak tersedia",
    };
  }, [data]);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = keyword.trim();
    if (!term) {
      setError("Masukkan kata kunci merek terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/pdki/trademark?keyword=${encodeURIComponent(term)}&record=20`,
      );
      const body: ApiResponse = await response.json();

      if (!response.ok || body.error) {
        throw new Error(body.error ?? "Gagal mengambil data PDKI.");
      }

      const items = extractItems(body.data);
      setData(items);
      setMeta({
        keyword: body.meta?.keyword ?? term,
        page: body.meta?.page ?? 1,
      });
      setHistory((prev) => {
        const next = [term, ...prev.filter((value) => value !== term)];
        return next.slice(0, 5);
      });
    } catch (err) {
      console.error(err);
      setError(
        "Belum dapat menghubungi layanan PDKI. Coba ulangi beberapa saat lagi atau gunakan koneksi ber-IP Indonesia.",
      );
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#FECACA] bg-white shadow-xl">
      <div className="absolute inset-x-6 top-[-8rem] h-48 rounded-full bg-[#FEE2E2]/70 blur-3xl" />
      <div className="absolute inset-x-0 bottom-[-10rem] h-64 rounded-full bg-[#FDE68A]/60 blur-3xl" />

      <div className="relative rounded-[inherit] bg-white/95 p-6 sm:p-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 text-center sm:text-left">
            <Badge className="w-fit bg-[#FEE2E2] px-4 py-1 text-[#B91C1C]">
              Integrasi Langsung DJKI
            </Badge>
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              Lihat data merek resmi dalam hitungan detik.
            </h2>
            <p className="text-sm text-slate-600 sm:text-base">
              Mesin proxy kami menambahkan tanda tangan keamanan{" "}
              <span className="font-semibold text-[#B91C1C]">
                PDKI Signature
              </span>{" "}
              dan merapikan hasil agar mudah dianalisis bersama tim legal.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 rounded-2xl border border-[#FECACA] bg-white/90 p-4 shadow-inner"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder={`contoh: ${placeholder}`}
                className={cn(
                  "h-12 flex-1 border-[#FECACA] bg-[#FFF1F2] text-[#7F1D1D] placeholder:text-[#B91C1C]/60 focus:border-[#FCA5A5] focus-visible:ring-[#F87171]",
                  isLoading && "animate-pulse",
                )}
                autoComplete="off"
              />
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="h-12 min-w-[140px] bg-[#DC2626] font-semibold text-white shadow-lg shadow-[#FECACA]/60 transition hover:bg-[#B91C1C]"
              >
                {isLoading ? "Mengambil..." : "Analisis"}
              </Button>
            </div>
            <p className="text-xs text-[#991B1B]">
              Data bersumber langsung dari{" "}
              <span className="font-semibold text-[#B91C1C]">
                pdki-indonesia.dgip.go.id
              </span>{" "}
              dengan tanda tangan resmi PDKI.
            </p>
          </form>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {history.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#B91C1C]/70">
              <span>Riwayat cepat:</span>
              {history.map((entry) => (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setKeyword(entry)}
                  className="rounded-full border border-[#FECACA] bg-[#FFF1F2] px-3 py-1 text-[#B91C1C] transition hover:border-[#FCA5A5] hover:bg-white"
                >
                  {entry}
                </button>
              ))}
            </div>
          )}

          <Separator className="my-2 bg-[#FECACA]" />

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative h-40 rounded-xl border border-[#FECACA] bg-[#FFF1F2]",
                      shimmer,
                    )}
                  />
                ))}
              </motion.div>
            ) : data.length ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                {stats && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Card className="border-[#FECACA] bg-white text-slate-900">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase tracking-wide text-[#DC2626]">
                          Total temuan
                        </CardDescription>
                        <CardTitle className="text-3xl font-semibold">
                          {stats.total.toLocaleString("id-ID")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-slate-500">
                          {meta.keyword
                            ? `Untuk kata kunci “${meta.keyword}”`
                            : "Berdasarkan pencarian terakhir"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-[#FECACA] bg-white text-slate-900">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase tracking-wide text-[#DC2626]">
                          Pemilik unik
                        </CardDescription>
                        <CardTitle className="text-3xl font-semibold">
                          {stats.distinctApplicants.toLocaleString("id-ID")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-slate-500">
                          Dibedakan berdasarkan nama pemegang hak
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-[#FECACA] bg-white text-slate-900">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase tracking-wide text-[#DC2626]">
                          Status dominan
                        </CardDescription>
                        <CardTitle className="text-lg font-semibold text-[#B91C1C]">
                          {stats.dominantStatus}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-slate-500">
                          Status yang paling sering ditemukan pada hasil
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  {data.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="rounded-2xl border border-[#FECACA] bg-white p-5 shadow-sm shadow-[#FECACA]/50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {item.markName ?? "Nama merek tidak tersedia"}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {item.applicant ?? "Pemilik tidak disebutkan"}
                          </p>
                        </div>
                        {item.status && (
                          <Badge className="bg-[#FEE2E2] text-[#B91C1C]">
                            {item.status}
                          </Badge>
                        )}
                      </div>

                      <dl className="mt-4 space-y-2 text-xs text-slate-600">
                        {item.applicationNumber && (
                          <div className="flex gap-2">
                            <dt className="w-32 shrink-0 text-[#B91C1C]">
                              No. permohonan
                            </dt>
                            <dd className="font-semibold text-slate-900">
                              {item.applicationNumber}
                            </dd>
                          </div>
                        )}
                        {item.classes && (
                          <div className="flex gap-2">
                            <dt className="w-32 shrink-0 text-[#B91C1C]">
                              Kelas
                            </dt>
                            <dd className="font-semibold text-slate-900">
                              {item.classes}
                            </dd>
                          </div>
                        )}
                        {item.filingDate && (
                          <div className="flex gap-2">
                            <dt className="w-32 shrink-0 text-[#B91C1C]">
                              Tanggal ajukan
                            </dt>
                            <dd>{item.filingDate}</dd>
                          </div>
                        )}
                        {item.priorityDate && (
                          <div className="flex gap-2">
                            <dt className="w-32 shrink-0 text-[#B91C1C]">
                              Tanggal prioritas
                            </dt>
                            <dd>{item.priorityDate}</dd>
                          </div>
                        )}
                      </dl>

                      <details className="mt-4 rounded-lg border border-[#FECACA] bg-[#FFF1F2] p-3 text-xs text-[#991B1B] transition hover:border-[#FCA5A5]">
                        <summary className="cursor-pointer font-medium text-[#B91C1C]">
                          Lihat detail mentah
                        </summary>
                        <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words text-[11px] leading-snug text-[#7F1D1D]">
                          {JSON.stringify(item.raw, null, 2)}
                        </pre>
                      </details>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-dashed border-[#FECACA] bg-[#FFF1F2] p-10 text-center text-sm text-[#B91C1C]"
              >
                Setelah pencarian, hasil resmi dari DJKI akan tampil di sini
                lengkap dengan status, kelas, dan nomor permohonan.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

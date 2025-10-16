'use client';

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ClassResponse = {
  data: {
    class: number;
    title: string;
    description: string;
    total: number;
    keyword: string | null;
    items: Array<{ indo: string; english: string }>;
  };
  error?: string;
};

const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent";

export function ClassSearchClient() {
  const [classNumber, setClassNumber] = useState<string>("1");
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<ClassResponse["data"] | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [keyword]);

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ class: classNumber });
        if (debouncedKeyword) params.set("keyword", debouncedKeyword);
        const res = await fetch(`/api/pdki/classes?${params.toString()}`, {
          signal: controller.signal,
        });
        const body: ClassResponse = await res.json();
        if (!res.ok || body.error) {
          throw new Error(
            body.error ?? "Gagal mengambil data klasifikasi dari DJKI.",
          );
        }
        setPayload(body.data);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          console.error(err);
          setError(
            "Tidak dapat terhubung ke sistem klasifikasi DJKI. Silakan coba lagi beberapa saat.",
          );
          setPayload(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    run();
    return () => controller.abort();
  }, [classNumber, debouncedKeyword]);

  const items = useMemo(() => payload?.items ?? [], [payload]);

  const classOptions = useMemo(
    () =>
      Array.from({ length: 45 }, (_, index) => {
        const number = index + 1;
        return {
          value: String(number),
          label: number.toString().padStart(2, "0"),
        };
      }),
    [],
  );

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#FECACA] bg-white shadow-xl">
      <div className="absolute inset-x-10 top-[-8rem] h-48 rounded-full bg-[#FEE2E2]/70 blur-3xl" />
      <div className="absolute inset-x-0 bottom-[-8rem] h-56 rounded-full bg-[#FDE68A]/60 blur-3xl" />

      <div className="relative rounded-[inherit] bg-white/95 p-6 sm:p-8">
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Basis data klasifikasi Nice resmi
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Pilih kelas 1-45 untuk menelusuri contoh barang/jasa sesuai
                daftar Nice Classification yang dipakai DJKI.
              </p>
            </div>
            <Badge className="w-fit bg-[#FEE2E2] text-[#B91C1C]">
              Data dari skm.dgip.go.id
            </Badge>
          </header>

          <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-500">
                Pilih kelas Nice
              </label>
              <Select
                value={classNumber}
                onValueChange={(value) => {
                  setClassNumber(value);
                  setKeyword("");
                }}
              >
              <SelectTrigger className="h-12 border-[#FECACA] bg-[#FFF1F2] text-sm font-semibold text-[#B91C1C] shadow-sm focus:ring-[#F87171]">
                <SelectValue placeholder="Pilih kelas" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                  {classOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      Kelas {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-500">
                Saring berdasarkan kata kunci
              </label>
              <Input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="contoh: kosmetik, konsultasi, perangkat lunak..."
                className="h-12 border-[#FECACA] bg-[#FFF1F2] text-[#7F1D1D] placeholder:text-[#B91C1C]/60 focus-visible:ring-[#F87171]"
              />
              <p className="text-xs text-slate-500">
                Filter dilakukan pada sisi server agar tetap ringan meskipun
                jumlah entri per kelas mencapai ribuan.
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
              >
                {error}
              </motion.div>
            ) : isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-4 sm:grid-cols-2"
              >
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative h-32 rounded-2xl border border-[#FECACA] bg-[#FFF1F2]",
                      shimmer,
                    )}
                  />
                ))}
              </motion.div>
            ) : payload ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6"
              >
                <Card className="border-[#FECACA] bg-white">
                  <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardDescription className="text-xs uppercase tracking-wide text-[#DC2626]">
                        Ringkasan Kelas
                      </CardDescription>
                      <CardTitle className="text-2xl font-semibold text-slate-900">
                        {payload.title || `Kelas ${payload.class}`}
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs text-[#B91C1C]">
                      {payload.total.toLocaleString("id-ID")} entri
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {payload.description ||
                        "Deskripsi kelas tidak tersedia. Gunakan daftar di bawah untuk menilai relevansi barang atau jasa Anda."}
                    </p>
                  </CardContent>
                </Card>

                <div className="rounded-3xl border border-[#FECACA] bg-white shadow-inner shadow-[#FECACA]/60">
                  <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500">
                    <span>
                      Menampilkan{" "}
                      <strong className="text-[#B91C1C]">
                        {items.length.toLocaleString("id-ID")}
                      </strong>{" "}
                      contoh barang/jasa
                      {payload.keyword
                        ? ` untuk kata "${payload.keyword}"`
                        : ""}{" "}
                      dalam kelas {payload.class.toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="max-h-[420px] overflow-y-auto border-t border-[#FECACA]">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-[#FFF1F2]">
                        <tr>
                          <th className="w-1/2 px-4 py-3 text-left font-medium text-[#B91C1C]">
                            Bahasa Indonesia
                          </th>
                          <th className="w-1/2 px-4 py-3 text-left font-medium text-[#B91C1C]">
                            Bahasa Inggris
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/70 bg-white">
                        {items.map((item, index) => (
                          <tr key={`${item.indo}-${index}`}>
                            <td className="whitespace-pre-wrap px-4 py-3 align-top text-slate-800">
                              {item.indo || "-"}
                            </td>
                            <td className="whitespace-pre-wrap px-4 py-3 align-top text-slate-600">
                              {item.english || "-"}
                            </td>
                          </tr>
                        ))}
                        {!items.length && (
                          <tr>
                            <td
                              colSpan={2}
                              className="px-4 py-12 text-center text-sm text-slate-500"
                            >
                              Tidak ada entri yang cocok dengan kata kunci yang
                              Anda gunakan. Coba kata lain atau hapus filter.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-dashed border-[#FECACA] bg-[#FFF1F2] px-6 py-10 text-center text-sm text-[#B91C1C]"
              >
                Pilih kelas untuk melihat daftar barang dan jasa sesuai Nice
                Classification.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

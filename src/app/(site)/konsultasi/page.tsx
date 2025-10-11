"use client";

import { useState } from "react";
import {
  Loader2,
  Sparkles,
  ShieldCheck,
  Clock,
  FileText,
  MessageSquare,
  Share2,
  ArrowRight,
  Mail,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGlobalAlert } from "@/components/global-alert/GlobalAlertProvider";
import { cn } from "@/lib/utils";

const services = [
  "Pendaftaran Merek",
  "Perpanjangan Merek",
  "Cetak Sertifikat Merek",
  "Perubahan Nama/Alamat",
  "Pengalihan Hak Merek",
  "Tanggapan Usul Tolak",
  "Surat Keberatan",
  "Perjanjian Lisensi",
] as const;

const FormSchema = z.object({
  email: z.string().email("Email tidak valid"),
  brandName: z.string().min(2, "Nama merek terlalu pendek").max(120, "Maksimal 120 karakter"),
  applicantName: z.string().min(2, "Nama pemohon terlalu pendek").max(120, "Maksimal 120 karakter"),
  service: z.string().min(1, "Pilih salah satu layanan"),
  company_website: z.string().optional(), // honeypot
});

const successDescription =
  "Terima kasih, tim kami akan menghubungi kamu via Email untuk langkah selanjutnya.";

type FormValues = z.infer<typeof FormSchema>;

export default function KonsultasiPage() {
  const [submitted, setSubmitted] = useState(false);
  const { showAlert } = useGlobalAlert();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      brandName: "",
      applicantName: "",
      service: "",
      company_website: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (values.company_website && values.company_website.trim().length > 0) return;

    try {
      const response = await fetch("/konsultasi/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok) {
        throw new Error(
          payload?.message ??
            "Terjadi kendala saat mengirim permintaan konsultasi. Coba beberapa saat lagi."
        );
      }

      form.reset();
      setSubmitted(true);

      showAlert({
        tone: "success",
        title: "Data konsultasi berhasil dikirim",
        description: successDescription,
      });

      if (payload?.emailSent === false) {
        showAlert({
          tone: "warning",
          title: "Notifikasi email tertunda",
          description:
            "Data konsultasimu sudah kami simpan, namun email notifikasi ke tim internal gagal terkirim. Kami akan cek secara manual.",
        });
      }
    } catch (error) {
      console.error(error);
      showAlert({
        tone: "error",
        title: "Gagal mengirim form",
        description:
          error instanceof Error ? error.message : "Terjadi kendala tak terduga. Silakan coba kembali.",
      });
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div
      className={cn(
        "relative min-h-[78vh] w-full overflow-hidden",
        // background: radial glow + diagonal gradient + grid halus
        // "bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(220,38,38,0.12),transparent),linear-gradient(180deg,#fafafa,white)]"
      )}
    >
      {/* dekor: grid halus */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:24px_24px]"
      />
      {/* dekor: blur pill */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-24 h-64 w-64 rounded-full bg-[#DC2626]/20 blur-3xl"
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        {/* HEADER STRIP */}
        <div className="mx-auto mb-8 flex w-full max-w-3xl items-center justify-center gap-2 rounded-full border border-red-100 bg-white/80 px-4 py-2 text-sm shadow-sm backdrop-blur">
          <Sparkles className="size-4 text-[#DC2626]" />
          <span className="font-medium text-slate-700">
            Konsultasi Merek • Perlindungan Resmi DJKI
          </span>
          <ShieldCheck className="size-4 text-emerald-600" />
        </div>

        {submitted ? (
          // ====== SUCCESS STATE ======
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <Card className="border-smooth bg-white/95 shadow-[0_40px_120px_-60px_rgba(220,38,38,0.55)]">
              <CardHeader className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#DC2626]/10 px-4 py-2 text-sm font-semibold text-[#DC2626]">
                  <Sparkles className="size-4" />
                  Konsultasi terkirim
                </div>
                <CardTitle className="flex items-center gap-3 text-3xl font-semibold text-slate-900">
                  Terima kasih! <span className="text-xl">✅</span>
                </CardTitle>
                <CardDescription className="text-base text-slate-600">
                  {successDescription}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* hero art */}
                <div className="relative mx-auto max-w-2xl">
                  <img
                    src="/assets/illus/um-success-mail.png"
                    alt="Email terkirim—konfirmasi konsultasi"
                    className="mx-auto h-auto w-full max-w-[620px]"
                    loading="eager"
                  />
                </div>

                {/* steps */}
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      icon: Mail,
                      title: "1) Konfirmasi",
                      desc: "Email ringkasan konsultasi dikirim otomatis.",
                      art: "/assets/illus/um-inbox-check.png",
                    },
                    {
                      icon: Clock,
                      title: "2) 1×24 Jam Kerja",
                      desc: "Ahli kami menganalisis merek & data awal.",
                      art: "/assets/illus/um-24h-calendar.png",
                    },
                    {
                      icon: ShieldCheck,
                      title: "3) Rekomendasi",
                      desc: "Kamu terima rekomendasi langkah aman ke DJKI.",
                      art: "/assets/illus/um-djki-shield.png",
                    },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="group rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm transition hover:shadow-md"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <s.icon className="size-5 text-[#DC2626]" />
                        <p className="font-semibold text-slate-800">{s.title}</p>
                      </div>
                      <p className="text-sm text-slate-600">{s.desc}</p>
                      <img
                        src={s.art}
                        alt={s.title}
                        className="mt-3 h-20 w-auto opacity-95"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>

                {/* actions */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="brand"
                    className="rounded-xl"
                    onClick={() => setSubmitted(false)}
                  >
                    Kirim konsultasi lain
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => (window.location.href = "https://wa.me/6282267890152")}
                  >
                    <MessageSquare className="mr-2 size-4" />
                    Butuh cepat? Chat Ahli via WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SIDE PANEL */}
            <aside className="space-y-6">
              <Card className="border-smooth bg-white/95">
                <CardHeader>
                  <CardTitle className="text-lg">Dokumen yang biasanya diminta</CardTitle>
                  <CardDescription>Siapkan agar prosesnya makin cepat.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <FileText className="mt-0.5 size-4 text-[#DC2626]" />
                      Logo/namamerk (PNG/SVG) & daftar kelas NICE.
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="mt-0.5 size-4 text-[#DC2626]" />
                      Data pemohon (perorangan/PT/CV) & alamat resmi.
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="mt-0.5 size-4 text-[#DC2626]" />
                      Bukti penggunaan (opsional tapi membantu analisis).
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-smooth bg-white/95">
                <CardHeader>
                  <CardTitle className="text-lg">Bagikan ke timmu</CardTitle>
                  <CardDescription>Kirimi link ini untuk melengkapi data.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl"
                    onClick={() => navigator.share?.({ title: "Konsultasi Merek", url: location.href })}
                  >
                    <Share2 className="mr-2 size-4" />
                    Share Halaman Konsultasi
                  </Button>
                </CardContent>
              </Card>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900">
                <p className="font-semibold">Terdaftar di DJKI</p>
                <p className="opacity-90">
                  Semua pengajuan dilakukan resmi ke DJKI setelah data lengkap. Kamu akan dapat
                  bukti permohonan di hari yang sama.*
                </p>
              </div>
            </aside>
          </div>
        ) : (
          // ====== FORM STATE ======
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <Card className="border-smooth bg-white/95 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.45)] transition hover:shadow-[0_50px_130px_-60px_rgba(220,38,38,0.35)]">
              <CardHeader className="space-y-2">
                <CardTitle className="text-3xl font-semibold text-slate-900">
                  Konsultasi Merek
                </CardTitle>
                <CardDescription className="max-w-xl text-base text-slate-600">
                  Ceritakan sedikit tentang merekmu. Tim ahli kami akan melakukan analisis awal
                  sebelum menghubungi kamu.
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Alamat Email <span className="text-[#DC2626]">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="nama@email.com"
                              autoComplete="email"
                              disabled={isSubmitting}
                              className="h-11 rounded-xl border-smooth bg-white/90"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Kami akan mengirim update progress ke email ini.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brandName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nama Merek <span className="text-[#DC2626]">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="contoh: Kopi Nusantara"
                              autoComplete="off"
                              disabled={isSubmitting}
                              className="h-11 rounded-xl border-smooth bg-white/90"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Gunakan nama yang tampil pada produk, jasa, atau etalase onlinemu.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="applicantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nama Pemohon <span className="text-[#DC2626]">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nama kamu / perusahaan"
                              autoComplete="name"
                              disabled={isSubmitting}
                              className="h-11 rounded-xl border-smooth bg-white/90"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Orang yang bisa kami hubungi untuk konfirmasi data.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Jasa Layanan <span className="text-[#DC2626]">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || undefined} disabled={isSubmitting}>
                            <FormControl>
                              <SelectTrigger className="h-11 w-full rounded-xl border-smooth bg-white/90">
                                <SelectValue placeholder="Pilih layanan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-smooth">
                              {services.map((service) => (
                                <SelectItem key={service} value={service}>
                                  {service}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>Pilih layanan yang paling sesuai.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                      {...form.register("company_website")}
                    />

                    <Button
                      type="submit"
                      variant="brand"
                      className={cn(
                        "w-full rounded-xl py-3 text-base font-semibold tracking-wide shadow-md transition",
                        "focus-visible:ring-[#DC2626]/40 focus-visible:ring-offset-2"
                      )}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="size-5 animate-spin" />
                          Mengirim...
                        </span>
                      ) : (
                        <>
                          Kirim Konsultasi
                          <ArrowRight className="ml-2 size-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* SIDE ILLUSTRATION + TRUST */}
            <aside className="space-y-6">
              <Card className="border-smooth bg-white/90">
                <CardContent className="pt-6">
                  <img
                    src="/assets/illus/um-consult-form.png"
                    alt="Ilustrasi isi formulir konsultasi merek"
                    className="mx-auto w-full max-w-[320px]"
                  />
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-sm text-emerald-900">
                    <p className="flex items-center gap-2 font-medium">
                      <ShieldCheck className="size-4" /> Resmi diajukan ke DJKI
                    </p>
                    <p className="opacity-90">Bukti permohonan kamu diterbitkan di hari yang sama*.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-smooth bg-white/90">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Bantuan cepat</CardTitle>
                  <CardDescription>Chat langsung dengan ahli kami.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl"
                    onClick={() => (window.location.href = "https://wa.me/6282267890152")}
                  >
                    <MessageSquare className="mr-2 size-4" />
                    WhatsApp Ahli Merek
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

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
  brandName: z
    .string()
    .min(2, "Nama merek terlalu pendek")
    .max(120, "Maksimal 120 karakter"),
  applicantName: z
    .string()
    .min(2, "Nama pemohon terlalu pendek")
    .max(120, "Maksimal 120 karakter"),
  service: z.string().min(1, "Pilih salah satu layanan"),
  company_website: z.string().optional(),
});

const successDescription =
  "Terima kasih, tim kami akan menghubungi kamu via Email untuk langkah selanjutnya.";

type FormValues = z.infer<typeof FormSchema>;

export function KonsultasiForm() {
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
    if (values.company_website && values.company_website.trim().length > 0)
      return;

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
          error instanceof Error
            ? error.message
            : "Terjadi kendala tak terduga. Silakan coba kembali.",
      });
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className={cn("relative min-h-[78vh] w-full overflow-hidden")}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:24px_24px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-24 h-64 w-64 rounded-full bg-[#DC2626]/20 blur-3xl"
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto mb-8 flex w-full max-w-3xl items-center justify-center gap-2 rounded-full border border-red-100 bg-white/80 px-4 py-2 text-sm shadow-sm backdrop-blur">
          <Sparkles className="size-4 text-[#DC2626]" />
          <span className="font-medium text-slate-700">
            Konsultasi Merek • Perlindungan Resmi DJKI
          </span>
          <ShieldCheck className="size-4 text-emerald-600" />
        </div>

        {submitted ? (
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
                <div className="relative mx-auto max-w-2xl">
                  <img
                    src="/assets/illus/um-success-mail.png"
                    alt="Email terkirim—konfirmasi konsultasi"
                    className="mx-auto h-auto w-full max-w-[620px]"
                    loading="eager"
                  />
                </div>

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

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="brand"
                    className="rounded-xl"
                    onClick={() => setSubmitted(false)}
                  >
                    Kirim konsultasi lain
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    asChild
                  >
                    <a href="/monitoring-merek" className="flex items-center gap-2">
                      Monitoring merek Anda
                      <Share2 className="size-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 bg-white/90 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-900">
                  Jadwalkan panggilan lanjutan
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Konsultan Urus Merek siap membantu perencanaan strategi perlindungan merek dagang Anda.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/70 p-4">
                  <ShieldCheck className="mt-1 size-5 text-emerald-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-800">Tim berlisensi DJKI</p>
                    <p className="text-sm text-slate-600">
                      Pendampingan dari konsultan resmi yang memahami regulasi terbaru.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/70 p-4">
                  <Clock className="mt-1 size-5 text-amber-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-800">Respon cepat 1×24 jam kerja</p>
                    <p className="text-sm text-slate-600">
                      Kami prioritaskan konsultasi berdasarkan urgensi dan tenggat DJKI.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/70 p-4">
                  <FileText className="mt-1 size-5 text-sky-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-800">Rencana aksi personal</p>
                    <p className="text-sm text-slate-600">
                      Anda akan menerima outline langkah-langkah berikutnya secara tertulis.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full rounded-xl"
                  asChild
                >
                  <a href="mailto:hello@urusmerek.id" className="flex items-center justify-center gap-2">
                    Email tim konsultan
                    <Mail className="size-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <Card className="border-smooth bg-white/95 shadow-[0_40px_120px_-60px_rgba(220,38,38,0.45)]">
              <CardHeader className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#DC2626]/10 px-4 py-2 text-sm font-semibold text-[#DC2626]">
                  <Sparkles className="size-4" />
                  Form konsultasi merek
                </div>
                <CardTitle className="text-3xl font-semibold text-slate-900">
                  Ceritakan kebutuhan perlindungan merek Anda
                </CardTitle>
                <CardDescription className="text-base text-slate-600">
                  Jawab beberapa pertanyaan singkat agar konsultan kami dapat menyiapkan rekomendasi yang paling relevan.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email utama</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="nama@perusahaan.com"
                              autoComplete="email"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Masukkan email aktif yang mudah dihubungi.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brandName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama merek yang ingin dilindungi</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: Kopi Nusantara" required {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="applicantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama pemohon atau perusahaan</FormLabel>
                          <FormControl>
                            <Input placeholder="PT Merek Inovasi" required {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Layanan yang dibutuhkan</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Pilih salah satu" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem key={service} value={service}>
                                  {service}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company_website"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormLabel>Website perusahaan (optional)</FormLabel>
                          <FormControl>
                            <Input type="text" tabIndex={-1} autoComplete="off" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      variant="brand"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          Kirim permintaan konsultasi
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 bg-white/90 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-900">
                  Kenapa memilih Urus Merek?
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Pendampingan end-to-end untuk memastikan proses pendaftaran merek Anda berjalan lancar.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {[ 
                  {
                    icon: ShieldCheck,
                    title: "Tim berlisensi DJKI",
                    desc: "Pakar hukum kekayaan intelektual dengan pengalaman lintas industri.",
                  },
                  {
                    icon: MessageSquare,
                    title: "Pendampingan strategis",
                    desc: "Kami bantu menyiapkan dokumen, strategi kelas, hingga tanggapan usul tolak.",
                  },
                  {
                    icon: Share2,
                    title: "Kolaborasi mudah",
                    desc: "Integrasi dengan dashboard Urus Merek untuk memantau progres setiap tahap.",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/70 p-4"
                  >
                    <feature.icon className="mt-1 size-5 text-[#DC2626]" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-800">{feature.title}</p>
                      <p className="text-sm text-slate-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}

                <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4">
                  <p className="text-sm font-semibold text-slate-800">Butuh bantuan cepat?</p>
                  <p className="text-sm text-slate-600">
                    Hubungi kami melalui WhatsApp di <a href="https://wa.me/6281234567890" className="text-[#DC2626] underline">0812-3456-7890</a> untuk konsultasi prioritas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

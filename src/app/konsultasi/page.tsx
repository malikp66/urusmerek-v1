"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
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
    .max(120, "Nama merek maksimal 120 karakter"),
  applicantName: z
    .string()
    .min(2, "Nama pemohon terlalu pendek")
    .max(120, "Nama pemohon maksimal 120 karakter"),
  service: z.string().min(1, "Pilih salah satu layanan"),
  company_website: z.string().optional(),
});

const successDescription =
  "Terima kasih, tim kami akan menghubungi kamu via WhatsApp/Email untuk langkah selanjutnya.";

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
    if (values.company_website && values.company_website.trim().length > 0) {
      return;
    }

    try {
      const response = await fetch("/konsultasi/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.ok) {
        const message =
          payload?.message ??
          "Terjadi kendala saat mengirim permintaan konsultasi. Coba beberapa saat lagi.";

        throw new Error(message);
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
    <div className="bg-slate-50/80">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center px-4 py-16 sm:px-6">
        {submitted ? (
          <Card className="border-smooth bg-white/95 shadow-[0_40px_120px_-60px_rgba(220,38,38,0.65)]">
            <CardHeader className="space-y-4 text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#DC2626]/10 px-4 py-2 text-sm font-semibold text-[#DC2626]">
                <Sparkles className="size-4" />
                Konsultasi terkirim
              </div>
              <CardTitle className="text-3xl font-semibold text-slate-900">
                Terima kasih! ✅
              </CardTitle>
              <CardDescription className="text-base text-slate-600">
                {successDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-left">
              <p className="text-sm text-slate-500">
                Tim UrusMerek sudah menerima detail konsultasimu dan akan menghubungi dalam 1x24 jam kerja.
              </p>
              <Button
                type="button"
                variant="brand"
                className="w-full sm:w-auto"
                onClick={() => {
                  setSubmitted(false);
                }}
              >
                Kirim konsultasi lain
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-smooth bg-white/95 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.45)] transition hover:shadow-[0_50px_130px_-60px_rgba(220,38,38,0.35)]">
            <CardHeader className="space-y-2 text-left">
              <CardTitle className="text-3xl font-semibold text-slate-900">
                Konsultasi Merek
              </CardTitle>
              <CardDescription className="max-w-xl text-base text-slate-600">
                Ceritakan sedikit tentang merekmu. Tim ahli kami akan melakukan analisis awal sebelum menghubungi kamu.
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
                        <FormDescription>
                          Kami akan mengirim update progress ke email ini.
                        </FormDescription>
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
                        <FormDescription>
                          Orang yang bisa kami hubungi untuk konfirmasi data.
                        </FormDescription>
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                          disabled={isSubmitting}
                        >
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
                        <FormDescription>
                          Pilih layanan yang paling sesuai dengan kebutuhanmu saat ini.
                        </FormDescription>
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
                      "Konsultasi"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

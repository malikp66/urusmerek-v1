import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ShieldCheck, BarChart3, MessageSquare } from 'lucide-react';

import { getCurrentUser } from '@/lib/auth';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Masuk Admin | urusmerek.id',
  description:
    'Akses panel admin urusmerek.id untuk mengelola mitra, konsultasi, dan operasi bisnis dengan aman.',
  robots: {
    index: false,
    follow: false,
  },
};

const highlights = [
  {
    icon: ShieldCheck,
    title: 'Keamanan Tingkat Tinggi',
    description: 'Otentikasi berlapis memastikan hanya tim internal yang dapat mengakses data sensitif.',
  },
  {
    icon: BarChart3,
    title: 'Pantau Kinerja',
    description: 'Dashboard real-time membantu memantau performa mitra dan progres komisi.',
  },
  {
    icon: MessageSquare,
    title: 'Respons Lebih Cepat',
    description: 'Kelola konsultasi dan permintaan penarikan secara terstruktur dari satu tempat.',
  },
] as const;

export default async function AdminLoginPage() {
  const session = await getCurrentUser();

  if (session?.role === 'admin') {
    redirect('/admin');
  }

  return (
    <main className="relative flex min-h-screen flex-col bg-white lg:flex-row">
      <section className="relative hidden min-h-screen flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-rose-600 via-red-600 to-amber-500 p-10 text-white lg:flex">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/admin/login-illustration.svg"
            alt="Ilustrasi login admin"
            fill
            priority
            className="object-contain object-center"
            sizes="50vw"
          />
        </div>
        <div className="relative z-10 flex items-center gap-3 text-lg font-semibold">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Image src="/admin/shield-icon.svg" alt="urusmerek admin" width={40} height={40} priority />
          </div>
          <div className="leading-tight">
            <p className="text-sm uppercase tracking-widest text-white/75">urusmerek.id</p>
            <p className="text-2xl font-semibold text-white">Portal Admin</p>
          </div>
        </div>
        <div className="relative z-10 max-w-md space-y-6">
          <div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl text-white">Kelola Operasional dengan Percaya Diri</h1>
            <p className="mt-4 text-base text-white/80">
              Semua modul kemitraan, konsultasi, dan keuangan terintegrasi dalam satu panel yang cepat dan aman.
            </p>
          </div>
          <ul className="space-y-4">
            {highlights.map((item) => (
              <li key={item.title} className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur">
                <item.icon className="mt-1 size-5 flex-shrink-0 text-white" />
                <div className="space-y-1">
                  <p className="text-lg font-semibold">{item.title}</p>
                  <p className="text-sm text-white/80">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative z-10 text-xs uppercase tracking-[0.3em] text-white/50">
          © {new Date().getFullYear()} urusmerek.id
        </div>
      </section>

      <section className="relative flex w-full items-center justify-center bg-white px-6 py-16 sm:px-10 lg:max-w-xl lg:px-12">
        <div className="absolute inset-x-0 top-0 hidden h-40 bg-gradient-to-b from-rose-200/40 to-transparent lg:block" />
        <div className="relative z-10 mx-auto w-full max-w-md space-y-10">
          <div className="flex flex-col items-center text-center">
            <Image src="/admin/shield-icon.svg" alt="urusmerek admin" width={56} height={56} priority />
            <h2 className="mt-6 text-3xl font-semibold text-gray-900">Masuk ke Panel Admin</h2>
            <p className="mt-3 text-sm text-gray-500">
              Gunakan kredensial internal yang telah diberikan untuk mengakses fitur pengelolaan urusmerek.id.
            </p>
          </div>
          <div className="rounded-2xl border border-rose-100 bg-white/90 p-8 shadow-lg shadow-rose-100/30">
            <LoginForm />
          </div>
          <div className="flex flex-col items-center gap-3 text-sm text-gray-500">
            <p>Butuh bantuan? Hubungi koordinator operasional Anda secara langsung.</p>
            <Link href="/" className="inline-flex items-center gap-2 text-rose-600 transition hover:text-rose-700">
              <span>Kembali ke halaman utama</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

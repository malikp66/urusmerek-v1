import '@/app/globals.css';

import { redirect } from 'next/navigation';

import Link from 'next/link';
import { type ReactNode } from 'react';
import {
  BarChart3,
  Briefcase,
  CircleDollarSign,
  FileText,
  Settings,
  Users,
} from 'lucide-react';

import { requireAdmin } from '@/lib/auth-guards';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AdminNavMenu, type AdminNavigationItem } from './AdminNavMenu';

const NAVIGATION: AdminNavigationItem[] = [
  { title: 'Dashboard', href: '/admin', icon: BarChart3 },
  { title: 'Mitra', href: '/admin/mitra', icon: Users },
  { title: 'Konsultasi', href: '/admin/konsultasi', icon: FileText },
  { title: 'Withdraw', href: '/admin/withdraw', icon: CircleDollarSign },
  { title: 'Pengaturan Komisi', href: '/admin/settings/commission', icon: Settings },
  { title: 'Fitur Lain', href: '/admin/features', icon: Briefcase, badge: 'Segera' },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin().catch(() => null);

  if (!session) {
    redirect('/');
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader>
          <Link href="/admin" className="flex items-center gap-2 rounded-md px-2 py-1">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
              UM
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">UrusMerek</span>
              <span className="text-xs text-muted-foreground leading-tight">Admin Panel</span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Utama</SidebarGroupLabel>
            <SidebarGroupContent>
              <AdminNavMenu items={NAVIGATION} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="rounded-md bg-muted/40 px-3 py-2 text-xs leading-tight text-muted-foreground">
            Masuk sebagai <span className="font-medium text-foreground">Admin #{session?.sub}</span>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-muted/30">
        <header className="border-b bg-background/80 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-4">
            <SidebarTrigger />
            <div className="flex flex-col">
              <h1 className="text-base font-semibold leading-none">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Kelola mitra dan operasional</p>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

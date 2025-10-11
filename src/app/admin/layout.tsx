import '@/app/globals.css';

import { redirect } from 'next/navigation';

import Link from 'next/link';
import { type ReactNode } from 'react';
import { requireAdmin } from '@/lib/auth-guards';
import { signOut } from '@/lib/actions/signout';
import { LangSwitcher } from '@/components/lang/LangSwitcher';
import { Button } from '@/components/ui/button';
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
import { getLocaleFromRequest, getTranslations } from '@/lib/i18n/server';
const NAVIGATION: AdminNavigationItem[] = [
  { title: 'Dashboard', href: '/admin', icon: 'barChart3' },
  { title: 'Mitra', href: '/admin/mitra', icon: 'users' },
  { title: 'Konsultasi', href: '/admin/konsultasi', icon: 'fileText' },
  { title: 'Withdraw', href: '/admin/withdraw', icon: 'circleDollarSign' },
  { title: 'Profil', href: '/admin/profile', icon: 'userCircle' },
  { title: 'Pengaturan Komisi', href: '/admin/settings/commission', icon: 'settings' },
  { title: 'Fitur Lain', href: '/admin/features', icon: 'briefcase', badge: 'Segera' },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin().catch(() => null);
  const locale = await getLocaleFromRequest();
  const tLayout = await getTranslations('panels.admin.layout', locale);
  const tNav = await getTranslations('panels.admin.navigation', locale);

  const navigation: AdminNavigationItem[] = [
    { title: tNav('dashboard'), href: '/admin', icon: 'barChart3' },
    { title: tNav('partners'), href: '/admin/mitra', icon: 'users' },
    { title: tNav('consultations'), href: '/admin/konsultasi', icon: 'fileText' },
    { title: tNav('withdraw'), href: '/admin/withdraw', icon: 'circleDollarSign' },
    {
      title: tNav('commissionSettings'),
      href: '/admin/settings/commission',
      icon: 'settings',
    },
    {
      title: tNav('features'),
      href: '/admin/features',
      icon: 'briefcase',
      badge: tNav('featuresBadge'),
    },
  ];

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
              <span className="text-sm font-semibold leading-tight">{tLayout('brandPrimary')}</span>
              <span className="text-xs text-muted-foreground leading-tight">{tLayout('brandSecondary')}</span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{tLayout('navGroupLabel')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <AdminNavMenu items={navigation} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <form action={signOut} className="grid gap-2">
            <div className="rounded-md bg-muted/40 px-3 py-2 text-xs leading-tight text-muted-foreground">
              Masuk sebagai <span className="font-medium text-foreground">Admin #{session?.sub}</span>
            </div>
            <Button type="submit" variant="outline" className="h-8 justify-start text-xs">
              Sign out
            </Button>
          </form>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-muted/30">
        <header className="border-b bg-background/80 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-4">
            <SidebarTrigger />
            <div className="flex flex-col">
              <h1 className="text-base font-semibold leading-none">{tLayout('headerTitle')}</h1>
              <p className="text-xs text-muted-foreground">{tLayout('headerDescription')}</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <LangSwitcher />
              <Button asChild variant="outline">
                <Link href="/">{tLayout('backToSite')}</Link>
              </Button>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import "@/app/globals.css";

import Link from "next/link";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { BarChart3, CreditCard, UserCircle } from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
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
} from "@/components/ui/sidebar";
import { AdminNavMenu, type AdminNavigationItem } from "@/app/admin/AdminNavMenu";

const NAV_ITEMS: AdminNavigationItem[] = [
  { title: "Dashboard", href: "/mitra/affiliates", icon: BarChart3 },
  { title: "Withdraw", href: "/mitra/withdraw", icon: CreditCard },
  { title: "Profil", href: "/mitra/profile", icon: UserCircle },
];

export default async function MitraLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentUser();
  if (!session || session.role !== "mitra") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader>
          <Link href="/mitra/affiliates" className="flex items-center gap-2 rounded-md px-2 py-1">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-base font-semibold">
              UM
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">Mitra Panel</span>
              <span className="text-xs text-muted-foreground leading-tight">UrusMerek</span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigasi</SidebarGroupLabel>
            <SidebarGroupContent>
              <AdminNavMenu items={NAV_ITEMS} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="rounded-md bg-muted/40 px-3 py-2 text-xs leading-tight text-muted-foreground">
            Masuk sebagai <span className="font-medium text-foreground">Mitra #{session.sub}</span>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-muted/30">
        <header className="border-b bg-background/80 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-4">
            <SidebarTrigger />
            <div className="flex flex-col">
              <h1 className="text-base font-semibold leading-none">Panel Mitra</h1>
              <p className="text-xs text-muted-foreground">Kelola komisi dan performa referral.</p>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

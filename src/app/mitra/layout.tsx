import "@/app/globals.css";

import Link from "next/link";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/lib/actions/signout";
import { LangSwitcher } from "@/components/lang/LangSwitcher";
import { Button } from "@/components/ui/button";
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
import { getLocaleFromRequest, getTranslations } from "@/lib/i18n/server";

export default async function MitraLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentUser();
  const locale = getLocaleFromRequest();
  const t = getTranslations("panels.partner.layout", locale);
  const navLabels = t<{ dashboard: string; withdraw: string; profile: string }>("navItems");
  const navigation: AdminNavigationItem[] = [
    { title: navLabels.dashboard, href: "/mitra/affiliates", icon: "barChart3" },
    { title: navLabels.withdraw, href: "/mitra/withdraw", icon: "creditCard" },
    { title: navLabels.profile, href: "/mitra/profile", icon: "userCircle" },
  ];
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
              <span className="text-sm font-semibold leading-tight">{t("brandPrimary")}</span>
              <span className="text-xs text-muted-foreground leading-tight">{t("brandSecondary")}</span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t("navGroupLabel")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <AdminNavMenu items={navigation} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="rounded-md bg-muted/40 px-3 py-2 text-xs leading-tight text-muted-foreground">
            {t("signedInAs").replace("{id}", session.sub)}
          </div>
          <form action={signOut} className="grid gap-2">
            <div className="rounded-md bg-muted/40 px-3 py-2 text-xs leading-tight text-muted-foreground">
              Masuk sebagai <span className="font-medium text-foreground">Mitra #{session.sub}</span>
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
              <h1 className="text-base font-semibold leading-none">{t("headerTitle")}</h1>
              <p className="text-xs text-muted-foreground">{t("headerDescription")}</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <LangSwitcher />
              <Button asChild variant="outline">
                <Link href="/">{t("backToSite")}</Link>
              </Button>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Briefcase,
  CircleDollarSign,
  CreditCard,
  FileText,
  Settings,
  UserCircle,
  Users,
} from "lucide-react";

const ICON_MAP = {
  barChart3: BarChart3,
  users: Users,
  fileText: FileText,
  circleDollarSign: CircleDollarSign,
  settings: Settings,
  briefcase: Briefcase,
  creditCard: CreditCard,
  userCircle: UserCircle,
} as const;

type IconKey = keyof typeof ICON_MAP;

export type AdminNavigationItem = {
  title: string;
  href: string;
  icon: IconKey;
  badge?: string;
};

export function AdminNavMenu({ items }: { items: AdminNavigationItem[] }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <SidebarMenu>
      {items.map((item) => {
        const IconComponent = ICON_MAP[item.icon] ?? ICON_MAP.barChart3;

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton asChild isActive={isActive(item.href)}>
              <Link href={item.href} className="flex items-center gap-2">
                <IconComponent className="size-4" />
                <span>{item.title}</span>
                {item.badge ? <Badge variant="secondary">{item.badge}</Badge> : null}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

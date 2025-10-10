import type { ReactNode } from "react";

import Footer from "@/components/sections/footer";
import NavigationHeader from "@/components/sections/navigation-header";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavigationHeader />
      <main className="relative mt-20 flex-1">{children}</main>
      <Footer />
    </div>
  );
}

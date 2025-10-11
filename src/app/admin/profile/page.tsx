import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth-guards";
import { signOut } from "@/lib/actions/sign-out";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminProfilePage() {
  const session = await requireAdmin().catch(() => null);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Profil Admin</h1>
        <p className="text-sm text-muted-foreground">
          Kelola preferensi akun dan keluar dari panel admin ketika selesai bekerja.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Keluar dari Panel</CardTitle>
          <CardDescription>
            Hentikan sesi admin Anda di perangkat ini untuk menjaga keamanan akun.
          </CardDescription>
        </CardHeader>
        <CardFooter className="border-t justify-end">
          <form action={signOut}>
            <Button type="submit" variant="destructive">
              Keluar
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

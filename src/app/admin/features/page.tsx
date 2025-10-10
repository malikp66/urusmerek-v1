import { requireAdmin } from '@/lib/auth-guards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminFeaturesPlaceholderPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Fitur Mendatang</h2>
        <p className="text-sm text-muted-foreground">
          Ruang untuk fitur admin tambahan seperti manajemen konten dan laporan lanjutan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Segera Hadir</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Kami sedang menyiapkan fitur lanjutan seperti:
            <br />• Export laporan komisi dan transaksi.
            <br />• Automasi notifikasi untuk mitra.
            <br />• Integrasi pembayaran dan pencatatan bukti transfer.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

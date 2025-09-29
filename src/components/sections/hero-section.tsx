import Image from "next/image";

const services = [
  {
    name: "Pendaftaran Merek",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/1kLoj8UkXEaJzqpbLhnGQK/78a22bec17ad80746b1b649cbfa7c1b6/tasks.svg",
  },
  {
    name: "Perpanjangan",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/7GB7O6Kg7q1ouB7LQRaxPi/9c9ce1116822f4f12181396c32d8b528/docs.svg",
  },
  {
    name: "Surat Keberatan",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/7MqGgkMNjMmHKd5bE6G8VZ/e11962f1688dba77b57f8ac00388e1f2/gantt.svg",
  },
  {
    name: "Banding",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/4pELfkucykUliBs955mmB1/a296804ab8fa5735641bde6cb0fd82c5/forms.svg",
  },
  {
    name: "Pengalihan Hak",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/6SB8kXExiVbLkbhcQH3bA1/8a613cfe129bdd78687b4ede40e697ca/dashboards.svg",
  },
  {
    name: "Lisensi Merek",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/3GU8BuwIs7zQ2gq6DODK0E/c0833c2a402a37fc4eb9588275dde294/chat.svg",
  },
];

export default function HeroSection() {
  return (
    <section className="bg-background py-20 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <h1 className="tracking-tighter">
              Daftar Merek Tanpa Drama, 1 Hari Langsung Terlindungi
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Kami urus semua kebutuhan perlindungan merek Anda, dari awal hingga akhir. Cepat, mudah, dan terpercaya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href="#"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-colors h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Mulai Konsultasi
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-colors border border-primary h-12 px-8 bg-background text-primary hover:bg-accent"
              >
                Lihat Semua Paket
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Konsultasi gratis. Tanpa biaya tersembunyi.
            </p>
          </div>
          <div className="bg-card p-6 sm:p-8 rounded-xl border border-border shadow-sm">
            <div className="flex flex-col space-y-4">
              <div>
                <h3 className="text-2xl font-semibold">Layanan Utama Kami</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Pilih layanan yang sesuai dengan kebutuhan bisnis Anda.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2">
                {services.map((service) => (
                  <div
                    key={service.name}
                    className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-gray-50/50 p-4 text-center"
                  >
                    <div className="relative h-8 w-8">
                       <Image
                        src={service.icon}
                        alt={`${service.name} icon`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {service.name}
                    </span>
                  </div>
                ))}
              </div>
              <a
                href="#"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-colors h-11 px-4 py-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
              >
                Mulai Pendaftaran
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
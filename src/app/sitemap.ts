import type { MetadataRoute } from "next";

const baseUrl = "https://www.urusmerek.id";

const routes = [
  "/",
  "/cari-kelas-merek",
  "/cek-merek",
  "/konsultasi",
  "/monitoring-merek",
  "/tentang-kami",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((path) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: path === "/" ? "hourly" : "daily",
    priority: path === "/" ? 1 : 0.8,
  }));
}

import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const BASE_URL = "https://skm.dgip.go.id/index.php/skm/detailkelas";

function isValidClass(value: string | null): value is string {
  if (!value) return false;
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric >= 1 && numeric <= 45;
}

function filterItems(
  items: Array<{ indo: string; english: string }>,
  term?: string,
) {
  if (!term) return items;
  const keyword = term.toLowerCase();
  return items.filter(
    (item) =>
      item.indo.toLowerCase().includes(keyword) ||
      item.english.toLowerCase().includes(keyword),
  );
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const classParam = url.searchParams.get("class");
  const keyword = url.searchParams.get("keyword")?.trim();

  if (!isValidClass(classParam)) {
    return NextResponse.json(
      { error: "Parameter 'class' wajib diisi dengan angka 1-45." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${BASE_URL}/${classParam}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Gagal mengambil data kelas dari SKM DJKI.",
          status: response.status,
        },
        { status: response.status },
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const classTitle =
      $("h2")
        .first()
        .text()
        .trim()
        .replace(/\s+/g, " ") || `Kelas ${classParam}`;

    const description =
      $(".templatemo-content p").first().text().trim().replace(/\s+/g, " ") ||
      "";

    const items: Array<{ indo: string; english: string }> = [];

    $("table tbody tr").each((_, row) => {
      const cells = $(row)
        .find("td")
        .map((__, cell) => $(cell).text().trim())
        .get();

      if (cells.length >= 2) {
        items.push({ indo: cells[0], english: cells[1] });
      }
    });

    const filtered = filterItems(items, keyword);

    return NextResponse.json({
      data: {
        class: Number(classParam),
        title: classTitle,
        description,
        total: filtered.length,
        keyword: keyword ?? null,
        items: filtered,
      },
    });
  } catch (error) {
    console.error("PDKI class proxy error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses permintaan kelas merek." },
      { status: 500 },
    );
  }
}

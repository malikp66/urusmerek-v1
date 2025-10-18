import { NextRequest, NextResponse } from "next/server";

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

    const classTitle =
      extractFirstMatch(html, /<h2[^>]*>([\s\S]*?)<\/h2>/i) ?? `Kelas ${classParam}`;

    const description =
      extractFirstMatch(html, /<div[^>]*class=["'][^"']*templatemo-content[^"']*["'][^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/i) ??
      "";

    const items = extractTableRows(html);

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

function extractTableRows(html: string): Array<{ indo: string; english: string }> {
  const rows: Array<{ indo: string; english: string }> = [];

  const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;

  for (const rowMatch of html.matchAll(rowPattern)) {
    const rowHtml = rowMatch[1];
    if (/<th/i.test(rowHtml)) {
      continue; // Skip header rows
    }

    const cellPattern = /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi;
    const cells = Array.from(rowHtml.matchAll(cellPattern))
      .map((cellMatch) => normalizeHtmlText(cellMatch[1]))
      .filter((value) => value.length > 0);

    if (cells.length >= 2) {
      rows.push({ indo: cells[0], english: cells[1] });
    }
  }

  return rows;
}

function extractFirstMatch(html: string, pattern: RegExp): string | undefined {
  const match = html.match(pattern);
  if (!match?.[1]) {
    return undefined;
  }
  const text = normalizeHtmlText(match[1]);
  return text.length > 0 ? text : undefined;
}

function normalizeHtmlText(value: string): string {
  return decodeHtmlEntities(
    value
      .replace(/<br\s*\/?>(\s*<br\s*\/?>)*/gi, "\n")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(?:x([0-9a-fA-F]+)|([0-9]+));/g, (_, hex, dec) => {
      const codePoint = hex ? parseInt(hex, 16) : parseInt(dec, 10);
      if (!Number.isFinite(codePoint)) {
        return "";
      }
      try {
        return String.fromCodePoint(codePoint);
      } catch {
        return "";
      }
    });
}

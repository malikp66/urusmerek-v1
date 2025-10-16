import { NextRequest, NextResponse } from "next/server";
import { createCipheriv } from "crypto";

const ENCRYPTION_KEY = "Ym4OlEZmDPSPZBCnRsjLQ2pGLRYyAfqT";
const IV = "1LYCgGZpZksSZuA4";
const BASE_URL = "https://pdki-indonesia.dgip.go.id";

type SignaturePayload = {
  signature: string;
  timestamp: string;
};

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
  Accept: "application/json, text/plain, */*",
  Connection: "keep-alive",
};

function generateSignature(): SignaturePayload {
  const futureTimestamp = new Date(Date.now() + 10000).toString();
  const cipher = createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "utf-8"),
    Buffer.from(IV, "utf-8"),
  );

  let encrypted = cipher.update(futureTimestamp, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return {
    signature: `PDKI/${encrypted}`,
    timestamp: futureTimestamp,
  };
}

async function bootstrapCookies() {
  const response = await fetch(BASE_URL, {
    headers: { ...DEFAULT_HEADERS, "Cache-Control": "no-cache" },
    redirect: "manual",
  });

  const cookieList =
    response.headers.getSetCookie?.() ??
    (response.headers.get("set-cookie")
      ? [response.headers.get("set-cookie") as string]
      : []);

  const clean = cookieList
    .map((cookie) => cookie.split(";")[0])
    .filter(Boolean)
    .join("; ");

  return clean;
}

function buildQuery(keyword: string, page: number, record: number) {
  const params = new URLSearchParams({
    keyword,
    page: String(page),
    record: String(record),
    type: "trademark",
    showFilter: "true",
  });

  return `${BASE_URL}/api/search?${params.toString()}`;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const keyword = url.searchParams.get("keyword")?.trim();
  const page = Number(url.searchParams.get("page") ?? "1");
  const record = Number(url.searchParams.get("record") ?? "10");

  if (!keyword) {
    return NextResponse.json(
      { error: "Parameter 'keyword' wajib diisi." },
      { status: 400 },
    );
  }

  if (Number.isNaN(page) || page < 1) {
    return NextResponse.json(
      { error: "Parameter 'page' tidak valid." },
      { status: 400 },
    );
  }

  if (Number.isNaN(record) || record < 1 || record > 50) {
    return NextResponse.json(
      { error: "Parameter 'record' harus di antara 1-50." },
      { status: 400 },
    );
  }

  try {
    const cookieHeader = await bootstrapCookies();
    const { signature, timestamp } = generateSignature();
    const apiUrl = buildQuery(keyword, page, record);

    const response = await fetch(apiUrl, {
      headers: {
        ...DEFAULT_HEADERS,
        Cookie: cookieHeader,
        "pdki-signature": signature,
        "pdki-time": timestamp,
        "Cache-Control": "no-cache",
        Referer: BASE_URL + "/",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        {
          error: "Permintaan ke PDKI tidak berhasil.",
          status: response.status,
          details: text.slice(0, 2000),
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({ data, meta: { keyword, page, record } });
  } catch (error) {
    console.error("PDKI trademark proxy error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data PDKI." },
      { status: 500 },
    );
  }
}

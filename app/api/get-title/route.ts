import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

const TIMEOUT_MS = 5000;
const USER_AGENT = "Mozilla/5.0 (compatible; WebTitleFetcher/1.0)";

interface TitleResponse {
  title: string;
  error?: string;
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function extractTitle($: cheerio.CheerioAPI): string {
  // Priority order for title extraction
  const sources = [
    () => $('meta[property="og:site_name"]').attr("content"),
    () => $('meta[property="og:title"]').attr("content"),
    () => $('meta[name="twitter:title"]').attr("content"),
    () => $("title").text(),
  ];

  for (const source of sources) {
    const title = source();
    if (title?.trim()) {
      return title.trim();
    }
  }

  return "";
}

export async function GET(
  request: Request
): Promise<NextResponse<TitleResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get("url");

    if (!urlParam) {
      return NextResponse.json(
        { title: "", error: "URL parameter is required" },
        { status: 400 }
      );
    }

    const fullUrl = urlParam.startsWith("http")
      ? urlParam
      : `https://${urlParam}`;
    const response = await fetchWithTimeout(fullUrl);

    if (!response.ok) {
      return NextResponse.json({ title: urlParam });
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const title = extractTitle($) || urlParam;

    return NextResponse.json({ title });
  } catch (error) {
    // Log error for debugging but don't expose details to client
    console.error("Title fetch error:", error);
    return NextResponse.json({
      title: new URL(request.url).searchParams.get("url") || "",
      error: "Failed to fetch title",
    });
  }
}

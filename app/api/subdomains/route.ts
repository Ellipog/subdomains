import { NextResponse } from "next/server";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const TIMEOUT = 10000; // 10 seconds

async function fetchWithTimeout(
  url: string,
  retryCount = 0
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SubdomainFetcher/1.0)",
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (retryCount < MAX_RETRIES) {
      console.log(`Retry attempt ${retryCount + 1} for ${url}`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchWithTimeout(url, retryCount + 1);
    }
    throw error;
  }
}

interface Certificate {
  name_value: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json(
        { error: "Domain parameter is required" },
        { status: 400 }
      );
    }

    // Clean the domain input
    const cleanDomain = domain
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "");

    const response = await fetchWithTimeout(
      `https://crt.sh/?q=%.${cleanDomain}&output=json`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Deduplicate and filter subdomains
    const subdomains = new Set<string>();
    data.forEach((cert: Certificate) => {
      const name = cert.name_value.toLowerCase();
      if (name.endsWith(cleanDomain) && name !== cleanDomain) {
        // Remove wildcard entries and clean the subdomain
        const cleanName = name.replace(/^\*\./, "");
        subdomains.add(cleanName);
      }
    });

    const subdomainArray = Array.from(subdomains);

    if (subdomainArray.length === 0) {
      return NextResponse.json({
        subdomains: [],
        message: "No subdomains found for this domain",
      });
    }

    return NextResponse.json({ subdomains: subdomainArray });
  } catch (error) {
    console.error("API Error:", error);

    // Return a more informative error response
    return NextResponse.json(
      {
        subdomains: [],
        error: "Failed to fetch subdomains",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}

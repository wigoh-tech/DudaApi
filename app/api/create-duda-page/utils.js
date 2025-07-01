import { NextResponse } from "next/server";

export function generateUniqueId() {
  return Math.random().toString(36).substr(2, 6);
}

export function extractDivId(htmlString) {
  if (!htmlString) return null;
  const idMatch = htmlString.match(/<div[^>]*\sid="(\d+)"/);
  if (idMatch) return idMatch[1];
  const dudaIdMatch = htmlString.match(/duda_id="(\d+)"/);
  return dudaIdMatch ? dudaIdMatch[1] : null;
}

export async function withRetry(fn, maxRetries = 3, delayMs = 2000) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const response = await fn();
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      const rawResponse = await response.text();
      try {
        return JSON.parse(rawResponse);
      } catch (e) {
        if (rawResponse.startsWith("<")) {
          throw new Error(`Received HTML instead of JSON. Response start: ${rawResponse.substring(0, 100)}`);
        }
        throw new Error(`Invalid JSON response: ${rawResponse.substring(0, 100)}`);
      }
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) {
        throw new Error(`All ${maxRetries} attempts failed. Last error: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
    }
  }
}

export function handleError(error) {
  console.error("Error:", error);
  return NextResponse.json(
    { success: false, error: error.message },
    { status: 500 }
  );
}
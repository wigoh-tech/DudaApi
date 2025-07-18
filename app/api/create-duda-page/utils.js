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


export function handleError(error) {
  console.error("Error:", error);
  return NextResponse.json(
    { success: false, error: error.message },
    { status: 500 }
  );
}

// Add this to your utils.js file
export function generateNumericId(length = 8) {
  const digits = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return result;
}

import { NextResponse } from "next/server";
import { createPageFromScratch } from "./createPage";
import { getFlexStructure, extractHierarchicalIds } from "./flexStructure";
import { parsePageHtml } from "./htmlParser";
import { executeBatchOperations } from "./batchOperations";
import { handleError } from "./utils";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("API route hit successfully");
    console.log("Request body:", body);

    // Extract batchRequestBody from the request body
    const { batchRequestBody, ...createPageData } = body;

    // Validate that batchRequestBody exists
    if (!batchRequestBody) {
      throw new Error("batchRequestBody is required in the request body");
    }

    // Step 1: Create page from scratch
    const createPageResult = await createPageFromScratch(createPageData);
    console.log(
      "Full Duda API Response:",
      JSON.stringify(createPageResult, null, 2)
    );

    // Step 2: Extract required data from the response
    const uuid = createPageResult.page?.uuid;
    const alias = createPageResult.page?.alias;
    const itemUrl = createPageResult.page?.itemUrl;
    const pageId = createPageResult.page?.id;

    if (!uuid || !pageId) {
      throw new Error("UUID or PageID not found in create page response");
    }

    // Step 3: Get flex structure using the UUID
    const flexStructureData = await getFlexStructure(uuid, alias);
    console.log(
      "Flex Structure Response:",
      JSON.stringify(flexStructureData, null, 2)
    );

    // Step 4: Extract hierarchical IDs from flex structure
    const extractedIds = extractHierarchicalIds(flexStructureData);
    console.log("Extracted Hierarchical IDs:", extractedIds);

    // Step 5: Parse HTML to match sections
    const { matchedSections, htmlIds, flexWidgetIds } = await parsePageHtml(
      alias,
      extractedIds
    );

    // Step 6: Execute batch operations with the batchRequestBody from the request
    const batchResults = await executeBatchOperations(
      pageId,
      uuid,
      alias,
      extractedIds,
      htmlIds,
      flexWidgetIds,
      batchRequestBody // This now comes from the request body
    );

    // Step 7: Return comprehensive response
    return NextResponse.json({
      success: batchResults.some((r) => r.success),
      data: {
        createPage: createPageResult,
        extractedData: { uuid, alias, itemUrl, pageId },
        flexStructure: flexStructureData,
        extractedIds,
        matchedSections,
        htmlIds,
        flexWidgetIds,
        batchResults,
        summary: {
          totalSections: extractedIds.length,
          successfulInsertions: batchResults.filter((r) => r.success).length,
          failedInsertions: batchResults.filter((r) => !r.success).length,
        },
      },
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return handleError(error);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

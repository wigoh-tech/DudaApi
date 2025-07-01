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

    // Step 1: Create page from scratch
    const createPageData = await createPageFromScratch(body);
    console.log("Full Duda API Response:", JSON.stringify(createPageData, null, 2));

    // Step 2: Extract required data from the response
    const uuid = createPageData.page?.uuid;
    const alias = createPageData.page?.alias;
    const itemUrl = createPageData.page?.itemUrl;
    const pageId = createPageData.page?.id;

    if (!uuid || !pageId) {
      throw new Error("UUID or PageID not found in create page response");
    }

    // Step 3: Get flex structure using the UUID
    const flexStructureData = await getFlexStructure(uuid, alias);
    console.log("Flex Structure Response:", JSON.stringify(flexStructureData, null, 2));

    // Step 4: Extract hierarchical IDs from flex structure
    const extractedIds = extractHierarchicalIds(flexStructureData);
    console.log("Extracted Hierarchical IDs:", extractedIds);

    // Step 5: Parse HTML to match sections
    const { matchedSections, htmlIds, flexWidgetIds } = await parsePageHtml(alias, extractedIds);
    
    // Step 6: Execute batch operations
    const batchResults = await executeBatchOperations(
      pageId, 
      uuid, 
      alias, 
      extractedIds, 
      htmlIds, 
      flexWidgetIds
    );

    // Step 7: Return comprehensive response
    return NextResponse.json({
      success: batchResults.some((r) => r.success),
      data: {
        createPage: createPageData,
        extractedData: { uuid, alias, itemUrl, pageId },
        flexStructure: flexStructureData,
        extractedIds,
        batchResults,
        summary: {
          totalSections: extractedIds.length,
          successfulInsertions: batchResults.filter((r) => r.success).length,
          failedInsertions: batchResults.filter((r) => !r.success).length,
        },
      },
    });
  } catch (error) {
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
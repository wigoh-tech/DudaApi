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

    // Extract both batch request bodies from the request body
    const { primaryBatchBody, secondaryBatchBody, ...createPageData } = body;

    // Validate that at least one batch request body exists
    if (!primaryBatchBody && !secondaryBatchBody) {
      throw new Error(
        "At least one batch request body (primary or secondary) is required"
      );
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

    // Step 6: Execute batch operations section by section with both batch bodies
    const batchResults = await executeBatchOperationsSectionBySection(
      pageId,
      uuid,
      alias,
      extractedIds,
      htmlIds,
      flexWidgetIds,
      primaryBatchBody,
      secondaryBatchBody
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
          successfulPrimaryBatch: batchResults.filter(
            (r) => r.primaryBatch?.success
          ).length,
          successfulSecondaryBatch: batchResults.filter(
            (r) => r.secondaryBatch?.success
          ).length,
          failedPrimaryBatch: batchResults.filter(
            (r) => r.primaryBatch && !r.primaryBatch.success
          ).length,
          failedSecondaryBatch: batchResults.filter(
            (r) => r.secondaryBatch && !r.secondaryBatch.success
          ).length,
        },
      },
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return handleError(error);
  }
}

// Fixed function to execute batch operations section by section
async function executeBatchOperationsSectionBySection(
  pageId,
  uuid,
  alias,
  extractedIds,
  htmlIds,
  flexWidgetIds,
  primaryBatchBody,
  secondaryBatchBody
) {
  console.log("\n===== STARTING SECTION-BY-SECTION BATCH OPERATIONS =====");
  const allResults = [];

  for (let i = 0; i < extractedIds.length; i++) {
    const section = extractedIds[i];
    const htmlId = htmlIds[i];
    const flexWidgetId = flexWidgetIds[i];

    const sectionResult = {
      sectionIndex: i + 1,
      sectionId: section.sectionId,
      htmlIdUsed: htmlId,
      primaryBatch: null,
      secondaryBatch: null,
      success: false,
      error: null,
    };

    try {
      // Execute primary batch for section i if provided
      if (primaryBatchBody && primaryBatchBody.length > 0 && i === 0) {
        // Primary batch only for first section (index 0)
        const primaryResult = await executeBatchOperations(
          pageId,
          uuid,
          alias,
          [section],
          [htmlId],
          [flexWidgetId],
          primaryBatchBody
        );

        sectionResult.primaryBatch = {
          success: primaryResult[0]?.success || false,
          insertedElements: primaryResult[0]?.insertedElements || [],
          batchResponses: primaryResult[0]?.batchResponses || [],
          flexStructureUpdateResponse: primaryResult[0]?.flexStructureUpdateResponse,
          error: primaryResult[0]?.error,
        };

        // Wait before proceeding to secondary batch
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Execute secondary batch for section i if provided
      if (secondaryBatchBody && secondaryBatchBody.length > 0 && i === 1) {
        // Secondary batch only for second section (index 1)
        // Get fresh data for the current section only
        const freshSectionData = await getFreshSectionData(
          uuid,
          alias,
          section.sectionId
        );

        const secondaryResult = await executeBatchOperations(
          pageId,
          uuid,
          alias,
          [freshSectionData.section],
          [freshSectionData.htmlId],
          [freshSectionData.flexWidgetId],
          secondaryBatchBody
        );

        sectionResult.secondaryBatch = {
          success: secondaryResult[0]?.success || false,
          insertedElements: secondaryResult[0]?.insertedElements || [],
          batchResponses: secondaryResult[0]?.batchResponses || [],
          flexStructureUpdateResponse: secondaryResult[0]?.flexStructureUpdateResponse,
          error: secondaryResult[0]?.error,
        };
      }

      // Determine overall success based on which batches should execute for this section
      const shouldExecutePrimary = primaryBatchBody && primaryBatchBody.length > 0 && i === 0;
      const shouldExecuteSecondary = secondaryBatchBody && secondaryBatchBody.length > 0 && i === 1;
      
      sectionResult.success = 
        (!shouldExecutePrimary || sectionResult.primaryBatch?.success) &&
        (!shouldExecuteSecondary || sectionResult.secondaryBatch?.success);

      // If no batch should execute for this section, mark as success
      if (!shouldExecutePrimary && !shouldExecuteSecondary) {
        sectionResult.success = true;
      }

    } catch (error) {
      console.error(`Error processing section ${i + 1}:`, error);
      sectionResult.error = error.message;
    }

    allResults.push(sectionResult);
    
    // Add delay between sections
    if (i < extractedIds.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  return allResults;
}

// Helper function to get fresh data for a single section
async function getFreshSectionData(uuid, alias, sectionId) {
  const freshFlexStructureData = await getFlexStructure(uuid, alias);
  const freshExtractedIds = extractHierarchicalIds(freshFlexStructureData);
  const freshSection = freshExtractedIds.find(s => s.sectionId === sectionId);
  
  const { htmlIds: freshHtmlIds, flexWidgetIds: freshFlexWidgetIds } = 
    await parsePageHtml(alias, [freshSection]);
  
  return {
    section: freshSection,
    htmlId: freshHtmlIds[0],
    flexWidgetId: freshFlexWidgetIds[0]
  };
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

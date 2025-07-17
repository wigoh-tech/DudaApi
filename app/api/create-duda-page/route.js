import { NextResponse } from "next/server";
import { createPageFromScratch } from "./createPage";
import { getFlexStructure, extractHierarchicalIds } from "./flexStructure";
import { parsePageHtml } from "./htmlParser";
import { executeBatchOperations } from "./batchOperations";
import { handleError } from "./utils";
import { handleDynamicInsertApi } from "./insertApi"; // Import the new function
import {
  extractWidgetIds,
  getWidgetIdsFlat,
  matchWidgetIdsWithHtmlContent,
  getDetailedMatchInfo,
  matchWidgetIdsWithElementsData,
  getDetailedContentForMatches,
  filterMatches,
} from "./widgetExtractor";
import {
  parseAboutHtmlPage,
  matchWidgetIdsWithElements,
  getInnerContentForMatches,
} from "./parseAboutHtmlPage";

// NEW: Function to extract only widget IDs in a clean format
function extractOnlyWidgetIds(widgetData) {
  const result = {
    primary: [],
    secondary: [],
  };

  if (widgetData.primary && Array.isArray(widgetData.primary)) {
    widgetData.primary.forEach((section) => {
      if (section.widgets && Array.isArray(section.widgets)) {
        section.widgets.forEach((widget) => {
          if (widget.id) {
            result.primary.push({ id: widget.id });
          }
        });
      }
    });
  }

  if (widgetData.secondary && Array.isArray(widgetData.secondary)) {
    widgetData.secondary.forEach((section) => {
      if (section.widgets && Array.isArray(section.widgets)) {
        section.widgets.forEach((widget) => {
          if (widget.id) {
            result.secondary.push({ id: widget.id });
          }
        });
      }
    });
  }

  return result;
}

// NEW: Function to extract IDs from flex structure
function extractFlexStructureIds(flexStructureData) {
  const extractedWidgets = extractWidgetIds(flexStructureData);
  const ids = [];

  extractedWidgets.forEach((section) => {
    if (section.widgets && Array.isArray(section.widgets)) {
      section.widgets.forEach((widget) => {
        if (widget.id) {
          ids.push({ id: widget.id });
        }
      });
    }
  });

  return ids;
}

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

    // Extract widget IDs from the input batch bodies
    let primaryWidgetIds = [];
    let secondaryWidgetIds = [];

    if (primaryBatchBody && Array.isArray(primaryBatchBody)) {
      primaryWidgetIds = extractWidgetIds(primaryBatchBody);
      console.log("Primary Batch Widget IDs:", primaryWidgetIds);
    }

    if (secondaryBatchBody && Array.isArray(secondaryBatchBody)) {
      secondaryWidgetIds = extractWidgetIds(secondaryBatchBody);
      console.log("Secondary Batch Widget IDs:", secondaryWidgetIds);
    }

    // Parse the about HTML page to extract the dm div
    const aboutPageData = await parseAboutHtmlPage(
      createPageData.siteId || "41e002a2"
    );
    console.log("About page parsing result:", aboutPageData.success,
      aboutPageData.message);

    // Step 1: Create page from scratch
    console.log("\n=== STEP 1: CREATING PAGE FROM SCRATCH ===");
    const createPageResult = await createPageFromScratch(createPageData);
    console.log("✅ Page creation API triggered successfully");
    console.log("Create Page API Response:", JSON.stringify(createPageResult, null, 2));

    // Step 2: Extract required data from the response
    const uuid = createPageResult.page?.uuid;
    const alias = createPageResult.page?.alias;
    const itemUrl = createPageResult.page?.itemUrl;
    const pageId = createPageResult.page?.id;

    if (!uuid || !pageId) {
      throw new Error("UUID or PageID not found in create page response");
    }

    console.log(`\n=== EXTRACTED DATA ===`);
    console.log(`UUID: ${uuid}`);
    console.log(`Alias: ${alias}`);
    console.log(`Page ID: ${pageId}`);
    console.log(`Item URL: ${itemUrl}`);

    // Step 3: Get flex structure using the UUID
    console.log("\n=== STEP 3: GETTING FLEX STRUCTURE ===");
    const flexStructureData = await getFlexStructure(uuid, alias);
    console.log("✅ Flex Structure API triggered successfully");
    console.log("Flex Structure API Response:", JSON.stringify(flexStructureData, null, 2));

    // Step 4: Extract hierarchical IDs from flex structure
    const extractedIds = extractHierarchicalIds(flexStructureData);
    console.log("\n=== STEP 4: HIERARCHICAL IDS EXTRACTION ===");
    console.log("Extracted Hierarchical IDs:", extractedIds);

    // Extract widget IDs from the actual flex structure response
    const flexStructureWidgetIds = extractWidgetIds(flexStructureData);
    console.log("Flex Structure Widget IDs:", flexStructureWidgetIds);

    // Step 5: Parse HTML to match sections
    console.log("\n=== STEP 5: PARSING HTML ===");
    const { matchedSections, htmlIds, flexWidgetIds } = await parsePageHtml(
      alias,
      extractedIds
    );
    console.log("✅ HTML parsing completed successfully");
    console.log("HTML Parsing Results:", {
      matchedSections: matchedSections.length,
      htmlIds: htmlIds.length,
      flexWidgetIds: flexWidgetIds.length
    });

    // Extract only widget IDs in clean format
    const inputBatchIds = extractOnlyWidgetIds({
      primary: primaryWidgetIds,
      secondary: secondaryWidgetIds,
    });

    const flexStructureIds = extractFlexStructureIds(flexStructureData);

    // Create widgetIdsOnly object
    const widgetIdsOnly = {
      fromInputBatches: inputBatchIds,
      fromFlexStructure: flexStructureIds,
      flatList: getWidgetIdsFlat(flexStructureData).map((id) => ({ id })),
      count: {
        inputPrimary: inputBatchIds.primary.length,
        inputSecondary: inputBatchIds.secondary.length,
        flexStructure: flexStructureIds.length,
        total:
          inputBatchIds.primary.length +
          inputBatchIds.secondary.length +
          flexStructureIds.length,
      },
    };

    // Step 6: Enhanced widget matching with elementsWithIds
    console.log("\n=== STEP 6: ENHANCED WIDGET MATCHING ===");
    let enhancedMatching = {
      matches: [],
      summary: {},
      detailedMatches: [],
      filteredMatches: {
        withContent: [],
        exactMatches: [],
        primarySourceMatches: [],
      },
    };

    if (aboutPageData.success && aboutPageData.elementsWithIds) {
      console.log("✅ Enhanced widget matching API triggered successfully");
      console.log("Starting enhanced widget matching...");

      // Match widget IDs with elements data
      const matchingResult = matchWidgetIdsWithElementsData(
        widgetIdsOnly,
        aboutPageData.elementsWithIds
      );

      // Get detailed content for matches
      const detailedMatches = getDetailedContentForMatches(
        matchingResult.matches
      );

      // Filter matches by different criteria
      const filteredMatches = {
        withContent: filterMatches(matchingResult.matches, {
          hasContent: true,
        }),
        exactMatches: filterMatches(matchingResult.matches, {
          matchType: "exact",
        }),
        primarySourceMatches: filterMatches(matchingResult.matches, {
          widgetSource: "primary",
        }),
        highScoreMatches: filterMatches(matchingResult.matches, {
          minMatchScore: 80,
        }),
      };

      enhancedMatching = {
        matches: matchingResult.matches,
        summary: matchingResult.summary,
        matchedWidgetIds: matchingResult.matchedWidgetIds,
        detailedMatches: detailedMatches,
        filteredMatches: filteredMatches,
      };

      // Log detailed matching results
      console.log("Enhanced Matching API Response:", {
        totalMatches: matchingResult.matches.length,
        uniqueWidgetIds: matchingResult.matchedWidgetIds.length,
        matchesWithContent: filteredMatches.withContent.length,
        exactMatches: filteredMatches.exactMatches.length,
        primarySourceMatches: filteredMatches.primarySourceMatches.length,
        highScoreMatches: filteredMatches.highScoreMatches.length
      });

      // Print detailed match information for matches with content
      if (filteredMatches.withContent.length > 0) {
        console.log("\n=== MATCHES WITH CONTENT DETAILS ===");
        filteredMatches.withContent.forEach((match, index) => {
          console.log(`\n--- Match ${index + 1} ---`);
          console.log(`Widget ID: ${match.widgetId}`);
          console.log(`Element ID: ${match.element.id}`);
          console.log(`Match Type: ${match.matchType}`);
          console.log(`Match Score: ${match.matchScore}%`);
          console.log(`Source: ${match.widgetSource}`);
          console.log(`Tag: ${match.element.tagName}`);
          console.log(
            `Text Preview: ${
              match.element.text
                ? match.element.text.substring(0, 100) + "..."
                : "No text"
            }`
          );
          console.log(
            `HTML Preview: ${
              match.element.html
                ? match.element.html.substring(0, 150) + "..."
                : "No HTML"
            }`
          );
        });
      }
    } else {
      console.log("❌ Enhanced widget matching API not triggered - missing required data");
    }

    // Step 7: Original widget matching (keeping for backwards compatibility)
    console.log("\n=== STEP 7: ORIGINAL WIDGET MATCHING ===");
    let widgetMatches = [];
    let detailedMatchInfo = {};
    let htmlElementMatches = [];

    if (aboutPageData.success && aboutPageData.dmDivHtml) {
      console.log("✅ Original widget matching API triggered successfully");
      
      // Match widget IDs from flex structure with HTML content
      widgetMatches = matchWidgetIdsWithHtmlContent(
        flexStructureData,
        aboutPageData.dmDivHtml
      );

      // Get detailed match information
      detailedMatchInfo = getDetailedMatchInfo(
        flexStructureData,
        aboutPageData.dmDivHtml
      );

      // Match with elements if elementsWithIds is available
      if (aboutPageData.elementsWithIds) {
        const flatWidgetIds = getWidgetIdsFlat(flexStructureData);
        htmlElementMatches = matchWidgetIdsWithElements(
          aboutPageData.elementsWithIds,
          flatWidgetIds
        );

        // Get inner content for matches
        const matchesWithContent =
          getInnerContentForMatches(htmlElementMatches);
        htmlElementMatches = matchesWithContent;
      }

      console.log("Original Widget Matching API Response:", {
        htmlContentMatches: widgetMatches.length,
        elementMatches: htmlElementMatches.length,
        matchRate: detailedMatchInfo.summary?.matchRate || "0%"
      });
    } else {
      console.log("❌ Original widget matching API not triggered - missing required data");
    }

    // Step 8: NEW - Handle Dynamic Insert API
    console.log("\n=== STEP 8: DYNAMIC INSERT API ===");
    let dynamicInsertResult = null;
    
    if (primaryBatchBody && Array.isArray(primaryBatchBody) && primaryBatchBody.length > 0) {
      console.log("✅ Dynamic Insert API triggered successfully");
      console.log(`Processing ${primaryBatchBody.length} sections for dynamic insert...`);
      
      try {
        dynamicInsertResult = await handleDynamicInsertApi(
          { primaryBatchBody },
          uuid
        );
        
        console.log("Dynamic Insert API Response:", JSON.stringify(dynamicInsertResult, null, 2));
        
        if (dynamicInsertResult.success) {
          console.log(`✅ Dynamic Insert completed successfully:`);
          console.log(`  - Total sections processed: ${dynamicInsertResult.totalSections}`);
          console.log(`  - Total API calls made: ${dynamicInsertResult.totalApicalls}`);
          console.log(`  - Successful calls: ${dynamicInsertResult.summary.successfulCalls}`);
          console.log(`  - Failed calls: ${dynamicInsertResult.summary.failedCalls}`);
        } else {
          console.log(`❌ Dynamic Insert failed: ${dynamicInsertResult.error}`);
        }
      } catch (error) {
        console.error("❌ Dynamic Insert API error:", error);
        dynamicInsertResult = {
          success: false,
          error: error.message,
          totalSections: 0,
          totalApicalls: 0,
          responses: []
        };
      }
    } else {
      console.log("❌ Dynamic Insert API not triggered - no primary batch body provided");
    }

    // Step 9: Execute batch operations section by section with both batch bodies
    console.log("\n=== STEP 9: BATCH OPERATIONS ===");
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

    console.log("✅ Batch operations completed");
    console.log("Batch Operations API Response:", JSON.stringify(batchResults, null, 2));

    // Step 10: Return comprehensive response with filtered data
    console.log("\n=== STEP 10: PREPARING FINAL RESPONSE ===");
    
    const finalResponse = {
      success: batchResults.some((r) => r.success),
      data: {
        createPage: createPageResult,
        extractedData: { uuid, alias, itemUrl, pageId },
        flexStructure: flexStructureData,

        // NEW: Dynamic Insert API results
        dynamicInsertApi: dynamicInsertResult,

        // Filtered about page data - only showing essential info
        aboutPageData: {
          success: aboutPageData.success,
          message: aboutPageData.message,
          dmDivFound: aboutPageData.dmDivFound,
        },

        // Enhanced widget IDs and matching
        widgetIdsOnly: widgetIdsOnly,

        // NEW: Enhanced widget matching results with filtered matches
        enhancedWidgetMatching: {
          matches: enhancedMatching.matches,
          summary: enhancedMatching.summary,
          matchedWidgetIds: enhancedMatching.matchedWidgetIds,
          detailedMatches: enhancedMatching.detailedMatches,

          // Show only exact matches in filteredMatches
          filteredMatches: {
            exactMatches: enhancedMatching.filteredMatches?.exactMatches || [],
          },
        },

        // Original widget matching (for backwards compatibility)
        widgetMatching: {
          htmlContentMatches: widgetMatches,
          elementMatches: htmlElementMatches,
          detailedMatchInfo: detailedMatchInfo,
          matchSummary: {
            totalWidgetMatches: widgetMatches.length,
            totalElementMatches: htmlElementMatches.length,
            matchesWithInnerContent: htmlElementMatches.filter(
              (m) => m.hasInnerContent
            ).length,
            matchRate: detailedMatchInfo.summary?.matchRate || "0%",
            matchesBySection: detailedMatchInfo.matchesBySection || {},
            matchesByType: detailedMatchInfo.matchesByType || {},
          },
        },

        extractedIds,
        matchedSections,
        htmlIds,
        flexWidgetIds,
        batchResults,
        summary: {
          totalSections: extractedIds.length,
          totalWidgetsInFlexStructure: flexStructureWidgetIds.reduce(
            (sum, section) => sum + section.totalWidgets,
            0
          ),
          widgetsBySection: flexStructureWidgetIds.map((section) => ({
            sectionId: section.sectionId,
            widgetCount: section.totalWidgets,
          })),
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

          // NEW: Dynamic Insert API summary
          dynamicInsertApiSummary: dynamicInsertResult ? {
            triggered: true,
            success: dynamicInsertResult.success,
            totalSections: dynamicInsertResult.totalSections,
            totalApiCalls: dynamicInsertResult.totalApicalls,
            successfulCalls: dynamicInsertResult.summary?.successfulCalls || 0,
            failedCalls: dynamicInsertResult.summary?.failedCalls || 0,
            error: dynamicInsertResult.error || null
          } : {
            triggered: false,
            reason: "No primary batch body provided"
          },

          // Filtered about page parsing summary
          aboutPageParsing: {
            success: aboutPageData.success,
            dmDivFound: aboutPageData.dmDivFound,
            dmDivContentLength: aboutPageData.dmDivContent?.length || 0,
            elementsWithIds: aboutPageData.elementsWithIds?.length || 0,
          },

          // Enhanced widget matching summary with focus on exact matches
          enhancedWidgetMatchingSummary: {
            totalMatches: enhancedMatching.matches.length,
            uniqueWidgetIds: enhancedMatching.matchedWidgetIds?.length || 0,
            matchRate: enhancedMatching.summary?.matchRate || "0%",
            exactMatches:
              enhancedMatching.filteredMatches?.exactMatches?.length || 0,
            // Removed other match types to focus on exact matches
          },

          // Widget IDs summary
          widgetIdsSummary: {
            inputPrimaryCount: inputBatchIds.primary.length,
            inputSecondaryCount: inputBatchIds.secondary.length,
            flexStructureCount: flexStructureIds.length,
            totalExtractedIds:
              inputBatchIds.primary.length +
              inputBatchIds.secondary.length +
              flexStructureIds.length,
          },
        },
      },
    };

    console.log("✅ Final response prepared successfully");
    console.log("Final Response Summary:", {
      success: finalResponse.success,
      createPageSuccess: !!createPageResult.page,
      flexStructureSuccess: !!flexStructureData,
      dynamicInsertTriggered: !!dynamicInsertResult,
      dynamicInsertSuccess: dynamicInsertResult?.success || false,
      batchOperationsSuccess: batchResults.some((r) => r.success),
      totalSections: extractedIds.length,
      totalWidgets: flexStructureWidgetIds.reduce((sum, section) => sum + section.totalWidgets, 0)
    });

    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error("❌ Error in POST handler:", error);
    console.error("Error stack:", error.stack);
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
  console.log(`Total sections to process: ${extractedIds.length}`);
  console.log(`Primary batch body provided: ${!!primaryBatchBody}`);
  console.log(`Secondary batch body provided: ${!!secondaryBatchBody}`);
  
  const allResults = [];

  for (let i = 0; i < extractedIds.length; i++) {
    const section = extractedIds[i];
    const htmlId = htmlIds[i];
    const flexWidgetId = flexWidgetIds[i];

    console.log(`\n--- Processing Section ${i + 1} ---`);
    console.log(`Section ID: ${section.sectionId}`);
    console.log(`HTML ID: ${htmlId}`);
    console.log(`Flex Widget ID: ${flexWidgetId}`);

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
        console.log("✅ Primary batch API triggered for section 1");
        
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

        console.log("Primary batch API response:", JSON.stringify(primaryResult, null, 2));

        sectionResult.primaryBatch = {
          success: primaryResult[0]?.success || false,
          insertedElements: primaryResult[0]?.insertedElements || [],
          batchResponses: primaryResult[0]?.batchResponses || [],
          flexStructureUpdateResponse:
            primaryResult[0]?.flexStructureUpdateResponse,
          error: primaryResult[0]?.error,
        };

        console.log(`Primary batch result: ${sectionResult.primaryBatch.success ? 'SUCCESS' : 'FAILED'}`);
        if (sectionResult.primaryBatch.error) {
          console.log(`Primary batch error: ${sectionResult.primaryBatch.error}`);
        }

        // Wait before proceeding to secondary batch
        console.log("Waiting 2 seconds before proceeding...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else if (primaryBatchBody && primaryBatchBody.length > 0 && i !== 0) {
        console.log("❌ Primary batch API not triggered - only executes for section 1");
      }

      // Execute secondary batch for section i if provided
      if (secondaryBatchBody && secondaryBatchBody.length > 0 && i === 1) {
        console.log("✅ Secondary batch API triggered for section 2");
        
        // Secondary batch only for second section (index 1)
        // Get fresh data for the current section only
        const freshSectionData = await getFreshSectionData(
          uuid,
          alias,
          section.sectionId
        );

        console.log("Fresh section data retrieved:", {
          sectionId: freshSectionData.section.sectionId,
          htmlId: freshSectionData.htmlId,
          flexWidgetId: freshSectionData.flexWidgetId
        });

        const secondaryResult = await executeBatchOperations(
          pageId,
          uuid,
          alias,
          [freshSectionData.section],
          [freshSectionData.htmlId],
          [freshSectionData.flexWidgetId],
          secondaryBatchBody
        );

        console.log("Secondary batch API response:", JSON.stringify(secondaryResult, null, 2));

        sectionResult.secondaryBatch = {
          success: secondaryResult[0]?.success || false,
          insertedElements: secondaryResult[0]?.insertedElements || [],
          batchResponses: secondaryResult[0]?.batchResponses || [],
          flexStructureUpdateResponse:
            secondaryResult[0]?.flexStructureUpdateResponse,
          error: secondaryResult[0]?.error,
        };

        console.log(`Secondary batch result: ${sectionResult.secondaryBatch.success ? 'SUCCESS' : 'FAILED'}`);
        if (sectionResult.secondaryBatch.error) {
          console.log(`Secondary batch error: ${sectionResult.secondaryBatch.error}`);
        }
      } else if (secondaryBatchBody && secondaryBatchBody.length > 0 && i !== 1) {
        console.log("❌ Secondary batch API not triggered - only executes for section 2");
      }

      // Determine overall success based on which batches should execute for this section
      const shouldExecutePrimary =
        primaryBatchBody && primaryBatchBody.length > 0 && i === 0;
      const shouldExecuteSecondary =
        secondaryBatchBody && secondaryBatchBody.length > 0 && i === 1;

      sectionResult.success =
        (!shouldExecutePrimary || sectionResult.primaryBatch?.success) &&
        (!shouldExecuteSecondary || sectionResult.secondaryBatch?.success);

      // If no batch should execute for this section, mark as success
      if (!shouldExecutePrimary && !shouldExecuteSecondary) {
        sectionResult.success = true;
        console.log("✅ Section marked as success - no batches to execute");
      }

      console.log(`Section ${i + 1} overall result: ${sectionResult.success ? 'SUCCESS' : 'FAILED'}`);

    } catch (error) {
      console.error(`❌ Error processing section ${i + 1}:`, error);
      console.error("Error stack:", error.stack);
      sectionResult.error = error.message;
    }

    allResults.push(sectionResult);

    // Add delay between sections
    if (i < extractedIds.length - 1) {
      console.log("Waiting 3 seconds before next section...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  console.log("\n===== BATCH OPERATIONS SUMMARY =====");
  console.log(`Total sections processed: ${allResults.length}`);
  console.log(`Successful sections: ${allResults.filter(r => r.success).length}`);
  console.log(`Failed sections: ${allResults.filter(r => !r.success).length}`);
  console.log(`Primary batch executions: ${allResults.filter(r => r.primaryBatch).length}`);
  console.log(`Secondary batch executions: ${allResults.filter(r => r.secondaryBatch).length}`);

  return allResults;
}

// Helper function to get fresh data for a single section
async function getFreshSectionData(uuid, alias, sectionId) {
  console.log(`Getting fresh data for section: ${sectionId}`);
  
  const freshFlexStructureData = await getFlexStructure(uuid, alias);
  const freshExtractedIds = extractHierarchicalIds(freshFlexStructureData);
  const freshSection = freshExtractedIds.find((s) => s.sectionId === sectionId);

  const { htmlIds: freshHtmlIds, flexWidgetIds: freshFlexWidgetIds } =
    await parsePageHtml(alias, [freshSection]);

  console.log("Fresh section data retrieved successfully");
  
  return {
    section: freshSection,
    htmlId: freshHtmlIds[0],
    flexWidgetId: freshFlexWidgetIds[0],
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
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

    // Step 3: Get initial flex structure using the UUID
    console.log("\n=== STEP 3: GETTING INITIAL FLEX STRUCTURE ===");
    const initialFlexStructureData = await getFlexStructure(uuid, alias);
    console.log("✅ Initial Flex Structure API triggered successfully");
    console.log("Initial Flex Structure API Response:", JSON.stringify(initialFlexStructureData, null, 2));

    // Step 4: Extract hierarchical IDs from initial flex structure
    const initialExtractedIds = extractHierarchicalIds(initialFlexStructureData);
    console.log("\n=== STEP 4: INITIAL HIERARCHICAL IDS EXTRACTION ===");
    console.log("Initial Extracted Hierarchical IDs:", initialExtractedIds);

    // Extract widget IDs from the initial flex structure response
    const initialFlexStructureWidgetIds = extractWidgetIds(initialFlexStructureData);
    console.log("Initial Flex Structure Widget IDs:", initialFlexStructureWidgetIds);

    // Step 5: Parse HTML to match sections (using initial data)
    console.log("\n=== STEP 5: PARSING HTML ===");
    const { matchedSections, htmlIds, flexWidgetIds } = await parsePageHtml(
      alias,
      initialExtractedIds
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

    const initialFlexStructureIds = extractFlexStructureIds(initialFlexStructureData);

    // Create initial widgetIdsOnly object
    const initialWidgetIdsOnly = {
      fromInputBatches: inputBatchIds,
      fromFlexStructure: initialFlexStructureIds,
      flatList: getWidgetIdsFlat(initialFlexStructureData).map((id) => ({ id })),
      count: {
        inputPrimary: inputBatchIds.primary.length,
        inputSecondary: inputBatchIds.secondary.length,
        flexStructure: initialFlexStructureIds.length,
        total:
          inputBatchIds.primary.length +
          inputBatchIds.secondary.length +
          initialFlexStructureIds.length,
      },
    };

    // Step 6: Enhanced widget matching with elementsWithIds (using initial data)
    console.log("\n=== STEP 6: ENHANCED WIDGET MATCHING (INITIAL) ===");
    let initialEnhancedMatching = {
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
      console.log("✅ Initial enhanced widget matching API triggered successfully");
      console.log("Starting initial enhanced widget matching...");

      // Match widget IDs with elements data
      const matchingResult = matchWidgetIdsWithElementsData(
        initialWidgetIdsOnly,
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

      initialEnhancedMatching = {
        matches: matchingResult.matches,
        summary: matchingResult.summary,
        matchedWidgetIds: matchingResult.matchedWidgetIds,
        detailedMatches: detailedMatches,
        filteredMatches: filteredMatches,
      };

      console.log("Initial Enhanced Matching API Response:", {
        totalMatches: matchingResult.matches.length,
        uniqueWidgetIds: matchingResult.matchedWidgetIds.length,
        matchesWithContent: filteredMatches.withContent.length,
        exactMatches: filteredMatches.exactMatches.length,
        primarySourceMatches: filteredMatches.primarySourceMatches.length,
        highScoreMatches: filteredMatches.highScoreMatches.length
      });
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
        initialFlexStructureData,
        aboutPageData.dmDivHtml
      );

      // Get detailed match information
      detailedMatchInfo = getDetailedMatchInfo(
        initialFlexStructureData,
        aboutPageData.dmDivHtml
      );

      // Match with elements if elementsWithIds is available
      if (aboutPageData.elementsWithIds) {
        const flatWidgetIds = getWidgetIdsFlat(initialFlexStructureData);
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
    }

    // Step 8: Dynamic Insert API
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

    // Step 9: Get UPDATED flex structure after dynamic insert
    console.log("\n=== STEP 9: GETTING UPDATED FLEX STRUCTURE AFTER DYNAMIC INSERT ===");
    let updatedFlexStructureData = null;
    let updatedExtractedIds = null;
    let updatedFlexStructureWidgetIds = null;
    let updatedWidgetIdsOnly = null;
    let updatedEnhancedMatching = null;

    if (dynamicInsertResult && dynamicInsertResult.success) {
      console.log("✅ Getting fresh flex structure after dynamic insert...");
      
      // Add a small delay to ensure the dynamic insert operations are fully processed
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        // Get fresh flex structure
        updatedFlexStructureData = await getFlexStructure(uuid, alias);
        console.log("✅ Updated Flex Structure API triggered successfully");
        console.log("Updated Flex Structure API Response:", JSON.stringify(updatedFlexStructureData, null, 2));

        // Extract hierarchical IDs from updated flex structure
        updatedExtractedIds = extractHierarchicalIds(updatedFlexStructureData);
        console.log("Updated Extracted Hierarchical IDs:", updatedExtractedIds);

        // Extract widget IDs from the updated flex structure response
        updatedFlexStructureWidgetIds = extractWidgetIds(updatedFlexStructureData);
        console.log("Updated Flex Structure Widget IDs:", updatedFlexStructureWidgetIds);

        // Create updated widgetIdsOnly object
        const updatedFlexStructureIds = extractFlexStructureIds(updatedFlexStructureData);
        updatedWidgetIdsOnly = {
          fromInputBatches: inputBatchIds,
          fromFlexStructure: updatedFlexStructureIds,
          flatList: getWidgetIdsFlat(updatedFlexStructureData).map((id) => ({ id })),
          count: {
            inputPrimary: inputBatchIds.primary.length,
            inputSecondary: inputBatchIds.secondary.length,
            flexStructure: updatedFlexStructureIds.length,
            total:
              inputBatchIds.primary.length +
              inputBatchIds.secondary.length +
              updatedFlexStructureIds.length,
          },
        };

        // Enhanced widget matching with updated data
        console.log("\n=== STEP 9b: ENHANCED WIDGET MATCHING (UPDATED) ===");
        updatedEnhancedMatching = {
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
          console.log("✅ Updated enhanced widget matching API triggered successfully");
          console.log("Starting updated enhanced widget matching...");

          // Match widget IDs with elements data using updated flex structure
          const updatedMatchingResult = matchWidgetIdsWithElementsData(
            updatedWidgetIdsOnly,
            aboutPageData.elementsWithIds
          );

          // Get detailed content for matches
          const updatedDetailedMatches = getDetailedContentForMatches(
            updatedMatchingResult.matches
          );

          // Filter matches by different criteria
          const updatedFilteredMatches = {
            withContent: filterMatches(updatedMatchingResult.matches, {
              hasContent: true,
            }),
            exactMatches: filterMatches(updatedMatchingResult.matches, {
              matchType: "exact",
            }),
            primarySourceMatches: filterMatches(updatedMatchingResult.matches, {
              widgetSource: "primary",
            }),
            highScoreMatches: filterMatches(updatedMatchingResult.matches, {
              minMatchScore: 80,
            }),
          };

          updatedEnhancedMatching = {
            matches: updatedMatchingResult.matches,
            summary: updatedMatchingResult.summary,
            matchedWidgetIds: updatedMatchingResult.matchedWidgetIds,
            detailedMatches: updatedDetailedMatches,
            filteredMatches: updatedFilteredMatches,
          };

          console.log("Updated Enhanced Matching API Response:", {
            totalMatches: updatedMatchingResult.matches.length,
            uniqueWidgetIds: updatedMatchingResult.matchedWidgetIds.length,
            matchesWithContent: updatedFilteredMatches.withContent.length,
            exactMatches: updatedFilteredMatches.exactMatches.length,
            primarySourceMatches: updatedFilteredMatches.primarySourceMatches.length,
            highScoreMatches: updatedFilteredMatches.highScoreMatches.length
          });

          // Log comparison between initial and updated matching
          console.log("\n=== COMPARISON: INITIAL vs UPDATED MATCHING ===");
          console.log(`Initial matches: ${initialEnhancedMatching.matches.length}`);
          console.log(`Updated matches: ${updatedEnhancedMatching.matches.length}`);
          console.log(`Match difference: ${updatedEnhancedMatching.matches.length - initialEnhancedMatching.matches.length}`);
        }

        console.log("✅ Updated flex structure and matching completed successfully");

      } catch (error) {
        console.error("❌ Error getting updated flex structure:", error);
        console.error("Error stack:", error.stack);
        // Keep the initial data if getting updated data fails
        updatedFlexStructureData = initialFlexStructureData;
        updatedExtractedIds = initialExtractedIds;
        updatedFlexStructureWidgetIds = initialFlexStructureWidgetIds;
        updatedWidgetIdsOnly = initialWidgetIdsOnly;
        updatedEnhancedMatching = initialEnhancedMatching;
      }
    } else {
      console.log("❌ Using initial flex structure data - dynamic insert not successful or not triggered");
      // Use initial data if dynamic insert wasn't successful
      updatedFlexStructureData = initialFlexStructureData;
      updatedExtractedIds = initialExtractedIds;
      updatedFlexStructureWidgetIds = initialFlexStructureWidgetIds;
      updatedWidgetIdsOnly = initialWidgetIdsOnly;
      updatedEnhancedMatching = initialEnhancedMatching;
    }

    // Step 10: Execute batch operations section by section with updated data
    console.log("\n=== STEP 10: BATCH OPERATIONS ===");
    const batchResults = await executeBatchOperationsSectionBySection(
      pageId,
      uuid,
      alias,
      updatedExtractedIds,
      htmlIds,
      flexWidgetIds,
      primaryBatchBody,
      secondaryBatchBody
    );

    console.log("✅ Batch operations completed");
    console.log("Batch Operations API Response:", JSON.stringify(batchResults, null, 2));

    // Step 11: Return comprehensive response with updated data only
    console.log("\n=== STEP 11: PREPARING FINAL RESPONSE ===");
    
    const finalResponse = {
      success: batchResults.some((r) => r.success),
      data: {
        createPage: createPageResult,
        extractedData: { uuid, alias, itemUrl, pageId },
        
        // Renamed: updatedFlexStructure is now flexStructure
        flexStructure: updatedFlexStructureData,
        
        // Comparison data
        flexStructureComparison: {
          initialWidgetCount: initialFlexStructureWidgetIds.reduce(
            (sum, section) => sum + section.totalWidgets,
            0
          ),
          updatedWidgetCount: updatedFlexStructureWidgetIds.reduce(
            (sum, section) => sum + section.totalWidgets,
            0
          ),
          widgetCountDifference: updatedFlexStructureWidgetIds.reduce(
            (sum, section) => sum + section.totalWidgets,
            0
          ) - initialFlexStructureWidgetIds.reduce(
            (sum, section) => sum + section.totalWidgets,
            0
          ),
          initialSectionCount: initialExtractedIds.length,
          updatedSectionCount: updatedExtractedIds.length,
          sectionCountDifference: updatedExtractedIds.length - initialExtractedIds.length,
        },

        // Dynamic Insert API results
        dynamicInsertApi: dynamicInsertResult,

        // Filtered about page data
        aboutPageData: {
          success: aboutPageData.success,
          message: aboutPageData.message,
          dmDivFound: aboutPageData.dmDivFound,
        },

        // Widget IDs (using updated data)
        widgetIdsOnly: updatedWidgetIdsOnly,

        // Enhanced widget matching results (both initial and updated)
        enhancedWidgetMatching: {
          initial: {
            matches: initialEnhancedMatching.matches,
            summary: initialEnhancedMatching.summary,
            matchedWidgetIds: initialEnhancedMatching.matchedWidgetIds,
            detailedMatches: initialEnhancedMatching.detailedMatches,
            filteredMatches: {
              exactMatches: initialEnhancedMatching.filteredMatches?.exactMatches || [],
            },
          },
          updated: {
            matches: updatedEnhancedMatching.matches,
            summary: updatedEnhancedMatching.summary,
            matchedWidgetIds: updatedEnhancedMatching.matchedWidgetIds,
            detailedMatches: updatedEnhancedMatching.detailedMatches,
            filteredMatches: {
              exactMatches: updatedEnhancedMatching.filteredMatches?.exactMatches || [],
            },
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

        // Use updated extracted IDs for the rest of the data
        extractedIds: updatedExtractedIds,
        matchedSections,
        htmlIds,
        flexWidgetIds,
        batchResults,
        summary: {
          totalSections: updatedExtractedIds.length,
          totalWidgetsInFlexStructure: updatedFlexStructureWidgetIds.reduce(
            (sum, section) => sum + section.totalWidgets,
            0
          ),
          widgetsBySection: updatedFlexStructureWidgetIds.map((section) => ({
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

          // Dynamic Insert API summary
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

          // About page parsing summary
          aboutPageParsing: {
            success: aboutPageData.success,
            dmDivFound: aboutPageData.dmDivFound,
            dmDivContentLength: aboutPageData.dmDivContent?.length || 0,
            elementsWithIds: aboutPageData.elementsWithIds?.length || 0,
          },

          // Enhanced widget matching summary (using updated data)
          enhancedWidgetMatchingSummary: {
            initial: {
              totalMatches: initialEnhancedMatching.matches.length,
              uniqueWidgetIds: initialEnhancedMatching.matchedWidgetIds?.length || 0,
              matchRate: initialEnhancedMatching.summary?.matchRate || "0%",
              exactMatches: initialEnhancedMatching.filteredMatches?.exactMatches?.length || 0,
            },
            updated: {
              totalMatches: updatedEnhancedMatching.matches.length,
              uniqueWidgetIds: updatedEnhancedMatching.matchedWidgetIds?.length || 0,
              matchRate: updatedEnhancedMatching.summary?.matchRate || "0%",
              exactMatches: updatedEnhancedMatching.filteredMatches?.exactMatches?.length || 0,
            },
            improvement: {
              matchesAdded: updatedEnhancedMatching.matches.length - initialEnhancedMatching.matches.length,
              exactMatchesAdded: (updatedEnhancedMatching.filteredMatches?.exactMatches?.length || 0) - (initialEnhancedMatching.filteredMatches?.exactMatches?.length || 0),
            },
          },

          // Widget IDs summary (using updated data)
          widgetIdsSummary: {
            inputPrimaryCount: inputBatchIds.primary.length,
            inputSecondaryCount: inputBatchIds.secondary.length,
            initialFlexStructureCount: initialFlexStructureIds.length,
            updatedFlexStructureCount: updatedWidgetIdsOnly.fromFlexStructure.length,
            flexStructureCountDifference: updatedWidgetIdsOnly.fromFlexStructure.length - initialFlexStructureIds.length,
            totalExtractedIds: updatedWidgetIdsOnly.count.total,
          },
        },
      },
    };

    console.log("✅ Final response prepared successfully");
    console.log("Final Response Summary:", {
      success: finalResponse.success,
      createPageSuccess: !!createPageResult.page,
      flexStructureSuccess: !!updatedFlexStructureData,
      dynamicInsertTriggered: !!dynamicInsertResult,
      dynamicInsertSuccess: dynamicInsertResult?.success || false,
      batchOperationsSuccess: batchResults.some((r) => r.success),
      initialSections: initialExtractedIds.length,
      updatedSections: updatedExtractedIds.length,
      initialWidgets: initialFlexStructureWidgetIds.reduce((sum, section) => sum + section.totalWidgets, 0),
      updatedWidgets: updatedFlexStructureWidgetIds.reduce((sum, section) => sum + section.totalWidgets, 0),
      widgetCountDifference: updatedFlexStructureWidgetIds.reduce((sum, section) => sum + section.totalWidgets, 0) - initialFlexStructureWidgetIds.reduce((sum, section) => sum + section.totalWidgets, 0)
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
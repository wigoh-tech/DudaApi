import { NextResponse } from "next/server";
import { createPageFromScratch } from "./createPage";
import { getFlexStructure, extractHierarchicalIds } from "./flexStructure";
import { parsePageHtml } from "./htmlParser";
import {
  executeBatchOperations,
} from "./batchOperations";
import { handleError } from "./utils";
import { handleDynamicInsertApi } from "./insertApi"; // Import the new function
import {
  extractWidgetIds,
  getWidgetIdsFlat,
  matchWidgetIdsWithElementsData,
  getDetailedContentForMatches,
  filterMatches,
} from "./widgetExtractor";
import {
  parseAboutHtmlPage,
} from "./parseAboutHtmlPage";
import {
  compareStructuresWithChildGroupExtraction,
  extractPrimaryBatchGroups,
  extractFlexStructureGroups,
  printStructureExplanation,
} from "./compareStructure";
import {
  processChildGroupExtractions,
  addChildGroup,
} from "./addChildFlexStructure";
import { handleChildDeletions } from "./deleteColumn";
import {
  printSectionDetailsFromDeletionResult,
  processExtractedSectionsForFlexStructure,
} from "./updateFlexStructure";

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
    console.log(
      "About page parsing result:",
      aboutPageData.success,
      aboutPageData.message
    );

    // Step 1: Create page from scratch
    console.log("\n=== STEP 1: CREATING PAGE FROM SCRATCH ===");
    const createPageResult = await createPageFromScratch(createPageData);
    console.log("✅ Page creation API triggered successfully");
    console.log(
      "Create Page API Response:",
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

    console.log(`\n=== EXTRACTED DATA ===`);
    console.log(`UUID: ${uuid}`);
    console.log(`Alias: ${alias}`);
    console.log(`Page ID: ${pageId}`);
    console.log(`Item URL: ${itemUrl}`);

    // Step 3: Get initial flex structure using the UUID
    console.log("\n=== STEP 3: GETTING INITIAL FLEX STRUCTURE ===");
    const initialFlexStructureData = await getFlexStructure(uuid, alias);
    console.log("✅ Initial Flex Structure API triggered successfully");
    console.log(
      "Initial Flex Structure API Response:",
      JSON.stringify(initialFlexStructureData, null, 2)
    );

    console.log("\n=== DYNAMIC INSERT API ===");
    let dynamicInsertResult = null;

    if (
      primaryBatchBody &&
      Array.isArray(primaryBatchBody) &&
      primaryBatchBody.length > 0
    ) {
      console.log("✅ Dynamic Insert API triggered successfully");
      console.log(
        `Processing ${primaryBatchBody.length} sections for dynamic insert...`
      );
      console.log(`Using alias: ${alias} for HTML ID extraction`);

      try {
        // Pass alias to the dynamic insert API for HTML ID extraction
        dynamicInsertResult = await handleDynamicInsertApi(
          { primaryBatchBody },
          uuid,
          alias // Add alias parameter here
        );

        console.log(
          "Dynamic Insert API Response:",
          JSON.stringify(dynamicInsertResult, null, 2)
        );

        if (dynamicInsertResult.success) {
          console.log(`✅ Dynamic Insert completed successfully:`);
          console.log(
            `  - Total sections processed: ${dynamicInsertResult.totalSections}`
          );
          console.log(
            `  - Total API calls made: ${dynamicInsertResult.totalApicalls}`
          );
          console.log(
            `  - Successful calls: ${dynamicInsertResult.summary.successfulCalls}`
          );
          console.log(
            `  - Failed calls: ${dynamicInsertResult.summary.failedCalls}`
          );

          // New: Log HTML ID extraction summary
          if (dynamicInsertResult.extractionSummary) {
            console.log(
              `  - HTML ID extractions attempted: ${dynamicInsertResult.extractionSummary.totalExtractionAttempts}`
            );
            console.log(
              `  - HTML ID extractions successful: ${dynamicInsertResult.extractionSummary.successfulExtractions}`
            );
            console.log(
              `  - HTML ID extractions failed: ${dynamicInsertResult.extractionSummary.failedExtractions}`
            );
            if (dynamicInsertResult.extractionSummary.extractedIds.length > 0) {
              console.log(
                `  - Extracted HTML IDs: ${dynamicInsertResult.extractionSummary.extractedIds.join(
                  ", "
                )}`
              );
            }
          }
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
          responses: [],
          extractionSummary: {
            totalExtractionAttempts: 0,
            successfulExtractions: 0,
            failedExtractions: 0,
            extractedIds: [],
          },
        };
      }
    } else {
      console.log(
        "❌ Dynamic Insert API not triggered - no primary batch body provided"
      );
    }

    // Step 4: Extract hierarchical IDs from initial flex structure
    const initialExtractedIds = extractHierarchicalIds(
      initialFlexStructureData
    );
    console.log("\n=== STEP 4: INITIAL HIERARCHICAL IDS EXTRACTION ===");
    console.log("Initial Extracted Hierarchical IDs:", initialExtractedIds);

    // Extract widget IDs from the initial flex structure response
    const initialFlexStructureWidgetIds = extractWidgetIds(
      initialFlexStructureData
    );
    console.log(
      "Initial Flex Structure Widget IDs:",
      initialFlexStructureWidgetIds
    );

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
      flexWidgetIds: flexWidgetIds.length,
    });

    // Extract only widget IDs in clean format
    const inputBatchIds = extractOnlyWidgetIds({
      primary: primaryWidgetIds,
      secondary: secondaryWidgetIds,
    });

    const initialFlexStructureIds = extractFlexStructureIds(
      initialFlexStructureData
    );

    // Create initial widgetIdsOnly object
    const initialWidgetIdsOnly = {
      fromInputBatches: inputBatchIds,
      fromFlexStructure: initialFlexStructureIds,
      flatList: getWidgetIdsFlat(initialFlexStructureData).map((id) => ({
        id,
      })),
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
      console.log(
        "✅ Initial enhanced widget matching API triggered successfully"
      );
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
        highScoreMatches: filteredMatches.highScoreMatches.length,
      });
    }

    // Step 9: Get UPDATED flex structure after dynamic insert
    console.log(
      "\n=== STEP 9: GETTING UPDATED FLEX STRUCTURE AFTER DYNAMIC INSERT ==="
    );
    let updatedFlexStructureData = null;
    let updatedExtractedIds = null;
    let updatedFlexStructureWidgetIds = null;
    let updatedWidgetIdsOnly = null;
    let updatedEnhancedMatching = null;

    if (dynamicInsertResult && dynamicInsertResult.success) {
      console.log("✅ Getting fresh flex structure after dynamic insert...");

      // Add a small delay to ensure the dynamic insert operations are fully processed
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        // Get fresh flex structure
        updatedFlexStructureData = await getFlexStructure(uuid, alias);
        console.log("✅ Updated Flex Structure API triggered successfully");
        console.log(
          "Updated Flex Structure API Response:",
          JSON.stringify(updatedFlexStructureData, null, 2)
        );

        // Extract hierarchical IDs from updated flex structure
        updatedExtractedIds = extractHierarchicalIds(updatedFlexStructureData);
        console.log("Updated Extracted Hierarchical IDs:", updatedExtractedIds);

        // Extract widget IDs from the updated flex structure response
        updatedFlexStructureWidgetIds = extractWidgetIds(
          updatedFlexStructureData
        );
        console.log(
          "Updated Flex Structure Widget IDs:",
          updatedFlexStructureWidgetIds
        );

        // Create updated widgetIdsOnly object
        const updatedFlexStructureIds = extractFlexStructureIds(
          updatedFlexStructureData
        );
        updatedWidgetIdsOnly = {
          fromInputBatches: inputBatchIds,
          fromFlexStructure: updatedFlexStructureIds,
          flatList: getWidgetIdsFlat(updatedFlexStructureData).map((id) => ({
            id,
          })),
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
          console.log(
            "✅ Updated enhanced widget matching API triggered successfully"
          );
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
            primarySourceMatches:
              updatedFilteredMatches.primarySourceMatches.length,
            highScoreMatches: updatedFilteredMatches.highScoreMatches.length,
          });

          // Log comparison between initial and updated matching
          console.log("\n=== COMPARISON: INITIAL vs UPDATED MATCHING ===");
          console.log(
            `Initial matches: ${initialEnhancedMatching.matches.length}`
          );
          console.log(
            `Updated matches: ${updatedEnhancedMatching.matches.length}`
          );
          console.log(
            `Match difference: ${
              updatedEnhancedMatching.matches.length -
              initialEnhancedMatching.matches.length
            }`
          );
        }

        console.log(
          "✅ Updated flex structure and matching completed successfully"
        );
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
      console.log(
        "❌ Using initial flex structure data - dynamic insert not successful or not triggered"
      );
      // Use initial data if dynamic insert wasn't successful
      updatedFlexStructureData = initialFlexStructureData;
      updatedExtractedIds = initialExtractedIds;
      updatedFlexStructureWidgetIds = initialFlexStructureWidgetIds;
      updatedWidgetIdsOnly = initialWidgetIdsOnly;
      updatedEnhancedMatching = initialEnhancedMatching;
    }
    // Step 9b: STRUCTURE COMPARISON - Compare Primary Batch with Flex Structure (PARENT GROUPS ONLY)
    console.log("\n=== STEP 9B: STRUCTURE COMPARISON (PARENT GROUPS ONLY) ===");
    let structureComparison = null;
    let childGroupExtractionResult = null;

    if (primaryBatchBody && updatedFlexStructureData) {
      console.log(
        "✅ Structure comparison API triggered successfully (focusing on parent groups)"
      );

      try {
        // Extract and print Primary Batch structure (parent groups only)
        const primaryBatchStructure =
          extractPrimaryBatchGroups(primaryBatchBody);
        printStructureExplanation(
          primaryBatchStructure,
          "Primary Batch (Parent Groups)"
        );

        // Extract and print Flex Structure (parent groups only)
        const flexStructureGroups = extractFlexStructureGroups(
          updatedFlexStructureData
        );
        printStructureExplanation(
          flexStructureGroups,
          "Flex Structure (Parent Groups)"
        );

        // Compare both structures with enhanced child group extraction
        structureComparison = compareStructuresWithChildGroupExtraction(
          primaryBatchBody,
          updatedFlexStructureData
        );

        // Check if child group extraction is required
        if (structureComparison.childGroupExtraction.extractionRequired) {
          console.log("\n=== CHILD GROUP EXTRACTION TRIGGERED ===");
          console.log(
            `Primary Direct Children: ${structureComparison.summary.primaryDirectChildren}`
          );
          console.log(
            `Flex Direct Children: ${structureComparison.summary.flexDirectChildren}`
          );

          // Process child group extractions
          childGroupExtractionResult = processChildGroupExtractions(
            updatedFlexStructureData,
            structureComparison
          );

          console.log(
            "Child Group Extraction Result:",
            JSON.stringify(childGroupExtractionResult, null, 2)
          );
        }

        console.log(
          "Structure Comparison API Response (Parent Groups):",
          JSON.stringify(
            {
              primaryBatchSections:
                structureComparison.summary.primaryBatchSections,
              flexStructureSections:
                structureComparison.summary.flexStructureSections,
              primaryBatchParentGroups:
                structureComparison.summary.primaryBatchGroups,
              flexStructureParentGroups:
                structureComparison.summary.flexStructureGroups,
              primaryDirectChildren:
                structureComparison.summary.primaryDirectChildren,
              flexDirectChildren:
                structureComparison.summary.flexDirectChildren,
              matchStatus: structureComparison.summary.matchStatus,
              sectionDifference: structureComparison.summary.sectionDifference,
              parentGroupDifference:
                structureComparison.summary.groupDifference,
              parentGroupDetails: structureComparison.parentGroupDetails || [],
              childGroupExtraction: structureComparison.childGroupExtraction,
            },
            null,
            2
          )
        );

        console.log(
          "✅ Structure comparison (parent groups) completed successfully"
        );
      } catch (error) {
        console.error("❌ Structure comparison error:", error);
        structureComparison = {
          success: false,
          error: error.message,
          summary: {
            primaryBatchSections: 0,
            flexStructureSections: 0,
            primaryBatchGroups: 0,
            flexStructureGroups: 0,
            primaryDirectChildren: 0,
            flexDirectChildren: 0,
            matchStatus: "ERROR",
            sectionDifference: 0,
            groupDifference: 0,
          },
          childGroupExtraction: {
            triggered: false,
            extractionRequired: false,
            sectionsRequiringChildGroups: 0,
            summary: "Error occurred during comparison",
          },
        };
      }
    } else {
      console.log(
        "❌ Structure comparison not triggered - missing primary batch body or flex structure data"
      );
      structureComparison = {
        success: false,
        message: "Structure comparison not triggered - missing required data",
        summary: {
          primaryBatchSections: 0,
          flexStructureSections: 0,
          primaryBatchGroups: 0,
          flexStructureGroups: 0,
          primaryDirectChildren: 0,
          flexDirectChildren: 0,
          matchStatus: "NOT_TRIGGERED",
          sectionDifference: 0,
          groupDifference: 0,
        },
        childGroupExtraction: {
          triggered: false,
          extractionRequired: false,
          sectionsRequiringChildGroups: 0,
          summary: "Comparison not triggered",
        },
      };
    }

    // Calculate total direct children from all sections (existing logic maintained)
    const primaryTotalDirectChildren =
      structureComparison?.primaryBatch?.sections?.reduce(
        (sum, section) =>
          sum +
          section.parentGroups.reduce(
            (sectionSum, group) => sectionSum + group.directChildCount,
            0
          ),
        0
      ) || 0;

    const flexTotalDirectChildren =
      structureComparison?.flexStructure?.sections?.reduce(
        (sum, section) =>
          sum +
          section.parentGroups.reduce(
            (sectionSum, group) => sectionSum + group.directChildCount,
            0
          ),
        0
      ) || 0;
    // Step 9.1: ADD CHILD GROUPS IF NEEDED
    console.log("\n=== STEP 9.1: ADDING CHILD GROUPS IF NEEDED ===");
    let childGroupAdditionResult = null;

    if (
      childGroupExtractionResult &&
      childGroupExtractionResult.extractedIds &&
      childGroupExtractionResult.extractedIds.length > 0
    ) {
      console.log(
        "Child group extraction found sections requiring additional groups"
      );

      try {
        // Process each section that needs child groups
        const additionResults = [];

        for (const extractedSection of childGroupExtractionResult.extractedIds) {
          console.log(`\nProcessing section ${extractedSection.sectionIndex}:`);
          console.log(`  Parent Group ID: ${extractedSection.parentGroupId}`);
          console.log(
            `  Current Child Groups: ${extractedSection.allChildGroupIds.length}`
          );

          // Add primary/flex children counts to the extracted section data
          const sectionComparison =
            structureComparison.comparison.sectionBySection[
              extractedSection.sectionIndex - 1
            ];
          if (sectionComparison && sectionComparison.parentGroupDetails) {
            const parentGroupDetail =
              sectionComparison.parentGroupDetails[
                extractedSection.parentGroupIndex
              ];
            if (parentGroupDetail) {
              extractedSection.primaryDirectChildren =
                parentGroupDetail.primaryDirectChildren;
              extractedSection.flexDirectChildren =
                parentGroupDetail.flexDirectChildren;
            }
          }

          // Only add child groups if primary has more children than flex
          if (
            extractedSection.primaryDirectChildren >
            extractedSection.flexDirectChildren
          ) {
            console.log(
              `  Adding child groups: Primary(${extractedSection.primaryDirectChildren}) > Flex(${extractedSection.flexDirectChildren})`
            );

            const addResult = await addChildGroup(
              extractedSection,
              uuid,
              pageId
            );
            additionResults.push({
              sectionIndex: extractedSection.sectionIndex,
              result: addResult,
            });

            console.log(
              `  ✅ Added ${addResult.childGroupsAdded} child group(s) for section ${extractedSection.sectionIndex}`
            );
          } else {
            console.log(
              `  ⏭️  No child groups needed for section ${extractedSection.sectionIndex}`
            );
          }
        }

        childGroupAdditionResult = {
          success: true,
          sectionsProcessed: childGroupExtractionResult.extractedIds.length,
          sectionsModified: additionResults.length,
          additionResults: additionResults,
          totalChildGroupsAdded: additionResults.reduce(
            (sum, result) => sum + (result.result.childGroupsAdded || 0),
            0
          ),
          processedAt: new Date().toISOString(),
        };

        console.log("✅ Child group addition completed successfully");
        console.log(
          `  Sections processed: ${childGroupAdditionResult.sectionsProcessed}`
        );
        console.log(
          `  Sections modified: ${childGroupAdditionResult.sectionsModified}`
        );
        console.log(
          `  Total child groups added: ${childGroupAdditionResult.totalChildGroupsAdded}`
        );
      } catch (error) {
        console.error("❌ Error during child group addition:", error);
        childGroupAdditionResult = {
          success: false,
          error: error.message,
          sectionsProcessed: 0,
          sectionsModified: 0,
          totalChildGroupsAdded: 0,
          processedAt: new Date().toISOString(),
        };
      }
    } else {
      console.log("No child group additions needed");
      childGroupAdditionResult = {
        success: true,
        message: "No child group additions required",
        sectionsProcessed: 0,
        sectionsModified: 0,
        totalChildGroupsAdded: 0,
        processedAt: new Date().toISOString(),
      };
    }
    // Step 9c: CHILD DELETION OPERATIONS
    console.log("\n=== STEP 9C: CHILD DELETION OPERATIONS ===");
    let deleteOperationsResult = null;
    let flexStructureResult = null;

    if (
      structureComparison &&
      structureComparison.success !== false &&
      pageId &&
      uuid
    ) {
      console.log("✅ Child deletion operations API triggered successfully");

      try {
        // Handle child deletions based on structure comparison - PASS UUID HERE
        deleteOperationsResult = await handleChildDeletions(
          structureComparison,
          pageId,
          uuid
        );

        console.log(
          "Child Deletion Operations API Response:",
          JSON.stringify(
            {
              success: deleteOperationsResult.success,
              totalAttempted: deleteOperationsResult.totalAttempted,
              totalSuccessful: deleteOperationsResult.totalSuccessful,
              totalFailed: deleteOperationsResult.totalFailed,
              extractionSummary: {
                fromFlexStructure:
                  deleteOperationsResult.extractionResults?.fromFlexStructure
                    ?.length || 0,
                fromParentGroupDetails:
                  deleteOperationsResult.extractionResults
                    ?.fromParentGroupDetails?.length || 0,
                fromEnhancedExtraction:
                  deleteOperationsResult.extractionResults
                    ?.fromEnhancedExtraction?.length || 0,
                combinedUnique:
                  deleteOperationsResult.extractionResults?.combinedUnique
                    ?.length || 0,
              },
              successfulDeletions:
                deleteOperationsResult.summary?.successfulDeletions || [],
              failedDeletions:
                deleteOperationsResult.summary?.failedDeletions || [],
            },
            null,
            2
          )
        );

        // Enhanced logging for delete API responses
        console.log("\n=== DELETE API RESPONSES DETAILED LOG ===");
        if (
          deleteOperationsResult.deletionResults &&
          deleteOperationsResult.deletionResults.length > 0
        ) {
          deleteOperationsResult.deletionResults.forEach((result, index) => {
            console.log(`\n--- DELETE API RESPONSE ${index + 1} ---`);
            console.log(`Child ID: ${result.childId}`);
            console.log(`Group ID: ${result.groupId}`);
            console.log(`Section ID: ${result.sectionId}`);
            console.log(`Success: ${result.success}`);
            console.log(`Deletion Reason: ${result.deletionReason}`);
            console.log(`Response Body: ${result.response}`);

            if (result.parsedResponse) {
              console.log(
                `Parsed Response:`,
                JSON.stringify(result.parsedResponse, null, 2)
              );
            }

            // NEW: Extract and print hierarchical IDs from the delete response
            try {
              const extractedSections =
                printSectionDetailsFromDeletionResult(result);
              if (extractedSections) {
                console.log(
                  `Extracted Hierarchical Structure:`,
                  JSON.stringify(extractedSections, null, 2)
                );
              }
            } catch (error) {
              console.error(
                `Error extracting hierarchical IDs:`,
                error.message
              );
            }

            if (result.responseHeaders) {
              console.log(
                `Response Headers:`,
                JSON.stringify(result.responseHeaders, null, 2)
              );
            }

            if (result.error) {
              console.log(`Error: ${result.error}`);
            }
          });
        } else {
          console.log("No deletion results to display");
        }

        // Log successful deletions with their responses and extracted IDs
        if (deleteOperationsResult.summary?.successfulDeletions?.length > 0) {
          console.log(
            "\n=== SUCCESSFUL DELETIONS WITH RESPONSES AND EXTRACTED IDS ==="
          );
          deleteOperationsResult.summary.successfulDeletions.forEach(
            (deletion, index) => {
              console.log(`\n--- Successful Deletion ${index + 1} ---`);
              console.log(`Child ID: ${deletion.childId}`);
              console.log(`Response: ${deletion.response}`);

              // NEW: Extract and print hierarchical IDs from successful deletion response
              try {
                const extractedSections =
                  printSectionDetailsFromDeletionResult(deletion);
                if (extractedSections) {
                  console.log(
                    `Extracted Section Details:`,
                    JSON.stringify(extractedSections, null, 2)
                  );
                }
              } catch (error) {
                console.error(
                  `Error extracting hierarchical IDs from successful deletion:`,
                  error.message
                );
              }

              if (deletion.parsedResponse) {
                console.log(
                  `Parsed Response:`,
                  JSON.stringify(deletion.parsedResponse, null, 2)
                );
              }

              if (deletion.responseHeaders) {
                console.log(
                  `Response Headers:`,
                  JSON.stringify(deletion.responseHeaders, null, 2)
                );
              }
            }
          );
        }

        // Log failed deletions with their responses
        if (deleteOperationsResult.summary?.failedDeletions?.length > 0) {
          console.log("\n=== FAILED DELETIONS WITH RESPONSES ===");
          deleteOperationsResult.summary.failedDeletions.forEach(
            (deletion, index) => {
              console.log(`\n--- Failed Deletion ${index + 1} ---`);
              console.log(`Child ID: ${deletion.childId}`);
              console.log(`Error: ${deletion.error}`);
              console.log(`Response: ${deletion.response}`);

              // NEW: Extract and print hierarchical IDs from failed deletion response (if available)
              try {
                const extractedSections =
                  printSectionDetailsFromDeletionResult(deletion);
                if (extractedSections) {
                  console.log(
                    `Extracted Section Details from Failed Response:`,
                    JSON.stringify(extractedSections, null, 2)
                  );
                }
              } catch (error) {
                console.error(
                  `Error extracting hierarchical IDs from failed deletion:`,
                  error.message
                );
              }

              if (deletion.parsedResponse) {
                console.log(
                  `Parsed Response:`,
                  JSON.stringify(deletion.parsedResponse, null, 2)
                );
              }

              if (deletion.responseHeaders) {
                console.log(
                  `Response Headers:`,
                  JSON.stringify(deletion.responseHeaders, null, 2)
                );
              }
            }
          );
        }

        console.log("✅ Child deletion operations completed successfully");

        // Add delay after deletions before proceeding to flex structure operations
        if (deleteOperationsResult.totalSuccessful > 0) {
          console.log(
            "Waiting 3 seconds after deletions before proceeding to flex structure operations..."
          );
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }

        // NEW: FLEX STRUCTURE UPDATE OPERATIONS
        console.log("\n=== STEP 9D: FLEX STRUCTURE UPDATE OPERATIONS ===");

        if (
          deleteOperationsResult.deletionResults &&
          deleteOperationsResult.deletionResults.length > 0
        ) {
          try {
            // Since cookies are hardcoded in updateFlexStructureAPI function,
            // we don't need to pass them here - just pass an empty string
            const cookies = "";

            // Process all deletion results for flex structure updates
            flexStructureResult =
              await processExtractedSectionsForFlexStructure(
                deleteOperationsResult.deletionResults,
                pageId,
                cookies,
                uuid
              );

            console.log(
              "Flex Structure Operations Summary:",
              JSON.stringify(
                {
                  success: flexStructureResult.successful > 0,
                  totalProcessed: flexStructureResult.totalProcessed,
                  successful: flexStructureResult.successful,
                  failed: flexStructureResult.failed,
                  successfulResults: flexStructureResult.results
                    .filter((r) => r.success)
                    .map((r) => ({
                      sectionId: r.sectionId,
                      elementId: r.elementId,
                      status: r.status,
                    })),
                  failedResults: flexStructureResult.results
                    .filter((r) => !r.success)
                    .map((r) => ({
                      sectionId: r.sectionId,
                      elementId: r.elementId,
                      error: r.error,
                    })),
                },
                null,
                2
              )
            );

            // Detailed logging for flex structure API responses
            console.log("\n=== FLEX STRUCTURE API RESPONSES DETAILED LOG ===");
            flexStructureResult.results.forEach((result, index) => {
              console.log(`\n--- FLEX STRUCTURE API RESPONSE ${index + 1} ---`);
              console.log(`Section ID: ${result.sectionId}`);
              console.log(`Element ID: ${result.elementId}`);
              console.log(`Success: ${result.success}`);
              console.log(
                `Status: ${result.status} ${result.statusText || ""}`
              );

              if (result.response) {
                console.log(`Response Body: ${result.response}`);
              }

              if (result.parsedResponse) {
                console.log(
                  `Parsed Response:`,
                  JSON.stringify(result.parsedResponse, null, 2)
                );
              }

              if (result.error) {
                console.log(`Error: ${result.error}`);
              }

              if (result.payload) {
                console.log(
                  `Sent Payload:`,
                  JSON.stringify(result.payload, null, 2)
                );
              }
            });

            console.log("✅ Flex structure operations completed successfully");
          } catch (error) {
            console.error("❌ Flex structure operations error:", error);
            flexStructureResult = {
              success: false,
              error: error.message,
              totalProcessed: 0,
              successful: 0,
              failed: 1,
              results: [],
            };
          }
        } else {
          console.log(
            "❌ No deletion results available for flex structure operations"
          );
          flexStructureResult = {
            success: false,
            message:
              "No deletion results available for flex structure operations",
            totalProcessed: 0,
            successful: 0,
            failed: 0,
            results: [],
          };
        }
      } catch (error) {
        console.error("❌ Child deletion operations error:", error);
        deleteOperationsResult = {
          success: false,
          error: error.message,
          totalAttempted: 0,
          totalSuccessful: 0,
          totalFailed: 0,
          deletionResults: [],
          extractionResults: {
            fromFlexStructure: [],
            fromParentGroupDetails: [],
            fromEnhancedExtraction: [],
            combinedUnique: [],
          },
        };

        flexStructureResult = {
          success: false,
          error: "Child deletion operations failed",
          totalProcessed: 0,
          successful: 0,
          failed: 0,
          results: [],
        };
      }
    } else {
      console.log(
        "❌ Child deletion operations not triggered - missing structure comparison, page ID, or UUID"
      );
      console.log(`Structure comparison exists: ${!!structureComparison}`);
      console.log(`Page ID exists: ${!!pageId}`);
      console.log(`UUID exists: ${!!uuid}`);
      deleteOperationsResult = {
        success: false,
        message:
          "Child deletion operations not triggered - missing required data",
        totalAttempted: 0,
        totalSuccessful: 0,
        totalFailed: 0,
        deletionResults: [],
        extractionResults: {
          fromFlexStructure: [],
          fromParentGroupDetails: [],
          fromEnhancedExtraction: [],
          combinedUnique: [],
        },
      };

      flexStructureResult = {
        success: false,
        message:
          "Flex structure operations not triggered - missing required data",
        totalProcessed: 0,
        successful: 0,
        failed: 0,
        results: [],
      };
    }

    // Step 9e: FINAL FLEX STRUCTURE EXTRACTION AFTER ALL OPERATIONS
    console.log("\n=== STEP 9e: FINAL FLEX STRUCTURE EXTRACTION ===");
    let finalFlexStructureData = null;
    let finalExtractedIds = null;

    try {
      console.log("✅ Getting final flex structure after all operations...");

      // Add delay to ensure all previous operations are processed
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Get final flex structure
      finalFlexStructureData = await getFlexStructure(uuid, alias);
      console.log("✅ Final Flex Structure API triggered successfully");
      console.log(
        "Final Flex Structure API Response:",
        JSON.stringify(finalFlexStructureData, null, 2)
      );

      // Extract hierarchical IDs with dynamic child groups from final flex structure
      finalExtractedIds = extractHierarchicalIds(finalFlexStructureData);
      console.log(
        "Final Extracted Hierarchical IDs with Dynamic Child Groups:",
        finalExtractedIds
      );

      // Enhanced logging for final extracted IDs
      console.log("\n=== FINAL HIERARCHICAL STRUCTURE BREAKDOWN ===");
      finalExtractedIds.forEach((section, index) => {
        console.log(`\n--- Section ${index + 1} ---`);
        console.log(`Element ID: ${section.elementId}`);
        console.log(`Section ID: ${section.sectionId}`);
        console.log(`Grid ID: ${section.gridId}`);
        console.log(`Parent Group ID: ${section.parentGroupId}`);
        console.log(`Total Child Groups: ${section.totalChildGroups}`);

        if (section.totalChildGroups > 0) {
          console.log("Child Groups:");
          Object.entries(section.childGroups).forEach(([key, value]) => {
            console.log(`  ${key}: ${value}`);
          });
        } else {
          console.log("No child groups found");
        }
      });

      // Create a summary of all child group IDs across all sections
      const allChildGroupIds = [];
      const childGroupSummary = {
        totalSections: finalExtractedIds.length,
        sectionsWithChildGroups: 0,
        totalChildGroups: 0,
        childGroupsBySection: [],
      };

      finalExtractedIds.forEach((section, sectionIndex) => {
        if (section.totalChildGroups > 0) {
          childGroupSummary.sectionsWithChildGroups++;
          childGroupSummary.totalChildGroups += section.totalChildGroups;

          const sectionChildGroups = {
            sectionIndex: sectionIndex + 1,
            sectionId: section.sectionId,
            childGroupCount: section.totalChildGroups,
            childGroupIds: Object.values(section.childGroups),
          };

          childGroupSummary.childGroupsBySection.push(sectionChildGroups);
          allChildGroupIds.push(...Object.values(section.childGroups));
        }
      });

      console.log("\n=== CHILD GROUP SUMMARY ===");
      console.log(
        "Child Group Summary:",
        JSON.stringify(childGroupSummary, null, 2)
      );
      console.log("All Child Group IDs (Flat List):", allChildGroupIds);

      console.log("✅ Final flex structure extraction completed successfully");
    } catch (error) {
      console.error("❌ Error getting final flex structure:", error);
      console.error("Error stack:", error.stack);

      // Fallback to previous data if final extraction fails
      finalFlexStructureData =
        updatedFlexStructureData || initialFlexStructureData;
      finalExtractedIds = updatedExtractedIds || initialExtractedIds;

      console.log("Using fallback flex structure data due to error");
    }

    // Step 9f: FINAL HTML PARSING USING FINAL FLEX STRUCTURE DATA
    console.log(
      "\n=== STEP 9f: FINAL HTML PARSING USING FINAL FLEX STRUCTURE ==="
    );
    let finalMatchedSections = null;
    let finalHtmlIds = null;
    let finalFlexWidgetIds = null;

    try {
      console.log("✅ Parsing HTML with final flex structure data...");

      // Parse HTML to match sections using final extracted IDs
      const finalHtmlParsingResult = await parsePageHtml(
        alias,
        finalExtractedIds
      );

      finalMatchedSections = finalHtmlParsingResult.matchedSections;
      finalHtmlIds = finalHtmlParsingResult.htmlIds;
      finalFlexWidgetIds = finalHtmlParsingResult.flexWidgetIds;

      console.log("✅ Final HTML parsing completed successfully");
      console.log("Final HTML Parsing Results:", {
        matchedSections: finalMatchedSections?.length || 0,
        htmlIds: finalHtmlIds?.length || 0,
        flexWidgetIds: finalFlexWidgetIds?.length || 0,
      });

      // Enhanced logging for final HTML parsing results
      console.log("\n=== FINAL HTML PARSING BREAKDOWN ===");
      console.log("Final Matched Sections:", finalMatchedSections);
      console.log("Final HTML IDs:", finalHtmlIds);
      console.log("Final Flex Widget IDs:", finalFlexWidgetIds);

      // Compare with initial HTML parsing results
      console.log("\n=== COMPARISON: INITIAL vs FINAL HTML PARSING ===");
      console.log("Initial HTML Parsing Results:", {
        matchedSections: matchedSections?.length || 0,
        htmlIds: htmlIds?.length || 0,
        flexWidgetIds: flexWidgetIds?.length || 0,
      });
      console.log("Final HTML Parsing Results:", {
        matchedSections: finalMatchedSections?.length || 0,
        htmlIds: finalHtmlIds?.length || 0,
        flexWidgetIds: finalFlexWidgetIds?.length || 0,
      });

      // Extract final flex structure IDs for comparison
      const finalFlexStructureIds = extractFlexStructureIds(
        finalFlexStructureData
      );

      // Create final widgetIdsOnly object
      const finalWidgetIdsOnly = {
        fromInputBatches: inputBatchIds, // This remains the same
        fromFlexStructure: finalFlexStructureIds,
        flatList: getWidgetIdsFlat(finalFlexStructureData).map((id) => ({
          id,
        })),
        count: {
          inputPrimary: inputBatchIds.primary.length,
          inputSecondary: inputBatchIds.secondary.length,
          flexStructure: finalFlexStructureIds.length,
          total:
            inputBatchIds.primary.length +
            inputBatchIds.secondary.length +
            finalFlexStructureIds.length,
        },
      };

      console.log("\n=== FINAL WIDGET IDS SUMMARY ===");
      console.log(
        "Final Widget IDs Only:",
        JSON.stringify(finalWidgetIdsOnly, null, 2)
      );

      // Log differences between initial and final widget counts
      console.log("\n=== WIDGET COUNT COMPARISON ===");
      console.log(
        "Initial Flex Structure Widget Count:",
        initialFlexStructureIds?.length || 0
      );
      console.log(
        "Final Flex Structure Widget Count:",
        finalFlexStructureIds?.length || 0
      );
      console.log(
        "Difference:",
        (finalFlexStructureIds?.length || 0) -
          (initialFlexStructureIds?.length || 0)
      );
    } catch (error) {
      console.error("❌ Error parsing HTML with final flex structure:", error);
      console.error("Error stack:", error.stack);

      // Fallback to initial HTML parsing results
      finalMatchedSections = matchedSections;
      finalHtmlIds = htmlIds;
      finalFlexWidgetIds = flexWidgetIds;

      console.log("Using fallback HTML parsing results due to error");
    }

    // Step 10: Execute batch operations section by section with updated data
    console.log("\n=== STEP 10: BATCH OPERATIONS ===");

    // Pass the enhanced widget matching data to batch operations
    const batchResults = await executeBatchOperationsSectionBySection(
      pageId,
      uuid,
      alias,
      finalExtractedIds || updatedExtractedIds || initialExtractedIds, // Use final extracted IDs
      finalHtmlIds || htmlIds, // Use final HTML IDs if available
      finalFlexWidgetIds || flexWidgetIds, // Use final flex widget IDs if available
      primaryBatchBody, // This is now the flex structure array
      secondaryBatchBody,
      updatedEnhancedMatching || initialEnhancedMatching // Pass the enhanced widget matching data
    );

    console.log("✅ Batch operations completed");
    console.log(
      "Batch Operations API Response:",
      JSON.stringify(batchResults, null, 2)
    );

    // Step 11: Return comprehensive response with updated data only
    console.log("\n=== STEP 11: PREPARING FINAL RESPONSE ===");

    const finalResponse = {
      success: batchResults.some((r) => r.success),
      data: {
        createPage: createPageResult,
        extractedData: { uuid, alias, itemUrl, pageId },

        // Renamed: updatedFlexStructure is now flexStructure
        flexStructure: updatedFlexStructureData,
        structureComparison: structureComparison,
        childGroupExtractionResult: childGroupExtractionResult,
        childGroupAdditionResult: childGroupAdditionResult,
        deleteOperations: deleteOperationsResult,
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
          widgetCountDifference:
            updatedFlexStructureWidgetIds.reduce(
              (sum, section) => sum + section.totalWidgets,
              0
            ) -
            initialFlexStructureWidgetIds.reduce(
              (sum, section) => sum + section.totalWidgets,
              0
            ),
          initialSectionCount: initialExtractedIds.length,
          updatedSectionCount: updatedExtractedIds.length,
          sectionCountDifference:
            updatedExtractedIds.length - initialExtractedIds.length,
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

        // Enhanced batch operations data
        batchOperationsSummary: {
          totalSections: batchResults.length,
          successfulSections: batchResults.filter((r) => r.success).length,
          failedSections: batchResults.filter((r) => !r.success).length,
          primaryBatchExecutions: batchResults.filter((r) => r.primaryBatch)
            .length,
          secondaryBatchExecutions: batchResults.filter((r) => r.secondaryBatch)
            .length,
          totalWidgetsProcessed: batchResults.reduce(
            (sum, r) =>
              sum +
              (r.primaryBatch?.processedWidgets || 0) +
              (r.secondaryBatch?.processedWidgets || 0),
            0
          ),
          totalChildGroups: batchResults.reduce(
            (sum, r) =>
              sum +
              (r.primaryBatch?.childGroups || 0) +
              (r.secondaryBatch?.childGroups || 0),
            0
          ),
          sectionsWithWidgetMatching: batchResults.filter(
            (r) =>
              r.primaryBatch?.processedWidgets > 0 ||
              r.secondaryBatch?.processedWidgets > 0
          ).length,
        },

        // Enhanced widget matching results
        enhancedWidgetMatching: {
          initial: {
            matches: initialEnhancedMatching?.matches || [],
            summary: initialEnhancedMatching?.summary || {},
            matchedWidgetIds: initialEnhancedMatching?.matchedWidgetIds || [],
          },
          updated: {
            matches: updatedEnhancedMatching?.matches || [],
            summary: updatedEnhancedMatching?.summary || {},
            matchedWidgetIds: updatedEnhancedMatching?.matchedWidgetIds || [],
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

          dynamicInsertApiSummary: dynamicInsertResult
            ? {
                triggered: true,
                success: dynamicInsertResult.success,
                totalSections: dynamicInsertResult.totalSections,
                totalApiCalls: dynamicInsertResult.totalApicalls,
                successfulCalls:
                  dynamicInsertResult.summary?.successfulCalls || 0,
                failedCalls: dynamicInsertResult.summary?.failedCalls || 0,
                error: dynamicInsertResult.error || null,
                // New: HTML ID extraction summary
                htmlIdExtraction: {
                  totalAttempts:
                    dynamicInsertResult.extractionSummary
                      ?.totalExtractionAttempts || 0,
                  successfulExtractions:
                    dynamicInsertResult.extractionSummary
                      ?.successfulExtractions || 0,
                  failedExtractions:
                    dynamicInsertResult.extractionSummary?.failedExtractions ||
                    0,
                  extractedIds:
                    dynamicInsertResult.extractionSummary?.extractedIds || [],
                  extractionRate:
                    dynamicInsertResult.extractionSummary
                      ?.totalExtractionAttempts > 0
                      ? `${Math.round(
                          (dynamicInsertResult.extractionSummary
                            .successfulExtractions /
                            dynamicInsertResult.extractionSummary
                              .totalExtractionAttempts) *
                            100
                        )}%`
                      : "0%",
                },
              }
            : {
                triggered: false,
                reason: "No primary batch body provided",
              },
          // Summary (updated with enhanced data)
          structureComparisonSummary: {
            triggered:
              !!structureComparison &&
              structureComparison.summary.matchStatus !== "NOT_TRIGGERED",
            matchStatus:
              structureComparison?.summary?.matchStatus || "NOT_AVAILABLE",
            primaryBatchSections:
              structureComparison?.summary?.primaryBatchSections || 0,
            flexStructureSections:
              structureComparison?.summary?.flexStructureSections || 0,
            primaryBatchGroups:
              structureComparison?.summary?.primaryBatchGroups || 0,
            flexStructureGroups:
              structureComparison?.summary?.flexStructureGroups || 0,
            // Enhanced direct children fields
            primaryTotalDirectChildren: primaryTotalDirectChildren,
            flexTotalDirectChildren: flexTotalDirectChildren,
            primaryDirectChildren:
              structureComparison?.summary?.primaryDirectChildren || 0,
            flexDirectChildren:
              structureComparison?.summary?.flexDirectChildren || 0,
            directChildrenMatch:
              primaryTotalDirectChildren === flexTotalDirectChildren,
            directChildrenDifference: Math.abs(
              primaryTotalDirectChildren - flexTotalDirectChildren
            ),
            sectionDifference:
              structureComparison?.summary?.sectionDifference || 0,
            groupDifference: structureComparison?.summary?.groupDifference || 0,
            perfectMatches:
              structureComparison?.comparison?.sectionBySection?.filter(
                (s) => s.status === "MATCH"
              ).length || 0,
            partialMatches:
              structureComparison?.comparison?.sectionBySection?.filter(
                (s) => s.status === "PARTIAL_MATCH"
              ).length || 0,
            noMatches:
              structureComparison?.comparison?.sectionBySection?.filter(
                (s) => s.status === "MISMATCH"
              ).length || 0,
            // Child group extraction summary
            childGroupExtractionTriggered:
              structureComparison?.childGroupExtraction?.triggered || false,
            sectionsRequiringChildGroups:
              structureComparison?.childGroupExtraction
                ?.sectionsRequiringChildGroups || 0,
            totalParentGroupsNeedingChildren:
              structureComparison?.childGroupExtraction
                ?.totalParentGroupsNeedingChildren || 0,
            extractedSectionsCount:
              childGroupExtractionResult?.extractedSections || 0,

            childGroupAdditionTriggered:
              childGroupAdditionResult?.success || false,
            totalChildGroupsAdded:
              childGroupAdditionResult?.totalChildGroupsAdded || 0,
            sectionsModifiedWithChildGroups:
              childGroupAdditionResult?.sectionsModified || 0,
          },

          deleteOperations: {
            ...deleteOperationsResult,
            // Include detailed response data in the final response
            detailedResponses:
              deleteOperationsResult?.deletionResults?.map((result) => ({
                childId: result.childId,
                groupId: result.groupId,
                sectionId: result.sectionId,
                success: result.success,
                response: result.response,
                parsedResponse: result.parsedResponse,
                responseHeaders: result.responseHeaders,
                error: result.error,
                deletionReason: result.deletionReason,
              })) || [],
          },

          // ===== ADD THIS TO THE SUMMARY SECTION (around line 760) =====
          // Add this inside the summary object:
          // Child deletion operations summary
          childDeletionSummary: {
            triggered:
              !!deleteOperationsResult &&
              deleteOperationsResult.message !==
                "Child deletion operations not triggered - missing required data",
            success: deleteOperationsResult?.success || false,
            totalAttempted: deleteOperationsResult?.totalAttempted || 0,
            totalSuccessful: deleteOperationsResult?.totalSuccessful || 0,
            totalFailed: deleteOperationsResult?.totalFailed || 0,
            extractionSummary: {
              fromFlexStructure:
                deleteOperationsResult?.extractionResults?.fromFlexStructure
                  ?.length || 0,
              fromParentGroupDetails:
                deleteOperationsResult?.extractionResults
                  ?.fromParentGroupDetails?.length || 0,
              fromEnhancedExtraction:
                deleteOperationsResult?.extractionResults
                  ?.fromEnhancedExtraction?.length || 0,
              combinedUnique:
                deleteOperationsResult?.extractionResults?.combinedUnique
                  ?.length || 0,
            },
            successfulDeletions:
              deleteOperationsResult?.summary?.successfulDeletions || [],
            failedDeletions:
              deleteOperationsResult?.summary?.failedDeletions?.length || 0,
            error: deleteOperationsResult?.error || null,
            // Include response details in summary
            responseDetails: {
              successfulResponses:
                deleteOperationsResult?.summary?.successfulDeletions?.map(
                  (del) => ({
                    childId: del.childId,
                    response: del.response,
                    parsedResponse: del.parsedResponse,
                  })
                ) || [],
              failedResponses:
                deleteOperationsResult?.summary?.failedDeletions?.map(
                  (del) => ({
                    childId: del.childId,
                    error: del.error,
                    response: del.response,
                    parsedResponse: del.parsedResponse,
                  })
                ) || [],
            },
          },
          flexStructureUpdates: {
            success: flexStructureResult.successful > 0,
            processed: flexStructureResult.totalProcessed,
            successful: flexStructureResult.successful,
            failed: flexStructureResult.failed,
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
              uniqueWidgetIds:
                initialEnhancedMatching.matchedWidgetIds?.length || 0,
              matchRate: initialEnhancedMatching.summary?.matchRate || "0%",
              exactMatches:
                initialEnhancedMatching.filteredMatches?.exactMatches?.length ||
                0,
            },
            updated: {
              totalMatches: updatedEnhancedMatching.matches.length,
              uniqueWidgetIds:
                updatedEnhancedMatching.matchedWidgetIds?.length || 0,
              matchRate: updatedEnhancedMatching.summary?.matchRate || "0%",
              exactMatches:
                updatedEnhancedMatching.filteredMatches?.exactMatches?.length ||
                0,
            },
            improvement: {
              matchesAdded:
                updatedEnhancedMatching.matches.length -
                initialEnhancedMatching.matches.length,
              exactMatchesAdded:
                (updatedEnhancedMatching.filteredMatches?.exactMatches
                  ?.length || 0) -
                (initialEnhancedMatching.filteredMatches?.exactMatches
                  ?.length || 0),
            },
          },

          widgetProcessingSummary: {
            totalWidgetsInFlexStructure:
              updatedFlexStructureWidgetIds?.reduce(
                (sum, section) => sum + section.totalWidgets,
                0
              ) || 0,
            widgetsWithHtmlMatches:
              updatedEnhancedMatching?.matches?.filter(
                (m) => m.element?.hasInnerContent
              ).length || 0,
            exactMatches:
              updatedEnhancedMatching?.filteredMatches?.exactMatches?.length ||
              0,
            partialMatches:
              updatedEnhancedMatching?.matches?.filter(
                (m) => m.matchType === "partial"
              ).length || 0,
            widgetsProcessedInBatch: batchResults.reduce(
              (sum, r) =>
                sum +
                (r.primaryBatch?.processedWidgets || 0) +
                (r.secondaryBatch?.processedWidgets || 0),
              0
            ),
            matchingEfficiency:
              updatedEnhancedMatching?.summary?.matchRate || "0%",
          },

          // Dynamic child groups summary
          childGroupsSummary: {
            totalChildGroupsFound: batchResults.reduce(
              (sum, r) =>
                sum +
                (r.primaryBatch?.childGroups || 0) +
                (r.secondaryBatch?.childGroups || 0),
              0
            ),
            sectionsWithChildGroups: batchResults.filter(
              (r) =>
                r.primaryBatch?.childGroups > 0 ||
                r.secondaryBatch?.childGroups > 0
            ).length,
            averageChildGroupsPerSection:
              batchResults.length > 0
                ? (
                    batchResults.reduce(
                      (sum, r) =>
                        sum +
                        (r.primaryBatch?.childGroups || 0) +
                        (r.secondaryBatch?.childGroups || 0),
                      0
                    ) / batchResults.length
                  ).toFixed(2)
                : 0,
          },

          // Batch operations efficiency
          batchOperationsEfficiency: {
            successRate:
              batchResults.length > 0
                ? (
                    (batchResults.filter((r) => r.success).length /
                      batchResults.length) *
                    100
                  ).toFixed(2) + "%"
                : "0%",
            totalOperations: batchResults.filter(
              (r) => r.primaryBatch || r.secondaryBatch
            ).length,
            successfulOperations: batchResults.filter(
              (r) =>
                r.primaryBatch?.success ||
                false ||
                r.secondaryBatch?.success ||
                false
            ).length,
            failedOperations: batchResults.filter(
              (r) =>
                (r.primaryBatch && !r.primaryBatch.success) ||
                (r.secondaryBatch && !r.secondaryBatch.success)
            ).length,
          },

          // Widget IDs summary (using updated data)
          widgetIdsSummary: {
            inputPrimaryCount: inputBatchIds.primary.length,
            inputSecondaryCount: inputBatchIds.secondary.length,
            initialFlexStructureCount: initialFlexStructureIds.length,
            updatedFlexStructureCount:
              updatedWidgetIdsOnly.fromFlexStructure.length,
            flexStructureCountDifference:
              updatedWidgetIdsOnly.fromFlexStructure.length -
              initialFlexStructureIds.length,
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
      initialWidgets: initialFlexStructureWidgetIds.reduce(
        (sum, section) => sum + section.totalWidgets,
        0
      ),
      updatedWidgets: updatedFlexStructureWidgetIds.reduce(
        (sum, section) => sum + section.totalWidgets,
        0
      ),
      widgetCountDifference:
        updatedFlexStructureWidgetIds.reduce(
          (sum, section) => sum + section.totalWidgets,
          0
        ) -
        initialFlexStructureWidgetIds.reduce(
          (sum, section) => sum + section.totalWidgets,
          0
        ),
    });

    return NextResponse.json(finalResponse);
  } catch (error) {
    console.error("❌ Error in POST handler:", error);
    console.error("Error stack:", error.stack);
    return handleError(error);
  }
}

// 2. Replace the existing executeBatchOperationsSectionBySection function
async function executeBatchOperationsSectionBySection(
  pageId,
  uuid,
  alias,
  extractedIds,
  htmlIds,
  flexWidgetIds,
  primaryBatchBody,
  secondaryBatchBody,
  enhancedWidgetMatching = null
) {
  console.log("\n===== STARTING SECTION-BY-SECTION BATCH OPERATIONS =====");
  console.log(`Total sections to process: ${extractedIds.length}`);
  console.log(`Total flex widget IDs available: ${flexWidgetIds?.length || 0}`);
  console.log(`Primary batch body provided: ${!!primaryBatchBody}`);
  console.log(`Secondary batch body provided: ${!!secondaryBatchBody}`);
  console.log(`Enhanced widget matching provided: ${!!enhancedWidgetMatching}`);

  // Log the flex widget ID mapping
  console.log("\n=== FLEX WIDGET ID MAPPING ===");
  extractedIds.forEach((section, index) => {
    const flexWidgetIndex = Math.min(index, (flexWidgetIds?.length || 1) - 1);
    const assignedFlexWidgetId =
      flexWidgetIds?.[flexWidgetIndex] || "UNDEFINED";
    console.log(
      `Section ${index + 1} (${
        section.sectionId
      }) -> Flex Widget ID[${flexWidgetIndex}]: ${assignedFlexWidgetId}`
    );
  });

  const allResults = [];

  // Process each section individually
  for (let i = 0; i < extractedIds.length; i++) {
    const section = extractedIds[i];

    // Handle dynamic HTML ID assignment
    const htmlIdIndex = Math.min(i, (htmlIds?.length || 1) - 1);
    const htmlId = htmlIds?.[htmlIdIndex];

    // Handle dynamic flex widget ID assignment
    const flexWidgetIndex = Math.min(i, (flexWidgetIds?.length || 1) - 1);
    const flexWidgetId = flexWidgetIds?.[flexWidgetIndex];

    console.log(`\n--- Processing Section ${i + 1} ---`);
    console.log(`Section ID: ${section.sectionId}`);
    console.log(`HTML ID Index: ${htmlIdIndex}, Value: ${htmlId}`);
    console.log(
      `Flex Widget ID Index: ${flexWidgetIndex}, Value: ${flexWidgetId}`
    );

    const sectionResult = {
      sectionIndex: i + 1,
      sectionId: section.sectionId,
      htmlIdUsed: htmlId,
      flexWidgetIdUsed: flexWidgetId,
      htmlIdIndex: htmlIdIndex,
      flexWidgetIdIndex: flexWidgetIndex,
      primaryBatch: null,
      secondaryBatch: null,
      success: false,
      error: null,
    };

    try {
      let batchToProcess = null;
      let batchType = null;

      // Determine which batch to process for this section
      if (primaryBatchBody && Array.isArray(primaryBatchBody)) {
        // Handle dynamic assignment of batch bodies
        let batchIndex = Math.min(i, primaryBatchBody.length - 1);

        // If we have more sections than batch bodies, cycle through them
        if (i >= primaryBatchBody.length) {
          batchIndex = i % primaryBatchBody.length;
        }

        if (primaryBatchBody[batchIndex]) {
          batchToProcess = [primaryBatchBody[batchIndex]];
          batchType = "primary";
          console.log(
            `✅ Primary batch API triggered for section ${
              i + 1
            } using batch index ${batchIndex} (total batches: ${
              primaryBatchBody.length
            })`
          );
        }
      } else if (secondaryBatchBody && Array.isArray(secondaryBatchBody)) {
        const secondaryIndex = i - (primaryBatchBody?.length || 0);
        if (secondaryIndex >= 0 && secondaryIndex < secondaryBatchBody.length) {
          batchToProcess = [secondaryBatchBody[secondaryIndex]];
          batchType = "secondary";
          console.log(`✅ Secondary batch API triggered for section ${i + 1}`);
        }
      }

      // Validate we have required IDs
      if (!flexWidgetId) {
        console.warn(
          `⚠️ Section ${
            i + 1
          } missing Flex Widget ID - this will cause API failures`
        );
        sectionResult.error = "Missing Flex Widget ID";
        allResults.push(sectionResult);
        continue;
      }

      // Execute batch operation if we have data to process
      if (batchToProcess && batchToProcess.length > 0) {
        try {
          const batchResult = await executeBatchOperations(
            pageId,
            uuid,
            alias,
            [section],
            [htmlId],
            [flexWidgetId], // Pass the correctly assigned flex widget ID
            batchToProcess,
            enhancedWidgetMatching
          );

          console.log(
            `${batchType} batch API response for section ${i + 1}:`,
            JSON.stringify(batchResult, null, 2)
          );

          const resultData = {
            success: batchResult[0]?.success || false,
            insertedElements: batchResult[0]?.insertedElements || [],
            batchResponses: batchResult[0]?.batchResponses || [],
            processedWidgets: batchResult[0]?.processedWidgets || 0,
            childGroups: batchResult[0]?.childGroups || 0,
            error: batchResult[0]?.error,
          };

          if (batchType === "primary") {
            sectionResult.primaryBatch = resultData;
          } else {
            sectionResult.secondaryBatch = resultData;
          }

          sectionResult.success = resultData.success;

          console.log(
            `${batchType} batch result for section ${i + 1}: ${
              resultData.success ? "SUCCESS" : "FAILED"
            }`
          );

          // Add delay between API calls to avoid rate limiting
          if (i < extractedIds.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        } catch (batchError) {
          console.error(
            `❌ Error executing ${batchType} batch for section ${i + 1}:`,
            batchError
          );

          const errorData = {
            success: false,
            error: batchError.message,
            insertedElements: [],
            batchResponses: [],
            processedWidgets: 0,
            childGroups: 0,
          };

          if (batchType === "primary") {
            sectionResult.primaryBatch = errorData;
          } else {
            sectionResult.secondaryBatch = errorData;
          }

          sectionResult.error = batchError.message;
        }
      } else {
        // No batch to process for this section
        console.log(
          `✅ Section ${i + 1} marked as success - no batches to execute`
        );
        sectionResult.success = true;
      }
    } catch (error) {
      console.error(`❌ Error processing section ${i + 1}:`, error);
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
  console.log(
    `Successful sections: ${allResults.filter((r) => r.success).length}`
  );
  console.log(
    `Failed sections: ${allResults.filter((r) => !r.success).length}`
  );
  console.log(
    `Primary batch executions: ${
      allResults.filter((r) => r.primaryBatch).length
    }`
  );
  console.log(
    `Secondary batch executions: ${
      allResults.filter((r) => r.secondaryBatch).length
    }`
  );

  return allResults;
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

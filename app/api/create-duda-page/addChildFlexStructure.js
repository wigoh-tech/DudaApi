// addChildFlexStructure.js
// Function to extract IDs from Flex Structure sections when primaryDirectChildren > 2
import { DUDA_API_CONFIG } from "../../../lib/dudaApi";
/**
 * Extracts all relevant IDs from Flex Structure sections when primary has more children
 * @param {Object} flexStructureData - The flex structure response
 * @param {Object} structureComparison - The comparison result
 * @returns {Array} - Array of extracted ID objects for sections that need child groups
 */
export function extractFlexStructureIdsForChildGroups(
  flexStructureData,
  structureComparison
) {
  console.log("\n=== EXTRACTING FLEX STRUCTURE IDS FOR CHILD GROUPS ===");

  if (!flexStructureData || !structureComparison) {
    console.log("❌ Missing flex structure data or comparison result");
    return [];
  }

  const extractedIds = [];

  // Handle different flex structure formats
  let dataToProcess = [];
  if (Array.isArray(flexStructureData)) {
    dataToProcess = flexStructureData;
  } else if (flexStructureData.elements) {
    dataToProcess = [flexStructureData];
  } else {
    console.log("❌ Unrecognized flex structure format");
    return extractedIds;
  }

  // Check comparison results for sections where primary has more children
  if (
    structureComparison.comparison &&
    structureComparison.comparison.sectionBySection
  ) {
    structureComparison.comparison.sectionBySection.forEach(
      (sectionComparison, sectionIndex) => {
        // Check if primary section has more than 2 direct children in any parent group
        if (sectionComparison.parentGroupDetails) {
          sectionComparison.parentGroupDetails.forEach(
            (parentGroupDetail, groupIndex) => {
              if (parentGroupDetail.primaryDirectChildren > 2) {
                console.log(
                  `\n--- Processing Section ${sectionIndex + 1}, Parent Group ${
                    groupIndex + 1
                  } ---`
                );
                console.log(
                  `Primary Direct Children: ${parentGroupDetail.primaryDirectChildren}`
                );
                console.log(
                  `Flex Direct Children: ${parentGroupDetail.flexDirectChildren}`
                );

                // Extract IDs from corresponding flex structure section
                const flexSection = dataToProcess[sectionIndex];
                if (flexSection && flexSection.elements) {
                  const sectionIds = extractSectionIds(
                    flexSection,
                    sectionIndex + 1,
                    groupIndex
                  );
                  if (sectionIds) {
                    extractedIds.push(sectionIds);
                  }
                }
              }
            }
          );
        }
      }
    );
  }

  console.log(
    `\n✅ Extracted IDs for ${extractedIds.length} sections requiring child groups`
  );
  return extractedIds;
}

/**
 * Extracts all relevant IDs from a specific flex structure section
 * @param {Object} section - The flex structure section
 * @param {Number} sectionIndex - The section index
 * @param {Number} parentGroupIndex - The parent group index
 * @returns {Object} - Object containing all extracted IDs
 */
function extractSectionIds(section, sectionIndex, parentGroupIndex) {
  console.log(`\n--- Extracting IDs from Section ${sectionIndex} ---`);

  const elements = section.elements;
  const sectionIds = {
    sectionIndex: sectionIndex,
    parentGroupIndex: parentGroupIndex,
    elementId: section.id || null,
    sectionId: section.id || null,
    gridId: null,
    parentGroupId: null,
    childGroup1Id: null,
    childGroup2Id: null,
    allChildGroupIds: [],
    allElementIds: Object.keys(elements),
    extractedAt: new Date().toISOString(),
  };

  // Find grid element
  const gridElement = Object.values(elements).find((el) => el.type === "grid");
  if (gridElement) {
    sectionIds.gridId = gridElement.id;
    console.log(`  Found Grid: ${gridElement.id}`);
  }

  // Find parent groups (groups that are direct children of grid or section)
  const parentGroups = Object.values(elements).filter((el) => {
    if (el.type !== "group") return false;

    // Check if parent is grid or section
    const parent = elements[el.parentId];
    return (
      parent &&
      (parent.type === "grid" || parent.type === "section" || !el.parentId)
    );
  });

  if (parentGroups.length > parentGroupIndex) {
    const targetParentGroup = parentGroups[parentGroupIndex];
    sectionIds.parentGroupId = targetParentGroup.id;
    console.log(`  Found Parent Group: ${targetParentGroup.id}`);

    // Find child groups under this parent group
    if (targetParentGroup.children && targetParentGroup.children.length > 0) {
      const childGroups = targetParentGroup.children
        .map((childId) => elements[childId])
        .filter((child) => child && child.type === "group");

      childGroups.forEach((childGroup, index) => {
        sectionIds.allChildGroupIds.push(childGroup.id);
        if (index === 0) {
          sectionIds.childGroup1Id = childGroup.id;
          console.log(`  Found Child Group 1: ${childGroup.id}`);
        } else if (index === 1) {
          sectionIds.childGroup2Id = childGroup.id;
          console.log(`  Found Child Group 2: ${childGroup.id}`);
        }
      });

      console.log(`  Total Child Groups Found: ${childGroups.length}`);
    }
  } else if (parentGroups.length > 0) {
    // Fallback to first parent group if index doesn't match
    const firstParentGroup = parentGroups[0];
    sectionIds.parentGroupId = firstParentGroup.id;
    console.log(`  Using First Available Parent Group: ${firstParentGroup.id}`);
  }

  // Log summary
  console.log(`  Section IDs Summary:`);
  console.log(`    Element ID: ${sectionIds.elementId}`);
  console.log(`    Section ID: ${sectionIds.sectionId}`);
  console.log(`    Grid ID: ${sectionIds.gridId}`);
  console.log(`    Parent Group ID: ${sectionIds.parentGroupId}`);
  console.log(`    Child Group 1 ID: ${sectionIds.childGroup1Id}`);
  console.log(`    Child Group 2 ID: ${sectionIds.childGroup2Id}`);
  console.log(`    Total Child Groups: ${sectionIds.allChildGroupIds.length}`);

  return sectionIds;
}

/**
 * Processes and stores extracted IDs for sections requiring child groups
 * @param {Object} flexStructureData - The flex structure response
 * @param {Object} structureComparison - The comparison result
 * @returns {Object} - Processing result with extracted IDs
 */
export function processChildGroupExtractions(
  flexStructureData,
  structureComparison
) {
  console.log("\n=== PROCESSING CHILD GROUP EXTRACTIONS ===");

  const extractedIds = extractFlexStructureIdsForChildGroups(
    flexStructureData,
    structureComparison
  );

  const result = {
    success: true,
    extractedSections: extractedIds.length,
    extractedIds: extractedIds,
    summary: {
      totalSectionsProcessed: extractedIds.length,
      sectionsRequiringChildGroups: extractedIds.filter(
        (section) => section.childGroup1Id || section.childGroup2Id
      ).length,
      sectionsWithGrids: extractedIds.filter((section) => section.gridId)
        .length,
      sectionsWithParentGroups: extractedIds.filter(
        (section) => section.parentGroupId
      ).length,
    },
    processedAt: new Date().toISOString(),
  };

  console.log(`\n✅ Child Group Extraction Processing Complete:`);
  console.log(`  Sections Processed: ${result.summary.totalSectionsProcessed}`);
  console.log(
    `  Sections with Child Groups: ${result.summary.sectionsRequiringChildGroups}`
  );
  console.log(`  Sections with Grids: ${result.summary.sectionsWithGrids}`);
  console.log(
    `  Sections with Parent Groups: ${result.summary.sectionsWithParentGroups}`
  );

  return result;
}

/**
 * Adds child groups to flex structure when primary has more children than flex
 * @param {Object} extractedIds - The extracted IDs from processChildGroupExtractions
 * @param {string} uuid - Page UUID from create page response
 * @param {string} pageId - Page ID from create page response
 * @returns {Object} - API response
 */
export async function addChildGroup(extractedIds, uuid, pageId) {
  console.log("\n=== ADDING CHILD GROUP TO FLEX STRUCTURE ===");

  if (!extractedIds || !uuid || !pageId) {
    throw new Error(
      "Missing required parameters: extractedIds, uuid, or pageId"
    );
  }

  // Calculate how many child groups to add
  const primaryDirectChildren = extractedIds.primaryDirectChildren || 0;
  const flexDirectChildren = extractedIds.flexDirectChildren || 0;
  const childGroupsToAdd = primaryDirectChildren - flexDirectChildren;

  if (childGroupsToAdd <= 0) {
    console.log("No child groups need to be added");
    return {
      success: true,
      message: "No child groups needed",
      childGroupsAdded: 0,
    };
  }

  console.log(`Need to add ${childGroupsToAdd} child group(s)`);
  console.log(`Primary Direct Children: ${primaryDirectChildren}`);
  console.log(`Flex Direct Children: ${flexDirectChildren}`);

  // Get the parent group ID where we need to add children
  const parentGroupId = extractedIds.parentGroupId;
  if (!parentGroupId) {
    throw new Error("Parent Group ID not found in extracted data");
  }

  // Generate new child group IDs
  const newChildGroups = [];
  for (let i = 0; i < childGroupsToAdd; i++) {
    const newGroupId = `group_${Date.now()}_${i}`;
    newChildGroups.push(newGroupId);
  }

  console.log(`Generated new child group IDs:`, newChildGroups);

  // Build the API body with existing structure + new child groups
  const apiBody = {
    id: extractedIds.elementId || uuid,
    section: {
      prevCustomClassName: "",
      type: "section",
      id: extractedIds.sectionId,
      children: [extractedIds.gridId],
      name: "",
      data: {},
      customClassName: "",
    },
    rootContainerId: extractedIds.sectionId,
    elements: {
      [extractedIds.sectionId]: {
        type: "section",
        id: extractedIds.sectionId,
        children: [extractedIds.gridId],
        name: "",
        data: {},
        customClassName: "",
      },
      [extractedIds.gridId]: {
        type: "grid",
        id: extractedIds.gridId,
        parentId: extractedIds.sectionId,
        children: [parentGroupId],
        name: "",
        data: {
          "data-layout-grid": "",
        },
        customClassName: "",
      },
      [parentGroupId]: {
        type: "group",
        id: parentGroupId,
        parentId: extractedIds.gridId,
        children: [...(extractedIds.allChildGroupIds || []), ...newChildGroups],
        name: "",
        data: {},
        customClassName: "",
      },
    },
    styles: {
      breakpoints: {
        mobile: {
          idToRules: {},
        },
        mobile_implicit: {
          idToRules: {},
        },
        common: {
          idToRules: {},
        },
        tablet_implicit: {
          idToRules: {},
        },
        desktop: {
          idToRules: {},
        },
        tablet: {
          idToRules: {},
        },
      },
    },
  };

  // Add existing child groups to elements
  if (
    extractedIds.allChildGroupIds &&
    extractedIds.allChildGroupIds.length > 0
  ) {
    extractedIds.allChildGroupIds.forEach((childGroupId) => {
      apiBody.elements[childGroupId] = {
        type: "group",
        id: childGroupId,
        parentId: parentGroupId,
        children: [],
        name: "",
        data: {},
        customClassName: "",
      };

      // Add default styles for existing child groups
      apiBody.styles.breakpoints.common.idToRules[childGroupId] = {
        "<id>": {
          "min-height": "8px",
          "column-gap": "4%",
          "row-gap": "24px",
          width: "30.666666666666668%",
          "min-width": "4%",
          padding: "16px 16px 16px 16px",
        },
      };

      apiBody.styles.breakpoints.mobile.idToRules[childGroupId] = {
        "<id>": {
          width: "100%",
          "min-height": "80px",
          "align-items": "center",
        },
      };
    });
  }

  // Add new child groups to elements with styles
  newChildGroups.forEach((newGroupId) => {
    apiBody.elements[newGroupId] = {
      type: "group",
      id: newGroupId,
      parentId: parentGroupId,
      children: [],
      name: "",
      data: {},
      customClassName: "",
    };

    // Add styles for new child groups
    apiBody.styles.breakpoints.common.idToRules[newGroupId] = {
      "<id>": {
        "background-size": "cover",
        "background-repeat": "no-repeat",
        "background-position": "50% 50%",
        display: "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-items": "flex-start",
        position: "relative",
        "max-width": "100%",
        "align-self": "stretch",
        width: "30.666666666666668%",
        "min-width": "4%",
        "min-height": "8px",
        "column-gap": "4%",
        "row-gap": "24px",
        padding: "16px 16px 16px 16px",
      },
    };

    apiBody.styles.breakpoints.mobile.idToRules[newGroupId] = {
      "<id>": {
        width: "100%",
        "min-height": "80px",
        "align-items": "center",
      },
    };
  });

  // Add parent group styles
  apiBody.styles.breakpoints.common.idToRules[parentGroupId] = {
    "<id>": {
      "padding-top": "4%",
      "padding-bottom": "4%",
      "min-height": "240px",
      "column-gap": "4%",
      "row-gap": "24px",
      width: "100%",
      "flex-wrap": "nowrap",
    },
  };

  apiBody.styles.breakpoints.mobile.idToRules[parentGroupId] = {
    "<id>": {
      "min-height": "0",
      "flex-direction": "column",
      "padding-left": "4%",
      "padding-right": "4%",
      "flex-wrap": "nowrap",
    },
  };

  apiBody.styles.breakpoints.tablet.idToRules[parentGroupId] = {
    "<id>": {
      "padding-left": "2%",
      "padding-right": "2%",
    },
  };

  try {
    console.log("Making API request to update flex structure...");
    console.log("API Body:", JSON.stringify(apiBody, null, 2));

    const response = await fetch(
      `${DUDA_API_CONFIG.baseUrl}/uis/pages/${uuid}/flexStructure?currentEditorPageId=${pageId}`,
      {
        method: "PUT",
        headers: {
          ...DUDA_API_CONFIG.headers,
          "content-type": "application/json",
          referer: `https://my.duda.co/home/site/${DUDA_API_CONFIG.siteId}/home`,
          cookie: DUDA_API_CONFIG.cookies,
        },
        body: JSON.stringify(apiBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Flex Structure API error: ${response.status} - ${errorText}`
      );
    }

    const result = await response.json();

    console.log("✅ Child groups added successfully");
    console.log("API Response:", JSON.stringify(result, null, 2));

    return {
      success: true,
      childGroupsAdded: childGroupsToAdd,
      newChildGroupIds: newChildGroups,
      apiResponse: result,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Error adding child groups:", error);
    throw error;
  }
}

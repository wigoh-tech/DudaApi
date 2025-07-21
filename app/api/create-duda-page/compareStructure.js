// compareStructure.js
// Function to compare Primary Batch Request Body structure with Flex Structure response
// UPDATED: Focus only on parent groups and their child counts

/**
 * Extracts parent group structure and child counts from Primary Batch Request Body
 * @param {Array} primaryBatchBody - The primary batch request body array
 * @returns {Object} - Extracted parent group structure with child counts
 */
export function extractPrimaryBatchGroups(primaryBatchBody) {
  console.log("\n=== EXTRACTING PRIMARY BATCH PARENT GROUPS ===");

  if (!primaryBatchBody || !Array.isArray(primaryBatchBody)) {
    console.log("❌ Invalid primary batch body provided");
    return {
      sections: [],
      totalSections: 0,
      totalParentGroups: 0,
      totalChildElements: 0,
      summary: "No valid primary batch body provided",
    };
  }

  const extractedStructure = {
    sections: [],
    totalSections: 0,
    totalParentGroups: 0,
    totalChildElements: 0,
    summary: "",
  };

  primaryBatchBody.forEach((section, sectionIndex) => {
    console.log(
      `\n--- Processing Primary Batch Section ${sectionIndex + 1} ---`
    );

    const sectionStructure = {
      sectionIndex: sectionIndex + 1,
      sectionId: section.id || `section-${sectionIndex + 1}`,
      parentGroups: [],
      totalParentGroups: 0,
      totalChildElements: 0,
    };

    // Extract elements from the section
    if (section.elements) {
      const elements = section.elements;

      // Find all parent group elements (groups that are not children of other groups)
      Object.values(elements).forEach((element) => {
        if (element.type === "group") {
          const groupType = determineGroupType(element, elements);

          // Only include parent groups (not child groups)
          if (groupType === "parentGroup" || groupType === "rootGroup") {
            const parentGroupInfo = {
              groupId: element.id,
              parentId: element.parentId || null,
              directChildCount: element.children ? element.children.length : 0,
              children: element.children || [],
              groupType: groupType,
              childGroups: [],
              totalNestedChildren: 0,
            };

            // Find nested child groups under this parent group
            if (element.children && element.children.length > 0) {
              element.children.forEach((childId) => {
                const childElement = elements[childId];
                if (childElement && childElement.type === "group") {
                  const childGroupInfo = {
                    groupId: childElement.id,
                    childCount: childElement.children
                      ? childElement.children.length
                      : 0,
                    children: childElement.children || [],
                  };
                  parentGroupInfo.childGroups.push(childGroupInfo);
                  parentGroupInfo.totalNestedChildren +=
                    childGroupInfo.childCount;
                }
              });
            }

            sectionStructure.parentGroups.push(parentGroupInfo);
            sectionStructure.totalParentGroups++;
            sectionStructure.totalChildElements +=
              parentGroupInfo.directChildCount +
              parentGroupInfo.totalNestedChildren;

            console.log(`  Parent Group: ${parentGroupInfo.groupId}`);
            console.log(
              `    Direct Children: ${parentGroupInfo.directChildCount}`
            );
            console.log(
              `    Child Groups: ${parentGroupInfo.childGroups.length}`
            );
            console.log(
              `    Total Nested Children: ${parentGroupInfo.totalNestedChildren}`
            );
            console.log(`    Group Type: ${parentGroupInfo.groupType}`);
          }
        }
      });
    }

    extractedStructure.sections.push(sectionStructure);
    extractedStructure.totalSections++;
    extractedStructure.totalParentGroups += sectionStructure.totalParentGroups;
    extractedStructure.totalChildElements +=
      sectionStructure.totalChildElements;

    console.log(
      `  Section Summary: ${sectionStructure.totalParentGroups} parent groups, ${sectionStructure.totalChildElements} total children`
    );
  });

  extractedStructure.summary = `Extracted ${extractedStructure.totalParentGroups} parent groups from ${extractedStructure.totalSections} sections`;

  console.log(
    `\n✅ Primary Batch Parent Groups Extraction Complete: ${extractedStructure.summary}`
  );
  return extractedStructure;
}

/**
 * Extracts parent group structure and child counts from Flex Structure response
 * @param {Object} flexStructureData - The flex structure response
 * @returns {Object} - Extracted parent group structure with child counts
 */
export function extractFlexStructureGroups(flexStructureData) {
  console.log("\n=== EXTRACTING FLEX STRUCTURE PARENT GROUPS ===");

  if (!flexStructureData) {
    console.log("❌ Invalid flex structure data provided");
    return {
      sections: [],
      totalSections: 0,
      totalParentGroups: 0,
      totalChildElements: 0,
      summary: "No valid flex structure data provided",
    };
  }

  const extractedStructure = {
    sections: [],
    totalSections: 0,
    totalParentGroups: 0,
    totalChildElements: 0,
    summary: "",
  };

  // Handle different flex structure formats
  let dataToProcess = [];
  if (Array.isArray(flexStructureData)) {
    dataToProcess = flexStructureData;
  } else if (flexStructureData.elements) {
    dataToProcess = [flexStructureData];
  } else {
    console.log("❌ Unrecognized flex structure format");
    return extractedStructure;
  }

  dataToProcess.forEach((section, sectionIndex) => {
    console.log(
      `\n--- Processing Flex Structure Section ${sectionIndex + 1} ---`
    );

    const sectionStructure = {
      sectionIndex: sectionIndex + 1,
      sectionId: section.id || `flex-section-${sectionIndex + 1}`,
      parentGroups: [],
      totalParentGroups: 0,
      totalChildElements: 0,
    };

    if (section.elements) {
      const elements = section.elements;

      // Find all parent group elements (groups that are not children of other groups)
      Object.values(elements).forEach((element) => {
        if (element.type === "group") {
          const groupType = determineGroupType(element, elements);

          // Only include parent groups (not child groups)
          if (groupType === "parentGroup" || groupType === "rootGroup") {
            const parentGroupInfo = {
              groupId: element.id,
              parentId: element.parentId || null,
              directChildCount: element.children ? element.children.length : 0,
              children: element.children || [],
              groupType: groupType,
              childGroups: [],
              totalNestedChildren: 0,
            };

            // Find nested child groups under this parent group
            if (element.children && element.children.length > 0) {
              element.children.forEach((childId) => {
                const childElement = elements[childId];
                if (childElement && childElement.type === "group") {
                  const childGroupInfo = {
                    groupId: childElement.id,
                    childCount: childElement.children
                      ? childElement.children.length
                      : 0,
                    children: childElement.children || [],
                  };
                  parentGroupInfo.childGroups.push(childGroupInfo);
                  parentGroupInfo.totalNestedChildren +=
                    childGroupInfo.childCount;
                }
              });
            }

            sectionStructure.parentGroups.push(parentGroupInfo);
            sectionStructure.totalParentGroups++;
            sectionStructure.totalChildElements +=
              parentGroupInfo.directChildCount +
              parentGroupInfo.totalNestedChildren;

            console.log(`  Parent Group: ${parentGroupInfo.groupId}`);
            console.log(
              `    Direct Children: ${parentGroupInfo.directChildCount}`
            );
            console.log(
              `    Child Groups: ${parentGroupInfo.childGroups.length}`
            );
            console.log(
              `    Total Nested Children: ${parentGroupInfo.totalNestedChildren}`
            );
            console.log(`    Group Type: ${parentGroupInfo.groupType}`);
          }
        }
      });
    }

    extractedStructure.sections.push(sectionStructure);
    extractedStructure.totalSections++;
    extractedStructure.totalParentGroups += sectionStructure.totalParentGroups;
    extractedStructure.totalChildElements +=
      sectionStructure.totalChildElements;

    console.log(
      `  Section Summary: ${sectionStructure.totalParentGroups} parent groups, ${sectionStructure.totalChildElements} total children`
    );
  });

  extractedStructure.summary = `Extracted ${extractedStructure.totalParentGroups} parent groups from ${extractedStructure.totalSections} sections`;

  console.log(
    `\n✅ Flex Structure Parent Groups Extraction Complete: ${extractedStructure.summary}`
  );
  return extractedStructure;
}

/**
 * Compares Primary Batch and Flex Structure parent group structures
 * @param {Array} primaryBatchBody - The primary batch request body array
 * @param {Object} flexStructureData - The flex structure response
 * @returns {Object} - Comparison results focusing on parent groups
 */
export function compareStructures(primaryBatchBody, flexStructureData) {
  console.log("\n=== COMPARING PARENT GROUP STRUCTURES ===");

  const primaryStructure = extractPrimaryBatchGroups(primaryBatchBody);
  const flexStructure = extractFlexStructureGroups(flexStructureData);

  // Calculate total direct children for primary and flex
  const primaryTotalDirectChildren = primaryStructure.sections.reduce(
    (sum, section) =>
      sum +
      section.parentGroups.reduce(
        (sectionSum, group) => sectionSum + group.directChildCount,
        0
      ),
    0
  );

  const flexTotalDirectChildren = flexStructure.sections.reduce(
    (sum, section) =>
      sum +
      section.parentGroups.reduce(
        (sectionSum, group) => sectionSum + group.directChildCount,
        0
      ),
    0
  );

  const comparison = {
    primaryBatch: primaryStructure,
    flexStructure: flexStructure,
    comparison: {
      sectionsMatch:
        primaryStructure.totalSections === flexStructure.totalSections,
      parentGroupsMatch:
        primaryStructure.totalParentGroups === flexStructure.totalParentGroups,
      directChildrenMatch:
        primaryTotalDirectChildren === flexTotalDirectChildren,
      sectionBySection: [],
    },
    parentGroupDetails: [],
    summary: {
      primaryBatchSections: primaryStructure.totalSections,
      flexStructureSections: flexStructure.totalSections,
      primaryBatchGroups: primaryStructure.totalParentGroups,
      flexStructureGroups: flexStructure.totalParentGroups,
      primaryDirectChildren: primaryTotalDirectChildren,
      flexDirectChildren: flexTotalDirectChildren,
      sectionDifference: Math.abs(
        primaryStructure.totalSections - flexStructure.totalSections
      ),
      groupDifference: Math.abs(
        primaryStructure.totalParentGroups - flexStructure.totalParentGroups
      ),
      childrenDifference: Math.abs(
        primaryTotalDirectChildren - flexTotalDirectChildren
      ),
      matchStatus: "PARTIAL",
    },
  };

  // Compare section by section (parent groups only)
  const maxSections = Math.max(
    primaryStructure.totalSections,
    flexStructure.totalSections
  );

  for (let i = 0; i < maxSections; i++) {
    const primarySection = primaryStructure.sections[i];
    const flexSection = flexStructure.sections[i];

    const sectionComparison = {
      sectionIndex: i + 1,
      primaryExists: !!primarySection,
      flexExists: !!flexSection,
      primaryParentGroups: primarySection
        ? primarySection.totalParentGroups
        : 0,
      flexParentGroups: flexSection ? flexSection.totalParentGroups : 0,
      primaryChildElements: primarySection
        ? primarySection.totalChildElements
        : 0,
      flexChildElements: flexSection ? flexSection.totalChildElements : 0,
      parentGroupsMatch: false,
      childElementsMatch: false,
      status: "MISMATCH",
      parentGroupDetails: [],
    };

    if (primarySection && flexSection) {
      sectionComparison.parentGroupsMatch =
        primarySection.totalParentGroups === flexSection.totalParentGroups;
      sectionComparison.childElementsMatch =
        primarySection.totalChildElements === flexSection.totalChildElements;

      // Compare individual parent groups
      const maxParentGroups = Math.max(
        primarySection.parentGroups.length,
        flexSection.parentGroups.length
      );
      for (let j = 0; j < maxParentGroups; j++) {
        const primaryParentGroup = primarySection.parentGroups[j];
        const flexParentGroup = flexSection.parentGroups[j];

        const parentGroupComparison = {
          groupIndex: j + 1,
          primaryGroupId: primaryParentGroup
            ? primaryParentGroup.groupId
            : null,
          flexGroupId: flexParentGroup ? flexParentGroup.groupId : null,
          primaryDirectChildren: primaryParentGroup
            ? primaryParentGroup.directChildCount
            : 0,
          flexDirectChildren: flexParentGroup
            ? flexParentGroup.directChildCount
            : 0,
          primaryChildGroups: primaryParentGroup
            ? primaryParentGroup.childGroups.length
            : 0,
          flexChildGroups: flexParentGroup
            ? flexParentGroup.childGroups.length
            : 0,
          primaryTotalNestedChildren: primaryParentGroup
            ? primaryParentGroup.totalNestedChildren
            : 0,
          flexTotalNestedChildren: flexParentGroup
            ? flexParentGroup.totalNestedChildren
            : 0,
          directChildrenMatch: false,
          childGroupsMatch: false,
          nestedChildrenMatch: false,
          overallMatch: false,
        };

        if (primaryParentGroup && flexParentGroup) {
          parentGroupComparison.directChildrenMatch =
            primaryParentGroup.directChildCount ===
            flexParentGroup.directChildCount;
          parentGroupComparison.childGroupsMatch =
            primaryParentGroup.childGroups.length ===
            flexParentGroup.childGroups.length;
          parentGroupComparison.nestedChildrenMatch =
            primaryParentGroup.totalNestedChildren ===
            flexParentGroup.totalNestedChildren;
          parentGroupComparison.overallMatch =
            parentGroupComparison.directChildrenMatch &&
            parentGroupComparison.childGroupsMatch &&
            parentGroupComparison.nestedChildrenMatch;
        }

        sectionComparison.parentGroupDetails.push(parentGroupComparison);
      }

      if (
        sectionComparison.parentGroupsMatch &&
        sectionComparison.childElementsMatch
      ) {
        sectionComparison.status = "MATCH";
      } else if (
        sectionComparison.parentGroupsMatch ||
        sectionComparison.childElementsMatch
      ) {
        sectionComparison.status = "PARTIAL_MATCH";
      }
    }

    comparison.comparison.sectionBySection.push(sectionComparison);
    comparison.parentGroupDetails.push(...sectionComparison.parentGroupDetails);

    console.log(`Section ${i + 1} Parent Groups Comparison:`);
    console.log(
      `  Primary: ${sectionComparison.primaryParentGroups} parent groups, ${sectionComparison.primaryChildElements} total children`
    );
    console.log(
      `  Flex: ${sectionComparison.flexParentGroups} parent groups, ${sectionComparison.flexChildElements} total children`
    );
    console.log(`  Status: ${sectionComparison.status}`);
  }

  // Determine overall match status
  const perfectMatches = comparison.comparison.sectionBySection.filter(
    (s) => s.status === "MATCH"
  ).length;
  const partialMatches = comparison.comparison.sectionBySection.filter(
    (s) => s.status === "PARTIAL_MATCH"
  ).length;

  if (perfectMatches === maxSections) {
    comparison.summary.matchStatus = "PERFECT_MATCH";
  } else if (perfectMatches > 0 || partialMatches > 0) {
    comparison.summary.matchStatus = "PARTIAL_MATCH";
  } else {
    comparison.summary.matchStatus = "NO_MATCH";
  }

  console.log(`\n✅ Parent Group Structure Comparison Complete:`);
  console.log(`  Overall Status: ${comparison.summary.matchStatus}`);
  console.log(`  Perfect Matches: ${perfectMatches}/${maxSections}`);
  console.log(`  Partial Matches: ${partialMatches}/${maxSections}`);
  console.log(
    `  Parent Group Difference: ${comparison.summary.groupDifference}`
  );

  return comparison;
}

/**
 * Helper function to determine group type based on its position in hierarchy
 * UPDATED: Better logic to identify parent groups vs child groups
 * @param {Object} element - The group element
 * @param {Object} elements - All elements in the section
 * @returns {String} - Group type (parentGroup, childGroup, rootGroup)
 */
function determineGroupType(element, elements) {
  if (!element.parentId) {
    return "rootGroup";
  }

  const parent = elements[element.parentId];

  // If parent is a grid, this is likely a parent group
  if (parent && parent.type === "grid") {
    return "parentGroup";
  }

  // If parent is a group, this is a child group
  if (parent && parent.type === "group") {
    return "childGroup";
  }

  // If parent is a section or other container, this could be a parent group
  if (parent && (parent.type === "section" || parent.type === "container")) {
    return "parentGroup";
  }

  return "unknownGroup";
}

/**
 * Prints detailed parent group structure explanation
 * @param {Object} structure - The extracted structure
 * @param {String} structureType - Type of structure (Primary Batch or Flex Structure)
 */
export function printStructureExplanation(structure, structureType) {
  console.log(
    `\n=== ${structureType.toUpperCase()} PARENT GROUP STRUCTURE EXPLANATION ===`
  );

  if (!structure || !structure.sections || structure.sections.length === 0) {
    console.log(`❌ No ${structureType} structure data available`);
    return;
  }

  // Calculate total direct children
  const totalDirectChildren = structure.sections.reduce(
    (sum, section) =>
      sum +
      section.parentGroups.reduce(
        (sectionSum, group) => sectionSum + group.directChildCount,
        0
      ),
    0
  );

  console.log(`📊 Overview:`);
  console.log(`  Total Sections: ${structure.totalSections}`);
  console.log(`  Total Parent Groups: ${structure.totalParentGroups}`);
  console.log(`  Total Direct Children: ${totalDirectChildren}`);
  console.log(`  Total Child Elements: ${structure.totalChildElements}`);
  console.log(`  Summary: ${structure.summary}`);

  structure.sections.forEach((section, index) => {
    console.log(`\n📁 Section ${index + 1} (${section.sectionId}):`);
    console.log(`  Parent Groups: ${section.totalParentGroups}`);
    console.log(`  Total Child Elements: ${section.totalChildElements}`);

    if (section.parentGroups && section.parentGroups.length > 0) {
      console.log(`  Parent Group Details:`);
      section.parentGroups.forEach((parentGroup, groupIndex) => {
        console.log(
          `    ${groupIndex + 1}. ${parentGroup.groupId} (${
            parentGroup.groupType
          })`
        );
        console.log(`       Direct Children: ${parentGroup.directChildCount}`);
        console.log(`       Child Groups: ${parentGroup.childGroups.length}`);
        console.log(
          `       Total Nested Children: ${parentGroup.totalNestedChildren}`
        );
        console.log(`       Parent: ${parentGroup.parentId || "None"}`);

        if (parentGroup.childGroups.length > 0) {
          console.log(`       Child Group Details:`);
          parentGroup.childGroups.forEach((childGroup, childIndex) => {
            console.log(
              `         ${childIndex + 1}. ${childGroup.groupId} (${
                childGroup.childCount
              } children)`
            );
          });
        }
      });
    } else {
      console.log(`  No parent groups found in this section`);
    }
  });
}

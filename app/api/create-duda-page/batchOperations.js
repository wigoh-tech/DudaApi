// Enhanced batchOperations.js with Zod validation and improved error handling - FIXED VERSION
import { z } from "zod";
import { DUDA_API_CONFIG } from "../../../lib/dudaApi";

// Store for widget matching data
let widgetMatchingData = {
  matches: [],
  matchedWidgetIds: [],
  widgetHtmlMap: new Map(), // widgetId -> html content
};

// Zod schemas for dynamic flex structure validation
const ElementDataSchema = z
  .object({
    "data-layout-grid": z.string().optional(),
    "data-widget-type": z.string().optional(),
  })
  .passthrough();

  const ElementSchema = z
  .object({
    id: z.string(),
    type: z.enum([
      "section", 
      "grid", 
      "group", 
      "widget_wrapper", 
      "inner_grid"
    ]),
    parentId: z.union([
      z.string(), 
      z.array(z.string())
    ]).optional(),
    children: z.array(z.string()).optional(),
    name: z.string().optional(),
    data: ElementDataSchema.optional(),
    customClassName: z.string().optional(),
    externalId: z.string().optional(),
  })
  .passthrough();

// Enhanced StyleRule schema to handle nested style objects
const StyleRuleSchema = z
  .object({
    "<id>": z.record(z.string(), z.any()), // Main style rules
  })
  .passthrough(); // Allow additional rule types

// Breakpoint schema with flexible rule structure
const BreakpointSchema = z
  .object({
    idToRules: z.record(z.string(), StyleRuleSchema),
  })
  .passthrough();

// Comprehensive Styles schema
const StylesSchema = z
  .object({
    breakpoints: z
      .object({
        mobile: BreakpointSchema.optional(),
        common: BreakpointSchema,
        tablet: BreakpointSchema.optional(),
        desktop: BreakpointSchema.optional(),
      })
      .passthrough(), // Allow additional breakpoints
  })
  .passthrough();

// Main FlexStructure schema with enhanced validation
const FlexStructureSchema = z
  .object({
    id: z.string(),
    elements: z.record(z.string(), ElementSchema),
    styles: StylesSchema,
    rootContainerId: z.string(),
    section: ElementSchema.optional(), // Some structures may have this
  })
  .passthrough(); // Allow additional top-level properties

// Batch request schema (unchanged but included for completeness)
const BatchRequestSchema = z.object({
  type: z.enum(["post", "put", "get", "delete"]),
  url: z.string(),
  data: z.record(z.string(), z.any()),
});

// Add this after the imports section
async function insertElementApi(pageId, parent, markup) {
  const url = `https://my.duda.co/api/uis/batch?op=create%20widget%20in%20flex&dm_device=desktop&currentEditorPageId=${pageId}`;

  const batchReqId = Math.random().toString(36).substring(2, 8);

  const payload = [
    {
      type: "post",
      url: `/pages/${pageId}/insertElement?dm_batchReqId=${batchReqId}`,
      data: {
        markup: markup,
        parent: parent,
        before: null,
        defaultLocation: false,
      },
    },
  ];

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        dm_loc: "/home/site/41e002a2/duda",
        dsid: "1048635",
        origin: "https://my.duda.co",
        priority: "u=1, i",
        referer: "https://my.duda.co/home/site/41e002a2/duda",
        "sec-ch-ua":
          '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "x-requested-with": "XMLHttpRequest",
        cookie: DUDA_API_CONFIG.cookies,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let parsedResponse = null;

    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.warn(
        "Failed to parse insert element response as JSON:",
        parseError
      );
    }

    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      response: responseText,
      parsedResponse: parsedResponse,
      responseHeaders: Object.fromEntries(response.headers.entries()),
    };
  } catch (error) {
    console.error("Insert element API error:", error);
    return {
      success: false,
      error: error.message,
      response: null,
      parsedResponse: null,
    };
  }
}

// Add after the widgetMatchingData store
let dynamicIdStore = {
  divIds: [],
  widgetIdToDivIdMap: new Map(),
  counter: 0,
};

// UPDATED: Enhanced storeWidgetMatchingData function to handle both data structures
export function storeWidgetMatchingData(enhancedMatching) {
  console.log("\n===== STORING WIDGET MATCHING DATA =====");

  if (!enhancedMatching) {
    console.warn("No enhanced matching data provided");
    return;
  }

  widgetMatchingData = {
    matches: [],
    matchedWidgetIds: [],
    widgetHtmlMap: new Map(),
  };

  let matches = [];
  let matchedWidgetIds = [];

  // Handle the new data structure (from route.js response)
  if (enhancedMatching.initial && enhancedMatching.initial.matches) {
    console.log("Using 'initial' matches from enhanced matching data");
    matches = enhancedMatching.initial.matches;
    matchedWidgetIds = enhancedMatching.initial.matchedWidgetIds || [];
  }
  // Handle the updated data structure (from route.js response)
  else if (enhancedMatching.updated && enhancedMatching.updated.matches) {
    console.log("Using 'updated' matches from enhanced matching data");
    matches = enhancedMatching.updated.matches;
    matchedWidgetIds = enhancedMatching.updated.matchedWidgetIds || [];
  }
  // Handle direct matches array (original structure)
  else if (
    enhancedMatching.matches &&
    Array.isArray(enhancedMatching.matches)
  ) {
    console.log("Using direct 'matches' array from enhanced matching data");
    matches = enhancedMatching.matches;
    matchedWidgetIds = enhancedMatching.matchedWidgetIds || [];
  }
  // Handle legacy structure with 'updated' property
  else if (enhancedMatching.updated && enhancedMatching.updated.matches) {
    console.log("Using legacy 'updated' structure");
    matches = enhancedMatching.updated.matches;
    matchedWidgetIds = enhancedMatching.updated.matchedWidgetIds || [];
  } else {
    console.warn("No valid matches found in enhanced matching data structure");
    console.log("Available keys:", Object.keys(enhancedMatching));
    return;
  }

  // Store the new data
  widgetMatchingData.matches = matches || [];
  widgetMatchingData.matchedWidgetIds = matchedWidgetIds || [];

  // Create widget ID to HTML mapping
  if (matches && Array.isArray(matches)) {
    matches.forEach((match) => {
      if (match.widgetId && match.element) {
        widgetMatchingData.widgetHtmlMap.set(match.widgetId, {
          html: match.element.html || "",
          outerHtml: match.element.outerHtml || "",
          text: match.element.text || "",
          attributes: match.element.attributes || {},
          matchType: match.matchType || "none",
          matchScore: match.matchScore || 0,
        });
      }
    });
  }

  console.log("Stored widget matching data:");
  console.log(`- Total matches: ${widgetMatchingData.matches.length}`);
  console.log(
    `- Matched widget IDs: ${widgetMatchingData.matchedWidgetIds.length}`
  );
  console.log(
    `- Widget HTML mappings: ${widgetMatchingData.widgetHtmlMap.size}`
  );

  // Log some example mappings for debugging
  console.log("\n=== SAMPLE WIDGET HTML MAPPINGS ===");
  let count = 0;
  for (const [widgetId, htmlData] of widgetMatchingData.widgetHtmlMap) {
    if (count < 3) {
      // Show first 3 mappings
      console.log(`Widget ID: ${widgetId}`);
      console.log(`  - Match Type: ${htmlData.matchType}`);
      console.log(`  - Match Score: ${htmlData.matchScore}`);
      console.log(
        `  - Text: ${
          htmlData.text ? htmlData.text.substring(0, 50) + "..." : "None"
        }`
      );
      console.log(
        `  - HTML Length: ${
          htmlData.html ? htmlData.html.length : 0
        } characters`
      );
      count++;
    } else {
      break;
    }
  }
}
// UPDATED: Enhanced getHtmlForWidgetId function with better debugging
export function getHtmlForWidgetId(widgetId) {
  console.log(`\n=== GETTING HTML FOR WIDGET ID: ${widgetId} ===`);

  if (!widgetMatchingData.widgetHtmlMap.has(widgetId)) {
    console.warn(`No HTML found for widget ID: ${widgetId}`);
    console.log(
      `Available widget IDs in map: ${Array.from(
        widgetMatchingData.widgetHtmlMap.keys()
      )}`
    );
    return null;
  }

  const matchData = widgetMatchingData.widgetHtmlMap.get(widgetId);
  console.log(`✅ Found HTML for widget ID: ${widgetId}`);
  console.log(`  - Match Type: ${matchData.matchType}`);
  console.log(`  - Match Score: ${matchData.matchScore}`);
  console.log(
    `  - HTML Length: ${matchData.html ? matchData.html.length : 0} characters`
  );
  console.log(
    `  - Text Preview: ${
      matchData.text ? matchData.text.substring(0, 100) + "..." : "None"
    }`
  );

  return {
    html: matchData.html,
    outerHtml: matchData.outerHtml,
    text: matchData.text,
    attributes: matchData.attributes,
    matchType: matchData.matchType,
    matchScore: matchData.matchScore,
  };
}
// NEW: Function to get all available widget IDs with HTML
export function getAvailableWidgetIds() {
  return Array.from(widgetMatchingData.widgetHtmlMap.keys());
}
// NEW: Function to get widget matching statistics
export function getWidgetMatchingStats() {
  return {
    totalMatches: widgetMatchingData.matches.length,
    totalMappings: widgetMatchingData.widgetHtmlMap.size,
    matchedWidgetIds: widgetMatchingData.matchedWidgetIds.length,
    widgetsWithHtml: Array.from(widgetMatchingData.widgetHtmlMap.keys()),
    matchTypeBreakdown: widgetMatchingData.matches.reduce((acc, match) => {
      const type = match.matchType || "unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {}),
  };
}

// Function to extract widget IDs from flex structure sections
function extractWidgetIdsFromFlexStructure(flexStructureSections) {
  console.log("\n===== EXTRACTING WIDGET IDS FROM FLEX STRUCTURE =====");

  if (!Array.isArray(flexStructureSections)) {
    console.warn("Flex structure sections is not an array");
    return [];
  }

  const allWidgetIds = [];

  flexStructureSections.forEach((section, sectionIndex) => {
    console.log(`\n--- Processing Section ${sectionIndex + 1} ---`);

    try {
      // Validate the section structure
      const validatedSection = FlexStructureSchema.parse(section);
      console.log(`✓ Section ${sectionIndex + 1} validation passed`);

      const sectionWidgetIds = [];

      if (validatedSection.elements) {
        Object.entries(validatedSection.elements).forEach(
          ([elementId, element]) => {
            if (element.type === "widget_wrapper") {
              sectionWidgetIds.push({
                id: elementId,
                name: element.name || "Unknown Widget",
                widgetType: element.data?.["data-widget-type"] || "unknown",
                externalId: element.externalId || null,
                parentId: element.parentId || null,
                sectionIndex: sectionIndex + 1,
                sectionId: validatedSection.id,
              });
            }
          }
        );
      }

      console.log(
        `Found ${sectionWidgetIds.length} widgets in section ${
          sectionIndex + 1
        }`
      );
      sectionWidgetIds.forEach((widget) => {
        console.log(
          `  - Widget ID: ${widget.id}, Type: ${widget.widgetType}, Parent: ${widget.parentId}`
        );
      });

      allWidgetIds.push(...sectionWidgetIds);
    } catch (error) {
      console.error(
        `✗ Section ${sectionIndex + 1} validation failed:`,
        error.errors
      );
      console.warn(
        `Continuing with potentially invalid section ${sectionIndex + 1}`
      );

      // Try to extract widgets without validation
      if (section.elements) {
        Object.entries(section.elements).forEach(([elementId, element]) => {
          if (element && element.type === "widget_wrapper") {
            allWidgetIds.push({
              id: elementId,
              name: element.name || "Unknown Widget",
              widgetType: element.data?.["data-widget-type"] || "unknown",
              externalId: element.externalId || null,
              parentId: element.parentId || null,
              sectionIndex: sectionIndex + 1,
              sectionId: section.id || `section-${sectionIndex + 1}`,
            });
          }
        });
      }
    }
  });

  console.log(`\nTotal widgets extracted: ${allWidgetIds.length}`);
  return allWidgetIds;
}

// Function to get dynamic child groups from a section
function getDynamicChildGroups(sectionElements, parentGroupId) {
  const childGroups = [];

  if (!sectionElements || !parentGroupId) {
    return childGroups;
  }

  const parentGroup = sectionElements[parentGroupId];
  if (!parentGroup || !parentGroup.children) {
    return childGroups;
  }

  // Find all child groups
  parentGroup.children.forEach((childId) => {
    const childElement = sectionElements[childId];
    if (childElement && childElement.type === "group") {
      childGroups.push({
        id: childId,
        children: childElement.children || [],
        widgets: (childElement.children || []).filter((childOfChild) => {
          const element = sectionElements[childOfChild];
          return element && element.type === "widget_wrapper";
        }),
      });
    }
  });

  console.log(
    `Found ${childGroups.length} dynamic child groups for parent ${parentGroupId}`
  );
  childGroups.forEach((group, index) => {
    console.log(
      `  - Child Group ${index + 1}: ${group.id} (${
        group.widgets.length
      } widgets)`
    );
  });

  return childGroups;
}

// 1. ADD this function to map section template IDs to original IDs:
// Enhanced mapSectionTemplateToOriginalIds function to handle nested child groups
function mapSectionTemplateToOriginalIds(flexStructureSection, sectionDetails) {
  console.log("\n=== MAPPING SECTION TEMPLATE TO ORIGINAL IDS (ENHANCED) ===");
  console.log("Section Details:", sectionDetails);

  const idMapping = new Map();

  // Map basic section-level IDs
  if (sectionDetails.elementId) {
    idMapping.set("section.elementId", sectionDetails.elementId);
  }
  if (sectionDetails.sectionId) {
    idMapping.set("section.sectionId", sectionDetails.sectionId);
  }
  if (sectionDetails.gridId) {
    idMapping.set("section.gridId", sectionDetails.gridId);
  }
  if (sectionDetails.parentGroupId) {
    idMapping.set("section.parentGroupId", sectionDetails.parentGroupId);
  }

  // Enhanced mapping for nested child groups
  console.log("\n--- Processing Child Groups (Including Nested) ---");
  
  // First, handle direct child groups from sectionDetails.childGroups
  if (sectionDetails.childGroups) {
    Object.entries(sectionDetails.childGroups).forEach(([key, value]) => {
      const templateKey = `section.${key}`;
      idMapping.set(templateKey, value);
      console.log(`✓ Mapped direct child group: ${templateKey} -> ${value}`);
    });
  }

  // Handle legacy direct childGroup properties (fallback)
  Object.keys(sectionDetails).forEach((key) => {
    if (key.startsWith("childGroup") && key.endsWith("Id")) {
      const templateKey = `section.${key}`;
      if (!idMapping.has(templateKey)) {
        idMapping.set(templateKey, sectionDetails[key]);
        console.log(`✓ Mapped legacy child group: ${templateKey} -> ${sectionDetails[key]}`);
      }
    }
  });

  // NEW: Analyze the flex structure to identify nested relationships
  console.log("\n--- Analyzing Flex Structure for Nested Groups ---");
  
  if (flexStructureSection.elements) {
    // Find all template IDs that need mapping but don't have original IDs yet
    const unmappedTemplateIds = [];
    
    Object.keys(flexStructureSection.elements).forEach(elementId => {
      if (elementId.startsWith("section.") && !idMapping.has(elementId)) {
        unmappedTemplateIds.push(elementId);
      }
    });

    console.log(`Found ${unmappedTemplateIds.length} unmapped template IDs:`, unmappedTemplateIds);

    // Try to map nested child groups by analyzing the structure
    unmappedTemplateIds.forEach(templateId => {
      const element = flexStructureSection.elements[templateId];
      
      if (element && element.type === "group") {
        console.log(`\n--- Analyzing unmapped group: ${templateId} ---`);
        console.log(`  Parent: ${element.parentId}`);
        console.log(`  Children: ${element.children ? element.children.join(", ") : "none"}`);
        
        // Check if this is a nested child group by looking at its parent
        if (element.parentId && element.parentId.startsWith("section.childGroup")) {
          console.log(`  ✓ Detected as nested child group (parent: ${element.parentId})`);
          
          // Generate a mapping based on the pattern
          // Extract the number from the template ID if it follows a pattern
          const templateMatch = templateId.match(/section\.childGroup(\d+)Id/);
          if (templateMatch) {
            const groupNumber = templateMatch[1];
            // You can customize this logic based on your actual ID generation pattern
            const generatedId = `nested-group-${groupNumber}-${Date.now()}`;
            idMapping.set(templateId, generatedId);
            console.log(`  ✓ Generated mapping: ${templateId} -> ${generatedId}`);
          }
        }
      }
    });
  }

  // NEW: Validate that all section template IDs have mappings
  console.log("\n--- Validation: Checking All Template IDs Have Mappings ---");
  
  if (flexStructureSection.elements) {
    Object.keys(flexStructureSection.elements).forEach(elementId => {
      if (elementId.startsWith("section.")) {
        if (idMapping.has(elementId)) {
          console.log(`✓ ${elementId} -> ${idMapping.get(elementId)}`);
        } else {
          console.warn(`⚠️  ${elementId} -> NO MAPPING FOUND`);
          // Provide a fallback mapping to prevent errors
          const fallbackId = elementId.replace("section.", "fallback-");
          idMapping.set(elementId, fallbackId);
          console.log(`  ↳ Created fallback: ${elementId} -> ${fallbackId}`);
        }
      }
    });
  }

  console.log("\n--- Final ID Mapping Summary ---");
  console.log("Total mappings created:", idMapping.size);
  
  // Group mappings by type for better visualization
  const mappingsByType = {
    basic: [],
    childGroups: [],
    fallbacks: []
  };

  idMapping.forEach((value, key) => {
    if (key.includes("childGroup")) {
      mappingsByType.childGroups.push(`${key} -> ${value}`);
    } else if (value.startsWith("fallback-")) {
      mappingsByType.fallbacks.push(`${key} -> ${value}`);
    } else {
      mappingsByType.basic.push(`${key} -> ${value}`);
    }
  });

  console.log("Basic mappings:", mappingsByType.basic);
  console.log("Child group mappings:", mappingsByType.childGroups);
  if (mappingsByType.fallbacks.length > 0) {
    console.warn("Fallback mappings (may need attention):", mappingsByType.fallbacks);
  }

  return idMapping;
}


// Enhanced function to extract dynamic child groups (recursive)
function getDynamicChildGroupsRecursive(sectionElements, parentGroupId, level = 0) {
  const indent = "  ".repeat(level);
  console.log(`${indent}--- Processing child groups for: ${parentGroupId} (level ${level}) ---`);
  
  const childGroups = [];

  if (!sectionElements || !parentGroupId) {
    console.log(`${indent}No elements or parent group ID provided`);
    return childGroups;
  }

  const parentGroup = sectionElements[parentGroupId];
  if (!parentGroup || !parentGroup.children) {
    console.log(`${indent}No parent group found or no children`);
    return childGroups;
  }

  // Find all child groups
  parentGroup.children.forEach((childId) => {
    const childElement = sectionElements[childId];
    if (childElement && childElement.type === "group") {
      console.log(`${indent}Found child group: ${childId}`);
      
      const childGroupData = {
        id: childId,
        level: level + 1,
        children: childElement.children || [],
        widgets: (childElement.children || []).filter((childOfChild) => {
          const element = sectionElements[childOfChild];
          return element && element.type === "widget_wrapper";
        }),
        nestedGroups: [] // Will be populated recursively
      };

      // Recursively find nested child groups
      const nestedGroups = getDynamicChildGroupsRecursive(sectionElements, childId, level + 1);
      childGroupData.nestedGroups = nestedGroups;

      console.log(`${indent}  - Widgets in ${childId}: ${childGroupData.widgets.length}`);
      console.log(`${indent}  - Nested groups in ${childId}: ${nestedGroups.length}`);

      childGroups.push(childGroupData);
    }
  });

  console.log(`${indent}Total child groups at level ${level}: ${childGroups.length}`);
  return childGroups;
}

// 2. ADD this function to apply the ID mapping to flex structure:
function applyOriginalIdsToFlexStructure(flexStructureSection, idMapping) {
  console.log("\n=== APPLYING ORIGINAL IDS TO FLEX STRUCTURE ===");

  const updatedFlexStructure = JSON.parse(JSON.stringify(flexStructureSection));
  const newElements = {};

  // First pass: Create new elements with original IDs
  Object.entries(updatedFlexStructure.elements).forEach(
    ([templateId, element]) => {
      const originalId = idMapping.get(templateId) || templateId;

      // Update the element with original ID
      const updatedElement = { ...element, id: originalId };

      // Update parentId if it maps to an original ID
      if (updatedElement.parentId && idMapping.has(updatedElement.parentId)) {
        updatedElement.parentId = idMapping.get(updatedElement.parentId);
      }

      // Update children array with original IDs
      if (updatedElement.children) {
        updatedElement.children = updatedElement.children.map(
          (childId) => idMapping.get(childId) || childId
        );
      }

      newElements[originalId] = updatedElement;
      console.log(`Mapped ${templateId} -> ${originalId}`);
    }
  );

  // Update the root container ID
  updatedFlexStructure.id =
    idMapping.get(updatedFlexStructure.id) || updatedFlexStructure.id;
  updatedFlexStructure.rootContainerId =
    idMapping.get(updatedFlexStructure.rootContainerId) ||
    updatedFlexStructure.rootContainerId;
  updatedFlexStructure.elements = newElements;

  // Update styles to use original IDs
  if (updatedFlexStructure.styles && updatedFlexStructure.styles.breakpoints) {
    Object.keys(updatedFlexStructure.styles.breakpoints).forEach(
      (breakpoint) => {
        const breakpointRules =
          updatedFlexStructure.styles.breakpoints[breakpoint];
        if (breakpointRules.idToRules) {
          const newIdToRules = {};
          Object.entries(breakpointRules.idToRules).forEach(
            ([templateId, rules]) => {
              const originalId = idMapping.get(templateId) || templateId;
              newIdToRules[originalId] = rules;
            }
          );
          breakpointRules.idToRules = newIdToRules;
        }
      }
    );
  }

  console.log("Applied original IDs to flex structure");
  return updatedFlexStructure;
}

export async function executeBatchOperations(
  pageId,
  uuid,
  alias,
  extractedIds,
  htmlIds,
  flexWidgetIds,
  primaryBatchBody,
  enhancedWidgetMatching = null
) {
  console.log("\n===== STARTING ENHANCED BATCH OPERATIONS =====");
  console.log("Initial Parameters:");
  console.log("- Page ID:", pageId);
  console.log("- UUID:", uuid);
  console.log("- Alias:", alias);
  console.log("- Extracted IDs Count:", extractedIds.length);
  console.log("- HTML IDs Count:", htmlIds.length);
  console.log("- Flex Widget IDs Count:", flexWidgetIds.length);
  console.log("- Primary Batch Body Type:", typeof primaryBatchBody);
  console.log("- Enhanced Widget Matching provided:", !!enhancedWidgetMatching);

  // Store widget matching data if provided
  if (enhancedWidgetMatching) {
    console.log("Storing enhanced widget matching data...");
    storeWidgetMatchingData(enhancedWidgetMatching);

    // Log widget matching statistics
    const stats = getWidgetMatchingStats();
    console.log("Widget Matching Statistics:", stats);
  } else {
    console.warn("No enhanced widget matching data provided");
  }

  // Validate primaryBatchBody as flex structure sections
  if (
    !primaryBatchBody ||
    !Array.isArray(primaryBatchBody) ||
    primaryBatchBody.length === 0
  ) {
    throw new Error(
      "Primary batch body is required and must be a non-empty array of flex structure sections"
    );
  }

  // Extract widget IDs from flex structure sections
  const extractedWidgetIds =
    extractWidgetIdsFromFlexStructure(primaryBatchBody);
  console.log(
    `Total widgets extracted from all sections: ${extractedWidgetIds.length}`
  );

  // Print widget matching data for extracted widgets
  printExtractedWidgetMatchingData(extractedWidgetIds);

  const batchResults = [];

  // Process each section
  for (
    let i = 0;
    i < Math.min(extractedIds.length, primaryBatchBody.length);
    i++
  ) {
    const section = extractedIds[i];
    const htmlId = htmlIds[i];
    const flexWidgetId = flexWidgetIds[i];
    const flexStructureSection = primaryBatchBody[i];

    console.log(`\n===== PROCESSING SECTION ${i + 1} =====`);
    console.log("Section Details:", section);
    console.log("HTML ID:", htmlId);
    console.log("Flex Widget ID:", flexWidgetId);

    try {
      // Validate the flex structure section
      const validatedSection = FlexStructureSchema.parse(flexStructureSection);
      console.log(`✓ Flex structure section ${i + 1} validation passed`);

      // Get dynamic child groups for this section
      const childGroups = getDynamicChildGroups(
        validatedSection.elements,
        section.parentGroupId
      );

      // Extract widgets from this specific section
      const sectionWidgets = extractedWidgetIds.filter(
        (w) => w.sectionIndex === i + 1
      );

      console.log(
        `Section ${i + 1} contains ${sectionWidgets.length} widgets:`
      );

      // Debug: Log first few widgets in this section
      sectionWidgets.slice(0, 3).forEach((widget, idx) => {
        console.log(`  Widget ${idx + 1}: ${widget.id} (${widget.widgetType})`);
        const hasMatch = widgetMatchingData.widgetHtmlMap.has(widget.id);
        console.log(`    - Has HTML match: ${hasMatch}`);
        if (hasMatch) {
          const match = widgetMatchingData.widgetHtmlMap.get(widget.id);
          console.log(
            `    - Match type: ${match.matchType}, score: ${match.matchScore}`
          );
        }
      });
      if (sectionWidgets.length > 3) {
        console.log(`  ...and ${sectionWidgets.length - 3} more widgets`);
      }

      if (sectionWidgets.length === 0) {
        console.warn(`⚠️ No widgets found in section ${i + 1} - skipping`);
        batchResults.push({
          sectionIndex: i + 1,
          sectionId: section.sectionId,
          success: true, // Mark as success since no widgets to process isn't an error
          htmlIdUsed: htmlId,
          processedWidgets: 0,
          widgetsWithHtml: 0,
          childGroups: childGroups.length,
          note: "No widgets found in this section",
        });
        continue; // Skip to next section
      }

      const result = await executeSectionBatchOperations(
        pageId,
        uuid,
        alias,
        section,
        flexWidgetId,
        validatedSection,
        childGroups,
        sectionWidgets
      );

      batchResults.push({
        sectionIndex: i + 1,
        sectionId: section.sectionId,
        success: result.success,
        htmlIdUsed: htmlId,
        processedWidgets: sectionWidgets.length,
        widgetsWithHtml: sectionWidgets.filter((w) =>
          widgetMatchingData.widgetHtmlMap.has(w.id)
        ).length,
        childGroups: childGroups.length,
        insertedElements: result.insertedElements || [],
        batchResponses: result.batchResponses || [],
        error: result.error,
      });

      // Add delay between sections
      if (i < Math.min(extractedIds.length, primaryBatchBody.length) - 1) {
        console.log("\n--- Adding delay before next section ---");
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error(`Error processing section ${i + 1}:`, error);
      batchResults.push({
        sectionIndex: i + 1,
        sectionId: section.sectionId,
        success: false,
        error: error.message,
        htmlIdUsed: htmlId,
        processedWidgets: 0,
        widgetsWithHtml: 0,
        childGroups: 0,
      });
    }
  }

  console.log("\n===== ENHANCED BATCH OPERATIONS COMPLETE =====");
  console.log("Results Summary:");
  console.log("- Total Sections Processed:", batchResults.length);
  console.log(
    "- Successful Operations:",
    batchResults.filter((r) => r.success).length
  );
  console.log(
    "- Failed Operations:",
    batchResults.filter((r) => !r.success).length
  );
  console.log(
    "- Total Widgets Processed:",
    batchResults.reduce((sum, r) => sum + (r.processedWidgets || 0), 0)
  );
  console.log(
    "- Total Widgets with HTML:",
    batchResults.reduce((sum, r) => sum + (r.widgetsWithHtml || 0), 0)
  );

  return batchResults;
}

// Function to print widget matching data for extracted widgets
function printExtractedWidgetMatchingData(extractedWidgetIds) {
  console.log("\n===== EXTRACTED WIDGET MATCHING DATA =====");

  extractedWidgetIds.forEach((widget, index) => {
    console.log(`\n--- Extracted Widget ${index + 1} ---`);
    console.log(`Widget ID: ${widget.id}`);
    console.log(`Widget Type: ${widget.widgetType}`);
    console.log(`Section: ${widget.sectionIndex} (${widget.sectionId})`);
    console.log(`Parent ID: ${widget.parentId}`);

    // Check if we have matching data for this widget
    const matchingData = widgetMatchingData.widgetHtmlMap.get(widget.id);
    if (matchingData) {
      console.log(`✓ HTML Match Found:`);
      console.log(`  - Match Type: ${matchingData.matchType}`);
      console.log(`  - Match Score: ${matchingData.matchScore}`);
      console.log(
        `  - Text: ${
          matchingData.text
            ? matchingData.text.substring(0, 100) + "..."
            : "None"
        }`
      );
      console.log(
        `  - HTML Length: ${
          matchingData.html ? matchingData.html.length : 0
        } characters`
      );
    } else {
      console.log(`✗ No HTML Match Found`);
    }
  });
}

// Updated executeSectionBatchOperations function
async function executeSectionBatchOperations(
  pageId,
  uuid,
  alias,
  section,
  flexWidgetId,
  flexStructureSection,
  childGroups,
  sectionWidgets
) {
  console.log(`\n===== EXECUTING SECTION BATCH OPERATIONS =====`);
  console.log(`Section ID: ${section.sectionId}`);
  console.log(`Flex Widget ID: ${flexWidgetId}`);
  console.log(`Child Groups: ${childGroups.length}`);
  console.log(`Section Widgets: ${sectionWidgets.length}`);

  try {
    // **NEW: Map template IDs to original IDs**
    const idMapping = mapSectionTemplateToOriginalIds(
      flexStructureSection,
      section
    );
    const flexStructureWithOriginalIds = applyOriginalIdsToFlexStructure(
      flexStructureSection,
      idMapping
    );

    console.log("Using flex structure with original IDs");

    const processedWidgets = [];
    const batchResponses = [];
    const insertElementResponses = [];

    for (const widget of sectionWidgets) {
      console.log(`\n--- Processing Widget: ${widget.id} ---`);

      // Get HTML for this widget dynamically
      const widgetHtml = getHtmlForWidgetId(widget.id);

      if (widgetHtml && widgetHtml.html) {
        console.log(
          `  ✅ Found matching HTML (${widgetHtml.matchType}, score: ${widgetHtml.matchScore})`
        );
        console.log(
          `  📝 Text: ${
            widgetHtml.text ? widgetHtml.text.substring(0, 100) + "..." : "None"
          }`
        );
        console.log(`  🔗 HTML length: ${widgetHtml.html.length} chars`);
        console.log(
          `  🏷️  Attributes: ${Object.keys(widgetHtml.attributes || {}).join(
            ", "
          )}`
        );

        // **UPDATED: Make actual insert element API call**
        console.log(`  🚀 Making insert element API call...`);
        console.log(`  📍 Parent ID (flexWidgetId): ${flexWidgetId}`);
        console.log(`  📄 Markup: ${widgetHtml.html.substring(0, 200)}...`);

        const insertResult = await insertElementApi(
          pageId,
          flexWidgetId,
          widgetHtml.html
        );

        console.log(`  📥 Insert Element API Response:`);
        console.log(`    - Success: ${insertResult.success}`);
        console.log(
          `    - Status: ${insertResult.status} ${
            insertResult.statusText || ""
          }`
        );
        console.log(
          `    - Response: ${
            insertResult.response
              ? insertResult.response.substring(0, 200) + "..."
              : "None"
          }`
        );

        if (insertResult.parsedResponse) {
          console.log(
            `    - Parsed Response:`,
            JSON.stringify(insertResult.parsedResponse, null, 2)
          );
        }

        // **NEW: Extract and store dynamic ID**
        let divId = null;
        if (insertResult.success && insertResult.parsedResponse) {
          divId = extractAndStoreDynamicId(widget.id, insertResult);
        }

        insertElementResponses.push({
          widgetId: widget.id,
          flexWidgetId: flexWidgetId,
          insertResult: insertResult,
          htmlUsed: widgetHtml.html,
          matchType: widgetHtml.matchType,
          matchScore: widgetHtml.matchScore,
          extractedDivId: divId, // This will now be the actual extracted ID, not divId format
        });

        // Create API response object for compatibility
        const apiResponse = {
          success: insertResult.success,
          widgetId: widget.id,
          flexWidgetId: flexWidgetId,
          htmlUsed: widgetHtml.html.substring(0, 100) + "...",
          fullHtmlLength: widgetHtml.html.length,
          matchType: widgetHtml.matchType,
          matchScore: widgetHtml.matchScore,
          textContent: widgetHtml.text,
          attributes: widgetHtml.attributes,
          extractedDivId: divId, // This will now be the actual extracted ID
          insertElementResponse: {
            status: insertResult.status,
            success: insertResult.success,
            response: insertResult.response,
            parsedResponse: insertResult.parsedResponse,
          },
        };

        batchResponses.push(apiResponse);

        processedWidgets.push({
          widgetId: widget.id,
          widgetType: widget.widgetType,
          flexWidgetId: flexWidgetId,
          htmlData: widgetHtml.html,
          textData: widgetHtml.text,
          attributes: widgetHtml.attributes,
          matchType: widgetHtml.matchType,
          matchScore: widgetHtml.matchScore,
          processed: true,
          hasContent: true,
          insertElementSuccess: insertResult.success,
          insertElementStatus: insertResult.status,
          extractedDivId: divId, // **NEW: Include extracted div ID**
        });

        if (insertResult.success) {
          console.log(
            `  ✅ Widget ${widget.id} insert element API call successful`
          );
          if (divId) {
            console.log(`  🆔 Extracted and stored div ID: ${divId}`);
          }
        } else {
          console.log(
            `  ❌ Widget ${widget.id} insert element API call failed: ${
              insertResult.error || "Unknown error"
            }`
          );
        }

        // Add delay between insert element calls
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        console.log(`  ❌ No HTML match found for widget ${widget.id}`);
        console.log(
          `  🔍 Available widget IDs: ${getAvailableWidgetIds()
            .slice(0, 5)
            .join(", ")}${getAvailableWidgetIds().length > 5 ? "..." : ""}`
        );

        processedWidgets.push({
          widgetId: widget.id,
          widgetType: widget.widgetType,
          flexWidgetId: flexWidgetId,
          htmlData: null,
          textData: null,
          attributes: {},
          matchType: "none",
          matchScore: 0,
          processed: false,
          hasContent: false,
          insertElementSuccess: false,
          insertElementStatus: null,
          extractedDivId: null, // **NEW: No div ID for unmatched widgets**
        });
      }
    }

    // **UPDATED: Update flex structure with original IDs**
    const updatedExternalIds = new Map();
    insertElementResponses.forEach((response) => {
      if (response.extractedDivId) {
        updatedExternalIds.set(response.widgetId, response.extractedDivId);
      }
    });

    let flexStructureUpdateResult = null;
    if (updatedExternalIds.size > 0) {
      console.log(
        `\n🔄 Updating flex structure with ${updatedExternalIds.size} new external IDs...`
      );
      // Use the flex structure with original IDs
      flexStructureUpdateResult = await updateFlexStructureApi(
        pageId,
        uuid,
        flexStructureWithOriginalIds,
        updatedExternalIds
      );

      console.log(`Flex structure update result:`, {
        success: flexStructureUpdateResult.success,
        status: flexStructureUpdateResult.status,
      });
    }

    console.log("\n=== UPDATED FLEX STRUCTURE BODY WITH ORIGINAL IDS ===");
    const finalUpdatedFlexStructure = JSON.parse(
      JSON.stringify(flexStructureWithOriginalIds)
    );
    Object.entries(finalUpdatedFlexStructure.elements).forEach(
      ([elementId, element]) => {
        if (
          element.type === "widget_wrapper" &&
          updatedExternalIds.has(elementId)
        ) {
          element.externalId = updatedExternalIds.get(elementId);
        }
      }
    );
    console.log(JSON.stringify(finalUpdatedFlexStructure, null, 2));

    // **NEW: Count successful/failed inserts properly**
    const successfulInserts = insertElementResponses.filter(
      (r) => r.insertResult.success
    ).length;
    const failedInserts = insertElementResponses.filter(
      (r) => !r.insertResult.success
    ).length;

    console.log(`\n✅ Section processing completed:`);
    console.log(`  - Total widgets: ${sectionWidgets.length}`);
    console.log(
      `  - Widgets with HTML: ${
        processedWidgets.filter((w) => w.hasContent).length
      }`
    );
    console.log(
      `  - Successfully processed: ${
        processedWidgets.filter((w) => w.processed).length
      }`
    );
    console.log(`  - Insert element calls successful: ${successfulInserts}`);
    console.log(`  - Insert element calls failed: ${failedInserts}`);

    return {
      success: successfulInserts > 0,
      insertedElements: processedWidgets.filter((w) => w.processed),
      batchResponses: batchResponses,
      insertElementResponses: insertElementResponses,
      processedWidgets: processedWidgets.length,
      widgetsWithHtml: processedWidgets.filter((w) => w.hasContent).length,
      successfulInserts: successfulInserts,
      failedInserts: failedInserts,
      childGroups: childGroups.length,
      flexStructureUpdateResult: flexStructureUpdateResult,
      extractedDivIds: Array.from(updatedExternalIds.values()),
      updatedFlexStructure: finalUpdatedFlexStructure, // Now properly defined
      originalIdMapping: Object.fromEntries(idMapping),
      error: null,
    };
  } catch (error) {
    console.error("Section batch operations failed:", error);
    return {
      success: false,
      error: error.message,
      insertedElements: [],
      batchResponses: [],
      insertElementResponses: [],
      processedWidgets: 0,
      widgetsWithHtml: 0,
      successfulInserts: 0,
      failedInserts: 0,
      childGroups: 0,
      flexStructureUpdateResult: null,
      extractedDivIds: [],
      updatedFlexStructure: null,
    };
  }
}

// Function to extract and store dynamic IDs from insert element response
function extractAndStoreDynamicId(widgetId, insertElementResponse) {
  console.log(`\n=== EXTRACTING DYNAMIC ID FOR WIDGET: ${widgetId} ===`);

  if (!insertElementResponse.parsedResponse) {
    console.warn("No parsed response available for ID extraction");
    return null;
  }

  try {
    // Get the first (and typically only) response entry
    const responseEntries = Object.values(insertElementResponse.parsedResponse);
    if (responseEntries.length === 0) {
      console.warn("No response entries found");
      return null;
    }

    const element = responseEntries[0].element;
    if (!element) {
      console.warn("No element found in response");
      return null;
    }

    // UPDATED: Extract the first dynamic ID found in the element HTML
    // Look for id="numbers" pattern and extract the numeric ID
    const idMatches = element.match(/id="(\d+)"/g);
    if (!idMatches || idMatches.length === 0) {
      console.warn("No dynamic numeric ID found in element HTML");
      console.log("Element HTML snippet:", element.substring(0, 200));
      return null;
    }

    // Get the first numeric ID (usually the main element ID)
    const firstIdMatch = idMatches[0].match(/id="(\d+)"/);
    if (!firstIdMatch || !firstIdMatch[1]) {
      console.warn("Failed to extract numeric ID from match");
      return null;
    }

    const extractedId = firstIdMatch[1];

    console.log(`✅ Extracted dynamic ID:`);
    console.log(`  - Extracted ID: ${extractedId}`);
    console.log(`  - Widget ID: ${widgetId}`);
    console.log(`  - Total ID matches found: ${idMatches.length}`);

    // Log all found IDs for debugging
    idMatches.forEach((match, index) => {
      const idValue = match.match(/id="(\d+)"/)[1];
      console.log(`  - ID ${index + 1}: ${idValue}`);
    });

    // Store the numeric extracted ID
    dynamicIdStore.divIds.push({
      widgetId: widgetId,
      originalId: extractedId,
      extractedFromResponse: true,
      allIdsFound: idMatches.map((match) => match.match(/id="(\d+)"/)[1]),
    });

    // Store the mapping correctly
    dynamicIdStore.widgetIdToDivIdMap.set(widgetId, extractedId);
    dynamicIdStore.counter++;

    return extractedId; // Return the actual numeric extracted ID
  } catch (error) {
    console.error("Error extracting dynamic ID:", error);
    return null;
  }
}

// 4. UPDATE the updateFlexStructureApi function URL:
async function updateFlexStructureApi(
  pageId,
  uuid,
  flexStructureSection,
  updatedExternalIds
) {
  console.log("\n=== UPDATING FLEX STRUCTURE ===");
  console.log("Page ID:", pageId);
  console.log("UUID:", uuid);
  console.log("Flex structure section ID:", flexStructureSection.id);
  console.log("Root container ID:", flexStructureSection.rootContainerId);

  // Validate that we have actual IDs, not template IDs
  if (flexStructureSection.id.startsWith("section.")) {
    console.error("❌ ERROR: Still using template ID instead of original ID");
    console.error("Template ID found:", flexStructureSection.id);
    console.error(
      "This will cause a 400 error - aborting flex structure update"
    );
    return {
      success: false,
      error: "Template ID detected instead of original ID",
      status: 400,
    };
  }

  const batchReqId = Math.random().toString(36).substring(2, 8);
  const url = `https://my.duda.co/api/uis/batch?op=update%20flex%20structure&dm_device=desktop&currentEditorPageId=${pageId}`;

  // Clone the flex structure section
  const updatedFlexStructure = JSON.parse(JSON.stringify(flexStructureSection));

  // Update external IDs in the elements
  Object.entries(updatedFlexStructure.elements).forEach(
    ([elementId, element]) => {
      if (
        element.type === "widget_wrapper" &&
        updatedExternalIds.has(elementId)
      ) {
        const newExternalId = updatedExternalIds.get(elementId);
        console.log(
          `Updating widget ${elementId} externalId to: ${newExternalId}`
        );
        element.externalId = newExternalId;
      }
    }
  );

  const payload = [
    {
      type: "put",
      url: `/pages/${uuid}/flexStructure?dm_batchReqId=${batchReqId}`,
      data: updatedFlexStructure,
    },
  ];

  console.log("=== FLEX STRUCTURE UPDATE VALIDATION ===");
  console.log("Page ID:", pageId);
  console.log("UUID:", uuid);
  console.log("Section ID for API:", updatedFlexStructure.id);
  console.log("API URL:", payload[0].url);
  console.log("Updated external IDs:", Object.fromEntries(updatedExternalIds));

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        dm_loc: "/home/site/41e002a2/duda",
        dsid: "1048635",
        origin: "https://my.duda.co",
        priority: "u=1, i",
        referer: "https://my.duda.co/home/site/41e002a2/duda",
        "sec-ch-ua":
          '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "x-requested-with": "XMLHttpRequest",
        cookie: DUDA_API_CONFIG.cookies,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let parsedResponse = null;

    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.warn(
        "Failed to parse flex structure response as JSON:",
        parseError
      );
    }

    console.log(
      `Flex structure update response: ${response.status} ${response.statusText}`
    );
    if (!response.ok) {
      console.error("❌ Flex structure update failed:", responseText);
      console.error("Request payload was:", JSON.stringify(payload, null, 2));
    } else {
      console.log("✅ Flex structure update successful");
    }

    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      response: responseText,
      parsedResponse: parsedResponse,
      responseHeaders: Object.fromEntries(response.headers.entries()),
    };
  } catch (error) {
    console.error("Flex structure update API error:", error);
    return {
      success: false,
      error: error.message,
      response: null,
      parsedResponse: null,
    };
  }
}

// **NEW: Utility functions for dynamic ID management**
export function getDynamicIdMappings() {
  console.log("\n=== DYNAMIC ID MAPPINGS DEBUG ===");
  const mappings = Object.fromEntries(dynamicIdStore.widgetIdToDivIdMap);
  console.log("Widget ID to Extracted ID mappings:", mappings);

  dynamicIdStore.divIds.forEach((mapping, index) => {
    console.log(
      `${index + 1}. ${mapping.widgetId} -> ${
        dynamicIdStore.widgetIdToDivIdMap.get(mapping.widgetId) || "undefined"
      } (original: ${mapping.originalId})`
    );
  });

  return {
    extractedIds: dynamicIdStore.divIds,
    mappings: mappings,
    totalCount: dynamicIdStore.counter,
  };
}

export function clearDynamicIdStore() {
  dynamicIdStore = {
    divIds: [],
    widgetIdToDivIdMap: new Map(),
    counter: 0,
  };
}


// Enhanced section processing that handles nested groups
async function executeSectionBatchOperationsEnhanced(
  pageId,
  uuid,
  alias,
  section,
  flexWidgetId,
  flexStructureSection,
  childGroups,
  sectionWidgets
) {
  console.log(`\n===== EXECUTING ENHANCED SECTION BATCH OPERATIONS =====`);
  console.log(`Section ID: ${section.sectionId}`);
  console.log(`Flex Widget ID: ${flexWidgetId}`);
  console.log(`Child Groups: ${childGroups.length}`);
  console.log(`Section Widgets: ${sectionWidgets.length}`);

  try {
    // Enhanced ID mapping for nested structures
    console.log("\n--- Enhanced ID Mapping Process ---");
    const idMapping = mapSectionTemplateToOriginalIds(flexStructureSection, section);
    
    // Get recursive child groups
    const recursiveChildGroups = getDynamicChildGroupsRecursive(
      flexStructureSection.elements,
      section.parentGroupId
    );
    
    console.log("\n--- Recursive Child Groups Analysis ---");
    recursiveChildGroups.forEach((group, index) => {
      console.log(`Group ${index + 1}: ${group.id} (Level ${group.level})`);
      console.log(`  - Direct widgets: ${group.widgets.length}`);
      console.log(`  - Nested groups: ${group.nestedGroups.length}`);
      
      if (group.nestedGroups.length > 0) {
        group.nestedGroups.forEach((nestedGroup, nestedIndex) => {
          console.log(`    Nested ${nestedIndex + 1}: ${nestedGroup.id} (${nestedGroup.widgets.length} widgets)`);
        });
      }
    });

    const flexStructureWithOriginalIds = applyOriginalIdsToFlexStructure(
      flexStructureSection,
      idMapping
    );

    console.log("✓ Using flex structure with original IDs (including nested groups)");

    // Continue with the rest of the processing...
    const processedWidgets = [];
    const batchResponses = [];
    const insertElementResponses = [];

    for (const widget of sectionWidgets) {
      console.log(`\n--- Processing Widget: ${widget.id} ---`);

      // Get HTML for this widget dynamically
      const widgetHtml = getHtmlForWidgetId(widget.id);

      if (widgetHtml && widgetHtml.html) {
        console.log(`  ✅ Found matching HTML (${widgetHtml.matchType}, score: ${widgetHtml.matchScore})`);
        
        // Make insert element API call
        const insertResult = await insertElementApi(pageId, flexWidgetId, widgetHtml.html);

        // Extract and store dynamic ID
        let divId = null;
        if (insertResult.success && insertResult.parsedResponse) {
          divId = extractAndStoreDynamicId(widget.id, insertResult);
        }

        insertElementResponses.push({
          widgetId: widget.id,
          flexWidgetId: flexWidgetId,
          insertResult: insertResult,
          htmlUsed: widgetHtml.html,
          matchType: widgetHtml.matchType,
          matchScore: widgetHtml.matchScore,
          extractedDivId: divId,
        });

        processedWidgets.push({
          widgetId: widget.id,
          widgetType: widget.widgetType,
          flexWidgetId: flexWidgetId,
          htmlData: widgetHtml.html,
          textData: widgetHtml.text,
          attributes: widgetHtml.attributes,
          matchType: widgetHtml.matchType,
          matchScore: widgetHtml.matchScore,
          processed: true,
          hasContent: true,
          insertElementSuccess: insertResult.success,
          insertElementStatus: insertResult.status,
          extractedDivId: divId,
        });

        // Add delay between insert element calls
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        console.log(`  ❌ No HTML match found for widget ${widget.id}`);
        
        processedWidgets.push({
          widgetId: widget.id,
          widgetType: widget.widgetType,
          flexWidgetId: flexWidgetId,
          htmlData: null,
          textData: null,
          attributes: {},
          matchType: "none",
          matchScore: 0,
          processed: false,
          hasContent: false,
          insertElementSuccess: false,
          insertElementStatus: null,
          extractedDivId: null,
        });
      }
    }

    // Update flex structure with original IDs
    const updatedExternalIds = new Map();
    insertElementResponses.forEach((response) => {
      if (response.extractedDivId) {
        updatedExternalIds.set(response.widgetId, response.extractedDivId);
      }
    });

    let flexStructureUpdateResult = null;
    if (updatedExternalIds.size > 0) {
      console.log(`\n🔄 Updating flex structure with ${updatedExternalIds.size} new external IDs...`);
      flexStructureUpdateResult = await updateFlexStructureApi(
        pageId,
        uuid,
        flexStructureWithOriginalIds,
        updatedExternalIds
      );
    }

    // Create final updated flex structure
    const finalUpdatedFlexStructure = JSON.parse(JSON.stringify(flexStructureWithOriginalIds));
    Object.entries(finalUpdatedFlexStructure.elements).forEach(([elementId, element]) => {
      if (element.type === "widget_wrapper" && updatedExternalIds.has(elementId)) {
        element.externalId = updatedExternalIds.get(elementId);
      }
    });

    const successfulInserts = insertElementResponses.filter((r) => r.insertResult.success).length;
    const failedInserts = insertElementResponses.filter((r) => !r.insertResult.success).length;

    console.log(`\n✅ Enhanced section processing completed:`);
    console.log(`  - Total widgets: ${sectionWidgets.length}`);
    console.log(`  - Widgets with HTML: ${processedWidgets.filter((w) => w.hasContent).length}`);
    console.log(`  - Successfully processed: ${processedWidgets.filter((w) => w.processed).length}`);
    console.log(`  - Insert element calls successful: ${successfulInserts}`);
    console.log(`  - Insert element calls failed: ${failedInserts}`);
    console.log(`  - Recursive child groups found: ${recursiveChildGroups.length}`);

    return {
      success: successfulInserts > 0,
      insertedElements: processedWidgets.filter((w) => w.processed),
      batchResponses: batchResponses,
      insertElementResponses: insertElementResponses,
      processedWidgets: processedWidgets.length,
      widgetsWithHtml: processedWidgets.filter((w) => w.hasContent).length,
      successfulInserts: successfulInserts,
      failedInserts: failedInserts,
      childGroups: childGroups.length,
      recursiveChildGroups: recursiveChildGroups.length,
      flexStructureUpdateResult: flexStructureUpdateResult,
      extractedDivIds: Array.from(updatedExternalIds.values()),
      updatedFlexStructure: finalUpdatedFlexStructure,
      originalIdMapping: Object.fromEntries(idMapping),
      error: null,
    };
  } catch (error) {
    console.error("Enhanced section batch operations failed:", error);
    return {
      success: false,
      error: error.message,
      insertedElements: [],
      batchResponses: [],
      insertElementResponses: [],
      processedWidgets: 0,
      widgetsWithHtml: 0,
      successfulInserts: 0,
      failedInserts: 0,
      childGroups: 0,
      recursiveChildGroups: 0,
      flexStructureUpdateResult: null,
      extractedDivIds: [],
      updatedFlexStructure: null,
    };
  }
}
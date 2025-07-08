// Enhanced batchOperations.js with Zod validation and improved error handling
import { z } from "zod";
import { DUDA_API_CONFIG } from "../../../lib/dudaApi";
import { generateUniqueId, generateNumericId } from "./utils";
import * as cheerio from "cheerio";

// Zod schemas for validation
const ElementDataSchema = z.object({
  "data-layout-grid": z.string().optional(),
}).optional();

const ElementSchema = z.object({
  type: z.enum(["section", "grid", "group", "widget_wrapper"]),
  id: z.string(),
  parentId: z.union([z.string(), z.array(z.string())]).optional(),
  children: z.array(z.string()).optional(),
  name: z.string().optional(),
  data: ElementDataSchema,
  customClassName: z.string().optional(),
  externalId: z.string().optional(),
});

const StyleRuleSchema = z.object({
  "<id>": z.record(z.string(), z.string()),
});

const StylesSchema = z.object({
  breakpoints: z.object({
    mobile: z.object({
      idToRules: z.record(z.string(), StyleRuleSchema),
    }).optional(),
    common: z.object({
      idToRules: z.record(z.string(), StyleRuleSchema),
    }),
  }),
});

const FlexStructureSchema = z.object({
  id: z.string(),
  section: ElementSchema,
  rootContainerId: z.string(),
  elements: z.record(z.string(), ElementSchema),
  styles: StylesSchema,
});

const SectionIdsSchema = z.object({
  sectionId: z.string(),
  gridId: z.string(),
  parentGroupId: z.string(),
  childGroup1Id: z.string(),
  childGroup2Id: z.string(),
  elementId: z.string().optional(),
});

const BatchRequestSchema = z.object({
  type: z.enum(["post", "put", "get", "delete"]),
  url: z.string(),
  data: z.record(z.string(), z.any()),
});

export async function executeBatchOperations(
  pageId,
  uuid,
  alias,
  extractedIds,
  htmlIds,
  flexWidgetIds,
  batchRequestBody
) {
  console.log("\n===== STARTING ENHANCED BATCH OPERATIONS =====");
  console.log("Initial Parameters:");
  console.log("- Page ID:", pageId);
  console.log("- UUID:", uuid);
  console.log("- Alias:", alias);
  console.log("- Extracted IDs Count:", extractedIds.length);
  console.log("- HTML IDs Count:", htmlIds.length);
  console.log("- Flex Widget IDs Count:", flexWidgetIds.length);
  console.log("- Batch Request Body Type:", typeof batchRequestBody);

  // Validate input parameters
  try {
    z.array(BatchRequestSchema).parse(batchRequestBody);
    console.log("✓ Batch request body validation passed");
  } catch (error) {
    console.error("✗ Batch request body validation failed:", error.errors);
    throw new Error(`Invalid batch request body: ${error.message}`);
  }

  // Validate batchRequestBody
  if (
    !batchRequestBody ||
    !Array.isArray(batchRequestBody) ||
    batchRequestBody.length === 0
  ) {
    throw new Error(
      "Batch request body is required and must be a non-empty array"
    );
  }

  // Analyze the batch request body to understand the structure
  const batchAnalysis = analyzeBatchRequestBody(batchRequestBody);
  console.log("\n===== BATCH REQUEST ANALYSIS =====");
  console.log("Analysis:", JSON.stringify(batchAnalysis, null, 2));

  const batchResults = [];

  for (let i = 0; i < extractedIds.length; i++) {
    const section = extractedIds[i];
    const htmlId = htmlIds[i];
    const flexWidgetId = flexWidgetIds[i];

    console.log(`\n===== PROCESSING SECTION ${i + 1} =====`);
    console.log("Section Details:", section);
    console.log("HTML ID:", htmlId);
    console.log("Flex Widget ID:", flexWidgetId);

    // Validate section IDs
    try {
      SectionIdsSchema.parse(section);
      console.log("✓ Section IDs validation passed");
    } catch (error) {
      console.error("✗ Section IDs validation failed:", error.errors);
      batchResults.push({
        sectionIndex: i + 1,
        sectionId: section.sectionId,
        success: false,
        error: `Invalid section IDs: ${error.message}`,
        htmlIdUsed: htmlId,
      });
      continue;
    }

    if (!validateSectionIds(section, flexWidgetId)) {
      batchResults.push({
        sectionIndex: i + 1,
        sectionId: section.sectionId,
        success: false,
        error: "Missing required IDs",
        htmlIdUsed: htmlId,
      });
      continue;
    }

    try {
      const result = await executeDynamicBatchRequest(
        pageId,
        uuid,
        alias,
        section,
        flexWidgetId,
        batchRequestBody,
        batchAnalysis
      );

      batchResults.push({
        sectionIndex: i + 1,
        sectionId: section.sectionId,
        success: result.success,
        htmlIdUsed: htmlId,
        insertedElements: result.insertedElements || [],
        batchResponses: result.batchResponses || [],
        flexStructureUpdateResponse: result.flexStructureUpdateResponse,
        error: result.error,
      });

      // Add delay between sections
      if (i < extractedIds.length - 1) {
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

  return batchResults;
}

function analyzeBatchRequestBody(batchRequestBody) {
  const insertElementRequests = batchRequestBody.filter(
    (req) => req.url && req.url.includes("insertElement")
  );

  const flexStructureRequests = batchRequestBody.filter(
    (req) => req.url && req.url.includes("flexStructure")
  );

  const analysis = {
    totalRequests: batchRequestBody.length,
    insertElementCount: insertElementRequests.length,
    flexStructureCount: flexStructureRequests.length,
    insertElements: insertElementRequests.map((req, index) => ({
      index,
      markup: req.data?.markup || "",
      widgetType: extractWidgetTypeFromMarkup(req.data?.markup || ""),
      hasId: req.data?.markup?.includes("id=") || false,
    })),
    flexStructure:
      flexStructureRequests.length > 0
        ? analyzeFlexStructure(flexStructureRequests[0].data)
        : null,
  };

  return analysis;
}

function extractWidgetTypeFromMarkup(markup) {
  if (markup.includes('data-element-type="paragraph"')) return "paragraph";
  if (markup.includes('data-element-type="image"')) return "image";
  if (markup.includes('data-element-type="button"')) return "button";
  return "unknown";
}

function analyzeFlexStructure(flexData) {
  if (!flexData || !flexData.elements) return null;

  const widgets = Object.keys(flexData.elements).filter(
    (key) => flexData.elements[key].type === "widget_wrapper"
  );

  const groups = Object.keys(flexData.elements).filter(
    (key) => flexData.elements[key].type === "group"
  );

  return {
    widgetCount: widgets.length,
    groupCount: groups.length,
    widgetIds: widgets,
    groupIds: groups,
  };
}

function validateSectionIds(section, flexWidgetId) {
  const requiredIds = [
    "childGroup1Id",
    "sectionId",
    "gridId",
    "parentGroupId",
    "childGroup2Id",
  ];

  return requiredIds.every((id) => section[id]) && flexWidgetId;
}

async function executeDynamicBatchRequest(
  pageId,
  uuid,
  alias,
  section,
  flexWidgetId,
  batchRequestBody,
  batchAnalysis
) {
  console.log("\n===== EXECUTING DYNAMIC BATCH REQUEST =====");

  try {
    // Generate dynamic IDs for all widgets we need to insert
    const dynamicIds = generateDynamicIdsForBatch(batchAnalysis);
    console.log("Generated Dynamic IDs:", dynamicIds);

    // Step 1: Insert all elements
    const insertResults = await insertMultipleElements(
      pageId,
      alias,
      section,
      flexWidgetId,
      batchRequestBody,
      dynamicIds
    );

    if (!insertResults.success) {
      return {
        success: false,
        error: insertResults.error,
        insertedElements: [],
        batchResponses: [],
      };
    }

    // Step 2: Update flex structure with all inserted elements
    const flexUpdateResult = await updateFlexStructureWithMultipleElements(
      pageId,
      uuid,
      alias,
      section,
      flexWidgetId,
      batchRequestBody,
      dynamicIds,
      insertResults.insertedElements
    );

    return {
      success: true,
      insertedElements: insertResults.insertedElements,
      batchResponses: insertResults.batchResponses,
      flexStructureUpdateResponse: flexUpdateResult.response,
      error: null,
    };
  } catch (error) {
    console.error("Dynamic batch request failed:", error);
    return {
      success: false,
      error: error.message,
      insertedElements: [],
      batchResponses: [],
    };
  }
}

function generateDynamicIdsForBatch(batchAnalysis) {
  const dynamicIds = {
    widgets: [],
    divs: [],
    widgetIdMap: new Map(),
    divIdMap: new Map(),
  };

  // Generate IDs for each insert element request
  for (let i = 0; i < batchAnalysis.insertElementCount; i++) {
    const widgetId = `widget_${generateUniqueId().substring(0, 8)}`;
    const divId = generateNumericId();

    dynamicIds.widgets.push(widgetId);
    dynamicIds.divs.push(divId);
    dynamicIds.widgetIdMap.set(`widgetId${i + 1}`, widgetId);
    dynamicIds.divIdMap.set(`divId${i + 1}`, divId);
  }

  return dynamicIds;
}

async function insertMultipleElements(
  pageId,
  alias,
  section,
  flexWidgetId,
  batchRequestBody,
  dynamicIds
) {
  console.log("\n===== INSERTING MULTIPLE ELEMENTS =====");

  const insertElementRequests = batchRequestBody.filter(
    (req) => req.url && req.url.includes("insertElement")
  );

  const insertedElements = [];
  const batchResponses = [];

  for (let i = 0; i < insertElementRequests.length; i++) {
    const request = insertElementRequests[i];
    const widgetId = dynamicIds.widgets[i];
    const divId = dynamicIds.divs[i];

    console.log(`\n--- Inserting Element ${i + 1} ---`);
    console.log("Widget ID:", widgetId);
    console.log("Div ID:", divId);

    try {
      // Prepare the insert request
      const insertRequest = prepareInsertElementRequest(
        request,
        pageId,
        flexWidgetId,
        widgetId,
        divId
      );

      console.log("Insert Request:", JSON.stringify(insertRequest, null, 2));

      // Execute the insert request
      const response = await fetch(
        `${DUDA_API_CONFIG.baseUrl}/uis/batch?op=create%20widget%20in%20flex&dm_device=desktop&currentEditorPageId=${pageId}`,
        {
          method: "POST",
          headers: getBatchHeaders(alias),
          body: JSON.stringify([insertRequest]),
        }
      );

      const responseText = await response.text();
      console.log(`Insert Response ${i + 1}:`, responseText);

      if (!response.ok) {
        throw new Error(`Insert failed: ${response.status} ${responseText}`);
      }

      const jsonResponse = JSON.parse(responseText);
      batchResponses.push(jsonResponse);

      // Extract the inserted element ID
      const insertedElementId =
        extractInsertedElementIdFromResponse(jsonResponse);

      if (insertedElementId) {
        insertedElements.push({
          widgetId,
          divId,
          insertedElementId,
          index: i,
        });
        console.log(
          `Successfully inserted element ${i + 1}: ${insertedElementId}`
        );
      } else {
        console.error(`Failed to extract element ID for insert ${i + 1}`);
      }

      // Small delay between inserts
      if (i < insertElementRequests.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Error inserting element ${i + 1}:`, error);
      // Continue with other elements even if one fails
    }
  }

  return {
    success: insertedElements.length > 0,
    insertedElements,
    batchResponses,
    error:
      insertedElements.length === 0
        ? "No elements were successfully inserted"
        : null,
  };
}

function prepareInsertElementRequest(
  originalRequest,
  pageId,
  flexWidgetId,
  widgetId,
  divId
) {
  const request = {
    type: "post",
    url: `/pages/${pageId}/insertElement?dm_batchReqId=${Math.random()
      .toString(36)
      .substr(2, 6)}`,
    data: {
      markup: originalRequest.data.markup
        .replace(/widgetId\d+/g, widgetId)
        .replace(/divId\d+/g, divId),
      parent: flexWidgetId,
      before: originalRequest.data.before || null,
      defaultLocation: originalRequest.data.defaultLocation || false,
    },
  };

  return request;
}

async function updateFlexStructureWithMultipleElements(
  pageId,
  uuid,
  alias,
  section,
  flexWidgetId,
  batchRequestBody,
  dynamicIds,
  insertedElements
) {
  console.log("\n===== UPDATING FLEX STRUCTURE WITH MULTIPLE ELEMENTS =====");

  const flexStructureRequests = batchRequestBody.filter(
    (req) => req.url && req.url.includes("flexStructure")
  );

  if (flexStructureRequests.length === 0) {
    console.log("No flex structure requests found");
    return { success: true, response: null };
  }

  const flexRequest = flexStructureRequests[0];

  try {
    // Validate the original flex structure data
    console.log("Validating original flex structure data...");
    const validatedOriginalData = FlexStructureSchema.parse(flexRequest.data);
    console.log("✓ Original flex structure validation passed");

    // Prepare the flex structure data with all inserted elements
    const updatedFlexData = prepareEnhancedFlexStructureData(
      validatedOriginalData,
      section,
      flexWidgetId,
      dynamicIds,
      insertedElements
    );

    console.log("Validating updated flex structure data...");
    const validatedUpdatedData = FlexStructureSchema.parse(updatedFlexData);
    console.log("✓ Updated flex structure validation passed");

    console.log(
      "Final Flex Structure Data:",
      JSON.stringify(validatedUpdatedData, null, 2)
    );

    const flexUpdateRequest = {
      type: "put",
      url: `/pages/${uuid}/flexStructure?dm_batchReqId=${Math.random()
        .toString(36)
        .substr(2, 6)}`,
      data: validatedUpdatedData,
    };

    const response = await fetch(
      `${DUDA_API_CONFIG.baseUrl}/uis/batch?op=update%20flex%20structure&dm_device=desktop&currentEditorPageId=${pageId}`,
      {
        method: "POST",
        headers: getBatchHeaders(alias),
        body: JSON.stringify([flexUpdateRequest]),
      }
    );

    const responseText = await response.text();
    console.log("Flex Structure Update Response:", responseText);

    if (!response.ok) {
      // Try to parse the error response for more details
      let errorDetails = responseText;
      try {
        const errorJson = JSON.parse(responseText);
        errorDetails = errorJson.message || errorJson.error_code || responseText;
      } catch (e) {
        // Response is not JSON, use as-is
      }
      
      throw new Error(
        `Flex structure update failed: ${response.status} - ${errorDetails}`
      );
    }

    return {
      success: true,
      response: JSON.parse(responseText),
    };
  } catch (error) {
    console.error("Error updating flex structure:", error);
    
    // If it's a Zod validation error, provide more detailed information
    if (error.name === 'ZodError') {
      console.error("Zod validation errors:", error.errors);
      return {
        success: false,
        error: `Validation failed: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
        response: null,
      };
    }
    
    return {
      success: false,
      error: error.message,
      response: null,
    };
  }
}

function prepareEnhancedFlexStructureData(
  originalData,
  section,
  flexWidgetId,
  dynamicIds,
  insertedElements
) {
  console.log("\n===== PREPARING ENHANCED FLEX STRUCTURE DATA =====");

  // Deep clone the original data to avoid mutations
  const flexData = JSON.parse(JSON.stringify(originalData));

  // Helper function to safely replace IDs in strings
  const replaceIds = (obj) => {
    if (typeof obj === "string") {
      let result = obj;
      
      // Replace section-related IDs
      if (flexWidgetId && obj.includes("flexWidgetId")) {
        result = result.replace(/flexWidgetId/g, flexWidgetId);
      }
      
      // Replace section IDs with proper null checks
      const sectionReplacements = {
        'section.elementId': section.elementId || section.sectionId,
        'section.sectionId': section.sectionId,
        'section.gridId': section.gridId,
        'section.parentGroupId': section.parentGroupId,
        'section.childGroup1Id': section.childGroup1Id,
        'section.childGroup2Id': section.childGroup2Id,
      };
      
      for (const [placeholder, replacement] of Object.entries(sectionReplacements)) {
        if (replacement && result.includes(placeholder)) {
          result = result.replace(new RegExp(placeholder, 'g'), replacement);
        }
      }

      // Replace dynamic widget and div IDs
      dynamicIds.widgetIdMap.forEach((realId, placeholder) => {
        if (result.includes(placeholder)) {
          result = result.replace(new RegExp(placeholder, 'g'), realId);
        }
      });

      dynamicIds.divIdMap.forEach((realId, placeholder) => {
        if (result.includes(placeholder)) {
          result = result.replace(new RegExp(placeholder, 'g'), realId);
        }
      });

      return result;
    }

    if (Array.isArray(obj)) {
      return obj.map(replaceIds);
    }

    if (obj && typeof obj === "object") {
      const newObj = {};
      for (const [key, value] of Object.entries(obj)) {
        const newKey = replaceIds(key);
        newObj[newKey] = replaceIds(value);
      }
      return newObj;
    }

    return obj;
  };

  const processedData = replaceIds(flexData);

  // Update externalIds for inserted elements
  if (processedData.elements && insertedElements.length > 0) {
    insertedElements.forEach((element) => {
      if (processedData.elements[element.widgetId] && element.insertedElementId) {
        processedData.elements[element.widgetId].externalId = element.insertedElementId;
        console.log(
          `Updated widget ${element.widgetId} with externalId: ${element.insertedElementId}`
        );
      }
    });
  }

  // Ensure all required fields are present and valid
  if (!processedData.id) {
    processedData.id = section.sectionId || generateUniqueId();
  }

  if (!processedData.rootContainerId) {
    processedData.rootContainerId = section.sectionId;
  }

  // Validate parent-child relationships
  if (processedData.elements) {
    Object.keys(processedData.elements).forEach(elementId => {
      const element = processedData.elements[elementId];
      
      // Ensure parentId is properly formatted
      if (element.parentId && Array.isArray(element.parentId) && element.parentId.length === 1) {
        element.parentId = element.parentId[0];
      }
      
      // Ensure children array exists
      if (!element.children) {
        element.children = [];
      }
      
      // Ensure data object exists
      if (!element.data) {
        element.data = {};
      }
      
      // Ensure customClassName exists
      if (element.customClassName === undefined) {
        element.customClassName = "";
      }
      
      // Ensure name exists
      if (element.name === undefined) {
        element.name = "";
      }
    });
  }

  return processedData;
}

// Keep the existing helper functions
function extractInsertedElementIdFromResponse(responseData) {
  if (!responseData) {
    console.log("No response data provided");
    return null;
  }

  try {
    console.log("Extracting element ID from response...");

    let elementHtml = null;

    // Handle different response structures
    if (typeof responseData === "object" && !Array.isArray(responseData)) {
      const insertElementKey = Object.keys(responseData).find((key) =>
        key.includes("insertElement")
      );

      if (insertElementKey) {
        const insertData = responseData[insertElementKey];
        if (insertData && insertData.element) {
          elementHtml = insertData.element;
        }
      }
    }

    if (Array.isArray(responseData)) {
      const insertResponse = responseData.find(
        (item) => item.url && item.url.includes("insertElement")
      );

      if (
        insertResponse &&
        insertResponse.data &&
        insertResponse.data.element
      ) {
        elementHtml = insertResponse.data.element;
      }
    }

    if (!elementHtml) {
      if (responseData.element) {
        elementHtml = responseData.element;
      } else if (responseData.data && responseData.data.element) {
        elementHtml = responseData.data.element;
      }
    }

    if (!elementHtml) {
      console.log("No element HTML found in response");
      return null;
    }

    console.log("Element HTML to parse:", elementHtml);

    // Parse the HTML to extract the ID
    const $ = cheerio.load(elementHtml);
    let elementId = null;

    const selectors = [
      "div[id]",
      "[id]",
      "div.dmNewParagraph[id]",
      "div[duda_id]",
      "[data-element-id]",
    ];

    for (const selector of selectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        const firstElement = elements.first();
        elementId =
          firstElement.attr("id") ||
          firstElement.attr("duda_id") ||
          firstElement.attr("data-element-id");

        if (elementId) {
          console.log(
            `Found element ID using selector "${selector}":`,
            elementId
          );
          break;
        }
      }
    }

    if (!elementId) {
      $("*").each((i, element) => {
        const $el = $(element);
        const id = $el.attr("id");
        if (id && id.length > 0) {
          elementId = id;
          console.log("Found ID from general search:", elementId);
          return false;
        }
      });
    }

    if (elementId) {
      console.log("Successfully extracted element ID:", elementId);
      return elementId;
    } else {
      console.log("No element ID found in HTML");
      return null;
    }
  } catch (error) {
    console.error("Error extracting inserted element ID from response:", error);
    return null;
  }
}

function getBatchHeaders(alias) {
  return {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    dm_loc: "/home/site/41e002a2/duda1",
    dsid: "1048635",
    origin: "https://my.duda.co",
    priority: "u=1, i",
    referer: "https://my.duda.co/home/site/41e002a2/duda1",
    "sec-ch-ua":
      '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Linux"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
    "x-requested-with": "XMLHttpRequest",
    cookie:
      "_fbp=fb.1.1748410352276.947939578829518178; hubspotutk=c5a494184d4e2afcd3e531233734eb58; _dm_ga_clientId=b2dba1c7-396b-458f-8a0f-deb72154dbcb; language=en; landingPage=/signup; accountId=794969; accountUuid=41ea951a2a304fa38d59162280dae36b; productUuid=52a9926b5dc94de688c1571d574ff75a; IR_PI=07615b33-3bb7-11f0-9b80-bd4b936f5cf7%7C1748431762162; account_uuid=41ea951a2a304fa38d59162280dae36b; dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; _gd_visitor=48c47a36-fbad-4877-8795-865d3648ff99; _gd_svisitor=95d70b17b5203c002668f367c2010000883e0100; __zlcmid=1RsneD9izLkntAc; __adroll_fpc=c54f649a952dbe827da56df24d8c71a5-1748431859407; _dm_remember_me=VlRyWmdyZHdiJTJCYldvY2l6cUlxc3FnJTNEJTNEOkVkUWZRdnppYlpSJTJGYUlRRU9TcWtadyUzRCUzRA; first_conversion_medium_touchpoints=null%3B%20null%3B%20null%3B%20null; first_conversion_campaign_touchpoints=null%3B%20null%3B%20null%3B%20null; first_conversion_term_touchpoints=null%3B%20null%3B%20null%3B%20null; first_conversion_content_touchpoints=null%3B%20null%3B%20null%3B%20null; first_conversion_source_touchpoints=direct%3B%20direct%3B%20direct%3B%20di; _conv_r=s%3Awww.google.com*m%3Aorganic*t%3Aundefined*c%3A; _ce.s=v~0ea57fc055a4db8b04677f8e3c2cb6b7d4a6dd82~lcw~1750918172964~vir~returning~lva~1750910321509~vpv~11~v11.cs~268877~v11.s~2ae70e00-3b85-11f0-a3bc-2353b47aaaf5~v11.vs~0ea57fc055a4db8b04677f8e3c2cb6b7d4a6dd82~v11ls~2ae70e00-3b85-11f0-a3bc-2353b47aaaf5~v11.ss~1748431762239~v11nv~0~v11.fsvd~e30%3D~gtrk.la~mcczh0ro~lcw~1750918172966; _gid=GA1.2.1174334737.1751249076; _conv_v=vi%3A1*sc%3A20*cs%3A1751249889*fs%3A1748410335*pv%3A41*exp%3A%7B%7D*seg%3A%7B%7D*ps%3A1750910306; __ar_v4=%7CNK6BCP2ZPJC2BEAS7JMXC2%3A20250630%3A1%7C5PYFNWAESVGU5BU47WLRIT%3A20250630%3A1%7CLVLOIN3JF5FT3CD5CBETI7%3A20250630%3A1; AWSALBTG=J2ANDLfHbomZfBh/cOyP/2sWBreUUb/9OdUHL1Fg8Elq1ygpKbBsmhKuOgq/0OUNUCEddS+Mpw0sM+OrUaGAsowO9OMm2c5/eq8nu+GTm8Z1pEVh0jEqAGvK6uaEiCycBahikDU0n8ZzlQ0mwGXAWog2b8EzXGmPIXlrWY2zPmBCWAzJbio=; __hssrc=1; IR_gbd=duda.co; _gd_session=8d785529-1da4-4feb-8b3a-84950c04bade; __hstc=244318362.c5a494184d4e2afcd3e531233734eb58.1748410360364.1751595905225.1751600406940.114; _dm_se_token_me=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50VXVpZCI6IjQxZWE5NTFhMmEzMDRmYTM4ZDU5MTYyMjgwZGFlMzZiIiwiYWNjb3VudE5hbWUiOiJtaXNoYW1Ad2lnb2guYWkiLCJjcmVhdGlvblRpbWUiOjE3NTE2MDA1MzA1NTYsImV4cCI6MTc1MTYwMjkzMH0.-W3zGhHgFkrXCUK2k0k_dYTUzjis0mtAtmdXuakbft8; _dm_account=%7B%22name%22%3A%22misham%40wigoh.ai%22%2C%22uuid%22%3A%2241ea951a2a304fa38d59162280dae36b%22%2C%22gaType%22%3A%22SMB%22%2C%22lastLogin%22%3A1751600401000%7D; JSESSIONID=6AC2008D9CBA8407F5D04D03B03F960E; _gcl_au=1.1.523935755.1748410344; _ga=GA1.1.b2dba1c7-396b-458f-8a0f-deb72154dbcb; __hssc=244318362.3.1751600406940; IR_13628=1751600655667%7C0%7C1751600655667%7C%7C; _uetsid=98e372b0555611f0869ebdffd727728c; _uetvid=24df0c103b8511f0b71eb52d29352553; _ga_GFZCS4CS4Q=GS2.1.s1751595905$o21$g1$t1751600667$j41$l0$h0; AWSALB=gSL0NEyXPmhwQP96X0TtskgT9Fh0WaUEmBs0IP/mk/Vva10AjxtzUda+pp9ppFf0y7M95l7IfaxeN7p6MhKLL5YQBFRQ6g7LHlYP3Xa1J2YmYZ99xmqAQ93zRmG+RfddRvHQwaH6Vkvk1ofcvEKTgc38Z3n5nuPhyybNZb+y/xU+oVR3mCdlX7nroozN6A==",
    ...(alias && { "X-Site-Alias": alias }),
  };
}

// Export the enhanced functions
export {
  analyzeBatchRequestBody,
  generateDynamicIdsForBatch,
  prepareEnhancedFlexStructureData,
};

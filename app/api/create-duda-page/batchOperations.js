// Fixed batchOperations.js with proper error handling and response processing
// Updated batchOperations.js with enhanced ID extraction and flex structure updating
import { DUDA_API_CONFIG } from "../../../lib/dudaApi";
import { generateUniqueId, withRetry, generateNumericId } from "./utils";
import * as cheerio from 'cheerio';

export async function executeBatchOperations(
  pageId,
  uuid,
  alias,
  extractedIds,
  htmlIds,
  flexWidgetIds,
  batchRequestBody
) {
  console.log("\n===== STARTING BATCH OPERATIONS =====");
  console.log("Initial Parameters:");
  console.log("- Page ID:", pageId);
  console.log("- UUID:", uuid);
  console.log("- Alias:", alias);
  console.log("- Extracted IDs Count:", extractedIds.length);
  console.log("- HTML IDs Count:", htmlIds.length);
  console.log("- Flex Widget IDs Count:", flexWidgetIds.length);
  console.log("- Batch Request Body Type:", typeof batchRequestBody);

  // Print the complete batch request body
  console.log("\n===== BATCH REQUEST BODY =====");
  console.log(JSON.stringify(batchRequestBody, null, 2));
  console.log("=============================");

  // Validate batchRequestBody
  if (!batchRequestBody) {
    throw new Error("Batch request body is required but was not provided");
  }

  if (!Array.isArray(batchRequestBody)) {
    throw new Error("Batch request body must be an array");
  }

  if (batchRequestBody.length === 0) {
    throw new Error("Batch request body cannot be empty");
  }

  const batchResults = [];

  for (let i = 0; i < extractedIds.length; i++) {
    const section = extractedIds[i];
    const htmlId = htmlIds[i];
    const flexWidgetId = flexWidgetIds[i];

    console.log(`\n===== PROCESSING SECTION ${i + 1} =====`);
    console.log("Section Details:");
    console.log("- Section ID:", section.sectionId);
    console.log("- Grid ID:", section.gridId);
    console.log("- Parent Group ID:", section.parentGroupId);
    console.log("- Child Group 1 ID:", section.childGroup1Id);
    console.log("- Child Group 2 ID:", section.childGroup2Id);
    console.log("- HTML ID:", htmlId);
    console.log("- Flex Widget ID:", flexWidgetId);

    if (
      !section.childGroup1Id ||
      !section.sectionId ||
      !section.gridId ||
      !section.parentGroupId ||
      !section.childGroup2Id ||
      !flexWidgetId
    ) {
      const missingIds = {
        childGroup1Id: !section.childGroup1Id,
        sectionId: !section.sectionId,
        gridId: !section.gridId,
        parentGroupId: !section.parentGroupId,
        childGroup2Id: !section.childGroup2Id,
        flexWidgetId: !flexWidgetId,
      };

      console.error("Missing required IDs:", missingIds);

      batchResults.push({
        sectionIndex: i + 1,
        sectionId: section.sectionId,
        success: false,
        error: "Missing required IDs",
        htmlIdUsed: htmlId,
        missingIds,
      });
      continue;
    }

    try {
      console.log("\n--- Executing Batch API Request ---");
      const result = await executeBatchRequest(
        pageId,
        uuid,
        alias,
        section,
        flexWidgetId,
        batchRequestBody
      );

      if (!result.success) {
        console.error("Batch operation failed:", result.error);
        batchResults.push({
          sectionIndex: i + 1,
          sectionId: section.sectionId,
          success: false,
          error: result.error,
          htmlIdUsed: htmlId,
        });
        continue;
      }

      console.log("\n--- Batch Operation Successful ---");
      console.log("Widget ID:", result.widgetId);
      console.log("Inserted Element ID:", result.insertedElementId);

      batchResults.push({
        sectionIndex: i + 1,
        sectionId: section.sectionId,
        success: true,
        htmlIdUsed: htmlId,
        insertedElementIds: { [result.widgetId]: result.insertedElementId },
        batchResults: result.batchResponse,
        error: null,
      });

      // Add delay between sections if needed
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
        errorDetails: {
          stack: error.stack,
          name: error.name,
        },
      });
    }
  }

  console.log("\n===== BATCH OPERATIONS COMPLETE =====");
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

async function executeBatchRequest(
  pageId,
  uuid,
  alias,
  section,
  flexWidgetId,
  batchRequestBody
) {
  try {
    console.log("\n===== EXECUTING SINGLE ATTEMPT BATCH REQUEST =====");
    
    // Prepare batch data (same as before)
    const widgetId = [`widget_${generateUniqueId().substring(0, 8)}`];
    const divId = [generateNumericId()];
    
    const batchData = prepareBatchRequestData(
      batchRequestBody,
      pageId,
      uuid,
      section,
      flexWidgetId,
      widgetId,
      divId
    );

    console.log("\nSending batch request...");
    const response = await fetch(
      `${DUDA_API_CONFIG.baseUrl}/uis/batch?op=create%20widget%20in%20flex&dm_device=desktop&currentEditorPageId=${pageId}`,
      {
        method: "POST",
        headers: getBatchHeaders(alias),
        body: JSON.stringify(batchData),
      }
    );

    console.log("Response status:", response.status);
    
    // Process response
    const responseText = await response.text();
    console.log("\n===== RAW RESPONSE =====");
    console.log(responseText);
    
    if (!response.ok) {
      console.error("Batch request failed:", response.status, response.statusText);
      throw new Error(`Batch request failed: ${response.status} ${response.statusText}`);
    }

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseText);
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      throw new Error("Invalid JSON response from server");
    }

    console.log("\n===== PARSED RESPONSE =====");
    console.log(JSON.stringify(jsonResponse, null, 2));

    // Extract inserted element ID from the response
    const insertedElementId = extractInsertedElementIdFromResponse(jsonResponse);

    if (!insertedElementId) {
      console.error("Could not extract inserted element ID from response");
      console.error("Full response structure:", JSON.stringify(jsonResponse, null, 2));
      throw new Error("Could not extract inserted element ID from response");
    }

    console.log("\n===== FINAL RESULT =====");
    console.log("Successfully inserted element with ID:", insertedElementId);
    console.log("Widget ID used:", widgetId[0]);

    return {
      success: true,
      widgetId: widgetId[0],
      insertedElementId,
      batchResponse: jsonResponse,
    };
  } catch (error) {
    console.error("\nBatch request failed:", error);
    return {
      success: false,
      error: error.message,
      errorStack: error.stack,
    };
  }
}

function extractInsertedElementIdFromResponse(responseData) {
  if (!responseData) {
    console.log("No response data provided");
    return null;
  }

  try {
    console.log("Extracting element ID from response...");
    console.log("Response type:", typeof responseData);
    console.log("Response keys:", Object.keys(responseData));

    // Handle different response structures
    let elementHtml = null;
    
    // Check if response is an object with URL keys (like your example)
    if (typeof responseData === 'object' && !Array.isArray(responseData)) {
      // Look for insertElement response
      const insertElementKey = Object.keys(responseData).find(key => 
        key.includes('insertElement')
      );
      
      if (insertElementKey) {
        console.log("Found insertElement response key:", insertElementKey);
        const insertData = responseData[insertElementKey];
        
        if (insertData && insertData.element) {
          elementHtml = insertData.element;
          console.log("Found element HTML in insertElement response");
        }
      }
    }
    
    // If it's an array, look for the insertElement response
    if (Array.isArray(responseData)) {
      const insertResponse = responseData.find(item => 
        item.url && item.url.includes('insertElement')
      );
      
      if (insertResponse && insertResponse.data && insertResponse.data.element) {
        elementHtml = insertResponse.data.element;
        console.log("Found element HTML in array response");
      }
    }

    // Try direct access for other structures
    if (!elementHtml) {
      if (responseData.element) {
        elementHtml = responseData.element;
        console.log("Found element HTML in direct response");
      } else if (responseData.data && responseData.data.element) {
        elementHtml = responseData.data.element;
        console.log("Found element HTML in data.element");
      }
    }

    if (!elementHtml) {
      console.log("No element HTML found in response");
      return null;
    }

    console.log("Element HTML to parse:", elementHtml);

    // Parse the HTML to extract the ID
    const $ = cheerio.load(elementHtml);
    
    // Look for any element with an ID that looks like what we need
    let elementId = null;
    
    // Try different selectors
    const selectors = [
      'div[id]',  // Any div with an ID
      '[id]',     // Any element with an ID
      'div.dmNewParagraph[id]',  // Specific class with ID
      'div[duda_id]',  // duda_id attribute
      '[data-element-id]'  // data-element-id attribute
    ];

    for (const selector of selectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        const firstElement = elements.first();
        elementId = firstElement.attr('id') || 
                   firstElement.attr('duda_id') || 
                   firstElement.attr('data-element-id');
        
        if (elementId) {
          console.log(`Found element ID using selector "${selector}":`, elementId);
          break;
        }
      }
    }

    // If we still don't have an ID, try to extract from any attribute
    if (!elementId) {
      $('*').each((i, element) => {
        const $el = $(element);
        const id = $el.attr('id');
        if (id && id.length > 0) {
          elementId = id;
          console.log("Found ID from general search:", elementId);
          return false; // break the loop
        }
      });
    }

    if (elementId) {
      console.log("Successfully extracted element ID:", elementId);
      return elementId;
    } else {
      console.log("No element ID found in HTML");
      console.log("HTML structure:", elementHtml);
      return null;
    }

  } catch (error) {
    console.error("Error extracting inserted element ID from response:", error);
    console.error("Response data:", responseData);
    return null;
  }
}

function updateFlexStructureWithElementId(batchData, widgetId, insertedElementId) {
  console.log("\n===== UPDATING FLEX STRUCTURE =====");
  console.log("Widget ID:", widgetId);
  console.log("Inserted Element ID:", insertedElementId);

  try {
    return batchData.map((request) => {
      if (request.url.includes("flexStructure")) {
        console.log("Processing flexStructure request...");
        const flexData = JSON.parse(JSON.stringify(request.data));

        // If the flex data is a string, parse it first
        let flexDataObj = typeof flexData === 'string' ? JSON.parse(flexData) : flexData;
        
        // Find the widget in the structure and update its externalId
        if (flexDataObj.widgets && flexDataObj.widgets[widgetId]) {
          flexDataObj.widgets[widgetId].externalId = insertedElementId;
        } else if (flexDataObj[widgetId]) {
          flexDataObj[widgetId].externalId = insertedElementId;
        }

        // Convert back to string if it was originally a string
        const updatedData = typeof flexData === 'string' 
          ? JSON.stringify(flexDataObj)
          : flexDataObj;

        console.log("Updated flex structure:");
        console.log(JSON.stringify(updatedData, null, 2));

        return {
          ...request,
          data: updatedData,
        };
      }
      return request;
    });
  } catch (error) {
    console.error("Error updating flex structure with element ID:", error);
    return batchData;
  }
}

export async function testBatchRequest(pageId, uuid, alias, batchRequestBody) {
  console.log("\n===== TESTING BATCH REQUEST =====");

  try {
    const response = await fetch(
      `${DUDA_API_CONFIG.baseUrl}/uis/batch?op=create%20widget%20in%20flex&dm_device=desktop&currentEditorPageId=${pageId}`,
      {
        method: "POST",
        headers: getBatchHeaders(alias),
        body: JSON.stringify(batchRequestBody),
      }
    );

    console.log("Raw Response:", response);
    console.log("Response Status:", response.status);
    console.log("Response OK:", response.ok);
    console.log(
      "Response Headers:",
      Object.fromEntries(response.headers.entries())
    );

    const responseText = await response.text();
    console.log("\n===== RESPONSE BODY =====");
    console.log(responseText);
    console.log("========================");

    if (!response.ok) {
      console.error("Error Response Text:", responseText);
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }

    const jsonResponse = JSON.parse(responseText);
    console.log("JSON Response:", JSON.stringify(jsonResponse, null, 2));

    return {
      success: true,
      response: jsonResponse,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    };
  } catch (error) {
    console.error("Test Batch Request Error:", error);
    return {
      success: false,
      error: error.message,
      stack: error.stack,
    };
  }
}

function prepareBatchRequestData(
  batchRequestBody,
  pageId,
  uuid,
  section,
  flexWidgetId,
  widgetId,
  divId
) {
  try {
    const preparedBatch = batchRequestBody.map((request, index) => {
      const preparedRequest = { ...request };

      if (request.url.includes("insertElement")) {
        preparedRequest.url = `/pages/${pageId}/insertElement?dm_batchReqId=${Math.random()
          .toString(36)
          .substr(2, 6)}`;

        const currentWidgetId = widgetId[index] || widgetId[0];
        const currentDivId = divId[index] || divId[0];

        let processedMarkup = request.data.markup
          .replace(/widgetId\d+/g, currentWidgetId)
          .replace(/divId\d+/g, currentDivId);

        preparedRequest.data = {
          ...request.data,
          markup: processedMarkup,
          parent: flexWidgetId,
          before: request.data.before || null,
          defaultLocation: request.data.defaultLocation || false,
        };
      } else if (request.url.includes("flexStructure")) {
        preparedRequest.url = `/pages/${uuid}/flexStructure?dm_batchReqId=${Math.random()
          .toString(36)
          .substr(2, 6)}`;

        preparedRequest.data = prepareFlexStructureData(
          request.data,
          section,
          flexWidgetId,
          widgetId,
          divId
        );
      }

      return preparedRequest;
    });

    return preparedBatch;
  } catch (error) {
    console.error("Error preparing batch request data:", error);
    throw error;
  }
}

function getBatchHeaders(alias) {
  return {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    baggage:
      "sentry-environment=direct,sentry-release=production_5597,sentry-public_key=0d2f170da99ddd8d3befc10a7f4ddd29,sentry-trace_id=5e3b70ae9493483691dca5d1897fca5a,sentry-sampled=true,sentry-sample_rand=0.02876794153772788,sentry-sample_rate=0.1",
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
    "sentry-trace": "5e3b70ae9493483691dca5d1897fca5a-86434ec1efb872a1-1",
    "user-agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
    "x-requested-with": "XMLHttpRequest",
    cookie:
      "_fbp=fb.1.1748410352276.947939578829518178; hubspotutk=c5a494184d4e2afcd3e531233734eb58; _dm_ga_clientId=b2dba1c7-396b-458f-8a0f-deb72154dbcb; language=en; landingPage=/signup; accountId=794969; accountUuid=41ea951a2a304fa38d59162280dae36b; productUuid=52a9926b5dc94de688c1571d574ff75a; IR_PI=07615b33-3bb7-11f0-9b80-bd4b936f5cf7%7C1748431762162; account_uuid=41ea951a2a304fa38d59162280dae36b; dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; _gd_visitor=48c47a36-fbad-4877-8795-865d3648ff99; _gd_svisitor=95d70b17b5203c002668f367c2010000883e0100; __zlcmid=1RsneD9izLkntAc; __adroll_fpc=c54f649a952dbe827da56df24d8c71a5-1748431859407; _dm_remember_me=VlRyWmdyZHdiJTJCYldvY2l6cUlxc3FnJTNEJTNEOkVkUWZRdnppYlpSJTJGYUlRRU9TcWtadyUzRCUzRA; first_conversion_medium_touchpoints=null%3B%20null%3B%20null%3B%20null; first_conversion_campaign_touchpoints=null%3B%20null%3B%20null%3B%20null; first_conversion_term_touchpoints=null%3B%20null%3B%20null%3B%20null; first_conversion_content_touchpoints=null%3B%20null%3B%20null%3B%20null; first_conversion_source_touchpoints=direct%3B%20direct%3B%20direct%3B%20di; _conv_r=s%3Awww.google.com*m%3Aorganic*t%3Aundefined*c%3A; _ce.s=v~0ea57fc055a4db8b04677f8e3c2cb6b7d4a6dd82~lcw~1750918172964~vir~returning~lva~1750910321509~vpv~11~v11.cs~268877~v11.s~2ae70e00-3b85-11f0-a3bc-2353b47aaaf5~v11.vs~0ea57fc055a4db8b04677f8e3c2cb6b7d4a6dd82~v11ls~2ae70e00-3b85-11f0-a3bc-2353b47aaaf5~v11.ss~1748431762239~v11nv~0~v11.fsvd~e30%3D~gtrk.la~mcczh0ro~lcw~1750918172966; _gid=GA1.2.1174334737.1751249076; _conv_v=vi%3A1*sc%3A20*cs%3A1751249889*fs%3A1748410335*pv%3A41*exp%3A%7B%7D*seg%3A%7B%7D*ps%3A1750910306; __ar_v4=%7CNK6BCP2ZPJC2BEAS7JMXC2%3A20250630%3A1%7C5PYFNWAESVGU5BU47WLRIT%3A20250630%3A1%7CLVLOIN3JF5FT3CD5CBETI7%3A20250630%3A1; AWSALBTG=J2ANDLfHbomZfBh/cOyP/2sWBreUUb/9OdUHL1Fg8Elq1ygpKbBsmhKuOgq/0OUNUCEddS+Mpw0sM+OrUaGAsowO9OMm2c5/eq8nu+GTm8Z1pEVh0jEqAGvK6uaEiCycBahikDU0n8ZzlQ0mwGXAWog2b8EzXGmPIXlrWY2zPmBCWAzJbio=; __hssrc=1; IR_gbd=duda.co; _gd_session=8d785529-1da4-4feb-8b3a-84950c04bade; __hstc=244318362.c5a494184d4e2afcd3e531233734eb58.1748410360364.1751595905225.1751600406940.114; _dm_se_token_me=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50VXVpZCI6IjQxZWE5NTFhMmEzMDRmYTM4ZDU5MTYyMjgwZGFlMzZiIiwiYWNjb3VudE5hbWUiOiJtaXNoYW1Ad2lnb2guYWkiLCJjcmVhdGlvblRpbWUiOjE3NTE2MDA1MzA1NTYsImV4cCI6MTc1MTYwMjkzMH0.-W3zGhHgFkrXCUK2k0k_dYTUzjis0mtAtmdXuakbft8; _dm_account=%7B%22name%22%3A%22misham%40wigoh.ai%22%2C%22uuid%22%3A%2241ea951a2a304fa38d59162280dae36b%22%2C%22gaType%22%3A%22SMB%22%2C%22lastLogin%22%3A1751600401000%7D; JSESSIONID=6AC2008D9CBA8407F5D04D03B03F960E; _gcl_au=1.1.523935755.1748410344; _ga=GA1.1.b2dba1c7-396b-458f-8a0f-deb72154dbcb; __hssc=244318362.3.1751600406940; IR_13628=1751600655667%7C0%7C1751600655667%7C%7C; _uetsid=98e372b0555611f0869ebdffd727728c; _uetvid=24df0c103b8511f0b71eb52d29352553; _ga_GFZCS4CS4Q=GS2.1.s1751595905$o21$g1$t1751600667$j41$l0$h0; AWSALB=gSL0NEyXPmhwQP96X0TtskgT9Fh0WaUEmBs0IP/mk/Vva10AjxtzUda+pp9ppFf0y7M95l7IfaxeN7p6MhKLL5YQBFRQ6g7LHlYP3Xa1J2YmYZ99xmqAQ93zRmG+RfddRvHQwaH6Vkvk1ofcvEKTgc38Z3n5nuPhyybNZb+y/xU+oVR3mCdlX7nroozN6A==",
    ...(alias && { "X-Site-Alias": alias }),
  };
}

function prepareFlexStructureData(
  originalData,
  section,
  flexWidgetId,
  widgetId,
  divId
) {
  try {
    const flexData = JSON.parse(JSON.stringify(originalData));

    const replaceIds = (obj) => {
      if (typeof obj === "string") {
        let result = obj
          .replace(/flexWidgetId/g, flexWidgetId)
          .replace(
            /section\.elementId/g,
            section.elementId || "section.elementId"
          )
          .replace(
            /section\.sectionId/g,
            section.sectionId || "section.sectionId"
          )
          .replace(/section\.gridId/g, section.gridId || "section.gridId")
          .replace(
            /section\.parentGroupId/g,
            section.parentGroupId || "section.parentGroupId"
          )
          .replace(
            /section\.childGroup1Id/g,
            section.childGroup1Id || "section.childGroup1Id"
          )
          .replace(
            /section\.childGroup2Id/g,
            section.childGroup2Id || "section.childGroup2Id"
          );

        widgetId.forEach((id, index) => {
          result = result.replace(new RegExp(`widgetId${index + 1}`, "g"), id);
        });

        divId.forEach((id, index) => {
          result = result.replace(new RegExp(`divId${index + 1}`, "g"), id);
        });

        return result;
      }

      if (Array.isArray(obj)) {
        return obj.map(replaceIds);
      }

      if (obj && typeof obj === "object") {
        const newObj = {};
        for (const [key, value] of Object.entries(obj)) {
          newObj[replaceIds(key)] = replaceIds(value);
        }
        return newObj;
      }

      return obj;
    };

    const processedData = replaceIds(flexData);

    return processedData;
  } catch (error) {
    console.error("Error preparing flex structure data:", error);
    throw error;
  }
}
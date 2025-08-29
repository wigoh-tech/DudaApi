/**
 * Triggers the Duda insert API multiple times based on section count
 * @param {Array} jsonInput - The JSON array from input box
 * @param {string} uuid - Unique identifier for the request
 * @param {string} alias - Page alias for HTML parsing
 * @returns {Promise<Array>} Array of API responses
 */
export async function triggerInsertApiForSections(jsonInput, uuid, alias) {
  if (!jsonInput || !Array.isArray(jsonInput)) {
    throw new Error("Invalid JSON input - must be an array");
  }

  if (!alias) {
    throw new Error("Alias is required for HTML parsing");
  }

  const sectionCount = jsonInput.length;
  console.log(`Total sections in input: ${sectionCount}`);

  // Calculate how many times to trigger the API (2 sections per call)
  const triggerCount = sectionCount - 2;
  console.log(`API will be triggered ${triggerCount} times`);

  const responses = [];
  let lastInsertedHtmlId = "1641784833"; // Default initial insertAfterId

  for (let i = 0; i < triggerCount; i++) {
    // Calculate indices before try-catch so they're available in error handling
    const startIndex = i * 2;
    const endIndex = Math.min(startIndex + 2, sectionCount);
    const sectionRange = `${startIndex + 1}-${endIndex}`;

    console.log(`\n=== Triggering API call ${i + 1} of ${triggerCount} ===`);
    console.log(`Processing sections ${sectionRange}`);
    console.log(`Using insertAfterId: ${lastInsertedHtmlId}`);

    try {
      const sectionsForThisBatch = jsonInput.slice(startIndex, endIndex);

      // Trigger the insert API with the current insertAfterId
      const response = await callInsertApi(
        uuid,
        sectionsForThisBatch,
        i + 1,
        lastInsertedHtmlId
      );

      // NEW: Print the detailed response
      console.log(`\n🔍 INSERT API RESPONSE FOR BATCH ${i + 1}:`);
      console.log("==========================================");
      console.log("Response Status: SUCCESS");
      console.log("Response Data:", JSON.stringify(response, null, 2));
      console.log("==========================================");

      // Extract HTML ID directly from the API response
      let extractedHtmlId = null;
      let extractionError = null;

      try {
        extractedHtmlId = extractHtmlIdFromResponse(response);
        console.log(`✅ Extracted HTML ID from response: ${extractedHtmlId}`);
      } catch (error) {
        extractionError = error.message;
        console.log(
          `⚠️ Could not extract HTML ID from response: ${extractionError}`
        );
      }

      responses.push({
        batchNumber: i + 1,
        sectionsProcessed: sectionsForThisBatch.length,
        sectionRange: sectionRange,
        response: response,
        success: true,
        insertAfterId: lastInsertedHtmlId,
        extractedHtmlId: extractedHtmlId,
        extractionError: extractionError,
      });

      console.log(`Batch ${i + 1} completed successfully`);

      // Update insertAfterId for next iteration (but not for the last batch)
      if (i < triggerCount - 1) {
        if (extractedHtmlId && extractedHtmlId !== lastInsertedHtmlId) {
          lastInsertedHtmlId = extractedHtmlId;
          console.log(`✅ Updated insertAfterId to: ${lastInsertedHtmlId}`);
        } else {
          console.log(`⚠️ Using previous insertAfterId: ${lastInsertedHtmlId}`);
        }

        // Add delay between API calls to avoid rate limiting
        console.log("Waiting 2 seconds before next API call...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`Error in batch ${i + 1}:`, error);

      // NEW: Print detailed error response
      console.log(`\n❌ INSERT API ERROR FOR BATCH ${i + 1}:`);
      console.log("==========================================");
      console.log("Response Status: ERROR");
      console.log("Error Message:", error.message);
      console.log("Error Stack:", error.stack);
      console.log("==========================================");

      responses.push({
        batchNumber: i + 1,
        sectionsProcessed: 0,
        sectionRange: sectionRange,
        response: null,
        success: false,
        error: error.message,
        insertAfterId: lastInsertedHtmlId,
      });
    }
  }

  // NEW: Print overall summary of all responses
  console.log("\n📊 INSERT API OVERALL SUMMARY:");
  console.log("=====================================");
  console.log(`Total batches processed: ${responses.length}`);
  console.log(
    `Successful batches: ${responses.filter((r) => r.success).length}`
  );
  console.log(`Failed batches: ${responses.filter((r) => !r.success).length}`);
  console.log("Detailed responses by batch:");
  responses.forEach((response, index) => {
    console.log(`\n  Batch ${response.batchNumber}:`);
    console.log(`    Status: ${response.success ? "SUCCESS" : "FAILED"}`);
    console.log(`    Sections Range: ${response.sectionRange}`);
    console.log(`    Sections Processed: ${response.sectionsProcessed}`);
    console.log(`    InsertAfterId Used: ${response.insertAfterId}`);
    if (response.extractedHtmlId) {
      console.log(`    Extracted HTML ID: ${response.extractedHtmlId}`);
    }
    if (response.extractionError) {
      console.log(`    Extraction Error: ${response.extractionError}`);
    }
    if (response.success && response.response) {
      console.log(
        `    Response Keys: ${Object.keys(response.response).join(", ")}`
      );
    }
    if (!response.success && response.error) {
      console.log(`    Error: ${response.error}`);
    }
  });
  console.log("=====================================");

  return responses;
}

/**
 * Extracts HTML ID directly from the API response
 * @param {Object} response - The API response object
 * @returns {string} The extracted HTML ID
 * @throws {Error} If HTML ID cannot be extracted
 */
function extractHtmlIdFromResponse(response) {
  if (!response || !response.markupString) {
    throw new Error("No markupString found in response");
  }

  // Extract HTML ID from the markupString using regex
  // Looking for id="[ID]" in the markup
  const idMatch = response.markupString.match(/id="(\d+)"/);

  if (!idMatch || !idMatch[1]) {
    throw new Error("Could not find HTML ID in markupString");
  }

  const htmlId = idMatch[1];
  console.log(`🎯 Found HTML ID in markupString: ${htmlId}`);

  return htmlId;
}

/**
 * Makes the actual API call to Duda insert endpoint
 * @param {string} uuid - Page UUID
 * @param {Array} sections - Sections to process in this batch
 * @param {number} batchNumber - Current batch number
 * @param {string} insertAfterId - ID to insert after
 * @returns {Promise<Object>} API response
 */
async function callInsertApi(uuid, sections, batchNumber, insertAfterId) {
  const apiUrl = `https://my.duda.co/api/uis/pages/${uuid}/flex/insert`;

  const requestBody = {
    parentId: "1716942098",
    insertAfterId: insertAfterId,
  };

  // NEW: Print request details
  console.log(`\n📤 INSERT API REQUEST FOR BATCH ${batchNumber}:`);
  console.log("===========================================");
  console.log(`API URL: ${apiUrl}`);
  console.log(`Request Body:`, JSON.stringify(requestBody, null, 2));
  console.log(`Sections in this batch: ${sections.length}`);
  console.log("===========================================");

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        baggage:
          "sentry-environment=direct,sentry-release=production_5747,sentry-public_key=0d2f170da99ddd8d3befc10a7f4ddd29,sentry-trace_id=67679bdf1fc84759b30dc27b9861d99c,sentry-sampled=true,sentry-sample_rand=0.055016467983737494,sentry-sample_rate=0.1",
        "content-type": "application/json",
        dm_loc: "/home/site/41e002a2/empty9ddba5eb",
        origin: "https://my.duda.co",
        priority: "u=1, i",
        referer: "https://my.duda.co/home/site/41e002a2/empty9ddba5eb",
        "sec-ch-ua":
          '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sentry-trace": "67679bdf1fc84759b30dc27b9861d99c-a524fd17b9b92576-1",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "x-requested-with": "XMLHttpRequest",
        cookie:
          "_gd_visitor=40d0bd8f-b2b9-4fcf-86ea-2accc484ed78; language=en; landingPage=/login; _fbp=fb.1.1752547231596.871167907101487908; hubspotutk=9af6036ce59b5aa15aa544ef46b86533; account_uuid=41ea951a2a304fa38d59162280dae36b; dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; __zlcmid=1RsneD9izLkntAc; __adroll_fpc=089d3b7c8c30a01d5551acf4c8db604c-1752719288427; __ar_v4=LVLOIN3JF5FT3CD5CBETI7%3A20250818%3A2%7C5PYFNWAESVGU5BU47WLRIT%3A20250818%3A2%7CNK6BCP2ZPJC2BEAS7JMXC2%3A20250818%3A2; dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; _dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; first_conversion_medium_touchpoints=null%3B%20referral%3B%20referral; first_conversion_campaign_touchpoints=null%3B%20null%3B%20null; first_conversion_term_touchpoints=null%3B%20null%3B%20null; first_conversion_content_touchpoints=null%3B%20null%3B%20null; _ga_9WXYK3PMB6=GS2.1.s1756184680$o1$g0$t1756184685$j55$l0$h0; _gid=GA1.2.2014990144.1756348807; deviceView=desktop; first_conversion_source_touchpoints=direct%3B%20127.0.0.1%3B%20claude.; isFirstSessionVisit=false; _ce.clock_data=46%2C49.37.222.205%2C1%2C6ffa570f521e87e65c529e15a5aaac67%2CChrome%2CIN; _conv_r=s%3Awww.duda.co*m%3Areferral*t%3A*c%3A; AWSALBTG=mAtHfz1Cusj69pVksV0ZTF1HvVSCXXh/3oChElck8HbhP0BYH4W+T06g/0lWmmVjEvIfHrtLCZ1yHkczviacOkbeenG0MMWTK+SDwfkQIqEOzqupWYPMgSvi2M6UsBf8NxlREcXESvPMEv3h0WEVSUlTu9BYdd0CpYdcOEdyiOuYeK35wQ8=; IR_gbd=duda.co; cebs=1; __hssrc=1; _dm_remember_me=ZnRRSnlvbm9XTk8lMkJGMVR2Wm96OFRRJTNEJTNEOlpOdG5VRE1QZlJkT0NQbGZKYXNJTEElM0QlM0Q; cebsp_=2; _ce.s=v~8371c5812a5a58ab73d92049be54c44bf1c24111~lcw~1756440461032~vir~returning~lva~1756435097572~vpv~6~v11ls~b4f8e130-848d-11f0-8c80-0b4bbae31c1d~gtrk.la~mewbauxy~v11.cs~268877~v11.s~b4f8e130-848d-11f0-8c80-0b4bbae31c1d~v11.vs~8371c5812a5a58ab73d92049be54c44bf1c24111~v11.fsvd~eyJ1cmwiOiJkdWRhLmNvL2xvZ2luL2xvZ2dlZCIsInJlZiI6Imh0dHBzOi8vd3d3LmR1ZGEuY28vIiwidXRtIjpbXX0%3D~v11.sla~1756440461000~lcw~1756440462887; _dm_account=%7B%22name%22%3A%22misham%40wigoh.ai%22%2C%22uuid%22%3A%2241ea951a2a304fa38d59162280dae36b%22%2C%22gaType%22%3A%22SMB%22%2C%22lastLogin%22%3A1756440458000%7D; __hstc=244318362.9af6036ce59b5aa15aa544ef46b86533.1752547233092.1756435098965.1756440471744.170; _gd_session=615ed2da-cdd1-4933-827a-f8066047f221; _dm_se_token_me=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50VXVpZCI6IjQxZWE5NTFhMmEzMDRmYTM4ZDU5MTYyMjgwZGFlMzZiIiwiYWNjb3VudE5hbWUiOiJtaXNoYW1Ad2lnb2guYWkiLCJjcmVhdGlvblRpbWUiOjE3NTY0NDA3OTgwNzcsImV4cCI6MTc1NjQ0MzE5OH0.py97R4Lb4kes-4at2BpkaQtlP_s3bIZn_jLLLRy6Cig; _gat=1; JSESSIONID=483E8F4603E375B5DBACF036A6DD1A0D; _gcl_au=1.1.186818603.1752547231; _ga=GA1.1.8f2b7305-5489-4c7b-bf48-3973cccbac43; IR_13628=1756440883041%7C0%7C1756440883041%7C%7C; _conv_v=vi%3A1*sc%3A212*cs%3A1756440460*fs%3A1752547229*pv%3A617*exp%3A%7B100254142.%7Bv.1002832145-g.%7B%7D%7D%7D*seg%3A%7B%7D*ps%3A1756389073; _conv_s=si%3A212*sh%3A1756440459913-0.9807646044810155*pv%3A3; __hssc=244318362.2.1756440471744; _uetsid=55d25e5083b811f0bd6e570fa1003a5d; _uetvid=24df0c103b8511f0b71eb52d29352553; AWSALB=QFK4m1jU78wM9VIoZZJHsjL5uqm3vmmK1sWJMcHNJMeRJY38PlahLyDbtHNYZWAP+UZt4AAxn0kuIxugX5Z4hIGoUYKhuweKIdEObOBUZLryHqQC4z8TLYiSAKml; _ga_GFZCS4CS4Q=GS2.1.s1756435095$o36$g1$t1756440912$j22$l0$h0",
      },
      body: JSON.stringify(requestBody),
    });

    // NEW: Print response status and headers
    console.log(`\n📥 INSERT API RESPONSE STATUS FOR BATCH ${batchNumber}:`);
    console.log("============================================");
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Content-Type: ${response.headers.get("content-type")}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
    console.log("============================================");

    // Check content type before parsing
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      let errorData = {};

      try {
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
        } else {
          // If it's HTML or other content, get it as text
          const errorText = await response.text();
          console.log(`\n❌ NON-JSON ERROR RESPONSE FOR BATCH ${batchNumber}:`);
          console.log("===============================================");
          console.log(`Status: ${response.status}`);
          console.log(`Status Text: ${response.statusText}`);
          console.log(`Content Type: ${contentType}`);
          console.log(
            `Error Content (first 500 chars):`,
            errorText.substring(0, 500)
          );
          console.log("===============================================");

          // Check if it's a login page redirect
          if (errorText.includes("<!DOCTYPE") || errorText.includes("<html")) {
            throw new Error(
              `API returned HTML instead of JSON. This usually means authentication failed or session expired. Status: ${response.status}`
            );
          }

          errorData = {
            message: `Non-JSON response: ${errorText.substring(0, 200)}`,
          };
        }
      } catch (parseError) {
        console.error(
          `Error parsing error response for batch ${batchNumber}:`,
          parseError
        );
        errorData = {
          message: `Failed to parse error response: ${parseError.message}`,
        };
      }

      throw new Error(
        `API call failed with status ${response.status}: ${
          errorData.message || response.statusText
        }`
      );
    }

    // Check if response is JSON before parsing
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await response.text();
      console.log(`\n⚠️ NON-JSON SUCCESS RESPONSE FOR BATCH ${batchNumber}:`);
      console.log("==================================================");
      console.log(`Content Type: ${contentType}`);
      console.log(
        `Response Content (first 500 chars):`,
        responseText.substring(0, 500)
      );
      console.log("==================================================");

      // Check if it's HTML (likely a login page)
      if (
        responseText.includes("<!DOCTYPE") ||
        responseText.includes("<html")
      ) {
        throw new Error(
          "API returned HTML instead of JSON. This usually means authentication failed or session expired."
        );
      }

      throw new Error(`Expected JSON response but got: ${contentType}`);
    }

    const data = await response.json();

    // NEW: Print successful response data
    console.log(`\n✅ INSERT API SUCCESS RESPONSE FOR BATCH ${batchNumber}:`);
    console.log("=================================================");
    console.log("Response Data:", JSON.stringify(data, null, 2));
    console.log("=================================================");

    if (!data) {
      throw new Error("Empty response from API");
    }

    return data;
  } catch (error) {
    console.error(`API call failed for batch ${batchNumber}:`, error);
    throw error; // Re-throw to be caught by the outer handler
  }
}

/**
 * Helper function to get sections from JSON input
 * @param {Array} jsonInput - The JSON array
 * @returns {Array} Extracted sections
 */
export function extractSections(jsonInput) {
  if (!jsonInput || !Array.isArray(jsonInput)) {
    return [];
  }

  return jsonInput.map((section, index) => {
    if (!section || typeof section !== "object") {
      throw new Error(`Invalid section at index ${index}`);
    }
    return {
      index: index + 1,
      id: section.id || `section-${index + 1}`,
      data: section,
    };
  });
}

/**
 * Integration function to be called from your existing route
 * @param {Object} request - The request object containing JSON input
 * @param {string} uuid - Unique identifier for the request
 * @param {string} alias - Page alias for HTML parsing
 * @returns {Promise<Object>} Combined response with all API results
 */
export async function handleDynamicInsertApi(request, uuid, alias) {
  try {
    const { primaryBatchBody } = request;

    if (!primaryBatchBody || !Array.isArray(primaryBatchBody)) {
      return {
        success: false,
        error: "Primary batch body is required and must be an array",
        totalSections: 0,
        totalApicalls: 0,
        responses: [],
      };
    }

    if (!alias) {
      return {
        success: false,
        error: "Alias is required for HTML parsing",
        totalSections: 0,
        totalApicalls: 0,
        responses: [],
      };
    }

    console.log("=== DYNAMIC INSERT API HANDLER ===");
    console.log(`Processing ${primaryBatchBody.length} sections`);
    console.log(`Using alias: ${alias} for HTML ID extraction`);

    const sections = extractSections(primaryBatchBody);
    const apiResponses = await triggerInsertApiForSections(
      sections,
      uuid,
      alias
    );

    // Check if any API calls were actually made
    if (apiResponses.length === 0) {
      return {
        success: false,
        error: "No API calls were triggered - check section count and logic",
        totalSections: sections.length,
        totalApicalls: 0,
        responses: [],
      };
    }

    // Enhanced summary with HTML ID extraction info
    const extractionSummary = {
      totalExtractionAttempts: apiResponses.filter(
        (r) => r.extractedHtmlId || r.extractionError
      ).length,
      successfulExtractions: apiResponses.filter((r) => r.extractedHtmlId)
        .length,
      failedExtractions: apiResponses.filter((r) => r.extractionError).length,
      extractedIds: apiResponses
        .filter((r) => r.extractedHtmlId)
        .map((r) => r.extractedHtmlId),
    };

    // NEW: Print the final handler response
    console.log("\n🎯 DYNAMIC INSERT API HANDLER FINAL RESPONSE:");
    console.log("================================================");
    console.log(
      "Handler Response:",
      JSON.stringify(
        {
          success: apiResponses.some((r) => r.success),
          totalSections: sections.length,
          totalApicalls: apiResponses.length,
          responses: apiResponses,
          extractionSummary: extractionSummary,
          summary: {
            successfulCalls: apiResponses.filter((r) => r.success).length,
            failedCalls: apiResponses.filter((r) => !r.success).length,
            totalSectionsProcessed: apiResponses.reduce(
              (sum, r) => sum + r.sectionsProcessed,
              0
            ),
          },
        },
        null,
        2
      )
    );
    console.log("================================================");

    return {
      success: apiResponses.some((r) => r.success),
      totalSections: sections.length,
      totalApicalls: apiResponses.length,
      responses: apiResponses,
      extractionSummary: extractionSummary,
      summary: {
        successfulCalls: apiResponses.filter((r) => r.success).length,
        failedCalls: apiResponses.filter((r) => !r.success).length,
        totalSectionsProcessed: apiResponses.reduce(
          (sum, r) => sum + r.sectionsProcessed,
          0
        ),
      },
    };
  } catch (error) {
    console.error("Error in dynamic insert API handler:", error);

    // NEW: Print handler error
    console.log("\n❌ DYNAMIC INSERT API HANDLER ERROR:");
    console.log("====================================");
    console.log("Error Message:", error.message);
    console.log("Error Stack:", error.stack);
    console.log("====================================");

    return {
      success: false,
      error: error.message,
      totalSections: 0,
      totalApicalls: 0,
      responses: [],
    };
  }
}

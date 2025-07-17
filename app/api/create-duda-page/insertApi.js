/**
 * Triggers the Duda insert API multiple times based on section count
 * @param {Array} jsonInput - The JSON array from input box
 * @param {string} pageId - The page ID for the API
 * @param {number} uuid - Unique identifier for the request
 * @returns {Promise<Array>} Array of API responses
 */
export async function triggerInsertApiForSections(jsonInput, uuid) {
  if (!jsonInput || !Array.isArray(jsonInput)) {
    throw new Error('Invalid JSON input - must be an array');
  }

  const sectionCount = jsonInput.length;
  console.log(`Total sections in input: ${sectionCount}`);

  // Calculate how many times to trigger the API (2 sections per call)
  const triggerCount = Math.ceil(sectionCount / 2);
  console.log(`API will be triggered ${triggerCount} times`);

  const responses = [];
  
  for (let i = 0; i < triggerCount; i++) {
    // Calculate indices before try-catch so they're available in error handling
    const startIndex = i * 2;
    const endIndex = Math.min(startIndex + 2, sectionCount);
    const sectionRange = `${startIndex + 1}-${endIndex}`;
    
    console.log(`\n=== Triggering API call ${i + 1} of ${triggerCount} ===`);
    console.log(`Processing sections ${sectionRange}`);

    try {
      const sectionsForThisBatch = jsonInput.slice(startIndex, endIndex);
      
      // Trigger the insert API
      const response = await callInsertApi(uuid, sectionsForThisBatch, i + 1);
      
      // NEW: Print the detailed response
      console.log(`\n🔍 INSERT API RESPONSE FOR BATCH ${i + 1}:`);
      console.log('==========================================');
      console.log('Response Status: SUCCESS');
      console.log('Response Data:', JSON.stringify(response, null, 2));
      console.log('==========================================');
      
      responses.push({
        batchNumber: i + 1,
        sectionsProcessed: sectionsForThisBatch.length,
        sectionRange: sectionRange,
        response: response,
        success: true
      });
      
      console.log(`Batch ${i + 1} completed successfully`);
      
      // Add delay between API calls to avoid rate limiting
      if (i < triggerCount - 1) {
        console.log('Waiting 2 seconds before next API call...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      console.error(`Error in batch ${i + 1}:`, error);
      
      // NEW: Print detailed error response
      console.log(`\n❌ INSERT API ERROR FOR BATCH ${i + 1}:`);
      console.log('==========================================');
      console.log('Response Status: ERROR');
      console.log('Error Message:', error.message);
      console.log('Error Stack:', error.stack);
      console.log('==========================================');
      
      responses.push({
        batchNumber: i + 1,
        sectionsProcessed: 0,
        sectionRange: sectionRange,
        response: null,
        success: false,
        error: error.message
      });
    }
  }

  // NEW: Print overall summary of all responses
  console.log('\n📊 INSERT API OVERALL SUMMARY:');
  console.log('=====================================');
  console.log(`Total batches processed: ${responses.length}`);
  console.log(`Successful batches: ${responses.filter(r => r.success).length}`);
  console.log(`Failed batches: ${responses.filter(r => !r.success).length}`);
  console.log('Detailed responses by batch:');
  responses.forEach((response, index) => {
    console.log(`\n  Batch ${response.batchNumber}:`);
    console.log(`    Status: ${response.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`    Sections Range: ${response.sectionRange}`);
    console.log(`    Sections Processed: ${response.sectionsProcessed}`);
    if (response.success && response.response) {
      console.log(`    Response Keys: ${Object.keys(response.response).join(', ')}`);
    }
    if (!response.success && response.error) {
      console.log(`    Error: ${response.error}`);
    }
  });
  console.log('=====================================');

  return responses;
}

/**
 * Makes the actual API call to Duda insert endpoint
 * @param {string} pageId - The page ID
 * @param {Array} sections - Sections to process in this batch
 * @param {number} batchNumber - Current batch number
 * @param {number} uuid - Unique identifier for the request
 * @returns {Promise<Object>} API response
 */
async function callInsertApi(uuid, batchNumber) {
  const apiUrl = `https://my.duda.co/api/uis/pages/${uuid}/flex/insert`;
  
  const requestBody = {
    'parentId': '1716942098',
    'insertAfterId': '1641784833',
  };

  // NEW: Print request details
  console.log(`\n📤 INSERT API REQUEST FOR BATCH ${batchNumber}:`);
  console.log('===========================================');
  console.log(`API URL: ${apiUrl}`);
  console.log(`Request Body:`, JSON.stringify(requestBody, null, 2));
  console.log('===========================================');

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
      'content-type': 'application/json',
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'baggage': 'sentry-environment=direct,sentry-release=production_5632,sentry-public_key=0d2f170da99ddd8d3befc10a7f4ddd29,sentry-trace_id=f67a5356b5654184aa10a2daf653ca61,sentry-sampled=true,sentry-sample_rand=0.043337209731944104,sentry-sample_rate=0.1',
      'content-type': 'application/json',
      'dm_loc': '/home/site/41e002a2/empty',
      'origin': 'https://my.duda.co',
      'priority': 'u=1, i',
      'referer': 'https://my.duda.co/home/site/41e002a2/empty',
      'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Linux"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sentry-trace': 'f67a5356b5654184aa10a2daf653ca61-b642d7756eb277e2-1',
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
      'x-requested-with': 'XMLHttpRequest',
      'cookie': '_gd_visitor=40d0bd8f-b2b9-4fcf-86ea-2accc484ed78; language=en; landingPage=/login; deviceView=tablet; first_conversion_source_touchpoints=direct; first_conversion_medium_touchpoints=null; first_conversion_campaign_touchpoints=null; first_conversion_term_touchpoints=null; first_conversion_content_touchpoints=null; isFirstSessionVisit=false; _fbp=fb.1.1752547231596.871167907101487908; _ce.clock_data=36%2C49.37.222.125%2C1%2Ccd5d5f3ff8f374827248e13d2f7d64ca%2CChrome%2CIN; hubspotutk=9af6036ce59b5aa15aa544ef46b86533; _dm_remember_me=RXlNeEhzbzZkZ1BMemlrRVZ0QVNMZyUzRCUzRDpBWmt0aVV4UnFjckx2bVZSMWtiU2hnJTNEJTNE; account_uuid=41ea951a2a304fa38d59162280dae36b; dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; _conv_v=vi%3A1*sc%3A1*cs%3A1752547229*fs%3A1752547229*pv%3A2*exp%3A%7B%7D*seg%3A%7B%7D; _ce.s=v~8371c5812a5a58ab73d92049be54c44bf1c24111~lcw~1752547247994~vir~new~lva~1752547231583~vpv~0~v11.cs~268877~v11.s~13b6d9c0-6125-11f0-9f8c-cdb2b9925d08~v11.vs~8371c5812a5a58ab73d92049be54c44bf1c24111~v11.fsvd~eyJ1cmwiOiJkdWRhLmNvL2xvZ2luIiwicmVmIjoiIiwidXRtIjpbXX0%3D~v11.sla~1752547232096~v11ls~13b6d9c0-6125-11f0-9f8c-cdb2b9925d08~gtrk.la~md3xdwiw~lcw~1752547255016; _gid=GA1.2.1356213168.1752547256; __zlcmid=1RsneD9izLkntAc; AWSALBTG=TuqLlYPsCO6gn/u4pAFCLXlnquG5PnmZbJ4wTjmx9Eq9DwmRscYwpO3gEEx4+sTmJkwoQFOOzDlfmOaosT9OKLcLSvIw/SAr9y7Qk5OR7xUgrWFZrUqLrXeHzhjYRXMtZBcTXV4nvVjAoZU08KYtzY2o7+rKezD32dKXI80GR5+JM5SthFo=; JSESSIONID=E44B3F61BD17A855B74AC16CBD5E6D33; _dm_account=%7B%22name%22%3A%22misham%40wigoh.ai%22%2C%22uuid%22%3A%2241ea951a2a304fa38d59162280dae36b%22%2C%22gaType%22%3A%22SMB%22%2C%22lastLogin%22%3A1752631651000%7D; _gcl_au=1.1.186818603.1752547231; _ga=GA1.1.f3820429-e039-46ef-8ab7-5811267bb6f3; IR_gbd=duda.co; IR_13628=1752631665584%7C0%7C1752631665584%7C%7C; __hstc=244318362.9af6036ce59b5aa15aa544ef46b86533.1752547233092.1752573679532.1752631666069.6; __hssrc=1; __hssc=244318362.1.1752631666069; _uetsid=13233b00612511f0ae71174240b8f124; _uetvid=24df0c103b8511f0b71eb52d29352553; _gd_session=3d145a24-4936-4886-8aca-818d32f14f1f; _dm_se_token_me=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50VXVpZCI6IjQxZWE5NTFhMmEzMDRmYTM4ZDU5MTYyMjgwZGFlMzZiIiwiYWNjb3VudE5hbWUiOiJtaXNoYW1Ad2lnb2guYWkiLCJjcmVhdGlvblRpbWUiOjE3NTI2MzIwMDcyNDgsImV4cCI6MTc1MjYzNDQwN30.4gu9i44JtItthANdV4rbFPVetOgax-wBL1zrA4zAzNU; AWSALB=yB/ZtzUcnVGRWo53ouujw8wBrwEo5yiPi+ea3Iq3qDUrVgda6McC4iIkgf6+5S/q06SSnqixqTU6IEco3dY1FmzJ+A4HO/5ERJuWXXVk0lK9J36uCIA+npQ/AVQ+; _ga_GFZCS4CS4Q=GS2.1.s1752631665$o2$g1$t1752632009$j60$l0$h0'
   },
      body: JSON.stringify(requestBody)
    });

    // NEW: Print response status and headers
    console.log(`\n📥 INSERT API RESPONSE STATUS FOR BATCH ${batchNumber}:`);
    console.log('============================================');
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
    console.log('============================================');

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // NEW: Print detailed error response
      console.log(`\n❌ INSERT API ERROR RESPONSE FOR BATCH ${batchNumber}:`);
      console.log('===============================================');
      console.log(`Status: ${response.status}`);
      console.log(`Status Text: ${response.statusText}`);
      console.log(`Error Data:`, JSON.stringify(errorData, null, 2));
      console.log('===============================================');
      
      throw new Error(
        `API call failed with status ${response.status}: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    
    // NEW: Print successful response data
    console.log(`\n✅ INSERT API SUCCESS RESPONSE FOR BATCH ${batchNumber}:`);
    console.log('=================================================');
    console.log('Response Data:', JSON.stringify(data, null, 2));
    console.log('=================================================');
    
    if (!data) {
      throw new Error('Empty response from API');
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
    if (!section || typeof section !== 'object') {
      throw new Error(`Invalid section at index ${index}`);
    }
    return {
      index: index + 1,
      id: section.id || `section-${index + 1}`,
      data: section
    };
  });
}

/**
 * Integration function to be called from your existing route
 * @param {Object} request - The request object containing JSON input
 * @param {string} pageId - The page ID
 * @param {number} uuid - Unique identifier for the request
 * @returns {Promise<Object>} Combined response with all API results
 */
export async function handleDynamicInsertApi(request, uuid) {
  try {
    const { primaryBatchBody } = request;
    
    if (!primaryBatchBody || !Array.isArray(primaryBatchBody)) {
      return {
        success: false,
        error: 'Primary batch body is required and must be an array',
        totalSections: 0,
        totalApicalls: 0,
        responses: []
      };
    }

    console.log('=== DYNAMIC INSERT API HANDLER ===');
    console.log(`Processing ${primaryBatchBody.length} sections`);

    const sections = extractSections(primaryBatchBody);
    const apiResponses = await triggerInsertApiForSections(sections, uuid);
    
    // Check if any API calls were actually made
    if (apiResponses.length === 0) {
      return {
        success: false,
        error: 'No API calls were triggered - check section count and logic',
        totalSections: sections.length,
        totalApicalls: 0,
        responses: []
      };
    }

    // NEW: Print the final handler response
    console.log('\n🎯 DYNAMIC INSERT API HANDLER FINAL RESPONSE:');
    console.log('================================================');
    console.log('Handler Response:', JSON.stringify({
      success: apiResponses.some(r => r.success),
      totalSections: sections.length,
      totalApicalls: apiResponses.length,
      responses: apiResponses,
      summary: {
        successfulCalls: apiResponses.filter(r => r.success).length,
        failedCalls: apiResponses.filter(r => !r.success).length,
        totalSectionsProcessed: apiResponses.reduce((sum, r) => sum + r.sectionsProcessed, 0)
      }
    }, null, 2));
    console.log('================================================');

    // Rest of the function remains the same...
    return {
      success: apiResponses.some(r => r.success),
      totalSections: sections.length,
      totalApicalls: apiResponses.length,
      responses: apiResponses,
      summary: {
        successfulCalls: apiResponses.filter(r => r.success).length,
        failedCalls: apiResponses.filter(r => !r.success).length,
        totalSectionsProcessed: apiResponses.reduce((sum, r) => sum + r.sectionsProcessed, 0)
      }
    };
  } catch (error) {
    console.error('Error in dynamic insert API handler:', error);
    
    // NEW: Print handler error
    console.log('\n❌ DYNAMIC INSERT API HANDLER ERROR:');
    console.log('====================================');
    console.log('Error Message:', error.message);
    console.log('Error Stack:', error.stack);
    console.log('====================================');
    
    return {
      success: false,
      error: error.message,
      totalSections: 0,
      totalApicalls: 0,
      responses: []
    };
  }
}
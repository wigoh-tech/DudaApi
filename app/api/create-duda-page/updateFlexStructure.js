export function extractHierarchicalIdsFromDeleteResponse(deleteApiResponse) {
  const sections = [];

  // Handle both parsed objects and JSON strings
  let parsedResponse = deleteApiResponse;

  if (typeof deleteApiResponse === "string") {
    try {
      parsedResponse = JSON.parse(deleteApiResponse);
    } catch (error) {
      console.error("Error parsing delete API response:", error);
      return [
        {
          elementId: null,
          sectionId: null,
          gridId: null,
          parentGroupId: null,
          childGroup1Id: null,
        },
      ];
    }
  }

  if (!parsedResponse || !parsedResponse.elements) {
    return [
      {
        elementId: null,
        sectionId: null,
        gridId: null,
        parentGroupId: null,
        childGroup1Id: null,
      },
    ];
  }

  const elements = parsedResponse.elements;
  const rootContainerId = parsedResponse.rootContainerId;

  // Find all sections (elements without parentId and type === "section")
  Object.values(elements).forEach((element) => {
    if (element.type === "section" && !element.parentId) {
      const sectionStructure = {
        elementId: parsedResponse.id, // The main response ID
        sectionId: element.id,
        gridId: null,
        parentGroupId: null,
        childGroup1Id: null,
      };

      // Find grid children of the section
      if (element.children && element.children.length > 0) {
        element.children.forEach((childId) => {
          const child = elements[childId];
          if (child && child.type === "grid") {
            sectionStructure.gridId = child.id;

            // Find group children of the grid (parent groups)
            if (child.children && child.children.length > 0) {
              child.children.forEach((grandChildId) => {
                const grandChild = elements[grandChildId];
                if (grandChild && grandChild.type === "group") {
                  sectionStructure.parentGroupId = grandChild.id;

                  // Find child groups within the parent group
                  if (grandChild.children && grandChild.children.length > 0) {
                    grandChild.children.forEach((greatGrandChildId, index) => {
                      const greatGrandChild = elements[greatGrandChildId];
                      if (greatGrandChild && greatGrandChild.type === "group") {
                        if (index === 0) {
                          sectionStructure.childGroup1Id = greatGrandChild.id;
                        }
                        // Add more child groups if needed
                        // else if (index === 1) sectionStructure.childGroup2Id = greatGrandChild.id;
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }

      sections.push(sectionStructure);
    }
  });

  return sections.length > 0
    ? sections
    : [
        {
          elementId: parsedResponse.id || null,
          sectionId: rootContainerId || null,
          gridId: null,
          parentGroupId: null,
          childGroup1Id: null,
        },
      ];
}

// Function to extract IDs from deletion result object (handles both string and parsed responses)
export function extractIdsFromDeletionResult(deletionResult) {
  let responseData = null;

  // Try to get the response data
  if (deletionResult.parsedResponse) {
    responseData = deletionResult.parsedResponse;
  } else if (deletionResult.response) {
    try {
      responseData =
        typeof deletionResult.response === "string"
          ? JSON.parse(deletionResult.response)
          : deletionResult.response;
    } catch (error) {
      console.error("Error parsing deletion result response:", error);
      return null;
    }
  }

  if (responseData) {
    return extractHierarchicalIdsFromDeleteResponse(responseData);
  }

  return null;
}

// Function to print the extracted section details
export function printSectionDetails(deleteApiResponse) {
  const sections = extractHierarchicalIdsFromDeleteResponse(deleteApiResponse);

  console.log("\n=== EXTRACTED SECTION DETAILS FROM DELETE API RESPONSE ===");
  sections.forEach((section, index) => {
    console.log(`\n--- Section ${index + 1} ---`);
    console.log(`Section Details: {`);
    console.log(`  elementId: ${section.elementId}`);
    console.log(`  sectionId: ${section.sectionId}`);
    console.log(`  gridId: ${section.gridId}`);
    console.log(`  parentGroupId: ${section.parentGroupId}`);
    console.log(`  childGroup1Id: ${section.childGroup1Id}`);
    console.log(`}`);
  });

  return sections;
}

// Function to print section details from deletion result
export function printSectionDetailsFromDeletionResult(deletionResult) {
  console.log(
    `\n=== EXTRACTING IDS FOR DELETION: ${deletionResult.childId} ===`
  );
  console.log(`Group ID: ${deletionResult.groupId}`);
  console.log(`Deletion Reason: ${deletionResult.deletionReason}`);

  const sections = extractIdsFromDeletionResult(deletionResult);

  if (sections && sections.length > 0) {
    sections.forEach((section, index) => {
      console.log(`\n--- Extracted Section ${index + 1} ---`);
      console.log(`Section Details: {`);
      console.log(`  elementId: ${section.elementId}`);
      console.log(`  sectionId: ${section.sectionId}`);
      console.log(`  gridId: ${section.gridId}`);
      console.log(`  parentGroupId: ${section.parentGroupId}`);
      console.log(`  childGroup1Id: ${section.childGroup1Id}`);
      console.log(`}`);
    });
  } else {
    console.log(
      "No hierarchical structure could be extracted from the deletion result"
    );
  }

  return sections;
}

// NEW: Function to create flex structure payload from extracted IDs
export function createFlexStructurePayload(extractedSection) {
  const { elementId, sectionId, gridId, parentGroupId, childGroup1Id } =
    extractedSection;

  const payload = {
    id: elementId,
    section: {
      prevCustomClassName: "",
      type: "section",
      id: sectionId,
      children: gridId ? [gridId] : [],
      name: "",
      data: {},
      customClassName: "",
    },
    rootContainerId: sectionId,
    elements: {},
    styles: {
      breakpoints: {
        mobile: { idToRules: {} },
        mobile_implicit: { idToRules: {} },
        common: { idToRules: {} },
        tablet_implicit: { idToRules: {} },
        desktop: { idToRules: {} },
        tablet: { idToRules: {} },
      },
    },
  };

  // Add section element
  if (sectionId) {
    payload.elements[sectionId] = {
      type: "section",
      id: sectionId,
      children: gridId ? [gridId] : [],
      name: "",
      data: {},
      customClassName: "",
    };
  }

  // Add grid element
  if (gridId) {
    payload.elements[gridId] = {
      type: "grid",
      id: gridId,
      parentId: sectionId,
      children: parentGroupId ? [parentGroupId] : [],
      name: "",
      data: { "data-layout-grid": "" },
      customClassName: "",
    };
  }

  // Add parent group element
  if (parentGroupId) {
    payload.elements[parentGroupId] = {
      type: "group",
      id: parentGroupId,
      parentId: gridId,
      children: childGroup1Id ? [childGroup1Id] : [],
      name: "",
      data: {},
      customClassName: "",
    };
  }

  // Add child group element
  if (childGroup1Id) {
    payload.elements[childGroup1Id] = {
      type: "group",
      id: childGroup1Id,
      parentId: parentGroupId,
      children: [],
      name: "",
      data: {},
      customClassName: "",
    };

    // Add styles for child group
    payload.styles.breakpoints.mobile.idToRules[childGroup1Id] = {
      "<id>": {
        width: "100%",
        "min-height": "80px",
        "align-items": "center",
      },
    };
    payload.styles.breakpoints.common.idToRules[childGroup1Id] = {
      "<id>": {
        "min-height": "8px",
        "column-gap": "4%",
        "row-gap": "24px",
        width: "100%",
        "min-width": "4%",
        padding: "16px 16px 16px 16px",
      },
    };
  }

  // Add styles for parent group
  if (parentGroupId) {
    payload.styles.breakpoints.mobile.idToRules[parentGroupId] = {
      "<id>": {
        "min-height": "0",
        "flex-direction": "column",
        "padding-left": "4%",
        "padding-right": "4%",
        "flex-wrap": "nowrap",
      },
    };
    payload.styles.breakpoints.common.idToRules[parentGroupId] = {
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
    payload.styles.breakpoints.tablet.idToRules[parentGroupId] = {
      "<id>": {
        "padding-left": "2%",
        "padding-right": "2%",
      },
    };
    payload.styles.breakpoints.desktop.idToRules[gridId] = {};
    payload.styles.breakpoints.desktop.idToRules[childGroup1Id] = {};
    payload.styles.breakpoints.desktop.idToRules[parentGroupId] = {};
  }

  return payload;
}

// NEW: Function to call flex structure API
// NEW: Function to call flex structure API (FIXED VERSION)
export async function updateFlexStructureAPI(
  pageId,
  extractedSection,
  cookies,
  uuid
) {
  try {
    const payload = createFlexStructurePayload(extractedSection);

    const url = `https://my.duda.co/api/uis/pages/${uuid}/flexStructure?currentEditorPageId=${pageId}`;

    console.log(`\n=== CALLING FLEX STRUCTURE API ===`);
    console.log(`URL: ${url}`);
    console.log(
      `Payload for Section ${extractedSection.sectionId}:`,
      JSON.stringify(payload, null, 2)
    );

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        baggage:
          "sentry-environment=direct,sentry-release=production_5646,sentry-public_key=0d2f170da99ddd8d3befc10a7f4ddd29,sentry-trace_id=52d64bac387a48ea8603b99ee390c620,sentry-sampled=false,sentry-sample_rand=0.2088197615844395,sentry-sample_rate=0.1",
        "content-type": "application/json",
        dm_loc: "/home/site/41e002a2/duda12",
        dsid: "1048635",
        origin: "https://my.duda.co",
        priority: "u=1, i",
        referer: "https://my.duda.co/home/site/41e002a2/duda12",
        "sec-ch-ua":
          '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sentry-trace": "52d64bac387a48ea8603b99ee390c620-9d3146ebe00f2b8a-0",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "x-requested-with": "XMLHttpRequest",
        // FIX: Use 'cookie' header name and the cookies parameter
        cookie:
          "_gd_visitor=40d0bd8f-b2b9-4fcf-86ea-2accc484ed78; language=en; landingPage=/login; _fbp=fb.1.1752547231596.871167907101487908; hubspotutk=9af6036ce59b5aa15aa544ef46b86533; account_uuid=41ea951a2a304fa38d59162280dae36b; dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; __zlcmid=1RsneD9izLkntAc; __adroll_fpc=089d3b7c8c30a01d5551acf4c8db604c-1752719288427; __ar_v4=LVLOIN3JF5FT3CD5CBETI7%3A20250818%3A2%7C5PYFNWAESVGU5BU47WLRIT%3A20250818%3A2%7CNK6BCP2ZPJC2BEAS7JMXC2%3A20250818%3A2; dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; _dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; first_conversion_medium_touchpoints=null%3B%20referral%3B%20referral; first_conversion_campaign_touchpoints=null%3B%20null%3B%20null; first_conversion_term_touchpoints=null%3B%20null%3B%20null; first_conversion_content_touchpoints=null%3B%20null%3B%20null; _ga_9WXYK3PMB6=GS2.1.s1756184680$o1$g0$t1756184685$j55$l0$h0; AWSALBTG=YQuvdWvYOk5O+BlITPK77RGHQb8y0GDB4kDtpHT2NfT5sEInyUhZRPOOEXoNwbXrLC4Vt4iWOIGyUnCvVYki8fDz40j/hFKmZV1aXe1w996dhILpX64QCHcxwM+BaecUhWlMwrgJ828WmoLQNasxmvcPLy+GUjrebKWqb+nODnKzxJeDItQ=; _gid=GA1.2.2014990144.1756348807; __hssrc=1; IR_gbd=duda.co; deviceView=desktop; first_conversion_source_touchpoints=direct%3B%20127.0.0.1%3B%20claude.; isFirstSessionVisit=false; cebs=1; _ce.clock_data=46%2C49.37.222.205%2C1%2C6ffa570f521e87e65c529e15a5aaac67%2CChrome%2CIN; _dm_remember_me=ZlNaUVA4T3djOHR3c1dYcEdON3kwUSUzRCUzRDo3RnNFMjRoVjlydUgxWjdPMklWYW5BJTNEJTNE; cebsp_=2; _ce.s=v~8371c5812a5a58ab73d92049be54c44bf1c24111~lcw~1756368199998~vir~returning~lva~1756368196156~vpv~5~v11ls~7445b440-83e5-11f0-8d62-8547177dbc15~v11.cs~268877~v11.s~7445b440-83e5-11f0-8d62-8547177dbc15~v11.vs~8371c5812a5a58ab73d92049be54c44bf1c24111~v11.fsvd~eyJ1cmwiOiJkdWRhLmNvL2xvZ2luIiwicmVmIjoiaHR0cHM6Ly9teS5kdWRhLmNvLyIsInV0bSI6W119~v11.sla~1756368197003~gtrk.la~mev4a3cu~lcw~1756368203646; _conv_r=s%3Awww.duda.co*m%3Areferral*t%3A*c%3A; __hstc=244318362.9af6036ce59b5aa15aa544ef46b86533.1752547233092.1756372016075.1756376458580.168; _gd_session=47c3606d-8309-4a85-8247-5edc3cb8be6d; _dm_account=%7B%22name%22%3A%22misham%40wigoh.ai%22%2C%22uuid%22%3A%2241ea951a2a304fa38d59162280dae36b%22%2C%22gaType%22%3A%22SMB%22%2C%22lastLogin%22%3A1756380628000%7D; JSESSIONID=7D924A7A4368741EBE9A872AE2C19BD6; _gcl_au=1.1.186818603.1752547231; __hssc=244318362.9.1756376458580; IR_13628=1756380636656%7C0%7C1756380636656%7C%7C; _uetsid=55d25e5083b811f0bd6e570fa1003a5d; _uetvid=24df0c103b8511f0b71eb52d29352553; _ga=GA1.1.40c19243-5508-4903-b427-d90457d0b930; _conv_v=vi%3A1*sc%3A209*cs%3A1756380637*fs%3A1752547229*pv%3A607*exp%3A%7B100254142.%7Bv.1002832145-g.%7B%7D%7D%7D*seg%3A%7B%7D*ps%3A1756376459; _conv_s=si%3A209*sh%3A1756380637169-0.8194378961826805*pv%3A1; _dm_se_token_me=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50VXVpZCI6IjQxZWE5NTFhMmEzMDRmYTM4ZDU5MTYyMjgwZGFlMzZiIiwiYWNjb3VudE5hbWUiOiJtaXNoYW1Ad2lnb2guYWkiLCJjcmVhdGlvblRpbWUiOjE3NTYzODE0ODg1ODIsImV4cCI6MTc1NjM4Mzg4OH0.pvbboIkIzta8T7QrtFAc2fcbpeVxpQ0O6jMJxcIkKSc; _ga_GFZCS4CS4Q=GS2.1.s1756348817$o35$g1$t1756381719$j60$l0$h0; AWSALB=ReQvpYp2dH0jRMLR67ECpMrscDzjNZX6cnqal+anZYoxwjJn7Fi3CsZPBssoOi1FsRiE5MB5XfuIjfsL2X3ePIKg8VoZx81i6ZsEIi5WNYbyivyToV6ICFxZVy23",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    const responseHeaders = Object.fromEntries(response.headers.entries());

    console.log(`\n=== FLEX STRUCTURE API RESPONSE ===`);
    console.log(`Success: ${response.ok}`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Section ID: ${extractedSection.sectionId}`);
    console.log(
      `Raw Response (first 500 chars): ${responseText.substring(0, 500)}`
    );

    // Check if response is HTML (error page)
    if (
      responseText.trim().startsWith("<!DOCTYPE") ||
      responseText.trim().startsWith("<html")
    ) {
      console.error(
        "❌ Received HTML response instead of JSON - likely authentication issue"
      );
      console.error("This usually means:");
      console.error("1. Cookies are expired/invalid");
      console.error("2. Session has timed out");
      console.error("3. Authorization failed");

      return {
        success: false,
        status: response.status,
        statusText: response.statusText,
        sectionId: extractedSection.sectionId,
        elementId: extractedSection.elementId,
        error:
          "Authentication failure - received HTML response instead of JSON",
        response: responseText.substring(0, 1000), // Truncate for logging
        responseHeaders: responseHeaders,
        payload: payload,
      };
    }

    let parsedResponse = null;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (error) {
      console.error("Error parsing flex structure API response:", error);
      return {
        success: false,
        status: response.status,
        statusText: response.statusText,
        sectionId: extractedSection.sectionId,
        elementId: extractedSection.elementId,
        error: `JSON parsing failed: ${error.message}`,
        response: responseText,
        responseHeaders: responseHeaders,
        payload: payload,
      };
    }

    const result = {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      sectionId: extractedSection.sectionId,
      elementId: extractedSection.elementId,
      response: responseText,
      parsedResponse: parsedResponse,
      responseHeaders: responseHeaders,
      payload: payload,
    };

    if (parsedResponse) {
      console.log(
        `✅ Parsed Response:`,
        JSON.stringify(parsedResponse, null, 2)
      );
    }

    return result;
  } catch (error) {
    console.error("Error calling flex structure API:", error);
    return {
      success: false,
      error: error.message,
      sectionId: extractedSection.sectionId,
      elementId: extractedSection.elementId,
    };
  }
}

// Helper function to validate and refresh cookies
export function validateCookies(cookies) {
  if (!cookies) {
    console.warn("⚠️ No cookies provided");
    return false;
  }

  // Check for essential cookies
  const essentialCookies = [
    "JSESSIONID",
    "_dm_se_token_me",
    "account_uuid",
    "_dm_account",
  ];

  const hasEssentialCookies = essentialCookies.some((cookieName) =>
    cookies.includes(cookieName)
  );

  if (!hasEssentialCookies) {
    console.warn("⚠️ Missing essential authentication cookies");
    return false;
  }

  console.log("✅ Cookies appear valid");
  return true;
}

// Enhanced version with cookie validation
export async function updateFlexStructureAPIWithValidation(
  pageId,
  extractedSection,
  cookies,
  uuid
) {
  // Validate cookies first
  if (!validateCookies(cookies)) {
    return {
      success: false,
      error: "Invalid or missing cookies",
      sectionId: extractedSection.sectionId,
      elementId: extractedSection.elementId,
    };
  }

  return updateFlexStructureAPI(pageId, extractedSection, cookies, uuid);
}

// NEW: Function to process multiple extracted sections and call flex structure API
export async function processExtractedSectionsForFlexStructure(
  deletionResults,
  pageId,
  cookies,
  uuid
) {
  const flexStructureResults = [];
  const processedSections = new Set(); // To avoid duplicates

  console.log(`\n=== PROCESSING EXTRACTED SECTIONS FOR FLEX STRUCTURE API ===`);
  console.log(`Total deletion results to process: ${deletionResults.length}`);

  for (const deletionResult of deletionResults) {
    try {
      const extractedSections = extractIdsFromDeletionResult(deletionResult);

      if (extractedSections && extractedSections.length > 0) {
        for (const section of extractedSections) {
          // Skip if section already processed or if essential IDs are missing
          if (!section.sectionId || processedSections.has(section.sectionId)) {
            continue;
          }

          processedSections.add(section.sectionId);

          console.log(`\n--- Processing Section: ${section.sectionId} ---`);

          // Call flex structure API
          const flexResult = await updateFlexStructureAPI(
            pageId,
            section,
            cookies,
            uuid
          );
          flexStructureResults.push(flexResult);

          // Add delay between API calls to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error(`Error processing deletion result:`, error);
      flexStructureResults.push({
        success: false,
        error: error.message,
        deletionResultId: deletionResult.childId,
      });
    }
  }

  const summary = {
    totalProcessed: flexStructureResults.length,
    successful: flexStructureResults.filter((r) => r.success).length,
    failed: flexStructureResults.filter((r) => !r.success).length,
    results: flexStructureResults,
  };

  console.log(`\n=== FLEX STRUCTURE PROCESSING SUMMARY ===`);
  console.log(`Total Processed: ${summary.totalProcessed}`);
  console.log(`Successful: ${summary.successful}`);
  console.log(`Failed: ${summary.failed}`);

  return summary;
}

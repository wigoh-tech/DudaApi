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
        cookie:
          "_gd_visitor=40d0bd8f-b2b9-4fcf-86ea-2accc484ed78; language=en; landingPage=/login; _fbp=fb.1.1752547231596.871167907101487908; hubspotutk=9af6036ce59b5aa15aa544ef46b86533; account_uuid=41ea951a2a304fa38d59162280dae36b; dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; __zlcmid=1RsneD9izLkntAc; __adroll_fpc=089d3b7c8c30a01d5551acf4c8db604c-1752719288427; _gid=GA1.2.886432894.1753064619; __ar_v4=LVLOIN3JF5FT3CD5CBETI7%3A20250716%3A2%7C5PYFNWAESVGU5BU47WLRIT%3A20250716%3A2%7CNK6BCP2ZPJC2BEAS7JMXC2%3A20250716%3A2; _dm_remember_me=MGZ0UVZJNGFVcjhlNUdYVkZpYXB6USUzRCUzRDpWazZ4Q2U0aTVjdDR5WVZ3OExvbzRRJTNEJTNE; deviceView=desktop; first_conversion_source_touchpoints=direct%3B%20127.0.0.1; first_conversion_medium_touchpoints=null%3B%20referral; first_conversion_campaign_touchpoints=null%3B%20null; first_conversion_term_touchpoints=null%3B%20null; first_conversion_content_touchpoints=null%3B%20null; isFirstSessionVisit=false; _ce.clock_data=44%2C49.37.220.103%2C1%2C6ffa570f521e87e65c529e15a5aaac67%2CChrome%2CIN; _ce.s=v~8371c5812a5a58ab73d92049be54c44bf1c24111~lcw~1753067721888~vir~returning~lva~1753067721040~vpv~3~v11ls~ef844c70-65e0-11f0-ba1b-bf65481c13f3~v11.cs~268877~v11.s~ef844c70-65e0-11f0-ba1b-bf65481c13f3~v11.vs~8371c5812a5a58ab73d92049be54c44bf1c24111~v11.fsvd~eyJ1cmwiOiJkdWRhLmNvL2xvZ2luL2xvZ2dlZCIsInJlZiI6Imh0dHA6Ly8xMjcuMC4wLjE6NTUwMC8iLCJ1dG0iOltdfQ%3D%3D~v11.sla~1753067721403~gtrk.la~mdcj9bc0~lcw~1753067721889; AWSALBTG=/SGxe9wPVyYNamXXPHvNDID33ptEoyf0dPUXK9XmfoRlyeVjERYG1nq+UcCbRQVr4HW6eB3e+FPTvMGadmsaAB35f+LfdzSJyD+VxoNs3i5kKQxW4Lc2K0ymOoIvkFlYjXeu/1mw2/VKq747L4Ovr/0byNq3CPTKk6FbsS/sO200V1AB4Ug=; _dm_account=%7B%22name%22%3A%22misham%40wigoh.ai%22%2C%22uuid%22%3A%2241ea951a2a304fa38d59162280dae36b%22%2C%22gaType%22%3A%22SMB%22%2C%22lastLogin%22%3A1753150853000%7D; __hstc=244318362.9af6036ce59b5aa15aa544ef46b86533.1752547233092.1753103474243.1753150867711.31; __hssrc=1; IR_gbd=duda.co; _gd_session=9b57b0db-d16b-4b86-8458-888bd088bc52; _dm_se_token_me=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50VXVpZCI6IjQxZWE5NTFhMmEzMDRmYTM4ZDU5MTYyMjgwZGFlMzZiIiwiYWNjb3VudE5hbWUiOiJtaXNoYW1Ad2lnb2guYWkiLCJjcmVhdGlvblRpbWUiOjE3NTMxNTIxNzYzMjgsImV4cCI6MTc1MzE1NDU3Nn0.gmtASGc5cRi6GSE4znabzNDqiWr_5oTE5nFD8yAir_E; _gat=1; JSESSIONID=51FFD8BFA98FFFFF157D1358C7AA451B; __hssc=244318362.4.1753150867711; _gcl_au=1.1.186818603.1752547231; _ga=GA1.1.0d0dbe64-694c-4e3b-b217-1343e01cd7d2; _conv_v=vi%3A1*sc%3A33*cs%3A1753152332*fs%3A1752547229*pv%3A103*exp%3A%7B%7D*seg%3A%7B%7D*ps%3A1753150870; _conv_s=si%3A33*sh%3A1753152332187-0.005297773138133621*pv%3A2; IR_13628=1753152338925%7C0%7C1753152338925%7C%7C; _uetsid=111e26c065d611f08d90b78734fbbf70; _uetvid=24df0c103b8511f0b71eb52d29352553; _ga_GFZCS4CS4Q=GS2.1.s1753150868$o6$g1$t1753152346$j38$l0$h0; AWSALB=cnn1Ui5OVR2Qv+LopEjd1WCPQ68vjm/KtlMbuR6inpLLgIfnaP88bhO4Y8QGuSo78BBK7EYfkRQFWb4Tp0Nnivbw/z3tJnPMt05/FI4EPi7QSl+R7X4hk8/mW/3iacgdkUdeopg/V4p/oOtcs95zomV7lve0k1uFSPYznMSvDReETlW7eaZ8piXMWiI2Yg==",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    const responseHeaders = Object.fromEntries(response.headers.entries());

    let parsedResponse = null;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (error) {
      console.error("Error parsing flex structure API response:", error);
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

    console.log(`\n=== FLEX STRUCTURE API RESPONSE ===`);
    console.log(`Success: ${result.success}`);
    console.log(`Status: ${result.status} ${result.statusText}`);
    console.log(`Section ID: ${result.sectionId}`);
    console.log(`Response: ${responseText}`);

    if (parsedResponse) {
      console.log(`Parsed Response:`, JSON.stringify(parsedResponse, null, 2));
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

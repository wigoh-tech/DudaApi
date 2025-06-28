import { NextResponse } from "next/server";
import * as cheerio from "cheerio"; // Import cheerio

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("API route hit successfully");
    console.log("Request body:", body);

    const { pageTitle = "Empty", pageUrl, templateName } = body;

    // Step 1: Create page from scratch
    const createPageResponse = await fetch(
      "https://my.duda.co/api/uis/sites/1048635/createpagefromscratch",
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          origin: "https://my.duda.co",
          referer: "https://my.duda.co/home/site/41e002a2/home",
          "user-agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
          "x-requested-with": "XMLHttpRequest",
          cookie:
            "_fbp=fb.1.1748410352276.947939578829518178; hubspotutk=c5a494184d4e2afcd3e531233734eb58; _dm_ga_clientId=b2dba1c7-396b-458f-8a0f-deb72154dbcb; language=en; landingPage=/signup; accountId=794969; accountUuid=41ea951a2a304fa38d59162280dae36b; productUuid=52a9926b5dc94de688c1571d574ff75a; IR_PI=07615b33-3bb7-11f0-9b80-bd4b936f5cf7%7C1748431762162; account_uuid=41ea951a2a304fa38d59162280dae36b; dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; _gd_visitor=48c47a36-fbad-4877-8795-865d3648ff99; _gd_svisitor=95d70b17b5203c002668f367c2010000883e0100; __zlcmid=1RsneD9izLkntAc; __adroll_fpc=c54f649a952dbe827da56df24d8c71a5-1748431859407; _dm_remember_me=VlRyWmdyZHdiJTJCYldvY2l6cUlxc3FnJTNEJTNEOkVkUWZRdnppYlpSJTJGYUlRRU9TcWtadyUzRCUzRA; deviceView=desktop; isFirstSessionVisit=false; JSESSIONID=A142AD25210197C72AD3879535A403C0",
        },
        body: JSON.stringify({
          addToNav: true,
          dontMobilize: false,
          pageUrl: pageUrl || "http://bfs._dudamobile.com",
          templateName: templateName || "876004f8b5a14e25883e6e0af818572d~home",
          dynamicPageCreate: {},
          pageTitle: pageTitle,
          suggestedAlias: pageTitle.toLowerCase().replace(/\s+/g, "-"),
        }),
      }
    );

    if (!createPageResponse.ok) {
      const errorText = await createPageResponse.text();
      console.error("Duda API Error:", {
        status: createPageResponse.status,
        statusText: createPageResponse.statusText,
        body: errorText,
      });

      throw new Error(
        `Duda API error: ${createPageResponse.status} - ${errorText}`
      );
    }

    const createPageData = await createPageResponse.json();
    console.log(
      "Full Duda API Response:",
      JSON.stringify(createPageData, null, 2)
    );

    // Step 2: Extract required data from the response
    const uuid = createPageData.page?.uuid;
    const alias = createPageData.page?.alias;
    const itemUrl = createPageData.page?.itemUrl;
    const pageId = createPageData.page?.id;

    console.log("Extracted Data:", {
      uuid,
      alias,
      itemUrl,
      pageId,
    });

    if (!uuid || !pageId) {
      throw new Error("UUID or PageID not found in create page response");
    }

    // Step 3: Get flex structure using the UUID
    const timestamp = Date.now();
    const flexStructureResponse = await fetch(
      `https://my.duda.co/api/uis/pages/${uuid}/flexStructure?&_=${timestamp}`,
      {
        method: "GET",
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          baggage:
            "sentry-environment=direct,sentry-release=production_5561,sentry-public_key=0d2f170da99ddd8d3befc10a7f4ddd29,sentry-trace_id=0e34dd1766ec48ff894767672c7148d2,sentry-sampled=false,sentry-sample_rand=0.8908485307042698,sentry-sample_rate=0.1",
          "content-type": "application/json",
          dm_loc: `/home/site/41e002a2/${alias}`,
          priority: "u=1, i",
          referer: `https://my.duda.co/home/site/41e002a2/${alias}`,
          "sec-ch-ua":
            '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Linux"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sentry-trace": "0e34dd1766ec48ff894767672c7148d2-bd4e36d4f4886b6b-0",
          "user-agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
          "x-requested-with": "XMLHttpRequest",
          cookie:
            "_fbp=fb.1.1748410352276.947939578829518178; hubspotutk=c5a494184d4e2afcd3e531233734eb58; _dm_ga_clientId=b2dba1c7-396b-458f-8a0f-deb72154dbcb; language=en; landingPage=/signup; accountId=794969; accountUuid=41ea951a2a304fa38d59162280dae36b; productUuid=52a9926b5dc94de688c1571d574ff75a; IR_PI=07615b33-3bb7-11f0-9b80-bd4b936f5cf7%7C1748431762162; account_uuid=41ea951a2a304fa38d59162280dae36b; dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; _gd_visitor=48c47a36-fbad-4877-8795-865d3648ff99; _gd_svisitor=95d70b17b5203c002668f367c2010000883e0100; __zlcmid=1RsneD9izLkntAc; __adroll_fpc=c54f649a952dbe827da56df24d8c71a5-1748431859407; _dm_remember_me=VlRyWmdyZHdiJTJCYldvY2l6cUlxc3FnJTNEJTNEOkVkUWZRdnppYlpSJTJGYUlRRU9TcWtadyUzRCUzRA; deviceView=desktop; isFirstSessionVisit=false; JSESSIONID=A142AD25210197C72AD3879535A403C0",
        },
      }
    );

    let flexStructureData = null;
    if (flexStructureResponse.ok) {
      flexStructureData = await flexStructureResponse.json();
      console.log(
        "Flex Structure Response:",
        JSON.stringify(flexStructureData, null, 2)
      );

      // DEBUG: Log the structure to understand what we're working with
      console.log("=== FLEX STRUCTURE DEBUG ===");
      console.log("Type of flexStructureData:", typeof flexStructureData);
      console.log(
        "Keys in flexStructureData:",
        Object.keys(flexStructureData || {})
      );
      console.log("Has elements property:", !!flexStructureData?.elements);
      console.log("Elements type:", typeof flexStructureData?.elements);

      if (flexStructureData?.elements) {
        console.log("Elements keys:", Object.keys(flexStructureData.elements));
      }
      console.log("=== END DEBUG ===");
    } else {
      console.error("Flex Structure API Error:", {
        status: flexStructureResponse.status,
        statusText: flexStructureResponse.statusText,
        body: await flexStructureResponse.text(),
      });
      throw new Error("Failed to get flex structure");
    }

    // Step 4: Extract hierarchical IDs from flex structure (FIXED VERSION)
    function extractHierarchicalIds(flexData) {
      const sections = [];

      console.log("=== EXTRACTION DEBUG ===");
      console.log("FlexData received:", !!flexData);
      console.log("FlexData type:", typeof flexData);
      console.log("Is array:", Array.isArray(flexData));

      if (!flexData) {
        console.log("FlexData is null/undefined");
        return [
          {
            elementId: null,
            sectionId: null,
            gridId: null,
            parentGroupId: null,
            childGroup1Id: null,
            childGroup2Id: null,
          },
        ];
      }

      // Handle array response structure
      let dataToProcess = [];

      if (Array.isArray(flexData)) {
        dataToProcess = flexData;
        console.log("FlexData is array with", flexData.length, "items");
      } else if (flexData.elements) {
        // Handle single object with elements property
        dataToProcess = [flexData];
        console.log("FlexData is single object with elements");
      } else {
        console.log("Unknown flexData structure");
        return [
          {
            elementId: null,
            sectionId: null,
            gridId: null,
            parentGroupId: null,
            childGroup1Id: null,
            childGroup2Id: null,
          },
        ];
      }

      // Process each item in the data
      dataToProcess.forEach((item, itemIndex) => {
        console.log(`Processing item ${itemIndex}:`, item.id);

        if (!item.elements) {
          console.log(`Item ${itemIndex} has no elements property`);
          return;
        }

        const elements = item.elements;
        console.log("Elements found, keys:", Object.keys(elements));

        // Find all sections (elements with type 'section' and no parentId)
        Object.values(elements).forEach((element) => {
          if (element.type === "section" && !element.parentId) {
            console.log("Found section:", element.id);

            const sectionStructure = {
              elementId: item.id, // The root container ID
              sectionId: element.id,
              gridId: null,
              parentGroupId: null,
              childGroup1Id: null,
              childGroup2Id: null,
            };

            // Find grid within section
            if (element.children && element.children.length > 0) {
              element.children.forEach((childId) => {
                const child = elements[childId];
                if (child && child.type === "grid") {
                  console.log("Found grid:", child.id);
                  sectionStructure.gridId = child.id;

                  // Find parent group within grid
                  if (child.children && child.children.length > 0) {
                    child.children.forEach((grandChildId) => {
                      const grandChild = elements[grandChildId];
                      if (grandChild && grandChild.type === "group") {
                        console.log("Found parent group:", grandChild.id);
                        sectionStructure.parentGroupId = grandChild.id;

                        // Find child groups within parent group
                        if (
                          grandChild.children &&
                          grandChild.children.length > 0
                        ) {
                          grandChild.children.forEach(
                            (greatGrandChildId, index) => {
                              const greatGrandChild =
                                elements[greatGrandChildId];
                              if (
                                greatGrandChild &&
                                greatGrandChild.type === "group"
                              ) {
                                console.log(
                                  `Found child group ${index + 1}:`,
                                  greatGrandChild.id
                                );
                                if (index === 0) {
                                  sectionStructure.childGroup1Id =
                                    greatGrandChild.id;
                                } else if (index === 1) {
                                  sectionStructure.childGroup2Id =
                                    greatGrandChild.id;
                                }
                              }
                            }
                          );
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
      });

      console.log("=== END EXTRACTION DEBUG ===");

      // If no sections found, return a null structure
      if (sections.length === 0) {
        console.log("No sections found, returning null structure");
        return [
          {
            elementId: null,
            sectionId: null,
            gridId: null,
            parentGroupId: null,
            childGroup1Id: null,
            childGroup2Id: null,
          },
        ];
      }

      return sections;
    }

    // Updated main extraction logic
    const extractedIds = extractHierarchicalIds(flexStructureData);
    console.log("Extracted Hierarchical IDs:", extractedIds);

    // Print the extracted structure as requested
    console.log("=== EXTRACTED STRUCTURE ===");
    extractedIds.forEach((section, index) => {
      console.log(`Section ${index + 1}:`);
      console.log(`  elementId: ${section.elementId}`);
      console.log(`  sectionId: ${section.sectionId}`);
      console.log(`  gridId: ${section.gridId}`);
      console.log(`  parentGroupId: ${section.parentGroupId}`);
      console.log(`  childGroup1Id: ${section.childGroup1Id}`);
      console.log(`  childGroup2Id: ${section.childGroup2Id}`);
    });
    console.log("=== END EXTRACTED STRUCTURE ===");

    let matchedSections = [];
    let htmlIds = []; // New array to store just the htmlIds

    try {
      const url = `https://my.duda.co/site/41e002a2/${alias}?nee=true&ed=true&showOriginal=true&preview=true&dm_try_mode=true&dm_checkSync=1&dm_device=desktop`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "text/html",
          "user-agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        },
      });

      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);

        // Find all flex sections in HTML with data-flex-id
        const flexSections = $("[data-flex-id]");

        if (flexSections.length > 0) {
          console.log(`Found ${flexSections.length} flex sections in HTML`);

          // Match with our extracted IDs
          flexSections.each((index, element) => {
            const $element = $(element);
            const flexId = $element.attr("data-flex-id");
            const containerId = $element.attr("id");
            const dudaId = $element.attr("duda_id");

            // Find matching section from extractedIds
            const matchedSection = extractedIds.find(
              (section) => section.elementId === flexId
            );

            if (matchedSection) {
              console.log(`Matched flex section ${index + 1}:`, {
                htmlId: containerId,
                htmlDudaId: dudaId,
                flexId: flexId,
                matchedElementId: matchedSection.elementId,
                sectionId: matchedSection.sectionId,
              });

              matchedSections.push({
                ...matchedSection,
                htmlContainer: {
                  id: containerId,
                  duda_id: dudaId,
                  flex_id: flexId,
                },
              });

              // Store just the htmlId in the separate array
              htmlIds.push(containerId);
            } else {
              console.log(
                `No match found for flex section with data-flex-id: ${flexId}`
              );
            }
          });

          if (matchedSections.length > 0) {
            console.log(
              "Successfully matched sections:",
              matchedSections.length
            );
            console.log("HTML IDs found:", htmlIds); // Log the collected htmlIds
          } else {
            console.log("No sections matched between HTML and flex structure");
          }
        } else {
          console.log("No flex sections found in HTML");
        }
      } else {
        console.error(`HTML fetch failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching or parsing HTML:", error.message);
    }

    // Step 6: Create batch API requests for each section (only if we have valid IDs)
    const batchResults = [];

    // Helper function to generate unique IDs
    const generateUniqueId = () => Math.random().toString(36).substr(2, 6);

    // Helper function to validate HTML IDs
    const isValidHtmlId = (id) => id && typeof id === "string" && id.length > 0;

    // Retry wrapper for API calls
    const withRetry = async (fn, maxRetries = 3, delayMs = 2000) => {
      let attempt = 0;
      while (attempt < maxRetries) {
        try {
          const result = await fn();
          return result;
        } catch (error) {
          attempt++;
          if (attempt >= maxRetries) throw error;
          await new Promise((resolve) =>
            setTimeout(resolve, delayMs * attempt)
          );
        }
      }
    };

    for (let i = 0; i < extractedIds.length; i++) {
      const section = extractedIds[i];

      // Skip sections with missing required IDs
      if (
        !section.childGroup1Id ||
        !section.sectionId ||
        !section.gridId ||
        !section.parentGroupId ||
        !section.childGroup2Id
      ) {
        console.warn(
          `Section ${i + 1} has missing IDs, skipping batch operation...`
        );
        batchResults.push({
          sectionIndex: i + 1,
          sectionId: section.sectionId,
          success: false,
          error: "Missing required IDs",
        });
        continue;
      }

      const htmlId = htmlIds[i];
      if (!isValidHtmlId(htmlId)) {
        console.warn(
          `Invalid HTML ID for section ${i + 1}, skipping batch operation...`
        );
        batchResults.push({
          sectionIndex: i + 1,
          sectionId: section.sectionId,
          success: false,
          error: "Invalid HTML ID",
          htmlIdUsed: htmlId,
        });
        continue;
      }

      // Generate unique element ID for this insertion
      const widgetId = `widget_00${String.fromCharCode(106 + i)}`; // j, k, l, etc.

      // Construct the flex structure using the extracted IDs
      const flexStructure = {
        id: section.sectionId,
        section: {
          type: "section",
          id: section.sectionId,
          children: [section.gridId],
          name: "",
          data: {},
          customClassName: "",
        },
        rootContainerId: section.sectionId,
        elements: {
          [section.sectionId]: {
            type: "section",
            id: section.sectionId,
            children: [section.gridId],
            name: "",
            data: {},
            customClassName: "",
          },
          [section.gridId]: {
            type: "grid",
            id: section.gridId,
            parentId: section.sectionId,
            children: [section.parentGroupId],
            name: "",
            data: {
              "data-layout-grid": "",
            },
            customClassName: "",
          },
          [section.parentGroupId]: {
            type: "group",
            id: section.parentGroupId,
            parentId: section.gridId,
            children: [section.childGroup1Id, section.childGroup2Id],
            name: "",
            data: {},
            customClassName: "",
          },
          [section.childGroup1Id]: {
            type: "group",
            id: section.childGroup1Id,
            parentId: section.parentGroupId,
            children: [widgetId],
            name: "",
            data: {},
            customClassName: "",
          },
          [section.childGroup2Id]: {
            type: "group",
            id: section.childGroup2Id,
            parentId: section.parentGroupId,
            children: [],
            name: "",
            data: {},
            customClassName: "",
          },
          [widgetId]: {
            type: "widget_wrapper",
            id: widgetId,
            parentId: section.childGroup1Id,
            children: [],
            name: "Text Block",
            data: {
              "data-widget-type": "paragraph",
            },
            customClassName: "",
            externalId: `${generateUniqueId()}`,
          },
        },
        styles: {
          breakpoints: {
            mobile: {
              idToRules: {
                [section.childGroup1Id]: {
                  "<id>": {
                    width: "100%",
                    "min-height": "80px",
                    "align-items": "center",
                  },
                },
                [section.childGroup2Id]: {
                  "<id>": {
                    width: "100%",
                    "min-height": "80px",
                    "align-items": "center",
                  },
                },
                [section.parentGroupId]: {
                  "<id>": {
                    "min-height": "unset",
                    "flex-direction": "column",
                    "padding-left": "4%",
                    "padding-right": "4%",
                  },
                },
              },
            },
            mobile_implicit: {
              idToRules: {},
            },
            common: {
              idToRules: {
                [section.childGroup1Id]: {
                  "<id>": {
                    "min-height": "8px",
                    "column-gap": "4%",
                    "row-gap": "24px",
                    width: "48%",
                    "min-width": "4%",
                    padding: "16px 16px 16px 16px",
                  },
                },
                [section.childGroup2Id]: {
                  "<id>": {
                    "min-height": "8px",
                    "column-gap": "4%",
                    "row-gap": "24px",
                    width: "48%",
                    "min-width": "4%",
                    padding: "16px 16px 16px 16px",
                  },
                },
                [section.parentGroupId]: {
                  "<id>": {
                    "padding-top": "4%",
                    "padding-bottom": "4%",
                    "min-height": "240px",
                    "column-gap": "4%",
                    "row-gap": "24px",
                    width: "100%",
                  },
                },
                [widgetId]: {
                  "<id>": {
                    width: "100%",
                    height: "auto",
                    position: "relative",
                    "min-width": "10px",
                    "min-height": "10px",
                    "max-width": "100%",
                  },
                },
              },
            },
            tablet_implicit: {
              idToRules: {},
            },
            desktop: {
              idToRules: {
                [section.childGroup1Id]: {},
                [section.parentGroupId]: {},
                [section.childGroup2Id]: {},
                [section.gridId]: {},
              },
            },
            tablet: {
              idToRules: {
                [section.parentGroupId]: {
                  "<id>": {
                    "padding-left": "2%",
                    "padding-right": "2%",
                  },
                },
              },
            },
          },
        },
      };

      const batchPayload = [
        {
          type: "post",
          url: `/pages/${pageId}/insertElement?dm_batchReqId=${generateUniqueId()}`,
          data: {
            markup: `<div class="dmNewParagraph" data-dmtmpl="true" data-element-type="paragraph" data-version="5"><p class="text-align-left m-text-align-center"><span style="display: unset;">This is paragraph text for section ${
              i + 1
            }. Click it or hit the Manage Text button to change the font, color, size, format, and more. To set up site-wide paragraph and title styles, go to Site Theme.</span></p></div>`,
            parent: htmlId,
            before: null,
            defaultLocation: false,
          },
        },
        {
          type: "put",
          url: `/pages/${pageId}/flexStructure?dm_batchReqId=${generateUniqueId()}`,
          data: flexStructure,
        },
      ];

      console.log(`=== BATCH PAYLOAD FOR SECTION ${i + 1} ===`);
      console.log("Section IDs being used:");
      console.log(`  sectionId: ${section.sectionId}`);
      console.log(`  childGroup1Id: ${section.childGroup1Id}`);
      console.log(`  widgetId: ${widgetId}`);
      console.log(`  htmlId used as parent: ${htmlId}`);
      console.log("Batch payload body:");
      console.log(JSON.stringify(batchPayload, null, 2));
      console.log(`=== END BATCH PAYLOAD FOR SECTION ${i + 1} ===`);

      try {
        const batchResponse = await withRetry(
          async () => {
            const response = await fetch(
              `https://my.duda.co/api/uis/batch?op=create%20widget%20in%20flex&dm_device=desktop&currentEditorPageId=${pageId}`,
              {
                method: "POST",
                headers: {
                  accept: "*/*",
                  "accept-language": "en-US,en;q=0.9",
                  baggage:
                    "sentry-environment=direct,sentry-release=production_5561,sentry-public_key=0d2f170da99ddd8d3befc10a7f4ddd29,sentry-trace_id=08cc002eccfc41fe8029be4aa28eb11f,sentry-sampled=true,sentry-sample_rand=0.07692300293224708,sentry-sample_rate=0.1",
                  "content-type": "application/json",
                  dm_loc: `/home/site/41e002a2/${alias}`,
                  dsid: "1048635",
                  origin: "https://my.duda.co",
                  priority: "u=1, i",
                  referer: `https://my.duda.co/home/site/41e002a2/${alias}`,
                  "sec-ch-ua":
                    '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": '"Linux"',
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "sentry-trace":
                    "08cc002eccfc41fe8029be4aa28eb11f-ad7aa87b9748695d-1",
                  "user-agent":
                    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
                  "x-requested-with": "XMLHttpRequest",
                  cookie:
                    "_fbp=fb.1.1748410352276.947939578829518178; hubspotutk=c5a494184d4e2afcd3e531233734eb58; _dm_ga_clientId=b2dba1c7-396b-458f-8a0f-deb72154dbcb; language=en; landingPage=/signup; accountId=794969; accountUuid=41ea951a2a304fa38d59162280dae36b; productUuid=52a9926b5dc94de688c1571d574ff75a; IR_PI=07615b33-3bb7-11f0-9b80-bd4b936f5cf7%7C1748431762162; account_uuid=41ea951a2a304fa38d59162280dae36b; dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; _gd_visitor=48c47a36-fbad-4877-8795-865d3648ff99; _gd_svisitor=95d70b17b5203c002668f367c2010000883e0100; __zlcmid=1RsneD9izLkntAc; __adroll_fpc=c54f649a952dbe827da56df24d8c71a5-1748431859407; _dm_remember_me=VlRyWmdyZHdiJTJCYldvY2l6cUlxc3FnJTNEJTNEOkVkUWZRdnppYlpSJTJGYUlRRU9TcWtadyUzRCUzRA; first_conversion_medium_touchpoints=null%3B%20null%3B%20null%3B%20null; first_conversion_campaign_touchpoints=null%3B%20null%3B%20null%3B%20null; first_conversion_term_touchpoints=null%3B%20null%3B%20null%3B%20null; first_conversion_content_touchpoints=null%3B%20null%3B%20null%3B%20null; first_conversion_source_touchpoints=direct%3B%20direct%3B%20direct%3B%20di; _conv_r=s%3Awww.google.com*m%3Aorganic*t%3Aundefined*c%3A; deviceView=desktop; isFirstSessionVisit=false; JSESSIONID=5936366378F3C9EE6A4659F91A353E15",
                },
                body: JSON.stringify(batchPayload),
              }
            );

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(errorText || "Batch API request failed");
            }
            return response;
          },
          3,
          2000
        ); // 3 retries with exponential backoff

        const batchData = await batchResponse.json();

        // Process the batch response
        let insertElementResult = null;
        let flexStructureResult = null;

        Object.keys(batchData).forEach((key) => {
          if (key.includes("insertElement")) {
            insertElementResult = batchData[key];
          } else if (key.includes("flexStructure")) {
            flexStructureResult = batchData[key];
          }
        });

        // Extract the inserted element ID
        let insertedElementId = null;
        if (insertElementResult?.element) {
          const match = insertElementResult.element.match(
            /<div[^>]*\sid="(\d+)"/
          );
          if (match) insertedElementId = match[1];
        }

        batchResults.push({
          sectionIndex: i + 1,
          sectionId: section.sectionId,
          success: true,
          data: batchData,
          htmlIdUsed: htmlId,
          insertedElementId,
          flexStructureResult,
        });

        console.log(`Batch API success for section ${i + 1}:`, batchData);
      } catch (batchError) {
        console.error(`Batch API error for section ${i + 1}:`, batchError);

        batchResults.push({
          sectionIndex: i + 1,
          sectionId: section.sectionId,
          success: false,
          error: batchError.message,
          htmlIdUsed: htmlId,
        });

        // If this is the last section, don't delay before exiting
        if (i < extractedIds.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Increased delay
        }
        continue;
      }

      // Add delay between successful requests
      if (i < extractedIds.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Increased delay
      }
    }

    console.log("=== BATCH RESULTS ===");
    console.log(batchResults);
    console.log("=== END BATCH RESULTS ===");

    // Step 7: Return comprehensive response
    return NextResponse.json({
      success: batchResults.some((r) => r.success), // true if at least one succeeded
      data: {
        createPage: createPageData,
        extractedData: {
          uuid,
          alias,
          itemUrl,
          pageId,
        },
        flexStructure: flexStructureData,
        extractedIds: extractedIds,
        batchResults: batchResults,
        summary: {
          totalSections: extractedIds.length,
          successfulInsertions: batchResults.filter((r) => r.success).length,
          failedInsertions: batchResults.filter((r) => !r.success).length,
        },
      },
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
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

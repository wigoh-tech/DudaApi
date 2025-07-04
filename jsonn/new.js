import { DUDA_API_CONFIG } from "../../../lib/dudaApi";
import { generateUniqueId, extractDivId, withRetry } from "./utils";

export async function executeBatchOperations(
  pageId,
  uuid,
  alias,
  extractedIds,
  htmlIds,
  flexWidgetIds
) {
  const batchResults = [];

  for (let i = 0; i < extractedIds.length; i++) {
    const section = extractedIds[i];
    const htmlId = htmlIds[i];
    const flexWidgetId = flexWidgetIds[i];

    if (
      !section.childGroup1Id ||
      !section.sectionId ||
      !section.gridId ||
      !section.parentGroupId ||
      !section.childGroup2Id ||
      !htmlId
    ) {
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
      // Step 1: Insert elements - now inserting 4 elements (2 per group)
      const { divId1, divId2, divId3, divId4 } = await insertElements(
        pageId,
        alias,
        i,
        flexWidgetId
      );

      // Step 2: Update flex structure with additional widgets
      const flexData = await updateFlexStructure(
        pageId,
        uuid,
        alias,
        section,
        divId1,
        divId2,
        divId3,
        divId4,
        `widget_00${String.fromCharCode(106 + i)}`,
        `widget_00${String.fromCharCode(106 + i)}_2`,
        `widget_00${String.fromCharCode(106 + i)}_3`,
        `widget_00${String.fromCharCode(106 + i)}_4`
      );

      batchResults.push({
        sectionIndex: i + 1,
        sectionId: section.sectionId,
        success: true,
        htmlIdUsed: htmlId,
        insertedElementIds: { divId1, divId2, divId3, divId4 },
        flexStructureResult: flexData,
      });

      // Add delay between sections
      if (i < extractedIds.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      batchResults.push({
        sectionIndex: i + 1,
        sectionId: section.sectionId,
        success: false,
        error: error.message,
        htmlIdUsed: htmlId,
      });
    }
  }

  return batchResults;
}

async function insertElements(pageId, alias, index, flexWidgetId) {
  // First widget for group 1
  const insertElementPayload1 = {
    type: "post",
    url: `/pages/${pageId}/insertElement?dm_batchReqId=${generateUniqueId()}`,
    data: {
      markup: `<div class="dmNewParagraph" data-dmtmpl="true" data-element-type="paragraph" data-version="5"><p class="text-align-left m-text-align-center"><span style="display: unset;">This is paragraph text for section ${
        index + 1
      }. Click it or hit the Manage Text button to change the font, color, size, format, and more. To set up site-wide paragraph and title styles, go to Site Theme.</span></p></div>`,
      parent: flexWidgetId,
      before: null,
      defaultLocation: false,
    },
  };

  const insertData1 = await withRetry(async () => {
    return fetch(
      `${DUDA_API_CONFIG.baseUrl}/uis/batch?op=create%20widget%20in%20flex&dm_device=desktop&currentEditorPageId=${pageId}`,
      {
        method: "POST",
        headers: getBatchHeaders(alias),
        body: JSON.stringify([insertElementPayload1]),
      }
    );
  });

  const divId1 = extractDivId(Object.values(insertData1)[0]?.element);
  if (!divId1)
    throw new Error("Could not extract div ID 1 from insert element response");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Second widget for group 1 (new addition)
  const insertElementPayload2 = {
    type: "post",
    url: `/pages/${pageId}/insertElement?dm_batchReqId=${generateUniqueId()}`,
    data: {
      markup: `<div class="dmNewParagraph" data-dmtmpl="true" data-element-type="paragraph" data-version="5"><p class="text-align-left m-text-align-center"><span style="display: unset;">Home</span></p></div>`,
      parent: flexWidgetId,
      before: null,
      defaultLocation: false,
    },
  };

  const insertData2 = await withRetry(async () => {
    return fetch(
      `${DUDA_API_CONFIG.baseUrl}/uis/batch?op=create%20widget%20in%20flex&dm_device=desktop&currentEditorPageId=${pageId}`,
      {
        method: "POST",
        headers: getBatchHeaders(alias),
        body: JSON.stringify([insertElementPayload2]),
      }
    );
  });

  const divId2 = extractDivId(Object.values(insertData2)[0]?.element);
  if (!divId2)
    throw new Error("Could not extract div ID 2 from insert element response");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // First widget for group 2
  const insertElementPayload3 = {
    type: "post",
    url: `/pages/${pageId}/insertElement?dm_batchReqId=${generateUniqueId()}`,
    data: {
      markup: `<div class="dmNewParagraph" data-dmtmpl="true" data-element-type="paragraph" data-version="5"><h1><span style="display: unset;">New Title for Section ${
        index + 1
      }</span></h1></div>`,
      parent: flexWidgetId,
      before: null,
      defaultLocation: false,
    },
  };

  const insertData3 = await withRetry(async () => {
    return fetch(
      `${DUDA_API_CONFIG.baseUrl}/uis/batch?op=create%20widget%20in%20flex&dm_device=desktop&currentEditorPageId=${pageId}`,
      {
        method: "POST",
        headers: getBatchHeaders(alias),
        body: JSON.stringify([insertElementPayload3]),
      }
    );
  });

  const divId3 = extractDivId(Object.values(insertData3)[0]?.element);
  if (!divId3)
    throw new Error("Could not extract div ID 3 from insert element response");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Second widget for group 2 (new addition)
  const insertElementPayload4 = {
    type: "post",
    url: `/pages/${pageId}/insertElement?dm_batchReqId=${generateUniqueId()}`,
    data: {
      markup: `<div class="dmNewParagraph" data-dmtmpl="true" data-element-type="paragraph" data-version="5"><p class="text-align-left m-text-align-center"><span style="display: unset;">Additional content for section ${
        index + 1
      }</span></p></div>`,
      parent: flexWidgetId,
      before: null,
      defaultLocation: false,
    },
  };

  const insertData4 = await withRetry(async () => {
    return fetch(
      `${DUDA_API_CONFIG.baseUrl}/uis/batch?op=create%20widget%20in%20flex&dm_device=desktop&currentEditorPageId=${pageId}`,
      {
        method: "POST",
        headers: getBatchHeaders(alias),
        body: JSON.stringify([insertElementPayload4]),
      }
    );
  });

  const divId4 = extractDivId(Object.values(insertData4)[0]?.element);
  if (!divId4)
    throw new Error("Could not extract div ID 4 from insert element response");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { divId1, divId2, divId3, divId4 };
}

async function updateFlexStructure(
  pageId,
  uuid,
  alias,
  section,
  divId1,
  divId2,
  divId3,
  divId4,
  widgetId1,
  widgetId2,
  widgetId3,
  widgetId4
) {
  const flexStructure = {
    elements: {
      [section.sectionId]: {
        children: [section.gridId],
        customClassName: "",
        data: {},
        id: section.sectionId,
        name: "",
        type: "section",
      },
      [section.gridId]: {
        children: [section.parentGroupId],
        customClassName: "",
        data: { "data-layout-grid": "" },
        id: section.gridId,
        name: "",
        parentId: section.sectionId,
        type: "grid",
      },
      [section.parentGroupId]: {
        children: [section.childGroup1Id, section.childGroup2Id],
        customClassName: "",
        data: {},
        id: section.parentGroupId,
        name: "",
        parentId: section.gridId,
        type: "group",
      },
      [section.childGroup1Id]: {
        children: [widgetId1, widgetId3],
        customClassName: "",
        data: {},
        id: section.childGroup1Id,
        name: "",
        parentId: section.parentGroupId,
        type: "group",
      },
      [section.childGroup2Id]: {
        children: [widgetId2, widgetId4],
        customClassName: "",
        data: {},
        id: section.childGroup2Id,
        name: "",
        parentId: section.parentGroupId,
        type: "group",
      },
      [widgetId1]: {
        children: [],
        customClassName: "",
        data: { "data-widget-type": "paragraph" },
        externalId: divId1,
        id: widgetId1,
        name: "Text Block",
        parentId: section.childGroup1Id,
        type: "widget_wrapper",
      },
      [widgetId2]: {
        children: [],
        customClassName: "",
        data: { "data-widget-type": "paragraph" },
        externalId: divId2,
        id: widgetId2,
        name: "Title Block",
        parentId: section.childGroup2Id,
        type: "widget_wrapper",
      },
      [widgetId3]: {
        children: [],
        customClassName: "",
        data: { "data-widget-type": "paragraph" },
        externalId: divId3,
        id: widgetId3,
        name: "Home Link",
        parentId: section.childGroup1Id,
        type: "widget_wrapper",
      },
      [widgetId4]: {
        children: [],
        customClassName: "",
        data: { "data-widget-type": "paragraph" },
        externalId: divId4,
        id: widgetId4,
        name: "Additional Content",
        parentId: section.childGroup2Id,
        type: "widget_wrapper",
      },
    },
    id: section.elementId,
    rootContainerId: section.sectionId,
    section: {
      children: [section.gridId],
      customClassName: "",
      data: {},
      id: section.sectionId,
      name: "",
      prevCustomClassName: "",
      type: "section",
    },
    styles: createStyles(section, widgetId1, widgetId2, widgetId3, widgetId4),
  };
  console.log("Flex Structure Body:", JSON.stringify(flexStructure, null, 2));
  const flexStructurePayload = {
    type: "put",
    url: `/pages/${uuid}/flexStructure?dm_batchReqId=${generateUniqueId()}`,
    data: flexStructure,
  };

  return withRetry(async () => {
    return fetch(
      `${DUDA_API_CONFIG.baseUrl}/uis/batch?op=create%20widget%20in%20flex&dm_device=desktop&currentEditorPageId=${pageId}`,
      {
        method: "POST",
        headers: getBatchHeaders(alias),
        body: JSON.stringify([flexStructurePayload]),
      }
    );
  });
}

function getBatchHeaders(alias) {
  return {
    ...DUDA_API_CONFIG.headers,
    baggage:
      "sentry-environment=direct,sentry-release=production_5561,sentry-public_key=0d2f170da99ddd8d3befc10a7f4ddd29,sentry-trace_id=08cc002eccfc41fe8029be4aa28eb11f,sentry-sampled=true,sentry-sample_rand=0.07692300293224708,sentry-sample_rate=0.1",
    dm_loc: `/home/site/${DUDA_API_CONFIG.siteId}/${alias}`,
    dsid: "1048635",
    origin: "https://my.duda.co",
    priority: "u=1, i",
    referer: `https://my.duda.co/home/site/${DUDA_API_CONFIG.siteId}/${alias}`,
    "sec-ch-ua":
      '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Linux"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sentry-trace": "08cc002eccfc41fe8029be4aa28eb11f-ad7aa87b9748695d-1",
    cookie: DUDA_API_CONFIG.cookies,
  };
}

function createStyles(section, widgetId1, widgetId2, widgetId3, widgetId4) {
  return {
    breakpoints: {
      common: {
        idToRules: {
          [section.gridId]: {
            "<id>": {
              "border-width": "0px",
              "border-color": "rgba(0, 0, 0, 1)",
              "border-style": "solid",
              "background-color": "rgba(0, 0, 0, 0)",
            },
          },
          [section.parentGroupId]: {
            "<id>": {
              "min-height": "222px",
              "column-gap": "3%",
              "row-gap": "18px",
              width: "100%",
              "flex-wrap": "nowrap",
              "max-width": "none",
              padding: "57px 2% 57px 2%",
            },
          },
          [section.childGroup1Id]: {
            "<id>": {
              "min-height": "8px",
              "column-gap": "4%",
              "row-gap": "26px",
              width: "48.5%",
              "align-items": "center",
              "min-width": "4%",
              "background-color": "rgba(0, 0, 0, 0)",
              "flex-wrap": "nowrap",
              padding: "10px 10% 10px 10%",
            },
          },
          [section.childGroup2Id]: {
            "<id>": {
              "min-height": "8px",
              "column-gap": "4%",
              "row-gap": "33px",
              width: "48.5%",
              "min-width": "4%",
              "background-color": "rgba(0, 0, 0, 0)",
              "align-items": "flex-end",
              "flex-wrap": "nowrap",
              padding: "16px 16px 16px 16px",
            },
          },
          "63c7b8b76c596a2813341bc5": {
            "<id>": {
              height: "auto",
            },
          },
          [widgetId1]: {
            "<id>": {
              width: "100%",
              height: "auto",
              "max-width": "100%",
              margin: "0px 0% 0px 0%",
            },
          },
          [widgetId2]: {
            "<id>": {
              width: "100%",
              height: "auto",
              "max-width": "100%",
              margin: "0px 0% 0px 0%",
            },
          },
          [widgetId3]: {
            "<id>": {
              width: "100%",
              height: "auto",
              "max-width": "100%",
              margin: "0px 0% 0px 0%",
            },
          },
          [widgetId4]: {
            "<id>": {
              width: "100%",
              height: "auto",
              "max-width": "100%",
              margin: "0px 0% 0px 0%",
            },
          },
        },
      },
      mobile: {
        idToRules: {
          [section.parentGroupId]: {
            "<id>": {
              "min-height": "unset",
              "flex-direction": "column",
              "padding-left": "4%",
              "padding-right": "4%",
            },
          },
          [section.childGroup1Id]: {
            "<id>": {
              "min-height": "160px",
              "align-items": "center",
              width: "100%",
            },
          },
          [section.childGroup2Id]: {
            "<id>": {
              "min-height": "160px",
              "align-items": "center",
              width: "100%",
            },
          },
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
  };
}

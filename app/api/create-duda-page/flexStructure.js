    import { DUDA_API_CONFIG } from "../../../lib/dudaApi";

export async function getFlexStructure(uuid, alias) {
  const timestamp = Date.now();
  const response = await fetch(
    `${DUDA_API_CONFIG.baseUrl}/uis/pages/${uuid}/flexStructure?&_=${timestamp}`,
    {
      method: "GET",
      headers: {
        ...DUDA_API_CONFIG.headers,
        dm_loc: `/home/site/${DUDA_API_CONFIG.siteId}/${alias}`,
        referer: `https://my.duda.co/home/site/${DUDA_API_CONFIG.siteId}/${alias}`,
        cookie: DUDA_API_CONFIG.cookies
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Flex Structure API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

export function extractHierarchicalIds(flexData) {
  const sections = [];

  if (!flexData) {
    return [{
      elementId: null,
      sectionId: null,
      gridId: null,
      parentGroupId: null,
      childGroup1Id: null,
      childGroup2Id: null,
    }];
  }

  let dataToProcess = [];
  if (Array.isArray(flexData)) {
    dataToProcess = flexData;
  } else if (flexData.elements) {
    dataToProcess = [flexData];
  } else {
    return [{
      elementId: null,
      sectionId: null,
      gridId: null,
      parentGroupId: null,
      childGroup1Id: null,
      childGroup2Id: null,
    }];
  }

  dataToProcess.forEach((item) => {
    if (!item.elements) return;

    const elements = item.elements;
    Object.values(elements).forEach((element) => {
      if (element.type === "section" && !element.parentId) {
        const sectionStructure = {
          elementId: item.id,
          sectionId: element.id,
          gridId: null,
          parentGroupId: null,
          childGroup1Id: null,
          childGroup2Id: null,
        };

        if (element.children && element.children.length > 0) {
          element.children.forEach((childId) => {
            const child = elements[childId];
            if (child && child.type === "grid") {
              sectionStructure.gridId = child.id;

              if (child.children && child.children.length > 0) {
                child.children.forEach((grandChildId) => {
                  const grandChild = elements[grandChildId];
                  if (grandChild && grandChild.type === "group") {
                    sectionStructure.parentGroupId = grandChild.id;

                    if (grandChild.children && grandChild.children.length > 0) {
                      grandChild.children.forEach((greatGrandChildId, index) => {
                        const greatGrandChild = elements[greatGrandChildId];
                        if (greatGrandChild && greatGrandChild.type === "group") {
                          if (index === 0) sectionStructure.childGroup1Id = greatGrandChild.id;
                          else if (index === 1) sectionStructure.childGroup2Id = greatGrandChild.id;
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
  });

  return sections.length > 0 ? sections : [{
    elementId: null,
    sectionId: null,
    gridId: null,
    parentGroupId: null,
    childGroup1Id: null,
    childGroup2Id: null,
  }];
}
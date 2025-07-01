import * as cheerio from "cheerio";

export async function parsePageHtml(alias, extractedIds) {
  const url = `https://my.duda.co/site/41e002a2/${alias}?nee=true&ed=true&showOriginal=true&preview=true&dm_try_mode=true&dm_checkSync=1&dm_device=desktop`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "text/html",
      "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`HTML fetch failed with status: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const matchedSections = [];
  const htmlIds = [];
  const flexWidgetIds = [];

  const flexSections = $("[data-flex-id]");
  if (flexSections.length === 0) {
    return { matchedSections, htmlIds, flexWidgetIds };
  }

  flexSections.each((index, element) => {
    const $element = $(element);
    const flexId = $element.attr("data-flex-id");
    const containerId = $element.attr("id");
    const dudaId = $element.attr("duda_id");

    const matchedSection = extractedIds.find(
      (section) => section.elementId === flexId
    );

    if (matchedSection) {
      const $flexWidgetsContainer = $element.find(".flex-widgets-container");
      let flexWidgetContainerData = null;

      if ($flexWidgetsContainer.length > 0) {
        const flexWidgetId = $flexWidgetsContainer.attr("id");
        const flexWidgetDudaId = $flexWidgetsContainer.attr("duda_id");

        if (flexWidgetId) {
          flexWidgetIds.push(flexWidgetId);
          flexWidgetContainerData = {
            id: flexWidgetId,
            duda_id: flexWidgetDudaId,
          };
        }
      }

      matchedSections.push({
        ...matchedSection,
        htmlContainer: {
          id: containerId,
          duda_id: dudaId,
          flex_id: flexId,
        },
        flexWidgetsContainer: flexWidgetContainerData,
      });

      htmlIds.push(containerId);
    }
  });

  return { matchedSections, htmlIds, flexWidgetIds };
}
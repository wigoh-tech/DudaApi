import * as cheerio from "cheerio";

export async function parseAboutHtmlPage(siteId) {
  try {
    const url = `https://my.duda.co/site/${siteId}/menu?nee=true&ed=true&showOriginal=true&preview=true&dm_try_mode=true&dm_checkSync=1&dm_device=desktop`;

    const headers = {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9",
      priority: "u=0, i",
      referer: `https://my.duda.co/site/${siteId}/menu?nee=true&ed=true&showOriginal=true&preview=true&dm_try_mode=true&dm_checkSync=1&dm_device=desktop`,
      "sec-ch-ua":
        '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "iframe",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
      cookie:
        "_gd_visitor=40d0bd8f-b2b9-4fcf-86ea-2accc484ed78; language=en; landingPage=/login; *fbp=fb.1.1752547231596.871167907101487908; hubspotutk=9af6036ce59b5aa15aa544ef46b86533; account*uuid=41ea951a2a304fa38d59162280dae36b; dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; **zlcmid=1RsneD9izLkntAc; **adroll_fpc=089d3b7c8c30a01d5551acf4c8db604c-1752719288427; *dm*remember_me=MGZ0UVZJNGFVcjhlNUdYVkZpYXB6USUzRCUzRDpWazZ4Q2U0aTVjdDR5WVZ3OExvbzRRJTNEJTNE; first_conversion_source_touchpoints=direct%3B%20127.0.0.1; first_conversion_medium_touchpoints=null%3B%20referral; first_conversion_campaign_touchpoints=null%3B%20null; first_conversion_term_touchpoints=null%3B%20null; first_conversion_content_touchpoints=null%3B%20null; *ce.s=v~8371c5812a5a58ab73d92049be54c44bf1c24111~lcw~1753067721888~vir~returning~lva~1753067721040~vpv~3~v11ls~ef844c70-65e0-11f0-ba1b-bf65481c13f3~v11.cs~268877~v11.s~ef844c70-65e0-11f0-ba1b-bf65481c13f3~v11.vs~8371c5812a5a58ab73d92049be54c44bf1c24111~v11.fsvd~eyJ1cmwiOiJkdWRhLmNvL2xvZ2luL2xvZ2dlZCIsInJlZiI6Imh0dHA6Ly8xMjcuMC4wLjE6NTUwMC8iLCJ1dG0iOltdfQ%3D%3D~v11.sla~1753067721403~gtrk.la~mdcj9bc0~lcw~1753067721889; *gid=GA1.2.838930956.1753670157; __ar_v4=NK6BCP2ZPJC2BEAS7JMXC2%3A20250716%3A3%7C5PYFNWAESVGU5BU47WLRIT%3A20250716%3A3%7CLVLOIN3JF5FT3CD5CBETI7%3A20250716%3A3; __hssrc=1; IR_gbd=duda.co; __hstc=244318362.9af6036ce59b5aa15aa544ef46b86533.1752547233092.1753930911586.1753937164986.75; *gd*session=bb7ea272-bdf6-4eb1-806b-83f9d6b005f4; *dm*account=%7B%22name%22%3A%22misham%40wigoh.ai%22%2C%22uuid%22%3A%2241ea951a2a304fa38d59162280dae36b%22%2C%22gaType%22%3A%22SMB%22%2C%22lastLogin%22%3A1753943496000%7D; JSESSIONID=68F95131182D4C2A96617CD730C86D39; *gcl*au=1.1.186818603.1752547231; *ga=GA1.1.7f612f01-50cb-4193-9e7d-06626bae6887; *conv_v=vi%3A1*sc%3A101*cs%3A1753945077*fs%3A1752547229*pv%3A253*exp%3A%7B%7D*seg%3A%7B%7D*ps%3A1753943500; *conv*s=si%3A101*sh%3A1753945077273-0.5841053410349175*pv%3A1; IR_13628=1753945077318%7C0%7C1753945077318%7C%7C; __hssc=244318362.12.1753937164986; *uetsid=9f5857606b5b11f0beb961f742cadb3f; *uetvid=24df0c103b8511f0b71eb52d29352553; *dm*se_token_me=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50VXVpZCI6IjQxZWE5NTFhMmEzMDRmYTM4ZDU5MTYyMjgwZGFlMzZiIiwiYWNjb3VudE5hbWUiOiJtaXNoYW1Ad2lnb2guYWkiLCJjcmVhdGlvblRpbWUiOjE3NTM5NDYwNDI4ODksImV4cCI6MTc1Mzk0ODQ0Mn0.kuH8OV_-RBgZqwID3O-Z_PAwrays0x6SH3O-M28Rnw8; *ga*GFZCS4CS4Q=GS2.1.s1753928641$o13$g1$t1753946200$j60$l0$h0; AWSALBTG=h3yFwS9xjgCu3esnHvC7v1seVQKoe3vyH+UoNz/qzsfnJatrIRaJj3mYFsY9/wEwtsM/qwRoHSmYpjsax5kOwWqJFR4IaUOGsHjVsljAp7w7u5xT8icIs2Jg26k/Mw79gjwHmj1spNbibYFXCY4/xeVf//cWEbYfMoEFyDDZYdx0BidfFJs=; AWSALB=BycihBzWRmGociznLYchqbQgLmZ/Y1n31TRayswQNK3kXrmDy7eWQel1cAt8C2WBFFgx4Piv2gwdoxft90eR9uU6ywGNk6pVHxLFDqj9AiZ9PRZuT101memXo4T8",
    };

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Parse HTML with Cheerio
    const $ = cheerio.load(html);

    // Find the specific div with id="dm" and class="dmwr"
    const dmDiv = $("div#dm.dmwr");

    if (dmDiv.length === 0) {
      return {
        success: false,
        message: "Target div not found",
        dmDivFound: false,
        dmDivContent: null,
        dmDivHtml: null,
      };
    }

    // Extract the div content and HTML
    const dmDivContent = dmDiv.text().trim();
    const dmDivHtml = dmDiv.html();
    const dmDivOuterHtml = $.html(dmDiv);

    // Extract all elements with IDs from the dm div for matching
    const elementsWithIds = extractElementsWithIds(dmDiv, $);

    return {
      success: true,
      message: "HTML parsed successfully",
      dmDivFound: true,
      dmDivContent,
      dmDivHtml,
      dmDivOuterHtml,
      elementsWithIds,
      dmDivAttributes: {
        id: dmDiv.attr("id"),
        class: dmDiv.attr("class"),
        allAttributes: dmDiv.get(0)?.attribs || {},
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      dmDivFound: false,
      dmDivContent: null,
      dmDivHtml: null,
      error: error.message,
    };
  }
}

// Helper function to extract specific elements from the parsed HTML
export function extractElementsFromHtml(html, selector) {
  try {
    const $ = cheerio.load(html);
    const elements = $(selector);

    const extractedElements = [];
    elements.each((index, element) => {
      const $element = $(element);
      extractedElements.push({
        index,
        tagName: element.tagName,
        text: $element.text().trim(),
        html: $element.html(),
        outerHtml: $.html($element),
        attributes: element.attribs || {},
      });
    });

    return {
      success: true,
      elements: extractedElements,
      count: elements.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      elements: [],
      count: 0,
    };
  }
}

// Extract all elements with IDs from the dm div
function extractElementsWithIds(dmDiv, $) {
  const elementsWithIds = [];

  // Find all elements with ID attributes within the dm div
  dmDiv.find("[id]").each((index, element) => {
    const $element = $(element);
    const id = $element.attr("id");

    if (id) {
      elementsWithIds.push({
        id: id,
        tagName: element.tagName,
        text: $element.text().trim(),
        html: $element.html(),
        outerHtml: $.html($element),
        attributes: element.attribs || {},
        hasInnerContent: !!$element.html(),
      });
    }
  });

  // Also find elements with class attributes that might contain IDs
  dmDiv.find("[class]").each((index, element) => {
    const $element = $(element);
    const className = $element.attr("class");

    if (className) {
      // Check if any class names look like IDs (containing hyphens and alphanumeric)
      const classArray = className.split(" ");
      classArray.forEach((cls) => {
        if (cls.match(/^[a-zA-Z0-9\-_]+$/) && cls.length > 5) {
          elementsWithIds.push({
            id: cls,
            tagName: element.tagName,
            text: $element.text().trim(),
            html: $element.html(),
            outerHtml: $.html($element),
            attributes: element.attribs || {},
            hasInnerContent: !!$element.html(),
            sourceAttribute: "class",
          });
        }
      });
    }
  });

  // Also find elements with data attributes that might contain IDs
  dmDiv.find("[data-widget-id], [data-id]").each((index, element) => {
    const $element = $(element);
    const dataWidgetId = $element.attr("data-widget-id");
    const dataId = $element.attr("data-id");

    if (dataWidgetId) {
      elementsWithIds.push({
        id: dataWidgetId,
        tagName: element.tagName,
        text: $element.text().trim(),
        html: $element.html(),
        outerHtml: $.html($element),
        attributes: element.attribs || {},
        hasInnerContent: !!$element.html(),
        sourceAttribute: "data-widget-id",
      });
    }

    if (dataId) {
      elementsWithIds.push({
        id: dataId,
        tagName: element.tagName,
        text: $element.text().trim(),
        html: $element.html(),
        outerHtml: $.html($element),
        attributes: element.attribs || {},
        hasInnerContent: !!$element.html(),
        sourceAttribute: "data-id",
      });
    }
  });

  // Remove duplicates based on ID
  const uniqueElements = elementsWithIds.filter(
    (element, index, self) =>
      index === self.findIndex((e) => e.id === element.id)
  );

  return uniqueElements;
}

// Match specific widget IDs with elements
export function matchWidgetIdsWithElements(elementsWithIds, widgetIds) {
  const matches = [];

  widgetIds.forEach((widgetId) => {
    const matchingElements = elementsWithIds.filter(
      (element) =>
        element.id === widgetId ||
        element.id.includes(widgetId) ||
        widgetId.includes(element.id)
    );

    if (matchingElements.length > 0) {
      matchingElements.forEach((element) => {
        matches.push({
          widgetId: widgetId,
          element: element,
          matchType: element.id === widgetId ? "exact" : "partial",
          hasInnerContent: element.hasInnerContent,
        });
      });
    }
  });

  return matches;
}

// Get inner content for matched widgets
export function getInnerContentForMatches(matches) {
  return matches.map((match) => {
    return {
      ...match,
      innerContent: match.element.html,
      innerText: match.element.text,
      outerHtml: match.element.outerHtml,
    };
  });
}

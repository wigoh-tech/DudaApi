import * as cheerio from 'cheerio';

export async function parseAboutHtmlPage(siteId) {
  try {
    const url = `https://my.duda.co/site/${siteId}/about?preview=true&nee=true&showOriginal=true&dm_checkSync=1&dm_try_mode=true&t=${Date.now()}&dm_device=desktop`;
    
    const headers = {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-US,en;q=0.9',
      'priority': 'u=0, i',
      'referer': `https://my.duda.co/home/site/${siteId}/about`,
      'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Linux"',
      'sec-fetch-dest': 'iframe',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
      'cookie': '_gd_visitor=40d0bd8f-b2b9-4fcf-86ea-2accc484ed78; *gd*session=a6532a1e-6f40-4528-8b5c-9fe1f84e052b; language=en; landingPage=/login; deviceView=tablet; first_conversion_source_touchpoints=direct; first_conversion_medium_touchpoints=null; first_conversion_campaign_touchpoints=null; first_conversion_term_touchpoints=null; first_conversion_content_touchpoints=null; isFirstSessionVisit=false; IR_gbd=duda.co; cebs=1; *fbp=fb.1.1752547231596.871167907101487908; *ce.clock_data=36%2C49.37.222.125%2C1%2Ccd5d5f3ff8f374827248e13d2f7d64ca%2CChrome%2CIN; **hstc=244318362.9af6036ce59b5aa15aa544ef46b86533.1752547233092.1752547233092.1752547233092.1; hubspotutk=9af6036ce59b5aa15aa544ef46b86533; **hssrc=1; *dm*remember_me=RXlNeEhzbzZkZ1BMemlrRVZ0QVNMZyUzRCUzRDpBWmt0aVV4UnFjckx2bVZSMWtiU2hnJTNEJTNE; account_uuid=41ea951a2a304fa38d59162280dae36b; *dm*account=%7B%22name%22%3A%22misham%40wigoh.ai%22%2C%22uuid%22%3A%2241ea951a2a304fa38d59162280dae36b%22%2C%22gaType%22%3A%22SMB%22%2C%22lastLogin%22%3A1752546354000%7D; dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; *dm*se_token_me=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50VXVpZCI6IjQxZWE5NTFhMmEzMDRmYTM4ZDU5MTYyMjgwZGFlMzZiIiwiYWNjb3VudE5hbWUiOiJtaXNoYW1Ad2lnb2guYWkiLCJjcmVhdGlvblRpbWUiOjE3NTI1NDcyNDk3MDYsImV4cCI6MTc1MjU0OTY0OX0.vZROcswUxbc95kNTS6i0i8WjZ*0pqeYii6euc3RA9I0; convv=vi%3A1sc%3A1cs%3A1752547229fs%3A1752547229pv%3A2exp%3A%7B%7Dseg%3A%7B%7D; convs=sh%3A1752547229346-0.558621426995811si%3A1pv%3A2; cebsp*=2; *ce.s=v~8371c5812a5a58ab73d92049be54c44bf1c24111~lcw~1752547247994~vir~new~lva~1752547231583~vpv~0~v11.cs~268877~v11.s~13b6d9c0-6125-11f0-9f8c-cdb2b9925d08~v11.vs~8371c5812a5a58ab73d92049be54c44bf1c24111~v11.fsvd~eyJ1cmwiOiJkdWRhLmNvL2xvZ2luIiwicmVmIjoiIiwidXRtIjpbXX0%3D~v11.sla~1752547232096~v11ls~13b6d9c0-6125-11f0-9f8c-cdb2b9925d08~gtrk.la~md3xdwiw~lcw~1752547255016; *gid=GA1.2.1356213168.1752547256; **zlcmid=1RsneD9izLkntAc; JSESSIONID=80AA61313903FDD6EA856FCA8B26AD29; **hssc=244318362.4.1752547233092; *gcl*au=1.1.186818603.1752547231; *ga=GA1.1.00fe9c29-e874-42c8-857d-0520be8e1ce0; *uetsid=13233b00612511f0ae71174240b8f124; *uetvid=24df0c103b8511f0b71eb52d29352553; IR*13628=1752547282843%7C0%7C1752547282843%7C%7C; AWSALB=qAu8W4jlKBRzlnGNYFyQfjxfiWIJfi0A6j5DmzPtLGRLNdvR4reHU09BVn0B6en4YpKOk19hzuF7Vm1ATgsw8BLe+cgO8giMOT2HwS2W6EH1Z/zp/vvMzClEuR0H; *ga*GFZCS4CS4Q=GS2.1.s1752547231$o1$g1$t1752547322$j60$l0$h0'
    };
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Parse HTML with Cheerio
    const $ = cheerio.load(html);
    
    // Find the specific div with id="dm" and class="dmwr"
    const dmDiv = $('div#dm.dmwr');
    
    if (dmDiv.length === 0) {
      return {
        success: false,
        message: 'Target div not found',
        dmDivFound: false,
        dmDivContent: null,
        dmDivHtml: null
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
      message: 'HTML parsed successfully',
      dmDivFound: true,
      dmDivContent,
      dmDivHtml,
      dmDivOuterHtml,
      elementsWithIds,
      dmDivAttributes: {
        id: dmDiv.attr('id'),
        class: dmDiv.attr('class'),
        allAttributes: dmDiv.get(0)?.attribs || {}
      }
    };
    
  } catch (error) {
    return {
      success: false,
      message: error.message,
      dmDivFound: false,
      dmDivContent: null,
      dmDivHtml: null,
      error: error.message
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
        attributes: element.attribs || {}
      });
    });
    
    return {
      success: true,
      elements: extractedElements,
      count: elements.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      elements: [],
      count: 0
    };
  }
}

// Extract all elements with IDs from the dm div
function extractElementsWithIds(dmDiv, $) {
  const elementsWithIds = [];
  
  // Find all elements with ID attributes within the dm div
  dmDiv.find('[id]').each((index, element) => {
    const $element = $(element);
    const id = $element.attr('id');
    
    if (id) {
      elementsWithIds.push({
        id: id,
        tagName: element.tagName,
        text: $element.text().trim(),
        html: $element.html(),
        outerHtml: $.html($element),
        attributes: element.attribs || {},
        hasInnerContent: !!$element.html()
      });
    }
  });
  
  // Also find elements with class attributes that might contain IDs
  dmDiv.find('[class]').each((index, element) => {
    const $element = $(element);
    const className = $element.attr('class');
    
    if (className) {
      // Check if any class names look like IDs (containing hyphens and alphanumeric)
      const classArray = className.split(' ');
      classArray.forEach(cls => {
        if (cls.match(/^[a-zA-Z0-9\-_]+$/) && cls.length > 5) {
          elementsWithIds.push({
            id: cls,
            tagName: element.tagName,
            text: $element.text().trim(),
            html: $element.html(),
            outerHtml: $.html($element),
            attributes: element.attribs || {},
            hasInnerContent: !!$element.html(),
            sourceAttribute: 'class'
          });
        }
      });
    }
  });
  
  // Also find elements with data attributes that might contain IDs
  dmDiv.find('[data-widget-id], [data-id]').each((index, element) => {
    const $element = $(element);
    const dataWidgetId = $element.attr('data-widget-id');
    const dataId = $element.attr('data-id');
    
    if (dataWidgetId) {
      elementsWithIds.push({
        id: dataWidgetId,
        tagName: element.tagName,
        text: $element.text().trim(),
        html: $element.html(),
        outerHtml: $.html($element),
        attributes: element.attribs || {},
        hasInnerContent: !!$element.html(),
        sourceAttribute: 'data-widget-id'
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
        sourceAttribute: 'data-id'
      });
    }
  });
  
  // Remove duplicates based on ID
  const uniqueElements = elementsWithIds.filter((element, index, self) =>
    index === self.findIndex(e => e.id === element.id)
  );
  
  return uniqueElements;
}

// Match specific widget IDs with elements
export function matchWidgetIdsWithElements(elementsWithIds, widgetIds) {
  const matches = [];
  
  widgetIds.forEach(widgetId => {
    const matchingElements = elementsWithIds.filter(element => 
      element.id === widgetId || 
      element.id.includes(widgetId) || 
      widgetId.includes(element.id)
    );
    
    if (matchingElements.length > 0) {
      matchingElements.forEach(element => {
        matches.push({
          widgetId: widgetId,
          element: element,
          matchType: element.id === widgetId ? 'exact' : 'partial',
          hasInnerContent: element.hasInnerContent
        });
      });
    }
  });
  
  return matches;
}

// Get inner content for matched widgets
export function getInnerContentForMatches(matches) {
  return matches.map(match => {
    return {
      ...match,
      innerContent: match.element.html,
      innerText: match.element.text,
      outerHtml: match.element.outerHtml
    };
  });
}
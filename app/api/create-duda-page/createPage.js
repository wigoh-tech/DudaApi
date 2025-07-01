import { DUDA_API_CONFIG } from "../../../lib/dudaApi";

export async function createPageFromScratch(body) {
  const { pageTitle = "Empty", pageUrl, templateName } = body;
  
  const response = await fetch(
    `${DUDA_API_CONFIG.baseUrl}/uis/sites/1048635/createpagefromscratch`,
    {
      method: "POST",
      headers: {
        ...DUDA_API_CONFIG.headers,
        referer: `https://my.duda.co/home/site/${DUDA_API_CONFIG.siteId}/home`,
        cookie: DUDA_API_CONFIG.cookies
      },
      body: JSON.stringify({
        addToNav: true,
        dontMobilize: false,
        pageUrl: pageUrl || "http://bfs._dudamobile.com",
        templateName: templateName || DUDA_API_CONFIG.DEFAULT_TEMPLATE,
        dynamicPageCreate: {},
        pageTitle: pageTitle,
        suggestedAlias: pageTitle.toLowerCase().replace(/\s+/g, "-"),
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Duda API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}
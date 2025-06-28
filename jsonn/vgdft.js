import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('API route hit successfully');
    console.log('Request body:', body);
    
    const { pageTitle = 'Empty', pageUrl, templateName } = body;

    const response = await fetch('https://my.duda.co/api/uis/sites/1048635/createpagefromscratch', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'origin': 'https://my.duda.co',
        'referer': 'https://my.duda.co/home/site/41e002a2/home',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest',
        'cookie': '_fbp=fb.1.1748410352276.947939578829518178; hubspotutk=c5a494184d4e2afcd3e531233734eb58; _dm_ga_clientId=b2dba1c7-396b-458f-8a0f-deb72154dbcb; language=en; landingPage=/signup; accountId=794969; accountUuid=41ea951a2a304fa38d59162280dae36b; productUuid=52a9926b5dc94de688c1571d574ff75a; IR_PI=07615b33-3bb7-11f0-9b80-bd4b936f5cf7%7C1748431762162; account_uuid=41ea951a2a304fa38d59162280dae36b; dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; _gd_visitor=48c47a36-fbad-4877-8795-865d3648ff99; _gd_svisitor=95d70b17b5203c002668f367c2010000883e0100; __zlcmid=1RsneD9izLkntAc; __adroll_fpc=c54f649a952dbe827da56df24d8c71a5-1748431859407; _dm_remember_me=VlRyWmdyZHdiJTJCYldvY2l6cUlxc3FnJTNEJTNEOkVkUWZRdnppYlpSJTJGYUlRRU9TcWtadyUzRCUzRA; deviceView=desktop; isFirstSessionVisit=false; JSESSIONID=A142AD25210197C72AD3879535A403C0'
      },
      body: JSON.stringify({
        'addToNav': true,
        'dontMobilize': false,
        'pageUrl': pageUrl || 'http://bfs._dudamobile.com',
        'templateName': templateName || '876004f8b5a14e25883e6e0af818572d~home',
        'dynamicPageCreate': {},
        'pageTitle': pageTitle,
        'suggestedAlias': pageTitle.toLowerCase().replace(/\s+/g, '-')
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Duda API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      throw new Error(`Duda API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Full Duda API Response:', JSON.stringify(data, null, 2));
    
    // Extract page ID from response - check common possible locations
    let pageId = null;
    if (data.pageId) {
      pageId = data.pageId;
    } else if (data.id) {
      pageId = data.id;
    } else if (data.page && data.page.id) {
      pageId = data.page.id;
    } else if (data.result && data.result.pageId) {
      pageId = data.result.pageId;
    } else if (data.data && data.data.pageId) {
      pageId = data.data.pageId;
    }
    
    console.log('Extracted Page ID:', pageId);
    
    return NextResponse.json({
      success: true,
      data: {
        ...data,
        pageId: pageId // Ensure pageId is at the top level of our response
      }
    });

  } catch (error) {
    console.error('Error creating Duda page:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
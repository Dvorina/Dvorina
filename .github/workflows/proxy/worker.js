export default {
  async fetch(request) {
    const url = new URL(request.url);
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    };
    if(request.method === 'OPTIONS') {
      return new Response(null, {headers: cors});
    }
    if(url.pathname.startsWith('/lpis')){
      const r = await fetch(
        'https://zbgis.skgeodesy.sk/mkzbgis/sk/ows?' + url.searchParams.toString(),
        {headers: {'Referer':'https://zbgis.skgeodesy.sk/','User-Agent':'Mozilla/5.0'}}
      );
      return new Response(await r.arrayBuffer(), {
        headers: {...cors, 'Content-Type': r.headers.get('Content-Type') || 'image/png'}
      });
    }
    if(url.pathname.startsWith('/overpass')){
      const r = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: await request.text()
      });
      return new Response(await r.text(), {
        headers: {...cors, 'Content-Type': 'application/json'}
      });
    }
    return new Response(JSON.stringify({status:'ok'}), {
      headers: {...cors, 'Content-Type': 'application/json'}
    });
  }
};

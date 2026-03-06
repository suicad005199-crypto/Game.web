export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  // 參數解析
  const category = url.searchParams.get('category');
  const sort = url.searchParams.get('sort') || 'default';
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 12;
  const offset = (page - 1) * limit;

  let queryUrl = `${env.SUPABASE_URL}/rest/v1/games?is_published=eq.true&select=*`;
  if (category) queryUrl += `&category=eq.${category}`;

  // 排序處理
  if (sort === 'popular') queryUrl += `&order=click_count.desc`;
  else if (sort === 'latest') queryUrl += `&order=created_at.desc`;
  else queryUrl += `&order=sort_order.asc`;

  queryUrl += `&offset=${offset}&limit=${limit}`;

  const res = await fetch(queryUrl, {
    headers: {
      "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
    }
  });
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=120" // Edge Cache 120s
    }
  });
}

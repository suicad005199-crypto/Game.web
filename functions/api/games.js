export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // 1. 檢查快取 (TTL 120s)
  const cache = caches.default;
  let response = await cache.match(request);
  if (response) {
    return response;
  }

  // 2. 解析參數
  const category = url.searchParams.get('category');
  const sort = url.searchParams.get('sort');
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = Math.min(parseInt(url.searchParams.get('limit')) || 12, 50);
  const offset = (page - 1) * limit;

  // 3. 組合 Supabase 查詢
  let apiUrl = new URL(`${env.SUPABASE_URL}/rest/v1/games`);
  apiUrl.searchParams.append('is_published', 'eq.true');
  apiUrl.searchParams.append('select', 'slug,title,description,cover_image_url,tags');
  apiUrl.searchParams.append('limit', limit.toString());
  apiUrl.searchParams.append('offset', offset.toString());

  if (category) {
    apiUrl.searchParams.append('category', `eq.${category}`);
  }

  if (sort === 'popular') {
    apiUrl.searchParams.append('order', 'click_count.desc');
  } else if (sort === 'latest') {
    apiUrl.searchParams.append('order', 'created_at.desc');
  } else {
    apiUrl.searchParams.append('order', 'sort_order.asc');
  }

  // 4. 呼叫資料庫 (使用 Service Role Key)
  const dbRes = await fetch(apiUrl.toString(), {
    headers: {
      'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
    }
  });

  if (!dbRes.ok) {
    return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
  }

  const data = await dbRes.json();

  // 5. 建立回應並寫入快取
  response = new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=120'
    }
  });

  context.waitUntil(cache.put(request, response.clone()));
  return response;
}

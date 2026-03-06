export async function onRequestGet(context) {
  const { env, request } = context;
  const slug = new URL(request.url).searchParams.get('slug');

  if (!slug) return new Response("Missing slug", { status: 400 });

  // 1. 查詢遊戲網址
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/games?slug=eq.${slug}&is_published=eq.true&select=target_url,click_count`, {
    headers: {
      "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
    }
  });
  const data = await res.json();

  if (!data.length) return new Response("Not Found", { status: 404 });

  // 2. 更新統計 (背景執行不阻塞)
  context.waitUntil(
    fetch(`${env.SUPABASE_URL}/rest/v1/games?slug=eq.${slug}`, {
      method: "PATCH",
      headers: {
        "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        click_count: (data[0].click_count || 0) + 1,
        last_clicked_at: new Date().toISOString()
      })
    })
  );

  return new Response(JSON.stringify({ url: data[0].target_url }), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  // 1. 取得目標網址
  const res = await fetch(
    `${supabaseUrl}/rest/v1/games?slug=eq.${slug}&is_published=eq.true&select=id,target_url,click_count`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );

  const data = await res.json();

  if (!data || data.length === 0) {
    return new Response("Game not found or unpublished", { status: 404 });
  }

  const game = data[0];

  // 2. 更新點擊數 (非阻塞寫入)
  context.waitUntil(
    fetch(`${supabaseUrl}/rest/v1/games?id=eq.${game.id}`, {
      method: "PATCH",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        click_count: (game.click_count || 0) + 1,
        last_clicked_at: new Date().toISOString(),
      }),
    })
  );

  // 3. 302 跳轉
  return Response.redirect(game.target_url, 302);
}

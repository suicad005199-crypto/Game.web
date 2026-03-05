export async function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url);
  const slug = searchParams.get('slug');
  const { env } = context;

  if (!slug) return new Response(JSON.stringify({ error: "Missing slug" }), { status: 400 });

  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/games?slug=eq.${slug}&select=target_url`, {
      headers: { "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}` }
    });
    const data = await res.json();
    
    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ error: "Game not found" }), { status: 404 });
    }

    // 紀錄點擊時間 (不阻塞執行)
    context.waitUntil(
      fetch(`${supabaseUrl}/rest/v1/games?slug=eq.${slug}`, {
        method: "PATCH",
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({ last_clicked_at: new Date().toISOString() })
      })
    );

    // 回傳網址給前端
    return new Response(JSON.stringify({ url: data[0].target_url }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
  }
}

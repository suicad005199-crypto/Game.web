export async function onRequest(context) {
    const { env, request } = context;
    const slug = new URL(request.url).searchParams.get('slug');
    if (!slug) return new Response("Missing slug", { status: 400 });

    // 1. 取得目標網址
    const getRes = await fetch(`${env.SUPABASE_URL}/rest/v1/games?select=target_url&slug=eq.${slug}`, {
        headers: { "apikey": env.SUPABASE_SERVICE_ROLE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` }
    });
    const games = await getRes.json();
    if (!games.length) return new Response("Game not found", { status: 404 });

    // 2. 增加點擊數 (背景執行，不阻塞跳轉)
    context.waitUntil(fetch(`${env.SUPABASE_URL}/rest/v1/rpc/increment_click`, {
        method: 'POST',
        headers: { "Content-Type": "application/json", "apikey": env.SUPABASE_SERVICE_ROLE_KEY },
        body: JSON.stringify({ game_slug: slug })
    }).catch(console.error));

    return Response.redirect(games[0].target_url, 302);
}

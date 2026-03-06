export async function onRequest(context) {
    const { env, request } = context;
    const slug = new URL(request.url).searchParams.get('slug');
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/games?select=target_url&slug=eq.${slug}`, {
        headers: { "apikey": env.SUPABASE_SERVICE_ROLE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` }
    });
    const data = await res.json();
    if (!data.length) return new Response("Game Not Found", { status: 404 });

    // 異步增加點擊數
    context.waitUntil(fetch(`${env.SUPABASE_URL}/rest/v1/rpc/increment_click`, {
        method: 'POST',
        headers: { "Content-Type": "application/json", "apikey": env.SUPABASE_SERVICE_ROLE_KEY },
        body: JSON.stringify({ game_slug: slug })
    }));

    return Response.redirect(data[0].target_url, 302);
}

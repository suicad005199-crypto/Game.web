export async function onRequestGet(context) {
    const { env, request } = context;
    const slug = new URL(request.url).searchParams.get('slug');
    if (!slug) return new Response("Missing slug", { status: 400 });

    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/games?slug=eq.${slug}&is_published=eq.true&select=target_url,click_count`, {
        headers: { "apikey": env.SUPABASE_SERVICE_ROLE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` }
    });
    const data = await res.json();
    if (!data.length) return new Response("Not Found", { status: 404 });

    // 背景更新點擊數
    context.waitUntil(fetch(`${env.SUPABASE_URL}/rest/v1/games?slug=eq.${slug}`, {
        method: "PATCH",
        headers: { "apikey": env.SUPABASE_SERVICE_ROLE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ click_count: (data[0].click_count || 0) + 1 })
    }));

    return new Response(JSON.stringify({ url: data[0].target_url }), { headers: { "Content-Type": "application/json" } });
}

export async function onRequest(context) {
    const { env, request } = context;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';

    let url = `${env.SUPABASE_URL}/rest/v1/games?select=*&is_published=eq.true&order=sort_order.asc`;
    if (category !== 'all') url += `&category=eq.${category}`;

    const res = await fetch(url, {
        headers: { "apikey": env.SUPABASE_SERVICE_ROLE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` }
    });
    return new Response(await res.text(), {
        headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=120" }
    });
}

export async function onRequest(context) {
    const { env } = context;
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/games?is_published=eq.true&order=sort_order.asc`, {
        headers: { "apikey": env.SUPABASE_SERVICE_ROLE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` }
    });
    return new Response(await res.text(), { headers: { "Content-Type": "application/json" } });
}

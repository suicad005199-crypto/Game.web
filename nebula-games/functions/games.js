export async function onRequest(context) {
    const { env, request } = context;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';

    let supabaseUrl = `${env.SUPABASE_URL}/rest/v1/games?select=*&is_published=eq.true&order=sort_order.asc`;
    if (category !== 'all') {
        supabaseUrl += `&category=eq.${category}`;
    }

    const res = await fetch(supabaseUrl, {
        headers: {
            "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
        }
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
        headers: { 
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=120" // 快取 120 秒
        }
    });
}

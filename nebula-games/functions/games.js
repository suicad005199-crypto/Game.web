export async function onRequestGet(context) {
    const { env, request } = context;
    const cat = new URL(request.url).searchParams.get('category') || 'all';
    let url = `${env.SUPABASE_URL}/rest/v1/games?is_published=eq.true&select=*`;
    
    if (cat !== 'all') url += `&category=eq.${cat}`;

    const res = await fetch(url, {
        headers: { "apikey": env.SUPABASE_SERVICE_ROLE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` }
    });
    return new Response(await res.text(), { 
        headers: { "Content-Type": "application/json", "Cache-Control": "public, s-maxage=120" } 
    });
}

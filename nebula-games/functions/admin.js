export async function onRequest(context) {
    const { env, request } = context;
    // 實務上需驗證 Admin Token，此處為簡化版接口
    if (request.method !== 'POST') return new Response("Method not allowed", { status: 405 });
    
    const body = await request.json();
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/games`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
            "Prefer": "return=representation"
        },
        body: JSON.stringify(body)
    });
    return new Response(await res.text(), { headers: { "Content-Type": "application/json" } });
}

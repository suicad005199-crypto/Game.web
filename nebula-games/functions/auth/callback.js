export async function onRequestGet(context) {
    const { env, request } = context;
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const guestId = url.searchParams.get('state');

    // 實務上需向 LINE API 換取 Token 與 Profile。此處以 Mock 資料示意流程：
    const profile = { userId: `U${Math.random().toString(36).substring(7)}`, displayName: "LINE Player", pictureUrl: "" };

    let supabaseUrl = `${env.SUPABASE_URL}/rest/v1/users`;
    let method = 'POST';
    
    if (guestId && guestId !== 'login') {
        supabaseUrl += `?id=eq.${guestId}`;
        method = 'PATCH';
    }

    await fetch(supabaseUrl, {
        method,
        headers: { "apikey": env.SUPABASE_SERVICE_ROLE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json", "Prefer": "resolution=merge-duplicates" },
        body: JSON.stringify({ line_uid: profile.userId, display_name: profile.displayName, picture_url: profile.pictureUrl, is_guest: false })
    });

    // 檢查管理員權限
    const adminRes = await fetch(`${env.SUPABASE_URL}/rest/v1/admin_whitelist?line_uid=eq.${profile.userId}`, { 
        headers: { 'apikey': env.SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } 
    });
    const isAdmin = (await adminRes.json()).length > 0;

    const session = btoa(JSON.stringify({ uid: profile.userId, name: profile.displayName, pic: profile.pictureUrl, role: isAdmin ? 'admin' : 'user', exp: Math.floor(Date.now() / 1000) + 604800 }));
    
    return new Response(null, { 
        status: 302, 
        headers: { "Location": "/game/index.html", "Set-Cookie": `session=${session}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800` } 
    });
}

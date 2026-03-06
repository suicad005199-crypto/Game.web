export async function onRequestGet(context) {
    const { env, request } = context;
    const code = new URL(request.url).searchParams.get('code');
    const state = new URL(request.url).searchParams.get('state'); // 這裡放舊的 Guest ID

    // 1. 交換 LINE Token (簡略流程)
    const lineProfile = { userId: "L123", displayName: "Adam", pictureUrl: "https://..." };

    // 2. 更新或創建用戶 (若是 state 存在則為升級)
    const payload = {
        line_uid: lineProfile.userId,
        display_name: lineProfile.displayName,
        picture_url: lineProfile.pictureUrl,
        is_guest: false
    };

    const method = state ? 'PATCH' : 'POST';
    const query = state ? `?id=eq.${state}` : '';

    await fetch(`${env.SUPABASE_URL}/rest/v1/users${query}`, {
        method,
        headers: { 
            "apikey": env.SUPABASE_SERVICE_ROLE_KEY, 
            "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload)
    });

    // 3. 簽發 Session
    const session = btoa(JSON.stringify({ uid: lineProfile.userId, pic: lineProfile.pictureUrl, name: lineProfile.displayName }));
    return new Response(null, {
        status: 302,
        headers: { 
            "Location": "/", 
            "Set-Cookie": `session=${session}; Path=/; HttpOnly; Secure; Max-Age=604800` 
        }
    });
}

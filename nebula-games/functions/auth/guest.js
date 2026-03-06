export async function onRequestPost(context) {
    const { env } = context;
    const guestId = crypto.randomUUID();
    
    await fetch(`${env.SUPABASE_URL}/rest/v1/users`, {
        method: 'POST',
        headers: { "apikey": env.SUPABASE_SERVICE_ROLE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ id: guestId, is_guest: true, display_name: "Guest" })
    });

    const session = btoa(JSON.stringify({ uid: guestId, is_guest: true, role: 'user', exp: Math.floor(Date.now() / 1000) + 604800 }));
    return new Response("OK", { 
        headers: { "Set-Cookie": `session=${session}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800` } 
    });
}

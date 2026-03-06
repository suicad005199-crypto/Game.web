// functions/auth/callback.js
export async function onRequest(context) {
    return new Response("LINE OAuth Callback API 預留位置", { status: 200 });
}

// functions/auth/guest.js
export async function onRequest(context) {
    return new Response(JSON.stringify({ token: "guest_token_123", role: "guest" }), { 
        headers: { "Content-Type": "application/json" } 
    });
}

export async function onRequest(context) {
    // 這裡處理 Google OAuth 回傳的 code 並更新 Supabase 中的 email
    return new Response(JSON.stringify({ message: "Google 綁定 API 運作中" }), { headers: { "Content-Type": "application/json" } });
}

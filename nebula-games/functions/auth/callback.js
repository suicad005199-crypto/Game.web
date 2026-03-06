export async function onRequest(context) {
    const { env, request } = context;
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
        return new Response("未取得授權碼", { status: 400 });
    }

    // 預留：此處未來將加入 fetch('https://api.line.me/oauth2/v2.1/token') 的邏輯
    return new Response(JSON.stringify({
        message: "星雲娛樂城：LINE 授權成功",
        auth_code: code,
        status: "pending_exchange"
    }), { 
        headers: { "Content-Type": "application/json;charset=UTF-8" } 
    });
}

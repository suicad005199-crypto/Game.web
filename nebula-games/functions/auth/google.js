export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const userId = url.searchParams.get('state'); // 傳入目前的訪客 ID

  if (!code) return new Response("Missing code", { status: 400 });

  // 1. 交換 Google Token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `https://${url.hostname}/api/auth/google`,
      grant_type: 'authorization_code'
    })
  });
  const tokens = await tokenResponse.json();

  // 2. 取得 Google 用戶資料
  const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  });
  const profile = await userRes.json();

  // 3. 更新 Supabase 帳號綁定 (綁定 Email 並取消訪客狀態)
  const updateRes = await fetch(`${env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
    method: 'PATCH',
    headers: {
      'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: profile.email,
      display_name: profile.name,
      picture_url: profile.picture,
      is_guest: false
    })
  });

  return Response.redirect(`https://${url.hostname}/game/index.html?status=success`, 302);
}

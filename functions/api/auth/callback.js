export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  // 若有 guest_id，代表是 Guest 升級
  const guestId = url.searchParams.get('state'); 

  // 1. 換取 LINE Token 與 Profile (略過標準 Fetch 細節)
  const profile = { userId: "LINE_UID", displayName: "Name", pictureUrl: "URL" }; // 模擬取得資料

  // 2. 判斷是否為 Guest 升級
  let supabaseQuery;
  if (guestId && guestId !== 'login') {
    // 將原有 Guest 綁定 LINE
    supabaseQuery = fetch(`${env.SUPABASE_URL}/rest/v1/users?id=eq.${guestId}`, {
      method: 'PATCH',
      headers: { 'apikey': env.SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ line_uid: profile.userId, display_name: profile.displayName, picture_url: profile.pictureUrl, is_guest: false })
    });
  } else {
    // 一般登入 (Upsert)
    supabaseQuery = fetch(`${env.SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: { 'apikey': env.SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify({ line_uid: profile.userId, display_name: profile.displayName, picture_url: profile.pictureUrl, is_guest: false })
    });
  }
  await supabaseQuery;

  // 3. 檢查是否為管理員
  const adminCheck = await fetch(`${env.SUPABASE_URL}/rest/v1/admin_whitelist?line_uid=eq.${profile.userId}&select=line_uid`, {
    headers: { 'apikey': env.SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` }
  });
  const isAdmin = (await adminCheck.json()).length > 0;

  // 4. 發放 JWT Cookie
  const payload = btoa(JSON.stringify({ uid: profile.userId, role: isAdmin ? 'admin' : 'user', exp: Math.floor(Date.now() / 1000) + 604800 }));
  return new Response(null, { status: 302, headers: { 'Location': '/', 'Set-Cookie': `session=${payload}; Path=/; HttpOnly; Secure` } });
}

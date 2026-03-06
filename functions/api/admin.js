export async function onRequest(context) {
  const { env, request } = context;
  const cookie = request.headers.get('Cookie') || '';
  
  // 1. 驗證 Admin 權限
  if (!cookie.includes('session=')) return new Response('Unauthorized', { status: 401 });
  const token = cookie.split('session=')[1].split(';')[0];
  const payload = JSON.parse(atob(token));
  if (payload.role !== 'admin') return new Response('Forbidden', { status: 403 });

  // 2. 處理 CRUD
  if (request.method === 'POST') {
    const data = await request.json();
    await fetch(`${env.SUPABASE_URL}/rest/v1/games`, {
      method: 'POST',
      headers: { 'apikey': env.SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify(data) // 包含 is_published, slug 等
    });
    return new Response('Success');
  }
}

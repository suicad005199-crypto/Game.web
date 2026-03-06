export async function onRequest(context) {
    const { env, request } = context;
    const cookie = request.headers.get('Cookie') || '';
    if (!cookie.includes('session=')) return new Response('Unauthorized', { status: 401 });
    
    const token = cookie.split('session=')[1].split(';')[0];
    const payload = JSON.parse(atob(token));
    if (payload.role !== 'admin') return new Response('Forbidden', { status: 403 });

    if (request.method === 'POST' || request.method === 'PATCH') {
        const data = await request.json();
        const url = request.method === 'PATCH' ? `${env.SUPABASE_URL}/rest/v1/games?id=eq.${data.id}` : `${env.SUPABASE_URL}/rest/v1/games`;
        
        await fetch(url, {
            method: request.method,
            headers: { 'apikey': env.SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return new Response('Success');
    }
    return new Response('Method Not Allowed', { status: 405 });
}

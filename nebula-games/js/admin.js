document.addEventListener('DOMContentLoaded', async () => {
    const user = Auth.getUser();
    if (!user || user.role !== 'admin') return document.body.innerHTML = '<h2>權限不足</h2>';
    
    const res = await fetch('/games'); // 對應 functions/games.js
    const games = await res.json();
    
    document.getElementById('admin-panel').innerHTML = games.map(g => `
        <div style="background:#1a1a1a; padding:10px; margin-bottom:10px; border-radius:8px;">
            <span>${g.title} (${g.category})</span>
            <button onclick="togglePublish('${g.id}', ${!g.is_published})">${g.is_published ? '下架' : '發布'}</button>
        </div>
    `).join('');
});

async function togglePublish(id, status) {
    await fetch('/admin', { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ id, is_published: status }) 
    });
    location.reload();
}

document.getElementById('addGameForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        slug: document.getElementById('slug').value,
        title: document.getElementById('title').value,
        target_url: document.getElementById('target_url').value,
        is_published: true
    };
    try {
        const res = await fetch('/api/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if(res.ok) { alert('新增成功！'); e.target.reset(); }
    } catch(err) { alert('新增失敗'); }
});

async function fetchGames(category = 'all') {
    const grid = document.getElementById('game-grid');
    if (!grid) return;
    grid.innerHTML = '<p>載入中...</p>';

    try {
        const res = await fetch(`/api/games?category=${category}`);
        const games = await res.json();
        if (!games || !games.length) {
            grid.innerHTML = '<p>目前尚無遊戲</p>';
            return;
        }
        grid.innerHTML = games.map(g => `
            <div class="card" onclick="window.location.href='/api/go?slug=${g.slug}'">
                <img src="${g.cover_image_url || '../images/Baccarist.jpg'}" alt="${g.title}">
                <h3>${g.title}</h3>
            </div>
        `).join('');
    } catch (err) {
        grid.innerHTML = '<p>系統連線失敗</p>';
    }
}
document.addEventListener('DOMContentLoaded', () => fetchGames());

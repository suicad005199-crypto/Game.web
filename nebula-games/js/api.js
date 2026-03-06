async function fetchGames(category = 'all') {
    const grid = document.getElementById('game-grid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading">正在連線至星雲伺服器...</div>';

    try {
        const res = await fetch(`/api/games?category=${category}`);
        const games = await res.json();

        if (!games || games.length === 0) {
            grid.innerHTML = '<div class="empty">暫無上架遊戲，請聯繫客服</div>';
            return;
        }

        grid.innerHTML = games.map(g => `
            <div class="game-card" onclick="playGame('${g.slug}')">
                <div class="badge">${g.category.toUpperCase()}</div>
                <img src="${g.cover_image_url || '../images/default.png'}" alt="${g.title}">
                <div class="card-info">
                    <h3>${g.title}</h3>
                    <div class="play-btn">立即開始</div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        grid.innerHTML = '<div class="error">系統維護中，請稍後再試</div>';
    }
}

function playGame(slug) {
    // 使用 API 跳轉以確保點擊統計生效，並解決 Safari 彈窗攔截問題
    window.location.href = `/api/go?slug=${slug}`;
}

document.addEventListener('DOMContentLoaded', () => fetchGames());

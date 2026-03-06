async function fetchGames(category = 'all') {
    const grid = document.getElementById('game-grid');
    if (!grid) return;
    grid.innerHTML = '載入中...';
    
    const res = await fetch(`/games?category=${category}`); // 對應 functions/games.js
    const games = await res.json();
    
    grid.innerHTML = games.map(g => `
        <div class="card" onclick="playGame('${g.slug}')">
            <h3 style="color:#FFD700; margin:0 0 10px 0;">${g.title}</h3>
            <span style="font-size:12px; color:#888;">點擊開始</span>
        </div>
    `).join('');
}

async function playGame(slug) {
    const newWin = window.open('', '_blank');
    const res = await fetch(`/go?slug=${slug}`); // 對應 functions/go.js
    const data = await res.json();
    if (data.url) newWin.location.href = data.url;
    else newWin.close();
}

document.addEventListener('DOMContentLoaded', () => fetchGames());

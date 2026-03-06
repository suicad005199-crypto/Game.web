async function fetchGames(category = 'all') {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = '載入中...';
    const res = await fetch(`/api/games?category=${category}`);
    const games = await res.json();
    grid.innerHTML = games.map(g => `
        <div class="card" onclick="playGame('${g.slug}')">
            <img src="${g.cover_image_url}" loading="lazy">
            <div class="card-info">
                <div style="color:var(--gold);font-size:14px;">${g.title}</div>
            </div>
        </div>
    `).join('');
}

async function playGame(slug) {
    const newWin = window.open('', '_blank');
    const res = await fetch(`/api/go?slug=${slug}`);
    const data = await res.json();
    if (data.url) newWin.location.href = data.url;
    else newWin.close();
}
fetchGames();

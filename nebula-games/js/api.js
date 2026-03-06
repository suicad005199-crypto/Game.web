async function loadGames() {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = '<p>遊戲加載中...</p>';
    try {
        const res = await fetch('/api/games');
        const games = await res.json();
        grid.innerHTML = games.map(g => `
            <div class="game-card" onclick="location.href='/api/go?slug=${g.slug}'">
                <img src="${g.cover_image_url || '../images/Baccarist.jpg'}" alt="${g.title}">
                <h3>${g.title}</h3>
                <div class="btn">立即玩</div>
            </div>
        `).join('');
    } catch (e) {
        grid.innerHTML = '<p>連線失敗，請檢查網路</p>';
    }
}
document.addEventListener('DOMContentLoaded', loadGames);

async function loadLobby() {
    const grid = document.getElementById('game-grid');
    try {
        const res = await fetch('/api/games');
        const data = await res.json();
        grid.innerHTML = data.length ? data.map(g => `
            <div class="card" onclick="location.href='/api/go?slug=${g.slug}'">
                <img src="${g.cover_image_url || '../images/Baccarist.jpg'}">
                <p>${g.title}</p>
            </div>`).join('') : '<p>籌備中，敬請期待</p>';
    } catch (e) { grid.innerHTML = '連線失敗'; }
}
document.addEventListener('DOMContentLoaded', loadLobby);

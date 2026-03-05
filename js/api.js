document.addEventListener("DOMContentLoaded", () => {
    fetchGames();
});

async function fetchGames(category = '', sort = 'default') {
    const container = document.getElementById('game-container');
    
    try {
        let url = `/api/games?limit=20`;
        if (category) url += `&category=${category}`;
        if (sort !== 'default') url += `&sort=${sort}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('API request failed');
        
        const games = await response.json();
        renderGames(games);
    } catch (error) {
        console.error("Error fetching games:", error);
        container.innerHTML = `<p style="text-align:center; grid-column:1/-1; color:#AAA;">無法載入遊戲列表，請稍後再試。</p>`;
    }
}

function renderGames(games) {
    const container = document.getElementById('game-container');
    container.innerHTML = games.map(game => `
        <a href="/api/go?slug=${game.slug}" class="game-card">
            <img src="${game.cover_image_url || 'images/default.jpg'}" class="card-image" loading="lazy" alt="${game.title}">
            <div class="card-info">
                <span class="card-title">${game.title}</span>
                <span class="card-desc">${game.description || ''}</span>
            </div>
        </a>
    `).join('');
}

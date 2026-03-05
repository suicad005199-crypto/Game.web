document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('game-grid');

  try {
    const res = await fetch('/api/games');
    const games = await res.json();
    
    grid.innerHTML = games.map(game => `
      <div class="card" onclick="playGame('${game.slug}')">
        <img src="${game.cover_image_url}" alt="${game.title}" loading="lazy">
        <div class="card-info">
          <h3 class="card-title">${game.title}</h3>
          <p class="card-desc">${game.description || ''}</p>
        </div>
      </div>
    `).join('');
  } catch (err) {
    grid.innerHTML = '<div class="loading">載入失敗，請重新整理。</div>';
  }
});

// 處理點擊與開新分頁
async function playGame(slug) {
  try {
    const res = await fetch(`/api/go?slug=${slug}`);
    const data = await res.json();
    
    if (data.url) {
      window.open(data.url, '_blank'); // 核心解法：強制在當前瀏覽器開新分頁
    } else {
      alert('無法取得遊戲連結');
    }
  } catch (err) {
    alert('連線錯誤，請重試');
  }
}

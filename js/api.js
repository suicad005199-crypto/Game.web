document.addEventListener('DOMContentLoaded', fetchGames);

async function fetchGames() {
  const grid = document.getElementById('game-grid');
  try {
    const res = await fetch('/api/games');
    const games = await res.json();
    grid.innerHTML = games.map(g => `
      <div class="card" onclick="playGame('${g.slug}')">
        <img src="${g.cover_image_url || '/images/icon-512.png'}" alt="${g.title}">
        <div class="card-info">
          <h3 class="card-title">${g.title}</h3>
          <p class="card-desc">${g.description || ''}</p>
        </div>
      </div>
    `).join('');
  } catch (e) {
    grid.innerHTML = '<p style="text-align:center">系統維護中</p>';
  }
}

// 核心：Safari 兼容跳轉
async function playGame(slug) {
  // 1. 瞬間開啟空白分頁，繞過 iOS 攔截
  const newWin = window.open('', '_blank');
  
  try {
    const res = await fetch(`/api/go?slug=${slug}`);
    const data = await res.json();
    
    if (data.url) {
      // 2. 注入真實 URL
      newWin.location.href = data.url;
    } else {
      newWin.close();
      alert('遊戲暫不可用');
    }
  } catch (e) {
    newWin.close();
    alert('連線失敗');
  }
}

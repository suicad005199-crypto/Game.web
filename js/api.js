document.addEventListener('DOMContentLoaded', () => {
  fetchGames(); // 初始載入全部遊戲

  // 綁定側邊欄開關
  const menuBtn = document.getElementById('menu-btn');
  const closeBtn = document.getElementById('close-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  const toggleMenu = () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
  };

  menuBtn.addEventListener('click', toggleMenu);
  closeBtn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  // 綁定登入按鈕 (預留串接)
  document.getElementById('login-btn').addEventListener('click', () => {
    alert('即將開放 LINE / Google 登入功能！');
  });
});

// 抓取遊戲清單 (支援分類過濾)
async function fetchGames(category = '') {
  const grid = document.getElementById('game-grid');
  grid.innerHTML = '<div class="loading">載入中...</div>';
  
  try {
    const url = category ? `/api/games?category=${category}` : '/api/games';
    const res = await fetch(url);
    const games = await res.json();
    
    if (games.length === 0) {
      grid.innerHTML = '<div class="empty">此分類暫無遊戲</div>';
      return;
    }

    grid.innerHTML = games.map(g => `
      <div class="card" onclick="playGame('${g.slug}')">
        <img src="${g.cover_image_url || '/images/icon-512.png'}" alt="${g.title}" loading="lazy">
        <div class="card-info">
          <h3 class="card-title">${g.title}</h3>
          <p class="card-desc">${g.description || ''}</p>
        </div>
      </div>
    `).join('');
  } catch (e) {
    grid.innerHTML = '<div class="empty">系統維護中，請稍後再試</div>';
  }
}

// 側邊欄點擊分類
window.loadCategory = (cat) => {
  fetchGames(cat);
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
};

// 核心：Safari 兼容跳轉
async function playGame(slug) {
  const newWin = window.open('', '_blank');
  
  try {
    const res = await fetch(`/api/go?slug=${slug}`);
    const data = await res.json();
    
    if (data.url) {
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

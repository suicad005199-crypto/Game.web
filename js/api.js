document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('game-grid');

  try {
    // 從 Cloudflare API 獲取遊戲清單
    const res = await fetch('/api/games');
    const games = await res.json();
    
    // 渲染遊戲卡片 UI
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
    grid.innerHTML = '<div class="loading">遊戲館維護中，請稍後再試。</div>';
  }
});

/**
 * 處理遊戲點擊與跳轉
 * 解決 Safari 在非同步請求後無法正確開新分頁的問題
 */
async function playGame(slug) {
  // 1. 關鍵步驟：在使用者點擊的瞬間立刻開啟一個空白分頁
  // 這樣 Safari 會將其判定為「使用者直接觸發」的行為，而不會攔截或跳轉至預設瀏覽器
  const newWindow = window.open('', '_blank');

  try {
    // 2. 向後端請求跳轉網址
    const res = await fetch(`/api/go?slug=${slug}`);
    const data = await res.json();
    
    if (data.url) {
      // 3. 取得網址後，將剛才開好的空白分頁導向目標網址
      newWindow.location.href = data.url;
    } else {
      // 若資料庫找不到網址，則關閉該空白分頁
      newWindow.close();
      alert('遊戲連結準備中，請洽管理員。');
    }
  } catch (err) {
    // 發生網路錯誤時也關閉視窗
    newWindow.close();
    console.error('API Error:', err);
  }
}

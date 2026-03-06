document.addEventListener('DOMContentLoaded', () => {
    const user = Auth.getUser();
    if (!user) {
        alert('請先登入');
        return location.href = '/game/index.html';
    }

    const info = document.getElementById('profile-info');
    info.innerHTML = `
        <p>暱稱：<span style="color:#FFD700">${user.name || '遊客'}</span></p>
        <p>狀態：${user.is_guest ? '尚未綁定' : '已綁定 LINE'}</p>
        <p>身分：${user.role === 'admin' ? '管理員' : '一般玩家'}</p>
    `;

    if (user.is_guest) {
        document.getElementById('upgrade-btn').style.display = 'inline-block';
    }
});

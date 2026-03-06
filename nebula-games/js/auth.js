const Auth = {
    getUser() {
        const match = document.cookie.match(new RegExp('(^| )session=([^;]+)'));
        if (!match) return null;
        try { return JSON.parse(atob(match[2])); } catch { return null; }
    },
    async login() {
        const user = this.getUser();
        if (user) return location.href = '/game/looty-me.html';
        
        if (confirm("是否先以遊客身分進入？")) {
            const res = await fetch('/auth/guest', { method: 'POST' });
            if (res.ok) location.reload();
        } else {
            this.loginWithLine();
        }
    },
    loginWithLine() {
        const user = this.getUser();
        const state = (user && user.is_guest) ? user.uid : 'login';
        const redirectUri = encodeURIComponent(`${location.origin}/auth/callback`);
        // 請將 YOUR_LINE_CHANNEL_ID 替換為實際 ID
        location.href = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=YOUR_LINE_CHANNEL_ID&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid`;
    },
    updateHeader() {
        const user = this.getUser();
        const btn = document.getElementById('login-btn');
        if (user && btn) {
            btn.innerText = user.name || '玩家';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Auth.updateHeader());

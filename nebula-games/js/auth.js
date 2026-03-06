const Auth = {
    getUser() {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('session='));
        if (!cookie) return null;
        return JSON.parse(atob(cookie.split('=')[1]));
    },
    async handleLoginClick() {
        const user = this.getUser();
        if (user) {
            location.href = '/looty-me.html';
        } else {
            // 優先執行遊客登入，或導向 LINE
            if (confirm("是否以遊客身份進入？")) {
                const res = await fetch('/auth/guest', { method: 'POST' });
                if (res.ok) location.reload();
            } else {
                location.href = '/auth/login'; // 指向 functions/auth/login.js
            }
        }
    },
    updateHeader() {
        const user = this.getUser();
        const btn = document.getElementById('login-btn');
        if (user && user.pic) {
            btn.innerHTML = `<img src="${user.pic}" alt="Avatar">`;
        }
    }
};
document.addEventListener('DOMContentLoaded', () => Auth.updateHeader());

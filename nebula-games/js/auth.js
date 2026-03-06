function login() {
    // 預留跳轉至 LINE Auth 的邏輯
    alert("跳轉至 LINE 登入...");
    // window.location.href = 'https://access.line.me/...';
}
function checkAuth() {
    const token = localStorage.getItem('nebula_token');
    if(token) console.log('已登入');
}
checkAuth();

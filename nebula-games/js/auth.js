async function initSession() {
    let user = JSON.parse(localStorage.getItem('nebula_user'));
    if (!user) {
        const res = await fetch('/api/auth/guest');
        user = await res.json();
        localStorage.setItem('nebula_user', JSON.stringify(user));
    }
    const zone = document.getElementById('auth-zone');
    zone.innerHTML = user.is_guest 
        ? `<button onclick="bindGmail()">綁定 Gmail</button>` 
        : `<span>${user.display_name}</span>`;
}

function bindGmail() {
    alert("正在前往 Google 帳號綁定...");
    // window.location.href = google_oauth_url;
}
document.addEventListener('DOMContentLoaded', initSession);

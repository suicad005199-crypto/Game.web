async function initUser() {
    let user = JSON.parse(localStorage.getItem('nebula_user'));
    if (!user) {
        const res = await fetch('/api/auth/guest');
        user = await res.json();
        localStorage.setItem('nebula_user', JSON.stringify(user));
    }
    document.getElementById('user-info').innerHTML = user.is_guest 
        ? `<button onclick="alert('導向 Google 綁定...')">Gmail 綁定</button>`
        : `<span>${user.display_name}</span>`;
}
document.addEventListener('DOMContentLoaded', initUser);

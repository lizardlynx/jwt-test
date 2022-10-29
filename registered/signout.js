document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signout').addEventListener('click', async () => {
        const resLogged = await fetch('logout', { method: 'GET' });
        if (resLogged.ok) location.href = '/signin.html';
    });
});

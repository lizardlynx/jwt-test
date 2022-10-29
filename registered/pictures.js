document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch('picture', { method: 'GET' });
    res.json()
    .then(data => {
        document.getElementById('pic-img').src = data.image;
    });
});

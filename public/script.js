document.addEventListener('DOMContentLoaded', async () => {
    const resLogged = await fetch('loggedin', { method: 'GET' });
    if (resLogged.ok) location.href = '/';

    const sumbitBtn = document.querySelector('input[type="submit"');
    const signinError = sumbitBtn.nextElementSibling;
    const loginField = document.querySelector('input[name="login"');
    const loginError = loginField.nextElementSibling;
    const passwordField = document.querySelector('input[name="password"');
    const passwordError = passwordField.nextElementSibling;

    function clearWrong() {
        loginField.classList.remove('wrong');
        passwordField.classList.remove('wrong');
        loginError.classList.add('hidden');
        passwordError.classList.add('hidden');
        signinError.classList.add('hidden');
    }

    sumbitBtn.addEventListener('click', async e => {
        e.preventDefault();
        clearWrong();

        const login = loginField.value.trim();
        const password = passwordField.value.trim();
        if (login.length == 0) {
            loginField.classList.add('wrong');
            loginError.classList.remove('hidden');
            return;
        }
        if (password.length == 0) {
            passwordField.classList.add('wrong');
            passwordError.classList.remove('hidden');
            return;
        }

        const res = await fetch('signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password })
        });

        if (!res.ok) signinError.classList.remove('hidden');
        else location.href = '/';
    });
});

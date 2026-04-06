function switchForm(formType) {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');

    if (formType === 'login') {
        loginForm.classList.add('active');
        regForm.classList.remove('active');
    } else {
        regForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

function handleLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }

    const users = JSON.parse(localStorage.getItem('spark_users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('spark_current_user', JSON.stringify({
            username: user.username,
            email: user.email || ''
        }));

        alert(`Welcome back, ${username}!`);
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password');
    }
}

function handleRegister() {
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    if (!username || !password) {
        alert('Username and password are required');
        return;
    }

    if (username.length < 3) {
        alert('Username must be at least 3 characters');
        return;
    }

    if (password.length < 4) {
        alert('Password must be at least 4 characters');
        return;
    }

    if (password !== confirm) {
        alert('Passwords do not match');
        return;
    }

    if (email && !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }

    const users = JSON.parse(localStorage.getItem('spark_users') || '[]');

    if (users.find(u => u.username === username)) {
        alert('Username already exists');
        return;
    }

    users.push({
        username: username,
        email: email,
        password: password
    });

    localStorage.setItem('spark_users', JSON.stringify(users));

    alert(`Registration successful! Welcome, ${username}!\n\nPlease login.`);

    document.getElementById('reg-username').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-confirm').value = '';

    switchForm('login');
}
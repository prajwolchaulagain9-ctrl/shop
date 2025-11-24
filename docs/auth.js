// auth.js - checks session status and updates nav login button
async function getAuthStatus() {
    try {
        const res = await fetch('auth_status.php', { cache: 'no-store' });
        return await res.json();
    } catch (e) {
        return { loggedIn: false, name: '' };
    }
}

async function updateAuthButton() {
    const container = document.getElementById('authBtnContainer');
    if (!container) return;
    const status = await getAuthStatus();
    container.innerHTML = '';

    if (status.loggedIn) {
        const btn = document.createElement('button');
        btn.className = 'logout-btn-nav';
        btn.textContent = 'Logout';
        btn.addEventListener('click', () => {
            // perform logout by navigating to logout.php
            window.location.href = 'logout.php';
        });

        const nameSpan = document.createElement('span');
        nameSpan.className = 'nav-user-name';
        nameSpan.textContent = status.name ? (` ` + status.name) : '';

        container.appendChild(nameSpan);
        container.appendChild(btn);
    } else {
        const btn = document.createElement('button');
        btn.className = 'login-btn-nav';
        btn.textContent = 'Login';
        btn.addEventListener('click', () => {
            const modal = document.getElementById('loginModal');
            if (modal) modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        container.appendChild(btn);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateAuthButton);

// Expose update function for other scripts to call after login/register
window.updateAuthButton = updateAuthButton;

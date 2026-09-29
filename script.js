const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
const usersKey = "gemiiUsers";

function getUsers() {
    return JSON.parse(localStorage.getItem(usersKey) || "[]");
}

async function hashPassword(password) {
    const data = new TextEncoder().encode(password);
    const buffer = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(buffer)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim().toLowerCase();
    const password = document.getElementById("signup-password").value;
    const error = document.getElementById("signup-error");

    const users = getUsers();
    if (users.some((user) => user.email === email)) {
        error.textContent = "อีเมลนี้ถูกใช้งานแล้ว";
        return;
    }

    users.push({ name, email, password: await hashPassword(password) });
    localStorage.setItem(usersKey, JSON.stringify(users));
    localStorage.setItem("gemiiLoggedIn", name);
    window.location.href = "index.html";
});

document.getElementById("signin-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signin-email").value.trim().toLowerCase();
    const password = document.getElementById("signin-password").value;
    const error = document.getElementById("signin-error");

    const hashed = await hashPassword(password);
    const user = getUsers().find((u) => u.email === email && u.password === hashed);

    if (!user) {
        error.textContent = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
        return;
    }

    localStorage.setItem("gemiiLoggedIn", user.name);
    window.location.href = "index.html";
});
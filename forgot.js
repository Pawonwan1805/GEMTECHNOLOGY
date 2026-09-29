const usersKey = "gemiiUsers";

async function hashPassword(password) {
    const data = new TextEncoder().encode(password);
    const buffer = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(buffer)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

document.getElementById("forgot-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("forgot-email").value.trim().toLowerCase();
    const password = document.getElementById("forgot-password").value;
    const confirm = document.getElementById("forgot-confirm").value;
    const error = document.getElementById("forgot-error");

    if (password !== confirm) {
        error.textContent = "รหัสผ่านไม่ตรงกัน";
        return;
    }

    const users = JSON.parse(localStorage.getItem(usersKey) || "[]");
    const user = users.find((u) => u.email === email);

    if (!user) {
        error.textContent = "ไม่พบอีเมลนี้ในระบบ";
        return;
    }

    user.password = await hashPassword(password);
    localStorage.setItem(usersKey, JSON.stringify(users));
    alert("เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบใหม่");
    window.location.href = "login.html";
});
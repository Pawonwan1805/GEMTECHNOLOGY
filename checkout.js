const summaryBox = document.getElementById("order-summary");
const checkoutForm = document.getElementById("checkout-form");
const checkoutMsg = document.getElementById("checkout-msg");

function renderSummary() {
    const cart = getCart();
    if (!cart.length) {
        summaryBox.innerHTML = '<p>ยังไม่มีสินค้าในตะกร้า <a href="index.html">เลือกซื้อสินค้า</a></p>';
        checkoutForm.hidden = true;
        return;
    }
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    summaryBox.innerHTML = cart.map((i) =>
        `<div class="row"><span>${escapeHtml(i.name)} × ${i.quantity}</span><span>${formatPrice(i.price * i.quantity)}</span></div>`
    ).join("") + `<div class="row total"><span>รวม</span><span>${formatPrice(total)}</span></div>`;
}

const loggedInName = localStorage.getItem("gemiiLoggedIn");
if (!loggedInName) {
    window.location.href = "login.html";
} else {
    document.getElementById("co-name").value = loggedInName;
    renderSummary();
}

checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    checkoutMsg.style.color = "";
    checkoutMsg.textContent = "กำลังบันทึกคำสั่งซื้อ...";

    /* ใช้ราคาจากฐานข้อมูล ไม่เชื่อราคาจากตะกร้าในเบราว์เซอร์ */
    const cart = getCart();
    const { data: rows, error: pErr } = await supabaseClient
        .from("products").select("name, price").in("name", cart.map((i) => i.name));
    if (pErr) { checkoutMsg.textContent = "โหลดราคาสินค้าไม่สำเร็จ"; return; }

    const priceMap = Object.fromEntries(rows.map((r) => [r.name, Number(r.price)]));
    const missing = cart.find((i) => !(i.name in priceMap));
    if (missing) { checkoutMsg.textContent = `ไม่พบสินค้า "${missing.name}" ในระบบ กรุณาลบออกจากตะกร้า`; return; }

    const items = cart.map((i) => ({ name: i.name, quantity: i.quantity, price: priceMap[i.name] }));
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

    const { error } = await supabaseClient.from("shop_orders").insert({
        name: document.getElementById("co-name").value.trim(),
        phone: document.getElementById("co-phone").value.trim(),
        address: document.getElementById("co-address").value.trim(),
        items, total
    });
    if (error) { checkoutMsg.textContent = "บันทึกคำสั่งซื้อไม่สำเร็จ: " + error.message; return; }

    localStorage.removeItem(cartStorageKey);
    updateCartCount();
    checkoutForm.hidden = true;
    summaryBox.innerHTML = `<p style="color:#2e7d32">สั่งซื้อสำเร็จ ยอดรวม ${formatPrice(total)}</p><p><a href="index.html">กลับหน้าแรก</a></p>`;
});
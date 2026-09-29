const cartStorageKey = "gemiiCart";

function getCart() {
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]"); } catch { cart = []; }
    return cart.map((item) => ({
        ...item,
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1)
    }));
}

function saveCart(cart) {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    updateCartCount();
}

function parsePrice(priceText) {
    const price = Number(priceText.replace(/[^0-9.]/g, ""));
    return Number.isFinite(price) ? price : 0;
}

function formatPrice(price) {
    return `${price.toLocaleString("th-TH")} บาท`;
}

function addToCart(item) {
    const cart = getCart();
    const existingItem = cart.find((cartItem) => cartItem.name === item.name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    saveCart(cart);
}

function updateCartCount() {
    const count = getCart().reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll(".cartcount").forEach((counter) => {
        counter.textContent = count;
    });
}

function showCart() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const modal = document.createElement("div");
    modal.className = "model cart-modal";

    const items = cart.length
        ? cart.map((item, index) => `
            <div class="cart-item">
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
                <div class="cart-item-info">
                    <strong>${escapeHtml(item.name)}</strong>
                    <span>${formatPrice(item.price)} ต่อชิ้น</span>
                    <div class="quantity-control">
                        <button type="button" class="quantity-button" data-index="${index}" data-change="-1">-</button>
                        <span>${item.quantity}</span>
                        <button type="button" class="quantity-button" data-index="${index}" data-change="1">+</button>
                        <strong class="item-subtotal">${formatPrice(item.price * item.quantity)}</strong>
                    </div>
                </div>
                <button type="button" class="cart-remove" data-index="${index}">ลบ</button>
            </div>
        `).join("")
        : "<p class=\"empty-cart\">ยังไม่มีสินค้าในตะกร้า</p>";

    modal.innerHTML = `
        <div class="model-bg"></div>
        <div class="model-page cart-page">
            <div class="cart-heading">
                <h2>ตะกร้าสินค้า</h2>
                <button type="button" class="cart-close">ปิด</button>
            </div>
            <div class="cart-items">${items}</div>
            <div class="cart-summary">
                <span>รวมราคาสินค้า</span>
                <strong class="cart-total">${formatPrice(total)}</strong>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    if (cart.length) {
        const checkout = document.createElement("a");
        checkout.href = "checkout.html";
        checkout.className = "btn cart-checkout";
        checkout.textContent = "ชำระเงิน";
        modal.querySelector(".cart-page").appendChild(checkout);
    }
    const closeCart = () => modal.remove();
    modal.querySelector(".cart-close").addEventListener("click", closeCart);
    modal.querySelector(".model-bg").addEventListener("click", closeCart);
    modal.querySelectorAll(".quantity-button").forEach((button) => {
        button.addEventListener("click", () => {
            const updatedCart = getCart();
            const item = updatedCart[Number(button.dataset.index)];
            item.quantity += Number(button.dataset.change);

            if (item.quantity <= 0) {
                updatedCart.splice(Number(button.dataset.index), 1);
            }

            saveCart(updatedCart);
            closeCart();
            showCart();
        });
    });
    modal.querySelectorAll(".cart-remove").forEach((button) => {
        button.addEventListener("click", () => {
            const updatedCart = getCart();
            updatedCart.splice(Number(button.dataset.index), 1);
            saveCart(updatedCart);
            closeCart();
            showCart();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    document.querySelectorAll(".nav-profile-cart").forEach((cartButton) => {
        cartButton.addEventListener("click", showCart);
    });
});
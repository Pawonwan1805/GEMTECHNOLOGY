/* โหลดสินค้าจาก Supabase (หน้าแรก = ทั้งหมด, menu1-3 = ตาม data-category) + ค้นหา */
function productHtml(p, compact) {
    const fs = compact ? ' style="font-size: 1.2vw;"' : "";
    return `
        <p${fs}>${escapeHtml(p.name)}</p>
        <img class="product-img" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}">
        <strong${fs}>${Number(p.price || 0).toLocaleString("th-TH")} บาท</strong>`;
}

function applySearch() {
    const q = (document.querySelector(".sidebar-search")?.value || "").trim().toLowerCase();
    const items = document.querySelectorAll(".product-items");
    let visible = 0;
    items.forEach((el) => {
        const match = (el.querySelector("p")?.textContent || "").toLowerCase().includes(q);
        el.style.display = match ? "" : "none";
        if (match) visible++;
    });

    const holder = document.getElementById("product-list") || document.querySelector(".product");
    let note = document.getElementById("no-result");
    if (holder && items.length && !visible) {
        if (!note) {
            note = document.createElement("p");
            note.id = "no-result";
            note.style.padding = "20px";
            holder.appendChild(note);
        }
        note.textContent = "ไม่พบสินค้าที่ค้นหา";
    } else if (note) {
        note.remove();
    }
}

async function loadProducts() {
    const list = document.getElementById("product-list") || document.querySelector(".product[data-category]");
    if (!list) return;

    const category = list.dataset.category;
    let query = supabaseClient.from("products").select("*").order("id", { ascending: true });
    if (category) query = query.eq("category", category);

    const { data, error } = await query;
    if (error) {
        console.error("Supabase error:", error);   // ถ้าพลาด ปล่อยสินค้า static ในหน้าไว้เป็น fallback
        return;
    }
    if (!data.length) {
        if (!category) list.innerHTML = '<p style="padding:20px;">ยังไม่มีสินค้าในระบบ</p>';
        return;
    }

    list.querySelectorAll(".product-items").forEach((el) => el.remove());
    data.forEach((p) => {
        const el = document.createElement("div");
        el.className = "product-items";
        el.dataset.id = p.id;
        el.innerHTML = productHtml(p, Boolean(category));
        list.appendChild(el);
    });
    applySearch();
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".sidebar-search")?.addEventListener("input", applySearch);
    loadProducts();
});
/* ไฟล์กลาง: Supabase client + ฟังก์ชันช่วย (ต้องโหลดหลัง supabase-js และก่อนไฟล์อื่น) */
const SUPABASE_URL = "https://ikcsxhiyhbslhhcvommp.supabase.co";
const SUPABASE_KEY = "sb_publishable_mPGUUzfGEM27WEHc6G-atQ_Czichtnk";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ป้องกัน XSS: escape ก่อนใส่ลง innerHTML ทุกครั้ง */
function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}

/* แปลข้อความ error ของ Supabase Auth เป็นภาษาไทย */
function authMessage(error) {
    const m = (error?.message || "").toLowerCase();
    if (m.includes("already registered")) return "อีเมลนี้ถูกใช้งานแล้ว";
    if (m.includes("invalid login")) return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
    if (m.includes("email not confirmed")) return "กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ";
    if (m.includes("rate limit")) return "ลองใหม่อีกครั้งในอีกสักครู่";
    return error?.message || "เกิดข้อผิดพลาด";
}
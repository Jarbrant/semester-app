/* ==========================================
   🚀 APP INIT (FIXAD)
========================================== */

window.addEventListener("DOMContentLoaded", () => {

    try {

        // ❌ BORTTAGEN (fanns inte längre)
        // loadEmployees();

        // ✅ Starta kalender
        if (typeof initCalendar === "function") {
            initCalendar();
        } else {
            console.error("❌ initCalendar saknas");
        }

        // 🔐 User handling
        let user = null;

        if (typeof getCurrentUser === "function") {
            user = getCurrentUser();
        }

        if (!user && typeof login === "function") {
            login("Admin", "admin");
            user = "Admin";
        }

        console.log("✅ App startad:", user);

    } catch (err) {
        console.error("💥 App crash:", err);
    }

});

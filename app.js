/* ==========================================
   🚀 APP INIT
========================================== */

window.addEventListener("DOMContentLoaded", () => {

    // 🔹 ladda data till UI
    loadEmployees();

    // ❌ GAMMALT (ta bort)
    // renderCalendar();

    // ✅ NYTT – starta FullCalendar
    initCalendar();

    const user = getCurrentUser();

    if (!user) {
        // demo user
        login("Admin", "admin");
    }

    console.log("App startad:", user);
});

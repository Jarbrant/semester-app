/* ==========================================
   🚀 APP INIT
========================================== */

window.addEventListener("DOMContentLoaded", () => {
    loadEmployees();
    renderCalendar();

    const user = getCurrentUser();

    if (!user) {
        // demo user
        login("Admin", "admin");
    }

    console.log("App startad:", user);
});

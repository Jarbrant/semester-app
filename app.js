/* ==========================================
   🚀 APP INIT (🔥 PATCHAD PRO VERSION)
========================================== */

window.addEventListener("DOMContentLoaded", () => {

    try {

        console.log("🧠 Init start...");

        /* ==========================================
           🔐 USER
        ========================================== */

        let user = null;

        if (typeof getCurrentUser === "function") {
            user = getCurrentUser();
        }

        if (!user && typeof login === "function") {
            login("Admin", "admin");
            user = "Admin";
        }

        console.log("✅ User:", user);

        /* ==========================================
           📦 LOAD STATE (🔥 VIKTIG)
        ========================================== */

        if (window.AppState?.load) {
            AppState.load();
            console.log("📦 State loaded");
        }

        /* ==========================================
           🔄 UI INIT (🔥 KRITISK FIX)
        ========================================== */

        if (typeof renderEmployeeList === "function") {
            renderEmployeeList();
        }

        if (typeof refreshEmployeeSelect === "function") {
            refreshEmployeeSelect();
        }

        if (typeof refreshGroupSelect === "function") {
            refreshGroupSelect();
        }

        /* ==========================================
           📅 CALENDAR
        ========================================== */

        if (typeof initCalendar === "function") {
            initCalendar();
            console.log("📅 Calendar init OK");
        } else {
            console.error("❌ initCalendar saknas");
        }

        /* ==========================================
           🔘 BUTTONS (🔥 DU SAKNADE DENNA)
        ========================================== */

        const saveEmployeeBtn = document.getElementById("saveEmployeeBtn");

        if (saveEmployeeBtn && typeof tryAddEmployee === "function") {
            saveEmployeeBtn.addEventListener("click", tryAddEmployee);
        } else {
            console.warn("⚠️ saveEmployeeBtn saknas eller ej kopplad");
        }

        /* ==========================================
           🔍 DEBUG
        ========================================== */

        console.log("👤 Employees:", localStorage.getItem("employees"));

        console.log("🚀 App fully initialized");

    } catch (err) {
        console.error("💥 App crash:", err);
    }

});

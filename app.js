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
           📦 LOAD STATE
        ========================================== */

        if (window.AppState?.load) {
            AppState.load();
            console.log("📦 State loaded");
        }

        /* ==========================================
           🔄 UI INIT
        ========================================== */

        window.renderEmployeeList?.();
        window.refreshEmployeeSelect?.();
        window.refreshGroupSelect?.();

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
           🔘 BUTTONS (🔥 FIX ALLA)
        ========================================== */

        // 👤 Spara personal
        const saveEmployeeBtn = document.getElementById("saveEmployeeBtn");
        if (saveEmployeeBtn) {
            saveEmployeeBtn.addEventListener("click", () => {
                console.log("🔥 Klick: Spara personal");
                window.tryAddEmployee?.();
            });
        }

        // 📅 Spara semester (🔥 DIN BUGG FIXAD)
        const saveVacationBtn = document.getElementById("saveVacationBtn");
        if (saveVacationBtn) {
            saveVacationBtn.addEventListener("click", () => {
                console.log("🔥 Klick: Spara semester");
                window.trySubmitVacation?.();
            });
        } else {
            console.warn("⚠️ saveVacationBtn hittades inte");
        }

        /* ==========================================
           🔍 EXTRA DEBUG (KAN TAS BORT SEN)
        ========================================== */

        console.log("👤 Employees:", localStorage.getItem("employees"));

        console.log("🚀 App fully initialized");

    } catch (err) {
        console.error("💥 App crash:", err);
    }

});

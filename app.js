/* ==========================================
   🚀 APP INIT (🔥 HARDENED PRO MAX VERSION)
========================================== */

window.addEventListener("DOMContentLoaded", () => {

    console.log("🧠 Init start...");

    /* ==========================================
       🔐 USER
    ========================================== */

    try {
        let user = null;

        if (typeof getCurrentUser === "function") {
            user = getCurrentUser();
        }

        if (!user && typeof login === "function") {
            login("Admin", "admin");
            user = "Admin";
        }

        console.log("✅ User:", user);
    } catch (err) {
        console.error("❌ User init error:", err);
    }

    /* ==========================================
       📦 LOAD STATE (🔥 KRITISK FIX)
    ========================================== */

    try {
        if (window.AppState?.load) {
            AppState.load();
            console.log("📦 State loaded");
        }

        // 🔥 FORCE LOAD vacations (FIXAR DIN BUGG)
        window.getVacations?.();

    } catch (err) {
        console.error("❌ State load error:", err);
    }

    /* ==========================================
       🔄 UI INIT
    ========================================== */

    try {
        window.renderEmployeeList?.();
        window.refreshEmployeeSelect?.();
        window.refreshGroupSelect?.();
    } catch (err) {
        console.error("❌ UI init error:", err);
    }

    /* ==========================================
       📅 CALENDAR (🔥 EFTER STATE)
    ========================================== */

    try {
        if (typeof initCalendar === "function") {
            initCalendar();
            console.log("📅 Calendar init OK");
        } else {
            console.error("❌ initCalendar saknas");
        }
    } catch (err) {
        console.error("❌ Calendar init crash:", err);
    }

    /* ==========================================
       🔘 BUTTONS
    ========================================== */

    try {

        // 👤 Spara personal
        const saveEmployeeBtn = document.getElementById("saveEmployeeBtn");
        if (saveEmployeeBtn) {
            saveEmployeeBtn.addEventListener("click", () => {
                console.log("🔥 Klick: Spara personal");
                window.tryAddEmployee?.();
            });
        }

        // 📅 Spara semester
        const saveVacationBtn = document.getElementById("saveVacationBtn");
        if (saveVacationBtn) {
            saveVacationBtn.addEventListener("click", () => {
                console.log("🔥 Klick: Spara semester");
                window.trySubmitVacation?.();
            });
        } else {
            console.warn("⚠️ saveVacationBtn hittades inte");
        }

    } catch (err) {
        console.error("❌ Button binding error:", err);
    }

    /* ==========================================
       ↩️ AO-03 UNDO SYSTEM (🔥 FIXAD)
    ========================================== */

    try {
        const undoBtn = document.getElementById("undoBtn");

        if (undoBtn) {
            undoBtn.addEventListener("click", () => {

                console.log("↩️ Klick: Undo");

                // 🔥 ENDAST UI handler (inte dubbelkörning)
                if (typeof window.handleUndo === "function") {
                    window.handleUndo();
                } else {
                    window.HistoryManager?.undo();
                }

            });
        } else {
            console.warn("⚠️ undoBtn hittades inte");
        }

    } catch (err) {
        console.error("❌ Undo binding error:", err);
    }

    /* ==========================================
       🔍 DEBUG
    ========================================== */

    try {
        console.log("👤 Employees:", localStorage.getItem("employees"));
        console.log("📅 Vacations:", localStorage.getItem("vacations"));
        console.log("🚀 App fully initialized");
    } catch (err) {
        console.error("❌ Debug log error:", err);
    }

});

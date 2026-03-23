/* ==========================================
   🚀 APP INIT (HARDENED PRO MAX STABLE++)
========================================== */

// 🔥 SKYDD: kör bara init en gång
if (!window.__APP_INIT_DONE__) {

    window.__APP_INIT_DONE__ = true;

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
           📦 LOAD STATE (SAFE ORDER)
        ========================================== */

        try {
            // 🔥 säkerställ att employees laddas först
            if (typeof getEmployees === "function") {
                getEmployees();
            }

            // 🔥 ladda vacations efter employees
            if (typeof getVacations === "function") {
                getVacations();
            }

            // 🔥 optional AppState.load (om finns)
            if (window.AppState?.load) {
                AppState.load();
                console.log("📦 AppState.load executed");
            }

            console.log("📦 State ready");

        } catch (err) {
            console.error("❌ State load error:", err);
        }

        /* ==========================================
           🔄 UI INIT (SAFE)
        ========================================== */

        try {
            requestAnimationFrame(() => {
                window.renderEmployeeList?.();
                window.refreshEmployeeSelect?.("");
                window.refreshGroupSelect?.();
            });
        } catch (err) {
            console.error("❌ UI init error:", err);
        }

        /* ==========================================
           📅 CALENDAR (AFTER STATE)
        ========================================== */

        try {
            if (typeof initCalendar === "function") {
                initCalendar();
                console.log("📅 Calendar init OK");
            } else {
                console.warn("⚠️ initCalendar saknas");
            }
        } catch (err) {
            console.error("❌ Calendar init crash:", err);
        }

        /* ==========================================
           🔘 BUTTONS (NO DUPLICATE BIND)
        ========================================== */

        try {

            const saveEmployeeBtn = document.getElementById("saveEmployeeBtn");

            if (saveEmployeeBtn && !saveEmployeeBtn.dataset.bound) {
                saveEmployeeBtn.dataset.bound = "true";

                saveEmployeeBtn.addEventListener("click", () => {
                    window.tryAddEmployee?.();
                });
            }

            const saveVacationBtn = document.getElementById("saveVacationBtn");

            if (saveVacationBtn && !saveVacationBtn.dataset.bound) {
                saveVacationBtn.dataset.bound = "true";

                saveVacationBtn.addEventListener("click", () => {
                    window.trySubmitVacation?.();
                });
            }

        } catch (err) {
            console.error("❌ Button binding error:", err);
        }

        /* ==========================================
           ↩️ UNDO SYSTEM (SAFE)
        ========================================== */

        try {
            const undoBtn = document.getElementById("undoBtn");

            if (undoBtn && !undoBtn.dataset.bound) {

                undoBtn.dataset.bound = "true";

                undoBtn.addEventListener("click", () => {

                    if (typeof window.handleUndo === "function") {
                        window.handleUndo();
                    } else {
                        window.HistoryManager?.undo();
                    }

                });

            }

        } catch (err) {
            console.error("❌ Undo binding error:", err);
        }

        /* ==========================================
           🔍 DEBUG (SAFE PARSE)
        ========================================== */

        try {
            const employees = JSON.parse(localStorage.getItem("employees") || "[]");
            const vacations = JSON.parse(localStorage.getItem("vacations") || "[]");

            console.log("👤 Employees:", employees.length);
            console.log("📅 Vacations:", vacations.length);
            console.log("🚀 App fully initialized");

        } catch (err) {
            console.error("❌ Debug log error:", err);
        }

    });

}

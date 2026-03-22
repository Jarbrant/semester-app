/* ==========================================
   💾 DATA LAGER (SAFE + SYNC)
========================================== */

function safeParse(key, fallback = []) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
        console.error(`❌ parse error (${key}):`, err);
        return fallback;
    }
}

/* ==========================================
   👤 EMPLOYEES (🔥 SYNC MED AppState)
========================================== */

function getEmployees() {

    // 🔥 PRIORITERA AppState
    if (window.AppState?.employees) {
        return window.AppState.employees;
    }

    const data = safeParse("employees", []);

    // 🔥 SYNC tillbaka till state
    if (window.AppState) {
        window.AppState.employees = data;
    }

    return data;
}

function saveEmployees(data) {

    if (!Array.isArray(data)) {
        console.error("❌ saveEmployees: fel data");
        return;
    }

    // 🔥 SYNC state
    if (window.AppState) {
        window.AppState.employees = data;
    }

    localStorage.setItem("employees", JSON.stringify(data));

    console.log("💾 Employees saved:", data.length);
}

/* ==========================================
   📅 VACATIONS
========================================== */

function getVacations() {
    return safeParse("vacations", []);
}

function saveVacations(data) {

    if (!Array.isArray(data)) {
        console.error("❌ saveVacations: fel data");
        return;
    }

    localStorage.setItem("vacations", JSON.stringify(data));

    console.log("💾 Vacations saved:", data.length);
}

/* ==========================================
   💾 DATA LAGER (SYNC MED AppState)
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
   👤 EMPLOYEES
========================================== */

function getEmployees() {

    if (window.AppState?.employees) {
        return window.AppState.employees;
    }

    const data = safeParse("employees", []);

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

    if (window.AppState) {
        window.AppState.employees = data;
    }

    localStorage.setItem("employees", JSON.stringify(data));

    console.log("💾 Employees saved:", data.length);
}

/* ==========================================
   📅 VACATIONS (🔥 ROUTAS TILL AppState)
========================================== */

function getVacations() {

    if (window.getVacations) {
        return window.getVacations();
    }

    return safeParse("vacations", []);
}

function saveVacations(data) {

    if (!Array.isArray(data)) {
        console.error("❌ saveVacations: fel data");
        return;
    }

    if (window.saveVacations) {
        return window.saveVacations(data);
    }

    localStorage.setItem("vacations", JSON.stringify(data));

    console.log("💾 Vacations saved (fallback):", data.length);
}

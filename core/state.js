/* ==========================================
   🧠 GLOBAL APP STATE (SAFE + PERSISTENCE)
========================================== */

window.AppState = window.AppState || {};

(function () {

    const STORAGE_KEYS = {
        employees: "employees",
        vacations: "vacations",
        groups: "groups"
    };

    function safeParse(key, fallback = []) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (err) {
            console.error(`❌ State parse error (${key})`, err);
            return fallback;
        }
    }

    function loadKey(key) {

        const existing = window.AppState[key];

        // 🔥 SKYDD: skriv inte över redan laddad state
        if (Array.isArray(existing) && existing.length > 0) {
            return existing;
        }

        const data = safeParse(key, []);

        window.AppState[key] = data;

        return data;
    }

    window.AppState.load = function () {

        console.log("🧠 Loading AppState...");

        loadKey(STORAGE_KEYS.employees);
        loadKey(STORAGE_KEYS.vacations);
        loadKey(STORAGE_KEYS.groups);

        console.log("✅ State loaded:", {
            employees: window.AppState.employees?.length || 0,
            vacations: window.AppState.vacations?.length || 0,
            groups: window.AppState.groups?.length || 0
        });
    };

})();

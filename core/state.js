/* ==========================================
   🧠 GLOBAL STATE (9/10 CORE)
========================================== */

window.AppState = {

    employees: [],
    vacations: [],
    groups: [],

    /* ==========================================
       🔄 LOAD
    ========================================== */

    load() {
        try {
            this.employees = getEmployees?.() || [];
            this.vacations = getVacations?.() || [];
            this.groups = getGroups?.() || [];

            console.log("🧠 State loaded");
        } catch (err) {
            console.error("❌ State load error:", err);
        }
    },

    /* ==========================================
       🔁 REFRESH
    ========================================== */

    refresh() {
        this.load();
        window.refreshCalendar?.();
    },

    /* ==========================================
       🔍 GETTERS (🔥 används överallt)
    ========================================== */

    getEmployee(id) {
        return this.employees.find(e => e.id == id);
    },

    getGroup(id) {
        return this.groups.find(g => g.id == id);
    },

    getVacationsForEmployee(id) {
        return this.vacations.filter(v => v.employee_id == id);
    }

};

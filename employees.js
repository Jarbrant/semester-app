/* ==========================================
   👤 EMPLOYEES (STATE DRIVEN PRO MAX)
========================================== */

const EMP_KEY = "employees";

/* ==========================================
   🧠 STATE LAYER (🔥 NYTT)
========================================== */

window.AppState = window.AppState || {
    employees: null
};

/* ==========================================
   🛠 UTIL
========================================== */

function toInt(val, fallback = 0) {
    const n = parseInt(val);
    return isNaN(n) ? fallback : n;
}

function safeDate(date) {
    const d = new Date(date);
    return isNaN(d) ? null : d;
}

function iterateDays(start, end, callback) {
    const current = new Date(start);
    while (current <= end) {
        callback(new Date(current));
        current.setDate(current.getDate() + 1);
    }
}

/* ==========================================
   📦 LOAD / SAVE (STATE FIRST 🔥)
========================================== */

function loadEmployees() {
    try {
        const raw = localStorage.getItem(EMP_KEY);
        if (!raw) return [];

        const data = JSON.parse(raw);

        return data.map(emp => ({
            id: emp.id,
            name: emp.name || "Okänd",
            group_id: emp.group_id ?? null,
            vacationDays: Math.max(1, toInt(emp.vacationDays, 25))
        }));

    } catch (err) {
        console.error("❌ loadEmployees error:", err);
        return [];
    }
}

function persistEmployees() {
    try {
        localStorage.setItem(EMP_KEY, JSON.stringify(AppState.employees));
    } catch (err) {
        console.error("❌ persistEmployees error:", err);
    }
}

/* ==========================================
   📦 PUBLIC API (CACHE 🔥)
========================================== */

window.getEmployees = function () {
    if (!AppState.employees) {
        AppState.employees = loadEmployees();
    }
    return AppState.employees;
};

window.saveEmployees = function (emps) {
    AppState.employees = emps;
    persistEmployees();
};

/* ==========================================
   ➕ ADD / UPDATE / DELETE
========================================== */

window.addEmployee = function (name, groupId = null, vacationDays = 25) {
    if (!name || typeof name !== "string") return;

    const employees = getEmployees();

    const newEmp = {
        id: Date.now(),
        name: name.trim(),
        group_id: groupId || null,
        vacationDays: Math.max(1, toInt(vacationDays, 25))
    };

    employees.push(newEmp);
    persistEmployees();

    console.log("✅ Employee created:", newEmp);
};

window.updateEmployee = function (id, name, groupId, vacationDays) {
    const emp = getEmployees().find(e => e.id == id);
    if (!emp) return;

    if (name) emp.name = name.trim();
    if (groupId !== undefined) emp.group_id = groupId || null;

    if (vacationDays !== undefined) {
        emp.vacationDays = Math.max(1, toInt(vacationDays, 25));
    }

    persistEmployees();

    console.log("✏️ Employee updated:", emp);
};

window.deleteEmployeeById = function (id) {
    AppState.employees = getEmployees().filter(e => e.id != id);
    persistEmployees();

    console.log("🗑 Employee deleted:", id);
};

/* ==========================================
   📊 VACATION DAYS (PER YEAR)
========================================== */

window.getUsedVacationDays = function (employeeId, year = null, options = {}) {
    const { workdaysOnly = false } = options;

    const vacations = getVacations?.() || [];
    let total = 0;

    vacations.forEach(v => {
        if (v.employee_id != employeeId) return;

        const start = safeDate(v.start);
        const end = safeDate(v.end);
        if (!start || !end) return;

        iterateDays(start, end, (day) => {

            if (year && day.getFullYear() !== year) return;

            const dow = day.getDay();

            if (!workdaysOnly || (dow !== 0 && dow !== 6)) {
                total++;
            }
        });
    });

    return total;
};

/* ==========================================
   🚨 VALIDATION (CROSS-YEAR SAFE)
========================================== */

window.canAddVacation = function (employeeId, start, end) {
    const emp = getEmployees().find(e => e.id == employeeId);
    if (!emp) return true;

    const startDate = safeDate(start);
    const endDate = safeDate(end);

    if (!startDate || !endDate || endDate < startDate) return false;

    const vacations = getVacations?.() || [];

    const yearlyUsage = {};
    const newUsage = {};

    // existing
    vacations.forEach(v => {
        if (v.employee_id != employeeId) return;

        const s = safeDate(v.start);
        const e = safeDate(v.end);
        if (!s || !e) return;

        iterateDays(s, e, (d) => {
            const y = d.getFullYear();
            yearlyUsage[y] = (yearlyUsage[y] || 0) + 1;
        });
    });

    // new
    iterateDays(startDate, endDate, (d) => {
        const y = d.getFullYear();
        newUsage[y] = (newUsage[y] || 0) + 1;
    });

    for (const y in newUsage) {
        const used = yearlyUsage[y] || 0;
        const incoming = newUsage[y];

        if ((used + incoming) > (emp.vacationDays || 25)) {
            return false;
        }
    }

    return true;
};

/* ==========================================
   📊 BALANCE
========================================== */

window.getVacationBalance = function (employeeId, year = null) {
    const emp = getEmployees().find(e => e.id == employeeId);
    if (!emp) return null;

    const targetYear = year || new Date().getFullYear();

    const used = getUsedVacationDays(employeeId, targetYear);
    const total = emp.vacationDays || 25;

    const percent = total > 0
        ? Math.min((used / total) * 100, 100)
        : 0;

    return {
        used,
        total,
        remaining: Math.max(total - used, 0),
        percent,
        year: targetYear
    };
};

/* ==========================================
   🎨 STATUS COLOR
========================================== */

window.getVacationStatusColor = function (percent) {
    if (percent > 90) return "#ef4444";
    if (percent > 70) return "#f59e0b";
    return "#22c55e";
};

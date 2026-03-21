/* ==========================================
   👤 EMPLOYEES (FINAL PRO MAX + YEAR SYSTEM)
========================================== */

const EMP_KEY = "employees";

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

function sameDay(a, b) {
    return a.toISOString().split("T")[0] === b.toISOString().split("T")[0];
}

/* ==========================================
   📦 GET / SAVE (ROBUST + MIGRATION SAFE)
========================================== */

window.getEmployees = function () {
    try {
        const raw = localStorage.getItem(EMP_KEY);
        if (!raw) return [];

        const data = JSON.parse(raw);

        return data.map(emp => ({
            id: emp.id,
            name: emp.name || "Okänd",
            group_id: emp.group_id ?? null,
            vacationDays: toInt(emp.vacationDays, 25)
        }));

    } catch (err) {
        console.error("❌ getEmployees error:", err);
        return [];
    }
};

window.saveEmployees = function (emps) {
    try {
        localStorage.setItem(EMP_KEY, JSON.stringify(emps));
    } catch (err) {
        console.error("❌ saveEmployees error:", err);
    }
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
        vacationDays: Math.max(1, toInt(vacationDays, 25)) // 🔥 min 1 dag
    };

    employees.push(newEmp);
    saveEmployees(employees);

    console.log("✅ Employee created:", newEmp);
};

window.updateEmployee = function (id, name, groupId, vacationDays) {
    const employees = getEmployees();
    const emp = employees.find(e => e.id == id);
    if (!emp) return;

    if (name) emp.name = name.trim();
    if (groupId !== undefined) emp.group_id = groupId || null;

    if (vacationDays !== undefined) {
        emp.vacationDays = Math.max(1, toInt(vacationDays, 25));
    }

    saveEmployees(employees);

    console.log("✏️ Employee updated:", emp);
};

window.deleteEmployeeById = function (id) {
    const employees = getEmployees().filter(e => e.id != id);
    saveEmployees(employees);

    console.log("🗑 Employee deleted:", id);
};

/* ==========================================
   📊 CORE: ITERATE DAYS (REUSABLE 🔥)
========================================== */

function iterateDays(start, end, callback) {
    const current = new Date(start);

    while (current <= end) {
        callback(new Date(current));
        current.setDate(current.getDate() + 1);
    }
}

/* ==========================================
   📊 VACATION DAYS (PER YEAR + SAFE)
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
   🚨 VALIDATION (SMART + CROSS-YEAR SAFE)
========================================== */

window.canAddVacation = function (employeeId, start, end) {
    const emp = getEmployees().find(e => e.id == employeeId);
    if (!emp) return true;

    const startDate = safeDate(start);
    const endDate = safeDate(end);

    if (!startDate || !endDate) return false;
    if (endDate < startDate) return false;

    const vacations = getVacations?.() || [];

    // 🔥 Räkna dagar per år separat
    const yearlyUsage = {};

    // befintliga dagar
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

    // nya dagar
    const newUsage = {};

    iterateDays(startDate, endDate, (d) => {
        const y = d.getFullYear();
        newUsage[y] = (newUsage[y] || 0) + 1;
    });

    // 🔥 validera per år
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
   📊 BALANCE (PER YEAR + SAFE)
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

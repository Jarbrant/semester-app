/* ==========================================
   👤 EMPLOYEES (FINAL PRO+++ YEAR SYSTEM)
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

/* ==========================================
   📦 GET / SAVE
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
    if (!name) return;

    const employees = getEmployees();

    const newEmp = {
        id: Date.now(),
        name: name.trim(),
        group_id: groupId || null,
        vacationDays: toInt(vacationDays, 25)
    };

    employees.push(newEmp);
    saveEmployees(employees);
};

window.updateEmployee = function (id, name, groupId, vacationDays) {
    const employees = getEmployees();
    const emp = employees.find(e => e.id == id);
    if (!emp) return;

    if (name) emp.name = name.trim();
    if (groupId !== undefined) emp.group_id = groupId || null;
    if (vacationDays !== undefined) emp.vacationDays = toInt(vacationDays, 25);

    saveEmployees(employees);
};

window.deleteEmployeeById = function (id) {
    const employees = getEmployees().filter(e => e.id != id);
    saveEmployees(employees);
};

/* ==========================================
   📊 VACATION DAYS (PER YEAR 🔥)
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

        let current = new Date(start);

        while (current <= end) {

            const currentYear = current.getFullYear();

            if (!year || currentYear === year) {

                const day = current.getDay();

                if (!workdaysOnly || (day !== 0 && day !== 6)) {
                    total++;
                }
            }

            current.setDate(current.getDate() + 1);
        }
    });

    return total;
};

/* ==========================================
   🚨 VALIDATION (PER YEAR 🔥)
========================================== */

window.canAddVacation = function (employeeId, start, end) {
    const emp = getEmployees().find(e => e.id == employeeId);
    if (!emp) return true;

    const startDate = safeDate(start);
    const endDate = safeDate(end);
    if (!startDate || !endDate) return false;

    const year = startDate.getFullYear();

    const used = getUsedVacationDays(employeeId, year);

    let newDays = 0;
    let current = new Date(startDate);

    while (current <= endDate) {

        if (current.getFullYear() === year) {
            newDays++;
        }

        current.setDate(current.getDate() + 1);
    }

    return (used + newDays) <= (emp.vacationDays || 25);
};

/* ==========================================
   📊 BALANCE (PER YEAR)
========================================== */

window.getVacationBalance = function (employeeId, year = null) {
    const emp = getEmployees().find(e => e.id == employeeId);
    if (!emp) return null;

    const used = getUsedVacationDays(employeeId, year);
    const total = emp.vacationDays || 25;

    const percent = Math.min((used / total) * 100, 100);

    return {
        used,
        total,
        remaining: Math.max(total - used, 0),
        percent,
        year: year || new Date().getFullYear()
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

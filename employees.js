/* ==========================================
   👤 EMPLOYEES (FINAL PRO++ SYSTEM)
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
   📦 GET / SAVE (ROBUST)
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
   ➕ ADD EMPLOYEE
========================================== */

window.addEmployee = function (name, groupId = null, vacationDays = 25) {
    if (!name || typeof name !== "string") {
        console.warn("⚠️ Invalid employee name");
        return;
    }

    const employees = getEmployees();

    const newEmp = {
        id: Date.now(),
        name: name.trim(),
        group_id: groupId || null,
        vacationDays: toInt(vacationDays, 25)
    };

    employees.push(newEmp);
    saveEmployees(employees);

    console.log("✅ Employee added:", newEmp);
};

/* ==========================================
   ✏️ UPDATE EMPLOYEE
========================================== */

window.updateEmployee = function (id, name, groupId, vacationDays) {
    const employees = getEmployees();

    const emp = employees.find(e => e.id == id);
    if (!emp) return;

    if (name) emp.name = name.trim();

    if (groupId !== undefined) {
        emp.group_id = groupId || null;
    }

    if (vacationDays !== undefined) {
        emp.vacationDays = toInt(vacationDays, 25);
    }

    saveEmployees(employees);

    console.log("✏️ Updated:", emp);
};

/* ==========================================
   ❌ DELETE EMPLOYEE
========================================== */

window.deleteEmployeeById = function (id) {
    const employees = getEmployees();
    const filtered = employees.filter(e => e.id != id);

    saveEmployees(filtered);

    console.log(`🗑 Deleted employee ${id}`);
};

/* ==========================================
   📊 VACATION DAYS (SMART)
========================================== */

window.getUsedVacationDays = function (employeeId, options = {}) {
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

            const day = current.getDay(); // 0 = söndag

            if (!workdaysOnly || (day !== 0 && day !== 6)) {
                total++;
            }

            current.setDate(current.getDate() + 1);
        }
    });

    return total;
};

/* ==========================================
   🚨 VALIDATION (SMART)
========================================== */

window.canAddVacation = function (employeeId, start, end) {
    const emp = getEmployees().find(e => e.id == employeeId);
    if (!emp) return true;

    const startDate = safeDate(start);
    const endDate = safeDate(end);

    if (!startDate || !endDate) return false;

    const used = getUsedVacationDays(employeeId);

    let newDays = 0;
    let current = new Date(startDate);

    while (current <= endDate) {
        newDays++;
        current.setDate(current.getDate() + 1);
    }

    const max = emp.vacationDays || 25;

    return (used + newDays) <= max;
};

/* ==========================================
   📊 BALANCE (UI READY)
========================================== */

window.getVacationBalance = function (employeeId) {
    const emp = getEmployees().find(e => e.id == employeeId);
    if (!emp) return null;

    const used = getUsedVacationDays(employeeId);
    const total = emp.vacationDays || 25;

    const percent = Math.min((used / total) * 100, 100);

    return {
        used,
        total,
        remaining: Math.max(total - used, 0),
        percent
    };
};

/* ==========================================
   🎨 STATUS COLOR (UI HELPER)
========================================== */

window.getVacationStatusColor = function (percent) {
    if (percent > 90) return "#ef4444"; // red
    if (percent > 70) return "#f59e0b"; // orange
    return "#22c55e"; // green
};

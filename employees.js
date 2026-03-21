/* ==========================================
   👤 EMPLOYEES (FINAL PRO + VACATION SUPPORT)
========================================== */

const EMP_KEY = "employees";

/* ==========================================
   📦 GET / SAVE (SAFE)
========================================== */

window.getEmployees = function () {
    try {
        const data = JSON.parse(localStorage.getItem(EMP_KEY)) || [];

        // 🔥 säkerställ struktur (migrering)
        return data.map(emp => ({
            id: emp.id,
            name: emp.name || "Okänd",
            group_id: emp.group_id ?? null,
            vacationDays: parseInt(emp.vacationDays) || 25 // 🔥 default
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
   ➕ ADD EMPLOYEE (UPGRADED)
========================================== */

window.addEmployee = function (name, groupId = null, vacationDays = 25) {
    if (!name || typeof name !== "string") {
        console.warn("⚠️ Invalid employee name");
        return;
    }

    const employees = getEmployees();

    const newEmployee = {
        id: Date.now(),
        name: name.trim(),
        group_id: groupId || null,
        vacationDays: parseInt(vacationDays) || 25
    };

    employees.push(newEmployee);

    saveEmployees(employees);

    console.log("✅ Employee added:", newEmployee);
};

/* ==========================================
   ✏️ UPDATE EMPLOYEE (UPGRADED)
========================================== */

window.updateEmployee = function (id, name, groupId, vacationDays) {
    const employees = getEmployees();

    const emp = employees.find(e => e.id == id);
    if (!emp) {
        console.warn("⚠️ Employee not found:", id);
        return;
    }

    if (name && typeof name === "string") {
        emp.name = name.trim();
    }

    emp.group_id = groupId ?? emp.group_id;

    if (vacationDays !== undefined) {
        emp.vacationDays = parseInt(vacationDays) || 25;
    }

    saveEmployees(employees);

    console.log("✏️ Employee updated:", emp);
};

/* ==========================================
   ❌ DELETE EMPLOYEE
========================================== */

window.deleteEmployeeById = function (id) {
    let employees = getEmployees();

    const before = employees.length;

    employees = employees.filter(e => e.id != id);

    saveEmployees(employees);

    console.log(`🗑 Removed employee (${before} → ${employees.length})`);
};

/* ==========================================
   📊 VACATION STATS (CORE FEATURE)
========================================== */

window.getUsedVacationDays = function (employeeId) {
    const vacations = getVacations?.() || [];

    let total = 0;

    vacations.forEach(v => {
        if (v.employee_id != employeeId) return;

        const start = new Date(v.start);
        const end = new Date(v.end);

        if (isNaN(start) || isNaN(end)) return;

        const days = Math.floor(
            (end - start) / (1000 * 60 * 60 * 24)
        ) + 1;

        total += days;
    });

    return total;
};

/* ==========================================
   🚨 VALIDATION (BLOCK OVERBOOKING)
========================================== */

window.canAddVacation = function (employeeId, start, end) {
    const emp = getEmployees().find(e => e.id == employeeId);
    if (!emp) return true;

    const used = getUsedVacationDays(employeeId);

    const newDays = Math.floor(
        (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)
    ) + 1;

    const max = emp.vacationDays || 25;

    return (used + newDays) <= max;
};

/* ==========================================
   📊 HELPER (FOR UI)
========================================== */

window.getVacationBalance = function (employeeId) {
    const emp = getEmployees().find(e => e.id == employeeId);
    if (!emp) return null;

    const used = getUsedVacationDays(employeeId);
    const total = emp.vacationDays || 25;

    return {
        used,
        total,
        remaining: total - used
    };
};

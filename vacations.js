/* ==========================================
   📅 VACATIONS (STATE DRIVEN PRO MAX)
========================================== */

/* ==========================================
   🧠 STATE (MATCHAR EMPLOYEES 🔥)
========================================== */

window.AppState = window.AppState || {
    vacations: null
};

const VAC_KEY = "vacations";

/* ==========================================
   🛠 UTIL
========================================== */

function safeDate(date) {
    const d = new Date(date);
    return isNaN(d) ? null : d;
}

function toISO(date) {
    return date.toISOString().split("T")[0];
}

function iterateDays(start, end, cb) {
    const current = new Date(start);
    while (current <= end) {
        cb(new Date(current));
        current.setDate(current.getDate() + 1);
    }
}

/* ==========================================
   📦 LOAD / SAVE (STATE 🔥)
========================================== */

function loadVacations() {
    try {
        const raw = localStorage.getItem(VAC_KEY);
        if (!raw) return [];

        const data = JSON.parse(raw);

        return data.map(v => ({
            id: v.id,
            employee_id: v.employee_id,
            start: v.start,
            end: v.end
        }));

    } catch (err) {
        console.error("❌ loadVacations error:", err);
        return [];
    }
}

function persistVacations() {
    try {
        localStorage.setItem(VAC_KEY, JSON.stringify(AppState.vacations));
    } catch (err) {
        console.error("❌ persistVacations error:", err);
    }
}

/* ==========================================
   📦 PUBLIC API
========================================== */

window.getVacations = function () {
    if (!AppState.vacations) {
        AppState.vacations = loadVacations();
    }
    return AppState.vacations;
};

window.saveVacations = function (data) {
    AppState.vacations = data;
    persistVacations();
};

/* ==========================================
   🔍 CORE LOGIC (OPTIMIZED 🔥)
========================================== */

function hasConflict(empId, start, end, ignoreId = null) {
    const vacations = getVacations();

    return vacations.some(v =>
        v.employee_id == empId &&
        v.id != ignoreId &&
        !(end < v.start || start > v.end)
    );
}

function groupOverbooked(empId, start, end, ignoreId = null) {
    const employees = getEmployees();
    const groups = getGroups();
    const vacations = getVacations();

    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    const groupMap = Object.fromEntries(groups.map(g => [g.id, g]));

    const emp = empMap[empId];
    if (!emp || !emp.group_id) return false;

    const group = groupMap[emp.group_id];
    if (!group) return false;

    const max = parseInt(group.maxConcurrent) || 999;

    let count = 0;

    vacations.forEach(v => {
        if (v.id == ignoreId) return;

        const e = empMap[v.employee_id];
        if (!e || e.group_id != group.id) return;

        if (!(end < v.start || start > v.end)) {
            count++;
        }
    });

    return count >= max;
}

/* ==========================================
   🧠 VALIDATION ENGINE (🔥 CENTRAL)
========================================== */

function validateVacation(empId, start, end, ignoreId = null) {
    const startDate = safeDate(start);
    const endDate = safeDate(end);

    if (!empId || !startDate || !endDate) {
        return "Fyll i alla fält korrekt!";
    }

    if (endDate < startDate) {
        return "Slutdatum kan inte vara före startdatum";
    }

    if (hasConflict(empId, start, end, ignoreId)) {
        return "⚠️ Personen har redan semester här!";
    }

    if (groupOverbooked(empId, start, end, ignoreId)) {
        return "⚠️ För många i gruppen är lediga!";
    }

    if (!canAddVacation(empId, start, end)) {
        return "⚠️ För många semesterdagar detta år!";
    }

    return null;
}

/* ==========================================
   ➕ ADD VACATION
========================================== */

window.addVacation = function () {
    const empId = document.getElementById("employeeSelect")?.value;
    const start = document.getElementById("startDate")?.value;
    const end = document.getElementById("endDate")?.value;
    const warning = document.getElementById("warning");

    const error = validateVacation(empId, start, end);

    if (error) {
        if (warning) warning.textContent = error;
        return;
    }

    const vacations = getVacations();

    const newVac = {
        id: Date.now(),
        employee_id: empId,
        start,
        end
    };

    vacations.push(newVac);
    persistVacations();

    console.log("✅ Vacation added:", newVac);

    if (warning) warning.textContent = "";

    refreshCalendar?.();
};

/* ==========================================
   ❌ REMOVE VACATION
========================================== */

window.removeVacation = function (id) {
    AppState.vacations = getVacations().filter(v => v.id != id);
    persistVacations();

    refreshCalendar?.();
};

/* ==========================================
   ✏️ OPEN EDIT
========================================== */

window.openEditVacationModal = function (vacationId) {
    const vac = getVacations().find(v => v.id == vacationId);

    if (!vac) {
        alert("Kunde inte hitta semester");
        return;
    }

    document.getElementById("editVacationId").value = vac.id;
    document.getElementById("editStartDate").value = vac.start;
    document.getElementById("editEndDate").value = vac.end;

    openModal?.("editVacationModal");
};

/* ==========================================
   💾 UPDATE VACATION
========================================== */

window.updateVacation = function () {
    const id = document.getElementById("editVacationId").value;
    const start = document.getElementById("editStartDate")?.value;
    const end = document.getElementById("editEndDate")?.value;

    let vacations = getVacations();
    const current = vacations.find(v => v.id == id);

    if (!current) {
        alert("Semester saknas");
        return;
    }

    const error = validateVacation(current.employee_id, start, end, id);

    if (error) {
        alert(error);
        return;
    }

    vacations = vacations.map(v =>
        v.id == id ? { ...v, start, end } : v
    );

    persistVacations();

    console.log("✏️ Vacation updated:", id);

    closeModal?.("editVacationModal");
    refreshCalendar?.();
};

/* ==========================================
   🗑 DELETE
========================================== */

window.deleteVacationFromModal = function () {
    const id = document.getElementById("editVacationId").value;

    if (!confirm("Ta bort denna semester?")) return;

    removeVacation(id);

    closeModal?.("editVacationModal");
};

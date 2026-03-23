/* ==========================================
   📅 VACATIONS (PRODUCTION SAFE - IMPROVED)
========================================== */

/* ==========================================
   🧠 STATE
========================================== */

window.AppState = window.AppState || {};

if (!Array.isArray(window.AppState.vacations)) {
    window.AppState.vacations = null;
}

window.AppState.editingVacationId = null;

const VAC_KEY = "vacations";

/* ==========================================
   🛠 UTIL
========================================== */

function safeDate(date) {
    const d = new Date(date);
    return isNaN(d) ? null : d;
}

function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

function normalizeId(id) {
    return String(id);
}

/* ==========================================
   📦 LOAD / SAVE
========================================== */

function loadVacations() {
    try {
        const raw = localStorage.getItem(VAC_KEY);
        if (!raw) return [];

        const data = JSON.parse(raw);

        return data.map(v => ({
            id: v.id,
            employee_id: normalizeId(v.employee_id),
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
        localStorage.setItem(VAC_KEY, JSON.stringify(window.AppState.vacations));
        console.log("💾 vacations saved:", window.AppState.vacations.length);
    } catch (err) {
        console.error("❌ persistVacations error:", err);
    }
}

/* ==========================================
   📦 PUBLIC API
========================================== */

window.getVacations = function () {
    if (window.AppState.vacations === null) {
        window.AppState.vacations = loadVacations();
    }
    return window.AppState.vacations;
};

window.saveVacations = function (data) {
    if (!Array.isArray(data)) {
        console.error("❌ saveVacations: invalid data");
        return;
    }

    // 🔥 normalisera ID:n
    window.AppState.vacations = data.map(v => ({
        ...v,
        employee_id: normalizeId(v.employee_id)
    }));

    persistVacations();
};

/* ==========================================
   🔍 VALIDATION (FIXED)
========================================== */

function hasConflict(empId, start, end, ignoreId = null) {

    const empIdStr = normalizeId(empId);

    return getVacations().some(v => {

        const sameEmployee = normalizeId(v.employee_id) === empIdStr;

        if (!sameEmployee) return false;
        if (v.id == ignoreId) return false;

        const overlap = !(end < v.start || start > v.end);

        return overlap;
    });
}

function groupOverbooked(empId, start, end, ignoreId = null) {

    const employees = getEmployees();
    const groups = getGroups();
    const vacations = getVacations();

    const empMap = Object.fromEntries(employees.map(e => [normalizeId(e.id), e]));
    const groupMap = Object.fromEntries(groups.map(g => [g.id, g]));

    const emp = empMap[normalizeId(empId)];
    if (!emp || !emp.group_id) return false;

    const group = groupMap[emp.group_id];
    if (!group) return false;

    const max = parseInt(group.maxConcurrent) || 999;

    let count = 0;

    vacations.forEach(v => {

        if (v.id == ignoreId) return;

        const e = empMap[normalizeId(v.employee_id)];
        if (!e || e.group_id != group.id) return;

        const overlap = !(end < v.start || start > v.end);

        if (overlap) count++;
    });

    return count >= max;
}

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
   ➕ ADD
========================================== */

window.addVacation = function () {

    const empId = document.getElementById("employeeSelect")?.value;
    const start = document.getElementById("startDate")?.value;
    const end = document.getElementById("endDate")?.value;
    const warning = document.getElementById("warning");

    const editingId = window.AppState.editingVacationId;

    if (editingId) {
        return updateVacationFromForm(editingId, start, end);
    }

    const error = validateVacation(empId, start, end);

    if (error) {
        if (warning) warning.textContent = error;
        return;
    }

    const vacations = getVacations();

    const newVacation = {
        id: generateId(),
        employee_id: normalizeId(empId),
        start,
        end
    };

    const updated = [...vacations, newVacation];

    saveVacations(updated);

    window.HistoryManager?.push({
        type: "addVacation",
        payload: newVacation
    });

    if (warning) warning.textContent = "";

    refreshCalendar?.();

    return newVacation;
};

/* ==========================================
   ✏️ UPDATE
========================================== */

function updateVacationFromForm(id, start, end) {

    const vacations = getVacations();
    const current = vacations.find(v => v.id == id);

    if (!current) return;

    const error = validateVacation(current.employee_id, start, end, id);

    if (error) {
        alert(error);
        return;
    }

    const updatedVacation = {
        ...current,
        start,
        end
    };

    const updated = vacations.map(v =>
        v.id == id ? updatedVacation : v
    );

    saveVacations(updated);

    window.HistoryManager?.push({
        type: "updateVacation",
        payload: { before: current, after: updatedVacation }
    });

    window.AppState.editingVacationId = null;

    refreshCalendar?.();

    return updatedVacation;
}

/* ==========================================
   ❌ REMOVE
========================================== */

window.removeVacation = function (id) {

    const vacations = getVacations();
    const removed = vacations.find(v => v.id == id);

    const updated = vacations.filter(v => v.id != id);

    saveVacations(updated);

    window.HistoryManager?.push({
        type: "deleteVacation",
        payload: removed
    });

    refreshCalendar?.();
};

/* ==========================================
   🗑 DELETE FROM MODAL
========================================== */

window.deleteVacationFromModal = function () {

    const id = document.getElementById("editVacationId").value;

    if (!confirm("Ta bort denna semester?")) return;

    removeVacation(id);

    closeModal?.("editVacationModal");
};

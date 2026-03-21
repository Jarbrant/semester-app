/* ==========================================
   📅 VACATIONS (FINAL PRO+++ YEAR SAFE)
========================================== */

/* ==========================================
   🛠 HELPERS
========================================== */

function safeDate(date) {
    const d = new Date(date);
    return isNaN(d) ? null : d;
}

/* ==========================================
   🔍 CONFLICT CHECK
========================================== */

function hasConflict(empId, start, end, ignoreId = null) {
    const vacations = getVacations() || [];

    return vacations.some(v =>
        v.employee_id == empId &&
        v.id != ignoreId &&
        !(end < v.start || start > v.end)
    );
}

/* ==========================================
   👥 GROUP LIMIT CHECK
========================================== */

function groupOverbooked(empId, start, end, ignoreId = null) {
    const employees = getEmployees() || [];
    const groups = getGroups() || [];
    const vacations = getVacations() || [];

    const emp = employees.find(e => e.id == empId);
    if (!emp || !emp.group_id) return false;

    const group = groups.find(g => g.id == emp.group_id);
    if (!group) return false;

    const max = parseInt(group.maxConcurrent) || 999;

    let count = 0;

    vacations.forEach(v => {
        if (v.id == ignoreId) return;

        const e = employees.find(emp => emp.id == v.employee_id);
        if (!e || e.group_id != group.id) return;

        const overlap = !(end < v.start || start > v.end);
        if (overlap) count++;
    });

    return count >= max;
}

/* ==========================================
   ➕ ADD VACATION (UPGRADED)
========================================== */

window.addVacation = function () {
    const empId = document.getElementById("employeeSelect")?.value;
    const start = document.getElementById("startDate")?.value;
    const end = document.getElementById("endDate")?.value;
    const warning = document.getElementById("warning");

    const startDate = safeDate(start);
    const endDate = safeDate(end);

    if (!empId || !startDate || !endDate) {
        if (warning) warning.textContent = "Fyll i alla fält korrekt!";
        return;
    }

    if (endDate < startDate) {
        if (warning) warning.textContent = "Slutdatum kan inte vara före startdatum";
        return;
    }

    if (hasConflict(empId, start, end)) {
        if (warning) warning.textContent = "⚠️ Personen har redan semester här!";
        return;
    }

    if (groupOverbooked(empId, start, end)) {
        if (warning) warning.textContent = "⚠️ För många i gruppen är lediga!";
        return;
    }

    // 🔥 KRITISK: semester per år
    if (!canAddVacation(empId, start, end)) {
        if (warning) warning.textContent = "⚠️ För många semesterdagar detta år!";
        return;
    }

    if (warning) warning.textContent = "";

    const vacations = getVacations() || [];

    vacations.push({
        id: Date.now(),
        employee_id: empId,
        start,
        end
    });

    saveVacations(vacations);

    refreshCalendar?.();
};

/* ==========================================
   ❌ REMOVE VACATION
========================================== */

window.removeVacation = function (id) {
    let vacations = getVacations() || [];

    vacations = vacations.filter(v => v.id != id);

    saveVacations(vacations);

    refreshCalendar?.();
};

/* ==========================================
   ✏️ OPEN EDIT MODAL
========================================== */

window.openEditVacationModal = function (vacationId) {
    const vacations = getVacations() || [];

    const vac = vacations.find(v => v.id == vacationId);

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
   💾 UPDATE VACATION (UPGRADED)
========================================== */

window.updateVacation = function () {
    const id = document.getElementById("editVacationId").value;
    const start = document.getElementById("editStartDate")?.value;
    const end = document.getElementById("editEndDate")?.value;

    const startDate = safeDate(start);
    const endDate = safeDate(end);

    if (!startDate || !endDate) {
        alert("Datum saknas eller är felaktigt");
        return;
    }

    if (endDate < startDate) {
        alert("Slutdatum kan inte vara före startdatum");
        return;
    }

    let vacations = getVacations() || [];

    const current = vacations.find(v => v.id == id);
    if (!current) {
        alert("Semester saknas");
        return;
    }

    const empId = current.employee_id;

    if (hasConflict(empId, start, end, id)) {
        alert("⚠️ Personen har redan semester här!");
        return;
    }

    if (groupOverbooked(empId, start, end, id)) {
        alert("⚠️ För många i gruppen är lediga!");
        return;
    }

    // 🔥 KRITISK: semester per år även vid edit
    if (!canAddVacation(empId, start, end)) {
        alert("⚠️ För många semesterdagar detta år!");
        return;
    }

    vacations = vacations.map(v => {
        if (v.id == id) {
            return {
                ...v,
                start,
                end
            };
        }
        return v;
    });

    saveVacations(vacations);

    closeModal?.("editVacationModal");
    refreshCalendar?.();
};

/* ==========================================
   🗑 DELETE FROM MODAL
========================================== */

window.deleteVacationFromModal = function () {
    const id = document.getElementById("editVacationId").value;

    if (!confirm("Ta bort denna semester?")) return;

    removeVacation?.(id);

    closeModal?.("editVacationModal");
};

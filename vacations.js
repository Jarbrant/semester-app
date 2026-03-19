/* ==========================================
   📅 VACATIONS (MED GROUP LOGIK)
========================================== */

function hasConflict(empId, start, end) {
    const vacations = getVacations();

    return vacations.some(v =>
        v.employee_id == empId &&
        !(end < v.start || start > v.end)
    );
}

function groupOverbooked(empId, start, end) {
    const employees = getEmployees();
    const groups = getGroups();
    const vacations = getVacations();

    const emp = employees.find(e => e.id == empId);
    if (!emp || !emp.group_id) return false;

    const group = groups.find(g => g.id == emp.group_id);
    if (!group) return false;

    let count = 0;

    vacations.forEach(v => {
        const e = employees.find(emp => emp.id == v.employee_id);
        if (!e || e.group_id != group.id) return;

        const overlap = !(end < v.start || start > v.end);
        if (overlap) count++;
    });

    return count >= group.maxConcurrent;
}

window.addVacation = function() {
    const empId = document.getElementById("employeeSelect").value;
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;
    const warning = document.getElementById("warning");

    if (!empId || !start || !end) return;

    if (hasConflict(empId, start, end)) {
        warning.textContent = "⚠️ Personen har redan semester här!";
        return;
    }

    if (groupOverbooked(empId, start, end)) {
        warning.textContent = "⚠️ För många i gruppen är lediga!";
        return;
    }

    warning.textContent = "";

    const vacations = getVacations();

    vacations.push({
        id: Date.now(),
        employee_id: empId,
        start,
        end
    });

    saveVacations(vacations);
    refreshCalendar();
};

window.removeVacation = function(id) {
    let vacations = getVacations();

    vacations = vacations.filter(v => v.id != id);

    saveVacations(vacations);
    refreshCalendar();
};

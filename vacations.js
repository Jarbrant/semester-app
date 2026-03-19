/* ==========================================
   📅 VACATIONS (MED KONFLIKT-CHECK)
========================================== */

function hasConflict(empId, start, end) {
    const vacations = getVacations();

    return vacations.some(v =>
        v.employee_id == empId &&
        !(end < v.start || start > v.end)
    );
}

window.addVacation = function() {
    const empId = document.getElementById("employeeSelect").value;
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;
    const warning = document.getElementById("warning");

    if (!empId || !start || !end) return;

    // 🔥 Konflikt-check
    if (hasConflict(empId, start, end)) {
        if (warning) {
            warning.textContent = "⚠️ Denna person har redan semester i detta intervall!";
        }
        return;
    }

    if (warning) warning.textContent = "";

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

/* ==========================================
   ❌ DELETE
========================================== */

window.removeVacation = function(id) {
    let vacations = getVacations();

    vacations = vacations.filter(v => v.id != id);

    saveVacations(vacations);
    refreshCalendar();
};

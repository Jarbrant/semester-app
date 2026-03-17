window.addVacation = function() {
    const empId = document.getElementById("employeeSelect").value;
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;

    if (!empId || !start || !end) return;

    const vacations = getVacations();

    vacations.push({
        id: Date.now(),
        employee_id: empId,
        start,
        end
    });

    saveVacations(vacations);
    renderCalendar();
};

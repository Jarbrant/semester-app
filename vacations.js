// ==========================================
// 📅 VACATIONS MODULE (PRO VERSION)
// ==========================================

// ➕ Lägg till semester
window.addVacation = function () {
    const empSelect = document.getElementById("employeeSelect");
    const startInput = document.getElementById("startDate");
    const endInput = document.getElementById("endDate");
    const warning = document.getElementById("warning");

    // säkerhetscheck
    if (!empSelect || !startInput || !endInput) {
        console.error("Semester-inputs saknas i DOM");
        return;
    }

    const empId = empSelect.value;
    const start = startInput.value;
    const end = endInput.value;

    // validering
    if (!empId || !start || !end) {
        alert("Fyll i alla fält");
        return;
    }

    if (start > end) {
        alert("Startdatum kan inte vara efter slutdatum");
        return;
    }

    const vacations = getVacations();

    // 🔥 konfliktkontroll (max 3 personer samtidigt)
    const overlap = vacations.filter(v =>
        start <= v.end && end >= v.start
    );

    if (overlap.length >= 3) {
        if (warning) {
            warning.innerText = "⚠️ För många är redan lediga!";
        }
        return;
    }

    // rensa varning
    if (warning) warning.innerText = "";

    // spara
    vacations.push({
        id: Date.now(),
        employee_id: empId,
        start,
        end
    });

    saveVacations(vacations);

    // rensa inputs
    startInput.value = "";
    endInput.value = "";

    // uppdatera UI
    if (typeof renderCalendar === "function") {
        renderCalendar();
    }
};

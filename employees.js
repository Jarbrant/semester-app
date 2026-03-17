// ==========================================
// 👥 EMPLOYEES MODULE (PRO VERSION)
// ==========================================

// ➕ Lägg till personal
window.addEmployee = function () {
    const input = document.getElementById("employeeName");

    // säkerhetscheck
    if (!input) {
        console.error("employeeName input saknas");
        return;
    }

    const name = input.value.trim();

    if (!name) {
        alert("Ange ett namn");
        return;
    }

    const employees = getEmployees();

    employees.push({
        id: Date.now(),
        name: name
    });

    saveEmployees(employees);

    // rensa input
    input.value = "";

    // uppdatera UI
    loadEmployees();

    // 🔥 viktigt: uppdatera kalender direkt
    if (typeof renderCalendar === "function") {
        renderCalendar();
    }
};

// 🔄 Ladda personal i dropdown + filter
window.loadEmployees = function () {
    const employees = getEmployees();

    const select = document.getElementById("employeeSelect");
    const filter = document.getElementById("filter");

    // säkerhetscheck
    if (!select || !filter) {
        console.warn("employeeSelect eller filter saknas i DOM");
        return;
    }

    // reset
    select.innerHTML = "";
    filter.innerHTML = '<option value="all">Visa alla</option>';

    // fyll data
    employees.forEach(emp => {
        const option1 = `<option value="${emp.id}">${emp.name}</option>`;
        const option2 = `<option value="${emp.id}">${emp.name}</option>`;

        select.innerHTML += option1;
        filter.innerHTML += option2;
    });
};

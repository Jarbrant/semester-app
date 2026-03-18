/* ==========================================
   👥 EMPLOYEES
========================================== */

window.addEmployee = function() {
    const name = document.getElementById("employeeName").value.trim();
    if (!name) return;

    const employees = getEmployees();

    // 🎨 slumpfärg per person
    const color = "#" + Math.floor(Math.random()*16777215).toString(16);

    employees.push({
        id: Date.now(),
        name,
        color
    });

    saveEmployees(employees);
    loadEmployees();
    renderCalendar();
};

// 🔹 fyll dropdown
window.loadEmployees = function() {
    const employees = getEmployees();

    const select = document.getElementById("employeeSelect");
    const filter = document.getElementById("filter");

    if (!select || !filter) return;

    select.innerHTML = "";
    filter.innerHTML = '<option value="all">Alla</option>';

    employees.forEach(e => {
        select.innerHTML += `<option value="${e.id}">${e.name}</option>`;
        filter.innerHTML += `<option value="${e.id}">${e.name}</option>`;
    });
};

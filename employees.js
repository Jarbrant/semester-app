window.addEmployee = function() {
    const input = document.getElementById("employeeName");
    if (!input) return;

    const name = input.value.trim();
    if (!name) return;

    const employees = getEmployees();
    employees.push({ id: Date.now(), name });

    saveEmployees(employees);
    input.value = "";

    loadEmployees();
};

window.loadEmployees = function() {
    const employees = getEmployees();

    const select = document.getElementById("employeeSelect");
    const filter = document.getElementById("filter");

    if (!select || !filter) return;

    select.innerHTML = "";
    filter.innerHTML = '<option value="all">Visa alla</option>';

    employees.forEach(emp => {
        select.innerHTML += `<option value="${emp.id}">${emp.name}</option>`;
        filter.innerHTML += `<option value="${emp.id}">${emp.name}</option>`;
    });
};

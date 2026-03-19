/* ==========================================
   👤 EMPLOYEES (MED GROUP SUPPORT)
========================================== */

const EMP_KEY = "employees";

window.getEmployees = function () {
    return JSON.parse(localStorage.getItem(EMP_KEY)) || [];
};

window.saveEmployees = function (emps) {
    localStorage.setItem(EMP_KEY, JSON.stringify(emps));
};

window.addEmployee = function (name, groupId = null) {
    const employees = getEmployees();

    employees.push({
        id: Date.now(),
        name,
        group_id: groupId
    });

    saveEmployees(employees);
};

window.updateEmployee = function (id, name, groupId) {
    const employees = getEmployees();

    const emp = employees.find(e => e.id == id);
    if (!emp) return;

    emp.name = name;
    emp.group_id = groupId;

    saveEmployees(employees);
};

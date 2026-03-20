/* ==========================================
   🧩 GROUP UI
========================================== */

window.tryAddGroup = function () {
    const name = document.getElementById("groupName")?.value?.trim();
    const color = document.getElementById("groupColor")?.value;
    const limit = document.getElementById("groupLimit")?.value;
    const warning = document.getElementById("groupWarning");

    if (!name) {
        if (warning) warning.textContent = "Ange gruppnamn";
        return;
    }

    addGroup?.(name, color, limit || 1);

    if (warning) warning.textContent = "";
    closeModal();
};

/* ==========================================
   🔽 GROUP SELECT
========================================== */

window.refreshGroupSelect = function () {
    const select = document.getElementById("employeeGroupSelect");
    if (!select) return;

    const groups = getGroups?.() || [];

    select.innerHTML = "";

    if (!groups.length) {
        select.innerHTML = "<option>Inga grupper</option>";
        return;
    }

    groups.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g.id;
        opt.textContent = `${g.name} (max ${g.maxConcurrent})`;
        select.appendChild(opt);
    });
};

/* ==========================================
   👤 EMPLOYEE ADD
========================================== */

window.tryAddEmployee = function () {
    const name = document.getElementById("employeeName")?.value?.trim();
    const groupId = document.getElementById("employeeGroupSelect")?.value;
    const warning = document.getElementById("employeeWarning");

    if (!name) {
        if (warning) warning.textContent = "Du måste ange ett namn!";
        return;
    }

    addEmployee?.(name, groupId || null);

    closeModal();
    renderEmployeeList();
};

/* ==========================================
   🔄 EMPLOYEE LIST (EDIT/DELETE)
========================================== */

window.renderEmployeeList = function () {
    const list = document.getElementById("employeeList");
    if (!list) return;

    const employees = getEmployees?.() || [];

    list.innerHTML = "";

    employees.forEach(emp => {
        const li = document.createElement("li");
        li.style.cursor = "pointer";
        li.textContent = emp.name;

        li.onclick = () => openEditEmployee(emp.id);

        list.appendChild(li);
    });
};

window.openEditEmployee = function (id) {
    const emp = getEmployees().find(e => e.id == id);
    if (!emp) return;

    document.getElementById("editEmployeeName").value = emp.name;
    document.getElementById("editEmployeeId").value = emp.id;

    openModal("editEmployeeModal");
};

window.saveEmployeeEdit = function () {
    const id = document.getElementById("editEmployeeId").value;
    const name = document.getElementById("editEmployeeName").value;

    const employees = getEmployees();

    const emp = employees.find(e => e.id == id);
    if (emp) emp.name = name;

    saveEmployees(employees);

    closeModal();
    renderEmployeeList();
    refreshEmployeeSelect();
};

window.deleteEmployee = function () {
    const id = document.getElementById("editEmployeeId").value;

    let employees = getEmployees();
    employees = employees.filter(e => e.id != id);

    saveEmployees(employees);

    closeModal();
    renderEmployeeList();
    refreshEmployeeSelect();
};

/* ==========================================
   📅 EMPLOYEE SELECT + SEARCH
========================================== */

window.refreshEmployeeSelect = function (filter = "") {
    const select = document.getElementById("employeeSelect");
    if (!select) return;

    const employees = getEmployees?.() || [];

    const filtered = employees.filter(e =>
        e.name.toLowerCase().includes(filter.toLowerCase())
    );

    select.innerHTML = "";

    filtered.forEach(emp => {
        const opt = document.createElement("option");
        opt.value = emp.id;
        opt.textContent = emp.name;
        select.appendChild(opt);
    });
};

/* ==========================================
   📅 VACATION
========================================== */

window.trySubmitVacation = function () {
    const emp = document.getElementById("employeeSelect")?.value;
    const start = document.getElementById("startDate")?.value;
    const end = document.getElementById("endDate")?.value;

    if (!emp || !start || !end) return;

    addVacation?.();
    closeModal();
};

/* ==========================================
   🪟 MODAL
========================================== */

window.openModal = function (id) {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove("active"));

    const modal = document.getElementById(id);
    const overlay = document.getElementById("modalOverlay");

    if (!modal || !overlay) return;

    modal.classList.add("active");
    overlay.style.display = "block";

    if (id === "employeeModal") {
        refreshGroupSelect();
        renderEmployeeList();
    }

    if (id === "vacationModal") {
        refreshEmployeeSelect();
        document.getElementById("employeeSearch").value = "";
    }
};

window.closeModal = function () {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove("active"));
    document.getElementById("modalOverlay").style.display = "none";
};

/* ==========================================
   🔍 SEARCH
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("employeeSearch")?.addEventListener("input", e => {
        refreshEmployeeSelect(e.target.value);
    });

    document.getElementById("modalOverlay")?.addEventListener("click", closeModal);

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });

});

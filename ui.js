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
   🔄 EMPLOYEE LIST
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
   📅 EMPLOYEE SELECT + SEARCH (FIXAD)
========================================== */

window.refreshEmployeeSelect = function (filter = "") {
    const select = document.getElementById("employeeSelect");
    if (!select) return;

    const employees = getEmployees?.() || [];

    const filtered = employees.filter(e =>
        e.name.toLowerCase().includes(filter.toLowerCase())
    );

    select.innerHTML = "";

    if (!filtered.length) {
        const opt = document.createElement("option");
        opt.textContent = "Ingen match";
        opt.value = "";
        select.appendChild(opt);
        return;
    }

    filtered.forEach(emp => {
        const opt = document.createElement("option");
        opt.value = emp.id;
        opt.textContent = emp.name;
        select.appendChild(opt);
    });

    // 🔥 KRITISK FIX
    select.selectedIndex = 0;
};

/* ==========================================
   📅 VACATION (FIXAD)
========================================== */

window.trySubmitVacation = function () {
    const select = document.getElementById("employeeSelect");
    const emp = select?.value;
    const start = document.getElementById("startDate")?.value;
    const end = document.getElementById("endDate")?.value;
    const warning = document.getElementById("warning");

    if (!emp || !start || !end) {
        if (warning) warning.textContent = "Fyll i alla fält!";
        return;
    }

    if (warning) warning.textContent = "";

    console.log("Saving:", emp, start, end); // debug

    addVacation?.();

    closeModal();
};

/* ==========================================
   🪟 MODAL (FIXAD ORDNING)
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
        // 🔥 FIX: reset search FÖRST
        const search = document.getElementById("employeeSearch");
        if (search) search.value = "";

        // 🔥 SEN refresh
        refreshEmployeeSelect("");
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

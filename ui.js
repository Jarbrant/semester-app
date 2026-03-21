/* ==========================================
   🧩 GROUP UI (UPGRADED)
========================================== */

window.tryAddGroup = function () {
    const name = document.getElementById("groupName")?.value?.trim();
    const color = document.getElementById("groupColor")?.value;
    const limit = parseInt(document.getElementById("groupLimit")?.value) || 1;
    const warning = document.getElementById("groupWarning");

    if (!name) {
        if (warning) warning.textContent = "Ange gruppnamn";
        return;
    }

    addGroup?.(name, color, limit);

    if (warning) warning.textContent = "";

    // 🔥 reset inputs
    document.getElementById("groupName").value = "";
    document.getElementById("groupLimit").value = "";

    closeModal("groupModal");
};

/* ==========================================
   🔽 GROUP SELECT (UPGRADED)
========================================== */

window.refreshGroupSelect = function () {
    const select = document.getElementById("employeeGroupSelect");
    if (!select) return;

    const groups = getGroups?.() || [];

    select.innerHTML = "";

    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "Ingen grupp";
    select.appendChild(defaultOpt);

    groups.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g.id;
        opt.textContent = `${g.name} (max ${g.maxConcurrent})`;
        select.appendChild(opt);
    });
};

/* ==========================================
   👤 EMPLOYEE ADD (UPGRADED)
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

    if (warning) warning.textContent = "";

    // 🔥 reset input
    document.getElementById("employeeName").value = "";

    renderEmployeeList();
    refreshEmployeeSelect();

    closeModal("employeeModal");
};

/* ==========================================
   🔄 EMPLOYEE LIST (UPGRADED)
========================================== */

window.renderEmployeeList = function () {
    const list = document.getElementById("employeeList");
    if (!list) return;

    const employees = getEmployees?.() || [];
    const groups = getGroups?.() || [];

    list.innerHTML = "";

    employees.forEach(emp => {
        const li = document.createElement("li");

        const group = groups.find(g => g.id == emp.group_id);

        li.style.cursor = "pointer";
        li.style.padding = "6px 10px";
        li.style.borderRadius = "8px";
        li.style.marginBottom = "4px";

        li.innerHTML = `
            <span>${emp.name}</span>
            ${group ? `<small style="color:#6b7280"> (${group.name})</small>` : ""}
        `;

        li.onclick = () => openEditEmployee(emp.id);

        list.appendChild(li);
    });
};

/* ==========================================
   ✏️ EDIT EMPLOYEE (UPGRADED)
========================================== */

window.openEditEmployee = function (id) {
    const emp = getEmployees().find(e => e.id == id);
    if (!emp) return;

    document.getElementById("editEmployeeName").value = emp.name;
    document.getElementById("editEmployeeId").value = emp.id;

    openModal("editEmployeeModal");
};

window.saveEmployeeEdit = function () {
    const id = document.getElementById("editEmployeeId").value;
    const name = document.getElementById("editEmployeeName").value?.trim();

    if (!name) return;

    const employees = getEmployees();
    const emp = employees.find(e => e.id == id);

    if (emp) emp.name = name;

    saveEmployees(employees);

    closeModal("editEmployeeModal");

    renderEmployeeList();
    refreshEmployeeSelect();
    refreshCalendar?.();
};

window.deleteEmployee = function () {
    const id = document.getElementById("editEmployeeId").value;

    if (!confirm("Ta bort denna person?")) return;

    let employees = getEmployees();
    employees = employees.filter(e => e.id != id);

    saveEmployees(employees);

    closeModal("editEmployeeModal");

    renderEmployeeList();
    refreshEmployeeSelect();
    refreshCalendar?.();
};

/* ==========================================
   📅 EMPLOYEE SELECT + SEARCH (STABIL)
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

    select.selectedIndex = 0;
};

/* ==========================================
   📅 VACATION (CLEAN FIX)
========================================== */

window.trySubmitVacation = function () {
    const emp = document.getElementById("employeeSelect")?.value;
    const start = document.getElementById("startDate")?.value;
    const end = document.getElementById("endDate")?.value;
    const warning = document.getElementById("warning");

    if (!emp || !start || !end) {
        if (warning) warning.textContent = "Fyll i alla fält!";
        return;
    }

    if (warning) warning.textContent = "";

    addVacation?.();

    closeModal("vacationModal");
};

/* ==========================================
   🪟 MODAL (PRO VERSION)
========================================== */

window.openModal = function (id) {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove("active"));

    const modal = document.getElementById(id);
    const overlay = document.getElementById("modalOverlay");

    if (!modal || !overlay) return;

    modal.classList.add("active");
    overlay.style.display = "block";

    // 🔥 smart init
    if (id === "employeeModal") {
        refreshGroupSelect();
        renderEmployeeList();
    }

    if (id === "vacationModal") {
        const search = document.getElementById("employeeSearch");
        if (search) search.value = "";

        refreshEmployeeSelect("");
    }
};

window.closeModal = function (id) {
    if (id) {
        document.getElementById(id)?.classList.remove("active");
    } else {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove("active"));
    }

    document.getElementById("modalOverlay").style.display = "none";
};

/* ==========================================
   🔍 SEARCH + GLOBAL UX
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("employeeSearch")?.addEventListener("input", e => {
        refreshEmployeeSelect(e.target.value);
    });

    document.getElementById("modalOverlay")?.addEventListener("click", () => closeModal());

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });

});
